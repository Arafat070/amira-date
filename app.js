

/* ==========================================================
   НАСТРОЙКИ — ИЗМЕНИ ПОД СЕБЯ
   ========================================================== */

// Telegram (необязательно — оставь пустым, если не нужно)
const TELEGRAM_BOT_TOKEN = "8307359275:AAEAG4xg-Db4HYw4dTGQ7HeF4MGLCXr7nMo";
const TELEGRAM_CHAT_ID = "992638774";

// WhatsApp (запасной вариант)
const YOUR_PHONE = "79991234567";

// Дата свидания
const DATE_CONFIG = {
    autoFindSaturday: true,
    custom: new Date(2026, 0, 15, 20, 0, 0)
};

/* ==========================================================
   БАЗОВАЯ ИНИЦИАЛИЗАЦИЯ
   ========================================================== */

// Скрываем прелоадер сразу + на всякий случай через 2.5 сек
function hidePreloader() {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hide');
}

window.addEventListener('load', () => {
    setTimeout(hidePreloader, 800);
});

// Резервная защита — если что-то сломалось, всё равно скроем
setTimeout(hidePreloader, 2500);

// ---------- Дата свидания ----------
function getDateInfo() {
    if (!DATE_CONFIG.autoFindSaturday) return DATE_CONFIG.custom;
    const now = new Date();
    const day = now.getDay();
    const daysUntilSat = (6 - day + 7) % 7 || 7;
    const sat = new Date(now);
    sat.setDate(now.getDate() + daysUntilSat);
    sat.setHours(20, 0, 0, 0);
    return sat;
}

const DATE_OF_DATE = getDateInfo();

// ---------- Плавающие сердечки ----------
function startFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    if (!container) return;
    const emojis = ['💖', '💕', '❤️', '💗', '💓', '🌸', '✨', '💝'];
    setInterval(() => {
        if (container.children.length > 15) return;
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (14 + Math.random() * 18) + 'px';
        heart.style.animationDuration = (8 + Math.random() * 8) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 18000);
    }, 900);
}

setTimeout(startFloatingHearts, 1500);

// ---------- Музыка (Web Audio API) ----------
const musicBtn = document.getElementById('musicBtn');
let audioCtx = null;
let musicPlaying = false;
let musicGain = null;
let musicInterval = null;

function playRomanticMusic() {
    try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        musicGain = audioCtx.createGain();
        musicGain.gain.value = 0.07;
        musicGain.connect(audioCtx.destination);

        const notes = [
            523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 587.33,
            523.25, 587.33, 659.25, 523.25, 493.88, 440.00, 392.00, 440.00
        ];
        const duration = 0.7;

        function scheduleLoop() {
            if (!musicPlaying) return;
            let time = audioCtx.currentTime + 0.1;
            notes.forEach(freq => {
                const osc = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                g.gain.setValueAtTime(0, time);
                g.gain.linearRampToValueAtTime(0.15, time + 0.05);
                g.gain.exponentialRampToValueAtTime(0.001, time + duration);
                osc.connect(g);
                g.connect(musicGain);
                osc.start(time);
                osc.stop(time + duration);
                time += duration;
            });
        }

        scheduleLoop();
        musicInterval = setInterval(scheduleLoop, notes.length * duration * 1000);
    } catch (e) {
        console.log('Audio error:', e);
    }
}

function stopRomanticMusic() {
    musicPlaying = false;
    if (musicInterval) clearInterval(musicInterval);
    if (musicGain && audioCtx) {
        try {
            musicGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4);
            setTimeout(() => { try { musicGain.disconnect(); } catch(e){} }, 500);
        } catch(e) {}
    }
}

if (musicBtn) {
    musicBtn.addEventListener('click', () => {
        musicPlaying = !musicPlaying;
        if (musicPlaying) {
            musicBtn.classList.add('playing');
            playRomanticMusic();
        } else {
            musicBtn.classList.remove('playing');
            stopRomanticMusic();
        }
    });
}

// ---------- Переключение экранов ----------
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('active');
        el.scrollTop = 0;
        window.scrollTo(0, 0);
    }
}

// ---------- Убегающая кнопка НЕТ ----------
const btnNo = document.getElementById('btnNo');
const btnYes = document.getElementById('btnYes');

let noCount = 0;
const noTexts = [
    "Нет",
    "Точно нет?",
    "Подумай ещё 🥺",
    "Уверена?",
    "Не получится 😜",
    "Кнопка сломалась",
    "Попробуй ещё раз 😄",
    "Ни за что!",
    "Только «Да» 💖",
    "Ну пожалуйста 🙏",
    "Я буду скучать 🥺"
];

