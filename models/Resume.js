const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'My Resume'
    },
    summary: {
        type: String,
        default: ''
    },
    experience: [{
        company: String,
        position: String,
        duration: String,
        description: String
    }],
    education: [{
        institution: String,
        degree: String,
        year: String
    }],
    projects: [{
        name: String,
        description: String,
        link: String
    }],
    aiSuggestions: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
