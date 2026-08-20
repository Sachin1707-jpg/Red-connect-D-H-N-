const rateLimit = require('express-rate-limit');

// ── Auth rate limiter (OTP spam prevention) ────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many auth attempts — please try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── OTP-specific limiter (stricter) ───────────────────────────────────────────
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: { success: false, message: 'Too many OTP requests — please wait 10 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Blood request creation limiter (5/hour/user) ─────────────────────────────
const requestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  keyGenerator: (req) => req.user?.id || req.ip, // Per-user when authenticated
  message: { success: false, message: 'Blood request limit reached — max 5 requests per hour' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user?.role === 'admin', // Admins bypass limit
});

// ── General API limiter ───────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: { success: false, message: 'Too many requests — slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, otpLimiter, requestLimiter, apiLimiter };
