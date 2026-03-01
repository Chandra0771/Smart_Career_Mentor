/**
 * AI Smart Career Mentor - JavaScript (Node.js/Express Backend)
 * Handles client-side interactions and API calls
 */

// Base API URL
const API_URL = '';

// ==================== Utility Functions ====================

/**
 * Show notification message
 */
function showNotification(message, type = 'success') {
    const container = document.querySelector('.flash-messages') || createFlashContainer();
    const notification = document.createElement('div');
    notification.className = `flash-message flash-${type}`;
    notification.innerHTML = `
        <span class="flash-icon">${type === 'success' ? '✓' : '⚠'}</span>
        ${message}
        <button class="flash-close" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s ease-out forwards';
        setTimeout(() => notification.remove(), 400);
    }, 5000);
}

function createFlashContainer() {
    const container = document.createElement('div');
    container.className = 'flash-messages';
    document.body.appendChild(container);
    return container;
}

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Make API request
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();
        return { status: response.status, ...result };
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

// ==================== DOM Ready ====================

document.addEventListener('DOMContentLoaded', function() {
    
    // Add slideOut animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // ==================== Auto-hide Flash Messages ====================
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(function(message) {
        setTimeout(function() {
            message.style.animation = 'slideOut 0.4s ease-out forwards';
            setTimeout(function() { message.remove(); }, 400);
        }, 5000);
    });
    
    // ==================== Login Form ====================
    const loginForm = document.getElementById('login-form') || document.querySelector('form[action*="login"]');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            const email = formData.get('email') || formData.get('username');
            const password = formData.get('password');
            const rememberMe = formData.get('remember_me') === 'on';
            
            const result = await apiRequest('/api/auth/login', 'POST', { 
                email, 
                password,
                rememberMe 
            });
            
            if (result.success) {
                showNotification('Login successful!', 'success');
                setTimeout(() => window.location.href = '/dashboard', 1000);
            } else {
                showNotification(result.message || 'Login failed', 'error');
            }
        });
    }
    
    // ==================== Register Form ====================
    const registerForm = document.getElementById('register-form') || document.querySelector('form[action*="register"]');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            const name = formData.get('name') || formData.get('username');
            const email = formData.get('email');
            const password = formData.get('password');
            const confirmPassword = formData.get('confirm_password');
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            const result = await apiRequest('/api/auth/register', 'POST', { 
                name, 
                email, 
                password 
            });
            
            if (result.success) {
                showNotification('Registration successful!', 'success');
                setTimeout(() => window.location.href = '/dashboard', 1000);
            } else {
                showNotification(result.message || 'Registration failed', 'error');
            }
        });
    }
    
    // ==================== Logout ====================
    const logoutBtn = document.querySelector('.logout-btn') || document.querySelector('a[href*="logout"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            if (this.tagName === 'A' && !this.href.includes('javascript:')) {
                return; // Let regular link work
            }
            
            e.preventDefault();
            const result = await apiRequest('/api/auth/logout', 'POST');
            
            if (result.success) {
                showNotification('Logged out successfully', 'success');
                setTimeout(() => window.location.href = '/login', 1000);
            }
        });
    }
    
    // ==================== Career Assessment Form ====================
    const assessmentForm = document.getElementById('assessment-form');
    if (assessmentForm) {
        assessmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(assessmentForm);
            const data = {
                skills: formData.get('skills'),
                experienceYears: formData.get('experience_years'),
                desiredJobTitle: formData.get('desired_job_title'),
                preferredIndustry: formData.get('preferred_industry'),
                preferredLocation: formData.get('preferred_location'),
                expectedSalary: formData.get('expected_salary')
            };
            
            const result = await apiRequest('/api/career/assessment', 'POST', data);
            
            if (result.success) {
                showNotification('Assessment completed!', 'success');
                setTimeout(() => window.location.href = '/assessment-results', 1500);
            } else {
                showNotification(result.message || 'Assessment failed', 'error');
            }
        });
    }
    
    // ==================== Job Matching ====================
    const applyButtons = document.querySelectorAll('.apply-job-btn');
    applyButtons.forEach(function(btn) {
        btn.addEventListener('click', async function() {
            const jobId = this.dataset.jobId;
            const result = await apiRequest(`/api/career/jobs/${jobId}/apply`, 'POST');
            
            if (result.success) {
                showNotification('Application submitted!', 'success');
                this.textContent = 'Applied';
                this.disabled = true;
                this.classList.add('applied');
            } else {
                showNotification(result.message || 'Application failed', 'error');
            }
        });
    });
    
    // ==================== Resume Builder ====================
    const resumeForm = document.getElementById('resume-form');
    if (resumeForm) {
        resumeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(resumeForm);
            const data = {
                title: formData.get('title') || 'My Resume',
                summary: formData.get('summary'),
                experience: [],
                education: [],
                projects: []
            };
            
            // Parse experience entries
            const expCompanies = formData.getAll('exp_company[]');
            const expPositions = formData.getAll('exp_position[]');
            expCompanies.forEach((company, i) => {
                if (company || expPositions[i]) {
                    data.experience.push({
                        company: company,
                        position: expPositions[i],
                        duration: formData.getAll('exp_duration[]')[i] || '',
                        description: formData.getAll('exp_description[]')[i] || ''
                    });
                }
            });
            
            const result = await apiRequest('/api/career/resumes', 'POST', data);
            
            if (result.success) {
                showNotification('Resume created!', 'success');
                loadResumes();
            } else {
                showNotification(result.message || 'Failed to create resume', 'error');
            }
        });
    }
    
    // ==================== Interview Session ====================
    const interviewForm = document.getElementById('interview-form');
    if (interviewForm) {
        interviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const jobTitle = document.getElementById('job-title')?.value || 'Software Engineer';
            const difficulty = document.getElementById('difficulty')?.value || 'medium';
            
            const result = await apiRequest('/api/career/interviews', 'POST', { 
                jobTitle, 
                difficulty 
            });
            
            if (result.success) {
                showNotification('Interview session created!', 'success');
                setTimeout(() => window.location.href = `/interview-session/${result.session._id}`, 1500);
            } else {
                showNotification(result.message || 'Failed to create session', 'error');
            }
        });
    }
    
    // Save interview answers
    const saveAnswersBtn = document.getElementById('save-answers-btn');
    if (saveAnswersBtn) {
        saveAnswersBtn.addEventListener('click', async function() {
            const sessionId = this.dataset.sessionId;
            const answers = [];
            
            document.querySelectorAll('.answer-input').forEach(function(input) {
                answers.push(input.value);
            });
            
            const result = await apiRequest(`/api/career/interviews/${sessionId}`, 'PUT', { 
                userAnswers: answers 
            });
            
            if (result.success) {
                showNotification('Answers saved!', 'success');
            } else {
                showNotification(result.message || 'Failed to save answers', 'error');
            }
        });
    }
    
    // ==================== Learning Paths ====================
    const updateProgressBtns = document.querySelectorAll('.update-progress-btn');
    updateProgressBtns.forEach(function(btn) {
        btn.addEventListener('click', async function() {
            const pathId = this.dataset.pathId;
            const progress = document.getElementById(`progress-${pathId}`)?.value || 0;
            
            const result = await apiRequest(`/api/career/learning-paths/${pathId}`, 'PUT', { 
                progress 
            });
            
            if (result.success) {
                showNotification('Progress updated!', 'success');
                location.reload();
            } else {
                showNotification(result.message || 'Failed to update progress', 'error');
            }
        });
    });
    
    // ==================== Form Validation ====================
    const forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        const inputs = form.querySelectorAll('.form-input, input[type="text"], input[type="email"], input[type="password"]');
        
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            });
        });
    });
    
    function validateInput(input) {
        let isValid = true;
        const value = input.value.trim();
        
        if (input.hasAttribute('required') && !value) {
            isValid = false;
        }
        
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }
        
        if (input.type === 'password' && value && input.id === 'password' && value.length < 6) {
            isValid = false;
        }
        
        if (!isValid && value) {
            input.style.borderColor = '#ef4444';
        } else if (value) {
            input.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        }
        
        return isValid;
    }
    
    // ==================== Check Auth Status ====================
    checkAuthStatus();
    
    async function checkAuthStatus() {
        const result = await apiRequest('/api/auth/me');
        
        if (!result.success) {
            // Not logged in - could redirect to login
            console.log('Not authenticated');
        }
    }
    
    // ==================== Load Data Functions ====================
    
    // Load resumes
    window.loadResumes = async function() {
        const result = await apiRequest('/api/career/resumes');
        if (result.success) {
            const container = document.getElementById('resumes-container');
            if (container) {
                container.innerHTML = result.resumes.map(resume => `
                    <div class="resume-card">
                        <h3>${resume.title}</h3>
                        <p>${resume.summary || 'No summary'}</p>
                        <button onclick="deleteResume('${resume._id}')">Delete</button>
                    </div>
                `).join('');
            }
        }
    };
    
    // Delete resume
    window.deleteResume = async function(resumeId) {
        if (!confirm('Are you sure you want to delete this resume?')) return;
        
        const result = await apiRequest(`/api/career/resumes/${resumeId}`, 'DELETE');
        
        if (result.success) {
            showNotification('Resume deleted', 'success');
            loadResumes();
        } else {
            showNotification(result.message, 'error');
        }
    };
    
    // ==================== Animations ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.glass-card, .auth-card');
    animatedElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { apiRequest, showNotification, formatDate };
}
