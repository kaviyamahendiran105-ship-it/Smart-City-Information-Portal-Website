document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    const cityMap = {
        'chennai': 'chennai.html',
        'madurai': 'madurai.html',
        'ooty': 'ooty.html',
        'kodaikanal': 'kodaikanal.html',
        'thanjavur': 'thanjavur.html',
        'coimbatore': 'coimbatore.html'
    };

    function redirectToCity(cityName) {
        const key = cityName.toLowerCase().trim();
        if (cityMap[key]) {
            window.location.href = cityMap[key];
        } else {
            alert(`"${cityName}" not found. Try Chennai, Madurai, Ooty, etc.`);
        }
    }

    function handleSearch() {
        const query = searchInput.value.trim();
        if (query === '') {
            alert('Please enter a city name');
            return;
        }
        redirectToCity(query);
    }

    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    const form = document.getElementById('signupForm');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const termsCheck = document.getElementById('terms');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmError = document.getElementById('confirmError');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirm = document.getElementById('toggleConfirmPassword');
    const signupBtn = document.getElementById('signupBtn');

    function showError(element, message) {
        element.textContent = message;
        const inputField = element.parentElement.querySelector('input');
        if (inputField) {
            inputField.style.borderColor = '#e53e3e';
            inputField.style.boxShadow = '0 0 0 3px rgba(229,62,62,0.1)';
        }
    }

    function clearError(element) {
        element.textContent = '';
        const inputField = element.parentElement.querySelector('input');
        if (inputField) {
            inputField.style.borderColor = '#e2e8f0';
            inputField.style.boxShadow = 'none';
        }
    }

    function getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function showToast(message, isSuccess = true) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: ${isSuccess ? '#28a745' : '#dc3545'};
            color: white;
            padding: 12px 24px;
            border-radius: 40px;
            font-family: 'Poppins', sans-serif;
            font-size: 0.95rem;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transition: transform 0.3s ease;
            pointer-events: none;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    fullnameInput.addEventListener('input', () => clearError(nameError));
    emailInput.addEventListener('input', () => clearError(emailError));
    passwordInput.addEventListener('input', () => clearError(passwordError));
    confirmInput.addEventListener('input', () => clearError(confirmError));

    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye-slash');
            togglePassword.classList.toggle('fa-eye');
        });
    }

    if (toggleConfirm) {
        toggleConfirm.addEventListener('click', () => {
            const type = confirmInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmInput.setAttribute('type', type);
            toggleConfirm.classList.toggle('fa-eye-slash');
            toggleConfirm.classList.toggle('fa-eye');
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        clearError(nameError);
        clearError(emailError);
        clearError(passwordError);
        clearError(confirmError);

        let isValid = true;
        const fullname = fullnameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirm = confirmInput.value;

        if (!fullname) {
            showError(nameError, 'Full name is required');
            isValid = false;
        } else if (fullname.length < 3) {
            showError(nameError, 'Name must be at least 3 characters');
            isValid = false;
        }

        if (!email) {
            showError(emailError, 'Email address is required');
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            showError(emailError, 'Enter a valid email address (e.g., name@domain.com)');
            isValid = false;
        }

        const users = getUsers();
        if (users.find(u => u.email === email)) {
            showError(emailError, 'Email already registered. Please login.');
            isValid = false;
        }

        if (!password) {
            showError(passwordError, 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError(passwordError, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!confirm) {
            showError(confirmError, 'Please confirm your password');
            isValid = false;
        } else if (password !== confirm) {
            showError(confirmError, 'Passwords do not match');
            isValid = false;
        }

        if (!termsCheck.checked) {
            showToast('Please accept the Terms of Service and Privacy Policy', false);
            isValid = false;
        }

        if (!isValid) return;

        signupBtn.classList.add('loading');
        const originalText = signupBtn.innerHTML;
        signupBtn.innerHTML = '<span>Creating account...</span><i class="fas fa-spinner fa-pulse"></i>';

        setTimeout(() => {
            const newUser = {
                id: Date.now(),
                name: fullname,
                email: email,
                password: password
            };
            users.push(newUser);
            saveUsers(users);

            signupBtn.classList.remove('loading');
            signupBtn.innerHTML = originalText;

            showToast('Account created successfully! Redirecting to login...', true);

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }, 1200);
    });

    const googleBtn = document.getElementById('googleBtn');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            alert('Google Sign-In would redirect to OAuth flow. For demo, we simulate signup.');
            const randomId = Date.now();
            const users = getUsers();
            users.push({
                id: randomId,
                name: 'Google User',
                email: 'google_user@cityscope.com',
                password: 'google_oauth_demo'
            });
            saveUsers(users);
            showToast('Google signup successful! Redirecting to login...', true);
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }

    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backBtn.classList.add('visible');
            else backBtn.classList.remove('visible');
        });
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const menuToggle = document.getElementById('menu-toggle');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    if (mobileBtn && menuToggle) {
        mobileBtn.addEventListener('click', () => {
            menuToggle.checked = !menuToggle.checked;
        });
        const mobileLinks = document.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.checked = false;
            });
        });
    }
});