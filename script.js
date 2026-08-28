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

// Membuat judul section memakai animasi huruf bergelombang seperti navbar
document.querySelectorAll('.section-title').forEach((title) => {
    const text = title.textContent.trim();
    title.textContent = '';
    title.classList.add('wave-text');

    [...text].forEach((character, index) => {
        const span = document.createElement('span');
                span.textContent = character === ' ' ? '\u00a0' : character;
        
        span.style.setProperty('--i', index + 1);
        title.appendChild(span);
    });
});

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

const updateNavIndicator = (item) => {
    if (!item || window.innerWidth <= 768) {
        navLinks.style.setProperty('--nav-indicator-width', '0px');
        return;
    }

    const navRect = navLinks.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    navLinks.style.setProperty('--nav-indicator-left', `${itemRect.left - navRect.left}px`);
    navLinks.style.setProperty('--nav-indicator-width', `${itemRect.width}px`);
};

const setActiveNavItem = (item) => {
    navItems.forEach(navItem => {
        navItem.removeAttribute('aria-current');
        navItem.setAttribute('aria-selected', String(navItem === item));
    });
    item?.setAttribute('aria-current', 'page');
    updateNavIndicator(item);
};

navItems.forEach(item => {
    item.addEventListener('click', () => setActiveNavItem(item));
});

navItems.forEach((item, index) => {
    item.addEventListener('keydown', (event) => {
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = Math.min(index + 1, navItems.length - 1);
        if (event.key === 'ArrowLeft') nextIndex = Math.max(index - 1, 0);
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = navItems.length - 1;
        if (nextIndex === index) return;

        event.preventDefault();
        navItems[nextIndex].focus();
        setActiveNavItem(navItems[nextIndex]);
    });
});

const initialNavItem = [...navItems].find(item => item.getAttribute('href') === '#profil') || navItems[0];
setActiveNavItem(initialNavItem);
window.addEventListener('resize', () => updateNavIndicator(document.querySelector('.nav-links a[aria-current="page"]')));

const sliderContainer = document.querySelector('#galeri .coverflow-shell');
const sliderTrack = document.querySelector('.coverflow-track');
const coverflowImages = sliderTrack ? [...sliderTrack.querySelectorAll('img')] : [];

if (sliderContainer && sliderTrack && coverflowImages.length) {
    let currentIndex = 0;
    let dragStartX = 0;
    let dragDistance = 0;
    let isDragging = false;
    let autoplayTimer;
    const caption = sliderContainer.querySelector('.coverflow-caption');
    const pagination = sliderContainer.querySelector('.coverflow-pagination');

    const updateDetails = () => {
        const activeImage = coverflowImages[currentIndex];
        if (caption && activeImage) {
            caption.textContent = activeImage.dataset.title || activeImage.alt;
        }
        if (pagination) {
            [...pagination.children].forEach((dot, index) => {
                dot.classList.toggle('is-active', index === currentIndex);
                dot.setAttribute('aria-selected', String(index === currentIndex));
            });
        }
    };

    const renderCoverflow = () => {
        const count = coverflowImages.length;
        coverflowImages.forEach((image, index) => {
            let offset = index - currentIndex;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;

            const distance = Math.abs(offset);
            const scale = distance === 0 ? 1 : Math.max(0.7, 0.9 - distance * 0.08);
            const opacity = Math.max(0.28, 1 - distance * 0.2);
            const tilt = offset * -28;
            const depth = -distance * 55;
            const visible = distance <= 2;

            image.style.transform = `translate(-50%, -50%) translateX(${offset * 48}%) translateZ(${depth}px) rotateY(${tilt}deg) scale(${scale})`;
            image.style.opacity = visible ? opacity : '0';
            image.style.zIndex = String(20 - distance);
            image.classList.toggle('is-active', offset === 0);
        });
        updateDetails();
    };

    const moveCoverflow = (direction) => {
        currentIndex = (currentIndex + direction + coverflowImages.length) % coverflowImages.length;
        renderCoverflow();
    };

    const restartAutoplay = () => {
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(() => moveCoverflow(1), 4200);
    };

    sliderContainer.addEventListener('pointerdown', (event) => {
        if (event.target.closest('.coverflow-control')) return;

        isDragging = true;
        dragStartX = event.clientX;
        dragDistance = 0;
        sliderContainer.setPointerCapture(event.pointerId);
        sliderContainer.classList.add('is-dragging');
        clearInterval(autoplayTimer);
    });

    sliderContainer.addEventListener('pointermove', (event) => {
        if (!isDragging) return;
        dragDistance = event.clientX - dragStartX;
        if (Math.abs(dragDistance) > 8) event.preventDefault();
    });

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        sliderContainer.classList.remove('is-dragging');
        if (Math.abs(dragDistance) > 45) moveCoverflow(dragDistance < 0 ? 1 : -1);
        restartAutoplay();
    };

    sliderContainer.addEventListener('pointerup', endDrag);
    sliderContainer.addEventListener('pointercancel', endDrag);
    const previousButton = sliderContainer.querySelector('.coverflow-prev');
    const nextButton = sliderContainer.querySelector('.coverflow-next');

    [previousButton, nextButton].forEach((button) => {
        button.addEventListener('pointerdown', (event) => event.stopPropagation());
    });

    previousButton.addEventListener('click', () => {
        moveCoverflow(-1);
        restartAutoplay();
    });
    nextButton.addEventListener('click', () => {
        moveCoverflow(1);
        restartAutoplay();
    });

    if (pagination) {
        coverflowImages.forEach((image, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'coverflow-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Pilih ${image.alt}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                renderCoverflow();
                restartAutoplay();
            });
            pagination.appendChild(dot);
        });
    }

    sliderContainer.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            moveCoverflow(-1);
            restartAutoplay();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            moveCoverflow(1);
            restartAutoplay();
        }
    });

    coverflowImages.forEach((image, index) => {
        image.addEventListener('click', () => {
            if (Math.abs(dragDistance) > 8) return;
            currentIndex = index;
            renderCoverflow();
            const modal = document.getElementById('gallery-modal');
            const modalImage = document.getElementById('modal-img');
            if (!modal || !modalImage) return;
            modalImage.src = image.src;
            modalImage.alt = image.alt;
            modal.style.display = 'flex';
        });
    });

    renderCoverflow();
    restartAutoplay();
    window.addEventListener('beforeunload', () => clearInterval(autoplayTimer));
}

const galleryModal = document.getElementById('gallery-modal');
const modalClose = document.querySelector('.modal-close');

if (galleryModal && modalClose) {
    const closeGallery = () => {
        galleryModal.style.display = 'none';
    };

    modalClose.addEventListener('click', closeGallery);
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) closeGallery();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeGallery();
    });
}