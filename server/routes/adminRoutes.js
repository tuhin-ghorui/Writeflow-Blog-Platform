const express = require('express');
const router = express.Router();
const { getAdminStats, getAdminUsers, deleteAdminUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getAdminUsers);
router.delete('/users/:id', protect, admin, deleteAdminUser);

module.exports = router;
