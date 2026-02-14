const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  studentPhone: { type: String, required: true },
  studentName: String,
  status: {
    type: String,
    enum: ['new', 'contacted', 'scheduled', 'archived'],
    default: 'new'
  },
  timestamp: { type: Number, default: Date.now }
});

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  branch: String,
  mobile: { type: String, required: true, unique: true },
  email: String,
  parentName: String,
  parentMobile: String,
  parentOccupation: String,
  joinedAt: { type: Number, default: Date.now }
});

const sessionSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  counselorId: { type: String, required: true },
  counselorName: String,
  topics: [String],
  reason: String,
  description: String,
  privateNote: String,
  attachmentUrl: String,
  date: { type: Number, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google Auth users
  googleId: { type: String, unique: true, sparse: true },
  picture: String,
  role: { type: String, enum: ['admin', 'counselor'], default: 'counselor' },
  isApproved: { type: Boolean, default: false }
});

module.exports = {
  Request: mongoose.model('Request', requestSchema),
  Student: mongoose.model('Student', studentSchema),
  Session: mongoose.model('Session', sessionSchema),
  User: mongoose.model('User', userSchema)
};