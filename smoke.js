document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('smoke-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    
    // Resize canvas to match parent
    function resize() {
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth || window.innerWidth;
        canvas.height = parent.clientHeight || 500;
    }
    window.addEventListener('resize', resize);
    resize();

    // PERFORMANCE OPTIMIZATION: Pre-render smoke particle texture
    const particleCanvas = document.createElement('canvas');
    const pSize = 256; // High res particle
    particleCanvas.width = pSize;
    particleCanvas.height = pSize;
    const pCtx = particleCanvas.getContext('2d');
    
    const gradient = pCtx.createRadialGradient(pSize/2, pSize/2, 0, pSize/2, pSize/2, pSize/2);
    // Base color is white, we can tint it using globalAlpha
    gradient.addColorStop(0, `rgba(200, 255, 200, 0.4)`); // Subtle mystical tint
    gradient.addColorStop(1, `rgba(200, 255, 200, 0)`);
    pCtx.fillStyle = gradient;
    pCtx.arc(pSize/2, pSize/2, pSize/2, 0, Math.PI * 2);
    pCtx.fill();

    const particles = [];
    const maxParticles = 25; // Lower count, larger particles, much better FPS

    class Particle {
        constructor() {
            this.reset(true);
        }
        
        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : canvas.height + Math.random() * 100;
            this.vx = (Math.random() - 0.5) * 0.3; // Very slow drift
            this.vy = -(Math.random() * 0.3 + 0.1); // Very slow rise
            this.size = Math.random() * 200 + 150; // Huge soft particles
            this.life = initial ? Math.random() * 0.6 : 0.0; // Start invisible if spawning at bottom
            this.maxLife = Math.random() * 0.5 + 0.3;
            this.fadeSpeed = Math.random() * 0.002 + 0.0005;
            this.growth = Math.random() * 0.2 + 0.05;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.size += this.growth;
            
            // Fade in and out
            if (this.y > canvas.height * 0.8 && this.life < this.maxLife) {
                this.life += this.fadeSpeed * 2; // Fade in at bottom
            } else {
                this.life -= this.fadeSpeed; // Fade out as it rises
            }

            if (this.life <= 0 && this.y < canvas.height * 0.8) {
                this.reset();
            }
        }

        draw() {
            if (this.life <= 0) return;
            ctx.globalAlpha = Math.max(0, Math.min(this.life, 1));
            // Draw pre-rendered texture centered on x, y
            ctx.drawImage(particleCanvas, this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        }
    }

    // Initial spawn
    for(let i=0; i<maxParticles; i++){
        particles.push(new Particle());
    }

    let lastTime = performance.now();
    
    function loop(time) {
        // Delta time for smooth movement regardless of framerate
        const dt = (time - lastTime) / 16.66; // Normalize to 60fps
        lastTime = time;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Apply dt to updates for butter-smooth animation
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.size += p.growth * dt;
            
            if (p.y > canvas.height * 0.5 && p.life < p.maxLife) {
                p.life += (p.fadeSpeed * 2) * dt;
            } else {
                p.life -= p.fadeSpeed * dt;
            }

            if ((p.life <= 0 && p.y < canvas.height * 0.5) || p.size > canvas.width * 1.5) {
                p.reset();
            }
            
            p.draw();
        }
        
        ctx.globalAlpha = 1.0; // Reset
        requestAnimationFrame(loop);
    }
    
    requestAnimationFrame(loop);
});
