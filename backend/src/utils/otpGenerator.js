const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * Generate a 6-digit numeric OTP and return both the raw code and its bcrypt hash.
 */
const generateOtp = async () => {
  // Cryptographically secure random 6-digit OTP
  const otp = String(crypto.randomInt(100000, 999999));
  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otp, salt);
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  return { otp, hashedOtp, expiry };
};

/**
 * Verify a raw OTP against its stored bcrypt hash.
 */
const verifyOtp = async (rawOtp, hashedOtp) => {
  return bcrypt.compare(rawOtp, hashedOtp);
};

module.exports = { generateOtp, verifyOtp };
