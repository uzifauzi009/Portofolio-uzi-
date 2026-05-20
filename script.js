// ==========================================
// 1. LOGIKA ANIMASI SCROLL (Slide-Up Bento Box)
// ==========================================
const slideElements = document.querySelectorAll('.slide-up');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2 // Animasi berjalan saat 20% bagian elemen terlihat
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

slideElements.forEach(el => observer.observe(el));

// --- HAMBURGER MENU TOGGLE ---
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Tutup menu otomatis kalau salah satu menunya diklik
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});