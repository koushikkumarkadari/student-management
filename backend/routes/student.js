// backend/routes/student.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getProfile,
  updateProfile,
} = require('../controllers/studentController');
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/', protect, admin, getAllStudents);
router.post('/', protect, admin, createStudent);
router.put('/:id', protect, admin, updateStudent);
router.delete('/:id', protect, admin, deleteStudent);


module.exports = router;