// script.js — CYBERM Global Script
// Handles: Lucide icons, IntersectionObserver reveal, scroll header, smooth anchor, mobile menu, workspace sidebar

lucide.createIcons();

/* ─── Reveal on scroll ─── */
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
revealElements.forEach((el) => revealObserver.observe(el));

/* ─── Scroll-shadow header ─── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 40
        ? '0 5px 25px rgba(0,0,0,0.06)'
        : 'none';
});

/* ─── Smooth anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function (event) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || !targetId) return;
        const target = document.querySelector(targetId);
        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ─── Mobile menu toggle ─── */
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => navLinks.classList.toggle('mobile-active'));
    document.querySelectorAll('.nav-links a').forEach((link) => {
        link.addEventListener('click', () => navLinks.classList.remove('mobile-active'));
    });
}

/* ─── Workspace sidebar click ─── */
document.querySelectorAll('.side-link').forEach((link) => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.side-link').forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
    });
});

/* ─── Floating AI Button (injected on all non-landing pages) ─── */
(function injectAIFloat() {
    const isLanding = window.location.pathname.endsWith('index.html') ||
                      window.location.pathname === '/' ||
                      window.location.pathname === '';
    if (isLanding) return;

    // Don't double-inject
    if (document.getElementById('ai-float-global')) return;

    const btn = document.createElement('button');
    btn.id = 'ai-float-global';
    btn.className = 'ai-float';
    btn.title = 'CyberM AI Assistant';
    btn.setAttribute('aria-label', 'Open CyberM AI Assistant');
    btn.innerHTML = `
        <span class="ai-float-label">CyberM AI</span>
        <i data-lucide="bot"></i>
    `;
    btn.addEventListener('click', () => {
        // If on dashboard.html scroll to AI section, otherwise navigate
        const aiSection = document.getElementById('ai-section');
        if (aiSection) {
            aiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.location.href = 'dashboard.html#ai-section';
        }
    });
    document.body.appendChild(btn);
    // Re-render Lucide for the newly injected icon
    lucide.createIcons();
})();

/* ─── Sign Out ─── */
function signOut() {
    localStorage.removeItem('cyberm_user');
    window.location.href = 'index.html';
}

/* ─── Ctrl+K global search shortcut (routes to dashboard search) ─── */
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('dash-search-input');
        if (searchInput) {
            searchInput.focus();
        } else {
            window.location.href = 'dashboard.html';
        }
    }
});