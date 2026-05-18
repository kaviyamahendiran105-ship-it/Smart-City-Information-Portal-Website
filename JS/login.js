/**
 * login.js - Login Page Validation & Functionality
 * 
 * Handles:
 * - Username and email validation
 * - Error messages for invalid input
 * - Empty field prevention
 * - localStorage storage for login preferences
 * - Form submission with success message and redirect
 * - Skip button and back to home link
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const loginForm = document.querySelector('.login-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const submitBtn = document.querySelector('.login-btn');
    const skipBtn = document.querySelector('.skip-btn');
    const backHomeBtn = document.querySelector('.back-home-btn');

    // Helper: Show error message
    const showError = (input, message) => {
        // Remove any existing error for this input
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Create error element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #dc3545;
            font-size: 0.85rem;
            margin-top: 5px;
            padding: 5px 10px;
            background: #f8d7da;
            border-radius: 5px;
            animation: fadeIn 0.3s ease;
        `;
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) errorDiv.remove();
        }, 3000);
    };

    // Helper: Show success message (toast)
    const showSuccess = (message) => {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // Validate email format
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Main form submission handler
    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear any previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        let isValid = true;
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();

        // Validate username
        if (!username) {
            showError(usernameInput, 'Username is required');
            isValid = false;
        } else if (username.length < 3) {
            showError(usernameInput, 'Username must be at least 3 characters');
            isValid = false;
        }

        // Validate email
        if (!email) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError(emailInput, 'Please enter a valid email address (e.g., name@example.com)');
            isValid = false;
        }

        if (isValid) {
            // Save login info to localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('loginTime', new Date().toISOString());

            // Show success message
            showSuccess(`Welcome back, ${username}! Redirecting to home...`);

            // Redirect to home page after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    };

    // Attach event listener to form
    if (loginForm) {
        loginForm.addEventListener('submit', handleSubmit);
    }

    // Optional: Skip button already goes to destinations section; we can add a check if user is already logged in
    if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
            // Optionally, you could record that the user skipped
            localStorage.setItem('skipLogin', 'true');
        });
    }

    // If user is already logged in, update UI (optional)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('userEmail');
        // Pre-fill the form if desired
        if (usernameInput) usernameInput.value = username;
        if (emailInput) emailInput.value = email;
        // Show a message that they are already logged in
        showSuccess(`You are already logged in as ${username}. You can continue exploring.`);
    }

    // Add animation styles (if not already in main CSS)
    const addStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    };
    addStyles();
});