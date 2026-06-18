document.addEventListener('DOMContentLoaded', () => {
    // ========== SEARCH FUNCTIONALITY ==========
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

    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    // ========== COUNTER ANIMATION (stats) ==========
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.querySelector('.stats-section');

    if (counters.length && statsSection) {
        let started = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !started) {
                    started = true;
                    counters.forEach(counter => {
                        const updateCount = () => {
                            const target = parseInt(counter.getAttribute('data-target'));
                            let count = parseInt(counter.innerText);
                            const increment = target / 80;
                            if (count < target) {
                                count = Math.ceil(count + increment);
                                counter.innerText = count;
                                setTimeout(updateCount, 20);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCount();
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // ========== NEWSLETTER SUBSCRIPTION ==========
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('.newsletter-input');
            const email = emailInput.value.trim();
            if (email && email.includes('@') && email.includes('.')) {
                alert('Thank you for subscribing! You will receive updates soon.');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // ========== BACK TO TOP BUTTON ==========
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backBtn.classList.add('visible');
            } else {
                backBtn.classList.remove('visible');
            }
        });
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== MOBILE MENU TOGGLE ==========
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (menuToggle && mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            menuToggle.checked = !menuToggle.checked;
        });
        const mobileLinks = document.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.checked = false;
            });
        });
    }

    // ========== ACTIVE MENU HIGHLIGHT ==========
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        }
    });
});