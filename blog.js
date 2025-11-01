// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
    
    // Get references to the form and its elements
    const subscribeForm = document.getElementById("subscribe-form");
    const emailInput = document.getElementById("email");
    const formMessage = document.getElementById("form-message");

    // Add a 'submit' event listener to the form
    if (subscribeForm) {
        subscribeForm.addEventListener("submit", function (event) {
            // Prevent the default form submission (which would reload the page)
            event.preventDefault();

            // Get the trimmed value of the email input
            const email = emailInput.value.trim();

            // Reset previous messages
            formMessage.textContent = "";
            formMessage.className = "form-message";
            emailInput.style.borderColor = ""; // Reset border color

            // Validate the email
            if (email === "") {
                // Case: Email is empty
                showError("Please enter your email address.");
            } else if (!isValidEmail(email)) {
                // Case: Email format is invalid
                showError("Please enter a valid email address.");
            } else {
                // Case: Email is valid
                showSuccess("Thanks for subscribing!");
                
                // Optionally, you could clear the form
                // subscribeForm.reset();
                
                // Here you would typically send the data to a server
                // e.g., using fetch()
                console.log("Form submitted successfully with email:", email);
            }
        });
    }
    /**
     * 1. Mobile Menu Toggle
     * Toggles the 'is-active' class on the button and 'is-open' on the nav menu.
     */
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            mainNav.classList.toggle('is-open');
            
            // Toggle ARIA attribute for accessibility
            const isExpanded = mainNav.classList.contains('is-open');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when a nav link is clicked (for single-page app experience)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('is-open')) {
                    menuToggle.classList.remove('is-active');
                    mainNav.classList.remove('is-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    /**
     * Displays a success message to the user.
     * @param {string} message - The success message to display.
     */
    function showSuccess(message) {
        formMessage.textContent = message;
        formMessage.className = "form-message success";
    }

    /**
     * Displays an error message to the user and highlights the input.
     * @param {string} message - The error message to display.
     */
    function showError(message) {
        formMessage.textContent = message;
        formMessage.className = "form-message error";
        emailInput.style.borderColor = "#EF4444"; // Error color from CSS
        emailInput.focus();
    }

    /**
     * A simple regex to validate email format.
     * @param {string} email - The email string to validate.
     * @returns {boolean} - True if the email format is valid, false otherwise.
     */
    function isValidEmail(email) {
        // A basic regex for email validation
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

});
