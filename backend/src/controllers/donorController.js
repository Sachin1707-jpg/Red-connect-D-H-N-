const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const { sendBloodEmergencySMS } = require('../services/notificationService');

// GET /api/donors/me
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/donors/me
const updateMe = async (req, res, next) => {
  try {
    const allowedUpdates = [
      'name', 'bloodGroup', 'isAvailable', 'profileVisibility', 'city', 'address',
      'location', 'gender', 'dob', 'weight', 'emergencyContact',
      'medicalHistory', 'fcmToken', 'lastDonationDate'
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/donors/:id
const getDonorById = async (req, res, next) => {
  try {
    const donor = await User.findById(req.params.id).select(
      'name bloodGroup isAvailable profileVisibility city donationCount livesSaved rewardPoints avatar createdAt'
    );

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    if (donor.profileVisibility === 'private') {
      return res.status(403).json({
        success: false,
        message: 'This donor profile is set to Private by the user.',
        isPrivate: true,
      });
    }

    res.status(200).json({
      success: true,
      data: donor,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/donors/:donorId/notify OR POST /api/donors/notify
const notifyDonorSMS = async (req, res, next) => {
  try {
    const donorId = req.params.donorId || req.body.donorId;
    const {
      requestId,
      donorPhone: reqDonorPhone,
      donorName: reqDonorName,
      bloodGroup: reqBloodGroup,
      unitsRequired: reqUnitsRequired,
      hospitalName: reqHospitalName,
      hospitalLocation: reqHospitalLocation,
      hospitalContact: reqHospitalContact,
      mapsUrl: reqMapsUrl,
    } = req.body;

    if (!donorId && !reqDonorPhone) {
      return res.status(400).json({
        success: false,
        message: 'Donor ID or donor phone number is required',
        notificationStatus: 'failed',
      });
    }

    // Attempt DB lookup if valid ObjectId
    let donor = null;
    if (donorId && donorId.match(/^[0-9a-fA-F]{24}$/)) {
      donor = await User.findById(donorId);
    }

    let bloodReq = null;
    if (requestId && requestId.match(/^[0-9a-fA-F]{24}$/)) {
      bloodReq = await BloodRequest.findById(requestId);
    }

    // Resolve details (DB values preferred, frontend fallback supported)
    const donorName = donor?.name || reqDonorName || 'Valued Donor';
    const donorPhone = donor?.phone || reqDonorPhone;
    const bloodGroup = bloodReq?.bloodGroup || reqBloodGroup || 'O+';
    const unitsRequired = bloodReq?.unitsNeeded || reqUnitsRequired || 1;
    const hospitalName = bloodReq?.hospital?.name || reqHospitalName || 'AIIMS New Delhi';
    const hospitalLocation = bloodReq?.hospital?.address || reqHospitalLocation || 'Ansari Nagar, New Delhi';
    const hospitalContact = bloodReq?.hospital?.contact || reqHospitalContact || '+91-11-26588500';
    const mapsUrl = reqMapsUrl || 'https://maps.google.com/?q=AIIMS+New+Delhi';

    if (!donorPhone) {
      return res.status(400).json({
        success: false,
        message: 'No phone number available for the selected donor',
        notificationStatus: 'failed',
      });
    }

    const result = await sendBloodEmergencySMS({
      donorPhone,
      donorName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      hospitalLocation,
      hospitalContact,
      mapsUrl,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: `SMS notification sent successfully to ${donorName}`,
        donorId: donorId || 'mock_donor',
        requestId: requestId || 'mock_req',
        sid: result.sid,
        status: result.status || 'queued',
        errorCode: result.errorCode || null,
        errorMessage: result.errorMessage || null,
        notificationStatus: 'sent',
      });
    } else {
      return res.status(result.status || 400).json({
        success: false,
        message: result.error || result.errorMessage || 'Failed to send SMS notification',
        errorCode: result.errorCode || null,
        errorMessage: result.errorMessage || result.error,
        notificationStatus: 'failed',
      });
    }
  } catch (err) {
    console.error('[notifyDonorSMS Controller Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error while sending SMS notification',
      notificationStatus: 'failed',
      error: err.message,
    });
  }
};

module.exports = { getMe, updateMe, getDonorById, notifyDonorSMS };

