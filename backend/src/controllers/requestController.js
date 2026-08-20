const BloodRequest = require('../models/BloodRequest');
const DonationHistory = require('../models/DonationHistory');
const User = require('../models/User');
const { findEligibleDonors } = require('../services/matchingService');
const { enqueueNotification } = require('../services/queueWorker');
const { kmToMetres } = require('../utils/geoHelpers');

// POST /api/requests
const createRequest = async (req, res, next) => {
  try {
    const { patientName, bloodGroup, unitsNeeded, urgency, hospital, description, requiredDate } = req.body;

    const newRequest = new BloodRequest({
      requesterId: req.user._id,
      patientName,
      bloodGroup,
      unitsNeeded,
      urgency: urgency || 'urgent',
      hospital,
      description,
      requiredDate: requiredDate ? new Date(requiredDate) : null,
    });

    await newRequest.save();

    // Trigger matching service asynchronously
    findEligibleDonors(newRequest)
      .then(async (donors) => {
        if (donors.length > 0) {
          const matchedList = donors.map((d) => ({
            donorId: d._id,
            status: 'notified',
          }));
          newRequest.matchedDonors = matchedList;
          await newRequest.save();

          const donorIds = donors.map((d) => String(d._id));
          await enqueueNotification({ requestId: newRequest._id, donorIds });
        }
      })
      .catch((err) => console.error('[Request Matching Error]', err));

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully. Donor matching initiated.',
      data: newRequest,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/requests/nearby
const getNearbyRequests = async (req, res, next) => {
  try {
    const { lng, lat, maxDistanceKm = 50, bloodGroup, urgency } = req.query;

    const query = {
      status: { $in: ['open', 'Active', 'active'] },
    };

    if (lng && lat) {
      const coords = [parseFloat(lng), parseFloat(lat)];
      query['hospital.location'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: coords },
          $maxDistance: kmToMetres(parseFloat(maxDistanceKm)),
        },
      };
    }

    if (bloodGroup && bloodGroup !== 'ALL') {
      query.bloodGroup = bloodGroup;
    }
    if (urgency && urgency !== 'ALL') {
      query.urgency = urgency.toLowerCase();
    }

    let queryExec = BloodRequest.find(query).populate('requesterId', 'name phone email role');
    if (!lng || !lat) {
      queryExec = queryExec.sort({ createdAt: -1 });
    }

    const requests = await queryExec;

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/requests/:id
const getRequestById = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('requesterId', 'name phone email role')
      .populate('matchedDonors.donorId', 'name bloodGroup location city phone');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/requests/:id/matches
const getRequestMatches = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id).populate(
      'matchedDonors.donorId',
      'name bloodGroup location city phone avatar'
    );

    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    res.status(200).json({
      success: true,
      data: request.matchedDonors,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/requests/:id/respond
const respondToRequest = async (req, res, next) => {
  try {
    const { status } = req.body; // 'accepted' or 'declined'
    const donorId = req.user._id;

    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    const matchIndex = request.matchedDonors.findIndex(
      (m) => m.donorId.toString() === donorId.toString()
    );

    if (matchIndex === -1) {
      request.matchedDonors.push({
        donorId,
        status,
        respondedAt: new Date(),
      });
    } else {
      request.matchedDonors[matchIndex].status = status;
      request.matchedDonors[matchIndex].respondedAt = new Date();
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: `Request status updated to ${status}`,
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/requests/:id/fulfill
const fulfillRequest = async (req, res, next) => {
  try {
    const { donorIds = [] } = req.body; // array of donor user IDs who donated

    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    request.status = 'fulfilled';
    request.unitsFulfilled = request.unitsNeeded;
    await request.save();

    // Create DonationHistory entries for donors
    const donationEntries = [];
    for (const donorId of donorIds) {
      const history = new DonationHistory({
        donorId,
        requestId: request._id,
        donatedAt: new Date(),
        location: request.hospital.name,
        bloodGroup: request.bloodGroup,
        verifiedBy: req.user._id,
        pointsAwarded: 100,
        status: 'Verified',
      });
      await history.save();
      donationEntries.push(history);

      // Update donor profile stats
      await User.findByIdAndUpdate(donorId, {
        $set: { lastDonationDate: new Date() },
        $inc: { donationCount: 1, livesSaved: 3, rewardPoints: 100 },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blood request marked as fulfilled and donation histories created.',
      data: request,
      donations: donationEntries,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/requests/:id
const cancelRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    if (request.requesterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this request' });
    }

    request.status = 'cancelled';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Blood request cancelled successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRequest,
  getNearbyRequests,
  getRequestById,
  getRequestMatches,
  respondToRequest,
  fulfillRequest,
  cancelRequest,
};
