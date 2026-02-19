const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  studentPhone: { type: String, required: true },
  studentName: String,
  department: String,
  gender: String,
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
  topics: [String],
  reason: String,
  description: String,
  privateNote: String,
  attachmentUrl: String,
  date: { type: Number, default: Date.now }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ['admin', 'counselor'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'blocked'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  Request: mongoose.model('Request', requestSchema),
  Student: mongoose.model('Student', studentSchema),
  Session: mongoose.model('Session', sessionSchema),
  User: mongoose.model('User', userSchema)
};