const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const CareerProfile = require('../models/CareerProfile');
const JobMatch = require('../models/JobMatch');
const Resume = require('../models/Resume');
const InterviewSession = require('../models/InterviewSession');
const LearningPath = require('../models/LearningPath');

// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ 
            success: false, 
            message: 'Please login to access this feature' 
        });
    }
    next();
};

// Sample data
const sampleJobs = [
    {
        jobTitle: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        salaryRange: '$100k - $150k',
        jobDescription: 'Looking for a skilled software engineer with experience in Python and JavaScript.',
        matchScore: 92
    },
    {
        jobTitle: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        salaryRange: '$80k - $120k',
        jobDescription: 'Join our team as a full stack developer working with React and Node.js.',
        matchScore: 88
    },
    {
        jobTitle: 'Data Analyst',
        company: 'DataDriven Inc',
        location: 'New York, NY',
        salaryRange: '$70k - $100k',
        jobDescription: 'Analyze data and create insights using Python and SQL.',
        matchScore: 85
    }
];

const sampleCourses = [
    {
        title: 'Python for Data Science',
        description: 'Learn Python programming for data analysis and machine learning',
        provider: 'Coursera',
        duration: '8 weeks',
        level: 'intermediate',
        courseUrl: 'https://coursera.org'
    },
    {
        title: 'Web Development Bootcamp',
        description: 'Complete web development course covering HTML, CSS, JavaScript, and React',
        provider: 'Udemy',
        duration: '12 weeks',
        level: 'beginner',
        courseUrl: 'https://udemy.com'
    },
    {
        title: 'Machine Learning Fundamentals',
        description: 'Introduction to machine learning algorithms and applications',
        provider: 'edX',
        duration: '10 weeks',
        level: 'advanced',
        courseUrl: 'https://edx.org'
    }
];

