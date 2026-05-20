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