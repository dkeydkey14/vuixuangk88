// Countdown Timer (chỉ chạy nếu có element #countdown)
function updateCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    let time = countdownElement.textContent.split(':');
    let hours = parseInt(time[0]);
    let minutes = parseInt(time[1]);
    let seconds = parseInt(time[2]);

    seconds--;
    if (seconds < 0) {
        seconds = 59;
        minutes--;
        if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
                hours = 23;
            }
        }
    }

    countdownElement.textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

setInterval(updateCountdown, 1000);

// Number Input Handling
const numberInputs = document.querySelectorAll('.number-input');
const numberCircles = document.querySelectorAll('.number-circle');

numberInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value;

        if (value && index < numberInputs.length - 1) {
            numberInputs[index + 1].focus();
        }

        updateActiveCircle();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            numberInputs[index - 1].focus();
        }
    });

    input.addEventListener('focus', () => {
        updateActiveCircle();
    });
});

function updateActiveCircle() {
    numberCircles.forEach((circle, index) => {
        if (document.activeElement === numberInputs[index]) {
            circle.classList.add('active');
        } else {
            circle.classList.remove('active');
        }
    });
}

// ========== POPUP ==========
const popupOverlay = document.getElementById('popup-overlay');
const popupBox = document.getElementById('popup-box');
const popupMessage = document.getElementById('popup-message');
const popupIcon = document.getElementById('popup-icon');
const popupClose = document.getElementById('popup-close');
const fireworksCanvas = document.getElementById('fireworks-canvas');

function showPopup(type, message) {
    if (!popupOverlay || !popupBox) return;
    popupBox.className = 'popup-box ' + type;
    popupIcon.textContent = type === 'success' ? '🎉' : type === 'error' ? '⚠️' : '💬';
    popupMessage.textContent = message || (type === 'success' ? 'Thành công' : 'Đã xảy ra lỗi.');
    popupOverlay.classList.add('is-open');
    popupOverlay.setAttribute('aria-hidden', 'false');
    if (type === 'success') startFireworks();
}

function closePopup() {
    if (!popupOverlay) return;
    popupOverlay.classList.remove('is-open');
    popupOverlay.setAttribute('aria-hidden', 'true');
    stopFireworks();
}

if (popupClose) popupClose.addEventListener('click', closePopup);
if (popupOverlay) {
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) closePopup();
    });
}

// Pháo hoa (chỉ khi thành công)
let fireworksRAF = null;
const FIREWORK_COLORS = ['#FFD700', '#FF6B35', '#00FF88', '#FF1493', '#00BFFF', '#FFE135'];

function startFireworks() {
    const canvas = fireworksCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function sizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    const removeResize = () => window.removeEventListener('resize', sizeCanvas);
    setTimeout(removeResize, 8000);
    const particles = [];
    let burstCount = 0;
    const maxBursts = 8;
    const burstInterval = 280;

    function createBurst() {
        const x = canvas.width * (0.2 + Math.random() * 0.6);
        const y = canvas.height * (0.25 + Math.random() * 0.35);
        const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
        const count = 45 + Math.floor(Math.random() * 25);
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const speed = 3 + Math.random() * 5;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                life: 1,
                decay: 0.012 + Math.random() * 0.01,
                size: 2 + Math.random() * 2
            });
        }
    }

    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.12;
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.life -= p.decay;
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        if (burstCount < maxBursts || particles.length > 0) {
            fireworksRAF = requestAnimationFrame(animate);
        }
    }

    const scheduleBursts = () => {
        createBurst();
        burstCount++;
        if (burstCount < maxBursts) setTimeout(scheduleBursts, burstInterval);
    };
    scheduleBursts();
    animate();
}

function stopFireworks() {
    if (fireworksRAF) {
        cancelAnimationFrame(fireworksRAF);
        fireworksRAF = null;
    }
    const canvas = fireworksCanvas;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Sự kiện bắt đầu: 11:00 ngày 15/02/2026 giờ Việt Nam (UTC+7)
// 11:00 UTC+7 = 04:00 UTC
const EVENT_START_DATE = new Date(Date.UTC(2026, 1, 15, 4, 0, 0));

function isEventStarted() {
    return Date.now() >= EVENT_START_DATE.getTime();
}

// API auto-approve
const API_URL = 'https://xuan03.dklive6886.dev/api/admin/auto-approve';

// Confirm Button
const confirmBtn = document.querySelector('.confirm-btn');
const accountInput = document.querySelector('.account-input');

function setConfirmLoading(loading) {
    if (!confirmBtn) return;
    confirmBtn.disabled = loading;
    confirmBtn.style.pointerEvents = loading ? 'none' : '';
    confirmBtn.setAttribute('data-loading', loading ? '1' : '0');
}

function resetForm() {
    if (accountInput) accountInput.value = '';
    numberInputs.forEach(input => { input.value = ''; });
    if (accountInput) accountInput.focus();
}

confirmBtn.addEventListener('click', async () => {
    const account = accountInput?.value.trim() || '';
    const numbers = Array.from(numberInputs).map(input => input.value).join('');
    
    if (!account) {
        showPopup('warning', 'Vui lòng nhập tài khoản!');
        if (accountInput) accountInput.focus();
        return;
    }
    
    if (numbers.length !== 4) {
        showPopup('warning', 'Vui lòng nhập đủ 4 số đuôi tài khoản!');
        if (numberInputs[0]) numberInputs[0].focus();
        return;
    }

    if (!isEventStarted()) {
        showPopup('warning', 'Sự kiện chưa bắt đầu!\n\nBắt đầu từ 11:00 ngày 15/02/2026 (giờ Việt Nam).');
        return;
    }

    setConfirmLoading(true);
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: account,
                bankAccount: numbers
            })
        });
        const data = await res.json().catch(() => ({}));
        
        if (data.success === true && data.approved === true) {
            showPopup('success', data.message || 'Thành công');
            resetForm();
        } else {
            showPopup('error', data.message || 'Nhận khuyến mãi thất bại, vui lòng liên hệ CSKH.');
        }
    } catch (err) {
        showPopup('error', 'Lỗi kết nối. Vui lòng thử lại sau.');
    } finally {
        setConfirmLoading(false);
    }
});

// Initialize first input focus
window.addEventListener('load', () => {
    if (accountInput) accountInput.focus();
});

