/**
 * Sistema de modal de productos optimizado para Trifarma
 */

// Datos de los productos optimizados
const productosData = {
    kidmax: {
        nombre: "KIDMAX",
        tipo: "JARABE MULTIVITAMÍNICO",
        descripcion: "Especialmente formulado para el crecimiento y desarrollo infantil.",
        imagen: "./img/kidmax.png",
        categoria: "Nutrición",
        presentaciones: ["120 mL", "240 mL"],
        beneficios: [
            "Fortalece el sistema inmunológico",
            "Favorece la síntesis de proteínas y tejidos",
            "Estimula el apetito",
            "Apoyo al desarrollo físico y cognitivo",
            "Energía constante para el día a día"
        ]
    },
    duopack: {
        nombre: "KIDMAX DUOPACK",
        tipo: "COMBO ESPECIAL",
        descripcion: "Duopack especial que incluye Kidmax en presentación de 120 mL y 240 mL. Ideal para mayor comodidad y economía.",
        imagen: "./img/duopack.png",
        categoria: "Nutrición",
        presentaciones: ["Pack 120 mL + 240 mL"],
        beneficios: [
            "Fortalece el sistema inmunológico",
            "Favorece la síntesis de proteínas y tejidos",
            "Estimula el apetito",
            "Apoyo al desarrollo físico y cognitivo",
            "Energía constante para el día a día",
            "Comodidad y economía"
        ]
    },
    viotrof: {
        nombre: "VIOTROF",
        tipo: "JARABE ANTIANÉMICO",
        descripcion: "Jarabe antianémico con hierro y ácido fólico para el tratamiento y prevención de la anemia.",
        imagen: "./img/viotrof.png",
        categoria: "Nutrición",
        presentaciones: ["Frasco 120 mL"],
        beneficios: [
            "Combate y previene la anemia",
            "Hierro de alta biodisponibilidad",
            "Ácido fólico para mejor absorción",
            "Sabor agradable",
            "Mejor tolerancia gástrica"
        ]
    },
    enerking: {
        nombre: "ENERKING H4",
        tipo: "SUPLEMENTO VITAMÍNICO",
        descripcion: "Suplemento vitamínico completo que proporciona energía y vitalidad para el día a día.",
        imagen: "./img/enerking.png",
        categoria: "Antiasténico",
        presentaciones: ["30 cápsulas", "60 cápsulas"],
        beneficios: [
            "Multivitamínico + reconstruyente integral",
            "Energía física y mental",
            "Protección antioxidante",
            "Oxigenación cerebral"
        ]
    },
    ginsenvit: {
        nombre: "GINSENVIT",
        tipo: "ENERGIZANTE NATURAL",
        descripcion: "Suplemento vitamínico con ginseng para aumentar el rendimiento físico y mental.",
        imagen: "./img/ginsenvit.png",
        categoria: "Antiasténico",
        presentaciones: ["15 flaconetes"],
        beneficios: [
            "Reconstruyente multivitamínico",
            "Potencia la función neuromuscular",
            "Mejora el metabolismo energético celular",
            "Potencia la oxigenación y el rendimiento"
        ]
    },
    starsingrip: {
        nombre: "STARSINGRIP",
        tipo: "SOLUCIÓN INMUNOLÓGICA",
        descripcion: "Solución oral con vitaminas A, D, E, C y Zinc especialmente formulada para fortalecer el sistema inmunológico.",
        imagen: "./img/starsingrip.png",
        categoria: "Inmunología",
        presentaciones: ["15 flaconetes"],
        beneficios: [
            "Reducción del 25% en duración de diarreas",
            "Reducción del 34% en episodios respiratorios",
            "Reducción del 30% en episodios persistentes",
            "Reduce un 40% los síntomas del resfriado común"
        ]
    },
    argking: {
        nombre: "ARGKING",
        tipo: "SOLUCIÓN PARA BIENESTAR",
        descripcion: "Solución oral para el bienestar general con fórmula equilibrada de nutrientes esenciales.",
        imagen: "./img/argking.png",
        categoria: "Inmunología",
        presentaciones: ["15 flaconetes"],
        beneficios: [
            "Doble relanzamiento de energía",
            "Aminoácidos clave",
            "Mejora el flujo sanguíneo",
            "Mejora el rendimiento físico"
        ]
    },
    dexketoprofeno: {
        nombre: "DEXKETOPROFENO TRIFARMA",
        tipo: "ANALGÉSICO Y ANTIINFLAMATORIO",
        descripcion: "Analgésico y antiinflamatorio no esteroideo para el alivio del dolor agudo y moderado.",
        imagen: "./img/dexketoprofeno.png",
        categoria: "Analgésico",
        presentaciones: ["10 sachets"],
        beneficios: [
            "Analgésico, antiinflamatorio y antipirético",
            "Efectivo en dolor agudo de moderado a intenso",
            "Acción antiinflamatoria",
            "Eficaz en dolor agudo",
            "Fácil administración",
            "Buen perfil de seguridad"
        ]
    },
    ortak: {
        nombre: "ORTAK",
        tipo: "INYECTABLE ANALGÉSICO",
        descripcion: "Dexketoprofeno en presentación inyectable para aplicación intramuscular.",
        imagen: "./img/ortak.png",
        categoria: "Analgésico",
        presentaciones: ["1 ampolla", "3 ampollas", "100 ampollas"],
        beneficios: [
            "Analgésico, antiinflamatorio y antipirético",
            "Efectivo en dolor agudo de moderado a intenso",
            "De uso intramuscular e intravenosa",
            "Efectivo en dolor severo",
            "Menos efectos secundarios"
        ]
    },
    dexketoprofeno_vitaminado: {
        nombre: "DEXKETOPROFENO + COMPLEJO B",
        tipo: "ANALGÉSICO Y ANTIINFLAMATORIO",
        descripcion: "Analgésico y antiinflamatorio vitaminado no esteroideo para el alivio del dolor agudo y moderado.",
        imagen: "./img/dexketoprofeno-vitaminado.png",
        categoria: "Analgésico",
        presentaciones: ["20 tabletas"],
        beneficios: [
            "Analgésico, antiinflamatorio y antipirético",
            "Efectivo en dolor agudo de moderado a intenso", 
            "Acción antiinflamatoria",
            "Complejo B neurotrópico para salud del sistema nervioso",
            "Fácil administración",
            "Buen perfil de seguridad",
            "Vitaminas B1, B6 y B12 con acción neuroprotectora"
        ]
    },
    ulcefar: {
        nombre: "ULCEFAR",
        tipo: "Protector gástrico",
        descripcion: "Control eficaz de la acidez gástrica para el alivio del reflujo y la protección del estómago.",
        imagen: "./img/ulcefar.png",
        categoria: "Gástrico",
        presentaciones: ["30 cápsulas"],
        beneficios: [
            "Reduce la producción de ácido gástrico",
            "Alivia el reflujo y la acidez",
            "Favorece la cicatrización de la mucosa gástrica",
            "Acción prolongada durante el día",
            "Seguridad y respaldo clínico"
        ]
    }
};

