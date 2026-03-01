const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobTitle: {
        type: String,
        default: 'Software Engineer'
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    questions: [{
        type: String
    }],
    userAnswers: [{
        type: String
    }],
    aiFeedback: {
        type: String,
        default: ''
    },
    overallScore: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
