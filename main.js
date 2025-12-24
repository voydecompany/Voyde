document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader Logic
    const loader = document.getElementById('loader');
    const loaderBar = document.querySelector('.loader-bar');
    const loaderLogo = document.querySelector('.loader-logo');

    const tlLoader = gsap.timeline();

    tlLoader.to(loaderLogo, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    })
        .to(loaderBar, {
            width: "100%",
            duration: 2,
            ease: "power2.inOut"
        }, "-=0.5")
        .to(loader, {
            y: "-100%",
            duration: 1,
            ease: "expo.inOut"
        })
        .from(".hero-content > *", {
            y: 100,
            opacity: 0,
            stagger: 0.1,
            duration: 1.2,
            ease: "power4.out"
        }, "-=0.2");

    // 2. Custom Cursor
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        gsap.to(follower, {
            x: e.clientX - 16,
            y: e.clientY - 16,
            duration: 0.3
        });
    });

    const hoverItems = document.querySelectorAll('a, button, .work-card');
    hoverItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(follower, {
                scale: 2,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 0.5)',
                duration: 0.3
            });
            if (item.classList.contains('work-card') && item.tagName === 'A') {
                cursor.innerText = 'Go';
                gsap.to(cursor, { scale: 3, opacity: 0.5 });
            }
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(follower, {
                scale: 1,
                backgroundColor: 'transparent',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                duration: 0.3
            });
            cursor.innerText = '';
            gsap.to(cursor, { scale: 1, opacity: 1 });
        });
    });

    // 3. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Scroll Reveal Animations (GSAP)
    gsap.registerPlugin(ScrollTrigger);

    // Reveal text elements
    const revealTexts = document.querySelectorAll('.reveal-text, .reveal-text-sub');
    revealTexts.forEach(text => {
        gsap.from(text, {
            scrollTrigger: {
                trigger: text,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Work cards reveal
    const workCards = document.querySelectorAll('.work-card');
    workCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out",
            delay: index * 0.1
        });
    });

    // Service items reveal
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            delay: index * 0.1
        });
    });

    // 5. Active Link Tracking
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 6. Work Slider Logic (Truly Infinite Fluid Loop)
    const slider = document.querySelector('.work-slider');
    const sliderContainer = document.querySelector('.work-slider-container');

    if (slider && sliderContainer) {
        const initSlider = () => {
            const items = Array.from(slider.children);
            if (items.length === 0) return;

            const firstItem = items[0];
            const itemWidth = firstItem.offsetWidth;
            const gap = 30; // Matches CSS gap
            const totalItems = items.length;
            const iterationWidth = (itemWidth + gap) * totalItems;

            // Clear previous clones if any (for resizing)
            while (slider.children.length > totalItems) {
                slider.removeChild(slider.lastChild);
            }

            // Clone enough sets to ensure no "end" is ever visible
            const clonesNeeded = Math.ceil(window.innerWidth / iterationWidth) + 2;
            for (let i = 0; i < clonesNeeded; i++) {
                items.forEach(item => {
                    const clone = item.cloneNode(true);
                    slider.appendChild(clone);
                });
            }

            // State
            let xPos = -iterationWidth; // Start at the first clone set
            const autoSpeed = 0.5;
            let isDragging = false;
            let userInteraction = false;
            let interactionTimeout;
            let startX = 0;
            let originalX = xPos;

            function animate() {
                if (!isDragging && !userInteraction) {
                    xPos -= autoSpeed;
                }

                // Truly infinite reset logic
                if (xPos <= -iterationWidth * 2) {
                    xPos += iterationWidth;
                } else if (xPos >= 0) {
                    xPos -= iterationWidth;
                }

                gsap.set(slider, { x: xPos });
                requestAnimationFrame(animate);
            }

            const startAction = (e) => {
                isDragging = true;
                userInteraction = true;
                sliderContainer.style.cursor = 'grabbing';
                startX = (e.pageX || (e.touches ? e.touches[0].pageX : 0));
                originalX = xPos;
                clearTimeout(interactionTimeout);
            };

            const moveAction = (e) => {
                if (!isDragging) return;
                const currentX = (e.pageX || (e.touches ? e.touches[0].pageX : 0));
                xPos = originalX + (currentX - startX) * 1.5;
            };

            const endAction = () => {
                isDragging = false;
                sliderContainer.style.cursor = 'pointer';
                interactionTimeout = setTimeout(() => { userInteraction = false; }, 2000);
            };

            sliderContainer.addEventListener('mousedown', startAction);
            window.addEventListener('mousemove', moveAction);
            window.addEventListener('mouseup', endAction);
            sliderContainer.addEventListener('touchstart', startAction, { passive: true });
            window.addEventListener('touchmove', moveAction, { passive: true });
            window.addEventListener('touchend', endAction);

            sliderContainer.addEventListener('wheel', (e) => {
                userInteraction = true;
                const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
                xPos -= delta * 0.5;
                clearTimeout(interactionTimeout);
                interactionTimeout = setTimeout(() => { userInteraction = false; }, 2000);
            }, { passive: true });

            animate();

            let downX = 0;
            slider.addEventListener('mousedown', (e) => downX = e.pageX);
            slider.addEventListener('click', (e) => {
                if (Math.abs(e.pageX - downX) > 10) return;
                const item = e.target.closest('.work-item');
                if (item) {
                    const type = item.getAttribute('data-type');
                    if (type === 'website') window.open(item.getAttribute('data-url'), '_blank');
                    else if (type === 'collateral') {
                        const imgSrc = item.getAttribute('data-image');
                        if (imgSrc && typeof openModal === 'function') openModal(imgSrc);
                    }
                }
            });
        };

        window.addEventListener('load', initSlider);
        window.addEventListener('resize', initSlider);
    }

    // 7. Modal Logic
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.modal-close');

    function openModal(src) {
        if (!modal || !modalImg) return;
        modalImg.src = src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // 8. Form Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = 'Message Sent';
                contactForm.reset();
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
});
