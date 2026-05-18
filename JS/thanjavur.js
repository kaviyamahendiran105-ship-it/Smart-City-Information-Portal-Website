// thanjavur.js - Handles the subscription form on Thanjavur page
document.addEventListener('DOMContentLoaded', function() {
    // Find the newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;

    // Create a toast message element (will be appended to body)
    let toast = null;

    function showToast(message, isSuccess = true) {
        // Remove any existing toast
        if (toast) toast.remove();

        toast = document.createElement('div');
        toast.className = 'subscribe-toast';
        toast.innerHTML = `
            <i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return re.test(email);
    }

    // Handle form submission
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent page reload

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

        // Simulate subscription (in real project, send this to a server)
        console.log('Subscribed with email:', email);
        showToast('You have successfully subscribed! 🎉', true);

        // Optionally clear the input
        emailInput.value = '';
    });
});