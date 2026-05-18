// chennai.js - Handles the subscription form on Chennai page
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;

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
        const email = newsletterForm.querySelector('.newsletter-input').value.trim();
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
        newsletterForm.querySelector('.newsletter-input').value = '';
    });
});