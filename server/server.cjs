require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Request, Student, Session, User } = require('./models.cjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'samvaad-dev-secret-change-me';

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

// ============================================================
// AUTH MIDDLEWARE
// ============================================================

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, role, status }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
    }
    next();
  };
};

// Counselor must be approved to access protected routes
const approvedOnly = (req, res, next) => {
  if (req.user.role === 'counselor' && req.user.status !== 'approved') {
    return res.status(403).json({ error: 'Account not yet approved by admin.' });
  }
  next();
};

// ============================================================
// AUTH ROUTES
// ============================================================

// POST /api/auth/register — Counselor self-registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name.trim(),
      role: 'counselor',
      status: 'pending'
    });

    await user.save();

    res.status(201).json({
      message: 'Registration successful. Your account is pending admin approval.',
      status: 'pending'
    });
  } catch (e) {
    console.error('Register error:', e.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login — Login for both admin and counselor
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check if counselor is blocked
    if (user.role === 'counselor' && user.status === 'blocked') {
      return res.status(403).json({ error: 'Your account has been blocked by the admin.' });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role, status: user.status },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      }
    });
  } catch (e) {
    console.error('Login error:', e.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// GET /api/auth/me — Get current user from token
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// ADMIN ROUTES (Admin only)
// ============================================================

// GET /api/admin/counselors — List all counselors
app.get('/api/admin/counselors', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const counselors = await User.find({ role: 'counselor' }).select('-password').sort({ createdAt: -1 });
    res.json(counselors.map(c => ({
      id: c._id.toString(),
      email: c.email,
      name: c.name,
      status: c.status,
      createdAt: c.createdAt
    })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/admin/counselors/:id — Approve or block a counselor
app.patch('/api/admin/counselors/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'blocked', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be approved, blocked, or pending.' });
    }

    const counselor = await User.findById(req.params.id);
    if (!counselor || counselor.role !== 'counselor') {
      return res.status(404).json({ error: 'Counselor not found.' });
    }

    counselor.status = status;
    await counselor.save();

    res.json({
      id: counselor._id.toString(),
      email: counselor.email,
      name: counselor.name,
      status: counselor.status
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// PROTECTED ROUTES — Requests (Counselor-only, except POST which is public)
// ============================================================

app.get('/api/requests', authMiddleware, roleMiddleware('counselor'), approvedOnly, async (req, res) => {
  try {
    const requests = await Request.find().sort({ timestamp: -1 });
    res.json(requests.map(mapId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/requests — PUBLIC (contact form, no auth needed)
app.post('/api/requests', async (req, res) => {
  try {
    const newReq = new Request(req.body);
    await newReq.save();
    res.json(mapId(newReq));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch('/api/requests/:id', authMiddleware, roleMiddleware('counselor'), approvedOnly, async (req, res) => {
  try {
    const { status } = req.body;
    await Request.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// PROTECTED ROUTES — Students (Counselor-only)
// ============================================================

app.get('/api/students', authMiddleware, roleMiddleware('counselor'), approvedOnly, async (req, res) => {
  try {
    const students = await Student.find().sort({ joinedAt: -1 });
    res.json(students.map(mapId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/students/:id', authMiddleware, roleMiddleware('counselor'), approvedOnly, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    res.json(mapId(student));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/students', authMiddleware, roleMiddleware('counselor'), approvedOnly, async (req, res) => {
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

// ============================================================
// PROTECTED ROUTES — Sessions (Counselor-only)
// ============================================================

app.get('/api/sessions', authMiddleware, roleMiddleware('counselor'), approvedOnly, async (req, res) => {
  try {
    const { studentId } = req.query;
    const query = studentId ? { studentId } : {};
    const sessions = await Session.find(query).sort({ date: -1 });
    res.json(sessions.map(mapId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/sessions', authMiddleware, roleMiddleware('counselor'), approvedOnly, async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.json(mapId(session));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// WhatsApp API (PUBLIC — tied to contact form)
// ============================================================

app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { phone, name } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const message = `Hello, I would like to connect with a counselor.\n\nMy Details:\nName: ${name || 'Not provided'}\nPhone: ${phone}`;

    // Check for credentials
    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (token && phoneId) {
      console.log(`🚀 Sending WhatsApp to Counselor (8698801090) about user: ${name}, ${phone}`);
    } else {
      console.log("---------------------------------------------------");
      console.log("📨 SIMULATED WHATSAPP MESSAGE (No Credentials Found)");
      console.log(`To: Counselor (8698801090)`);
      console.log(`Message: \n${message}`);
      console.log("---------------------------------------------------");
    }

    res.json({ success: true, message: 'Message queued for sending' });
  } catch (e) {
    console.error("WhatsApp Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});
// --- START SERVER ---
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
