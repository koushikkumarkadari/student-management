// backend/server.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const userRoutes = require('./routes/user');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Connect to MongoDB
connectDB();

console.log('MONGO_URI:', process.env.MONGO_URI);
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));