// Menu toggle functionality
function setupMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const nav = document.querySelector('.nav');
                if (nav) nav.classList.remove('active');
                
                const headerHeight = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 70;
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form validation
function setupFormValidation() {
    const contactForm = document.getElementById('formulario-contacto');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate name
            const nameInput = document.getElementById('nombre');
            const nameError = nameInput.nextElementSibling;
            
            if (nameInput.value.trim() === '') {
                nameError.textContent = 'Por favor ingresa tu nombre';
                isValid = false;
            } else {
                nameError.textContent = '';
            }
            
            // Validate email
            const emailInput = document.getElementById('email');
            const emailError = emailInput.nextElementSibling;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (emailInput.value.trim() === '') {
                emailError.textContent = 'Por favor ingresa tu correo electrónico';
                isValid = false;
            } else if (!emailPattern.test(emailInput.value)) {
                emailError.textContent = 'Por favor ingresa un correo electrónico válido';
                isValid = false;
            } else {
                emailError.textContent = '';
            }
            
            // Validate message
            const messageInput = document.getElementById('mensaje');
            const messageError = messageInput.nextElementSibling;
            
            if (messageInput.value.trim() === '') {
                messageError.textContent = 'Por favor ingresa tu mensaje';
                isValid = false;
            } else {
                messageError.textContent = '';
            }
            
            // If form is valid, show success message
            if (isValid) {
                alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
                contactForm.reset();
            }
        });
    }
}

// Scroll animations
function setupScrollAnimations() {
    const fadeElements = document.querySelectorAll('.producto-card, .valor-card, .nosotros-content, .contacto-content');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            // If element is in viewport
            if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    }
    
    // Check on load and scroll
    window.addEventListener('load', checkFade);
    window.addEventListener('scroll', checkFade);
    
    // Initial check
    checkFade();
}

// Lazy loading images
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        // If no native lazy loading, use IntersectionObserver
        if (lazyImages.length > 0 && !('loading' in HTMLImageElement.prototype)) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        // Check if we need to use data-src or just load normally
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupMenuToggle();
    setupSmoothScrolling();
    setupFormValidation();
    setupScrollAnimations();
    setupLazyLoading();
});