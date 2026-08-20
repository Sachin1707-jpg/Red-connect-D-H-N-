const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized — no token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' });
      }
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const user = await User.findById(decoded.id).select('-password -otp -otpExpiry -refreshToken');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token || token === 'demo_token') {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password -otp -otpExpiry -refreshToken');
      if (user) {
        req.user = user;
      }
    } catch (e) {
      // Ignore token verification errors for optionalAuth
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect, optionalAuth };
