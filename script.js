// ==================== MOBILE MENU TOGGLE ====================
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        mobileMenu.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks?.classList.remove('active');
        mobileMenu?.setAttribute('aria-expanded', 'false');
    });
});

document.addEventListener('click', (e) => {
    if (navLinks?.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        e.target !== mobileMenu) {
        navLinks.classList.remove('active');
        mobileMenu?.setAttribute('aria-expanded', 'false');
    }
});

// ==================== NAVBAR SCROLL EFFECT ====================
const navbar = document.getElementById('navbar');

if (navbar) {
    let scrollTimeout;
    
    function handleNavbarScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleNavbarScroll, 10);
    });
    
    handleNavbarScroll();
}

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            navLinks?.classList.remove('active');
            mobileMenu?.setAttribute('aria-expanded', 'false');
        }
    });
});

// ==================== FORM CLEARING FUNCTIONALITY ====================
function clearContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.reset();
    }
}

if (document.getElementById('contactForm')) {
    window.addEventListener('load', clearContactForm);
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            clearContactForm();
        }
    });
}

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

const animatedElements = [
    '.about-card', '.program-card', '.value-card', 
    '.instructor-card', '.news-card', '.testimonial-card', '.gallery-item'
].join(',');

document.querySelectorAll(animatedElements).forEach(element => {
    element.classList.add('will-animate');
    observer.observe(element);
});

// ==================== MODAL MANAGERS ====================
class ModalManager {
    constructor() {
        this.activeModal = null;
    }

    openModal(modal) {
        if (this.activeModal) {
            this.closeModal(this.activeModal);
        }
        modal?.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.activeModal = modal;
    }

    closeModal(modal) {
        modal?.classList.remove('active');
        document.body.style.overflow = '';
        if (modal === this.activeModal) {
            this.activeModal = null;
        }
    }
}

const modalManager = new ModalManager();

// ==================== VIDEO MODAL HANDLER ====================
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const closeModal = document.getElementById('closeModal');

function openVideoModal(videoSrc) {
    if (!videoPlayer || !videoModal) return;
    const source = videoPlayer.querySelector('source');
    if (source) {
        source.src = videoSrc;
        videoPlayer.load();
        modalManager.openModal(videoModal);
    }
}

function closeVideoModal() {
    if (!videoModal || !videoPlayer) return;
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    modalManager.closeModal(videoModal);
}

document.querySelectorAll('[data-video]:not([data-youtube])').forEach(button => {
    button.addEventListener('click', function() {
        const videoSrc = this.getAttribute('data-video');
        openVideoModal(videoSrc);
    });
});

if (closeModal) {
    closeModal.addEventListener('click', closeVideoModal);
}

// ==================== GALLERY TOGGLE ====================
const viewGalleriesBtn = document.getElementById('viewGalleriesBtn');
const galleryContent = document.getElementById('galleryContent');
const closeGalleriesBtn = document.getElementById('closeGalleriesBtn');

function openGallery() {
    if (!galleryContent || !viewGalleriesBtn) return;
    galleryContent.classList.add('active');
    viewGalleriesBtn.style.display = 'none';
    setTimeout(() => {
        galleryContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function closeGallery() {
    if (!galleryContent || !viewGalleriesBtn) return;
    galleryContent.classList.remove('active');
    viewGalleriesBtn.style.display = 'block';
}

if (viewGalleriesBtn) viewGalleriesBtn.addEventListener('click', openGallery);
if (closeGalleriesBtn) closeGalleriesBtn.addEventListener('click', closeGallery);

// ==================== GALLERY FILTER ====================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || itemCategory === filterValue;
                
                if (shouldShow) {
                    item.style.display = '';
                    item.style.opacity = '1';
                } else {
                    item.style.display = 'none';
                }
            });
            updateGalleryImages();
        });
    });
}

// ==================== GALLERY LIGHTBOX ====================
const galleryLightbox = document.getElementById('galleryLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentImageIndex = 0;
let currentImages = [];

function updateGalleryImages() {
    currentImages = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"])'));
}

function openLightbox(item) {
    if (!lightboxImg || !galleryLightbox) return;
    const img = item.querySelector('img');
    if (!img) return;
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    
    const overlay = item.querySelector('.gallery-overlay');
    if (overlay && lightboxCaption) {
        const title = overlay.querySelector('h4')?.textContent || '';
        lightboxCaption.textContent = title;
    }
    
    currentImageIndex = currentImages.indexOf(item);
    modalManager.openModal(galleryLightbox);
}

function navigateLightbox(direction) {
    if (currentImages.length === 0) return;
    currentImageIndex = (currentImageIndex + direction + currentImages.length) % currentImages.length;
    openLightbox(currentImages[currentImageIndex]);
}

galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        if (this.style.display === 'none') return;
        const itemType = this.getAttribute('data-type');
        
        if (itemType === 'video') {
            const videoSrc = this.getAttribute('data-video');
            openVideoModal(videoSrc);
        } else {
            updateGalleryImages();
            openLightbox(this);
        }
    });
});

