const express = require('express');
const router = express.Router();
const { getMe, updateMe, getDonorById } = require('../controllers/donorController');
const { protect } = require('../middlewares/auth');

router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);
router.get('/:id', getDonorById);

module.exports = router;
