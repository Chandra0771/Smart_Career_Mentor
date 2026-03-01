"""
AI Smart Career Mentor - Main Application
==========================================

A production-ready Flask web application with authentication system.

DEPLOYMENT INSTRUCTIONS:
========================

1. PUSH TO GITHUB:
   - Create a new repository on GitHub
   - Run these commands in your terminal:
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/smart-career-mentor.git
     git push -u origin main

2. DEPLOY ON RENDER:
   - Go to https://dashboard.render.com
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Configure:
     * Build Command: (leave empty)
     * Start Command: gunicorn app:app
   - Add Environment Variables:
     * SECRET_KEY: Generate a secure random key (see below)
   - Click "Deploy Web Service"

3. GENERATE SECRET_KEY:
   - Open Python shell: python
   - Run: import secrets; print(secrets.token_hex(32))
   - Copy the result as your SECRET_KEY

4. LOCAL DEVELOPMENT:
   - Create a .env file with:
     SECRET_KEY=your-secret-key-here
     FLASK_DEBUG=1
   - Run: python app.py

5. PRODUCTION:
   - Run: gunicorn app:app
   - Or: gunicorn -w 4 -b 0.0.0.0:5000 app:app
"""

from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime

# ============================================================
# CONFIGURATION
# ============================================================

def get_secret_key():
    """Get SECRET_KEY from environment or generate a default for development."""
    # Try to get from environment variable
    secret_key = os.environ.get('SECRET_KEY')
    if secret_key:
        return secret_key
    # Default for development only (should be overridden in production)
    return os.environ.get('FLASK_SECRET_KEY', 'dev-secret-key-change-in-production')

def get_database_uri():
    """Get database URI from environment or use SQLite default."""
    # Use SQLite with absolute path for production compatibility
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, 'database.db')
    return f'sqlite:///{db_path}'

# Initialize Flask app
app = Flask(__name__)

# Security configuration
app.config['SECRET_KEY'] = get_secret_key()

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = get_database_uri()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Production settings
app.config['SESSION_COOKIE_SECURE'] = os.environ.get('FLASK_DEBUG', '') != '1'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Check if running in debug mode
DEBUG_MODE = os.environ.get('FLASK_DEBUG', '').lower() in ('1', 'true', 'yes')

# Initialize database
db = SQLAlchemy(app)


# ==================== User Model ====================

class User(db.Model):
    """
    User model for authentication and profile management.
    
    Attributes:
        id (int): Primary key
        username (str): Unique username
        email (str): User's email address
        password (str): Hashed password
        created_at (datetime): Account creation timestamp
    """
    
    __tablename__ = 'users'
    
    # Primary key
    id = db.Column(db.Integer, primary_key=True)
    
    # User credentials
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    
    # Timestamp
    created_at = db.Column(db.DateTime, default=db.func.now())
    
    # Relationships
    career_profile = db.relationship('CareerProfile', backref='user', uselist=False)
    job_matches = db.relationship('JobMatch', backref='user')
    resumes = db.relationship('Resume', backref='user')
    interview_sessions = db.relationship('InterviewSession', backref='user')
    learning_paths = db.relationship('LearningPath', backref='user')
    
    def __repr__(self):
        """String representation of the User object."""
        return f'<User {self.username}>'
    
    def to_dict(self):
        """Convert user object to dictionary."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


# ==================== Career Profile Model ====================

class CareerProfile(db.Model):
    """User's career profile with skills and preferences."""
    __tablename__ = 'career_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    
    # Skills
    skills = db.Column(db.Text, default='')  # Comma-separated skills
    experience_years = db.Column(db.Integer, default=0)
    
    # Career preferences
    desired_job_title = db.Column(db.String(100))
    preferred_industry = db.Column(db.String(100))
    preferred_location = db.Column(db.String(100))
    expected_salary = db.Column(db.Integer)
    
    # Assessment results
    assessment_completed = db.Column(db.Boolean, default=False)
    assessment_scores = db.Column(db.JSON, default=dict)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())


# ==================== Job Match Model ====================

