const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

router.get('/profile', protect, (req, res) => res.json({ user: req.user }));

router.put('/profile', protect, async (req, res) => {
  try {
    const { name, careerInterest, skillLevel, bio, skills } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, careerInterest, skillLevel, bio, skills },
      { new: true }
    );
    res.json({ user, message: 'Profile updated!' });
  } catch (error) {
    res.status(500).json({ error: 'Profile update failed.' });
  }
});

module.exports = router;
