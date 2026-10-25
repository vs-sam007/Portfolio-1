/**
 * SPATIAL CANVAS ENGINE — SAMRADH SRIVASTAVA PORTFOLIO 2026
 * 3D Perspective Coordinate Grid, Multi-plane Depth Starfield,
 * Volumetric Chromatic Aurora Orbs, and Spatial Telemetry Engine.
 * Pure native 60FPS Canvas math — zero external bloat.
 */

(function () {
  'use strict';

  class SpatialEngine {
    constructor() {
      this.canvas = document.getElementById('spatial-canvas');
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'spatial-canvas';
        document.body.prepend(this.canvas);
      }
      this.ctx = this.canvas.getContext('2d');

      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Mouse & Camera state with spring damping (lerp)
      this.mouse = {
        x: this.width * 0.5,
        y: this.height * 0.4,
        targetX: this.width * 0.5,
        targetY: this.height * 0.4,
        vx: 0,
        vy: 0,
        isMoving: false,
        lastMove: Date.now()
      };

      this.scrollOffset = window.scrollY;
      this.targetScroll = window.scrollY;
      this.cameraZ = 0;

      // Volumetric Chromatic Orbs with smooth spring physics
      this.orbs = [
        {
          x: this.width * 0.3,
          y: this.height * 0.3,
          targetX: this.width * 0.3,
          targetY: this.height * 0.3,
          vx: 0,
          vy: 0,
          radius: Math.min(this.width * 0.35, 450),
          colorStart: 'rgba(99, 102, 241, 0.22)', // Electric Indigo
          colorEnd: 'rgba(99, 102, 241, 0)',
          phase: 0,
          speed: 0.0012
        },
        {
          x: this.width * 0.7,
          y: this.height * 0.6,
          targetX: this.width * 0.7,
          targetY: this.height * 0.6,
          vx: 0,
          vy: 0,
          radius: Math.min(this.width * 0.3, 380),
          colorStart: 'rgba(56, 189, 248, 0.18)', // Cyan Aurora
          colorEnd: 'rgba(56, 189, 248, 0)',
          phase: Math.PI * 0.66,
          speed: 0.0016
        },
        {
          x: this.width * 0.5,
          y: this.height * 0.8,
          targetX: this.width * 0.5,
          targetY: this.height * 0.8,
          vx: 0,
          vy: 0,
          radius: Math.min(this.width * 0.32, 420),
          colorStart: 'rgba(244, 63, 94, 0.13)', // Hot Rose / Magenta
          colorEnd: 'rgba(244, 63, 94, 0)',
          phase: Math.PI * 1.33,
          speed: 0.0014
        }
      ];

      // Multi-plane 3D Constellation Particles
      this.particleCount = window.innerWidth < 768 ? 65 : 130;
      this.particles = [];
      this.initParticles();

      // Audio Synthesizer (Web Audio API)
      this.audioEnabled = false;
      this.audioCtx = null;

      this.initEvents();
      this.resize();
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    initParticles() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          originX: Math.random() * this.width,
          originY: Math.random() * this.height,
          z: Math.random() * 2.4 + 0.3, // Depth plane: 0.3 (far) to 2.7 (near)
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 2.2 + 0.8,
          baseAlpha: Math.random() * 0.5 + 0.25,
          pulseSpeed: Math.random() * 0.03 + 0.01,
          pulseVal: Math.random() * Math.PI * 2
        });
      }
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.ctx.scale(this.dpr, this.dpr);

      // Re-scale orbs
      if (this.orbs) {
        this.orbs[0].radius = Math.min(this.width * 0.35, 450);
        this.orbs[1].radius = Math.min(this.width * 0.3, 380);
        this.orbs[2].radius = Math.min(this.width * 0.32, 420);
      }
    }

    initEvents() {
      window.addEventListener('resize', () => {
        this.resize();
        this.initParticles();
      }, { passive: true });

      window.addEventListener('mousemove', (e) => {
        this.mouse.targetX = e.clientX;
        this.mouse.targetY = e.clientY;
        this.mouse.isMoving = true;
        this.mouse.lastMove = Date.now();

        // Update Bento card cursor spotlight variables
        this.updateCardSpotlights(e.clientX, e.clientY);
      }, { passive: true });

      window.addEventListener('scroll', () => {
        this.targetScroll = window.scrollY;
      }, { passive: true });

      // Web Audio sound toggle
      const audioBtn = document.getElementById('hud-audio-btn');
      if (audioBtn) {
        audioBtn.addEventListener('click', () => {
          this.toggleAudio();
        });
      }

      // Live Telemetry clocks
      this.startTelemetryClock();
    }

    updateCardSpotlights(mx, my) {
      const cards = document.querySelectorAll('.bento-card, .case-study-card, .tech-card, .service-card, .metric-card, .seo-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        // Check if cursor is reasonably close to card to save CPU
        if (
          mx >= rect.left - 200 &&
          mx <= rect.right + 200 &&
          my >= rect.top - 200 &&
          my <= rect.bottom + 200
        ) {
          const x = mx - rect.left;
          const y = my - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        }
      });
    }

    toggleAudio() {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }

      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.audioEnabled = !this.audioEnabled;
      const icon = document.getElementById('hud-audio-icon');
      const text = document.getElementById('hud-audio-text');

      if (icon) {
        icon.className = this.audioEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
      }
      if (text) {
        text.innerText = this.audioEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';
      }

      if (this.audioEnabled) {
        this.playTactileClick(1200, 0.04);
        this.bindTactileAudio();
      }
    }

    playTactileClick(freq = 900, duration = 0.03) {
      if (!this.audioEnabled || !this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.audioCtx.currentTime + duration);

        gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch (err) {
        // Silent fail if audio blocked by policy
      }
    }

    bindTactileAudio() {
      const interactives = document.querySelectorAll('.bento-btn, .bento-social-btn, .bento-chip, .ul-list li, .dock-item, .tech-badge');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
          this.playTactileClick(1050 + Math.random() * 200, 0.025);
        }, { passive: true });
      });
    }

    startTelemetryClock() {
      const updateClocks = () => {
        const now = new Date();

        // Indian Standard Time (IST: UTC + 5:30)
        const istOptions = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        };
        const istString = now.toLocaleTimeString('en-US', istOptions);

        // UTC
        const utcHours = String(now.getUTCHours()).padStart(2, '0');
        const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
        const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
        const utcString = `${utcHours}:${utcMinutes}:${utcSeconds}`;

        const hudTicker = document.getElementById('hud-time-ticker');
        if (hudTicker) {
          hudTicker.innerText = `IST ${istString} // UTC ${utcString} // LKO 26.84°N`;
        }

        const geoClock = document.getElementById('hero-clock-large');
        if (geoClock) {
          geoClock.innerText = istString;
        }

        const pingVal = document.getElementById('hero-ping-val');
        if (pingVal && Math.random() < 0.15) {
          const fakePing = (0.7 + Math.random() * 0.5).toFixed(1);
          pingVal.innerText = `Ping: ${fakePing}ms`;
        }
      };

      setInterval(updateClocks, 1000);
      updateClocks();
    }

    animate() {
      // Damping / Lerp on mouse coordinates
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.055;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.055;

      // Scroll damping
      this.scrollOffset += (this.targetScroll - this.scrollOffset) * 0.08;
      this.cameraZ = this.scrollOffset * 0.15;

      // Clear Canvas
      this.ctx.clearRect(0, 0, this.width, this.height);

      // 1. Draw Volumetric Chromatic Light Orbs (Spatial Aurora)
      this.drawChromaticOrbs();

      // 2. Draw 3D Perspective Coordinate Wireframe Grid
      this.drawPerspectiveGrid();

      // 3. Draw Multi-plane Depth Constellation Particles
      this.drawConstellationParticles();

      requestAnimationFrame(this.animate);
    }

    drawChromaticOrbs() {
      const time = performance.now();

      // Orb 1 follows mouse smoothly
      this.orbs[0].targetX = this.mouse.x * 0.7 + this.width * 0.15;
      this.orbs[0].targetY = this.mouse.y * 0.6 + this.height * 0.15;

      // Orb 2 moves on organic harmonic Lissajous curve + mouse influence
      this.orbs[1].phase += this.orbs[1].speed;
      this.orbs[1].targetX = this.width * 0.65 + Math.sin(this.orbs[1].phase) * 120 + (this.mouse.x - this.width * 0.5) * 0.2;
      this.orbs[1].targetY = this.height * 0.55 + Math.cos(this.orbs[1].phase * 0.8) * 80 + (this.mouse.y - this.height * 0.5) * 0.2;

      // Orb 3 flows at the bottom
      this.orbs[2].phase += this.orbs[2].speed;
      this.orbs[2].targetX = this.width * 0.45 + Math.cos(this.orbs[2].phase * 0.9) * 140;
      this.orbs[2].targetY = this.height * 0.85 + Math.sin(this.orbs[2].phase) * 60;

      // Render each orb with radial gradient
      this.orbs.forEach(orb => {
        orb.x += (orb.targetX - orb.x) * 0.04;
        orb.y += (orb.targetY - orb.y) * 0.04;

        const grad = this.ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grad.addColorStop(0, orb.colorStart);
        grad.addColorStop(0.5, orb.colorStart.replace(/[\d\.]+\)$/, '0.07)'));
        grad.addColorStop(1, orb.colorEnd);

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        this.ctx.fill();
      });
    }

    drawPerspectiveGrid() {
      const cx = this.width * 0.5 + (this.mouse.x - this.width * 0.5) * 0.07;
      const horizonY = this.height * 0.76 + (this.mouse.y - this.height * 0.5) * 0.04;
      const bottomY = this.height + 40;

      this.ctx.save();
      this.ctx.lineWidth = 1;

      // Receding horizontal latitude lines
      const lineCount = 14;
      for (let i = 1; i <= lineCount; i++) {
        const factor = Math.pow(i / lineCount, 2.2); // Exponential perspective spacing
        const y = horizonY + (bottomY - horizonY) * factor;
        const alpha = Math.min(0.22, factor * 0.24);

        this.ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.width, y);
        this.ctx.stroke();

        // Subtle glowing intersections / nodes
        if (i % 3 === 0) {
          const nodeCount = 7;
          for (let j = 1; j < nodeCount; j++) {
            const nx = (this.width / nodeCount) * j;
            this.ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 1.5})`;
            this.ctx.beginPath();
            this.ctx.arc(nx, y, 1.2, 0, Math.PI * 2);
            this.ctx.fill();
          }
        }
      }

      // Radiating longitudinal perspective lines
      const rayCount = 16;
      for (let i = -rayCount / 2; i <= rayCount / 2; i++) {
        const spread = (this.width / rayCount) * i * 2.5;
        const targetX = cx + spread;

        const rayGrad = this.ctx.createLinearGradient(cx, horizonY, targetX, bottomY);
        rayGrad.addColorStop(0, 'rgba(99, 102, 241, 0)');
        rayGrad.addColorStop(0.3, 'rgba(99, 102, 241, 0.08)');
        rayGrad.addColorStop(1, 'rgba(56, 189, 248, 0.18)');

        this.ctx.strokeStyle = rayGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, horizonY);
        this.ctx.lineTo(targetX, bottomY);
        this.ctx.stroke();
      }

      // Horizon atmospheric line glow
      const horizonGrad = this.ctx.createLinearGradient(0, horizonY, this.width, horizonY);
      horizonGrad.addColorStop(0, 'rgba(99, 102, 241, 0)');
      horizonGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.15)');
      horizonGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.25)');
      horizonGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.15)');
      horizonGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');

      this.ctx.strokeStyle = horizonGrad;
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(0, horizonY);
      this.ctx.lineTo(this.width, horizonY);
      this.ctx.stroke();

      this.ctx.restore();
    }

    drawConstellationParticles() {
      const mx = this.mouse.x;
      const my = this.mouse.y;

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        // Natural movement modulated by depth z
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        // Wrap around viewport edges
        if (p.x < -20) p.x = this.width + 20;
        if (p.x > this.width + 20) p.x = -20;
        if (p.y < -20) p.y = this.height + 20;
        if (p.y > this.height + 20) p.y = -20;

        // Mouse repulsion physics (elastic repulsion)
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 130 * p.z;

        if (dist < maxDist && dist > 0) {
          const force = (1 - dist / maxDist) * 3.5 * p.z;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Pulse alpha
        p.pulseVal += p.pulseSpeed;
        const currentAlpha = p.baseAlpha * (0.7 + Math.sin(p.pulseVal) * 0.3);

        // Foreground bokeh orbs vs crisp midground stars
        if (p.z > 2.0) {
          // Large soft bokeh
          const bokehGrad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.5);
          bokehGrad.addColorStop(0, `rgba(56, 189, 248, ${currentAlpha * 0.6})`);
          bokehGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');

          this.ctx.fillStyle = bokehGrad;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
          this.ctx.fill();
        } else {
          // Sharp glowing particle
          this.ctx.fillStyle = p.z > 1.2 ? `rgba(248, 250, 252, ${currentAlpha})` : `rgba(148, 163, 184, ${currentAlpha * 0.7})`;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius * (p.z * 0.7), 0, Math.PI * 2);
          this.ctx.fill();
        }

        // Connect midground particles with constellation links
        if (p.z > 0.8 && p.z < 2.0) {
          for (let j = i + 1; j < this.particles.length; j++) {
            const p2 = this.particles[j];
            if (p2.z > 0.8 && p2.z < 2.0) {
              const cdx = p.x - p2.x;
              const cdy = p.y - p2.y;
              const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

              if (cdist < 85) {
                const lineAlpha = (1 - cdist / 85) * 0.15;
                this.ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
                this.ctx.lineWidth = 0.8;
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
              }
            }
          }
        }
      }
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.spatialEngine = new SpatialEngine();
    });
  } else {
    window.spatialEngine = new SpatialEngine();
  }
})();
