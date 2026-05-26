document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Age Gate Logic ---
    const ageGate = document.getElementById('age-gate');
    const btnYes = document.getElementById('btn-yes-21');
    
    if (ageGate && btnYes) {
        // Check session storage (persists for the life of the tab)
        if (sessionStorage.getItem('gandalfs_age_verified') === 'true') {
            ageGate.style.display = 'none';
        } else {
            // Always show popup: lock body scroll
            document.body.style.overflow = 'hidden';
            
            btnYes.addEventListener('click', () => {
                sessionStorage.setItem('gandalfs_age_verified', 'true');
                ageGate.classList.add('hidden');
                document.body.style.overflow = ''; // Restore scroll
                
                // Remove from DOM after animation
                setTimeout(() => {
                    ageGate.style.display = 'none';
                }, 600);
            });
        }
    }

    // --- Scroll Triggered Fade-Ups (AOS) ---
    const fadeElements = document.querySelectorAll('.fade-up');
    if (fadeElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15 // Trigger when 15% visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Product Lightbox Logic ---
    const lightbox = document.getElementById('product-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.masonry-item img');

    if (lightbox && lightboxImg) {
        // Open lightbox
        galleryItems.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock scroll
            });
        });

        // Close functions
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
});


// Global Gallery Filter
function filterGallery(category) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            document.querySelectorAll('.gallery-category').forEach(gal => {
                gal.classList.remove('active');
            });
            document.getElementById('gallery-' + category).classList.add('active');
        }
        