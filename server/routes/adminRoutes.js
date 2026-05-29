const express = require('express');
const router = express.Router();
const { getAdminStats, getAdminUsers, deleteAdminUser, getAdminComments } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getAdminUsers);
router.delete('/users/:id', protect, admin, deleteAdminUser);
router.get('/comments', protect, admin, getAdminComments);

module.exports = router;
