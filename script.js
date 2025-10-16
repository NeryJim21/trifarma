/**
 * Script principal optimizado para Trifarma
 * Maneja la interactividad del sitio web
 */

// Menu toggle functionality optimizada
class MenuManager {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.nav = document.querySelector('.nav');
        this.body = document.body;
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.menuToggle || !this.nav) return;
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        
        // Cerrar menú al hacer clic en enlaces
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) this.closeMenu();
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.nav.contains(e.target) && 
                !this.menuToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Cerrar menú con ESC
        document.addEventListener('keydown', (e) => {
            if (this.isMenuOpen && e.key === 'Escape') {
                this.closeMenu();
                this.menuToggle.focus();
            }
        });
    }
    
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.nav.classList.add('active');
        this.menuToggle.setAttribute('aria-expanded', 'true');
        this.body.style.overflow = 'hidden';
        this.isMenuOpen = true;
        
        // Cambiar icono
        const icon = this.menuToggle.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-times';
        }
    }
    
    closeMenu() {
        this.nav.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.body.style.overflow = '';
        this.isMenuOpen = false;
        
        // Restaurar icono
        const icon = this.menuToggle.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
    }
}

// Smooth scrolling optimizado
class SmoothScroller {
    constructor() {
        this.header = document.querySelector('.header');
        this.headerHeight = this.header ? this.header.offsetHeight : 70;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            this.handleLinkClick(e, link);
        });
    }
    
    handleLinkClick(e, link) {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        // Cerrar menú móvil si está abierto
        const nav = document.querySelector('.nav');
        if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        this.scrollToElement(targetElement);
    }
    
    scrollToElement(element) {
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - this.headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Actualizar URL sin recargar
        history.pushState(null, null, `#${element.id}`);
    }
}

// Form validation optimizada
class FormValidator {
    constructor() {
        this.contactForm = document.getElementById('formulario-contacto');
        this.fields = {
            nombre: {
                element: document.getElementById('nombre'),
                validate: (value) => {
                    if (!value.trim()) return 'Este campo es obligatorio';
                    if (value.length < 2) return 'Mínimo 2 caracteres';
                    if (value.length > 100) return 'Máximo 100 caracteres';
                    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\.]+$/.test(value)) return 'Solo se permiten letras y espacios';
                    return null;
                }
            },
            email: {
                element: document.getElementById('email'),
                validate: (value) => {
                    if (!value.trim()) return 'Este campo es obligatorio';
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(value)) return 'Email no válido';
                    if (value.length > 150) return 'Máximo 150 caracteres';
                    return null;
                }
            },
            mensaje: {
                element: document.getElementById('mensaje'),
                validate: (value) => {
                    if (!value.trim()) return 'Este campo es obligatorio';
                    if (value.length < 10) return 'Mínimo 10 caracteres';
                    if (value.length > 2000) return 'Máximo 2000 caracteres';
                    return null;
                }
            }
        };
        
        this.init();
    }
    
    init() {
        if (!this.contactForm) return;
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Validación en tiempo real
        Object.values(this.fields).forEach(({ element, validate }) => {
            if (!element) return;
            
            element.addEventListener('blur', () => this.validateField(element, validate));
            element.addEventListener('input', () => this.clearFieldError(element));
        });
        
        // Envío del formulario
        this.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (await this.validateForm()) {
                await this.submitForm();
            }
        });
    }
    
    validateField(field, validateFn) {
        const error = field.nextElementSibling;
        const value = field.value.trim();
        const validationError = validateFn(value);
        
        if (validationError) {
            this.showFieldError(field, error, validationError);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    }
    
    async validateForm() {
        let isValid = true;
        
        this.clearAllErrors();
        
        for (const { element, validate } of Object.values(this.fields)) {
            if (!element) continue;
            
            if (!this.validateField(element, validate)) {
                isValid = false;
                
                // Focus en el primer campo con error
                if (isValid) {
                    element.focus();
                }
            }
        }
        
        return isValid;
    }
    
    showFieldError(field, errorElement, message) {
        field.style.borderColor = 'var(--color-error)';
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    clearFieldError(field) {
        field.style.borderColor = '';
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
            field.style.borderColor = '';
        });
    }
    
    async submitForm() {
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (!submitBtn || !btnText || !btnLoading) return;
        
        // Mostrar estado de carga
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';
        
        try {
            const formData = new FormData(this.contactForm);
            
            const response = await fetch(this.contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
                this.contactForm.reset();
            } else {
                throw new Error(result.error || 'Error al enviar el mensaje');
            }
            
        } catch (error) {
            console.error('Error enviando formulario:', error);
            this.showNotification(error.message || 'Error de conexión. Intenta nuevamente.', 'error');
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--color-exito)' : 'var(--color-error)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow-heavy);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Cerrar notificación">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 5 segundos
        const autoRemove = setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        // Cerrar manualmente
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            notification.remove();
        });
    }
}

