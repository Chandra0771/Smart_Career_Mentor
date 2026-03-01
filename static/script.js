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
            const username = formData.get('email') || formData.get('username');
            const password = formData.get('password');
            
            try {
                const params = new URLSearchParams();
                params.append('username', username);
                params.append('password', password);
                
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: params.toString(),
                    credentials: 'include'
                });
                
                if (response.redirected) {
                    window.location.href = response.url;
                } else if (response.ok) {
                    window.location.href = '/dashboard';
                } else {
                    showNotification('Invalid username or password', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            } catch (error) {
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
            const username = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');
            const confirmPassword = formData.get('confirm_password');
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }
            
            try {
                const params = new URLSearchParams();
                params.append('username', username);
                params.append('email', email);
                params.append('password', password);
                params.append('confirm_password', confirmPassword);
                
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: params.toString(),
                    credentials: 'include'
                });
                
                if (response.redirected) {
                    window.location.href = response.url;
                } else if (response.ok) {
                    window.location.href = '/login';
                } else {
                    showNotification('Registration failed. Please check your details.', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            } catch (error) {
                showNotification('Connection failed. Please try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});
