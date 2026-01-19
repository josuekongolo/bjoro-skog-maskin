/**
 * Bjørø Skog & Maskin - Main JavaScript
 * Ground Work & Forestry Company Website
 */

(function() {
    'use strict';

    // DOM Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const header = document.querySelector('.header');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.querySelector('.form-success');
    const formError = document.querySelector('.form-error');

    // ==========================================================
    // Mobile Navigation Toggle
    // ==========================================================
    function initMobileNav() {
        if (!menuToggle || !mobileNav) return;

        menuToggle.addEventListener('click', function() {
            this.classList.toggle('menu-toggle--active');
            mobileNav.classList.toggle('mobile-nav--active');

            // Toggle aria-expanded
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                menuToggle.classList.remove('menu-toggle--active');
                mobileNav.classList.remove('mobile-nav--active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile nav on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 1024) {
                menuToggle.classList.remove('menu-toggle--active');
                mobileNav.classList.remove('mobile-nav--active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ==========================================================
    // Header Scroll Effect
    // ==========================================================
    function initHeaderScroll() {
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.scrollY;

            if (scrollY > 100) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    // ==========================================================
    // Smooth Scroll for Anchor Links
    // ==========================================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                if (targetId === '#') return;

                const target = document.querySelector(targetId);

                if (target) {
                    e.preventDefault();

                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile nav if open
                    if (menuToggle && mobileNav) {
                        menuToggle.classList.remove('menu-toggle--active');
                        mobileNav.classList.remove('mobile-nav--active');
                    }
                }
            });
        });
    }

    // ==========================================================
    // Contact Form Handling
    // ==========================================================
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Sender...';

            // Hide previous messages
            if (formError) formError.classList.remove('active');
            if (formSuccess) formSuccess.classList.remove('active');

            // Collect form data
            const formData = {
                name: this.querySelector('#name').value.trim(),
                email: this.querySelector('#email').value.trim(),
                phone: this.querySelector('#phone').value.trim(),
                address: this.querySelector('#address') ? this.querySelector('#address').value.trim() : '',
                projectType: this.querySelector('#projectType') ? this.querySelector('#projectType').value : '',
                description: this.querySelector('#description').value.trim(),
                wantSiteVisit: this.querySelector('#siteVisit') ? this.querySelector('#siteVisit').checked : false
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.phone || !formData.description) {
                showFormError('Vennlegst fyll ut alle obligatoriske felt.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                return;
            }

            if (!isValidEmail(formData.email)) {
                showFormError('Vennlegst oppgje ei gyldig e-postadresse.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                return;
            }

            try {
                // Send form data via Resend API
                // Note: This is a placeholder - in production, this would go through a backend endpoint
                const response = await sendFormData(formData);

                if (response.success) {
                    // Show success message
                    contactForm.style.display = 'none';
                    if (formSuccess) {
                        formSuccess.classList.add('active');
                    }

                    // Reset form
                    contactForm.reset();
                } else {
                    showFormError(response.message || 'Det oppstod ein feil. Prøv igjen eller ring oss direkte.');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showFormError('Det oppstod ein feil. Prøv igjen eller ring oss direkte.');
            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show form error
    function showFormError(message) {
        if (formError) {
            formError.textContent = message;
            formError.classList.add('active');
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Send form data (placeholder for Resend API integration)
    async function sendFormData(data) {
        // In production, replace this with actual API call to your backend
        // which then sends the email via Resend API

        // Example backend endpoint:
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // });
        // return response.json();

        // For now, simulate successful submission
        return new Promise((resolve) => {
            setTimeout(() => {
                // Log form data to console for testing
                console.log('Form data submitted:', data);
                resolve({ success: true });
            }, 1500);
        });
    }

    // ==========================================================
    // Intersection Observer for Animations
    // ==========================================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .value-card, .why-us__item, .category-card');

        if (!animatedElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    // ==========================================================
    // Phone Number Click Tracking (for analytics)
    // ==========================================================
    function initPhoneTracking() {
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', function() {
                // Track phone click event
                if (typeof gtag === 'function') {
                    gtag('event', 'click', {
                        'event_category': 'Contact',
                        'event_label': 'Phone Call',
                        'value': 1
                    });
                }
            });
        });
    }

    // ==========================================================
    // Lazy Load Images
    // ==========================================================
    function initLazyLoad() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if (!lazyImages.length) return;

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ==========================================================
    // Current Year in Footer
    // ==========================================================
    function updateFooterYear() {
        const yearElement = document.querySelector('.footer__year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // ==========================================================
    // Active Navigation Highlighting
    // ==========================================================
    function initActiveNav() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav__link, .mobile-nav__link');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');

            if (currentPath.endsWith(linkPath) ||
                (linkPath === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/bjoro-skog-maskin/')))) {
                link.classList.add('nav__link--active', 'mobile-nav__link--active');
            }
        });
    }

    // ==========================================================
    // Keyboard Accessibility
    // ==========================================================
    function initKeyboardAccessibility() {
        // Add visible focus styles
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-nav');
        });

        // Escape key closes mobile nav
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('mobile-nav--active')) {
                menuToggle.classList.remove('menu-toggle--active');
                mobileNav.classList.remove('mobile-nav--active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
        });
    }

    // ==========================================================
    // Initialize All Functions
    // ==========================================================
    function init() {
        initMobileNav();
        initHeaderScroll();
        initSmoothScroll();
        initContactForm();
        initScrollAnimations();
        initPhoneTracking();
        initLazyLoad();
        updateFooterYear();
        initActiveNav();
        initKeyboardAccessibility();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
