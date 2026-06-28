/**
 * parallax.js
 * Mouse-driven multi-layer parallax for the cinematic background.
 */

class ParallaxScene {
    constructor() {
        this.layers = document.querySelectorAll('.parallax-layer');
        this.mouseX = 0;
        this.mouseY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.bound = this.onMouseMove.bind(this);
        document.addEventListener('mousemove', this.bound);
        this.animate();
    }

    onMouseMove(e) {
        // Normalize mouse to -1..1 relative to center
        this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    animate() {
        // Smooth lerp toward mouse target
        this.currentX += (this.mouseX - this.currentX) * 0.05;
        this.currentY += (this.mouseY - this.currentY) * 0.05;

        this.layers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed) || 0.03;
            const dx = this.currentX * speed * 100; // px shift
            const dy = this.currentY * speed * 60;
            layer.style.transform = `translate(${dx}px, ${dy}px)`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

window.ParallaxScene = ParallaxScene;
