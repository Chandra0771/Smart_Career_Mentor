const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    provider: {
        type: String,
        default: ''
    },
    duration: {
        type: String,
        default: ''
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    completed: {
        type: Boolean,
        default: false
    },
    courseUrl: {
        type: String,
        default: ''
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LearningPath', learningPathSchema);