function moveNoButton() {
    if (!btnNo) return;
    const btnWidth = btnNo.offsetWidth || 100;
    const btnHeight = btnNo.offsetHeight || 55;
    const padding = 15;
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;

    const x = padding + Math.random() * Math.max(maxX - padding, 10);
    const y = padding + Math.random() * Math.max(maxY - padding, 10);

    btnNo.style.position = 'fixed';
    btnNo.style.left = x + 'px';
    btnNo.style.top = y + 'px';
    btnNo.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;

    noCount++;
    btnNo.textContent = noTexts[Math.min(noCount, noTexts.length - 1)];

    if (btnYes) {
        const grow = Math.min(1 + noCount * 0.08, 1.6);
        btnYes.style.transform = `scale(${grow})`;
    }
}

if (btnNo) {
    btnNo.addEventListener('mouseenter', moveNoButton);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    }, { passive: false });
    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoButton();
    });
}

// ---------- Кнопка ДА ----------
if (btnYes) {
    btnYes.addEventListener('click', () => {
        sendNotification();
        createHeartBurst();
        updateDateDisplay();
        startCountdown();
        showScreen('screen2');
    });
}

// ---------- Дата на экране 2 ----------
function updateDateDisplay() {
    const el = document.getElementById('dateValue');
    if (!el) return;
    const months = ['января','февраля','марта','апреля','мая','июня',
        'июля','августа','сентября','октября','ноября','декабря'];
    const d = DATE_OF_DATE;
    el.textContent = `Суббота, ${d.getDate()} ${months[d.getMonth()]}, ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

// ---------- Обратный отсчёт ----------
let countdownInterval = null;

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);

    function tick() {
        const now = new Date().getTime();
        const diff = DATE_OF_DATE.getTime() - now;

        const elD = document.getElementById('days');
        const elH = document.getElementById('hours');
        const elM = document.getElementById('minutes');
        const elS = document.getElementById('seconds');
        if (!elD) return;

        if (diff <= 0) {
            elD.textContent = '00';
            elH.textContent = '00';
            elM.textContent = '00';
            elS.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        elD.textContent = String(days).padStart(2, '0');
        elH.textContent = String(hours).padStart(2, '0');
        elM.textContent = String(minutes).padStart(2, '0');
        elS.textContent = String(seconds).padStart(2, '0');
    }

    tick();
    countdownInterval = setInterval(tick, 1000);
}

// ---------- Кнопка Дальше (экран 2 -> 3) ----------
const btnNext = document.getElementById('btnNext');
if (btnNext) {
    btnNext.addEventListener('click', () => showScreen('screen3'));
}

// ---------- Кнопка Дальше (экран 3 -> 4) ----------
const btnNext2 = document.getElementById('btnNext2');
if (btnNext2) {
    btnNext2.addEventListener('click', () => {
        showScreen('screen4');
        startTyping();
    });
}

// ---------- Галерея (модалка) ----------
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img && modal && modalImg) {
            modalImg.src = img.src;
            modal.classList.add('show');
        }
    });
});

if (modalClose) {
    modalClose.addEventListener('click', () => modal.classList.remove('show'));
}
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
    });
}

// ---------- Печатающийся текст ----------
const TYPING_TEXT =
    `Ты — самое прекрасное, что случилось со мной.
Каждый день с тобой — это маленькое чудо.
Твоя улыбка освещает всё вокруг, а голос —
моя любимая мелодия.

Я очень хочу провести с тобой этот вечер
и подарить тебе столько счастья, сколько смогу.
Буду ждать нашей встречи с нетерпением! 🥰`;

let typingStarted = false;

function startTyping() {
    if (typingStarted) return;
    typingStarted = true;

    const textEl = document.getElementById('typingText');
    const cursor = document.getElementById('cursor');
    const btnFinal = document.getElementById('btnFinal');
    if (!textEl) return;

    let i = 0;
    textEl.textContent = '';

    function type() {
        if (i < TYPING_TEXT.length) {
            textEl.textContent += TYPING_TEXT.charAt(i);
            i++;
            const delay = TYPING_TEXT.charAt(i-1) === '\n' ? 350 : 45;
            setTimeout(type, delay);
        } else {
            if (cursor) cursor.classList.add('hide');
            if (btnFinal) btnFinal.style.display = 'inline-block';
        }
    }
    type();
}

// ---------- Финальная кнопка ----------
const btnFinal = document.getElementById('btnFinal');
if (btnFinal) {
    btnFinal.addEventListener('click', () => {
        createHeartBurst();
        updateFinalDate();
        showScreen('screen5');
    });
}

function updateFinalDate() {
    const el = document.getElementById('finalDate');
    if (!el) return;
    const months = ['января','февраля','марта','апреля','мая','июня',
        'июля','августа','сентября','октября','ноября','декабря'];
    const d = DATE_OF_DATE;
    el.textContent = `До встречи в субботу, ${d.getDate()} ${months[d.getMonth()]}, в 20:00 😘`;
}

// ---------- Письмо от Амиры ----------
const letterInput = document.getElementById('letterInput');
const letterCount = document.getElementById('letterCount');
const letterStatus = document.getElementById('letterStatus');
const btnSendLetter = document.getElementById('btnSendLetter');

// Счётчик символов
if (letterInput && letterCount) {
    letterInput.addEventListener('input', () => {
        const len = letterInput.value.length;
        letterCount.textContent = len;
        const counter = letterCount.parentElement;
        counter.classList.toggle('warn', len > 450);
    });
}

// Отправка письма
if (btnSendLetter) {
    btnSendLetter.addEventListener('click', async () => {
        const text = letterInput.value.trim();

        // Проверка: пустое письмо?
        if (!text) {
            letterStatus.textContent = 'Напиши хоть что-нибудь 🥺';
            letterStatus.className = 'letter-status error';
            letterInput.focus();
            return;
        }

        // Блокируем кнопку на время отправки
        btnSendLetter.disabled = true;
        btnSendLetter.textContent = 'Отправляю... ⏳';
        letterStatus.textContent = '';

        // Формируем красивое сообщение
        const message =
            `💌 ПИСЬМО ОТ АМИРЫ 💌\n\n` +
            `${text}\n\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `📅 ${new Date().toLocaleString('ru-RU')}`;

        let success = false;

        // Отправляем в Telegram
        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
            try {
                const res = await fetch(
                    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: TELEGRAM_CHAT_ID,
                            text: message
                        })
                    }
                );
                const data = await res.json();
                success = data.ok === true;
            } catch (e) {
                console.log('Ошибка отправки:', e);
            }
        }

        if (success) {
            letterStatus.textContent = '💖 Письмо отправлено! Спасибо, любимая!';
            letterStatus.className = 'letter-status success';
            btnSendLetter.textContent = 'Отправлено ✅';
            letterInput.disabled = true;
            createHeartBurst();

            // Скрываем статус через 4 секунды (по желанию)
            setTimeout(() => {
                letterStatus.textContent = 'Он уже читает твоё письмо 💕';
            }, 4000);
        } else {
            letterStatus.textContent = 'Не удалось отправить. Попробуй ещё раз 😢';
            letterStatus.className = 'letter-status error';
            btnSendLetter.disabled = false;
            btnSendLetter.textContent = 'Отправить письмо 💘';
        }

        // Дублируем в консоль
        console.log('%c💌 ПИСЬМО ОТ АМИРЫ:', 'color:#e91e63; font-size:16px; font-weight:bold;');
        console.log(text);
    });
}
// ---------- Взрыв сердечек ----------
function createHeartBurst() {
    const emojis = ['💖', '💕', '❤️', '💗', '💓', '🌹', '✨'];
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}vw;
            top: 100vh;
            font-size: ${18 + Math.random() * 26}px;
            pointer-events: none;
            z-index: 9999;
            transition: transform ${1.5 + Math.random() * 1.5}s ease-out,
                        opacity ${1.5 + Math.random() * 1.5}s ease-out;
        `;
        document.body.appendChild(heart);
        requestAnimationFrame(() => {
            heart.style.transform = `translateY(-${100 + Math.random() * 40}vh)
                                     translateX(${Math.random() * 120 - 60}px)
                                     rotate(${Math.random() * 360}deg)`;
            heart.style.opacity = '0';
        });
        setTimeout(() => heart.remove(), 3200);
    }
}

// ---------- Отправка уведомления тебе ----------
async function sendNotification() {
    const message = `💖 Амира ответила ДА! Она пойдёт на свидание!\nВремя: ${new Date().toLocaleString('ru-RU')}`;

    // Telegram (если настроен)
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
            });
        } catch(e) { console.log('TG error', e); }
    }

    // Локально в консоль (чтобы ты видел ответ)
    console.log('%c💌 АМИРА ОТВЕТИЛА ДА!', 'color:#e91e63; font-size:20px; font-weight:bold;');
    console.log('Время:', new Date().toLocaleString());
}

// ---------- Инициализация ----------
updateDateDisplay();