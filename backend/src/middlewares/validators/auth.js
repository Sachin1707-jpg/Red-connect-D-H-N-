const { body } = require('express-validator');

const registerValidator = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['donor', 'hospital', 'ngo', 'admin'])
    .withMessage('Invalid role'),
  body('bloodGroup')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood group'),
];

const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const verifyOtpValidator = [
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

const refreshValidator = [
  body('refreshToken').trim().notEmpty().withMessage('Refresh token is required'),
];

module.exports = { registerValidator, loginValidator, verifyOtpValidator, refreshValidator };
