/**
 * Resume Model
 */

const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: String,
  originalText: String,
  aiReview: {
    score: { type: Number, min: 0, max: 100 },
    strengths: [String],
    improvements: [String],
    keywords: [String],
    summary: String,
    atsScore: Number,
    suggestions: [String]
  },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
