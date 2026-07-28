const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const miniCanvas = document.getElementById('minimapCanvas');
const miniCtx = miniCanvas.getContext('2d');

const toast = document.getElementById('toastMessage');
let toastTimeout = null;

function showToast(text, duration = 1800) {
    toast.innerText = text || '⚠️ لا تملك عملات كافية!';
    toast.style.display = 'block';
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.style.display = 'none';
    }, duration);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* =========================================================
   🔊 محرك الأصوات البرمجي المتطور (Web Audio API)
   ========================================================= */
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// 🪙 1. صوت الالتقاط للعملات
function playCoinSound() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
}

// 🔫 2. صوت إطلاق الطلقات النيونية
function playShootSound() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.09);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
}

// 💥 3. صوت الانفجارات وتدمير الوحوش
function playExplosionSound() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const bufferSize = audioCtx.sampleRate * 0.2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, now);
    filter.frequency.exponentialRampToValueAtTime(40, now + 0.2);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start(now);
}

// ⚡ 4. صوت حركة الـ Dash
function playDashSound() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.15);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
}

// 🩸 5. صوت تلقي الضرر
function playHitSound() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
}

// ❄️ 6. صوت التجميد
function playFreezeSound() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(2200, now + 0.28);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
}

// 🆙 7. صوت النصر والترقية
function playUpgradeSound() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];

    notes.forEach((f, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.07);

        gain.gain.setValueAtTime(0.1, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.18);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.18);
    });
}

// تفعيل محرك الصوت مع أول نقرة شاشة لكسر قيود المتصفحات
window.addEventListener('pointerdown', initAudio, { once: true });

/* =========================================================
   🎮 متغيرات اللعبة الأساسية
   ========================================================= */
const world = { width: 6000, height: 6000 };
const camera = { x: 0, y: 0 };

let gameState = 'MENU';
let currentWave = 1;
let enemySpawnTimer = 0;
let enemiesInWaveToSpawn = 60;
let enemiesSpawnedInWave = 0;
const maxActiveEnemiesCap = 200;
let totalKills = 0;
let comboCount = 0;
let lastKillTime = 0;
const comboResetTime = 120; // frames

// نظام حفظ العملات والشخصيات LocalStorage
let playerCoins = parseInt(localStorage.getItem('cyber_coins')) || 0;
let unlockedSkins = JSON.parse(localStorage.getItem('cyber_unlocked_skins')) || ['default'];
let activeSkinId = localStorage.getItem('cyber_active_skin') || 'default';

function saveGameData() {
    localStorage.setItem('cyber_coins', playerCoins);
    localStorage.setItem('cyber_unlocked_skins', JSON.stringify(unlockedSkins));
    localStorage.setItem('cyber_active_skin', activeSkinId);
}

// قائمة السكنات الجديدة مع أسعار مرتفعة جداً
const skinsList = [
    { id: 'default', name: 'النيوني الأزرق', color: '#00f3ff', price: 0 },
    { id: 'crimson', name: 'النينجا الناري', color: '#ff0055', price: 800 },
    { id: 'poison', name: 'نينجا السموم', color: '#00ff66', price: 1500 },
    { id: 'golden', name: 'النينجا الذهبي', color: '#ffe600', price: 3000 },
    { id: 'void', name: 'نينجا الظل البنفسجي', color: '#aa00ff', price: 5000 },
    { id: 'frost', name: 'نينجا الجليد الأزرق', color: '#66e0ff', price: 7000 },
    { id: 'lava', name: 'نينجا الحمم البرتقالي', color: '#ff6600', price: 9000 },
    { id: 'storm', name: 'نينجا العاصفة الكهربائي', color: '#ccff00', price: 12000 },
    { id: 'shadow', name: 'نينجا الظل الأسود', color: '#444444', price: 18000 },
    { id: 'phoenix', name: 'نينجا العنقاء الذهبي', color: '#ff4500', price: 25000 },
    { id: 'cosmic', name: 'نينجا الكوني المتلألئ', color: '#ff00ff', price: 40000 },
    { id: 'overlord', name: 'أوفرلورد الأسطوري', color: '#ffffff', price: 75000 }
];

function getActiveSkinColor() {
    const found = skinsList.find(s => s.id === activeSkinId);
    return found ? found.color : '#00f3ff';
}

const inputKeys = { up: false, down: false, left: false, right: false };

const player = {
    x: world.width / 2,
    y: world.height / 2,
    radius: 16,
    color: getActiveSkinColor(),
    speed: 5.5,
    vx: 0,
    vy: 0,
    friction: 0.85,
    maxHp: 120,
    hp: 120,
    level: 1,
    xp: 0,
    xpToNextLevel: 400,
    dashCooldown: 0,
    maxDashCooldown: 50,
    isDashing: false,
    dashTimer: 0,
    dashSpeed: 20,
    attackTimer: 0,
    attackSpeed: 12,
    damage: 42,
    orbitalBladesCount: 1,
    orbitalAngle: 0,
    hasLightning: false,
    invulnerableTimer: 0,
    trailHistory: [],
    // القدرات
    hasShield: false,
    shieldActive: false,
    shieldTimer: 0,
    maxShieldTimer: 600,
    hasFreezeNova: false,
    freezeNovaTimer: 0,
    magnetRange: 150,
    hasExplosiveBullets: false,
    pendingUpgrade: null,
    hasPendingUpgrade: false
};