// Scroll animations optimizadas con Intersection Observer
class ScrollAnimator {
    constructor() {
        this.fadeElements = document.querySelectorAll('.fade-in, .producto-card, .valor-card, .mv-item, .info-item');
        this.observer = null;
        
        this.init();
    }
    
    init() {
        if (!this.fadeElements.length) return;
        
        this.setupObserver();
    }
    
    setupObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.fadeElements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// Lazy loading optimizado
class LazyLoader {
    constructor() {
        this.lazyImages = document.querySelectorAll('img[loading="lazy"]');
        this.observer = null;
        
        this.init();
    }
    
    init() {
        if (!this.lazyImages.length) return;
        
        // Si el navegador soporta lazy loading nativo, no hacer nada
        if ('loading' in HTMLImageElement.prototype) {
            return;
        }
        
        this.setupObserver();
    }
    
    setupObserver() {
        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        });
        
        this.lazyImages.forEach(img => {
            // Si no tiene data-src, ya está cargada
            if (!img.dataset.src) return;
            
            // Mostrar placeholder mientras carga
            img.style.backgroundColor = 'var(--color-gris-claro)';
            img.style.minHeight = '50px';
            
            this.observer.observe(img);
        });
    }
    
    loadImage(img) {
        // Cargar imagen
        if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
        }
        
        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            delete img.dataset.srcset;
        }
        
        img.classList.remove('lazy');
        
        // Remover estilos de placeholder
        img.style.backgroundColor = '';
        img.style.minHeight = '';
    }
}

// Header scroll behavior optimizado
class HeaderManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        if (!this.header) return;
        
        this.bindEvents();
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }
    
    onScroll() {
        this.lastScrollY = window.scrollY;
        
        if (!this.ticking) {
            requestAnimationFrame(() => this.updateHeader());
            this.ticking = true;
        }
    }
    
    updateHeader() {
        const currentScrollY = this.lastScrollY;
        
        if (currentScrollY > 100) {
            // Scrolling down - ocultar header
            if (currentScrollY > this.lastScrollY) {
                this.header.classList.add('hide');
            } else {
                // Scrolling up - mostrar header
                this.header.classList.remove('hide');
            }
            
            // Agregar sombra cuando se hace scroll
            this.header.style.boxShadow = 'var(--shadow-medium)';
        } else {
            // En la parte superior - mostrar header sin sombra
            this.header.classList.remove('hide');
            this.header.style.boxShadow = 'var(--shadow-light)';
        }
        
        this.ticking = false;
    }
}

// Performance Optimizations
class PerformanceOptimizer {
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Error Handling
class ErrorHandler {
    static init() {
        // Global error handling
        window.addEventListener('error', (e) => {
            console.error('Error global:', e.error);
        });
        
        // Promise rejection handling
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rechazada:', e.reason);
            e.preventDefault();
        });
    }
}

// Main Application
class TrifarmaApp {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
    }
    
    init() {
        if (this.isInitialized) return;
        
        try {
            // Inicializar módulos
            this.modules.menuManager = new MenuManager();
            this.modules.smoothScroller = new SmoothScroller();
            this.modules.formValidator = new FormValidator();
            this.modules.scrollAnimator = new ScrollAnimator();
            this.modules.lazyLoader = new LazyLoader();
            this.modules.headerManager = new HeaderManager();
            
            // Inicializar error handling
            ErrorHandler.init();
            
            // Preload de imágenes críticas
            this.preloadCriticalImages();
            
            this.isInitialized = true;
            console.log('Trifarma App inicializada correctamente');
            
        } catch (error) {
            console.error('Error inicializando la aplicación:', error);
        }
    }
    
    preloadCriticalImages() {
        const criticalImages = [
            './img/logo.png',
            './img/hero-background.jpeg'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // Método para acceso global a los módulos (debugging)
    getModule(name) {
        return this.modules[name];
    }
}

// Inicialización de la aplicación
const trifarmaApp = new TrifarmaApp();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => trifarmaApp.init());
} else {
    trifarmaApp.init();
}

// Export para uso modular (si se usa bundler)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TrifarmaApp,
        MenuManager,
        SmoothScroller,
        FormValidator,
        ScrollAnimator,
        LazyLoader,
        HeaderManager,
        PerformanceOptimizer,
        ErrorHandler
    };
}

// Global access para debugging
window.TrifarmaApp = trifarmaApp;