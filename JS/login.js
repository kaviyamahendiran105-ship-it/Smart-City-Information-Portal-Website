document.addEventListener('DOMContentLoaded', () => {
    // ===================== SEARCH FUNCTIONALITY =====================
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

    // ===================== LOGIN FORM =====================
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const togglePassword = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn');
    const rememberCheck = document.getElementById('remember');

    // ----- FIX: Floating label manager -----
    function updateLabelState(input) {
        const field = input.closest('.input-field');
        if (!field) return;
        const label = field.querySelector('label');
        if (!label) return;
        if (input.value.trim() !== '' || document.activeElement === input) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    }

    // Add CSS for label active state if needed
    const style = document.createElement('style');
    style.textContent = `
        .input-field label.active {
            top: 0px !important;
            transform: translateY(-50%) !important;
            font-size: 0.75rem !important;
            color: var(--primary-color) !important;
            font-weight: 600 !important;
        }
    `;
    document.head.appendChild(style);

    // Attach event listeners to both inputs
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => updateLabelState(input));
        input.addEventListener('focus', () => updateLabelState(input));
        input.addEventListener('blur', () => updateLabelState(input));
        // initial check
        updateLabelState(input);
    });

    // ----- error helpers -----
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

    // ----- real‑time clearing -----
    emailInput.addEventListener('input', () => {
        clearError(emailError);
        updateLabelState(emailInput);
    });
    passwordInput.addEventListener('input', () => {
        clearError(passwordError);
        updateLabelState(passwordInput);
    });

    // ----- password toggle -----
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye-slash');
            togglePassword.classList.toggle('fa-eye');
        });
    }

    // ----- remember me -----
    if (localStorage.getItem('rememberedEmail')) {
        emailInput.value = localStorage.getItem('rememberedEmail');
        rememberCheck.checked = true;
        updateLabelState(emailInput);
    }

    // ----- toast helpers -----
    function showSuccessToast(message, redirectUrl = null, delay = 1800) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: #28a745;
            color: white;
            padding: 14px 28px;
            border-radius: 50px;
            font-family: 'Poppins', sans-serif;
            font-size: 1rem;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        toast.innerHTML = `<i class="fas fa-check-circle" style="font-size: 1.2rem;"></i> ${message}`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 50);
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => {
                toast.remove();
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                }
            }, 400);
        }, delay);
    }

    function showErrorToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: #dc3545;
            color: white;
            padding: 14px 28px;
            border-radius: 50px;
            font-family: 'Poppins', sans-serif;
            font-size: 1rem;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        toast.innerHTML = `<i class="fas fa-exclamation-circle" style="font-size: 1.2rem;"></i> ${message}`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 50);
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ----- get users from localStorage -----
    function getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // ----- form submission -----
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        clearError(emailError);
        clearError(passwordError);

        let isValid = true;
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // validate email
        if (!email) {
            showError(emailError, 'Email address is required');
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            showError(emailError, 'Enter a valid email address (e.g., name@domain.com)');
            isValid = false;
        }

        // validate password
        if (!password) {
            showError(passwordError, 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError(passwordError, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!isValid) return;

        // loading state
        loginBtn.classList.add('loading');
        const originalText = loginBtn.innerHTML;
        loginBtn.innerHTML = '<span>Signing in...</span><i class="fas fa-spinner fa-pulse"></i>';

        // simulate async authentication
        setTimeout(() => {
            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            const isDemo = (email === 'demo@cityscope.com' && password === 'password123');

            if (user || isDemo) {
                if (rememberCheck.checked) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                localStorage.setItem('isLoggedIn', 'true');
                const displayName = user ? user.name : email.split('@')[0];
                localStorage.setItem('username', displayName);

                loginBtn.classList.remove('loading');
                loginBtn.innerHTML = originalText;

                showSuccessToast('Sign in successfully! Redirecting...', 'index.html', 1800);
            } else {
                loginBtn.classList.remove('loading');
                loginBtn.innerHTML = originalText;
                showErrorToast('Invalid email or password. Please try again.');
                passwordInput.value = '';
                updateLabelState(passwordInput);
                passwordInput.focus();
            }
        }, 1200);
    });

    // ===================== CONTINUE WITH GOOGLE =====================
    const googleBtn = document.getElementById('googleBtn');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            const users = getUsers();
            const googleUser = users.find(u => u.email === 'google_user@cityscope.com');
            if (googleUser) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', googleUser.name);
                showSuccessToast('Sign in successfully with Google!', 'index.html', 1500);
            } else {
                showErrorToast('Google account not found. Please sign up first.');
            }
        });
    }

    // ===================== DEMO HINT AUTO-FILL =====================
    const demoHint = document.querySelector('.demo-hint');
    if (demoHint) {
        demoHint.addEventListener('click', () => {
            emailInput.value = 'demo@cityscope.com';
            passwordInput.value = 'password123';
            updateLabelState(emailInput);
            updateLabelState(passwordInput);
            clearError(emailError);
            clearError(passwordError);
        });
    }

    // ===================== BACK TO TOP =====================
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

    // ===================== MOBILE MENU =====================
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