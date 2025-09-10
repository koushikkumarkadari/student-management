// backend/controllers/studentController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createStudent = async (req, res) => {
  const { userId, name, email, course } = req.body;
  console.log('Create student request:', { userId, name, email, course });
  try {
    if (!userId || !name || !email || !course) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const existingStudent = await Student.findOne({ userId });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists for this user' });
    }
    const student = new Student({ userId, name, email, course });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, course } = req.body;
  console.log('Update student request:', { id, name, email, course });
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    const student = await Student.findByIdAndUpdate(
      id,
      { name, email, course },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  console.log('Delete student request:', { id });
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    const student = await Student.findByIdAndDelete(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ message: 'Profile not found' });
    res.json(student);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { name, email, course } = req.body;
  console.log('Update profile request:', { userId: req.user._id, name, email, course });
  try {
    if (!name || !email || !course) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const student = await Student.findOneAndUpdate(
      { userId: req.user._id },
      { name, email, course },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: 'Profile not found' });
    res.json(student);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getProfile,
  updateProfile,
};