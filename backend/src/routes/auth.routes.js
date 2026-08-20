const express = require('express');
const router = express.Router();
const { register, verifyPhoneOtp, login, googleAuth, refresh, logout } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { registerValidator, loginValidator, verifyOtpValidator, refreshValidator } = require('../middlewares/validators/auth');
const { validate } = require('../middlewares/validators/validate');
const { authLimiter, otpLimiter } = require('../middlewares/rateLimiter');

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/verify-otp', otpLimiter, verifyOtpValidator, validate, verifyPhoneOtp);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/google', googleAuth);
router.post('/refresh', refreshValidator, validate, refresh);
router.post('/logout', protect, logout);

module.exports = router;
