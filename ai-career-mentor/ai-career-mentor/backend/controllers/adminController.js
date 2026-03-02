const User = require('../models/User');
const Chat = require('../models/Chat');
const Analytics = require('../models/Analytics');

// @GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, proUsers, totalChats, recentUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isPro: true }),
      Chat.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(10).select('name email role careerInterest createdAt isPro')
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const usersByCareer = await User.aggregate([
      { $group: { _id: '$careerInterest', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    const chatsByDay = await Chat.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);

    res.json({
      stats: { totalUsers, proUsers, totalChats, freeUsers: totalUsers - proUsers },
      usersByRole,
      usersByCareer,
      chatsByDay,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin stats.' });
  }
};

// @GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';

    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(query);
    res.json({ users, total, pages: Math.ceil(total / limit), page });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

// @PATCH /api/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { isPro, isAdmin } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isPro, isAdmin }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user, message: 'User updated.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user.' });
  }
};

// @DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Chat.deleteMany({ userId: req.params.id });
    res.json({ message: 'User deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};
