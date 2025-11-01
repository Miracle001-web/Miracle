/**
 * Main script file for Miracle Monday / Skyrocket.
 * * Handles core UI interactions common to all pages:
 * 1. Header scroll state (adds 'has-scrolled' class for styling).
 * 2. Mobile menu toggle functionality (opens/closes the navigation).
 * 3. Simple Contact Form Status (simulates submission status for index.html).
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Header Scroll State ---
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        const handleScroll = () => {
            // Add 'has-scrolled' class after scrolling 20 pixels down
            if (window.scrollY > 20) {
                siteHeader.classList.add('has-scrolled');
            } else {
                siteHeader.classList.remove('has-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check scroll position immediately on load
    }

    // --- 2. Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    // Note: The main navigation element should have the ID 'main-nav'
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle menu state and classes
            menuToggle.setAttribute('aria-expanded', !isOpen);
            menuToggle.classList.toggle('is-active');
            mainNav.classList.toggle('is-open');

            // Toggle body scroll lock to prevent scrolling behind the menu
            if (!isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when a navigation link is clicked (improves mobile UX)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Check if the menu is open before closing
                if (menuToggle.classList.contains('is-active')) {
                    menuToggle.click(); // Programmatically trigger the close function
                }
            });
        });
    }

    // --- 3. Simple Contact Form Status (for index.html) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            formStatus.style.color = 'var(--color-accent-blue)';
            formStatus.textContent = 'Sending message...';
            
            // Simulate a network request delay (replace with actual API call in production)
            setTimeout(() => {
                // Successful submission simulation
                formStatus.style.color = 'green';
                formStatus.textContent = 'Message sent successfully! I will be in touch soon.';
                contactForm.reset();
            }, 1500); 
        });
    }
});
