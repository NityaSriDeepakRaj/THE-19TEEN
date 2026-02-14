document.addEventListener('DOMContentLoaded', () => {

    // --- GSAP Setup ---
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero Scroll Video Logic ---
    const canvas = document.getElementById('hero-canvas');
    const context = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const frameCount = 200;
    const images = [];

    // Preload Images
    const preloadImages = () => {
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            const frameNum = i.toString().padStart(3, '0');
            img.src = `frames/ezgif-frame-${frameNum}.jpg`;
            images.push(img);
        }
    };
    preloadImages();

    // Helper to render specific frame
    const renderFrame = (index) => {
        if (index < 0) index = 0;
        if (index >= frameCount) index = frameCount - 1;

        const img = images[index];

        if (img && img.complete) {
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const imgRatio = img.width / img.height;
            const screenRatio = canvasWidth / canvasHeight;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (screenRatio > imgRatio) {
                drawWidth = canvasWidth;
                drawHeight = canvasWidth / imgRatio;
                offsetX = 0;
                offsetY = (canvasHeight - drawHeight) * 0.5;
            } else {
                drawHeight = canvasHeight;
                drawWidth = canvasHeight * imgRatio;
                offsetX = (canvasWidth - drawWidth) * 0.5;
                offsetY = 0;
            }

            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
    };

    // Initial Render
    images[0].onload = () => renderFrame(0);

    // --- MASTER TIMELINE ---
    const frameObj = { frame: 0 };

    // We create a ScrollTrigger that controls a timeline
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "+=500%", // Scroll distance (5x viewport height)
            scrub: 1,      // Smooth scrubbing
            pin: true      // Pin the section
        }
    });

    // 1. VIDEO ANIMATION (Runs for "10 seconds" of scrub time)
    tl.to(frameObj, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        duration: 10,
        onUpdate: () => {
            renderFrame(Math.round(frameObj.frame));
        }
    }, 0);

    // 2. LAYER 1 (Title): Visible initially. Fades OUT from t=2 to t=4
    tl.to(".layer-1", {
        opacity: 0,
        y: -50,
        duration: 2,
        ease: "power2.in"
    }, 2);

    // 3. LAYER 2 (Story): Fades IN from t=4 to t=6
    tl.fromTo(".layer-2",
        { autoAlpha: 0, y: 50 }, // autoAlpha handles visibility + opacity
        { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" },
        4
    );

    // 4. LAYER 2 (Story): Fades OUT from t=8 to t=9
    tl.to(".layer-2", {
        autoAlpha: 0,
        y: -50,
        duration: 2,
        ease: "power2.in"
    }, 8);



    // --- Resize Handler ---
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(Math.round(frameObj.frame));
    });

    // --- Other Section Animations ---
    gsap.utils.toArray('.bio-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: i * 0.2
        });
    });

    gsap.utils.toArray('.glass-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: '.glass-gallery',
                start: 'top 75%',
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            delay: i * 0.2
        });
    });

    // Initial Entry Animation (Layer 1)
    gsap.from(".layer-1 .hero-title", { y: 30, opacity: 0, duration: 1, delay: 0.5 });
    gsap.from(".layer-1 .hero-subtitle", { y: 20, opacity: 0, duration: 1, delay: 0.8 });

});
