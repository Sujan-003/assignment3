// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initFilterSystem();
    initVideoLightbox();
    initContactForm();
    initAnimations();

    console.log('🎬 Editkaro.in Portfolio - Initialized Successfully');
}

// ===== NAVIGATION SYSTEM =====
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Sticky navbar with glassmorphism
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    menuToggle?.addEventListener('click', () => {
        navLinks?.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Smooth scroll to sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                navLinks?.classList.remove('active');
                menuToggle?.classList.remove('active');
            }
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.portfolio-section, .video-card, .contact-section').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const hero = document.querySelector('.hero');

        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// ===== FILTER SYSTEM =====
function initFilterSystem() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioSections = document.querySelectorAll('.portfolio-section');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter sections
            portfolioSections.forEach(section => {
                const sectionCategory = section.getAttribute('data-category');

                if (filterValue === 'all' || sectionCategory === filterValue) {
                    section.style.display = 'flex';
                    section.classList.remove('filtered-out');
                } else {
                    section.style.display = 'none';
                    section.classList.add('filtered-out');
                }
            });

            // Scroll to first visible section
            const firstVisibleSection = document.querySelector('.portfolio-section:not(.filtered-out)');
            if (firstVisibleSection && filterValue !== 'all') {
                firstVisibleSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== VIDEO LIGHTBOX =====
function initVideoLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.querySelector('.lightbox-video');
    const closeLightbox = document.querySelector('.close-lightbox');

    // Open lightbox on video card click
    document.addEventListener('click', (e) => {
        const videoCard = e.target.closest('.video-card');
        if (videoCard) {
            e.preventDefault();

            // You can add actual video URLs here
            const videoUrl = videoCard.getAttribute('data-video') || '#';
            if (videoUrl !== '#') {
                lightboxVideo.src = videoUrl;
                lightbox.classList.add('show');
                document.body.style.overflow = 'hidden';
            } else {
                // Show placeholder message
                showNotification('Video preview coming soon!', 'info');
            }
        }
    });

    // Close lightbox
    closeLightbox?.addEventListener('click', closeVideoLightbox);
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeVideoLightbox();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox?.classList.contains('show')) {
            closeVideoLightbox();
        }
    });

    function closeVideoLightbox() {
        lightbox.classList.remove('show');
        lightboxVideo.pause();
        lightboxVideo.src = '';
        document.body.style.overflow = 'auto';
    }
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.querySelector('.contact-form');
    const emailInput = document.querySelector('.form-input[type="email"]');
    const submitBtn = document.querySelector('.primary-btn');

    // Form validation
    emailInput?.addEventListener('input', validateEmail);
    form?.addEventListener('submit', handleSubmit);

    function validateEmail(e) {
        const email = e.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email && !emailRegex.test(email)) {
            emailInput.style.borderColor = 'var(--error-color)';
            emailInput.setCustomValidity('Please enter a valid email address');
        } else {
            emailInput.style.borderColor = 'var(--glass-border)';
            emailInput.setCustomValidity('');
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            showNotification('Please enter your email address', 'error');
            return;
        }

        // Simulate form submission
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('Thank you! We\'ll get back to you soon.', 'success');
            emailInput.value = '';
            submitBtn.textContent = 'Get Started';
            submitBtn.disabled = false;
        }, 2000);
    }
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Stagger animations for video cards
    const videoCards = document.querySelectorAll('.video-card');

    videoCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Hover effects for video cards
    videoCards.forEach(card => {
        const thumbnail = card.querySelector('.video-thumbnail');
        const playOverlay = card.querySelector('.play-overlay');

        card.addEventListener('mouseenter', () => {
            thumbnail.style.transform = 'scale(1.05)';
            playOverlay.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            thumbnail.style.transform = 'scale(1)';
            playOverlay.style.opacity = '0.8';
        });
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close on click
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle scroll events
const throttledScrollHandler = throttle(handleScroll, 16);
window.addEventListener('scroll', throttledScrollHandler);

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function handleScroll() {
    // Optimized scroll handling
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero && scrolled < window.innerHeight) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
}

// ===== ACCESSIBILITY =====

// Keyboard navigation for filter buttons
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});

// ===== UTILITY FUNCTIONS =====

// Smooth scroll utility
function smoothScrollTo(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Application Error:', e.error);
    showNotification('Something went wrong. Please refresh the page.', 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    showNotification('Network error. Please check your connection.', 'error');
});

// ===== LAZY LOADING =====
// You can implement lazy loading for images here if needed
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===== ANALYTICS (Optional) =====
// Add your analytics code here
function initAnalytics() {
    // Track page views
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: 'Editkaro.in Portfolio',
            page_location: window.location.href
        });
    }

    // Track filter usage
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            if (typeof gtag !== 'undefined') {
                gtag('event', 'filter_used', {
                    filter_type: filter
                });
            }
        });
    });
}

// Initialize analytics if available
if (window.gtag) {
    initAnalytics();
}

// ===== EXPORT FOR DEBUGGING =====
window.EditkaroPortfolio = {
    initNavigation,
    initScrollEffects,
    initFilterSystem,
    initVideoLightbox,
    initContactForm,
    showNotification,
    smoothScrollTo,
    isInViewport
};

console.log('🚀 Editkaro.in Portfolio - All systems operational');