let enemies = [];
let playerBullets = [];
let enemyBullets = [];
let xpOrbs = [];
let coinOrbs = [];
let healthPacks = [];
let particles = [];
let freezeWaves = [];
let earnedCoinsInSession = 0;
let levelUpParticles = [];

// إعدادات الـ Joystick
const joystickContainer = document.getElementById('joystickContainer');
const joystickKnob = document.getElementById('joystickKnob');
let joystickActive = false;
let joystickOrigin = { x: 0, y: 0 };
let joystickVector = { x: 0, y: 0 };
const joystickMaxRadius = 45;

joystickContainer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    initAudio();
    const touch = e.touches[0];
    const rect = joystickContainer.getBoundingClientRect();
    joystickOrigin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    joystickActive = true;
    updateJoystickPosition(touch);
});

joystickContainer.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!joystickActive) return;
    updateJoystickPosition(e.touches[0]);
});

function resetJoystick(e) {
    if (e) e.preventDefault();
    joystickActive = false;
    joystickVector = { x: 0, y: 0 };
    joystickKnob.style.transform = `translate(-50%, -50%) translate(0px, 0px)`;
}

joystickContainer.addEventListener('touchend', resetJoystick);
joystickContainer.addEventListener('touchcancel', resetJoystick);

function updateJoystickPosition(touch) {
    const dx = touch.clientX - joystickOrigin.x;
    const dy = touch.clientY - joystickOrigin.y;
    const distance = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(distance, joystickMaxRadius);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    joystickKnob.style.transform = `translate(-50%, -50%) translate(${knobX}px, ${knobY}px)`;
    joystickVector = { x: knobX / joystickMaxRadius, y: knobY / joystickMaxRadius };
}

// الترقيات (نفسها)
const availableUpgrades = [
    {
        id: 'energy_shield',
        title: 'درع الطاقة النيوني',
        icon: '🛡️',
        desc: 'يمتص الهجمات بالكامل ويعيد الشحن تلقائياً بعد القتال.',
        action: () => { player.hasShield = true; player.shieldActive = true; }
    },
    {
        id: 'freeze_nova',
        title: 'موجة التجميد الصقيعية',
        icon: '❄️',
        desc: 'تطلق انبعاثاً صقيعياً يتسبب بتجميد وحظر جميع الوحوش القريبة.',
        action: () => { player.hasFreezeNova = true; }
    },
    {
        id: 'super_magnet',
        title: 'مغناطيس العملات الخارق',
        icon: '🧲',
        desc: 'يجذب العملات وكريستالات الطاقة من أطراف الخريطة.',
        action: () => { player.magnetRange += 220; }
    },
    {
        id: 'explosive_rounds',
        title: 'طلقات الانفجار الجماعي',
        icon: '💥',
        desc: 'تنفجر طلقاتك عند الاصطدام لتدمير مجموعات الوحوش القريبة.',
        action: () => { player.hasExplosiveBullets = true; player.damage += 10; }
    },
    {
        id: 'orbital_blade',
        title: 'شفرة نيونية تدور',
        icon: '⚔️',
        desc: 'تضيف شفرة حادة إضافية تدور حولك وتفرك الحشود.',
        action: () => { player.orbitalBladesCount++; }
    },
    {
        id: 'lightning_strike',
        title: 'سيف الصاعقة الشاملة',
        icon: '⚡',
        desc: 'تمنح ضرباتك كهرباء تقفز بين عشرات الوحوش المتجاورة.',
        action: () => { player.hasLightning = true; player.damage += 15; }
    },
    {
        id: 'attack_speed',
        title: 'تسريع الرشاش النيوني',
        icon: '🌀',
        desc: 'مضاعفة سرعة إطلاق سكاكين النيون لإبادة الحشود.',
        action: () => { player.attackSpeed = Math.max(4, player.attackSpeed - 2); }
    },
    {
        id: 'move_speed',
        title: 'محرك النينجا السريع',
        icon: '👟',
        desc: 'زيادة السرعة وتقليل زمن شحن الـ Dash.',
        action: () => { player.speed += 1.0; player.maxDashCooldown = Math.max(20, player.maxDashCooldown - 8); }
    },
    {
        id: 'health_restore',
        title: 'إصلاح درع الطاقة',
        icon: '❤️',
        desc: 'تستعيد 60% من صحتك وتزيد الحد الأقصى للصحة.',
        action: () => { player.maxHp += 30; player.hp = Math.min(player.maxHp, player.hp + 60); }
    }
];

window.addEventListener('keydown', (e) => {
    initAudio();
    if (e.code === 'KeyW' || e.code === 'ArrowUp') inputKeys.up = true;
    if (e.code === 'KeyS' || e.code === 'ArrowDown') inputKeys.down = true;
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') inputKeys.left = true;
    if (e.code === 'KeyD' || e.code === 'ArrowRight') inputKeys.right = true;
    if (e.code === 'KeyE' || e.code === 'Space') triggerDash();
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyW' || e.code === 'ArrowUp') inputKeys.up = false;
    if (e.code === 'KeyS' || e.code === 'ArrowDown') inputKeys.down = false;
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') inputKeys.left = false;
    if (e.code === 'KeyD' || e.code === 'ArrowRight') inputKeys.right = false;
});

const dashBtn = document.getElementById('btnDash');
dashBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    initAudio();
    triggerDash();
});

