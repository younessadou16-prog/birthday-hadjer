/**
 * intro.js
 * Orchestrates Scene 1: Intro Cinematic
 */

class IntroScene {
    constructor(onComplete) {
        this.sceneEl = document.getElementById('scene1-intro');
        this.text1 = document.getElementById('introText1');
        this.text2 = document.getElementById('introText2');
        this.text3 = document.getElementById('introText3');
        this.portal = document.getElementById('introPortal');
        this.onComplete = onComplete;
    }

    start() {
        // Sequential text fade-in and out
        setTimeout(() => this.fadeText(this.text1, true), 1000);
        setTimeout(() => this.fadeText(this.text1, false), 4000);
        
        setTimeout(() => this.fadeText(this.text2, true), 5000);
        setTimeout(() => this.fadeText(this.text2, false), 8000);
        
        setTimeout(() => this.fadeText(this.text3, true), 9000);
        // Do not fade out text 3, let the portal consume it

        // Open the portal
        setTimeout(() => {
            this.portal.classList.add('expand');
        }, 11000);

        // Fly through transition to next scene
        setTimeout(() => {
            this.sceneEl.classList.remove('active');
            this.sceneEl.classList.add('fly-past');
            if (this.onComplete) this.onComplete();
        }, 13000);
    }

    fadeText(el, show) {
        el.style.transition = 'opacity 2s ease, transform 3s ease-out';
        el.style.opacity = show ? '1' : '0';
        if (show) {
            el.style.transform = 'scale(1.05)';
        } else {
            el.style.transform = 'scale(1.1)';
        }
    }
}

window.IntroScene = IntroScene;
