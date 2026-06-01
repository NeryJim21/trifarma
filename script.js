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

        if (!this.menuToggle || !this.nav) return;

        this.init();
    }

    init() {
        this.bindEvents();

        // Estado inicial accesible
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.nav.setAttribute('aria-hidden', 'true');
    }

    bindEvents() {
        // Toggle
        this.menuToggle.addEventListener('click', () => this.toggleMenu());

        // Delegación para links
        this.nav.addEventListener('click', (e) => {
            if (e.target.closest('a') && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Click fuera (optimizado)
        document.addEventListener('click', (e) => {
            if (!this.isMenuOpen) return;

            if (
                !this.nav.contains(e.target) &&
                !this.menuToggle.contains(e.target)
            ) {
                this.closeMenu();
            }
        });

        // ESC
        document.addEventListener('keydown', (e) => {
            if (!this.isMenuOpen) return;

            if (e.key === 'Escape') {
                this.closeMenu();
                this.menuToggle.focus();
            }
        });
    }

    toggleMenu() {
        this.isMenuOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        this.nav.classList.add('active');
        this.menuToggle.setAttribute('aria-expanded', 'true');
        this.nav.setAttribute('aria-hidden', 'false');

        this.body.style.overflow = 'hidden';
        this.isMenuOpen = true;

        this.updateIcon(true);
    }

    closeMenu() {
        this.nav.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.nav.setAttribute('aria-hidden', 'true');

        this.body.style.overflow = '';
        this.isMenuOpen = false;

        this.updateIcon(false);
    }

    updateIcon(isOpen) {
        const icon = this.menuToggle.querySelector('i');
        if (!icon) return;

        icon.classList.remove('fa-bars', 'fa-times');
        icon.classList.add(isOpen ? 'fa-times' : 'fa-bars');
    }
}

// Smooth scrolling optimizado
class SmoothScroller {
    constructor() {
        this.header = document.querySelector('.header');

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');

            // Ignorar casos no válidos
            if (!href || href === '#' || href.startsWith('#!')) return;

            this.handleLinkClick(e, href);
        });
    }

    handleLinkClick(e, targetId) {
        let targetElement;

        try {
            targetElement = document.querySelector(targetId);
        } catch {
            return; // evita crash por selector inválido
        }

        if (!targetElement) return;

        e.preventDefault();

        this.closeMobileMenuIfOpen();
        this.scrollToElement(targetElement);
    }

    getHeaderHeight() {
        return this.header ? this.header.offsetHeight : 70;
    }

    scrollToElement(element) {
        const headerOffset = this.getHeaderHeight();

        const targetPosition =
            element.getBoundingClientRect().top +
            window.pageYOffset -
            headerOffset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Mejor UX: no contaminar historial
        history.replaceState(null, null, `#${element.id}`);

        // Accesibilidad: mover foco
        element.setAttribute('tabindex', '-1');
        element.focus({ preventScroll: true });
    }

    closeMobileMenuIfOpen() {
        const nav = document.querySelector('.nav');

        if (nav?.classList.contains('active')) {
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
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
                    if (!value) return 'Este campo es obligatorio';
                    if (value.length < 2) return 'Mínimo 2 caracteres';
                    if (value.length > 100) return 'Máximo 100 caracteres';
                    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\.]+$/.test(value)) {
                        return 'Solo se permiten letras';
                    }
                    return null;
                }
            },

            telefono: {
                element: document.getElementById('telefono'),
                validate: (value) => {
                    if (!value) return 'Este campo es obligatorio';

                    const phonePattern = /^[2-9]\d{3}-\d{4}$/;

                    if (!phonePattern.test(value)) {
                        return 'Formato inválido (####-####)';
                    }

                    return null;
                }
            },

            departamento: {
                element: document.getElementById('departamento'),
                validate: (value) => {
                    if (!value) return 'Selecciona un departamento';
                    return null;
                }
            },

            mensaje: {
                element: document.getElementById('mensaje'),
                validate: (value) => {
                    if (!value) return 'Este campo es obligatorio';
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

        this.loadDepartamentos();

        this.bindEvents();
    }

    bindEvents() {
        Object.values(this.fields).forEach(({ element, validate }) => {
            if (!element) return;

            element.addEventListener('blur', () =>
                this.validateField(element, validate)
            );

            element.addEventListener('input', () =>
                this.clearFieldError(element)
            );

            element.addEventListener('change', () =>
                this.validateField(element, validate)
            );
        });

        this.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isValid = await this.validateForm();

            if (isValid) {
                await this.submitForm();
            }
        });

        const telefonoField = this.fields.telefono.element;

        if (telefonoField) {
            // Formateo en tiempo real
            telefonoField.addEventListener('input', (e) => this.formatPhoneInput(e));

            // Bloquear caracteres inválidos desde teclado
            telefonoField.addEventListener('keypress', (e) => {
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });

            // Evitar pegar texto inválido
            telefonoField.addEventListener('paste', (e) => {
                e.preventDefault();
                const paste = (e.clipboardData || window.clipboardData).getData('text');
                const cleaned = paste.replace(/\D/g, '').substring(0, 8);

                if (cleaned.length > 4) {
                    e.target.value = cleaned.replace(/(\d{4})(\d+)/, '$1-$2');
                } else {
                    e.target.value = cleaned;
                }
            });
        }
    }

    formatPhoneInput(e) {
        let value = e.target.value;

        // Eliminar todo lo que no sea número
        value = value.replace(/\D/g, '');

        // Limitar a 8 dígitos (Guatemala)
        value = value.substring(0, 8);

        // Aplicar formato ####-####
        if (value.length > 4) {
            value = value.replace(/(\d{4})(\d+)/, '$1-$2');
        }

        e.target.value = value;
    }

    validateField(field, validateFn) {
        const errorElement = field.nextElementSibling;
        const value = field.value.trim();
        const error = validateFn(value);

        if (error) {
            this.showFieldError(field, errorElement, error);
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    async validateForm() {
        let isValid = true;
        let firstInvalidField = null;

        this.clearAllErrors();

        for (const { element, validate } of Object.values(this.fields)) {
            if (!element) continue;

            const valid = this.validateField(element, validate);

            if (!valid) {
                isValid = false;

                if (!firstInvalidField) {
                    firstInvalidField = element;
                }
            }
        }

        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return isValid;
    }

    showFieldError(field, errorElement, message) {
        if (!errorElement) return;

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
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });

        document.querySelectorAll('.form-group input, .form-group textarea, .form-group select')
            .forEach(field => field.style.borderColor = '');
    }

    async submitForm() {
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoading = submitBtn?.querySelector('.btn-loading');

        if (!submitBtn || !btnText || !btnLoading) return;

        // estado loading
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

            if (!response.ok) {
                throw new Error(result.error || 'Error al enviar el formulario');
            }

            this.showNotification(
                '¡Mensaje enviado correctamente! Te contactaremos pronto.',
                'success'
            );

            this.contactForm.reset();

        } catch (error) {
            console.error('Error enviando formulario:', error);

            this.showNotification(
                error.message || 'Error de conexión. Intenta nuevamente.',
                'error'
            );
        } finally {
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

        const autoRemove = setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            notification.remove();
        });
    }

    loadDepartamentos() {
        const waitForSelect = setInterval(() => {
            const select = document.getElementById('departamento');

            if (!select) return;

            clearInterval(waitForSelect);

            const departamentos = [
                "Guatemala",
                "Sacatepéquez",
                "Chimaltenango",
                "Escuintla",
                "Santa Rosa",
                "Sololá",
                "Totonicapán",
                "Quetzaltenango",
                "Suchitepéquez",
                "Retalhuleu",
                "San Marcos",
                "Huehuetenango",
                "Quiché",
                "Baja Verapaz",
                "Alta Verapaz",
                "Petén",
                "Izabal",
                "Zacapa",
                "Chiquimula",
                "Jalapa",
                "Jutiapa"
            ];

            departamentos.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep.toLowerCase();
                option.textContent = dep;
                select.appendChild(option);
            });

            console.log('Departamentos cargados');
        }, 100);
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
    const currentScrollY = window.scrollY;

    if (!this.ticking) {
        requestAnimationFrame(() => this.updateHeader(currentScrollY));
        this.ticking = true;
    }
}

updateHeader(currentScrollY) {
    if (currentScrollY > 100) {
        if (currentScrollY > this.lastScrollY) {
            this.header.classList.add('hide');
        } else {
            this.header.classList.remove('hide');
        }

        this.header.style.boxShadow = 'var(--shadow-medium)';
        } else {
            this.header.classList.remove('hide');
            this.header.style.boxShadow = 'var(--shadow-light)';
        }

        this.lastScrollY = currentScrollY;
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