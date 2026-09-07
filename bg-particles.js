/**
 * Portofolio Uzi - Interactive Floating Text Background Particles (IF25 & UNSIL Theme)
 * 100% robust against Brave Canvas Fingerprinting Shields, utilizing GPU-accelerated HTML elements.
 */

class TextParticle {
    constructor(parent, text) {
        this.parent = parent;
        this.text = text;
        
        // Buat elemen DIV HTML
        this.el = document.createElement("div");
        this.el.className = "bg-text-particle";
        this.el.textContent = text;
        
        // Pilihan warna biru
        this.isNeon = Math.random() > 0.65;
        if (this.isNeon) {
            this.el.classList.add("blue-glow");
        }

        // Skala acak untuk efek kedalaman 3D yang lebih cinematic
        this.scale = 0.8 + Math.random() * 1.2;
        
        // Opasitas lebih lembut agar background terasa atmosferis, bukan ramai
        this.baseAlpha = 0.12 + (this.scale / 2.8) * 0.14;
        this.alpha = this.baseAlpha;
        this.el.style.opacity = this.alpha;

        // Variabel untuk efek berkedip halus di background
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.4 + Math.random() * 0.8;
        
        // Atur posisi awal acak di layar
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.x = Math.random() * this.width;
        this.y = Math.random() * this.height;
        this.waveBaseY = this.y;
        this.wavePhase = Math.random() * Math.PI * 2;
        this.waveAmplitude = 18 + Math.random() * 34;
        this.waveLength = 0.004 + Math.random() * 0.003;
        this.waveSpeed = 0.45 + Math.random() * 0.35;
        
        // Kecepatan melayang lebih lembut dan lebih elegan
        const speedMultiplier = 0.08 + Math.random() * 0.12;
        const angleDir = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angleDir) * speedMultiplier;
        this.vy = Math.sin(angleDir) * speedMultiplier;
        
        // Rotasi awal & kecepatan putaran lebih halus
        this.angle = (Math.random() - 0.5) * 18;
        this.vAngle = (Math.random() - 0.5) * 0.02;
        
        // Offset interaktif saat didorong kursor mouse
        this.offsetX = 0;
        this.offsetY = 0;
        this.targetOffsetX = 0;
        this.targetOffsetY = 0;
        
        // Render awal elemen ke container
        this.parent.appendChild(this.el);
    }

    update(width, height, mouse) {
        // 1. Gerakkan partikel menyusuri gelombang dengan fase yang berbeda
        const time = performance.now() * 0.001;
        this.x += this.vx;
        this.y = this.waveBaseY + Math.sin(
            this.x * this.waveLength + time * this.waveSpeed + this.wavePhase
        ) * this.waveAmplitude;
        this.angle += this.vAngle;

        // 2. Wrap-around layar jika keluar batas (ditambah margin ukuran font)
        const fontBound = 160;
        if (this.x < -fontBound) {
            this.x = width + 30;
        } else if (this.x > width + fontBound) {
            this.x = -fontBound + 30;
        }

        if (this.y < -fontBound) {
            this.y = height + 30;
        } else if (this.y > height + fontBound) {
            this.y = -fontBound + 30;
        }

        // 3. Efek Tolakan Kursor Global (Repulsion)
        if (mouse.active) {
            const centerX = this.x + 40; // Perkiraan pusat tulisan
            const centerY = this.y;
            
            const dx = centerX - mouse.x;
            const dy = centerY - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repulsionDist = 240;

            if (dist < repulsionDist) {
                const pushAngle = Math.atan2(dy, dx);
                const force = (repulsionDist - dist) / repulsionDist;
                this.targetOffsetX = Math.cos(pushAngle) * force * 28;
                this.targetOffsetY = Math.sin(pushAngle) * force * 28;
                
                this.el.style.color = this.isNeon ? "rgba(0, 229, 255, 0.46)" : "rgba(0, 136, 255, 0.38)";
                this.el.style.textShadow = this.isNeon ? "0 0 16px rgba(0, 229, 255, 0.25)" : "0 0 16px rgba(0, 136, 255, 0.2)";
            } else {
                this.targetOffsetX = 0;
                this.targetOffsetY = 0;
                this.el.style.color = "";
                this.el.style.textShadow = "";
            }
        } else {
            this.targetOffsetX = 0;
            this.targetOffsetY = 0;
            this.el.style.color = "";
            this.el.style.textShadow = "";
        }

        this.waveBaseY = Math.max(-fontBound, Math.min(height + fontBound, this.waveBaseY));

        // Interpolasi perpindahan dorongan kursor secara smooth
        this.offsetX += (this.targetOffsetX - this.offsetX) * 0.08;
        this.offsetY += (this.targetOffsetY - this.offsetY) * 0.08;
    }

    draw() {
        const pulse = 1 + Math.sin((performance.now() * 0.001 * this.pulseSpeed) + this.pulseOffset) * 0.12;
        const glowAlpha = Math.min(0.5, this.baseAlpha + 0.12);

        this.el.style.opacity = String(Math.min(glowAlpha, this.alpha * pulse));
        this.el.style.transform = `translate3d(${this.x + this.offsetX}px, ${this.y + this.offsetY}px, 0) rotate(${this.angle}deg) scale(${this.scale * pulse})`;
    }

    remove() {
        if (this.el && this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
        }
    }
}

