// madurai.js - Handles subscription + 20+ Places modal
document.addEventListener('DOMContentLoaded', function() {
    // ========== NEWSLETTER SUBSCRIPTION ==========
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        let toast = null;
        function showToast(message, isSuccess = true) {
            if (toast) toast.remove();
            toast = document.createElement('div');
            toast.className = 'subscribe-toast';
            toast.innerHTML = `<i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i><span>${message}</span>`;
            document.body.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
        function isValidEmail(email) {
            return /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email);
        }
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('.newsletter-input');
            const email = emailInput.value.trim();
            if (!email) {
                showToast('Please enter your email address!', false);
                return;
            }
            if (!isValidEmail(email)) {
                showToast('Please enter a valid email address!', false);
                return;
            }
            console.log('Subscribed with email:', email);
            showToast('You have successfully subscribed! 🎉', true);
            emailInput.value = '';
        });
    }

    // ========== MODAL FOR 20+ PLACES ==========
    const modal = document.getElementById('placesModal');
    const closeBtn = document.querySelector('.close-modal');
    const showBtn = document.getElementById('showPlacesBtn');

    if (modal && closeBtn && showBtn) {
        showBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }
});