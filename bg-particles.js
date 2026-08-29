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
        
        // Kecepatan melayang lebih lembut dan lebih elegan
        const speedMultiplier = 0.02 + Math.random() * 0.045;
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
        // 1. Jalankan perpindahan melayang dasar dengan drift halus
        this.x += this.vx + Math.sin(this.y * 0.02 + this.pulseOffset) * 0.03;
        this.y += this.vy + Math.cos(this.x * 0.018 + this.pulseOffset) * 0.02;
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

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("bg-text-container");
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    function handleResize() {
        width = window.innerWidth;
        height = window.innerHeight;
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

    // Kumpulan kata bertema Informatika Siliwangi (IF25 dominan)
    const TEXT_POOL = [
        "IF25", "IF25", "IF25", "IF25", 
        "IF'25", "IF'25", 
        "UNSIL", "UNSIL",
        "INFORMATIKA", "INFORMATIKA", 
        "IF25", "IF25", "UNSIL", "IF25"
    ];

    // Pembuatan Partikel Teks
    const particles = [];
    const maxParticles = width < 768 ? 8 : width < 1200 ? 14 : 22;

    for (let i = 0; i < maxParticles; i++) {
        const text = TEXT_POOL[Math.floor(Math.random() * TEXT_POOL.length)];
        particles.push(new TextParticle(container, text));
    }

    // Letupan Sparks Teks saat layar diklik
    let sparks = [];
    const SPARK_TEXTS = ["IF25", "INF", "25", "IF", "*", "💻", "⚡"];

    window.addEventListener("click", (e) => {
        const target = e.target;
        if (!target || typeof target.closest !== "function") return;
        
        // Jangan picu spark jika klik dilakukan di tombol/tautan
        if (target.closest("a") || target.closest("button") || target.id === "particle-canvas") {
            return; 
        }

        const colorClass = Math.random() > 0.45 ? "" : "blue-glow";
        
        // Spark minimal agar klik terasa premium, bukan mengganggu
        for (let i = 0; i < 5; i++) {
            const sparkText = SPARK_TEXTS[Math.floor(Math.random() * SPARK_TEXTS.length)];
            sparks.push(new Spark(container, e.clientX, e.clientY, sparkText, colorClass));
        }
    });

    // Loop Animasi Utama (60 FPS GPU-Accelerated)
    function animate() {
        // 1. Update & Render Sparks
        for (let i = sparks.length - 1; i >= 0; i--) {
            const s = sparks[i];
            if (s.update()) {
                s.draw();
            } else {
                s.remove();
                sparks.splice(i, 1);
            }
        }

        // 2. Update & Render Partikel Teks
        particles.forEach(p => {
            p.update(width, height, mouse);
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    // Mulai animasi
    animate();
});