function triggerDash() {
    if (player.dashCooldown <= 0 && !player.isDashing && gameState === 'PLAYING') {
        playDashSound();
        player.isDashing = true;
        player.dashTimer = 10;
        player.dashCooldown = player.maxDashCooldown;
        player.invulnerableTimer = 18;

        for (let i = 0; i < 12; i++) {
            particles.push({
                x: player.x,
                y: player.y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                radius: Math.random() * 4 + 2,
                color: player.color,
                alpha: 1,
                decay: 0.05
            });
        }
    }
}

function updateUI() {
    document.getElementById('menuCoinText').innerText = `🪙 العملات: ${playerCoins}`;
    document.getElementById('shopCoinText').innerText = `🪙 العملات: ${playerCoins}`;
    document.getElementById('hudCoinText').innerText = `🪙 ${playerCoins} عملات`;
    document.getElementById('levelText').innerText = `⭐ المستوى: ${player.level}`;
    document.getElementById('xpText').innerText = `${player.xp} / ${player.xpToNextLevel} XP`;
}
updateUI();

function startGameFromMenu() {
    initAudio();
    document.getElementById('mainMenuModal').style.display = 'none';
    document.getElementById('hud').style.display = 'flex';
    document.getElementById('joystickContainer').style.display = 'block';
    document.getElementById('btnDash').style.display = 'flex';
    document.getElementById('minimapCanvas').style.display = 'block';

    player.color = getActiveSkinColor();
    restartGameDirectly();
}

function openShopModal() {
    initAudio();
    document.getElementById('mainMenuModal').style.display = 'none';
    document.getElementById('shopModal').style.display = 'flex';
    renderShopCards();
}

function closeShopModal() {
    initAudio();
    document.getElementById('shopModal').style.display = 'none';
    document.getElementById('mainMenuModal').style.display = 'flex';
    updateUI();
}

function renderShopCards() {
    const container = document.getElementById('skinsContainer');
    container.innerHTML = '';

    skinsList.forEach(skin => {
        const isUnlocked = unlockedSkins.includes(skin.id);
        const isSelected = activeSkinId === skin.id;

        const card = document.createElement('div');
        card.className = `skin-card ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
            <div class="skin-preview" style="background: ${skin.color}; color: ${skin.color};"></div>
            <div class="skin-name">${skin.name}</div>
            <div class="skin-price">${isUnlocked ? (isSelected ? 'مُجهز الآن ✅' : 'مملوك') : `🪙 ${skin.price}`}</div>
        `;

        card.onclick = () => {
            initAudio();
            if (isUnlocked) {
                activeSkinId = skin.id;
                player.color = skin.color;
                saveGameData();
                renderShopCards();
            } else {
                if (playerCoins >= skin.price) {
                    playUpgradeSound();
                    playerCoins -= skin.price;
                    unlockedSkins.push(skin.id);
                    activeSkinId = skin.id;
                    player.color = skin.color;
                    saveGameData();
                    updateUI();
                    renderShopCards();
                } else {
                    showToast('⚠️ لا تملك عملات كافية لشراء هذه الشخصية!');
                }
            }
        };

        container.appendChild(card);
    });
}

function spawnEnemyHorde(count = 1) {
    for (let i = 0; i < count; i++) {
        if (enemies.length >= maxActiveEnemiesCap) break;

        let spawnAngle = Math.random() * Math.PI * 2;
        let spawnDist = Math.max(canvas.width, canvas.height) / 2 + 100 + Math.random() * 350;

        let x = player.x + Math.cos(spawnAngle) * spawnDist;
        let y = player.y + Math.sin(spawnAngle) * spawnDist;

        x += (Math.random() - 0.5) * 80;
        y += (Math.random() - 0.5) * 80;

        x = Math.max(50, Math.min(world.width - 50, x));
        y = Math.max(50, Math.min(world.height - 50, y));

        const enemyTypes = [
            { type: 'chaser', color: '#ff0055', radius: 15, speed: 2.8, hp: 45 + (currentWave * 10), damage: 12 },
            { type: 'fast', color: '#00ff88', radius: 12, speed: 3.9, hp: 25 + (currentWave * 6), damage: 8 },
            { type: 'shooter', color: '#b000ff', radius: 16, speed: 2.0, hp: 35 + (currentWave * 8), damage: 12 },
            { type: 'tank', color: '#ffe600', radius: 26, speed: 1.4, hp: 140 + (currentWave * 35), damage: 25 }
        ];

        const selectedType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

        enemies.push({
            x: x,
            y: y,
            type: selectedType.type,
            color: selectedType.color,
            radius: selectedType.radius,
            speed: selectedType.speed,
            hp: selectedType.hp,
            maxHp: selectedType.hp,
            damage: selectedType.damage,
            shootTimer: Math.floor(Math.random() * 60),
            frozenTimer: 0
        });
    }
}

