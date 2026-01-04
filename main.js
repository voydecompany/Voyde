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

    // About Content Paragraphs (Simple fade up)
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

            // Immediate update for dot
            gsap.to(cursor, {
                x: mouseX,
                y: mouseY,
                duration: 0
            });
        });

        // Smooth follow for circle
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
                gsap.to(cursorFollower, { scale: 1.5, borderColor: 'rgba(255, 255, 255, 0.8)', duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursorFollower, { scale: 1, borderColor: 'rgba(255, 255, 255, 0.3)', duration: 0.3 });
            });
        });
    }

    // ------------------------------------------------------------------
    // Parallax Effects
    // ------------------------------------------------------------------
    // Parallax for Background Sphere
    gsap.to('.gradient-sphere', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1
        },
        y: 200 // Move sphere down slowly as we scroll
    });

    // Parallax for About Image
    const aboutImg = document.querySelector('.about-image img');
    if (aboutImg) {
        gsap.to(aboutImg, {
            scrollTrigger: {
                trigger: '.about',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -50, // Move image slightly up against scroll
            scale: 1.1
        });
    }

    // Parallax for Work Images
    gsap.utils.toArray('.work-image-wrapper img').forEach(img => {
        gsap.to(img, {
            scrollTrigger: {
                trigger: img.closest('.work-card'), // Trigger based on the parent card
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: (i, target) => -target.offsetHeight * 0.1, // Move image slightly up
            scale: 1.05
        });
    });

    // ------------------------------------------------------------------
    // Work Slider Interaction (Drag to Scroll)
    // ------------------------------------------------------------------
    const sliderContainer = document.querySelector('.work-slider-container');
    const progressBar = document.querySelector('.scroll-progress-fill');

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
            const walk = (x - startX) * 2; // Scroll-fast
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
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
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
                let maxDistance = 150; // Interaction radius
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
                        this.x -= dx / 15; // Ease back speed
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
