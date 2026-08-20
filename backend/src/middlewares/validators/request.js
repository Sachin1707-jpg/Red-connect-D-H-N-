const { body } = require('express-validator');

const createRequestValidator = [
  body('patientName').trim().isLength({ min: 2 }).withMessage('Patient name is required'),
  body('bloodGroup')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood group'),
  body('unitsNeeded')
    .isInt({ min: 1, max: 20 })
    .withMessage('Units needed must be between 1 and 20'),
  body('urgency')
    .isIn(['critical', 'urgent', 'planned'])
    .withMessage('Urgency must be critical, urgent, or planned'),
  body('hospital.name').trim().notEmpty().withMessage('Hospital name is required'),
  body('hospital.location.coordinates')
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be [longitude, latitude]'),
  body('description').optional().trim(),
];

const respondValidator = [
  body('status')
    .isIn(['accepted', 'declined'])
    .withMessage('Status must be accepted or declined'),
];

module.exports = { createRequestValidator, respondValidator };
