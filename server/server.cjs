require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Request, Student, Session } = require('./models.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

// --- SECURITY MIDDLEWARE ---
// Disable CSP for dev/demo simplicity to avoid localhost issues
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());

// Rate Limiting: Max 200 requests per 15 minutes per IP (Relaxed for Dev)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// --- DATABASE CONNECTION ---
const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  try {
    // Priority: Env Variable (Atlas) -> Localhost Fallback
    const connectionString = MONGO_URI || 'mongodb://127.0.0.1:27017/samvaad';

    // Add timeouts to fail fast if network is blocked
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    if (!MONGO_URI) {
      console.warn("⚠️  NOTE: MONGO_URI not found in .env file.");
      console.warn("   Attempting to connect to local MongoDB (mongodb://127.0.0.1:27017/samvaad)");
    }

    await mongoose.connect(connectionString, options);

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    // CRITICAL: Throw error so the server doesn't start in a broken state
    throw err;
  }
};

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Server failed to start due to DB connection error.');
    process.exit(1);
  });

// Helper to map _id to id
const mapId = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

// --- ROUTES ---

// Requests
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await Request.find().sort({ timestamp: -1 });
    res.json(requests.map(mapId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/requests', async (req, res) => {
  try {
    const newReq = new Request(req.body);
    await newReq.save();
    res.json(mapId(newReq));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch('/api/requests/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await Request.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ joinedAt: -1 });
    res.json(students.map(mapId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    res.json(mapId(student));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const exists = await Student.findOne({ mobile: req.body.mobile });
    if (exists) return res.status(400).json({ error: 'Student already exists' });

    const student = new Student(req.body);
    await student.save();
    res.json(mapId(student));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Sessions
app.get('/api/sessions', async (req, res) => {
  try {
    const { studentId } = req.query;
    const query = studentId ? { studentId } : {};
    const sessions = await Session.find(query).sort({ date: -1 });
    res.json(sessions.map(mapId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/sessions', async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.json(mapId(session));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Bind to 0.0.0.0 to ensure access from external containers/VMs if needed
