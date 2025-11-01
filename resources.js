/**
 * Miracle Monday Frontend JS (Pure Vanilla JS)
 * Handles mobile menu toggle and scroll-based header changes.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. Header & Mobile Navigation Logic --- */
    const header = document.querySelector('.site-header');
    const navToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle && mainNav) {
        /**
         * Toggles the mobile menu open/closed state.
         */
        function toggleMobileMenu() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('is-active');
            mainNav.classList.toggle('is-open');

            // Prevent background scrolling when menu is open
            document.body.style.overflow = mainNav.classList.contains('is-open') ? 'hidden' : '';
        }

        // A. Mobile Menu Listener
        navToggle.addEventListener('click', toggleMobileMenu);

        // B. Close menu when a link inside is clicked (for single-page apps or anchor links)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('is-open')) {
                    toggleMobileMenu();
                }
            });
        });
    }

    /* --- 2. Scroll Shadow on Header --- */
    if (header) {
        const scrollThreshold = 10; // Pixels to scroll before shadow appears

        function handleScroll() {
            // Add or remove a shadow to the fixed header based on scroll position
            if (window.scrollY > scrollThreshold) {
                header.classList.add('has-scrolled');
            } else {
                header.classList.remove('has-scrolled');
            }
        }
        
        // Initial check and subsequent scroll listener
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

});