if (lightboxClose) lightboxClose.addEventListener('click', () => modalManager.closeModal(galleryLightbox));
if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

// ==================== YOUTUBE MODAL ====================
const youtubeModal = document.getElementById('youtubeModal');
const youtubePlayer = document.getElementById('youtubePlayer');
const youtubeClose = document.getElementById('youtubeClose');

function openYouTubeModal(videoId) {
    if (!youtubeModal || !youtubePlayer) return;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    youtubePlayer.src = embedUrl;
    modalManager.openModal(youtubeModal);
}

function closeYouTubeModal() {
    if (!youtubeModal || !youtubePlayer) return;
    youtubePlayer.src = '';
    modalManager.closeModal(youtubeModal);
}

document.querySelectorAll('[data-youtube]').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const videoId = this.getAttribute('data-youtube');
        openYouTubeModal(videoId);
    });
});

if (youtubeClose) youtubeClose.addEventListener('click', closeYouTubeModal);

// ==================== FIXED CAROUSEL CLASS ====================
class ImprovedCarousel {
    constructor() {
        this.container = document.querySelector('.instructor-carousel');
        this.track = document.querySelector('.carousel-track');
        this.cards = Array.from(document.querySelectorAll('.instructor-card'));
        
        if (!this.container || !this.track || this.cards.length === 0) {
            return null;
        }
        
        this.currentIndex = 0;
        this.cardsPerView = 4;
        this.autoSlideInterval = null;
        this.isTransitioning = false;
        
        this.init();
        return this;
    }
    
    updateCardsPerView() {
        const width = window.innerWidth;
        let oldCardsPerView = this.cardsPerView;
        
        if (width <= 480) {
            this.cardsPerView = 1;
        } else if (width <= 768) {
            this.cardsPerView = 2;
        } else if (width <= 1024) {
            this.cardsPerView = 3;
        } else {
            this.cardsPerView = 4;
        }
        
        if (oldCardsPerView !== this.cardsPerView) {
            this.currentIndex = 0;
            this.updateTrackPosition();
        }
    }
    
    updateTrackPosition() {
        if (this.isTransitioning || !this.track) return;
        
        this.isTransitioning = true;
        
        // Calculate total visible cards needed
        const totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
        
        // Calculate the gap and card width
        const gap = 20;
        const containerWidth = this.container.offsetWidth;
        const cardWidth = (containerWidth - (gap * (this.cardsPerView - 1))) / this.cardsPerView;
        
        // Calculate transform
        const slideDistance = cardWidth + gap;
        const translateX = -(this.currentIndex * this.cardsPerView * slideDistance);
        
        this.track.style.transform = `translateX(${translateX}px)`;
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    moveToSlide(index) {
        if (this.isTransitioning) return;
        
        this.updateCardsPerView();
        const totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
        
        if (index >= totalSlides) {
            this.currentIndex = 0;
        } else if (index < 0) {
            this.currentIndex = totalSlides - 1;
        } else {
            this.currentIndex = index;
        }
        
        this.updateTrackPosition();
    }
    
    next() {
        this.moveToSlide(this.currentIndex + 1);
    }
    
    prev() {
        this.moveToSlide(this.currentIndex - 1);
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            if (!this.isTransitioning) {
                this.next();
            }
        }, 5000);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    createNavigation() {
        const existingNav = this.container.querySelector('.carousel-nav');
        if (existingNav) existingNav.remove();
        
        const nav = document.createElement('div');
        nav.className = 'carousel-nav';
        nav.innerHTML = `
            <button class="carousel-prev">‹</button>
            <button class="carousel-next">›</button>
        `;
        
        this.container.appendChild(nav);
        
        const prevBtn = nav.querySelector('.carousel-prev');
        const nextBtn = nav.querySelector('.carousel-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prev();
                this.stopAutoSlide();
                this.startAutoSlide();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.next();
                this.stopAutoSlide();
                this.startAutoSlide();
            });
        }
    }
    
    handleResize() {
        this.updateCardsPerView();
        this.updateTrackPosition();
    }
    
    init() {
        // Ensure proper flex settings
        this.track.style.display = 'flex';
        this.track.style.gap = '20px';
        
        this.cards.forEach(card => {
            card.style.flexShrink = '0';
        });
        
        this.updateCardsPerView();
        this.createNavigation();
        this.startAutoSlide();
        
        this.container.addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
    }
}

