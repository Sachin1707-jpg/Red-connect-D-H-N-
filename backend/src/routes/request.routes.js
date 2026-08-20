const express = require('express');
const router = express.Router();
const {
  createRequest,
  getNearbyRequests,
  getRequestById,
  getRequestMatches,
  respondToRequest,
  fulfillRequest,
  cancelRequest,
} = require('../controllers/requestController');
const { protect, optionalAuth } = require('../middlewares/auth');
const { roleGuard } = require('../middlewares/roleGuard');
const { createRequestValidator, respondValidator } = require('../middlewares/validators/request');
const { validate } = require('../middlewares/validators/validate');
const { requestLimiter } = require('../middlewares/rateLimiter');

router.post('/', protect, requestLimiter, createRequestValidator, validate, createRequest);
router.get('/nearby', optionalAuth, getNearbyRequests);
router.get('/:id', getRequestById);
router.get('/:id/matches', protect, getRequestMatches);
router.post('/:id/respond', protect, respondValidator, validate, respondToRequest);
router.patch('/:id/fulfill', protect, roleGuard('hospital', 'admin'), fulfillRequest);
router.delete('/:id', protect, cancelRequest);

module.exports = router;
