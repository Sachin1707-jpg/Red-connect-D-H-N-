const express = require('express');
const router = express.Router();
const { listUsers, verifyUser, getStats } = require('../controllers/adminController');
const { protect } = require('../middlewares/auth');
const { roleGuard } = require('../middlewares/roleGuard');

router.use(protect);
router.use(roleGuard('admin'));

router.get('/users', listUsers);
router.patch('/users/:id/verify', verifyUser);
router.get('/stats', getStats);

module.exports = router;
