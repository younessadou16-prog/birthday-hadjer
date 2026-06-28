/**
 * music.js
 * Advanced Premium Music Player Controller
 */

class MusicController {
    constructor() {
        this.audio = document.getElementById('bgMusic');
        this.playerUI = document.getElementById('premiumMusicPlayer');
        this.startWrapper = document.getElementById('startExperienceWrapper');
        this.startBtn = document.getElementById('startExperienceBtn');
        
        // Controls
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.muteBtn = document.getElementById('muteBtn');
        this.loopBtn = document.getElementById('loopBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        
        // Displays
        this.musicDisc = document.getElementById('musicDisc');
        this.currentTimeDisplay = document.getElementById('currentTimeDisplay');
        this.durationDisplay = document.getElementById('durationDisplay');
        this.progressBarWrapper = document.getElementById('progressBarWrapper');
        this.progressBarFill = document.getElementById('progressBarFill');
        this.songTitle = document.getElementById('songTitle');
        
        if (!this.audio) return;
        
        // Sync initial volume
        if (this.volumeSlider) {
            this.audio.volume = this.volumeSlider.value;
        } else {
            this.audio.volume = 0.5;
        }

        this.bindEvents();
    }

    bindEvents() {
        // Start Experience
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.startExperience());
        }

        // Basic Controls
        if (this.playBtn) this.playBtn.addEventListener('click', () => this.play());
        if (this.pauseBtn) this.pauseBtn.addEventListener('click', () => this.pause());
        if (this.stopBtn) this.stopBtn.addEventListener('click', () => this.stop());
        if (this.muteBtn) this.muteBtn.addEventListener('click', () => this.toggleMute());
        if (this.loopBtn) this.loopBtn.addEventListener('click', () => this.toggleLoop());
        
        // Volume
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (e) => {
                this.audio.volume = e.target.value;
                if (this.audio.volume > 0 && this.audio.muted) {
                    this.toggleMute();
                }
            });
        }

        // Audio Events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => {
            if (!this.audio.loop) this.stop();
        });

        // Seek Bar
        if (this.progressBarWrapper) {
            this.progressBarWrapper.addEventListener('click', (e) => this.seek(e));
        }
    }

    showStartOverlay() {
        if (this.startWrapper) {
            this.startWrapper.classList.remove('hidden');
        }
    }

    startExperience() {
        // Hide the start overlay
        if (this.startWrapper) {
            this.startWrapper.style.opacity = '0';
            setTimeout(() => {
                this.startWrapper.classList.add('hidden');
                this.startWrapper.style.display = 'none';
            }, 1000);
        }
        
        // Show the player and play
        this.show();
        this.play();
    }

    show() {
        if (this.playerUI) {
            this.playerUI.classList.remove('hidden');
        }
    }

    play() {
        this.audio.play().then(() => {
            if (this.musicDisc) this.musicDisc.classList.add('playing');
            if (this.playBtn) this.playBtn.classList.add('hidden');
            if (this.pauseBtn) this.pauseBtn.classList.remove('hidden');
        }).catch(e => {
            console.log("Audio play prevented:", e);
        });
    }

    pause() {
        this.audio.pause();
        if (this.musicDisc) this.musicDisc.classList.remove('playing');
        if (this.playBtn) this.playBtn.classList.remove('hidden');
        if (this.pauseBtn) this.pauseBtn.classList.add('hidden');
    }

    stop() {
        this.pause();
        this.audio.currentTime = 0;
        this.updateProgress();
    }

    toggleMute() {
        this.audio.muted = !this.audio.muted;
        if (this.muteBtn) {
            this.muteBtn.style.opacity = this.audio.muted ? '0.5' : '1';
        }
    }

    toggleLoop() {
        this.audio.loop = !this.audio.loop;
        if (this.loopBtn) {
            if (this.audio.loop) {
                this.loopBtn.classList.add('active');
                this.loopBtn.style.opacity = '1';
            } else {
                this.loopBtn.classList.remove('active');
                this.loopBtn.style.opacity = '0.5';
            }
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updateDuration() {
        if (this.durationDisplay) {
            this.durationDisplay.innerText = this.formatTime(this.audio.duration);
        }
    }

    updateProgress() {
        if (this.currentTimeDisplay) {
            this.currentTimeDisplay.innerText = this.formatTime(this.audio.currentTime);
        }
        if (this.progressBarFill && this.audio.duration) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressBarFill.style.width = `${percent}%`;
        }
    }

    seek(e) {
        const rect = this.progressBarWrapper.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        this.audio.currentTime = percentage * this.audio.duration;
    }
}

window.MusicController = MusicController;