class JobMatch(db.Model):
    """AI-generated job matches for users."""
    __tablename__ = 'job_matches'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Job details
    job_title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200))
    location = db.Column(db.String(100))
    salary_range = db.Column(db.String(50))
    job_description = db.Column(db.Text)
    match_score = db.Column(db.Integer)  # 0-100
    
    # Application status
    status = db.Column(db.String(50), default='pending')  # pending, applied, interview, rejected, accepted
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=db.func.now())


# ==================== Resume Model ====================

class Resume(db.Model):
    """User's resume/CV data."""
    __tablename__ = 'resumes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Resume content
    title = db.Column(db.String(200))
    summary = db.Column(db.Text)
    experience = db.Column(db.JSON, default=list)  # List of job experiences
    education = db.Column(db.JSON, default=list)  # List of education
    projects = db.Column(db.JSON, default=list)  # List of projects
    
    # AI suggestions
    ai_suggestions = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())


# ==================== Interview Session Model ====================

class InterviewSession(db.Model):
    """Mock interview sessions."""
    __tablename__ = 'interview_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Session details
    job_title = db.Column(db.String(200))
    difficulty = db.Column(db.String(20), default='medium')  # easy, medium, hard
    
    # Questions and answers
    questions = db.Column(db.JSON, default=list)
    user_answers = db.Column(db.JSON, default=list)
    ai_feedback = db.Column(db.Text)
    
    # Score
    overall_score = db.Column(db.Integer)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=db.func.now())


# ==================== Learning Path Model ====================

class LearningPath(db.Model):
    """User's learning paths/courses."""
    __tablename__ = 'learning_paths'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Course details
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    provider = db.Column(db.String(100))
    duration = db.Column(db.String(50))  # e.g., "6 weeks"
    level = db.Column(db.String(20))  # beginner, intermediate, advanced
    
    # Progress
    progress = db.Column(db.Integer, default=0)  # 0-100
    completed = db.Column(db.Boolean, default=False)
    
    # Resource links
    course_url = db.Column(db.String(500))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=db.func.now())
    completed_at = db.Column(db.DateTime)


# ==================== Sample Data ====================

def init_sample_data():
    """Initialize sample data for the application."""
    # Sample job matches
    sample_jobs = [
        {
            'job_title': 'Software Engineer',
            'company': 'Tech Corp',
            'location': 'San Francisco, CA',
            'salary_range': '$100k - $150k',
            'job_description': 'Looking for a skilled software engineer with experience in Python and JavaScript.',
            'match_score': 92
        },
        {
            'job_title': 'Full Stack Developer',
            'company': 'StartupXYZ',
            'location': 'Remote',
            'salary_range': '$80k - $120k',
            'job_description': 'Join our team as a full stack developer working with React and Node.js.',
            'match_score': 88
        },
        {
            'job_title': 'Data Analyst',
            'company': 'DataDriven Inc',
            'location': 'New York, NY',
            'salary_range': '$70k - $100k',
            'job_description': 'Analyze data and create insights using Python and SQL.',
            'match_score': 85
        }
    ]
    
    # Sample learning paths
    sample_courses = [
        {
            'title': 'Python for Data Science',
            'description': 'Learn Python programming for data analysis and machine learning',
            'provider': 'Coursera',
            'duration': '8 weeks',
            'level': 'Intermediate',
            'course_url': 'https://coursera.org'
        },
        {
            'title': 'Web Development Bootcamp',
            'description': 'Complete web development course covering HTML, CSS, JavaScript, and React',
            'provider': 'Udemy',
            'duration': '12 weeks',
            'level': 'Beginner',
            'course_url': 'https://udemy.com'
        },
        {
            'title': 'Machine Learning Fundamentals',
            'description': 'Introduction to machine learning algorithms and applications',
            'provider': 'edX',
            'duration': '10 weeks',
            'level': 'Advanced',
            'course_url': 'https://edx.org'
        }
    ]
    
    return sample_jobs, sample_courses


# Create database tables
with app.app_context():
    db.create_all()


# ==================== Authentication Routes ====================

