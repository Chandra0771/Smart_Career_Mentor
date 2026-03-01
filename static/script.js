/**
 * AI Smart Career Mentor - JavaScript (Flask Backend)
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
    setTimeout(() => notification.remove(), 5000);
}

function createFlashContainer() {
    const container = document.createElement('div');
    container.className = 'flash-messages';
    document.body.appendChild(container);
    return container;
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';
            
            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');
            const rememberMe = formData.get('remember_me') === 'on';
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ email, password, rememberMe }),
                    credentials: 'include'
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification(data.message || 'Login successful!', 'success');
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 500);
                } else {
                    showNotification(data.message || 'Invalid credentials', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            } catch (error) {
                console.error('Login error:', error);
                showNotification('Connection failed. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
    
    // Register Form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registering...';
            
            const formData = new FormData(registerForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');
            const confirm_password = formData.get('confirm_password');
            
            if (password !== confirm_password) {
                showNotification('Passwords do not match', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }
            
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ name, email, password }),
                    credentials: 'include'
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification(data.message || 'Registration successful!', 'success');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1000);
                } else {
                    // Handle validation errors
                    if (data.errors) {
                        const errorMessages = data.errors.map(err => err.msg || err.message).join(', ');
                        showNotification(errorMessages, 'error');
                    } else {
                        showNotification(data.message || 'Registration failed. Please check your details.', 'error');
                    }
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            } catch (error) {
                console.error('Registration error:', error);
                showNotification('Connection failed. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});
