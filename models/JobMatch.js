const mongoose = require('mongoose');

const jobMatchSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    company: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    salaryRange: {
        type: String,
        default: ''
    },
    jobDescription: {
        type: String,
        default: ''
    },
    matchScore: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'applied', 'interview', 'rejected', 'accepted'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Index for faster queries
jobMatchSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('JobMatch', jobMatchSchema);