function update() {
    if (gameState !== 'PLAYING') return;

    if (player.dashCooldown > 0) {
        player.dashCooldown--;
        dashBtn.classList.add('cooling');
    } else {
        dashBtn.classList.remove('cooling');
    }

    if (player.invulnerableTimer > 0) player.invulnerableTimer--;

    // تحديث درع الطاقة
    if (player.hasShield && !player.shieldActive) {
        player.shieldTimer++;
        if (player.shieldTimer >= player.maxShieldTimer) {
            player.shieldActive = true;
            player.shieldTimer = 0;
        }
    }

    // تحديث موجة التجميد
    if (player.hasFreezeNova) {
        player.freezeNovaTimer++;
        if (player.freezeNovaTimer >= 360) {
            playFreezeSound();
            freezeWaves.push({ x: player.x, y: player.y, radius: 10, maxRadius: 320, alpha: 1.0 });
            player.freezeNovaTimer = 0;
        }
    }

    // موجات الصقيع
    for (let fw = freezeWaves.length - 1; fw >= 0; fw--) {
        let wave = freezeWaves[fw];
        wave.radius += 12;
        wave.alpha -= 0.03;

        for (let e of enemies) {
            let d = Math.hypot(e.x - wave.x, e.y - wave.y);
            if (Math.abs(d - wave.radius) < 25) {
                e.frozenTimer = 150;
            }
        }

        if (wave.alpha <= 0 || wave.radius >= wave.maxRadius) {
            freezeWaves.splice(fw, 1);
        }
    }

    let moveX = 0;
    let moveY = 0;

    if (joystickActive && (joystickVector.x !== 0 || joystickVector.y !== 0)) {
        moveX = joystickVector.x;
        moveY = joystickVector.y;
    } else {
        if (inputKeys.up) moveY -= 1;
        if (inputKeys.down) moveY += 1;
        if (inputKeys.left) moveX -= 1;
        if (inputKeys.right) moveX += 1;

        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.7071;
            moveY *= 0.7071;
        }
    }

    if (player.isDashing) {
        player.vx = moveX * player.dashSpeed;
        player.vy = moveY * player.dashSpeed;
        player.dashTimer--;
        if (player.dashTimer <= 0) player.isDashing = false;
    } else {
        player.vx += moveX * player.speed * 0.3;
        player.vy += moveY * player.speed * 0.3;
        player.vx *= player.friction;
        player.vy *= player.friction;
    }

    player.x += player.vx;
    player.y += player.vy;

    player.x = Math.max(player.radius, Math.min(world.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(world.height - player.radius, player.y));

    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;

    camera.x = Math.max(0, Math.min(world.width - canvas.width, camera.x));
    camera.y = Math.max(0, Math.min(world.height - canvas.height, camera.y));

    if (Math.abs(player.vx) > 0.5 || Math.abs(player.vy) > 0.5) {
        player.trailHistory.push({ x: player.x, y: player.y, alpha: 0.5 });
        if (player.trailHistory.length > 8) player.trailHistory.shift();
    }

    player.orbitalAngle += 0.07;

    // إطلاق طلقات تلقائية
    player.attackTimer++;
    if (player.attackTimer >= player.attackSpeed && enemies.length > 0) {
        let closestEnemy = null;
        let minDistance = Infinity;

        for (let i = 0; i < enemies.length; i++) {
            let dist = Math.hypot(enemies[i].x - player.x, enemies[i].y - player.y);
            if (dist < minDistance) {
                minDistance = dist;
                closestEnemy = enemies[i];
            }
        }

        if (closestEnemy && minDistance < 650) {
            playShootSound();
            let angle = Math.atan2(closestEnemy.y - player.y, closestEnemy.x - player.x);
            playerBullets.push({
                x: player.x,
                y: player.y,
                vx: Math.cos(angle) * 15,
                vy: Math.sin(angle) * 15,
                radius: 5,
                damage: player.damage,
                color: player.color,
                hasLightning: player.hasLightning,
                isExplosive: player.hasExplosiveBullets
            });
            player.attackTimer = 0;
        }
    }

    // تحديث طلقات اللاعب
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        let b = playerBullets[i];
        b.x += b.vx;
        b.y += b.vy;

        if (b.x < 0 || b.x > world.width || b.y < 0 || b.y > world.height) {
            playerBullets.splice(i, 1);
            continue;
        }

        for (let j = enemies.length - 1; j >= 0; j--) {
            let e = enemies[j];
            let dist = Math.hypot(e.x - b.x, e.y - b.y);

            if (dist < e.radius + b.radius) {
                e.hp -= b.damage;

                if (b.isExplosive) {
                    playExplosionSound();
                    for (let k = 0; k < enemies.length; k++) {
                        let blastDist = Math.hypot(enemies[k].x - b.x, enemies[k].y - b.y);
                        if (blastDist < 90) {
                            enemies[k].hp -= b.damage * 0.6;
                        }
                    }
                    for (let p = 0; p < 10; p++) {
                        particles.push({
                            x: b.x,
                            y: b.y,
                            vx: (Math.random() - 0.5) * 8,
                            vy: (Math.random() - 0.5) * 8,
                            radius: 3.5,
                            color: '#ffaa00',
                            alpha: 1,
                            decay: 0.08
                        });
                    }
                }

                if (b.hasLightning) {
                    for (let k = 0; k < enemies.length; k++) {
                        if (k !== j) {
                            let chainDist = Math.hypot(enemies[k].x - e.x, enemies[k].y - e.y);
                            if (chainDist < 140) {
                                enemies[k].hp -= b.damage * 0.5;
                            }
                        }
                    }
                }

                for (let p = 0; p < 3; p++) {
                    particles.push({
                        x: b.x,
                        y: b.y,
                        vx: (Math.random() - 0.5) * 4,
                        vy: (Math.random() - 0.5) * 4,
                        radius: 2,
                        color: b.color,
                        alpha: 1,
                        decay: 0.1
                    });
                }

                playerBullets.splice(i, 1);
                break;
            }
        }
    }

    // توليد الموجات
    enemySpawnTimer++;
    if (enemySpawnTimer >= 6 && enemiesSpawnedInWave < enemiesInWaveToSpawn) {
        spawnEnemyHorde(2);
        enemiesSpawnedInWave += 2;
        enemySpawnTimer = 0;
    }

    document.getElementById('monsterCountText').innerText = `الوحوش: ${enemies.length}`;

    // مكافأة إنهاء الموجة بنجاح
    if (enemiesSpawnedInWave >= enemiesInWaveToSpawn && enemies.length === 0) {
        playUpgradeSound();
        currentWave++;
        const waveReward = 30 + (currentWave * 15);
        playerCoins += waveReward;
        earnedCoinsInSession += waveReward;
        saveGameData();
        updateUI();

        enemiesSpawnedInWave = 0;
        enemiesInWaveToSpawn = 60 + currentWave * 35;
        document.getElementById('waveText').innerText = `الموجة: ${currentWave}`;

        for (let p = 0; p < 30; p++) {
            particles.push({
                x: player.x + (Math.random() - 0.5) * 120,
                y: player.y + (Math.random() - 0.5) * 120,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                radius: 2 + Math.random() * 4,
                color: ['#ffd700', '#00f3ff', '#ff0055', '#00ff66'][Math.floor(Math.random() * 4)],
                alpha: 1,
                decay: 0.03 + Math.random() * 0.03
            });
        }
    }

    // تباعد أجساد الوحوش
    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            let e1 = enemies[i];
            let e2 = enemies[j];
            let dx = e2.x - e1.x;
            let dy = e2.y - e1.y;
            let dist = Math.hypot(dx, dy);
            let minDist = e1.radius + e2.radius + 4;

            if (dist < minDist && dist > 0) {
                let overlap = (minDist - dist) / 2;
                let nx = dx / dist;
                let ny = dy / dist;

                e1.x -= nx * overlap;
                e1.y -= ny * overlap;
                e2.x += nx * overlap;
                e2.y += ny * overlap;
            }
        }
    }

    // تحديث الكومبو
    if (comboCount > 0) {
        lastKillTime++;
        if (lastKillTime > comboResetTime) {
            comboCount = 0;
        }
    }

    // تحديث الأعداء
    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];

        if (e.frozenTimer > 0) {
            e.frozenTimer--;
        } else {
            let angle = Math.atan2(player.y - e.y, player.x - e.x);
            e.x += Math.cos(angle) * e.speed;
            e.y += Math.sin(angle) * e.speed;

            if (e.type === 'shooter') {
                e.shootTimer++;
                if (e.shootTimer >= 80) {
                    enemyBullets.push({
                        x: e.x,
                        y: e.y,
                        vx: Math.cos(angle) * 7,
                        vy: Math.sin(angle) * 7,
                        radius: 6,
                        damage: e.damage,
                        color: '#ff0055'
                    });
                    e.shootTimer = 0;
                }
            }
        }

        if (player.orbitalBladesCount > 0) {
            for (let b = 0; b < player.orbitalBladesCount; b++) {
                let bladeAngle = player.orbitalAngle + (b * (Math.PI * 2 / player.orbitalBladesCount));
                let bx = player.x + Math.cos(bladeAngle) * 70;
                let by = player.y + Math.sin(bladeAngle) * 70;

                let distToBlade = Math.hypot(e.x - bx, e.y - by);
                if (distToBlade < e.radius + 12) {
                    e.hp -= 3.0;
                }
            }
        }

        let distToPlayer = Math.hypot(player.x - e.x, player.y - e.y);
        if (distToPlayer < player.radius + e.radius) {
            if (player.invulnerableTimer <= 0) {
                takeDamage(e.damage);
                player.invulnerableTimer = 22;
            }
        }

        if (e.hp <= 0) {
            comboCount++;
            totalKills++;
            lastKillTime = 0;

            playExplosionSound();
            for (let p = 0; p < 6; p++) {
                particles.push({
                    x: e.x,
                    y: e.y,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    radius: 3,
                    color: e.color,
                    alpha: 1,
                    decay: 0.05
                });
            }

            let bonusCoins = 0;
            if (comboCount >= 10) {
                bonusCoins = Math.floor(comboCount / 5);
                playerCoins += bonusCoins;
                earnedCoinsInSession += bonusCoins;
                saveGameData();
                updateUI();
                for (let p = 0; p < 5; p++) {
                    particles.push({
                        x: e.x + (Math.random() - 0.5) * 30,
                        y: e.y + (Math.random() - 0.5) * 30,
                        vx: (Math.random() - 0.5) * 6,
                        vy: (Math.random() - 0.5) * 6,
                        radius: 2 + Math.random() * 2,
                        color: '#ffd700',
                        alpha: 1,
                        decay: 0.04
                    });
                }
            }

            xpOrbs.push({ x: e.x, y: e.y, value: 10 + (currentWave * 2) + (comboCount > 5 ? comboCount : 0),
                radius: 5 });

            if (Math.random() < 0.50) {
                coinOrbs.push({ x: e.x, y: e.y, value: Math.floor(Math.random() * 3) + 1, radius: 6 });
            }

            if (Math.random() < 0.08) {
                healthPacks.push({ x: e.x, y: e.y, healAmount: 20, radius: 8 });
            }

            enemies.splice(i, 1);
        }
    }

    // طلقات الأعداء
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        let eb = enemyBullets[i];
        eb.x += eb.vx;
        eb.y += eb.vy;

        if (eb.x < 0 || eb.x > world.width || eb.y < 0 || eb.y > world.height) {
            enemyBullets.splice(i, 1);
            continue;
        }

        let dist = Math.hypot(player.x - eb.x, player.y - eb.y);
        if (dist < player.radius + eb.radius) {
            if (player.invulnerableTimer <= 0) {
                takeDamage(eb.damage);
                player.invulnerableTimer = 18;
            }
            enemyBullets.splice(i, 1);
        }
    }

    // جمع الـ XP
    for (let i = xpOrbs.length - 1; i >= 0; i--) {
        let orb = xpOrbs[i];
        let dist = Math.hypot(player.x - orb.x, player.y - orb.y);

        if (dist < player.magnetRange) {
            let angle = Math.atan2(player.y - orb.y, player.x - orb.x);
            orb.x += Math.cos(angle) * 11;
            orb.y += Math.sin(angle) * 11;
        }

        if (dist < player.radius + orb.radius) {
            addXp(orb.value);
            xpOrbs.splice(i, 1);
        }
    }

    // جمع العملات 🪙
    for (let i = coinOrbs.length - 1; i >= 0; i--) {
        let coin = coinOrbs[i];
        let dist = Math.hypot(player.x - coin.x, player.y - coin.y);

        if (dist < player.magnetRange) {
            let angle = Math.atan2(player.y - coin.y, player.x - coin.x);
            coin.x += Math.cos(angle) * 12;
            coin.y += Math.sin(angle) * 12;
        }

        if (dist < player.radius + coin.radius) {
            playCoinSound();
            playerCoins += coin.value;
            earnedCoinsInSession += coin.value;
            saveGameData();
            updateUI();
            coinOrbs.splice(i, 1);
        }
    }

    // جمع الصحة
    for (let i = healthPacks.length - 1; i >= 0; i--) {
        let hpBox = healthPacks[i];
        let dist = Math.hypot(player.x - hpBox.x, player.y - hpBox.y);

        if (dist < 120) {
            let angle = Math.atan2(player.y - hpBox.y, player.x - hpBox.x);
            hpBox.x += Math.cos(angle) * 8;
            hpBox.y += Math.sin(angle) * 8;
        }

        if (dist < player.radius + hpBox.radius) {
            playUpgradeSound();
            player.hp = Math.min(player.maxHp, player.hp + hpBox.healAmount);
            document.getElementById('healthBar').style.width = `${(player.hp / player.maxHp) * 100}%`;
            healthPacks.splice(i, 1);
        }
    }

    // جزيئات مستوى الترقية
    for (let i = levelUpParticles.length - 1; i >= 0; i--) {
        let lp = levelUpParticles[i];
        lp.x += lp.vx;
        lp.y += lp.vy;
        lp.alpha -= lp.decay;
        lp.radius *= 0.98;
        if (lp.alpha <= 0 || lp.radius < 0.5) levelUpParticles.splice(i, 1);
    }

    // الجزيئات
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) particles.splice(i, 1);
    }
}

