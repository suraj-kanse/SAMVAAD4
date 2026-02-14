require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Request, Student, Session, User } = require('./models.cjs');

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

// --- SEED ADMIN FUNCTION ---
const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'dev@avcoe.edu';
  const adminPass = process.env.ADMIN_PASS || 'admin123';

  try {
    const exists = await User.findOne({ email: adminEmail });
    if (!exists) {
      console.log(`Seeding Admin Account: ${adminEmail}`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPass, salt);

      await User.create({
        name: 'Developer Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isApproved: true
      });
      console.log('Admin seeded successfully.');
    }
  } catch (err) {
    console.error("Seeding Error (DB might be disconnected):", err.message);
  }
};

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
    seedAdmin();
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
  delete obj.password;
  return obj;
};

// --- ROUTES ---

// Auth
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.isApproved) return res.status(403).json({ error: 'Account pending approval' });

    res.json(mapId(user));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hashedPassword
    });

    await newUser.save();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Google Auth
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const { name, email, picture, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = new User({
        name,
        email,
        googleId,
        picture,
        role: 'counselor', // Default role
        isApproved: false // Needs admin approval
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Google ID to existing account
      user.googleId = googleId;
      user.picture = picture;
      await user.save();
    }

    if (!user.isApproved) return res.status(403).json({ error: 'Account pending approval' });

    res.json(mapId(user));
  } catch (e) {
    console.error("Google Auth Error:", e);
    res.status(401).json({ error: 'Google authentication failed' });
  }
});

// Users (Admin)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users.map(mapId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch('/api/users/:id/status', async (req, res) => {
  try {
    const { isApproved } = req.body;
    await User.findByIdAndUpdate(req.params.id, { isApproved });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

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
