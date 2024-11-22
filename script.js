// Typewriter effect
const messages = [
    /iPad|iPhone|iPod/.test(navigator.userAgent) ? 'Tap to start' : 'Press F11 or click anywhere to enter fullscreen',
    /iPad|iPhone|iPod/.test(navigator.userAgent) ? 'Add to Home Screen for best experience' : 'Press ESC to exit fullscreen'
];

const typewriterText = document.querySelector('.typewriter-text');
const typewriterText2 = document.querySelector('.typewriter-text-2');
const cursor = document.querySelector('.cursor');
let currentMessageIndex = 0;
let currentCharIndex = 0;
let isTyping = false;
let typewriterTimeout = null;
let typewriterCallbacks = [];

function clearTypewriterTimeouts() {
    if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
        typewriterTimeout = null;
    }
    typewriterCallbacks.forEach(timeout => clearTimeout(timeout));
    typewriterCallbacks = [];
}

function resetTypewriter() {
    clearTypewriterTimeouts();
    typewriterText.textContent = '';
    typewriterText2.textContent = '';
    currentCharIndex = 0;
    isTyping = false;
    typewriterText.classList.remove('typing');
    typewriterText2.classList.remove('typing');
}

function typeWriter(element, message, callback) {
    if (!element || isTyping === false) return;
    
    if (currentCharIndex < message.length) {
        element.textContent = message.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typewriterTimeout = setTimeout(() => typeWriter(element, message, callback), 50);
    } else {
        currentCharIndex = 0;
        if (callback) {
            const timeout = setTimeout(callback, 500);
            typewriterCallbacks.push(timeout);
        }
    }
}

function startTypewriter() {
    if (!isTyping) {
        resetTypewriter();
        isTyping = true;
        typewriterText.classList.add('typing');
        typeWriter(typewriterText, messages[0], () => {
            if (isTyping) {
                typewriterText2.classList.add('typing');
                typeWriter(typewriterText2, messages[1], () => {
                    isTyping = false;
                });
            }
        });
    }
}

// Start typewriter effect immediately
startTypewriter();

// Fullscreen functionality
const fullscreenMessage = document.getElementById('fullscreenMessage');
const clockWrapper = document.getElementById('clockWrapper');

// iOS detection
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Prevent iOS scroll/bounce effects
document.body.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

// Handle iOS orientation changes
window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 50);
    if (isIOS) {
        // Force a re-render on orientation change
        window.scrollTo(0, 0);
    }
});

// Screen wake lock functionality
let wakeLock = null;
let noSleepVideo = null;

async function keepScreenAwake() {
    try {
        // Method 1: Wake Lock API
        if ('wakeLock' in navigator) {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
            } catch (err) {
                console.log('Wake Lock API failed:', err);
            }
        }

        // Method 2: Video loop method (especially for iOS)
        if (!noSleepVideo) {
            noSleepVideo = document.createElement('video');
            noSleepVideo.setAttribute('playsinline', '');
            noSleepVideo.setAttribute('src', 'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAAAAG1wNDJtcDQxaXNvbWF2YzEAAATKbW9vdgAAAGxtdmhkAAAAANLEP5XSxD+VAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAP4AABUcWF2YWMAAAAwZ2F2Y0AAAAMPH4sIAAAABBxAREzHRwAB4kSAAAADHEFEzMdwAAHiRAAAABBkbXJvdgAAAAAAAAAAAAAAAAAAAAAAAAAAAHIAAAAYc3R0cwAAAAAAAAABAAAAQgAAQAAAAAAUc3RzcwAAAAAAAAABAAAAAQAAABxzdHNjAAAAAAAAAAEAAAABAAAAQAAAAAEAAAEgAAAAHHN0c3oAAAAAAAAAAAAAAEAAAADRAAABFAAAABRzdGNvAAAAAAAAAAEAAAAsAAAAYnVkdGEAAABabWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAtaWxzdAAAACWpdG9vAAAAHWRhdGEAAAABAAAAAExhdmY1OC40NS4xMDA=');
            noSleepVideo.loop = true;
            noSleepVideo.muted = true;
            noSleepVideo.style.position = 'fixed';
            noSleepVideo.style.top = '-1px';
            noSleepVideo.style.left = '-1px';
            noSleepVideo.style.width = '1px';
            noSleepVideo.style.height = '1px';
            noSleepVideo.style.opacity = '0';
            document.body.appendChild(noSleepVideo);
        }
        noSleepVideo.play();
    } catch (err) {
        console.log('Error in keepScreenAwake:', err);
    }
}

