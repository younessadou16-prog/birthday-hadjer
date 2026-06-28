/**
 * fireworks.js
 * Handles the massive celebration fireworks and falling confetti/petals.
 */

class FireworksSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.active = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.active = true;
        this.launchInterval = setInterval(() => {
            this.launchFirework(
                Utils.randomRange(100, this.canvas.width - 100),
                Utils.randomRange(100, this.canvas.height / 2)
            );
        }, 800);
        
        // Add some falling rose petals
        this.petalInterval = setInterval(() => {
            this.addPetal();
        }, 200);
    }

    stop() {
        this.active = false;
        clearInterval(this.launchInterval);
        clearInterval(this.petalInterval);
    }

    launchFirework(x, y) {
        const colors = ['#d4af37', '#ff6b81', '#ffffff', '#7bed9f', '#70a1ff'];
        const burstColor = colors[Math.floor(Math.random() * colors.length)];
        const particleCount = Math.floor(Utils.randomRange(50, 100));

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Utils.randomRange(2, 8);
            this.particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Utils.randomRange(1, 3),
                color: burstColor,
                life: 1,
                decay: Utils.randomRange(0.01, 0.03),
                gravity: 0.05,
                type: 'firework'
            });
        }
    }

    addPetal() {
        this.particles.push({
            x: Math.random() * this.canvas.width,
            y: -20,
            vx: Utils.randomRange(-2, 2),
            vy: Utils.randomRange(1, 3),
            size: Utils.randomRange(8, 15),
            color: '#d68798', // rose pink
            life: 1,
            decay: 0.002, // fades very slowly
            gravity: 0.01,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Utils.randomRange(0.05, 0.1),
            type: 'petal'
        });
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];

            if (p.type === 'firework') {
                p.vy += p.gravity;
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;
            } else if (p.type === 'petal') {
                p.wobble += p.wobbleSpeed;
                p.x += p.vx + Math.sin(p.wobble) * 2;
                p.y += p.vy + p.gravity;
                p.life -= p.decay;
            }

            if (p.life <= 0 || p.y > this.canvas.height) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let p of this.particles) {
            this.ctx.globalAlpha = Math.max(0, p.life);
            this.ctx.fillStyle = p.color;

            if (p.type === 'firework') {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.type === 'petal') {
                // Draw a simple petal shape
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.wobble);
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, p.size / 2, p.size, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
        }
        this.ctx.globalAlpha = 1;
    }

    animate() {
        if (this.active || this.particles.length > 0) {
            this.update();
            this.draw();
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        requestAnimationFrame(() => this.animate());
    }
}

window.FireworksSystem = FireworksSystem;
