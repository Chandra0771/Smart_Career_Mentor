const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Chat = require('../models/Chat');
const Analytics = require('../models/Analytics');

router.get('/user', protect, async (req, res) => {
  try {
    const chatCount = await Chat.countDocuments({ userId: req.user._id });
    const recentActivity = await Analytics.find({ userId: req.user._id })
      .sort({ timestamp: -1 }).limit(10);
    const chatsByDay = await Chat.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: -1 } }, { $limit: 7 }
    ]);
    res.json({ chatCount, recentActivity, chatsByDay });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics.' });
  }
});

module.exports = router;
