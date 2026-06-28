document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Custom Cursor
       ========================================================================== */
    const cursorDot = document.getElementById('cursorDot');
    const cursorGlow = document.getElementById('cursorGlow');
    
    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        
        // Add a slight delay for the glow for a trailing effect
        setTimeout(() => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }, 50);
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('button, input, .gallery-item, .cake-container');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Click explosion effect
    document.addEventListener('click', (e) => {
        const explosion = document.createElement('div');
        explosion.style.position = 'fixed';
        explosion.style.left = e.clientX + 'px';
        explosion.style.top = e.clientY + 'px';
        explosion.style.width = '10px';
        explosion.style.height = '10px';
        explosion.style.borderRadius = '50%';
        explosion.style.backgroundColor = 'var(--gold)';
        explosion.style.transform = 'translate(-50%, -50%)';
        explosion.style.pointerEvents = 'none';
        explosion.style.zIndex = '9999';
        explosion.style.transition = 'all 0.5s ease-out';
        document.body.appendChild(explosion);

        requestAnimationFrame(() => {
            explosion.style.transform = 'translate(-50%, -50%) scale(10)';
            explosion.style.opacity = '0';
        });

        setTimeout(() => explosion.remove(), 500);
    });

    /* ==========================================================================
       Particle Systems Initialization
       ========================================================================== */
    let lockParticles, introParticles, mainParticles;
    
    if (window.ParticleSystem) {
        lockParticles = new ParticleSystem('lockParticles', { count: 80, speed: 0.5, color: 'random' });
        introParticles = new ParticleSystem('introCanvas', { count: 150, type: 'star', speed: 0.2, color: '#fff' });
        mainParticles = new ParticleSystem('mainCanvas', { count: 100, color: 'random', speed: 0.3 });
        
        // Patch main particles to handle fireworks
        const originalAnimate = mainParticles.animate.bind(mainParticles);
        mainParticles.animate = () => {
            mainParticles.ctx.clearRect(0, 0, mainParticles.canvas.width, mainParticles.canvas.height);
            mainParticles.update();
            mainParticles.updateFireworks();
            for (let p of mainParticles.particles) {
                mainParticles.drawParticle(p);
            }
            requestAnimationFrame(mainParticles.animate.bind(mainParticles));
        };
        mainParticles.animate();
    }

    /* ==========================================================================
       Music Player
       ========================================================================== */
    const bgMusic = document.getElementById('bgMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const musicDisc = document.getElementById('musicDisc');
    let isPlaying = false;

    // Set initial volume
    bgMusic.volume = 0.5;

    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicDisc.classList.remove('playing');
            document.querySelector('.play-icon').classList.remove('hidden');
            document.querySelector('.pause-icon').classList.add('hidden');
        } else {
            bgMusic.play();
            musicDisc.classList.add('playing');
            document.querySelector('.play-icon').classList.add('hidden');
            document.querySelector('.pause-icon').classList.remove('hidden');
        }
        isPlaying = !isPlaying;
    });

    muteBtn.addEventListener('click', () => {
        bgMusic.muted = !bgMusic.muted;
        if (bgMusic.muted) {
            document.querySelector('.volume-icon').classList.add('hidden');
            document.querySelector('.mute-icon').classList.remove('hidden');
        } else {
            document.querySelector('.volume-icon').classList.remove('hidden');
            document.querySelector('.mute-icon').classList.add('hidden');
        }
    });

    /* ==========================================================================
       Password Screen
       ========================================================================== */
    const passwordInput = document.getElementById('passwordInput');
    const unlockBtn = document.getElementById('unlockBtn');
    const errorMsg = document.getElementById('errorMsg');
    const lockPanel = document.getElementById('lockPanel');
    const passwordScreen = document.getElementById('passwordScreen');
    const introScreen = document.getElementById('introScreen');
    const musicPlayer = document.getElementById('musicPlayer');

    const checkPassword = () => {
        const val = passwordInput.value.trim();
        if (val === '2008-01-05' || val === '090105' || val === '20080105') {
            // Success
            errorMsg.style.opacity = '0';
            lockPanel.classList.add('success-unlock');
            
            // Start music automatically on user interaction
            bgMusic.play().then(() => {
                isPlaying = true;
                musicDisc.classList.add('playing');
                document.querySelector('.play-icon').classList.add('hidden');
                document.querySelector('.pause-icon').classList.remove('hidden');
            }).catch(e => console.log("Audio autoplay prevented"));

            setTimeout(() => {
                passwordScreen.classList.remove('active');
                introScreen.classList.add('active');
                musicPlayer.classList.remove('hidden');
                startIntroCinematic();
            }, 1500);
        } else {
            // Error
            errorMsg.style.opacity = '1';
            lockPanel.classList.remove('shake');
            void lockPanel.offsetWidth; // trigger reflow
            lockPanel.classList.add('shake');
            passwordInput.value = '';
        }
    };

    unlockBtn.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPassword();
    });

    /* ==========================================================================
       Intro Cinematic
       ========================================================================== */
    const startIntroCinematic = () => {
        const text1 = document.getElementById('introText1');
        const text2 = document.getElementById('introText2');
        const text3 = document.getElementById('introText3');
        const portal = document.getElementById('portal');
        const mainContent = document.getElementById('mainContent');

        // Timeline
        setTimeout(() => fadeText(text1, true), 1000);
        setTimeout(() => fadeText(text1, false), 4000);
        
        setTimeout(() => fadeText(text2, true), 5000);
        setTimeout(() => fadeText(text2, false), 8000);
        
        setTimeout(() => fadeText(text3, true), 9000);
        
        // Open portal
        setTimeout(() => {
            portal.classList.add('expand');
        }, 11000);

        // Transition to main content
        setTimeout(() => {
            introScreen.classList.remove('active');
            mainContent.classList.add('active');
            document.body.classList.add('allow-scroll'); // enable scrolling
            
            // Trigger typewriter when entering main content
            setTimeout(typeWriter, 2000);
        }, 13000);
    };

    const fadeText = (element, fadeIn) => {
        element.style.transition = 'opacity 2s ease';
        element.style.opacity = fadeIn ? '1' : '0';
    };

    /* ==========================================================================
       Age Calculation & Candles
       ========================================================================== */
    const birthDate = new Date('2008-01-05T00:00:00');
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    // Fallback if system date is before 2008
    if (age < 0) age = 0;

    // Add suffix to age (th, st, nd, rd)
    const getOrdinalNum = (n) => {
        return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
    };

    document.getElementById('dynamicAge').innerText = getOrdinalNum(age);

    // Generate Candles
    const candlesContainer = document.getElementById('candlesContainer');
    const numCandles = Math.min(age, 30); // Cap at 30 visually to fit on cake
    const radius = 55; // Radius of the circle on top of the cake

    for (let i = 0; i < numCandles; i++) {
        const angle = (i / numCandles) * Math.PI * 2;
        const x = Math.cos(angle) * radius + 70; // 70 is half of top layer width
        const z = Math.sin(angle) * radius + 70;
        
        const candle = document.createElement('div');
        candle.className = 'candle';
        // Randomize slight offsets
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetZ = (Math.random() - 0.5) * 10;
        
        candle.style.transform = `translate3d(${x + offsetX}px, 0, ${z + offsetZ}px)`;
        
        const flame = document.createElement('div');
        flame.className = 'flame';
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        
        candle.appendChild(flame);
        candle.appendChild(smoke);
        candlesContainer.appendChild(candle);
    }

    /* ==========================================================================
       Blow Candles Logic
       ========================================================================== */
    const blowBtn = document.getElementById('blowCandlesBtn');
    let candlesBlown = false;

    blowBtn.addEventListener('click', () => {
        if (candlesBlown) return;
        candlesBlown = true;
        
        const flames = document.querySelectorAll('.flame');
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0)';
        overlay.style.transition = 'background-color 2s ease';
        overlay.style.zIndex = '4'; // behind cake but over bg
        overlay.style.pointerEvents = 'none';
        document.getElementById('cakeSection').appendChild(overlay);

        // Dim lights
        setTimeout(() => {
            overlay.style.backgroundColor = 'rgba(0,0,0,0.6)';
        }, 500);

        // Blow out flames sequentially
        flames.forEach((flame, index) => {
            setTimeout(() => {
                flame.classList.add('out');
            }, 1000 + (index * 150)); // stagger out
        });

        const totalTime = 1000 + (flames.length * 150);

        // Fireworks and celebration!
        setTimeout(() => {
            overlay.style.backgroundColor = 'rgba(0,0,0,0)';
            blowBtn.innerHTML = '<span class="btn-text">Happy Birthday!</span>';
            
            // Launch fireworks
            if (mainParticles) {
                let fwCount = 0;
                const fwInterval = setInterval(() => {
                    mainParticles.addFirework(
                        Math.random() * window.innerWidth, 
                        Math.random() * window.innerHeight * 0.5
                    );
                    fwCount++;
                    if (fwCount > 10) clearInterval(fwInterval);
                }, 500);
            }
        }, totalTime + 1000);
    });

    /* ==========================================================================
       Typewriter Letter
       ========================================================================== */
    const letterText = `Dear Hadjer,

Today is a very special day. A day to celebrate you, the amazing person you are, and the wonderful journey of your life so far. 

As you step into this new chapter, may it bring you endless joy, remarkable adventures, and the strength to achieve all your dreams. You bring so much light to the world around you.

Take a moment to make a wish, smile, and know that you are deeply appreciated. 

Happy Birthday.

With warmest regards.`;

    const typewriterEl = document.getElementById('typewriterText');
    let i = 0;
    let isTyping = false;

    const typeWriter = () => {
        if (isTyping) return;
        isTyping = true;
        typewriterEl.innerHTML = '<span class="typewriter-cursor"></span>';
        
        function type() {
            if (i < letterText.length) {
                let char = letterText.charAt(i);
                if (char === '\n') {
                    char = '<br>';
                }
                const cursor = document.querySelector('.typewriter-cursor');
                if(cursor) {
                    cursor.insertAdjacentHTML('beforebegin', char);
                }
                i++;
                // Randomize typing speed slightly for realism
                setTimeout(type, Math.random() * 50 + 30);
            } else {
                // Done typing, keep cursor blinking
            }
        }
        
        // Trigger via Intersection Observer when scrolled into view
        type();
    };

    // Intersection Observer for the letter section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isTyping) {
                // Wait a moment after scrolling into view
                setTimeout(typeWriter, 500);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.getElementById('letterCard'));
});