// Gestor de modal optimizado
class ProductosModalManager {
    constructor() {
        this.modal = document.getElementById('productoModal');
        this.modalClose = document.getElementById('modalClose');
        this.productoCards = document.querySelectorAll('.producto-card');
        this.isOpen = false;
        this.currentProduct = null;
        this.focusableElements = [];
        this.lastFocusedElement = null;
        
        this.init();
    }
    
    init() {
        if (!this.modal || this.productoCards.length === 0) {
            console.warn('Elementos del modal no encontrados');
            return;
        }
        
        this.bindEvents();
        this.preloadImages();
        this.injectModalStyles();
    }
    
    bindEvents() {
        // Event listeners para tarjetas de productos
        this.productoCards.forEach(card => {
            card.addEventListener('click', (e) => this.openModal(e));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openModal(e);
                }
            });
        });
        
        // Event listeners para cerrar modal
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.closeModal();
        });
        
        // Manejar focus dentro del modal
        this.modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabKey(e);
            }
        });
    }
    
    openModal(e) {
        const card = e.currentTarget;
        const productoId = card.getAttribute('data-producto');
        
        if (!productoId || !productosData[productoId]) {
            console.warn('Producto no encontrado:', productoId);
            this.showError('Producto no disponible');
            return;
        }
        
        this.lastFocusedElement = document.activeElement;
        this.currentProduct = productosData[productoId];
        this.renderModal();
        this.showModal();
        
        // Analytics (opcional)
        this.trackModalOpen(productoId);
    }
    
    renderModal() {
        if (!this.currentProduct) return;
        
        const {
            imagen,
            nombre,
            tipo,
            descripcion,
            presentaciones,
            beneficios
        } = this.currentProduct;
        
        // Actualizar contenido del modal
        this.updateElement('modalImagen', 'src', imagen);
        this.updateElement('modalImagen', 'alt', `${nombre} - ${tipo}`);
        this.updateElement('modalNombre', 'textContent', nombre);
        this.updateElement('modalTipo', 'textContent', tipo);
        this.updateElement('modalDescripcion', 'textContent', descripcion);
        
        // Renderizar presentaciones
        this.renderPresentaciones(presentaciones);
        
        // Renderizar beneficios
        this.renderBeneficios(beneficios);
        
        // Configurar accesibilidad
        this.setupAccessibility();
    }
    
    updateElement(elementId, property, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element[property] = value;
        }
    }
    
    renderPresentaciones(presentaciones) {
        const container = document.getElementById('modalPresentaciones');
        if (!container) return;

        // Limpiar contenido previo
        container.innerHTML = '';

        presentaciones.forEach(presentacion => {
            const span = document.createElement('span');
            span.className = 'modal-presentacion';
            span.setAttribute('tabindex', '0');
            span.textContent = presentacion;

            container.appendChild(span);
        });
    }
    
    renderBeneficios(beneficios) {
        const container = document.getElementById('modalBeneficios');
        if (!container) return;

        // Limpiar contenido previo
        container.innerHTML = '';

        beneficios.forEach(beneficio => {
            const li = document.createElement('li');
            li.setAttribute('tabindex', '0');
            li.textContent = beneficio;

            container.appendChild(li);
        });
    }
    
    showModal() {
        this.modal.classList.add('active');
        this.isOpen = true;
        document.body.classList.add('modal-open');
        
        // Configurar elementos enfocables
        this.setFocusableElements();
        
        // Focus management
        setTimeout(() => {
            this.modalClose.focus();
        }, 100);
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        this.isOpen = false;
        this.currentProduct = null;
        document.body.classList.remove('modal-open');
        
        // Devolver focus al elemento que abrió el modal
        if (this.lastFocusedElement) {
            setTimeout(() => {
                this.lastFocusedElement.focus();
            }, 100);
        }
    }
    
    setupAccessibility() {
        // Agregar roles ARIA
        this.modal.setAttribute('aria-modal', 'true');
        this.modal.setAttribute('aria-labelledby', 'modalNombre');
        this.modal.setAttribute('aria-describedby', 'modalDescripcion');
    }
    
    setFocusableElements() {
        this.focusableElements = Array.from(this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));
    }
    
    handleTabKey(e) {
        if (!this.focusableElements.length) return;
        
        const firstElement = this.focusableElements[0];
        const lastElement = this.focusableElements[this.focusableElements.length - 1];
        
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
    
    preloadImages() {
        // Preload de imágenes de productos para mejor UX
        Object.values(productosData).forEach(producto => {
            const img = new Image();
            img.src = producto.imagen;
        });
    }
    
    injectModalStyles() {
        if (document.querySelector('#modal-dynamic-styles')) return;
        
        const styles = `
            .modal-loading {
                position: relative;
            }
            
            .modal-loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid var(--color-azul-intermedio);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            .modal-error {
                background: #fee;
                border: 1px solid var(--color-error);
                border-radius: 8px;
                padding: 1rem;
                margin: 1rem 0;
                text-align: center;
            }
            
            .error-content i {
                color: var(--color-error);
                font-size: 2rem;
                margin-bottom: 1rem;
            }
            
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            
            .modal-presentacion:focus {
                outline: 2px solid var(--color-amarillo);
                outline-offset: 2px;
            }
            
            .beneficios-lista li:focus {
                outline: 1px solid var(--color-azul-intermedio);
                border-radius: 4px;
            }
            
            body.modal-open {
                overflow: hidden;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-dynamic-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'modal-error';

        const content = document.createElement('div');
        content.className = 'error-content';

        const icon = document.createElement('i');
        icon.className = 'fas fa-exclamation-triangle';

        const text = document.createElement('p');
        text.textContent = message;

        const button = document.createElement('button');
        button.textContent = 'Cerrar';
        button.addEventListener('click', () => errorDiv.remove());

        content.appendChild(icon);
        content.appendChild(text);
        content.appendChild(button);

        errorDiv.appendChild(content);

        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            text-align: center;
        `;

        document.body.appendChild(errorDiv);
    }
    
    trackModalOpen(productoId) {
        // Integración con analytics (opcional)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'product_view', {
                'event_category': 'engagement',
                'event_label': productoId
            });
        }
        
        console.log('Modal abierto para producto:', productoId);
    }
}

// Inicialización
let productosModalManager = null;

function initProductosModal() {
    try {
        productosModalManager = new ProductosModalManager();
        window.ProductosModalManager = productosModalManager;
        console.log('Sistema de modal de productos inicializado correctamente');
    } catch (error) {
        console.error('Error inicializando el modal de productos:', error);
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductosModal);
} else {
    initProductosModal();
}

// Export para uso modular (si se usa bundler)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ProductosModalManager,
        productosData,
        initProductosModal
    };
}

// Global access para debugging
window.ProductosModalManager = productosModalManager;