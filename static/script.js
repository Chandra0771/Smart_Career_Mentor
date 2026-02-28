/**
 * AI Smart Career Mentor - JavaScript
 * Handles client-side interactions and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== Auto-hide Flash Messages ====================
    const flashMessages = document.querySelectorAll('.flash-message');
    
    flashMessages.forEach(function(message) {
        // Auto-hide after 5 seconds
        setTimeout(function() {
            message.style.animation = 'slideOut 0.4s ease-out forwards';
            setTimeout(function() {
                message.remove();
            }, 400);
        }, 5000);
    });
    
    // ==================== Slide Out Animation ====================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ==================== Form Validation ====================
    const forms = document.querySelectorAll('form');
    
    forms.forEach(function(form) {
        // Real-time validation feedback
        const inputs = form.querySelectorAll('.form-input');
        
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                // Clear error state on input
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            });
        });
        
        // Form submission validation
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(function(input) {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            // Password confirmation check for register form
            if (form.querySelector('#password') && form.querySelector('#confirm_password')) {
                const password = form.querySelector('#password').value;
                const confirmPassword = form.querySelector('#confirm_password').value;
                
                if (password !== confirmPassword) {
                    form.querySelector('#confirm_password').style.borderColor = '#ef4444';
                    isValid = false;
                }
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    // ==================== Input Validation Function ====================
    function validateInput(input) {
        let isValid = true;
        const value = input.value.trim();
        
        // Required validation
        if (input.hasAttribute('required') && !value) {
            isValid = false;
        }
        
        // Username validation
        if (input.id === 'username' && value) {
            if (value.length < 3) {
                isValid = false;
            }
        }
        
        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }
        
        // Password validation
        if (input.type === 'password' && value) {
            if (input.id === 'password' && value.length < 6) {
                isValid = false;
            }
        }
        
        // Visual feedback
        if (!isValid && value) {
            input.style.borderColor = '#ef4444';
        } else if (value) {
            input.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        } else {
            input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
        
        return isValid;
    }
    
    // ==================== Smooth Scroll ====================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ==================== Keyboard Accessibility ====================
    document.addEventListener('keydown', function(e) {
        // Close flash messages with Escape key
        if (e.key === 'Escape') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('flash-close')) {
                focusedElement.click();
            }
        }
        
        // Enter key navigation for buttons
        if (e.key === 'Enter' && document.activeElement.tagName === 'A') {
            document.activeElement.click();
        }
    });
    
    // ==================== Loading States ====================
    // Form submissions are handled by Flask server-side
    // No client-side loading state needed - the page will redirect after processing
    
    // ==================== Animations on Scroll ====================
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
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.glass-card, .auth-card');
    animatedElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ==================== Logout Confirmation ====================
    const logoutLink = document.querySelector('.logout-btn');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            // Allow the link to work normally (redirects to logout route)
            // Optional: Add confirmation if needed
            // e.preventDefault();
            // if (confirm('Are you sure you want to logout?')) {
            //     window.location.href = this.href;
            // }
        });
    }
});

/**
 * Utility: Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Utility: Show notification (alternative to flash messages)
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `flash-message flash-${type}`;
    notification.innerHTML = `
        <span class="flash-icon">${type === 'success' ? '✓' : '⚠'}</span>
        ${message}
        <button class="flash-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    const container = document.querySelector('.flash-messages') || createFlashContainer();
    container.appendChild(notification);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function createFlashContainer() {
    const container = document.createElement('div');
    container.className = 'flash-messages';
    document.body.appendChild(container);
    return container;
}