// @route   GET /api/career/profile
// @desc    Get user career profile
// @access  Private
router.get('/profile', requireAuth, async (req, res) => {
    try {
        let profile = await CareerProfile.findOne({ user: req.session.userId });
        
        if (!profile) {
            profile = new CareerProfile({ user: req.session.userId });
            await profile.save();
        }

        res.json({ success: true, profile });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/career/assessment
// @desc    Submit career assessment
// @access  Private
router.post('/assessment', requireAuth, [
    body('skills').optional().trim(),
    body('experienceYears').optional().isInt({ min: 0 }),
    body('desiredJobTitle').optional().trim(),
    body('preferredIndustry').optional().trim(),
    body('preferredLocation').optional().trim(),
    body('expectedSalary').optional().isInt({ min: 0 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { skills, experienceYears, desiredJobTitle, preferredIndustry, preferredLocation, expectedSalary } = req.body;

        let profile = await CareerProfile.findOne({ user: req.session.userId });
        
        if (!profile) {
            profile = new CareerProfile({ user: req.session.userId });
        }

        profile.skills = skills || '';
        profile.experienceYears = parseInt(experienceYears) || 0;
        profile.desiredJobTitle = desiredJobTitle || '';
        profile.preferredIndustry = preferredIndustry || '';
        profile.preferredLocation = preferredLocation || '';
        profile.expectedSalary = parseInt(expectedSalary) || 0;

        // Calculate assessment scores
        const skillsCount = skills ? skills.split(',').length : 0;
        profile.assessmentScores = {
            technicalSkills: Math.min(100, skillsCount * 15 + 50),
            experienceScore: Math.min(100, profile.experienceYears * 10),
            marketFit: 85,
            overallScore: 0
        };
        profile.assessmentScores.overallScore = Math.floor(
            (profile.assessmentScores.technicalSkills + 
             profile.assessmentScores.experienceScore + 
             profile.assessmentScores.marketFit) / 3
        );
        
        profile.assessmentCompleted = true;
        await profile.save();

        res.json({ success: true, message: 'Assessment completed', profile });
    } catch (error) {
        console.error('Assessment Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/career/jobs
// @desc    Get job matches
// @access  Private
router.get('/jobs', requireAuth, async (req, res) => {
    try {
        let jobs = await JobMatch.find({ user: req.session.userId }).sort({ createdAt: -1 });

        if (jobs.length === 0) {
            // Create sample jobs
            for (const job of sampleJobs) {
                const newJob = new JobMatch({
                    user: req.session.userId,
                    ...job
                });
                await newJob.save();
            }
            jobs = await JobMatch.find({ user: req.session.userId }).sort({ createdAt: -1 });
        }

        res.json({ success: true, jobs });
    } catch (error) {
        console.error('Get Jobs Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/career/jobs/:id/apply
// @desc    Apply for a job
// @access  Private
router.post('/jobs/:id/apply', requireAuth, async (req, res) => {
    try {
        const job = await JobMatch.findOne({ _id: req.params.id, user: req.session.userId });
        
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        job.status = 'applied';
        await job.save();

        res.json({ success: true, message: 'Applied successfully', job });
    } catch (error) {
        console.error('Apply Job Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/career/resumes
// @desc    Get user resumes
// @access  Private
router.get('/resumes', requireAuth, async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.session.userId }).sort({ createdAt: -1 });
        res.json({ success: true, resumes });
    } catch (error) {
        console.error('Get Resumes Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/career/resumes
// @desc    Create resume
// @access  Private
router.post('/resumes', requireAuth, async (req, res) => {
    try {
        const { title, summary, experience, education, projects } = req.body;

        const resume = new Resume({
            user: req.session.userId,
            title: title || 'My Resume',
            summary: summary || '',
            experience: experience || [],
            education: education || [],
            projects: projects || [],
            aiSuggestions: 'Great start! Consider adding more quantifiable achievements and specific technical skills.'
        });

        await resume.save();
        res.json({ success: true, message: 'Resume created', resume });
    } catch (error) {
        console.error('Create Resume Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/career/resumes/:id
// @desc    Delete resume
// @access  Private
router.delete('/resumes/:id', requireAuth, async (req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.session.userId });
        
        if (!resume) {
            return res.status(404).json({ success: false, message: 'Resume not found' });
        }

        res.json({ success: true, message: 'Resume deleted' });
    } catch (error) {
        console.error('Delete Resume Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/career/interviews
// @desc    Get interview sessions
// @access  Private
router.get('/interviews', requireAuth, async (req, res) => {
    try {
        const sessions = await InterviewSession.find({ user: req.session.userId }).sort({ createdAt: -1 });
        res.json({ success: true, sessions });
    } catch (error) {
        console.error('Get Interviews Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/career/interviews
// @desc    Create interview session
// @access  Private
router.post('/interviews', requireAuth, async (req, res) => {
    try {
        const { jobTitle, difficulty } = req.body;

        const questions = [
            "Tell me about yourself and why you're interested in this role.",
            "What are your greatest strengths and weaknesses?",
            "Describe a challenging project you worked on and how you overcame obstacles.",
            "Where do you see yourself in 5 years?",
            "Why should we hire you?"
        ];

        const session = new InterviewSession({
            user: req.session.userId,
            jobTitle: jobTitle || 'Software Engineer',
            difficulty: difficulty || 'medium',
            questions,
            userAnswers: questions.map(() => ''),
            aiFeedback: 'Practice answering these common interview questions. Focus on specific examples from your experience.'
        });

        await session.save();
        res.json({ success: true, message: 'Interview session created', session });
    } catch (error) {
        console.error('Create Interview Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/career/interviews/:id
// @desc    Get interview session
// @access  Private
router.get('/interviews/:id', requireAuth, async (req, res) => {
    try {
        const session = await InterviewSession.findOne({ _id: req.params.id, user: req.session.userId });
        
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        res.json({ success: true, session });
    } catch (error) {
        console.error('Get Interview Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/career/interviews/:id
// @desc    Update interview session with answers
// @access  Private
router.put('/interviews/:id', requireAuth, async (req, res) => {
    try {
        const { userAnswers } = req.body;
        
        const session = await InterviewSession.findOne({ _id: req.params.id, user: req.session.userId });
        
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        session.userAnswers = userAnswers;
        session.aiFeedback = 'Good effort! For better results: 1) Use the STAR method for behavioral questions. 2) Be specific with examples. 3) Practice speaking clearly and confidently.';
        session.overallScore = 75;
        
        await session.save();
        res.json({ success: true, message: 'Answers saved', session });
    } catch (error) {
        console.error('Update Interview Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/career/learning-paths
// @desc    Get learning paths
// @access  Private
router.get('/learning-paths', requireAuth, async (req, res) => {
    try {
        let paths = await LearningPath.find({ user: req.session.userId }).sort({ createdAt: -1 });

        if (paths.length === 0) {
            // Create sample courses
            for (const course of sampleCourses) {
                const newPath = new LearningPath({
                    user: req.session.userId,
                    ...course
                });
                await newPath.save();
            }
            paths = await LearningPath.find({ user: req.session.userId }).sort({ createdAt: -1 });
        }

        res.json({ success: true, paths });
    } catch (error) {
        console.error('Get Learning Paths Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/career/learning-paths/:id
// @desc    Update learning path progress
// @access  Private
router.put('/learning-paths/:id', requireAuth, async (req, res) => {
    try {
        const { progress } = req.body;
        
        const path = await LearningPath.findOne({ _id: req.params.id, user: req.session.userId });
        
        if (!path) {
            return res.status(404).json({ success: false, message: 'Learning path not found' });
        }

        path.progress = parseInt(progress) || 0;
        if (path.progress >= 100) {
            path.completed = true;
            path.completedAt = new Date();
        }
        
        await path.save();
        res.json({ success: true, message: 'Progress updated', path });
    } catch (error) {
        console.error('Update Learning Path Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
