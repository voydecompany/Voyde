document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------
    // Theme Management (Light / Dark)
    // ------------------------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('voyde-theme');

    // Default to light theme unless dark was specifically saved
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('voyde-theme', newTheme);
        });
    }

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
                width: '90%',
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

    // Direction-aware Floating Nav: Hide on scroll down, show on scroll up
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;

                // Scrolled styling (backdrop blur and subtle elevation)
                if (currentScrollY > 40) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // If mobile menu is open, keep navbar visible
                const isMobileOpen = navLinks && navLinks.classList.contains('active');
                if (isMobileOpen) {
                    navbar.classList.remove('nav-hidden');
                    lastScrollY = currentScrollY;
                    ticking = false;
                    return;
                }

                // Hide when scrolling down, show when scrolling up
                const scrollDelta = currentScrollY - lastScrollY;
                if (currentScrollY > 100 && scrollDelta > 6) {
                    navbar.classList.add('nav-hidden');
                } else if (scrollDelta < -6 || currentScrollY <= 60) {
                    navbar.classList.remove('nav-hidden');
                }

                lastScrollY = Math.max(0, currentScrollY);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

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
    // Active Scroll Spy (Highlight Nav on Scroll)
    // ------------------------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        threshold: 0,
        rootMargin: "-50% 0px -50% 0px" // Trigger exactly at center of viewport
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);

                if (activeLink) {
                    // Remove active class from all links
                    navItems.forEach(link => link.classList.remove('active'));
                    // Add active class to current
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // ------------------------------------------------------------------
    // Service Expand/Collapse Logic
    // ------------------------------------------------------------------
    const serviceItems = document.querySelectorAll('.service-item');

    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            // Check if this item is currently active
            const isActive = item.classList.contains('active');

            // Close all other items (Accordion behavior)
            serviceItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle the clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });

        // Mouse Move for "Alive" Glow Effect
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        });
    });

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
        y: 80,
        opacity: 0,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.15
    })
        .from('.reveal-text-sub', {
            y: 25,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out'
        }, '-=0.7')
        .from('.hero-cta .btn', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.1
        }, '-=0.6');

    // ------------------------------------------------------------------
    // Hero Interactive Elements (Subtle & Tactile)
    // ------------------------------------------------------------------
    const heroSection = document.querySelector('.hero');
    const heroGlow = document.getElementById('heroGlow');
    const interactiveWord = document.getElementById('interactiveWord');
    const magneticButtons = document.querySelectorAll('.hero-cta .btn');

    // 1. Subtle Cursor Spotlight inside Hero
    if (heroSection && heroGlow) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            gsap.to(heroGlow, {
                x: x,
                y: y,
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            gsap.to(heroGlow, {
                opacity: 0,
                duration: 0.7,
                ease: 'power2.out'
            });
        });
    }

    // 2. Magnetic Buttons Physics
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.25;

            gsap.to(btn, {
                x: x,
                y: y,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.4)'
            });
        });
    });

    // 3. Interactive Kinetic Accent Word ("nothing.")
    if (interactiveWord) {
        interactiveWord.addEventListener('mousemove', (e) => {
            const rect = interactiveWord.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.15;

            gsap.to(interactiveWord, {
                x: x,
                y: y,
                rotation: x * 0.4,
                duration: 0.3,
                ease: 'power1.out'
            });
        });

        interactiveWord.addEventListener('mouseleave', () => {
            gsap.to(interactiveWord, {
                x: 0,
                y: 0,
                rotation: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    }

    // Scroll Animations for Sections
    // Headings and Tags
    gsap.utils.toArray('.section-tag, h2, h3').forEach(el => {
        // Avoid double animation for elements inside specific containers that have their own animations
        if (el.closest('.service-item') || el.closest('.work-card')) return;

        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Service Items (Home Page)
    gsap.utils.toArray('.service-item').forEach((item) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 95%',
                toggleActions: 'play none none none'
            },
            x: 30,
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

    // About Content Paragraphs
    gsap.utils.toArray('.about-content p').forEach(p => {
        gsap.from(p, {
            scrollTrigger: {
                trigger: p,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // ------------------------------------------------------------------
    // Custom Cursor Interaction
    // ------------------------------------------------------------------
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower) {
        let posX = 0, posY = 0;
        let mouseX = 0, mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            gsap.to(cursor, {
                x: mouseX,
                y: mouseY,
                duration: 0
            });
        });

        gsap.ticker.add(() => {
            posX += (mouseX - posX) * 0.1;
            posY += (mouseY - posY) * 0.1;

            gsap.set(cursorFollower, {
                x: posX - 20,
                y: posY - 20
            });
        });

        // Hover effects
        const hoverTargets = document.querySelectorAll('a, button, .work-card, .service-item');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                gsap.to(cursorFollower, {
                    scale: 1.5,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(79, 70, 229, 0.6)',
                    duration: 0.3
                });
            });
            el.addEventListener('mouseleave', () => {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                gsap.to(cursorFollower, {
                    scale: 1,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(15, 23, 42, 0.25)',
                    duration: 0.3
                });
            });
        });
    }

    // ------------------------------------------------------------------
    // Parallax Effects
    // ------------------------------------------------------------------
    gsap.to('.gradient-sphere', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1
        },
        y: 200
    });

    const aboutImg = document.querySelector('.about-image img');
    if (aboutImg) {
        gsap.to(aboutImg, {
            scrollTrigger: {
                trigger: '.about',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -50,
            scale: 1.1
        });
    }

    gsap.utils.toArray('.work-image-wrapper img').forEach(img => {
        gsap.to(img, {
            scrollTrigger: {
                trigger: img.closest('.work-card'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: (i, target) => -target.offsetHeight * 0.1,
            scale: 1.05
        });
    });

    // ------------------------------------------------------------------
    // Work Slider Interaction (Drag to Scroll)
    // ------------------------------------------------------------------
    const sliderContainer = document.querySelector('.work-slider-container');

    if (sliderContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        sliderContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            sliderContainer.style.cursor = 'grabbing';
            startX = e.pageX - sliderContainer.offsetLeft;
            scrollLeft = sliderContainer.scrollLeft;
        });

        sliderContainer.addEventListener('mouseleave', () => {
            isDown = false;
            sliderContainer.style.cursor = 'grab';
        });

        sliderContainer.addEventListener('mouseup', () => {
            isDown = false;
            sliderContainer.style.cursor = 'grab';
        });

        sliderContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - sliderContainer.offsetLeft;
            const walk = (x - startX) * 2;
            sliderContainer.scrollLeft = scrollLeft - walk;
        });
    }

    // ------------------------------------------------------------------
    // Interactive Background (Star Field with Mouse Repulsion)
    // ------------------------------------------------------------------
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let stars = [];
        const numStars = 150;
        let mouse = { x: -1000, y: -1000 };

        // Resize Canvas
        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initStars();
        };

        // Star Class
        class Star {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
                this.opacity = Math.random();
            }

            draw() {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                ctx.fillStyle = isDark
                    ? `rgba(255, 255, 255, ${this.opacity})`
                    : `rgba(79, 70, 229, ${this.opacity * 0.35})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                // Mouse Interaction
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = 150;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                if (distance < maxDistance) {
                    this.x -= directionX; // Repel
                    this.y -= directionY;
                } else {
                    // Return to base position
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 15;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 15;
                    }
                }

                // Twinkle effect
                this.opacity += (Math.random() - 0.5) * 0.05;
                if (this.opacity < 0) this.opacity = 0;
                if (this.opacity > 1) this.opacity = 1;

                this.draw();
            }
        }

        const initStars = () => {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push(new Star());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            stars.forEach(star => star.update());
            requestAnimationFrame(animate);
        };

        // Track Mouse
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('resize', resize);

        // Init
        resize();
        animate();
    }
});