// ==================== CAROUSEL INITIALIZATION ====================
let carousel = null;
let carouselResizeHandler = null;

function initCarousel() {
    const carouselContainer = document.querySelector('.instructor-carousel');
    
    if (!carouselContainer) return;
    
    if (carousel) {
        carousel.stopAutoSlide();
    }
    
    // Remove previous resize listener before adding a new one
    if (carouselResizeHandler) {
        window.removeEventListener('resize', carouselResizeHandler);
    }
    
    carousel = new ImprovedCarousel();
    
    carouselResizeHandler = () => {
        if (carousel) {
            carousel.handleResize();
        }
    };
    
    window.addEventListener('resize', carouselResizeHandler);
}

// ==================== CONTACT FORM ====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                showNotification('Message sent successfully!', 'success');
                this.reset();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            showNotification('Error sending message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .form-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        }
        .form-notification.success { background: #4CAF50; }
        .form-notification.error { background: #f44336; }
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// ==================== KEYBOARD NAVIGATION ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modalManager.closeModal(modalManager.activeModal);
    }
    
    if (carousel && e.key === 'ArrowLeft') {
        carousel.prev();
    }
    if (carousel && e.key === 'ArrowRight') {
        carousel.next();
    }
});

// ==================== INITIALIZE ON DOM READY ====================
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    updateGalleryImages();
    document.documentElement.style.scrollBehavior = 'smooth';
});

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        setTimeout(initCarousel, 100);
    }
});

// ==================== ARCHIVE GALLERY LIGHTBOX ====================
const archiveLightbox = document.getElementById('archiveLightbox');
const archiveLightboxImg = document.getElementById('archiveLightboxImg');
const archiveLightboxCaption = document.getElementById('archiveLightboxCaption');
const archiveLightboxClose = document.getElementById('archiveLightboxClose');
const archiveLightboxPrev = document.getElementById('archiveLightboxPrev');
const archiveLightboxNext = document.getElementById('archiveLightboxNext');

let currentArchiveImageIndex = 0;
let archiveImages = [];

function updateArchiveImages() {
    archiveImages = Array.from(document.querySelectorAll('[data-lightbox="archive"]'));
}

function openArchiveLightbox(item) {
    if (!archiveLightboxImg || !archiveLightbox) return;
    const img = item.querySelector('img');
    if (!img) return;
    
    archiveLightboxImg.src = img.src;
    archiveLightboxImg.alt = img.alt;
    
    const caption = item.querySelector('p');
    if (caption && archiveLightboxCaption) {
        archiveLightboxCaption.textContent = caption.textContent;
    }
    
    currentArchiveImageIndex = archiveImages.indexOf(item);
    modalManager.openModal(archiveLightbox);
}

function navigateArchiveLightbox(direction) {
    if (archiveImages.length === 0) return;
    currentArchiveImageIndex = (currentArchiveImageIndex + direction + archiveImages.length) % archiveImages.length;
    openArchiveLightbox(archiveImages[currentArchiveImageIndex]);
}

// Make archive items clickable
document.addEventListener('DOMContentLoaded', () => {
    updateArchiveImages();
    
    archiveImages.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            updateArchiveImages();
            openArchiveLightbox(this);
        });
    });
});

// Close archive lightbox
if (archiveLightboxClose) {
    archiveLightboxClose.addEventListener('click', () => {
        modalManager.closeModal(archiveLightbox);
    });
}

// Navigate archive lightbox
if (archiveLightboxPrev) {
    archiveLightboxPrev.addEventListener('click', () => navigateArchiveLightbox(-1));
}

if (archiveLightboxNext) {
    archiveLightboxNext.addEventListener('click', () => navigateArchiveLightbox(1));
}

// Keyboard support for escape and arrow keys
document.addEventListener('keydown', (e) => {
    if (archiveLightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            modalManager.closeModal(archiveLightbox);
        }
        if (e.key === 'ArrowLeft') {
            navigateArchiveLightbox(-1);
        }
        if (e.key === 'ArrowRight') {
            navigateArchiveLightbox(1);
        }
    }
});