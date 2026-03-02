// Handles user profile read/update operations.

const User = require("../models/User");

// GET /api/users/me
// Private - Get current user profile (same as /auth/me but kept for clarity)
const getProfile = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/me
// Private - Update profile fields (not password)
const updateProfile = async (req, res, next) => {
  try {
    const { name, role, careerInterest, skillLevel } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow safe profile fields to be updated.
    if (name) user.name = name;
    if (role) user.role = role;
    if (careerInterest !== undefined) user.careerInterest = careerInterest;
    if (skillLevel) user.skillLevel = skillLevel;

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      user: updatedUser.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};

