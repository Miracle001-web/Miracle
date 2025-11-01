// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {
    
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
     * 2. Header Scroll Shadow
     * Adds a 'has-scrolled' class to the header when the user scrolls down.
     */
    const siteHeader = document.getElementById('site-header');
    
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                siteHeader.classList.add('has-scrolled');
            } else {
                siteHeader.classList.remove('has-scrolled');
            }
        });
    }

    /**
     * 3. Use Case Scroll-Snap Observer
     * As requested in the dev notes, this watches which use case is in the viewport
     * and updates the active state of the corresponding dot in the side-nav.
     */
    const usecaseViewport = document.getElementById('usecase-viewport');
    const usecaseDotsContainer = document.getElementById('usecase-dots');
    
    if (usecaseViewport && usecaseDotsContainer) {
        const useCases = usecaseViewport.querySelectorAll('.usecase');
        const dots = usecaseDotsContainer.querySelectorAll('button');

        // The 'threshold' of 0.7 means the callback fires when 70%
        // of the use case article is visible.
        const observerOptions = {
            root: usecaseViewport, // We observe scrolling inside this container
            threshold: 0.7 
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Get the ID of the visible use case (e.g., "use-case-1")
                    const id = entry.target.id;
                    
                    // Find the dot that corresponds to this ID
                    const activeDot = usecaseDotsContainer.querySelector(`button[data-scroll-to="${id}"]`);
                    
                    // Remove 'is-active' from all dots
                    dots.forEach(dot => dot.classList.remove('is-active'));
                    
                    // Add 'is-active' to the correct dot
                    if (activeDot) {
                        activeDot.classList.add('is-active');
                    }
                }
            });
        }, observerOptions);

        // Observe each use case article
        useCases.forEach(useCase => {
            observer.observe(useCase);
        });

        /**
         * 4. Dot Click Scrolling
         * Makes the side-dots clickable to smoothly scroll to the correct section.
         */
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const targetId = e.target.dataset.scrollTo;
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * 5. Dynamic Footer Year
     * Inserts the current year into the footer.
     */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});
