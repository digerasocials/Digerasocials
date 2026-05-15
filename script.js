// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Initial Loader Animation ---
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');
    const loaderText = document.querySelector('.loader-text');
    
    const tlLoader = gsap.timeline();
    
    tlLoader.to(loaderText, { opacity: 1, duration: 0.5 })
            .to(loaderBar, { width: '100%', duration: 1.5, ease: "power2.inOut" })
            .to(loader, { 
                yPercent: -100, 
                duration: 0.8, 
                ease: "power4.inOut", 
                delay: 0.2,
                onComplete: () => {
                    loader.style.display = 'none';
                }
            })
            .fromTo('.reveal-up', 
                { y: 100, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.out", onComplete: () => ScrollTrigger.refresh() }, "-=0.6"
            );

    // --- 2. Lenis Smooth Scrolling (Desktop Only) ---
    let lenis;
    if (window.innerWidth >= 1024) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: false
        });

        lenis.on('scroll', () => {
            ScrollTrigger.update();
        });

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0, 0);
    }

    // --- 3. Custom Cursor (Desktop Only) ---
    if (window.innerWidth > 1024) {
        const cursorDot = document.getElementById('cursor-dot');
        const cursorOutline = document.getElementById('cursor-outline');
        const hoverTargets = document.querySelectorAll('.hover-target, a, button');

        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        function animateCursor() {
            let distX = mouseX - outlineX;
            let distY = mouseY - outlineY;
            
            outlineX = outlineX + (distX * 0.15);
            outlineY = outlineY + (distY * 0.15);
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            target.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // --- 4. Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-brand-black/80', 'border-b', 'border-white/10');
            navbar.classList.remove('glass');
        } else {
            navbar.classList.remove('bg-brand-black/80', 'border-b', 'border-white/10');
            navbar.classList.add('glass');
        }
    });

    // --- 5. Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openMenu() {
        mobileMenu.style.transform = 'translateY(0)';
        if (lenis) lenis.stop(); // Prevent scrolling while menu is open
    }

    function closeMenu() {
        mobileMenu.style.transform = 'translateY(-100%)';
        if (lenis) lenis.start(); // Re-enable scrolling
    }

    mobileMenuBtn.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- 5.1 Smooth Anchor Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = this.getAttribute('href');
            if (lenis) {
                e.preventDefault();
                if (target === '#') {
                    lenis.scrollTo(0);
                } else {
                    lenis.scrollTo(target, { offset: -50 });
                }
            }
            // If no lenis (mobile), let native anchor jumping work
        });
    });

    // --- 6. GSAP Scroll Animations ---

    // Parallax Hero Image (Desktop Only)
    if (window.innerWidth >= 1024) {
        gsap.to("#hero-img", {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: "#hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // --- 6. Scroll Reveal Animations ---

    // Fade Up
    const fadeUpElements = document.querySelectorAll('.gsap-fade-up');
    fadeUpElements.forEach(el => {
        gsap.fromTo(el, 
            { y: 60, opacity: 0 },
            { 
                y: 0, opacity: 1, 
                duration: 1.2, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: isMobile ? "top 95%" : "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Reveal Left
    const revealLeftElements = document.querySelectorAll('.gsap-reveal-left');
    revealLeftElements.forEach(el => {
        gsap.fromTo(el,
            { x: isMobile ? -50 : -100, opacity: 0 },
            {
                x: 0, opacity: 1, 
                duration: 1.4, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: isMobile ? "top 95%" : "top 80%"
                }
            }
        );
    });

    // Reveal Right
    const revealRightElements = document.querySelectorAll('.gsap-reveal-right');
    revealRightElements.forEach(el => {
        gsap.fromTo(el,
            { x: isMobile ? 50 : 100, opacity: 0 },
            {
                x: 0, opacity: 1, 
                duration: 1.4, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: isMobile ? "top 95%" : "top 80%"
                }
            }
        );
    });

    // Zoom In
    const zoomInElements = document.querySelectorAll('.gsap-zoom-in');
    zoomInElements.forEach(el => {
        gsap.fromTo(el,
            { scale: 0.8, opacity: 0 },
            {
                scale: 1, opacity: 1, 
                duration: 1.2, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: isMobile ? "top 95%" : "top 80%"
                }
            }
        );
    });

});
