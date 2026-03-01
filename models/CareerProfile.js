const mongoose = require('mongoose');

const careerProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    skills: {
        type: String,
        default: ''
    },
    experienceYears: {
        type: Number,
        default: 0
    },
    desiredJobTitle: {
        type: String,
        default: ''
    },
    preferredIndustry: {
        type: String,
        default: ''
    },
    preferredLocation: {
        type: String,
        default: ''
    },
    expectedSalary: {
        type: Number,
        default: 0
    },
    assessmentCompleted: {
        type: Boolean,
        default: false
    },
    assessmentScores: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CareerProfile', careerProfileSchema);
