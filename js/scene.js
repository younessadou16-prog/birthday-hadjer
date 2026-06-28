/**
 * scene.js
 * Renders all magical canvas elements:
 * - Fireflies
 * - Glowing butterflies
 * - Shooting stars
 * - Floating rose petals
 */

class SceneRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.entities = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.populate();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.W = this.canvas.width;
        this.H = this.canvas.height;
    }

    rand(min, max) { return Math.random() * (max - min) + min; }

    populate() {
        // 40 fireflies
        for (let i = 0; i < 40; i++) this.entities.push(this.makeFirefly());
        // 8 butterflies
        for (let i = 0; i < 8; i++) this.entities.push(this.makeButterfly());
        // 15 petals
        for (let i = 0; i < 15; i++) this.entities.push(this.makePetal());
        // 3 shooting stars (stored separately, spawned by timer)
        setInterval(() => this.spawnShootingStar(), 4000);
    }

    makeFirefly() {
        return {
            type: 'firefly',
            x: this.rand(0, this.W),
            y: this.rand(this.H * 0.4, this.H),
            size: this.rand(1.5, 3),
            color: `hsl(${this.rand(40, 80)}, 100%, 70%)`,
            alpha: 0,
            alphaDir: 1,
            alphaSpeed: this.rand(0.005, 0.02),
            vx: this.rand(-0.3, 0.3),
            vy: this.rand(-0.4, -0.1),
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: this.rand(0.02, 0.06)
        };
    }

    makeButterfly() {
        return {
            type: 'butterfly',
            x: this.rand(0, this.W),
            y: this.rand(this.H * 0.3, this.H * 0.7),
            wingSpan: this.rand(16, 28),
            hue: this.rand(250, 340), // purple to pink
            alpha: this.rand(0.4, 0.9),
            vx: this.rand(-0.8, 0.8),
            vy: this.rand(-0.5, 0.5),
            flapAngle: Math.random() * Math.PI,
            flapSpeed: this.rand(0.08, 0.14),
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: this.rand(0.01, 0.03)
        };
    }

    makePetal() {
        return {
            type: 'petal',
            x: this.rand(0, this.W),
            y: this.rand(-50, this.H),
            size: this.rand(5, 12),
            hue: this.rand(300, 360), // rose/pink
            alpha: this.rand(0.3, 0.8),
            vx: this.rand(-0.5, 0.5),
            vy: this.rand(0.3, 0.9),
            rot: Math.random() * Math.PI * 2,
            rotSpeed: this.rand(-0.03, 0.03),
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: this.rand(0.02, 0.05)
        };
    }

    spawnShootingStar() {
        this.entities.push({
            type: 'star',
            x: this.rand(0, this.W * 0.7),
            y: this.rand(0, this.H * 0.4),
            length: this.rand(80, 160),
            angle: this.rand(20, 45) * (Math.PI / 180),
            speed: this.rand(12, 20),
            alpha: 1,
            decay: this.rand(0.02, 0.04),
            trail: []
        });
    }

    updateFirefly(f) {
        f.wobble += f.wobbleSpeed;
        f.x += f.vx + Math.sin(f.wobble) * 0.5;
        f.y += f.vy;
        f.alpha += f.alphaDir * f.alphaSpeed;
        if (f.alpha >= 1) { f.alpha = 1; f.alphaDir = -1; }
        if (f.alpha <= 0) {
            f.alpha = 0; f.alphaDir = 1;
            // Reset position if drifted too far
            if (f.y < this.H * 0.3 || f.y > this.H || f.x < 0 || f.x > this.W) {
                Object.assign(f, this.makeFirefly());
            }
        }
    }

    drawFirefly(f) {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = f.alpha;
        // Glow
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 4);
        grad.addColorStop(0, f.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * 4, 0, Math.PI * 2);
        ctx.fill();
        // Core
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    updateButterfly(b) {
        b.flapAngle += b.flapSpeed;
        b.wobble += b.wobbleSpeed;
        b.x += b.vx + Math.sin(b.wobble * 0.5) * 0.4;
        b.y += b.vy + Math.sin(b.wobble) * 0.3;
        // Wrap
        if (b.x < -50) b.x = this.W + 50;
        if (b.x > this.W + 50) b.x = -50;
        if (b.y < this.H * 0.1) b.vy = Math.abs(b.vy);
        if (b.y > this.H * 0.85) b.vy = -Math.abs(b.vy);
    }

    drawButterfly(b) {
        const ctx = this.ctx;
        const ws = b.wingSpan;
        const flapY = Math.sin(b.flapAngle); // -1 to 1
        const wingHeight = ws * 0.6 * Math.abs(flapY);
        const hue = b.hue;

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.globalAlpha = b.alpha;

        // Left upper wing
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-ws * flapY, -wingHeight, -ws * 0.8 * flapY, wingHeight * 0.5, 0, wingHeight * 0.3);
        ctx.fillStyle = `hsla(${hue}, 80%, 65%, 0.7)`;
        ctx.fill();

        // Right upper wing
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(ws * flapY, -wingHeight, ws * 0.8 * flapY, wingHeight * 0.5, 0, wingHeight * 0.3);
        ctx.fillStyle = `hsla(${hue + 20}, 80%, 70%, 0.7)`;
        ctx.fill();

        // Left lower wing (smaller)
        ctx.beginPath();
        ctx.moveTo(0, wingHeight * 0.2);
        ctx.bezierCurveTo(-ws * 0.6 * flapY, wingHeight * 0.5, -ws * 0.4 * flapY, wingHeight * 0.9, 0, wingHeight * 0.7);
        ctx.fillStyle = `hsla(${hue - 20}, 80%, 60%, 0.6)`;
        ctx.fill();

        // Right lower wing
        ctx.beginPath();
        ctx.moveTo(0, wingHeight * 0.2);
        ctx.bezierCurveTo(ws * 0.6 * flapY, wingHeight * 0.5, ws * 0.4 * flapY, wingHeight * 0.9, 0, wingHeight * 0.7);
        ctx.fillStyle = `hsla(${hue - 10}, 80%, 65%, 0.6)`;
        ctx.fill();

        // Body
        ctx.fillStyle = `hsla(${hue}, 60%, 40%, 0.9)`;
        ctx.beginPath();
        ctx.ellipse(0, wingHeight * 0.35, 1.5, wingHeight * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    updatePetal(p) {
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.8;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        if (p.y > this.H + 30) {
            p.y = -20;
            p.x = this.rand(0, this.W);
        }
    }

    drawPetal(p) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = `hsla(${p.hue}, 70%, 75%, 0.9)`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawShootingStar(s) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.globalAlpha = s.alpha;
        const grad = ctx.createLinearGradient(-s.length, 0, 0, 0);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.6, 'rgba(255,240,200,0.4)');
        grad.addColorStop(1, '#fff');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-s.length, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();
        ctx.restore();
    }

    animate() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.W, this.H);

        for (let i = this.entities.length - 1; i >= 0; i--) {
            const e = this.entities[i];
            if (e.type === 'firefly') {
                this.updateFirefly(e);
                this.drawFirefly(e);
            } else if (e.type === 'butterfly') {
                this.updateButterfly(e);
                this.drawButterfly(e);
            } else if (e.type === 'petal') {
                this.updatePetal(e);
                this.drawPetal(e);
            } else if (e.type === 'star') {
                e.x += Math.cos(e.angle) * e.speed;
                e.y += Math.sin(e.angle) * e.speed;
                e.alpha -= e.decay;
                this.drawShootingStar(e);
                if (e.alpha <= 0) this.entities.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

window.SceneRenderer = SceneRenderer;
