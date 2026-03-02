const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Analytics = require('../models/Analytics');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), error: errors.array()[0].msg });
    }

    const { name, email, password, role, careerInterest, skillLevel } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered. Please login.' });
    }

    const user = await User.create({ name, email, password, role, careerInterest, skillLevel });

    await Analytics.create({ userId: user._id, event: 'user_registered', data: { role, careerInterest } });

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Registration successful! Welcome to AI Career Mentor.',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// @POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    user.lastActive = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    await Analytics.create({ userId: user._id, event: 'user_login', data: { timestamp: new Date() } });

    const token = generateToken(user._id);

    res.json({
      message: `Welcome back, ${user.name}!`,
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};

// @POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // In production, send reset email. For demo, just confirm.
  res.json({ message: 'If that email exists, a reset link has been sent.' });
};