function takeDamage(amount) {
    playHitSound();

    if (player.shieldActive) {
        player.shieldActive = false;
        player.shieldTimer = 0;
        for (let p = 0; p < 12; p++) {
            particles.push({
                x: player.x,
                y: player.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                radius: 3,
                color: '#00f3ff',
                alpha: 1,
                decay: 0.05
            });
        }
        return;
    }

    player.hp -= amount;
    if (player.hp < 0) player.hp = 0;

    document.getElementById('healthBar').style.width = `${(player.hp / player.maxHp) * 100}%`;

    canvas.style.transform = 'translate(6px, 6px)';
    setTimeout(() => { canvas.style.transform = 'translate(0, 0)'; }, 50);

    if (player.hp <= 0) {
        triggerGameOver();
    }
}

function addXp(amount) {
    player.xp += amount;

    while (player.xp >= player.xpToNextLevel) {
        player.xp -= player.xpToNextLevel;
        player.level++;
        // جعل تطور المستوى أصعب: معامل 2.5 وسقف 80000
        player.xpToNextLevel = Math.min(80000, Math.floor(player.xpToNextLevel * 2.5));

        playUpgradeSound();

        for (let p = 0; p < 40; p++) {
            levelUpParticles.push({
                x: player.x + (Math.random() - 0.5) * 80,
                y: player.y + (Math.random() - 0.5) * 80,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                radius: 2 + Math.random() * 5,
                color: ['#ffd700', '#00f3ff', '#ff00ff', '#00ff66'][Math.floor(Math.random() * 4)],
                alpha: 1,
                decay: 0.02 + Math.random() * 0.02
            });
        }

        openUpgradeModal();
    }

    document.getElementById('xpBar').style.width = `${(player.xp / player.xpToNextLevel) * 100}%`;
    document.getElementById('xpText').innerText = `${player.xp} / ${player.xpToNextLevel} XP`;
    document.getElementById('levelText').innerText = `⭐ المستوى: ${player.level}`;
}

