const express = require('express');
const router = express.Router();

const { getAdminDashboard } = require('../controllers/adminController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/dashboard', requireAuth, requireAdmin, getAdminDashboard);

module.exports = router;
