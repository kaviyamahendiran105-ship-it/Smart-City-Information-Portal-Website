// plan_trip.js - Complete form validation with real‑time feedback

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tripForm');

    // Helper: show error message for a specific field
    const showError = (fieldId, message) => {
        const errorSpan = document.getElementById(fieldId);
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.add('show');
        }
        // Add red border to the input/select
        const input = document.getElementById(fieldId.replace('Error', ''));
        if (input) input.classList.add('error-border');
    };

    // Helper: clear error message for a field
    const clearError = (fieldId) => {
        const errorSpan = document.getElementById(fieldId);
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.classList.remove('show');
        }
        const input = document.getElementById(fieldId.replace('Error', ''));
        if (input) input.classList.remove('error-border');
    };

    // Helper: show green success toast
    const showSuccessToast = (message) => {
        // Remove existing toast if any
        const oldToast = document.querySelector('.success-toast');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(toast);

        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // ----- Individual validation functions (return true if valid) -----
    const validateMonth = () => {
        const month = document.getElementById('month').value;
        if (!month) {
            showError('monthError', '⚠️ Enter Travel Month !');
            return false;
        }
        clearError('monthError');
        return true;
    };

    const validateBudget = () => {
        const budget = document.getElementById('budget').value.trim();
        if (!budget) {
            showError('budgetError', '⚠️ Budget is required.');
            return false;
        }
        const budgetNum = Number(budget);
        if (isNaN(budgetNum) || budgetNum <= 0) {
            showError('budgetError', '⚠️ Budget must be a positive number.');
            return false;
        }
        clearError('budgetError');
        return true;
    };

    const validateTravellers = () => {
        const travellers = document.getElementById('travellers').value;
        if (!travellers || travellers < 1) {
            showError('travellersError', '⚠️ Enter No. of Travellers !');
            return false;
        }
        clearError('travellersError');
        return true;
    };

    const validateCity = () => {
        const city = document.getElementById('city').value.trim();
        if (!city) {
            showError('cityError', '⚠️ Enter City of Arrival !');
            return false;
        }
        // Optional: allow only letters, spaces, hyphens
        const textOnlyRegex = /^[A-Za-z\s\.\-]+$/;
        if (!textOnlyRegex.test(city)) {
            showError('cityError', '⚠️ City name should contain only letters.');
            return false;
        }
        clearError('cityError');
        return true;
    };

    const validateRequirement = () => {
        const requirement = document.getElementById('requirement').value.trim();
        if (!requirement) {
            showError('requirementError', '⚠️ Enter Your Requirement !');
            return false;
        }
        clearError('requirementError');
        return true;
    };

    // Real‑time validation (clear errors as user corrects)
    const attachLiveValidation = () => {
        document.getElementById('month').addEventListener('change', validateMonth);
        document.getElementById('budget').addEventListener('input', validateBudget);
        document.getElementById('travellers').addEventListener('input', validateTravellers);
        document.getElementById('city').addEventListener('input', validateCity);
        document.getElementById('requirement').addEventListener('input', validateRequirement);
    };

    // Form submit handler
    const handleSubmit = (e) => {
        e.preventDefault();

        
        const isMonthValid = validateMonth();
        const isBudgetValid = validateBudget();
        const isTravellersValid = validateTravellers();
        const isCityValid = validateCity();
        const isRequirementValid = validateRequirement();

        if (isMonthValid && isBudgetValid && isTravellersValid && isCityValid && isRequirementValid) {
            
            showSuccessToast('✅ Your response has been submitted successfully!');

            
            form.reset();
            document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));
            document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error-border'));

           
        }
    };

    // Initialize
    if (form) {
        form.addEventListener('submit', handleSubmit);
        attachLiveValidation();
    }
});