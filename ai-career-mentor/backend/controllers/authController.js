// Handles user registration, login, and fetching the current user.

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Simple email validation helper for basic feedback.
const isValidEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

// POST /api/auth/register
// Public - Register a new user
const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      careerInterest,
      skillLevel
    } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      careerInterest,
      skillLevel
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
// Public - Login existing user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
// Private - Get logged in user's profile
const getMe = async (req, res, next) => {
  try {
    // req.user is already attached by auth middleware
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};

