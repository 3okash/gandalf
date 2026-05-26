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

    // --- Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (mobileBtn && navList) {
        mobileBtn.addEventListener('click', () => {
            navList.classList.toggle('active');
            
            // Transform hamburger to X
            const svg = mobileBtn.querySelector('svg');
            if (navList.classList.contains('active')) {
                svg.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            } else {
                svg.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
                document.body.style.overflow = '';
            }
        });

        // Handle dropdown clicks on mobile
        dropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('a');
            if (dropdownLink) {
                dropdownLink.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault(); 
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });
        
        // Close menu when clicking a standard link
        const navLinks = navList.querySelectorAll('li a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // If it's not the dropdown toggle link, close menu
                if (window.innerWidth <= 768 && !link.parentElement.classList.contains('dropdown')) {
                    navList.classList.remove('active');
                    mobileBtn.querySelector('svg').innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
                    document.body.style.overflow = '';
                }
            });
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
        