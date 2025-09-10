// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log('Signup request:', { name, email, password: '***', role });
  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, role });
    await user.save();

    if (role === 'student') {
      const student = new Student({
        userId: user._id,
        name,
        email,
        course: 'MERN Bootcamp',
      });
      await student.save();
    }

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, role: user.role });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', { email, password: '***' });
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { signup, login };