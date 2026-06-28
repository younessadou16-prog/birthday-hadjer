/**
 * gallery.js
 * Handles the Photo Gallery 3D hover effects and interactions.
 */

class GalleryScene {
    constructor() {
        this.cards = document.querySelectorAll('.polaroid-card');
        this.bindEvents();
    }

    bindEvents() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.tiltCard(e, card));
            card.addEventListener('mouseleave', () => this.resetCard(card));
            card.addEventListener('click', () => this.openLightbox(card));
        });
    }

    tiltCard(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation based on mouse position
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    }

    resetCard(card) {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }

    openLightbox(card) {
        // A full implementation would open a high-res image modal.
        // For this demo, we create a simple flash effect.
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0'; flash.style.left = '0';
        flash.style.width = '100%'; flash.style.height = '100%';
        flash.style.backgroundColor = '#fff';
        flash.style.zIndex = '9999';
        flash.style.transition = 'opacity 0.5s';
        document.body.appendChild(flash);

        requestAnimationFrame(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 500);
        });
    }
}

window.GalleryScene = GalleryScene;
