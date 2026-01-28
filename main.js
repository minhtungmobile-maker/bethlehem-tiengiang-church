/**
 * HỘI THÁNH TIN LÀNH BETHLEHEM - TIỀN GIANG
 * main.js - Optimized for Performance
 * Version: 1.0.0
 */

// ===== CONFIGURATION =====
const CONFIG = {
    siteName: 'Hội Thánh Tin Lành Bethlehem',
    contactEmail: 'info@bethlehemtiengiang.org',
    mapsEmbed: 'https://maps.google.com/maps?q=123+Đường+Lê+Lợi+Mỹ+Tho+Tiền+Giang&output=embed'
};

// ===== DOM ELEMENTS =====
const elements = {
    body: document.body,
    header: document.querySelector('.header'),
    nav: document.querySelector('.nav'),
    mobileToggle: document.querySelector('.mobile-toggle'),
    scrollIndicator: document.querySelector('.scroll-indicator'),
    heroTitle: document.querySelector('.hero-title'),
    forms: document.querySelectorAll('form'),
    donateForm: document.getElementById('donateForm'),
    contactForm: document.getElementById('contactForm')
};

// ===== MOBILE NAVIGATION =====
function initMobileNav() {
    if (!elements.mobileToggle || !elements.nav) return;
    
    elements.mobileToggle.addEventListener('click', () => {
        elements.nav.classList.toggle('active');
        elements.mobileToggle.classList.toggle('active');
        elements.body.classList.toggle('nav-open');
    });
    
    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!elements.nav.contains(e.target) && 
            !elements.mobileToggle.contains(e.target) && 
            elements.nav.classList.contains('active')) {
            elements.nav.classList.remove('active');
            elements.mobileToggle.classList.remove('active');
        }
    });
    
    // Close nav on link click (mobile)
    elements.nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            elements.nav.classList.remove('active');
            elements.mobileToggle.classList.remove('active');
        });
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Header scroll effect
    let lastScroll = 0;
    const headerHeight = elements.header?.offsetHeight || 80;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > headerHeight) {
            elements.header?.classList.add('header-hidden');
        } else {
            elements.header?.classList.remove('header-hidden');
        }
        
        // Hide scroll indicator after scroll
        if (elements.scrollIndicator && currentScroll > 100) {
            elements.scrollIndicator.style.opacity = '0';
        } else if (elements.scrollIndicator) {
            elements.scrollIndicator.style.opacity = '1';
        }
        
        lastScroll = currentScroll;
    });
    
    // Scroll indicator click
    if (elements.scrollIndicator) {
        elements.scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
}

// ===== FORM VALIDATION & HANDLING =====
function initForms() {
    if (!elements.forms.length) return;
    
    elements.forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });
    });
    
    // Donation form specific
    if (elements.donateForm) {
        const amountInput = elements.donateForm.querySelector('input[name="amount"]');
        if (amountInput) {
            amountInput.addEventListener('input', formatCurrency);
        }
    }
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const errorElement = field.nextElementSibling?.classList.contains('error-message') 
        ? field.nextElementSibling 
        : null;
    
    let isValid = true;
    let message = '';
    
    // Required validation
    if (field.required && !value) {
        isValid = false;
        message = 'Trường này là bắt buộc';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Email không hợp lệ';
        }
    }
    
    // Phone validation
    if (field.name === 'phone' && value) {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            message = 'Số điện thoại không hợp lệ';
        }
    }
    
    // Update field state
    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        if (errorElement) errorElement.remove();
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
        if (!errorElement) {
            const errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.textContent = message;
            errorMsg.style.cssText = 'color: #dc3545; font-size: 0.875rem; margin-top: 5px; display: block;';
            field.parentNode.insertBefore(errorMsg, field.nextSibling);
        } else {
            errorElement.textContent = message;
        }
    }
    
    return isValid;
}

function clearError(e) {
    const field = e.target;
    field.classList.remove('invalid');
    const errorElement = field.nextElementSibling?.classList.contains('error-message') 
        ? field.nextElementSibling 
        : null;
    if (errorElement) errorElement.remove();
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formId = form.id || 'form';
    
    // Validate all required fields
    const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const event = new Event('blur');
        field.dispatchEvent(event);
        if (field.classList.contains('invalid')) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showMessage('Vui lòng kiểm tra lại thông tin', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent;
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang gửi...';
    }
    
    // Simulate API call
    setTimeout(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
        
        // Show success message
        showMessage('Thông tin đã được gửi thành công! Chúng tôi sẽ liên hệ sớm.', 'success');
        form.reset();
        
        // Remove validation classes
        form.querySelectorAll('.valid, .invalid').forEach(el => {
            el.classList.remove('valid', 'invalid');
        });
        
        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1500);
}

function formatCurrency(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value) {
        value = parseInt(value).toLocaleString('vi-VN');
        input.value = value;
    }
}

// ===== UTILITY FUNCTIONS =====
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMsg = document.querySelector('.global-message');
    if (existingMsg) existingMsg.remove();
    
    // Create message element
    const msgElement = document.createElement('div');
    msgElement.className = `global-message ${type}`;
    msgElement.textContent = message;
    msgElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        ${type === 'success' ? 'background: #28a745;' : ''}
        ${type === 'error' ? 'background: #dc3545;' : ''}
        ${type === 'info' ? 'background: #17a2b8;' : ''}
    `;
    
    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(msgElement);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        msgElement.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => msgElement.remove(), 300);
    }, 5000);
}

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

// ===== LAZY LOADING =====
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
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
        // Fallback for older browsers
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// ===== CURRENT YEAR =====
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without page reload
                history.pushState(null, null, href);
            }
        });
    });
}

// ===== INITIALIZATION =====
function init() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Initialize components
    initMobileNav();
    initScrollEffects();
    initForms();
    initLazyLoading();
    initSmoothScroll();
    updateCurrentYear();
    
    // Add loaded class to body for CSS animations
    window.addEventListener('load', () => {
        elements.body.classList.add('loaded');
        
        // Remove scroll indicator after page load if user prefers reduced motion
        if (prefersReducedMotion.matches && elements.scrollIndicator) {
            elements.scrollIndicator.style.display = 'none';
        }
    });
    
    // Error handling
    window.addEventListener('error', (e) => {
        console.error('Website error:', e.error);
        // You could send this to an error tracking service
    });
    
    // Log initialization
    console.log(`${CONFIG.siteName} - Website initialized successfully`);
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', init);

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        init,
        showMessage
    };
}