@app.route('/')
def index():
    """Redirect to dashboard if logged in, otherwise to login."""
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    """
    User registration route.
    GET: Display registration form
    POST: Process registration data
    """
    if request.method == 'POST':
        # Get form data
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')

        # Validation
        errors = []
        
        if not username or len(username) < 3:
            errors.append('Username must be at least 3 characters.')
        
        if not email or '@' not in email:
            errors.append('Please enter a valid email address.')
        
        if not password or len(password) < 6:
            errors.append('Password must be at least 6 characters.')
        
        if password != confirm_password:
            errors.append('Passwords do not match.')

        # Check if user already exists
        if User.query.filter_by(username=username).first():
            errors.append('Username already exists.')
        
        if User.query.filter_by(email=email).first():
            errors.append('Email already registered.')

        # If there are errors, display them
        if errors:
            for error in errors:
                flash(error, 'error')
            return render_template('register.html')

        # Create new user with hashed password
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, email=email, password=hashed_password)
        
        # Add to database
        db.session.add(new_user)
        db.session.commit()

        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('login'))

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    User login route.
    GET: Display login form
    POST: Process login credentials
    """
    # If already logged in, redirect to dashboard
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    
    # Check for remember me cookie - auto-login if exists
    remember_token = request.cookies.get('remember_token')
    if remember_token:
        username_from_cookie = remember_token
        user = User.query.filter_by(username=username_from_cookie).first()
        if user:
            session['user_id'] = user.id
            session['username'] = user.username
            session['email'] = user.email
            return redirect(url_for('dashboard'))

    if request.method == 'POST':
        # Get form data
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        remember_me = request.form.get('remember_me', False)

        # Find user by username
        user = User.query.filter_by(username=username).first()

        # Verify password
        if user and check_password_hash(user.password, password):
            # Create session
            session['user_id'] = user.id
            session['username'] = user.username
            session['email'] = user.email
            
            # Set remember me cookie if checkbox is checked
            if remember_me:
                response = redirect(url_for('dashboard'))
                response.set_cookie('remember_token', username, max_age=60*60*24*30)  # 30 days
                flash(f'Welcome back, {user.username}!', 'success')
                return response
            
            flash(f'Welcome back, {user.username}!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password.', 'error')

    return render_template('login.html')


@app.route('/dashboard')
def dashboard():
    """
    User dashboard route.
    Requires authentication - redirects to login if not authenticated.
    """
    # Check if user is logged in
    if 'user_id' not in session:
        flash('Please login to access the dashboard.', 'error')
        return redirect(url_for('login'))

    return render_template(
        'dashboard.html',
        username=session.get('username'),
        email=session.get('email')
    )


@app.route('/logout')
def logout():
    """
    User logout route.
    Clears session and redirects to login page.
    """
    # Clear session data
    session.clear()
    flash('You have been logged out successfully.', 'success')
    return redirect(url_for('login'))


# ==================== Career Features Routes ====================

@app.route('/career-assessment', methods=['GET', 'POST'])
def career_assessment():
    """Career assessment page with AI-powered evaluation."""
    if 'user_id' not in session:
        flash('Please login to access this feature.', 'error')
        return redirect(url_for('login'))
    
    # Get or create career profile
    profile = CareerProfile.query.filter_by(user_id=session['user_id']).first()
    if not profile:
        profile = CareerProfile(user_id=session['user_id'])
        db.session.add(profile)
        db.session.commit()
    
    if request.method == 'POST':
        # Save assessment answers
        profile.skills = request.form.get('skills', '')
        profile.experience_years = int(request.form.get('experience_years', 0))
        profile.desired_job_title = request.form.get('desired_job_title', '')
        profile.preferred_industry = request.form.get('preferred_industry', '')
        profile.preferred_location = request.form.get('preferred_location', '')
        profile.expected_salary = int(request.form.get('expected_salary', 0)) if request.form.get('expected_salary') else None
        
        # Calculate assessment scores (simplified AI simulation)
        assessment_scores = {
            'technical_skills': min(100, int(request.form.get('skills', '').count(',') * 15) + 50),
            'experience_score': min(100, profile.experience_years * 10),
            'market_fit': 85,
            'overall_score': 0
        }
        assessment_scores['overall_score'] = (assessment_scores['technical_skills'] + assessment_scores['experience_score'] + assessment_scores['market_fit']) // 3
        
        profile.assessment_scores = assessment_scores
        profile.assessment_completed = True
        profile.updated_at = datetime.now()
        
        db.session.commit()
        
        flash('Career assessment completed! Your results are ready.', 'success')
        return redirect(url_for('career_assessment_results'))
    
    return render_template('career_assessment.html', 
                          username=session.get('username'),
                          profile=profile)


@app.route('/career-assessment/results')
def career_assessment_results():
    """Display career assessment results."""
    if 'user_id' not in session:
        flash('Please login to access this feature.', 'error')
        return redirect(url_for('login'))
    
    profile = CareerProfile.query.filter_by(user_id=session['user_id']).first()
    
    if not profile or not profile.assessment_completed:
        flash('Please complete the career assessment first.', 'warning')
        return redirect(url_for('career_assessment'))
    
    return render_template('assessment_results.html',
                          username=session.get('username'),
                          profile=profile)


@app.route('/job-matches')
def job_matches():
    """AI Job Matching page."""
    if 'user_id' not in session:
        flash('Please login to access this feature.', 'error')
        return redirect(url_for('login'))
    
    # Get existing job matches or create sample ones
    user_jobs = JobMatch.query.filter_by(user_id=session['user_id']).all()
    
    if not user_jobs:
        # Create sample job matches
        sample_jobs, _ = init_sample_data()
        for job in sample_jobs:
            new_job = JobMatch(
                user_id=session['user_id'],
                job_title=job['job_title'],
                company=job['company'],
                location=job['location'],
                salary_range=job['salary_range'],
                job_description=job['job_description'],
                match_score=job['match_score']
            )
            db.session.add(new_job)
        db.session.commit()
        user_jobs = JobMatch.query.filter_by(user_id=session['user_id']).all()
    
    return render_template('job_matches.html',
                          username=session.get('username'),
                          jobs=user_jobs)


@app.route('/job-match/apply/<int:job_id>', methods=['POST'])
def apply_job(job_id):
    """Apply for a job."""
    if 'user_id' not in session:
        flash('Please login to apply for jobs.', 'error')
        return redirect(url_for('login'))
    
    job = JobMatch.query.get(job_id)
    if job and job.user_id == session['user_id']:
        job.status = 'applied'
        db.session.commit()
        flash(f'Applied for {job.job_title} at {job.company}!', 'success')
    
    return redirect(url_for('job_matches'))


@app.route('/resume-builder', methods=['GET', 'POST'])
def resume_builder():
    """Resume Builder page."""
    if 'user_id' not in session:
        flash('Please login to access this feature.', 'error')
        return redirect(url_for('login'))
    
    # Get user's resumes
    resumes = Resume.query.filter_by(user_id=session['user_id']).all()
    
    if request.method == 'POST':
        # Create new resume
        new_resume = Resume(
            user_id=session['user_id'],
            title=request.form.get('title', 'My Resume'),
            summary=request.form.get('summary', ''),
            experience=request.form.getlist('experience[]'),
            education=request.form.getlist('education[]'),
            projects=request.form.getlist('projects[]')
        )
        
        # Generate AI suggestions
        new_resume.ai_suggestion = "Great start! Consider adding more quantifiable achievements and specific technical skills."
        
        db.session.add(new_resume)
        db.session.commit()
        
        flash('Resume created successfully!', 'success')
        return redirect(url_for('resume_builder'))
    
    return render_template('resume_builder.html',
                          username=session.get('username'),
                          resumes=resumes)


@app.route('/resume/delete/<int:resume_id>', methods=['POST'])
def delete_resume(resume_id):
    """Delete a resume."""
    if 'user_id' not in session:
        flash('Please login to delete resumes.', 'error')
        return redirect(url_for('login'))
    
    resume = Resume.query.get(resume_id)
    if resume and resume.user_id == session['user_id']:
        db.session.delete(resume)
        db.session.commit()
        flash('Resume deleted successfully!', 'success')
    
    return redirect(url_for('resume_builder'))


@app.route('/interview-prep', methods=['GET', 'POST'])
def interview_prep():
    """Interview Preparation page."""
    if 'user_id' not in session:
        flash('Please login to access this feature.', 'error')
        return redirect(url_for('login'))
    
    # Get user's interview sessions
    sessions = InterviewSession.query.filter_by(user_id=session['user_id']).order_by(InterviewSession.created_at.desc()).all()
    
    if request.method == 'POST':
        # Create new mock interview session
        new_session = InterviewSession(
            user_id=session['user_id'],
            job_title=request.form.get('job_title', 'Software Engineer'),
            difficulty=request.form.get('difficulty', 'medium')
        )
        
        # Generate sample questions based on job title
        questions = [
            "Tell me about yourself and why you're interested in this role.",
            "What are your greatest strengths and weaknesses?",
            "Describe a challenging project you worked on and how you overcame obstacles.",
            "Where do you see yourself in 5 years?",
            "Why should we hire you?"
        ]
        
        new_session.questions = questions
        new_session.user_answers = [''] * len(questions)
        new_session.ai_feedback = "Practice answering these common interview questions. Focus on specific examples from your experience."
        
        db.session.add(new_session)
        db.session.commit()
        
        flash('Mock interview session created!', 'success')
        return redirect(url_for('interview_session', session_id=new_session.id))
    
    return render_template('interview_prep.html',
                          username=session.get('username'),
                          sessions=sessions)


@app.route('/interview/<int:session_id>', methods=['GET', 'POST'])
def interview_session(session_id):
    """Individual interview session page."""
    if 'user_id' not in session:
        flash('Please login to access this feature.', 'error')
        return redirect(url_for('login'))
    
    interview = InterviewSession.query.get(session_id)
    if not interview or interview.user_id != session['user_id']:
        flash('Interview session not found.', 'error')
        return redirect(url_for('interview_prep'))
    
    if request.method == 'POST':
        # Save user's answers
        answers = []
        for i in range(len(interview.questions)):
            answer = request.form.get(f'answer_{i}', '')
            answers.append(answer)
        
        interview.user_answers = answers
        
        # Generate AI feedback (simplified)
        interview.ai_feedback = "Good effort! For better results: 1) Use the STAR method for behavioral questions. 2) Be specific with examples. 3) Practice speaking clearly and confidently."
        interview.overall_score = 75
        
        db.session.commit()
        
        flash('Interview answers saved! Check your feedback below.', 'success')
    
    return render_template('interview_session.html',
                          username=session.get('username'),
                          interview=interview)


@app.route('/learning-paths')
def learning_paths():
    """Learning Paths page."""
    if 'user_id' not in session:
        flash('Please login to access this feature.', 'error')
        return redirect(url_for('login'))
    
    # Get user's learning paths or create sample ones
    user_paths = LearningPath.query.filter_by(user_id=session['user_id']).all()
    
    if not user_paths:
        # Create sample learning paths
        _, sample_courses = init_sample_data()
        for course in sample_courses:
            new_path = LearningPath(
                user_id=session['user_id'],
                title=course['title'],
                description=course['description'],
                provider=course['provider'],
                duration=course['duration'],
                level=course['level'],
                course_url=course['course_url']
            )
            db.session.add(new_path)
        db.session.commit()
        user_paths = LearningPath.query.filter_by(user_id=session['user_id']).all()
    
    return render_template('learning_paths.html',
                          username=session.get('username'),
                          paths=user_paths)


@app.route('/learning-path/update/<int:path_id>', methods=['POST'])
def update_learning_progress(path_id):
    """Update learning path progress."""
    if 'user_id' not in session:
        flash('Please login to update progress.', 'error')
        return redirect(url_for('login'))
    
    path = LearningPath.query.get(path_id)
    if path and path.user_id == session['user_id']:
        path.progress = int(request.form.get('progress', 0))
        if path.progress >= 100:
            path.completed = True
            path.completed_at = datetime.now()
        db.session.commit()
    
    return redirect(url_for('learning_paths'))


# ==================== API Routes (for future AJAX calls) ====================

@app.route('/api/profile')
def api_profile():
    """Get user profile data."""
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    profile = CareerProfile.query.filter_by(user_id=session['user_id']).first()
    if profile:
        return jsonify(profile.to_dict())
    return jsonify({})


# ==================== Error Handlers ====================

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors."""
    return "<h1>404 - Page Not Found</h1><p>The requested page was not found.</p>", 404


@app.errorhandler(500)
def internal_server_error(e):
    """Handle 500 errors."""
    return "<h1>500 - Internal Server Error</h1><p>Something went wrong. Please try again later.</p>", 500


# ==================== Main ====================

if __name__ == '__main__':
    # Run the application
    # Use DEBUG_MODE for development, False for production (via gunicorn)
    app.run(debug=DEBUG_MODE, host='0.0.0.0', port=5000)
