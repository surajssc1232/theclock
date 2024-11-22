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