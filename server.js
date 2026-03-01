require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const careerRoutes = require('./routes/career');

// Initialize Express app
const app = express();

// MongoDB Connection with fallback
let sessionStore;
let MongoStore;

async function initializeDatabase() {
    try {
        // Try to load MongoDB dependencies
        MongoStore = require('connect-mongo');
        const mongoose = require('mongoose');
        
        // Check if MONGODB_URI is provided
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('MongoDB Connected');
            
            sessionStore = MongoStore.create({
                mongoUrl: process.env.MONGODB_URI,
                ttl: 30 * 24 * 60 * 60 // 30 days
            });
        } else {
            console.log('MongoDB URI not provided. Using in-memory session store.');
            // Create in-memory store as fallback
            const memoryStore = new Map();
            sessionStore = {
                get: (sid, cb) => {
                    cb(null, memoryStore.get(sid));
                },
                set: (sid, session, cb) => {
                    memoryStore.set(sid, session);
                    cb(null);
                },
                destroy: (sid, cb) => {
                    memoryStore.delete(sid);
                    cb(null);
                }
            };
        }
    } catch (error) {
        console.log('Using in-memory session store (MongoDB not available)');
        // Use in-memory store as fallback
        const memoryStore = new Map();
        sessionStore = {
            get: (sid, cb) => {
                cb(null, memoryStore.get(sid));
            },
            set: (sid, session, cb) => {
                memoryStore.set(sid, session);
                cb(null);
            },
            destroy: (sid, cb) => {
                memoryStore.delete(sid);
                cb(null);
            }
        };
    }
}

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.PROD_URL 
        : ['http://localhost:5000', 'http://127.0.0.1:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging (development)
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Session configuration with fallback
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
});

app.use(sessionMiddleware);

// Make session available to templates
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.userId = req.session.userId;
    res.locals.username = req.session.username;
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'static')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/career', careerRoutes);

// View Routes - Page rendering (for backward compatibility with templates)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'templates', 'dashboard.html'));
});

app.get('/career-assessment', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'templates', 'career_assessment.html'));
});

app.get('/job-matches', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'templates', 'job_matches.html'));
});

app.get('/resume-builder', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'templates', 'resume_builder.html'));
});

app.get('/interview-prep', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'templates', 'interview_prep.html'));
});

app.get('/interview-session/:id', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'templates', 'interview_session.html'));
});

app.get('/learning-paths', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'templates', 'learning_paths.html'));
});

app.get('/assessment-results', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'templates', 'assessment_results.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Page not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}).catch(err => {
    console.error('Failed to initialize:', err);
    process.exit(1);
});

module.exports = app;
