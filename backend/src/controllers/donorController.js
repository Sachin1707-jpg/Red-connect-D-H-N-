const User = require('../models/User');

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
      'name', 'bloodGroup', 'isAvailable', 'city', 'address',
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
      'name bloodGroup isAvailable city donationCount livesSaved rewardPoints avatar createdAt'
    );

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    res.status(200).json({
      success: true,
      data: donor,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe, updateMe, getDonorById };
