/**
 * CityScope - Main JavaScript File (ES6 + Fetch API)
 * 
 * Features:
 * - Smooth scrolling and active menu highlighting
 * - Login and form validation with localStorage
 * - Dynamic destination content loaded via Fetch API
 * - Search bar that redirects to city pages
 * - Button click animations
 * - Image slider with auto-play
 * - Back to top button enhancement
 * - Visitor count and login status stored in localStorage
 */

document.addEventListener('DOMContentLoaded', async () => {
    // ========================== UTILITY FUNCTIONS ==========================
    
    // Show error message near an input
    const showError = (input, message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 5px;
            padding: 5px 10px;
            background: #f8d7da;
            border-radius: 5px;
            animation: fadeIn 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        const existing = input.parentNode.querySelector('.error-message');
        if (existing) existing.remove();
        input.parentNode.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 3000);
    };
    
    // Show floating success message
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
    
    // Get current page filename
    const getCurrentPage = () => {
        const path = window.location.pathname;
        return path.split('/').pop().split('.')[0] || 'index';
    };
    
    // ========================== 1. SMOOTH SCROLLING & ACTIVE MENU ==========================
    
    const initSmoothScrolling = () => {
        const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        links.forEach(link => {
            link.addEventListener('click', e => {
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.pushState(null, null, targetId);
                }
            });
        });
    };
    
    const initActiveMenu = () => {
        const currentPage = getCurrentPage();
        const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const linkPage = href.split('/').pop().split('.')[0];
                if (linkPage === currentPage) {
                    link.classList.add('active');
                    if (link.classList.contains('nav-link')) {
                        link.style.fontWeight = 'bold';
                        link.style.color = '#ff6b6b';
                    }
                }
            }
        });
    };
    
    // ========================== 2. LOGIN VALIDATION ==========================
    
    const initLoginValidation = () => {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;
        
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            
            let isValid = true;
            
            if (!username.value.trim()) {
                showError(username, 'Username is required');
                isValid = false;
            } else if (username.value.trim().length < 3) {
                showError(username, 'Username must be at least 3 characters');
                isValid = false;
            }
            
            if (!password.value) {
                showError(password, 'Password is required');
                isValid = false;
            } else if (password.value.length < 4) {
                showError(password, 'Password must be at least 4 characters');
                isValid = false;
            }
            
            if (isValid) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username.value.trim());
                showSuccess(`Welcome back, ${username.value.trim()}!`);
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
        
        if (localStorage.getItem('isLoggedIn') === 'true') {
            const loginLink = document.querySelector('.nav-link[href="login.html"]');
            if (loginLink) {
                const user = localStorage.getItem('username');
                loginLink.textContent = `👋 ${user || 'User'}`;
                loginLink.href = '#';
            }
        }
    };
    
    // ========================== 3. FORM VALIDATION ==========================
    
    const initFormValidation = () => {
        const forms = document.querySelectorAll('form:not(#loginForm)');
        forms.forEach(form => {
            form.addEventListener('submit', e => {
                e.preventDefault();
                document.querySelectorAll('.error-message').forEach(el => el.remove());
                
                let isValid = true;
                
                const nameField = form.querySelector('input[name="name"], #name');
                if (nameField) {
                    if (!nameField.value.trim()) {
                        showError(nameField, 'Name is required');
                        isValid = false;
                    } else if (nameField.value.trim().length < 2) {
                        showError(nameField, 'Name must be at least 2 characters');
                        isValid = false;
                    }
                }
                
                const emailField = form.querySelector('input[name="email"], #email');
                if (emailField) {
                    if (!emailField.value.trim()) {
                        showError(emailField, 'Email is required');
                        isValid = false;
                    } else {
                        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
                        if (!emailRegex.test(emailField.value.trim())) {
                            showError(emailField, 'Please enter a valid email address');
                            isValid = false;
                        }
                    }
                }
                
                const phoneField = form.querySelector('input[name="phone"], #phone');
                if (phoneField && phoneField.value.trim()) {
                    const phoneRegex = /^\d{10}$/;
                    if (!phoneRegex.test(phoneField.value.trim())) {
                        showError(phoneField, 'Please enter a valid 10-digit phone number');
                        isValid = false;
                    }
                }
                
                if (isValid) {
                    showSuccess('Form submitted successfully!');
                    form.reset();
                }
            });
        });
    };
    
    // ========================== 4. FETCH CITY DATA & DYNAMIC DESTINATIONS ==========================
    
    let citiesData = {}; // will be populated from JSON
    
    // Load city data from external JSON file using Fetch API
    const loadCityData = async () => {
        try {
            const response = await fetch('cities.json');
            if (!response.ok) throw new Error('Failed to load city data');
            citiesData = await response.json();
            return true;
        } catch (error) {
            console.error('Error loading cities.json:', error);
            showSuccess('Unable to load city data. Please check your connection.');
            return false;
        }
    };
    
    const initDynamicDestinations = () => {
        const container = document.getElementById('destination-details');
        const buttons = document.querySelectorAll('.dest-btn, .city-card');
        if (!container) return;
        
        const renderCity = (cityKey) => {
            const city = citiesData[cityKey];
            if (!city) return;
            container.innerHTML = `
                <div class="city-detail-card" style="animation: fadeIn 0.5s ease;">
                    <h3>${city.name}</h3>
                    <p>${city.description}</p>
                    <p><strong>Attractions:</strong> ${city.attractions.join(', ')}</p>
                    <p><strong>Cuisine:</strong> ${city.cuisine}</p>
                </div>
            `;
            localStorage.setItem('lastViewedCity', cityKey);
        };
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const cityKey = btn.getAttribute('data-city') || btn.classList[1];
                if (citiesData[cityKey]) renderCity(cityKey);
            });
        });
        
        const lastCity = localStorage.getItem('lastViewedCity');
        if (lastCity && citiesData[lastCity]) renderCity(lastCity);
        else if (Object.keys(citiesData).length) renderCity(Object.keys(citiesData)[0]);
    };
    
    // ========================== 5. SEARCH BAR REDIRECT ==========================
    
    const initSearch = () => {
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        if (!searchInput || !searchBtn) return;
        
        // Helper to redirect to city page
        const redirectToCity = (cityName) => {
            const cityLower = cityName.toLowerCase().trim();
            // Map city names to page filenames (adjust as needed)
            const cityMap = {
                chennai: 'chennai.html',
                madurai: 'madurai.html',
                ooty: 'ooty.html',
                kodaikanal: 'kodaikanal.html',
                coimbatore: 'coimbatore.html',
                thanjavur: 'thanjavur.html'
            };
            if (cityMap[cityLower]) {
                window.location.href = cityMap[cityLower];
            } else {
                showError(searchInput, `"${cityName}" not found. Try Chennai, Madurai, Ooty, etc.`);
            }
        };
        
        const handleSearch = () => {
            const query = searchInput.value.trim();
            if (query === '') {
                showError(searchInput, 'Please enter a city name');
                return;
            }
            redirectToCity(query);
        };
        
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') handleSearch();
        });
    };
    
    // ========================== 6. BUTTON CLICK ANIMATIONS ==========================
    
    const initButtonAnimations = () => {
        const buttons = document.querySelectorAll('button, .btn, .card-btn, .search-btn, .cta-btn, .back-to-top');
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                this.style.transform = 'scale(0.97)';
                setTimeout(() => { this.style.transform = ''; }, 150);
            });
        });
    };
    
    // ========================== 7. IMAGE SLIDER ==========================
    
    const initImageSlider = () => {
        const sliderContainer = document.getElementById('imageSlider');
        if (!sliderContainer) return;
        
        // Use actual images from your project (adjust paths if needed)
        const images = [
            'images/chennai.webp',
            'images/Madurai tem.jpeg',
            'images/ooty.webp',
            'images/kodaikanal.jpg',
            'images/thanjavur.jpeg'
        ].filter(src => src); // ensure no empty
        
        if (!images.length) return;
        
        let currentIndex = 0;
        sliderContainer.innerHTML = `
            <div class="slider-wrapper" style="position: relative; overflow: hidden; border-radius: 12px;">
                <div class="slider-track" style="display: flex; transition: transform 0.5s ease;">
                    ${images.map(img => `<div class="slide" style="min-width: 100%;"><img src="${img}" style="width:100%; height:350px; object-fit:cover;"></div>`).join('')}
                </div>
                <button class="slider-prev" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.6); color:white; border:none; padding:10px 15px; border-radius:50%; cursor:pointer;">❮</button>
                <button class="slider-next" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.6); color:white; border:none; padding:10px 15px; border-radius:50%; cursor:pointer;">❯</button>
                <div class="slider-dots" style="position:absolute; bottom:10px; left:50%; transform:translateX(-50%); display:flex; gap:8px;"></div>
            </div>
        `;
        
        const track = sliderContainer.querySelector('.slider-track');
        const dotsContainer = sliderContainer.querySelector('.slider-dots');
        const totalSlides = images.length;
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `width: 8px; height: 8px; border-radius: 50%; background: ${i === 0 ? 'white' : 'rgba(255,255,255,0.5)'}; cursor: pointer;`;
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
        
        const updateSlider = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            const dots = dotsContainer.querySelectorAll('div');
            dots.forEach((dot, i) => {
                dot.style.background = i === currentIndex ? 'white' : 'rgba(255,255,255,0.5)';
            });
        };
        
        sliderContainer.querySelector('.slider-prev').addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
        
        sliderContainer.querySelector('.slider-next').addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        });
        
        let interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        }, 5000);
        
        sliderContainer.addEventListener('mouseenter', () => clearInterval(interval));
        sliderContainer.addEventListener('mouseleave', () => {
            interval = setInterval(() => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateSlider();
            }, 5000);
        });
    };
    
    // ========================== 8. LOCALSTORAGE PREFERENCES ==========================
    
    const initPreferences = () => {
        let visits = localStorage.getItem('visitCount');
        visits = visits ? parseInt(visits) + 1 : 1;
        localStorage.setItem('visitCount', visits);
        
        if (visits === 1) {
            showSuccess('Welcome to CityScope! Explore Tamil Nadu with us 🌟');
        }
        
        if (localStorage.getItem('isLoggedIn') === 'true') {
            const logoutBtn = document.createElement('li');
            logoutBtn.innerHTML = '<button id="logoutBtn" style="background:none; border:none; color:inherit; cursor:pointer;">Logout</button>';
            const navList = document.querySelector('.nav-links');
            if (navList && !document.getElementById('logoutBtn')) {
                navList.appendChild(logoutBtn);
                document.getElementById('logoutBtn').addEventListener('click', () => {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('username');
                    showSuccess('Logged out successfully!');
                    setTimeout(() => location.reload(), 1000);
                });
            }
        }
    };
    
    // ========================== 9. ENHANCE BACK TO TOP ==========================
    
    const enhanceBackToTop = () => {
        const backBtn = document.querySelector('.back-to-top');
        if (!backBtn) return;
        backBtn.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };
    
    // ========================== 10. ADD CSS ANIMATIONS ==========================
    
    const addAnimations = () => {
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
    
    // ========================== 11. PAGE-SPECIFIC INITIALIZATIONS ==========================
    
    const initPageSpecific = () => {
        const page = getCurrentPage();
        if (page === 'destinations') initDynamicDestinations();
        if (document.getElementById('imageSlider')) initImageSlider();
    };
    
    // ========================== 12. MAIN INITIALIZATION ==========================
    
    const init = async () => {
        addAnimations();
        await loadCityData(); // Load data before initializing dynamic destinations
        initSmoothScrolling();
        initActiveMenu();
        initLoginValidation();
        initFormValidation();
        initButtonAnimations();
        initPreferences();
        enhanceBackToTop();
        initSearch();
        initPageSpecific();
    };
    
    init();
});