function openUpgradeModal() {
    gameState = 'PAUSED';
    const modal = document.getElementById('upgradeModal');
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';

    const shuffled = [...availableUpgrades].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    selected.forEach(upgrade => {
        const card = document.createElement('div');
        card.className = 'upgrade-card';
        card.innerHTML = `
            <div class="card-icon">${upgrade.icon}</div>
            <div class="card-title">${upgrade.title}</div>
            <div class="card-desc">${upgrade.desc}</div>
        `;
        card.onclick = () => {
            playUpgradeSound();
            upgrade.action();
            modal.style.display = 'none';
            gameState = 'PLAYING';
            updateUI();
        };
        container.appendChild(card);
    });

    modal.style.display = 'flex';
}

function skipUpgrade() {
    const modal = document.getElementById('upgradeModal');
    modal.style.display = 'none';
    gameState = 'PLAYING';
    const skipBonus = 15 + (currentWave * 2);
    playerCoins += skipBonus;
    earnedCoinsInSession += skipBonus;
    saveGameData();
    updateUI();
    for (let p = 0; p < 12; p++) {
        particles.push({
            x: player.x + (Math.random() - 0.5) * 60,
            y: player.y + (Math.random() - 0.5) * 60,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            radius: 2 + Math.random() * 3,
            color: '#ffd700',
            alpha: 1,
            decay: 0.05
        });
    }
}