class Spark {
    constructor(parent, x, y, text, colorClass) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        
        // Buat teks letupan kecil
        this.el = document.createElement("span");
        this.el.className = `spark-text-particle ${colorClass}`;
        this.el.textContent = text;
        
        // Tentukan arah letupan melingkar acak
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.alpha = 1;
        this.decay = 0.02 + Math.random() * 0.015; // Kecepatan memudar
        this.gravity = 0.06; // Letupan akan melengkung jatuh ke bawah secara alami
        this.scale = 0.6 + Math.random() * 0.5;
        this.angle = Math.random() * 360;
        this.vAngle = (Math.random() - 0.5) * 8;
        
        this.parent.appendChild(this.el);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.angle += this.vAngle;
        this.alpha -= this.decay;
        
        this.el.style.opacity = this.alpha;
        return this.alpha > 0;
    }

    draw() {
        this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) rotate(${this.angle}deg) scale(${this.scale})`;
    }

    remove() {
        if (this.el && this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
        }
    }
}

class DataStreamField {
    constructor(parent, width, height) {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "particle-field";
        this.context = this.canvas.getContext("2d");
        this.parent = parent;
        this.streams = [];
        this.resize(width, height);
        parent.appendChild(this.canvas);

        const streamCount = Math.ceil(width / 34);
        const characters = "01ABCDEF0123456789";
        for (let i = 0; i < streamCount; i++) {
            const cellSize = 11 + Math.random() * 4;
            const length = 8 + Math.floor(Math.random() * 18);
            this.streams.push({
                x: i * 34 + Math.random() * 18,
                y: Math.random() * height,
                speed: 35 + Math.random() * 75,
                cellSize,
                length,
                brightness: 0.12 + Math.random() * 0.22,
                phase: Math.random() * Math.PI * 2,
                characters: Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)])
            });
        }
    }

    resize(width, height) {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = width * pixelRatio;
        this.canvas.height = height * pixelRatio;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    update(width, height, mouse) {
        const time = performance.now() * 0.001;
        const context = this.context;
        context.clearRect(0, 0, width, height);
        context.font = "600 12px monospace";
        context.textAlign = "center";
        context.textBaseline = "top";

        context.fillStyle = "rgba(0, 229, 255, 0.018)";
        context.fillRect(0, 0, width, height);

        this.streams.forEach(stream => {
            stream.y += stream.speed * 0.016;
            if (stream.y - stream.length * stream.cellSize > height + 40) {
                stream.y = -Math.random() * height * 0.8 - 40;
                stream.speed = 35 + Math.random() * 75;
            }

            const mouseDistance = mouse.active ? Math.abs(stream.x - mouse.x) : Infinity;
            const focus = Math.max(0, 1 - mouseDistance / 180);
            const shimmer = 0.85 + Math.sin(time * 3 + stream.phase) * 0.15;

            for (let index = 0; index < stream.length; index++) {
                const y = stream.y - index * stream.cellSize;
                if (y < -20 || y > height + 20) continue;

                const fade = 1 - index / stream.length;
                const alpha = Math.min(0.95, (stream.brightness + focus * 0.35) * fade * shimmer);
                const character = stream.characters[index];
                const isLead = index === 0;
                const isDither = (index + Math.floor(time * 2) + Math.floor(stream.phase * 3)) % 5 === 0;
                const color = isLead ? `rgba(224, 252, 255, ${Math.min(1, alpha + 0.3)})` : `rgba(0, 229, 255, ${alpha})`;

                context.shadowBlur = isLead || focus > 0.25 ? 12 : 5;
                context.shadowColor = "rgba(0, 229, 255, 0.8)";
                context.fillStyle = color;
                context.fillText(character, stream.x, y);

                if (isDither) {
                    context.shadowBlur = 0;
                    context.fillStyle = `rgba(98, 240, 255, ${alpha * 0.32})`;
                    context.fillRect(stream.x - 5, y + stream.cellSize * 0.72, 3, 2);
                }
            }
        });

        context.shadowBlur = 0;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("bg-text-container");
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dataStream = new DataStreamField(container, width, height);

    function handleResize() {
        width = window.innerWidth;
        height = window.innerHeight;
        dataStream.resize(width, height);
    }
    window.addEventListener("resize", handleResize);

    // Kursor Mouse Tracker
    const mouse = {
        x: 0,
        y: 0,
        active: false
    };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener("mouseleave", () => {
        mouse.active = false;
    });

    window.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
            mouse.active = true;
        }
    }, { passive: true });

    window.addEventListener("touchend", () => {
        mouse.active = false;
    });

    // Loop Animasi Utama (60 FPS GPU-Accelerated)
    function animate() {
        // 1. Update & Render the connected light-particle field
        dataStream.update(width, height, mouse);

        requestAnimationFrame(animate);
    }

    // Mulai animasi
    animate();
});
