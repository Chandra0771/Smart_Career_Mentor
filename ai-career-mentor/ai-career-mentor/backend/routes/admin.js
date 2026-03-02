const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getStats, getAllUsers, updateUser, deleteUser } = require('../controllers/adminController');

router.use(protect, adminOnly);
router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
