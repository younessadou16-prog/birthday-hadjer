/**
 * password.js
 * Handles Scene 2: Password Authentication
 */

class PasswordScene {
    constructor(onComplete) {
        this.sceneEl = document.getElementById('scene2-password');
        this.card = document.getElementById('lockCard');
        this.input = document.getElementById('passwordInput');
        this.btn = document.getElementById('unlockBtn');
        this.errorMsg = document.getElementById('errorMsg');
        this.onComplete = onComplete;

        this.bindEvents();
    }

    bindEvents() {
        this.btn.addEventListener('click', () => this.checkPassword());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkPassword();
        });
    }

    show() {
        this.sceneEl.classList.add('active');
        this.input.focus();
    }

    checkPassword() {
        const val = this.input.value.trim();
        // Accepted passwords
        if (val === '2008-01-05' || val === '090105' || val === '20080105') {
            this.success();
        } else {
            this.error();
        }
    }

    success() {
        this.errorMsg.style.opacity = '0';
        this.card.classList.remove('shake');
        
        // Flash animation
        this.card.classList.add('success-flash');
        
        // Wait for flash animation to finish, then transition
        setTimeout(() => {
            this.sceneEl.classList.remove('active');
            this.sceneEl.classList.add('fly-past');
            if (this.onComplete) this.onComplete();
        }, 1500);
    }

    error() {
        this.errorMsg.style.opacity = '1';
        this.card.classList.remove('shake');
        void this.card.offsetWidth; // Trigger reflow to restart animation
        this.card.classList.add('shake');
        this.input.value = '';
    }
}

window.PasswordScene = PasswordScene;
