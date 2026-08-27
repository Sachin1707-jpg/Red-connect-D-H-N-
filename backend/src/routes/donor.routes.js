const express = require('express');
const router = express.Router();
const { getMe, updateMe, getDonorById, notifyDonorSMS } = require('../controllers/donorController');
const { protect, optionalAuth } = require('../middlewares/auth');

router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);
router.post('/notify', optionalAuth, notifyDonorSMS);
router.post('/:donorId/notify', optionalAuth, notifyDonorSMS);
router.get('/:id', getDonorById);

module.exports = router;

