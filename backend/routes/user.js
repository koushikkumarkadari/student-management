// backend/routes/user.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { getUsers } = require('../controllers/userController');

router.get('/', protect, admin, getUsers);

module.exports = router; 