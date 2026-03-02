const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendMessage, getChatHistory, getChat, deleteChat } = require('../controllers/chatController');

router.post('/message', protect, sendMessage);
router.get('/history', protect, getChatHistory);
router.get('/:id', protect, getChat);
router.delete('/:id', protect, deleteChat);

module.exports = router;
