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
        
        // Pilihan warna: 65% cream (#FAFCEB), 35% merah neon (#FF0000)
        this.isRed = Math.random() > 0.65;
        if (this.isRed) {
            this.el.classList.add("red-glow");
        }
        
        // Skala acak untuk efek kedalaman 3D (parallax)
        this.scale = 0.7 + Math.random() * 1.8;
        
        // Atur opasitas bawaan berdasarkan ukuran (tulisan besar = lebih dekat & sedikit lebih jelas)
        this.baseAlpha = 0.4 + (this.scale / 2.5) * 0.3;
        this.alpha = this.baseAlpha;
        this.el.style.opacity = this.alpha;
        
        // Atur posisi awal acak di layar
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.x = Math.random() * this.width;
        this.y = Math.random() * this.height;
        
        // Kecepatan melayang bebas yang sangat lambat & tenang
        const speedMultiplier = 0.06 + Math.random() * 0.12;
        const angleDir = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angleDir) * speedMultiplier;
        this.vy = Math.sin(angleDir) * speedMultiplier;
        
        // Rotasi awal & kecepatan putaran lambat
        this.angle = (Math.random() - 0.5) * 25;
        this.vAngle = (Math.random() - 0.5) * 0.04;
        
        // Offset interaktif saat didorong kursor mouse
        this.offsetX = 0;
        this.offsetY = 0;
        this.targetOffsetX = 0;
        this.targetOffsetY = 0;
        
        // Render awal elemen ke container
        this.parent.appendChild(this.el);
    }

    update(width, height, mouse) {
        // 1. Jalankan perpindahan melayang dasar
        this.x += this.vx;
        this.y += this.vy;
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
            const repulsionDist = 180; // Jangkauan dorongan kursor

            if (dist < repulsionDist) {
                const pushAngle = Math.atan2(dy, dx);
                // Dorong partikel teks semakin jauh saat kursor mendekat
                const force = (repulsionDist - dist) / repulsionDist;
                this.targetOffsetX = Math.cos(pushAngle) * force * 65;
                this.targetOffsetY = Math.sin(pushAngle) * force * 65;
                
                // Berikan efek highlight bersinar saat kursor di dekatnya
                this.el.style.color = this.isRed ? "rgba(255, 0, 0, 0.28)" : "rgba(250, 252, 235, 0.28)";
                this.el.style.textShadow = this.isRed ? "0 0 16px rgba(255, 0, 0, 0.18)" : "0 0 16px rgba(250, 252, 235, 0.18)";
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
        // Terapkan translasi 3D terakselerasi GPU untuk performa rendering super mulus 60 FPS
        this.el.style.transform = `translate3d(${this.x + this.offsetX}px, ${this.y + this.offsetY}px, 0) rotate(${this.angle}deg) scale(${this.scale})`;
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
    const maxParticles = width < 768 ? 16 : 38; // Kerapatan partikel teks terapung ideal

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

        const colorClass = Math.random() > 0.45 ? "" : "red";
        
        // Lahirkan letupan 12 teks sparks mini
        for (let i = 0; i < 12; i++) {
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
