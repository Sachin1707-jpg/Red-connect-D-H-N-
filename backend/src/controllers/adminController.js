const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const DonationHistory = require('../models/DonationHistory');

// GET /api/admin/users
const listUsers = async (req, res, next) => {
  try {
    const { role, verified, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (verified !== undefined) query.verified = verified === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/users/:id/verify
const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.verified = req.body.verified !== undefined ? req.body.verified : true;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} verification status updated to ${user.verified}`,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalDonors, totalHospitals, totalNgos, totalRequests, openRequests, fulfilledRequests] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'donor' }),
        User.countDocuments({ role: 'hospital' }),
        User.countDocuments({ role: 'ngo' }),
        BloodRequest.countDocuments(),
        BloodRequest.countDocuments({ status: 'open' }),
        BloodRequest.countDocuments({ status: 'fulfilled' }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDonors,
        totalHospitals,
        totalNgos,
        totalRequests,
        openRequests,
        fulfilledRequests,
        fulfillmentRate: totalRequests > 0 ? `${Math.round((fulfilledRequests / totalRequests) * 100)}%` : '0%',
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { listUsers, verifyUser, getStats };