function triggerGameOver() {
    gameState = 'GAMEOVER';
    saveGameData();
    document.getElementById('finalScoreText').innerText =
        `صمدت حتى الموجة: ${currentWave} | مستوى النينجا: ${player.level} | 💀 ${totalKills} قتلى`;
    document.getElementById('gainedCoinsText').innerText = `العملات المكتسبة هذه الجولة: 🪙 +${earnedCoinsInSession}`;
    document.getElementById('gameOverModal').style.display = 'flex';
}

function restartGameDirectly() {
    initAudio();
    player.hp = player.maxHp;
    player.xp = 0;
    player.level = 1;
    player.xpToNextLevel = 400;
    player.x = world.width / 2;
    player.y = world.height / 2;
    player.orbitalBladesCount = 1;
    player.hasLightning = false;
    player.hasShield = false;
    player.shieldActive = false;
    player.hasFreezeNova = false;
    player.magnetRange = 150;
    player.hasExplosiveBullets = false;
    player.attackSpeed = 12;
    player.damage = 42;
    player.color = getActiveSkinColor();
    totalKills = 0;
    comboCount = 0;
    lastKillTime = 0;

    currentWave = 1;
    enemiesInWaveToSpawn = 60;
    enemiesSpawnedInWave = 0;
    earnedCoinsInSession = 0;

    enemies = [];
    playerBullets = [];
    enemyBullets = [];
    xpOrbs = [];
    coinOrbs = [];
    healthPacks = [];
    particles = [];
    freezeWaves = [];
    levelUpParticles = [];

    document.getElementById('healthBar').style.width = '100%';
    document.getElementById('xpBar').style.width = '0%';
    document.getElementById('waveText').innerText = 'الموجة: 1';
    document.getElementById('xpText').innerText = `0 / ${player.xpToNextLevel} XP`;
    document.getElementById('levelText').innerText = `⭐ المستوى: 1`;

    document.getElementById('gameOverModal').style.display = 'none';
    document.getElementById('mainMenuModal').style.display = 'none';
    document.getElementById('hud').style.display = 'flex';
    document.getElementById('joystickContainer').style.display = 'block';
    document.getElementById('btnDash').style.display = 'flex';
    document.getElementById('minimapCanvas').style.display = 'block';

    gameState = 'PLAYING';
    updateUI();
}

function returnToMainMenu() {
    initAudio();
    document.getElementById('gameOverModal').style.display = 'none';
    document.getElementById('hud').style.display = 'none';
    document.getElementById('joystickContainer').style.display = 'none';
    document.getElementById('btnDash').style.display = 'none';
    document.getElementById('minimapCanvas').style.display = 'none';
    document.getElementById('mainMenuModal').style.display = 'flex';

    gameState = 'MENU';
    updateUI();
}