// Handle screen wake lock for visibility changes
async function handleVisibilityChange() {
    if (document.visibilityState === 'visible' && (document.fullscreenElement || isIOS)) {
        await keepScreenAwake();
    }
}

// Modified toggleFullScreen function
function toggleFullScreen() {
    if (isIOS) {
        fullscreenMessage.style.display = 'none';
        clockWrapper.classList.remove('hidden');
        keepScreenAwake();
    } else {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                fullscreenMessage.style.display = 'none';
                clockWrapper.classList.remove('hidden');
                keepScreenAwake();
            }).catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        }
    }
}

// Event listeners for screen wake lock
document.addEventListener('visibilitychange', handleVisibilityChange);
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        keepScreenAwake();
    }
});

// Handle iOS PWA status
if (window.navigator.standalone) {
    fullscreenMessage.style.display = 'none';
    clockWrapper.classList.remove('hidden');
    keepScreenAwake();
}

// Always-on display functionality
async function keepScreenOn() {
    try {
        // Additional power management for mobile
        if ('power' in navigator && navigator.power.powerSavingEnabled !== undefined) {
            navigator.power.powerSavingEnabled = false;
        }
    } catch (err) {
        console.log('Error in screen wake lock:', err);
    }
}

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && clockWrapper.style.display !== 'none') {
        keepScreenOn();
    }
});

// Event listeners for fullscreen
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenMessage.style.display = 'flex';
        clockWrapper.classList.add('hidden');
        resetTypewriter();
        setTimeout(startTypewriter, 100);
    }
});

fullscreenMessage.addEventListener('click', toggleFullScreen);

document.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullScreen();
    }
});

// Matrix Rain Effect
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Matrix characters
const chars = '01'.split('');
const fontSize = 10;
const columns = Math.floor(canvas.width / fontSize);
const drops = new Array(columns).fill(1);
const maxSpeed = 2;

// Matrix rain animation
function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        ctx.fillText(char, x, y);
        
        if (y > canvas.height && Math.random() > 0.99) {
            drops[i] = 0;
        }
        drops[i] += Math.random() * maxSpeed;
    }
}

// Run Matrix animation
setInterval(drawMatrix, 50);

// Digit patterns (3x5 grid)
const DIGIT_PATTERNS = {
    0: [
        1, 1, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 1, 1
    ],
    1: [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ],
    2: [
        1, 1, 1,
        0, 0, 1,
        1, 1, 1,
        1, 0, 0,
        1, 1, 1
    ],
    3: [
        1, 1, 1,
        0, 0, 1,
        1, 1, 1,
        0, 0, 1,
        1, 1, 1
    ],
    4: [
        1, 0, 1,
        1, 0, 1,
        1, 1, 1,
        0, 0, 1,
        0, 0, 1
    ],
    5: [
        1, 1, 1,
        1, 0, 0,
        1, 1, 1,
        0, 0, 1,
        1, 1, 1
    ],
    6: [
        1, 1, 1,
        1, 0, 0,
        1, 1, 1,
        1, 0, 1,
        1, 1, 1
    ],
    7: [
        1, 1, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ],
    8: [
        1, 1, 1,
        1, 0, 1,
        1, 1, 1,
        1, 0, 1,
        1, 1, 1
    ],
    9: [
        1, 1, 1,
        1, 0, 1,
        1, 1, 1,
        0, 0, 1,
        1, 1, 1
    ]
};

// Create grid cells for each digit display
function createDigitGrid(element) {
    for (let i = 0; i < 15; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        element.appendChild(cell);
    }
}

// Initialize all digit grids
document.querySelectorAll('.cell-grid').forEach(createDigitGrid);

// Update digit display
function updateDigit(element, value) {
    const pattern = DIGIT_PATTERNS[value];
    const cells = element.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.classList.toggle('active', pattern[index] === 1);
    });
}

// Update time display
function updateTime() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const time = formatter.format(now);
    const [hours, minutes, seconds] = time.split(':');

    updateDigit(document.querySelector('.hours-tens'), Math.floor(hours / 10));
    updateDigit(document.querySelector('.hours-ones'), hours % 10);
    updateDigit(document.querySelector('.minutes-tens'), Math.floor(minutes / 10));
    updateDigit(document.querySelector('.minutes-ones'), minutes % 10);
    updateDigit(document.querySelector('.seconds-tens'), Math.floor(seconds / 10));
    updateDigit(document.querySelector('.seconds-ones'), seconds % 10);
}

// Initial update and start interval
updateTime();
setInterval(updateTime, 1000);
