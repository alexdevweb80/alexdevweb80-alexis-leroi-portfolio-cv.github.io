// DNA SUN ANIMATION (Adapted for Cyberpunk)
const canvas = document.getElementById('cyberCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    const particleCount = 150;
    const radius = 100; // Smaller radius for background usage
    const speed = 0.005;

    function resize() {
        if (!canvas.parentElement) return;
        width = canvas.parentElement.offsetWidth;
        height = canvas.parentElement.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    class Particle {
        constructor(angle, y, layer) {
            this.angle = angle;
            this.y = y; // Vertical position relative to center
            this.layer = layer; // 0 or 1 for double helix strands
            this.initialAngle = angle;
            this.baseY = y;
        }

        update(time) {
            // Rotate the entire structure
            this.angle = this.initialAngle + time * speed;
        }

        draw(time) {
            // Helix math
            // We want a helix wrapped around a sphere/circle
            const centerX = width / 2;
            const centerY = height / 2;

            // Helix offset calculation
            // As time moves, the helix twists
            const helixRadius = 30 + Math.sin(time * 2 + this.y * 0.05) * 10;

            // Circular transformation: wrap the vertical helix into a circle (Sun)
            // Actually, let's do a Radial DNA pattern:
            // Strands radiating from center, or a ring of DNA.

            // Let's implement the "DNA Sun" as a ring of double-helix strands

            const orbitRadius = radius;

            // Position on the main ring
            const ringX = centerX + Math.cos(this.angle) * orbitRadius;
            const ringY = centerY + Math.sin(this.angle) * orbitRadius;

            // DNA Strand oscillation perpendicular to the ring tangent
            // Tangent angle is this.angle + PI/2
            const tangent = this.angle + Math.PI / 2;

            // Offset for the double helix effect (sine wave along the ring)
            const helixPhase = (this.angle * 10) + (time * 2);
            const strandOffset = Math.sin(helixPhase) * 20; // Amplitude of helix

            // Two strands logic
            const layerSign = this.layer === 0 ? 1 : -1;

            // Final position adding the helix oscillation to the ring position
            // We move purely radially for the "spikes" of the sun? Or perpendicular to the path?
            // Let's move radially for a "pulsing sun" effect, or perpendicular for a "tube" effect.
            // Let's try perpendicular to the ring (thickness of the ring).

            const localX = ringX + Math.cos(this.angle) * (strandOffset * layerSign);
            const localY = ringY + Math.sin(this.angle) * (strandOffset * layerSign);

            // Styling
            const alpha = 0.5 + Math.sin(helixPhase) * 0.5; // Twinkle effect

            ctx.beginPath();
            ctx.arc(localX, localY, 2, 0, Math.PI * 2);

            if (this.layer === 0) {
                ctx.fillStyle = `rgba(0, 243, 255, ${alpha})`; // Cyan
            } else {
                ctx.fillStyle = `rgba(255, 0, 60, ${alpha})`; // Cyber Pink
            }

            ctx.fill();

            // Connect strands with lines (base pairs) every few particles
            if (Math.random() > 0.95) {
                ctx.beginPath();
                // Find opposite point approx
                const oppX = ringX + Math.cos(this.angle) * (strandOffset * -layerSign);
                const oppY = ringY + Math.sin(this.angle) * (strandOffset * -layerSign);

                ctx.moveTo(localX, localY);
                ctx.lineTo(oppX, oppY);
                ctx.strokeStyle = `rgba(252, 238, 10, ${alpha * 0.5})`; // Cyber Yellow connections
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    function initParticles() {
        particles = [];
        // Create particles distributed around the circle
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            particles.push(new Particle(angle, 0, 0));
            particles.push(new Particle(angle, 0, 1));
        }
    }

    let time = 0;
    function animate() {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.1)'; // Trail effect
        ctx.fillRect(0, 0, width, height);

        // Draw Sun Core (Glow)
        const centerX = width / 2;
        const centerY = height / 2;
        const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 1.2);
        gradient.addColorStop(0, 'rgba(0, 255, 65, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 65, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        particles.forEach(p => {
            p.update(time);
            p.draw(time);
        });

        time += 0.01;
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('load', () => {
        resize();
        animate();
    });

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Glitch Text Logic (Optional Enhancement) ---
    const glitchTexts = document.querySelectorAll('.glitch');
    glitchTexts.forEach(text => {
        const original = text.getAttribute('data-text');

        text.addEventListener('mouseover', () => {
            let iterations = 0;
            const interval = setInterval(() => {
                text.innerText = text.innerText
                    .split('')
                    .map((letter, index) => {
                        if (index < iterations) {
                            return original[index];
                        }
                        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'[Math.floor(Math.random() * 36)];
                    })
                    .join('');

                if (iterations >= original.length) clearInterval(interval);

                iterations += 1 / 3;
            }, 30);
        });
    });

    // --- Custom Cursor Logic ---
    const cursor = document.getElementById('cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            // Generate trail particle occasionally
            if (Math.random() > 0.9) {
                createTrail(e.clientX, e.clientY);
            }
        });

        // Hover effects
        const links = document.querySelectorAll('a, button, .skill-box, .card-cyber');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            link.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    function createTrail(x, y) {
        const particle = document.createElement('div');
        particle.classList.add('particle-effect');
        document.body.appendChild(particle);
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// --- Scroll Animations (Intersection Observer) ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

const scrollElements = document.querySelectorAll('.skill-box, .timeline-item, .section-header, .about-text');
scrollElements.forEach(el => {
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
});

// --- TERMINAL LOADER SIMULATION ---
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeText(el, text, speed = 18) {
    for (let i = 0; i < text.length; i++) {
        el.textContent += text[i];
        el.scrollTop = el.scrollHeight;
        await sleep(speed + Math.random() * 20);
    }
}

async function runTerminalLoader() {
    const output = document.getElementById('terminal-output');
    const loader = document.getElementById('terminal-loader');
    const main = document.getElementById('main-content');
    if (!output || !loader || !main) return;

    // Promise that resolves when window load fires (all resources loaded)
    const loadPromise = new Promise(resolve => {
        if (document.readyState === 'complete') return resolve();
        window.addEventListener('load', () => resolve(), { once: true });
    });

    // Advanced sequence helper: supports typing, pauses and deletes
    async function performSequence(seq) {
        for (const step of seq) {
            if (step.type === 'text') {
                await typeText(output, step.text, step.speed ?? 18);
            } else if (step.type === 'pause') {
                await sleep(step.duration);
            } else if (step.type === 'delete') {
                const count = step.count === 'all' ? output.textContent.length : step.count;
                for (let i = 0; i < count; i++) {
                    output.textContent = output.textContent.slice(0, -1);
                    output.scrollTop = output.scrollHeight;
                    await sleep(step.speed ?? 10);
                }
            }
            output.scrollTop = output.scrollHeight;
        }
    }

    // Welcome sequence
    await performSequence([
        { type: 'text', text: '> Bienvenue sur le portfolio de Alexis Leroi.\n', speed: 20 },
        { type: 'pause', duration: 450 },
        { type: 'text', text: '> Préparation de l\'interface...', speed: 16 },
        { type: 'pause', duration: 300 }
    ]);

    // Simulated checks before waiting for resources
    const prechecks = [
        'Vérification du réseau: [ OK ]',
        'Chargement des polices: [ OK ]',
        'Initialisation du rendu: [ OK ]'
    ];

    for (const line of prechecks) {
        await typeText(output, '> ' + line + '\n', 14);
        await sleep(200 + Math.random() * 300);
    }

    // Wait for actual resource load with a dot animation
    await typeText(output, '> Attente du chargement des ressources', 16);
    let dotCount = 0;
    const dotTimer = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        // update trailing dots
        output.textContent = output.textContent.replace(/\.{0,3}$/, '');
        output.textContent += '.'.repeat(dotCount);
        output.scrollTop = output.scrollHeight;
    }, 400);

    await loadPromise; // actual wait for window load
    clearInterval(dotTimer);
    // finalize the waiting line
    output.textContent = output.textContent.replace(/\.{0,3}$/, '') + '... OK\n';

    // Continue with startup details and progress bar
    await typeText(output, '\n> Lancement du script principal...\n', 14);

    // Progress simulation
    for (let p = 0; p <= 100; p += Math.floor(6 + Math.random() * 14)) {
        const percent = Math.min(p, 100);
        const barCount = 20;
        const filled = Math.round((percent / 100) * barCount);
        const bar = '[' + '█'.repeat(filled) + ' '.repeat(barCount - filled) + '] ' + percent + '%';
        // remove previous progress bar line if any
        output.textContent = output.textContent.replace(/\n?\[.*?\]\s*\d+%\s*$/, '');
        output.textContent += bar + '\n';
        output.scrollTop = output.scrollHeight;
        await sleep(150 + Math.random() * 180);
    }

    await typeText(output, '\n> Démarrage terminé. Affichage du portfolio...\n', 12);
    await sleep(500);

    // Hide loader and reveal main
    loader.classList.add('hidden');
    loader.setAttribute('aria-hidden', 'true');
    main.setAttribute('aria-hidden', 'false');
}

window.addEventListener('DOMContentLoaded', () => {
    runTerminalLoader().catch(console.error);
});
