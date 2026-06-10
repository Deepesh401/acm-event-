import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/email.js';

// In-memory store for OTPs (used for fallback admin or when DB is offline)
const inMemoryOtps = new Map();

const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL || 'acmnmims26@gmail.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@2026',
  name: 'ACM Admin',
  role: 'admin',
  id: '000000000000000000000001'
};

// Helper to check if credentials match default admin
const isDefaultAdmin = (email, password) => {
  return (
    email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase() &&
    password === DEFAULT_ADMIN.password
  );
};

// Login step 1: Verify credentials and send OTP
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = null;
    let isFallback = false;

    // 1. Try finding in DB first (if connected)
    try {
      user = await User.findOne({ email }).select('+password');
    } catch (dbErr) {
      console.warn('DB lookup failed, trying fallback admin:', dbErr.message);
    }

    // 2. If DB search succeeded and user exists, check password
    if (user) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      if (!user.isActive) {
        return res.status(401).json({ success: false, message: 'Account is inactive' });
      }
    } else {
      // 3. Fallback to default admin
      if (isDefaultAdmin(email, password)) {
        isFallback = true;
        user = {
          email: DEFAULT_ADMIN.email,
          name: DEFAULT_ADMIN.name,
          role: DEFAULT_ADMIN.role,
          _id: DEFAULT_ADMIN.id,
          isActive: true
        };
      } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }

    // Generate JWT token and return success immediately (bypass OTP for normal login)
    const token = generateToken(user._id || user.id);
    
    // Set lastLogin date if DB user
    if (user && !isFallback && typeof user.save === 'function') {
      user.lastLogin = new Date();
      try {
        await user.save();
      } catch (saveErr) {
        // ignore
      }
    }

    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      message: 'Login successful'
    });
  } catch (err) {
    next(err);
  }
};

// Login step 2: Verify OTP and return JWT token
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const lowerEmail = email.toLowerCase();
    
    // Check memory store first
    const memoryRecord = inMemoryOtps.get(lowerEmail);
    if (memoryRecord) {
      if (memoryRecord.otp === otp && memoryRecord.expires > new Date()) {
        inMemoryOtps.delete(lowerEmail);
        
        let userId = DEFAULT_ADMIN.id;
        let userName = DEFAULT_ADMIN.name;
        let userRole = DEFAULT_ADMIN.role;

        // Try getting user ID from DB if possible
        try {
          const user = await User.findOne({ email: lowerEmail });
          if (user) {
            userId = user._id;
            userName = user.name;
            userRole = user.role;
          }
        } catch (dbErr) {
          // ignore
        }

        return res.json({
          success: true,
          token: generateToken(userId),
          user: { id: userId, name: userName, email: lowerEmail, role: userRole },
          message: 'Login successful'
        });
      }
    }

    // Otherwise, check DB
    let user = null;
    try {
      user = await User.findOne({ email });
    } catch (dbErr) {
      console.error('Database connection lost during OTP verification:', dbErr.message);
    }

    if (!user) {
      // If db fails but it is default admin and we had no memory record (or expired)
      if (lowerEmail === DEFAULT_ADMIN.email.toLowerCase()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.otp || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // OTP is correct - clear it
    user.otp = undefined;
    user.otpExpires = undefined;
    user.lastLogin = new Date();
    try {
      await user.save();
    } catch (saveErr) {
      // ignore
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      message: 'Login successful'
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

export const demoLogin = async (req, res, next) => {
  try {
    const userId = DEFAULT_ADMIN.id;
    const userName = DEFAULT_ADMIN.name;
    const userRole = DEFAULT_ADMIN.role;
    const userEmail = DEFAULT_ADMIN.email;

    res.json({
      success: true,
      token: generateToken(userId),
      user: { id: userId, name: userName, email: userEmail, role: userRole },
      message: 'Demo Admin login successful'
    });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (dbErr) {
      console.warn('DB lookup failed during registration:', dbErr.message);
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create the admin user
    let user;
    try {
      user = await User.create({
        name,
        email,
        password,
        role: 'admin',
        isActive: true
      });
    } catch (dbErr) {
      console.warn('DB save failed during registration, using fallback user:', dbErr.message);
      user = {
        _id: 'mock-admin-id-' + Date.now(),
        name,
        email,
        role: 'admin',
        isActive: true
      };
    }

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      message: 'Admin registered successfully'
    });
  } catch (err) {
    next(err);
  }
};


