/**
 * app.js
 * Main Orchestrator for the AURORA Cinematic Experience.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Engines
    const ambientParticles = window.AmbientParticles ? new window.AmbientParticles('particlesCanvas') : null;
    const fireworksSystem = window.FireworksSystem ? new window.FireworksSystem('fireworksCanvas') : null;
    const musicController = window.MusicController ? new window.MusicController() : null;
    const sceneRenderer = window.SceneRenderer ? new window.SceneRenderer('sceneCanvas') : null;
    const parallaxScene = window.ParallaxScene ? new window.ParallaxScene() : null;

    // Listen for custom events triggered by Cake scene
    window.addEventListener('pauseMusicEvent', () => {
        if (musicController) musicController.pause();
    });
    window.addEventListener('resumeMusicEvent', () => {
        if (musicController) musicController.play();
    });
    window.addEventListener('startFireworksEvent', () => {
        if (fireworksSystem) fireworksSystem.start();
    });

    // 2. Initialize Scenes
    const galleryScene = window.GalleryScene ? new window.GalleryScene() : null;
    const cakeScene = window.CakeScene ? new window.CakeScene() : null;

    // Typewriter effect for Scene 6
    const letterTextEl = document.getElementById('letterText');
    const letterContent = `Dear Hadjer,

Wishing you a birthday as magical and radiant as you are.
May the days ahead be filled with beautiful surprises.

Happy Birthday. ❤️`;

    let isTyping = false;
    const typeWriter = () => {
        if (isTyping) return;
        isTyping = true;
        let i = 0;
        letterTextEl.innerHTML = '<span class="typewriter-cursor"></span>';
        
        function type() {
            if (i < letterContent.length) {
                let char = letterContent.charAt(i);
                if (char === '\n') char = '<br>';
                
                const cursor = document.querySelector('.typewriter-cursor');
                if (cursor) cursor.insertAdjacentHTML('beforebegin', char);
                
                i++;
                setTimeout(type, Utils.randomRange(20, 60)); // Variable typing speed
            }
        }
        type();
    };

    // Intersection Observer to trigger typewriter when Scene 6 is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isTyping) {
                setTimeout(typeWriter, 800); // delay before starting typing
            }
        });
    }, { threshold: 0.5 });
    
    const letterSection = document.getElementById('scene6-letter');
    if (letterSection) observer.observe(letterSection);

    // 3. Scene State Machine (Intro -> Password -> World)
    const transitionToWorld = () => {
        const passwordSceneEl = document.getElementById('scene2-password');
        const worldSceneEl = document.getElementById('magicalWorld');
        
        passwordSceneEl.classList.remove('active');
        worldSceneEl.classList.add('active');
        if (musicController) musicController.showStartOverlay();
    };

    const startPasswordScene = () => {
        const introSceneEl = document.getElementById('scene1-intro');
        introSceneEl.style.display = 'none'; // fully remove from flow after fly-past
        
        const passwordScene = new window.PasswordScene(() => {
            // Password success -> Transition to world
            transitionToWorld();
        });
        passwordScene.show();
    };

    // Kickoff the Intro Scene
    const introScene = new window.IntroScene(() => {
        // Intro complete -> Show Password Screen
        startPasswordScene();
    });

    // Start everything
    setTimeout(() => {
        introScene.start();
    }, 500);

    // Cursor effects (Mouse move event)
    const cursorDot = document.getElementById('cursorDot');
    const cursorGlow = document.getElementById('cursorGlow');
    
    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        
        setTimeout(() => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        }, 50);

        // Add trailing sparkle effect
        if (Math.random() > 0.8 && ambientParticles) {
            ambientParticles.particles.push({
                x: e.clientX, y: e.clientY,
                vx: Utils.randomRange(-1, 1), vy: Utils.randomRange(-1, 1),
                size: Utils.randomRange(1, 2), color: '#d4af37',
                life: 0, maxLife: 50, isStar: true
            });
        }
    });

    // Hover state management for global cursor
    const interactiveElements = document.querySelectorAll('button, input, .polaroid-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
});
