/**
 * particles.js
 * Handles ambient background particles (stars, magic dust, fireflies).
 */

class AmbientParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Create 150 ambient particles
        for (let i = 0; i < 150; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        const isStar = Math.random() > 0.7;
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: isStar ? Utils.randomRange(1, 3) : Utils.randomRange(0.5, 2),
            vx: Utils.randomRange(-0.2, 0.2),
            vy: Utils.randomRange(-0.5, -0.1),
            opacity: Math.random(),
            color: isStar ? '#ffffff' : (Math.random() > 0.5 ? '#d4af37' : '#9a7bb5'),
            life: Math.random() * 100,
            maxLife: Utils.randomRange(100, 300),
            isStar: isStar
        };
    }

    update() {
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            
            // Fading
            p.opacity = Math.sin((p.life / p.maxLife) * Math.PI);
            p.life++;

            if (p.life >= p.maxLife || p.y < 0) {
                this.particles[i] = this.createParticle();
                this.particles[i].y = this.canvas.height + 10;
                this.particles[i].life = 0;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let p of this.particles) {
            this.ctx.globalAlpha = Math.max(0, p.opacity);
            this.ctx.fillStyle = p.color;
            
            if (p.isStar) {
                // Draw a simple star shape or glowy circle
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
                // Glow
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = p.color;
            } else {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
            this.ctx.globalAlpha = 1;
        }
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

window.AmbientParticles = AmbientParticles;
