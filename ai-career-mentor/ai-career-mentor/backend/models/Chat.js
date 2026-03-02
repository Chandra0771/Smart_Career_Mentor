const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'New Chat' },
  messages: [messageSchema],
  category: { type: String, default: 'general' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

chatSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.messages.length > 0 && this.title === 'New Chat') {
    this.title = this.messages[0].content.substring(0, 50) + '...';
  }
  next();
});

module.exports = mongoose.model('Chat', chatSchema);
