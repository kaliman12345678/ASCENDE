/* ==========================================================================
   ASCENDE — app.js
   Interacciones: navbar, menú, modales, formulario, parallax, cookies
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ------------------------------------------------------------------
    // 1. NAVBAR — scroll shrink
    // ------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ------------------------------------------------------------------
    // 2. MENÚ HAMBURGUESA MÓVIL
    // ------------------------------------------------------------------
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    // ------------------------------------------------------------------
    // 3. HERO IMAGE — animación al cargar
    // ------------------------------------------------------------------
    const heroBg = document.querySelector('.hero-bg-img');
    if (heroBg) {
        heroBg.classList.add('loaded');
        window.addEventListener('scroll', () => {
            if (window.scrollY < window.innerHeight) {
                heroBg.style.transform = `scale(1) translateY(${window.scrollY * 0.25}px)`;
            }
        }, { passive: true });
    }

    // ------------------------------------------------------------------
    // 4. SCROLL SUAVE
    // ------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]:not(.modal-link)').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            const target   = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 20;
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
            }
        });
    });

    // ------------------------------------------------------------------
    // 5. MODALES
    // ------------------------------------------------------------------
    const modals     = document.querySelectorAll('.modal');
    const modalLinks = document.querySelectorAll('.modal-link');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeAllModals() {
        modals.forEach(m => {
            m.classList.remove('open');
            m.setAttribute('aria-hidden', 'true');
        });
        document.body.style.overflow = '';
    }

    modalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(link.getAttribute('data-modal'));
        });
    });

    modals.forEach(modal => {
        modal.querySelectorAll('.modal-close-trigger, .modal-close-btn').forEach(el => {
            el.addEventListener('click', closeAllModals);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // ------------------------------------------------------------------
    // 6. FORMULARIO DE CONTACTO
    // ------------------------------------------------------------------
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Enviando…';
            setTimeout(() => {
                form.reset();
                btn.disabled = false;
                btn.textContent = 'Enviar mensaje';
                if (success) {
                    success.style.display = 'flex';
                    setTimeout(() => { success.style.display = 'none'; }, 5000);
                }
            }, 1200);
        });
    }

    // ------------------------------------------------------------------
    // 7. ANIMACIÓN DE ENTRADA (IntersectionObserver)
    // ------------------------------------------------------------------
    const animatables = document.querySelectorAll('.pillar-card, .split-image-wrap, .legal-card, .growth-image-wrap, .btn-legal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity   = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatables.forEach(el => {
            el.style.opacity    = '0';
            el.style.transform  = 'translateY(30px)';
            el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            const delay = el.getAttribute('data-delay') || 0;
            el.style.transitionDelay = `${delay}ms`;
            observer.observe(el);
        });
    }

    // ------------------------------------------------------------------
    // 8. BANNER DE PRIVACIDAD / COOKIES
    // ------------------------------------------------------------------
    const cookieBanner  = document.getElementById('cookieBanner');
    const cookieAccept  = document.getElementById('cookieAccept');
    const cookieDetails = document.getElementById('cookieDetails');

    if (cookieBanner) {
        // Inicialmente oculto en CSS — mostrarlo si no fue aceptado
        const accepted = localStorage.getItem('ascende_privacy_accepted');
        if (!accepted) {
            cookieBanner.style.display = 'flex';
            setTimeout(() => cookieBanner.classList.remove('hidden'), 800);
        }

        if (cookieAccept) {
            cookieAccept.addEventListener('click', () => {
                localStorage.setItem('ascende_privacy_accepted', 'true');
                cookieBanner.classList.add('hidden');
                setTimeout(() => { cookieBanner.style.display = 'none'; }, 500);
            });
        }

        if (cookieDetails) {
            cookieDetails.addEventListener('click', () => {
                openModal('modal-privacidad');
            });
        }
    }

});
