// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuButton = document.querySelector('button.md\\:hidden');
    const navigation = document.querySelector('nav div.hidden');
    let isMenuOpen = false;
    
    if (mobileMenuButton && navigation) {
        mobileMenuButton.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            navigation.classList.toggle('hidden');
            navigation.classList.toggle('mobile-menu');
            navigation.classList.toggle('active');
            
            // Update button icon
            const icon = mobileMenuButton.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !e.target.closest('.mobile-menu') && !e.target.closest('button.md\\:hidden')) {
            isMenuOpen = false;
            navigation.classList.add('hidden');
            navigation.classList.remove('mobile-menu', 'active');
            document.body.style.overflow = '';
            
            const icon = mobileMenuButton.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => imageObserver.observe(img));

    // Enhanced newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const buttonSpan = submitButton.querySelector('span');
            const originalText = buttonSpan.textContent;
            const successMessage = this.querySelector('.success-message');
            
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            buttonSpan.textContent = 'Subscribing...';

            // Simulate form submission
            setTimeout(() => {
                // Show success animation
                submitButton.classList.remove('loading');
                buttonSpan.textContent = '✓ Subscribed';
                submitButton.classList.add('success');
                
                if (successMessage) {
                    successMessage.classList.remove('hidden');
                }

                // Clear form
                this.reset();

                // Reset button after delay
                setTimeout(() => {
                    buttonSpan.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.classList.remove('success');
                    
                    if (successMessage) {
                        successMessage.classList.add('hidden');
                    }
                }, 3000);
            }, 1500);
        });
    }

    // Enhanced header scroll behavior
    const header = document.querySelector('nav');
    let lastScroll = 0;
    const scrollThreshold = 50; // Minimum scroll amount before hiding nav

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add background when scrolling down
        if (currentScroll > 0) {
            header.classList.add('bg-white/95');
        } else {
            header.classList.remove('bg-white/95');
        }

        // Handle nav hide/show
        if (Math.abs(currentScroll - lastScroll) < scrollThreshold) {
            lastScroll = currentScroll;
            return;
        }

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up', 'scroll-down');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scrolling down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Image error handling
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            // Replace broken image with a fallback
            this.src = 'https://www.polestar.com/dato-assets/11286/1715759218-ps2-light.png';
            this.alt = 'Fallback image';
        });
    });

    // Add intersection observer for animation on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, options);

    animatedElements.forEach(element => observer.observe(element));
});

// Handle window resize events
window.addEventListener('resize', () => {
    // Reset mobile menu state on window resize
    const navigation = document.querySelector('nav div.mobile-menu');
    if (navigation && window.innerWidth >= 768) {
        navigation.classList.add('hidden');
        navigation.classList.remove('mobile-menu');
    }
});

// Prevent form submission if validation fails
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            showError(input, 'This field is required');
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            isValid = false;
            showError(input, 'Please enter a valid email address');
        }
    });

    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show error message helper
function showError(input, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    
    // Remove any existing error message
    const existingError = input.parentElement.querySelector('.text-red-500');
    if (existingError) {
        existingError.remove();
    }
    
    input.parentElement.appendChild(errorDiv);
    
    // Remove error message when input changes
    input.addEventListener('input', () => {
        errorDiv.remove();
    }, { once: true });
}
