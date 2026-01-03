document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------
    // Preloader
    // ------------------------------------------------------------------
    const loader = document.getElementById('loader');
    if (loader) {
        // Initial Loading Animation
        const tl = gsap.timeline();

        // Reveal Logo and Load Bar
        tl.to('.loader-logo', {
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
        })
            .to('.loader-bar', {
                width: '100%',
                duration: 1.5,
                ease: 'power1.inOut'
            });

        // Hide Loader when page is fully loaded AND animation is done
        window.addEventListener('load', () => {
            tl.to(loader, {
                opacity: 0,
                duration: 0.8,
                ease: 'power2.inOut',
                delay: 0.5, // Slight pause at 100%
                onComplete: () => loader.style.display = 'none'
            });
        });

        // Fallback safety (if load event hangs)
        setTimeout(() => {
            if (loader.style.display !== 'none') {
                gsap.to(loader, {
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.inOut',
                    onComplete: () => loader.style.display = 'none'
                });
            }
        }, 5000);
    }

    // ------------------------------------------------------------------
    // Navigation & Mobile Menu
    // ------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    // Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when link is clicked
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ------------------------------------------------------------------
    // WhatsApp Inquiry Form Logic
    // ------------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const projectInput = document.getElementById('project');

            const name = nameInput ? nameInput.value.trim() : 'Guest';
            const email = emailInput ? emailInput.value.trim() : 'No email provided';
            const project = projectInput ? projectInput.value.trim() : 'No details provided';

            // Format the message for WhatsApp
            const message = `*New Inquiry from Website*\n\n*Name:* ${name}\n*Email:* ${email}\n*Project Details:* ${project}`;

            // WhatsApp API URL
            const phoneNumber = "918438623429";
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

            // Open in new tab
            window.open(whatsappUrl, '_blank');

            // Optional: Form Reset
            contactForm.reset();
        });
    }

    // ------------------------------------------------------------------
    // GSAP Animations
    // ------------------------------------------------------------------
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Animation
    const heroTl = gsap.timeline();
    heroTl.from('.reveal-text', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.2
    })
        .from('.reveal-text-sub', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.8')
        .from('.reveal-item', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.1
        }, '-=0.6');

    // Scroll Animations for Sections
    // Headings and Tags
    gsap.utils.toArray('.section-tag, h2, h3').forEach(el => {
        // Avoid double animation for elements inside specific containers that have their own animations
        if (el.closest('.service-item') || el.closest('.work-card')) return;

        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none' // Don't reverse to avoid hiding content
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Service Items (Home Page)
    gsap.utils.toArray('.service-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 95%', // Trigger as soon as it enters viewport
                toggleActions: 'play none none none'
            },
            x: 30, // Reduced distance
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // Service Detail Items (Services Page)
    gsap.utils.toArray('.service-detail-item').forEach((item) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Image Reveal
    gsap.utils.toArray('.about-image, .work-image-wrapper').forEach(img => {
        gsap.from(img, {
            scrollTrigger: {
                trigger: img,
                start: 'top 80%',
            },
            scale: 0.9,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        });
    });

    // ------------------------------------------------------------------
    // Custom Cursor Interaction (If HTML exists)
    // ------------------------------------------------------------------
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0
            });
            gsap.to(cursorFollower, {
                x: e.clientX - 20,
                y: e.clientY - 20,
                duration: 0.1
            });
        });

        // Hover effects on clickable elements
        const hoverTargets = document.querySelectorAll('a, button, .work-card');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursorFollower, { scale: 1.5, borderColor: 'rgba(255, 255, 255, 0.8)', duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursorFollower, { scale: 1, borderColor: 'rgba(255, 255, 255, 0.3)', duration: 0.3 });
            });
        });
    }
});
