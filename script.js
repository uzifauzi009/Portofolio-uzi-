// ==========================================
// 1. LOGIKA ANIMASI SCROLL (Slide-Up Bento Box)
// ==========================================
const loadingScreen = document.getElementById('loading-screen');
const loadingBarFill = document.querySelector('.loading-bar-fill');
const loadingPercent = document.querySelector('.loading-percent');

if (loadingScreen && loadingBarFill && loadingPercent) {
    const startLoading = () => {
        const startTime = Date.now();
        const duration = 3000;
        const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            const safeProgress = Math.round(progress);

            loadingBarFill.style.width = `${safeProgress}%`;
            loadingPercent.textContent = `${safeProgress}%`;

            if (safeProgress >= 100) {
                setTimeout(() => {
                    loadingScreen.classList.add('is-hidden');
                    setTimeout(() => loadingScreen.remove(), 700);
                }, 250);
                return;
            }

            requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    };

    startLoading();
}

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
    const isOpen = navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('active', isOpen);
    mobileMenu.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-label', isOpen ? 'Tutup navigasi portfolio' : 'Buka navigasi portfolio');
});

// Tutup menu otomatis kalau salah satu menunya diklik
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-label', 'Buka navigasi portfolio');
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
    let dragDeltaX = 0;
    let isDragging = false;
    let dragWasUsed = false;
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

            image.style.transition = 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.32s ease, filter 0.32s ease, box-shadow 0.32s ease';
            image.style.transform = `translate(-50%, -50%) translateX(${offset * 48}%) translateZ(${depth}px) rotateY(${tilt}deg) scale(${scale})`;
            image.style.opacity = visible ? opacity : '0';
            image.style.zIndex = String(20 - distance);
            image.classList.toggle('is-active', offset === 0);
        });
        updateDetails();
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + coverflowImages.length) % coverflowImages.length;
        renderCoverflow();
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % coverflowImages.length;
        renderCoverflow();
    };

    const selectCoverflowImage = (index) => {
        if (index < 0 || index >= coverflowImages.length) return;
        currentIndex = index;
        renderCoverflow();
    };

    const previousButton = sliderContainer.querySelector('.coverflow-prev');
    const nextButton = sliderContainer.querySelector('.coverflow-next');

    previousButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    if (pagination) {
        coverflowImages.forEach((image, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'coverflow-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Pilih ${image.alt}`);
            dot.addEventListener('click', () => {
                selectCoverflowImage(index);
            });
            pagination.appendChild(dot);
        });
    }

    const beginDrag = (event) => {
        if (event.target.closest && event.target.closest('.coverflow-control')) return;
        dragStartX = event.clientX;
        dragDeltaX = 0;
        isDragging = true;
        dragWasUsed = false;
    };

    const moveDrag = (event) => {
        if (!isDragging) return;
        dragDeltaX = event.clientX - dragStartX;
        if (Math.abs(dragDeltaX) > 12) {
            dragWasUsed = true;
        }
    };

    const endDrag = (event) => {
        if (!isDragging) return;
        isDragging = false;

        const delta = dragDeltaX;
        if (Math.abs(delta) > 50) {
            if (delta < 0) nextSlide();
            else prevSlide();
            dragDeltaX = 0;
            dragWasUsed = false;
            return;
        }

        dragDeltaX = 0;
        dragWasUsed = false;
    };

    sliderContainer.addEventListener('mousedown', beginDrag);
    sliderContainer.addEventListener('mousemove', moveDrag);
    sliderContainer.addEventListener('mouseup', endDrag);
    sliderContainer.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            dragDeltaX = 0;
            dragWasUsed = false;
        }
    });

    sliderContainer.addEventListener('touchstart', (event) => {
        if (!event.touches || !event.touches[0]) return;
        beginDrag(event.touches[0]);
    }, { passive: true });

    sliderContainer.addEventListener('touchmove', (event) => {
        if (!event.touches || !event.touches[0]) return;
        moveDrag(event.touches[0]);
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (event) => {
        if (!event.changedTouches || !event.changedTouches[0]) return;
        endDrag(event.changedTouches[0]);
    }, { passive: true });

    coverflowImages.forEach((image, index) => {
        image.addEventListener('click', (event) => {
            if (dragWasUsed) {
                dragWasUsed = false;
                event.stopPropagation();
                return;
            }

            selectCoverflowImage(index);
        });

        image.addEventListener('dblclick', () => {
            const modal = document.getElementById('gallery-modal');
            const modalImage = document.getElementById('modal-img');
            if (!modal || !modalImage) return;
            modalImage.src = image.src;
            modalImage.alt = image.alt;
            modal.style.display = 'flex';
        });
    });

    sliderContainer.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            prevSlide();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            nextSlide();
        }
    });

    renderCoverflow();
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