/**
 * Main script file for Miracle Monday / Skyrocket Booking Page
 *
 * Handles:
 * 1. Header scroll state
 * 2. Mobile menu toggle
 * 3. Horizontal pilot sliders (with dots, progress, drag, and keyboard)
 * 4. Booking form pilot pre-selection
 * 5. Form submission feedback (basic)
 * 6. Analytics stubs
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Header Scroll State ---
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                siteHeader.classList.add('has-scrolled');
            } else {
                siteHeader.classList.remove('has-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check on load
    }

    // --- 2. Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isOpen);
            menuToggle.classList.toggle('is-active');
            mainNav.classList.toggle('is-open');

            // Toggle body scroll lock
            if (!isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // --- 3. Horizontal Pilot Sliders ---
    document.querySelectorAll('.pilot-slider-wrapper').forEach(wrapper => {
        const container = wrapper.querySelector('.pilot-slider-container');
        const track = wrapper.querySelector('.pilot-slider-track');
        const prevBtn = wrapper.querySelector('.prev-btn');
        const nextBtn = wrapper.querySelector('.next-btn');
        const dotsContainer = wrapper.querySelector('.pilot-slider-pagination');
        const progressLabel = wrapper.querySelector('.slider-progress');
        
        if (!container || !track || !prevBtn || !nextBtn || !dotsContainer || !progressLabel) {
            console.warn('Slider missing one or more required elements:', wrapper);
            return;
        }

        const slides = Array.from(track.children);
        const totalSlides = slides.length;
        if (totalSlides === 0) return;

        let currentIndex = 0;
        let isDown = false;
        let startX;
        let scrollLeft;

        // --- Create Dots ---
        dotsContainer.innerHTML = ''; // Clear any existing
        const dots = [];
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
            dots.push(dot);
        }

        // --- Update UI Function ---
        const updateUI = (index) => {
            if (index < 0 || index >= totalSlides) return; // Guard clause
            currentIndex = index;
            
            // Update Progress & Dots
            progressLabel.textContent = `${index + 1} / ${totalSlides}`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('is-active', i === index);
            });

            // Update Buttons
            prevBtn.disabled = index === 0;
            nextBtn.disabled = index === totalSlides - 1;
            
            // Fire analytics stub
            console.log('Analytics Event: carousel_view', {
                category: wrapper.closest('.pilot-category').id,
                index: index + 1
            });
            
            // Handle lazy loading images
            // Load current, next, and previous for smoother transitions
            [index - 1, index, index + 1].forEach(i => {
                if (slides[i]) {
                    const img = slides[i].querySelector('img[loading="lazy"]');
                    if (img) {
                        img.removeAttribute('loading');
                    }
                }
            });
        };

        // --- Scroll To Slide Function ---
        const scrollToSlide = (index) => {
            if (index < 0 || index >= totalSlides) return;
            const slide = slides[index];
            // Calculate scroll position to align slide start
            // We factor in the track's offsetLeft relative to the container if any (e.g. padding)
            const scrollAmount = slide.offsetLeft - track.offsetLeft;
            container.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
            // The 'scroll' event listener will handle updating the UI,
            // but we can call it directly for immediate button/dot update
            updateUI(index);
        };

        // --- Event Listener for Scroll (The Source of Truth for position) ---
        let scrollTimer;
        container.addEventListener('scroll', () => {
            // Debounce scroll event to find the "settled" slide
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                // Find slide closest to the left edge (snap position)
                let closestIndex = 0;
                let minDistance = Infinity;

                slides.forEach((slide, index) => {
                    const slideLeft = slide.offsetLeft - track.offsetLeft;
                    const distance = Math.abs(container.scrollLeft - slideLeft);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestIndex = index;
                    }
                });
                
                if (closestIndex !== currentIndex) {
                    updateUI(closestIndex);
                }
            }, 150); // 150ms debounce
        });

        // --- Button Clicks ---
        prevBtn.addEventListener('click', () => {
            scrollToSlide(currentIndex - 1);
        });
        nextBtn.addEventListener('click', () => {
            scrollToSlide(currentIndex + 1);
        });

        // --- Dot Clicks ---
        dotsContainer.addEventListener('click', (e) => {
            if (e.target.matches('.slider-dot')) {
                const index = parseInt(e.target.dataset.index, 10);
                scrollToSlide(index);
            }
        });
        
        // --- Keyboard Navigation ---
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                scrollToSlide(currentIndex + 1);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                scrollToSlide(currentIndex - 1);
            }
        });

        // --- Drag-to-scroll functionality ---
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.classList.add('is-grabbing');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('is-grabbing');
        });
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('is-grabbing');
        });
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Multiplier for faster drag
            container.scrollLeft = scrollLeft - walk;
        });
        
        // --- Touch-to-scroll (native via `touch-action: pan-x`) ---
        // The native scroll listener above will handle UI updates.

        // Initial setup
        updateUI(0);
    });

    // --- 4. Booking Form Pilot Pre-selection ---
    const preselectPilot = () => {
        // Use window.location.hash to get params from anchor link
        const hash = window.location.hash;
        const paramString = hash.split('?')[1];
        if (!paramString) return;

        const params = new URLSearchParams(paramString);
        const pilot = params.get('pilot');
        
        if (pilot) {
            const select = document.getElementById('preferred-pilot');
            if (select) {
                // Check if the pilot value exists as an option
                if (select.querySelector(`option[value="${pilot}"]`)) {
                    select.value = pilot;
                    // Fire analytics stub
                    console.log('Analytics Event: form_prefilled', { pilot: pilot });
                } else {
                    console.warn(`Pilot value "${pilot}" not found in dropdown.`);
                }
            }
        }
    };
    // Run on page load and on hash change (if user clicks another pilot link)
    window.addEventListener('hashchange', preselectPilot);
    preselectPilot(); 

    // --- 5. Form Submission Feedback (Basic) ---
    const bookingForm = document.getElementById('pilot-book-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            // For Netlify/static forms, we let the default submission happen.
            // This is an optimistic feedback message.
            const formContainer = document.querySelector('.form-container');
            
            if (formContainer) {
                 formContainer.classList.add('form-submitted');
            }

            // Fire analytics stub
            console.log('Analytics Event: book_audit_click (Form Submit)');
            
            // We can't reliably reset the form if the page doesn't reload,
            // but we'll clear the success message after a delay.
            setTimeout(() => {
                if (formContainer) {
                    formContainer.classList.remove('form-submitted');
                }
            }, 5000); // 5 seconds
        });
    }
    
    // --- 6. Analytics Stubs for other CTAs ---
    // Track pilot CTA clicks
    document.querySelectorAll('.pilot-cta').forEach(cta => {
        cta.addEventListener('click', (e) => {
            const href = cta.getAttribute('href');
            const paramString = href.split('?')[1];
            if (paramString) {
                const params = new URLSearchParams(paramString);
                const pilot = params.get('pilot');
                console.log('Analytics Event: usecase_cta_click', { 
                    pilot: pilot,
                    category: cta.closest('.pilot-category').id
                });
            }
        });
    });
    
    // Track main "Book Audit" buttons
    document.querySelectorAll('a[href="#book-form"], .form-submit-btn').forEach(cta => {
        if (!cta.classList.contains('pilot-cta') && !cta.classList.contains('form-submit-btn')) { // Avoid double-tracking form submit
            cta.addEventListener('click', () => {
                 console.log('Analytics Event: book_audit_click', { 
                     source: cta.textContent.trim().slice(0, 20) // Get button text
                 });
            });
        }
    });

});

