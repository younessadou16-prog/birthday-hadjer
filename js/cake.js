/**
 * cake.js
 * Handles the PNG cake, dynamic candles, and blowing interaction.
 */

class CakeScene {
    constructor() {
        this.container = document.getElementById('candlesContainer');
        this.btn = document.getElementById('blowCandlesBtn');
        this.overlay = document.getElementById('cakeDarkOverlay');
        this.ageTextEl = document.getElementById('dynamicAge');
        this.hasBlown = false;

        this.initAge();
        this.bindEvents();
    }

    initAge() {
        const age = Utils.calculateAge('2008-01-05');
        this.ageTextEl.innerText = Utils.getOrdinalSuffix(age);

        // Cap visual candles to max 30 to avoid cluttering the PNG
        const numCandles = Math.min(age, 30);
        this.generateCandles(numCandles);
    }

    generateCandles(count) {
        // We assume the PNG cake is centered and the top layer is roughly at a specific relative area.
        // For a 400x400 container, let's place candles in an ellipse in the upper-middle area.
        const centerX = 200;
        const centerY = 120; // Y coordinate for the top of the cake in the PNG
        const radiusX = 80;
        const radiusY = 30;

        for (let i = 0; i < count; i++) {
            // Distribute around an ellipse
            const angle = (i / count) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radiusX + Utils.randomRange(-10, 10);
            const y = centerY + Math.sin(angle) * radiusY + Utils.randomRange(-5, 5);

            const candleWrapper = document.createElement('div');
            candleWrapper.style.position = 'absolute';
            candleWrapper.style.left = `${x}px`;
            candleWrapper.style.top = `${y}px`;
            candleWrapper.style.zIndex = Math.floor(y); // Fake depth sorting

            const body = document.createElement('div');
            body.className = 'candle-body';
            
            const flame = document.createElement('div');
            flame.className = 'flame';
            
            const smoke = document.createElement('div');
            smoke.className = 'smoke-puff';

            candleWrapper.appendChild(body);
            candleWrapper.appendChild(flame);
            candleWrapper.appendChild(smoke);
            
            this.container.appendChild(candleWrapper);
        }
    }

    bindEvents() {
        this.btn.addEventListener('click', () => this.blowCandles());
    }

    blowCandles() {
        if (this.hasBlown) return;
        this.hasBlown = true;

        const flames = document.querySelectorAll('.flame');
        const totalTime = 1000 + (flames.length * 100);

        // 1. Wind starts (animate flames leaning)
        flames.forEach(flame => {
            flame.style.animation = 'none'; // Stop flickering
            flame.style.transform = 'translateX(-50%) rotate(45deg)'; // Lean hard
        });

        // 2. Room becomes darker
        this.overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';

        // 3. Pause music (we dispatch an event so app.js can handle it)
        window.dispatchEvent(new Event('pauseMusicEvent'));

        // 4. Extinguish one by one
        flames.forEach((flame, index) => {
            setTimeout(() => {
                flame.classList.add('extinguished');
            }, 800 + (index * 100)); // stagger
        });

        // 5. Wait one second of silence, then FIREWORKS
        setTimeout(() => {
            this.overlay.style.backgroundColor = 'rgba(0,0,0,0)'; // Lights back on
            this.btn.innerHTML = '<span class="btn-text">Happy Birthday!</span>';
            
            window.dispatchEvent(new Event('startFireworksEvent'));
            window.dispatchEvent(new Event('resumeMusicEvent')); // Optional: resume or change track

        }, totalTime + 1500);
    }
}

window.CakeScene = CakeScene;