function drawEnemyVisuals(e) {
    let angle = Math.atan2(player.y - e.y, player.x - e.x);

    ctx.save();
    ctx.translate(e.x, e.y);

    let drawColor = e.frozenTimer > 0 ? '#00e1ff' : e.color;

    if (e.type === 'chaser') {
        ctx.rotate(angle);
        ctx.fillStyle = drawColor;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.shadowColor = drawColor;
        ctx.shadowBlur = 18;

        ctx.beginPath();
        let spikes = 8;
        for (let s = 0; s < spikes; s++) {
            let a = (s * Math.PI * 2) / spikes;
            let r = s % 2 === 0 ? e.radius * 1.2 : e.radius * 0.55;
            let px = Math.cos(a) * r;
            let py = Math.sin(a) * r;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, e.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

    } else if (e.type === 'fast') {
        ctx.rotate(angle);
        ctx.fillStyle = drawColor;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.shadowColor = drawColor;
        ctx.shadowBlur = 20;

        ctx.beginPath();
        ctx.moveTo(e.radius * 1.6, 0);
        ctx.lineTo(-e.radius * 1.0, -e.radius * 0.9);
        ctx.lineTo(-e.radius * 0.3, 0);
        ctx.lineTo(-e.radius * 1.0, e.radius * 0.9);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(-e.radius * 0.7, 0, e.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();

    } else if (e.type === 'shooter') {
        ctx.fillStyle = drawColor;
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = drawColor;
        ctx.shadowBlur = 16;

        let rot = Date.now() * 0.004;
        ctx.beginPath();
        for (let h = 0; h < 6; h++) {
            let ha = rot + (h * Math.PI / 3);
            let hx = Math.cos(ha) * e.radius;
            let hy = Math.sin(ha) * e.radius;
            if (h === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.rotate(angle);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, -3.5, e.radius * 1.3, 7);

        ctx.fillStyle = '#ff0055';
        ctx.beginPath();
        ctx.arc(0, 0, e.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

    } else if (e.type === 'tank') {
        ctx.rotate(angle);
        ctx.fillStyle = '#1e1b4b';
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = 3;
        ctx.shadowColor = drawColor;
        ctx.shadowBlur = 22;

        ctx.beginPath();
        let octSides = 8;
        for (let os = 0; os < octSides; os++) {
            let oa = (os * Math.PI * 2) / octSides;
            let ox = Math.cos(oa) * e.radius;
            let oy = Math.sin(oa) * e.radius;
            if (os === 0) ctx.moveTo(ox, oy);
            else ctx.lineTo(ox, oy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        let pulse = Math.sin(Date.now() * 0.009) * 4;
        ctx.fillStyle = drawColor;
        ctx.beginPath();
        ctx.arc(0, 0, (e.radius * 0.45) + pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(-e.radius * 0.4, -e.radius * 0.4, e.radius * 0.8, e.radius * 0.8);
    }

    if (e.hp < e.maxHp) {
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillRect(-15, -e.radius - 12, 30, 4);
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(-15, -e.radius - 12, (e.hp / e.maxHp) * 30, 4);
    }

    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'MENU' || gameState === 'SHOP') {
        return;
    }

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // شبكة العالم
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 80;
    for (let x = 0; x <= world.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, world.height);
        ctx.stroke();
    }
    for (let y = 0; y <= world.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(world.width, y);
        ctx.stroke();
    }

    // حدود الخريطة
    ctx.strokeStyle = '#ff0055';
    ctx.lineWidth = 8;
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 20;
    ctx.strokeRect(0, 0, world.width, world.height);
    ctx.shadowBlur = 0;

    // موجات الصقيع
    for (let wave of freezeWaves) {
        ctx.save();
        ctx.strokeStyle = `rgba(0, 243, 255, ${wave.alpha})`;
        ctx.lineWidth = 4;
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    // حزم الصحة
    for (let hpBox of healthPacks) {
        ctx.save();
        ctx.fillStyle = '#00ffaa';
        ctx.shadowColor = '#00ffaa';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(hpBox.x, hpBox.y, hpBox.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // رسم العملات 🪙
    for (let coin of coinOrbs) {
        ctx.save();
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🪙', coin.x, coin.y);
        ctx.restore();
    }

    // كريستالات الخبرة
    for (let orb of xpOrbs) {
        ctx.save();
        ctx.fillStyle = '#ffe600';
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // جزيئات مستوى الترقية
    for (let lp of levelUpParticles) {
        ctx.save();
        ctx.globalAlpha = lp.alpha;
        ctx.fillStyle = lp.color;
        ctx.shadowColor = lp.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(lp.x, lp.y, lp.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // الجزيئات
    for (let p of particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // طلقات النينجا
    for (let b of playerBullets) {
        ctx.save();
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // طلقات الأعداء
    for (let eb of enemyBullets) {
        ctx.save();
        ctx.fillStyle = eb.color;
        ctx.shadowColor = eb.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(eb.x, eb.y, eb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // الوحوش
    for (let e of enemies) {
        drawEnemyVisuals(e);
    }

    // مسار الشبح
    for (let t of player.trailHistory) {
        ctx.save();
        ctx.globalAlpha = t.alpha;
        ctx.fillStyle = player.color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, player.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // النينجا
    ctx.save();
    ctx.fillStyle = player.color;
    ctx.shadowColor = player.color;
    ctx.shadowBlur = player.invulnerableTimer > 0 ? 30 : 18;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();

    // درع الطاقة
    if (player.shieldActive) {
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 8, 0, Math.PI * 2);
        ctx.stroke();
    }

    // عين النينجا
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(player.x + 4, player.y - 2, 3, 0, Math.PI * 2);
    ctx.fill();

    // الشفرات الدوارة
    if (player.orbitalBladesCount > 0) {
        for (let b = 0; b < player.orbitalBladesCount; b++) {
            let angle = player.orbitalAngle + (b * (Math.PI * 2 / player.orbitalBladesCount));
            let bx = player.x + Math.cos(angle) * 70;
            let by = player.y + Math.sin(angle) * 70;

            ctx.fillStyle = player.color;
            ctx.shadowColor = player.color;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(bx, by, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // عرض الكومبو على الشاشة
    if (comboCount >= 3) {
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 20px sans-serif';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 15;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`🔥 ${comboCount}x COMBO`, player.x, player.y - 40);
        ctx.shadowBlur = 0;
    }

    ctx.restore();

    ctx.restore();

    drawMinimap();
}

function drawMinimap() {
    miniCtx.clearRect(0, 0, miniCanvas.width, miniCanvas.height);

    const scaleX = miniCanvas.width / world.width;
    const scaleY = miniCanvas.height / world.height;

    miniCtx.fillStyle = player.color;
    miniCtx.beginPath();
    miniCtx.arc(player.x * scaleX, player.y * scaleY, 3.5, 0, Math.PI * 2);
    miniCtx.fill();

    miniCtx.fillStyle = '#ff0055';
    for (let e of enemies) {
        miniCtx.beginPath();
        miniCtx.arc(e.x * scaleX, e.y * scaleY, 1.5, 0, Math.PI * 2);
        miniCtx.fill();
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();