const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOtp, verifyOtp } = require('../utils/otpGenerator');
const { sendSms } = require('../services/notificationService');

const generateTokens = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
  return { token, refreshToken };
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, phone, email, password, role, bloodGroup, city, location, ...rest } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Phone number already registered',
      });
    }

    const { otp, hashedOtp, expiry } = await generateOtp();

    const user = new User({
      name,
      phone,
      email,
      password,
      role: role || 'donor',
      bloodGroup: bloodGroup || null,
      city: city || '',
      location: location || { type: 'Point', coordinates: [0, 0] },
      otp: hashedOtp,
      otpExpiry: expiry,
      verified: false,
      ...rest,
    });

    await user.save();

    // Send OTP via SMS
    await sendSms({
      to: phone,
      message: `Your RedConnect verification code is: ${otp}. Valid for 10 minutes.`,
    });

    const { token, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully. OTP sent to phone.',
      token,
      refreshToken,
      user,
      otpDemo: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/verify-otp
const verifyPhoneOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone }).select('+otp +otpExpiry');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.otp || !user.otpExpiry || Date.now() > user.otpExpiry.getTime()) {
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    }

    const isMatch = await verifyOtp(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Phone number verified successfully',
      user,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password, fcmToken } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const { token, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    if (fcmToken) user.fcmToken = fcmToken;
    await user.save();

    const userObj = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: userObj,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      token: tokens.token,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    if (req.user) {
      req.user.refreshToken = undefined;
      req.user.fcmToken = undefined;
      await req.user.save();
    }
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, verifyPhoneOtp, login, refresh, logout };
