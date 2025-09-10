// backend/controllers/userController.js
const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('name email _id');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUsers };