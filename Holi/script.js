// --- Configuration ---
const colors = ['#ea1058', '#f7ca14', '#0a4e22', '#106def', '#c77dff', '#ff9f45'];
const jokes = [
  "Bura na mano, Holi hai!",
  "No clean faces allowed today.",
  "Keep calm and throw color.",
  "Smile please, before I upgrade your face.",
  "Careful! That's permanent Gulal!",

];

// --- Canvas Setup ---
const colorCanvas = document.getElementById('color-canvas');
const splashCanvas = document.getElementById('splash-canvas');
const colorCtx = colorCanvas.getContext('2d');
const splashCtx = splashCanvas.getContext('2d');
const jokePopup = document.getElementById('joke-popup');

let particles = [];
let splashes = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvases() {
  colorCanvas.width = window.innerWidth;
  colorCanvas.height = window.innerHeight;
  splashCanvas.width = window.innerWidth;
  splashCanvas.height = window.innerHeight;
}
resizeCanvases();
window.addEventListener('resize', resizeCanvases);

// --- Floating Background Elements ---
function createFloatingColors() {
  const container = document.getElementById('floating-colors');
  const count = window.innerWidth < 640 ? 15 : 30;
  
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'float-element';
    const size = Math.random() * 20 + 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${Math.random() * 100}vw;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 5}s;
      opacity: 0.4;
    `;
    container.appendChild(el);
  }
}
createFloatingColors();

// --- Particle Classes ---
class Particle {
  constructor(x, y, color) {
    this.x = x || Math.random() * colorCanvas.width;
    this.y = y || Math.random() * colorCanvas.height;
    this.size = Math.max(2, Math.random() * 6 + 2);
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2;
    this.color = color || colors[Math.floor(Math.random() * colors.length)];
    this.alpha = Math.random() * 0.5 + 0.3;
    this.decay = 0.002;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= this.decay;
    
    // Wrap around screen
    if (this.x < 0) this.x = colorCanvas.width;
    if (this.x > colorCanvas.width) this.x = 0;
    if (this.y < 0) this.y = colorCanvas.height;
    if (this.y > colorCanvas.height) this.y = 0;
  }
  
  draw() {
    if (this.alpha <= 0) return;
    colorCtx.beginPath();
    colorCtx.arc(this.x, this.y, Math.max(0.5, this.size), 0, Math.PI * 2);
    colorCtx.fillStyle = this.color;
    colorCtx.globalAlpha = Math.max(0, this.alpha);
    colorCtx.fill();
    colorCtx.globalAlpha = 1;
  }
}

class Splash {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.particles = [];
    const count = 30 + Math.floor(Math.random() * 20); // Bigger splashes
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = Math.random() * 10 + 5; // Faster speed
      this.particles.push({
        x: this.x,
        y: this.y,
        vx: Math.cos(angle) * speed * (Math.random() + 0.5),
        vy: Math.sin(angle) * speed * (Math.random() + 0.5),
        size: Math.max(2, Math.random() * 10 + 5), // Bigger dots
        color: color || colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        gravity: 0.2,
        decay: 0.015 + Math.random() * 0.01
      });
    }
  }
  
  update() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.alpha -= p.decay;
      p.size *= 0.98;
    });
    this.particles = this.particles.filter(p => p.alpha > 0 && p.size > 0.5);
  }
  
  draw() {
    this.particles.forEach(p => {
      if (p.alpha <= 0 || p.size < 0.5) return;
      splashCtx.beginPath();
      splashCtx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
      splashCtx.fillStyle = p.color;
      splashCtx.globalAlpha = Math.max(0, p.alpha);
      splashCtx.fill();
      splashCtx.globalAlpha = 1;
    });
  }
  
  isDead() {
    return this.particles.length === 0;
  }
}

// Initialize ambient particles
for (let i = 0; i < 40; i++) {
  particles.push(new Particle());
}

// --- Animation Loop ---
function animate() {
  colorCtx.clearRect(0, 0, colorCanvas.width, colorCanvas.height);
  splashCtx.clearRect(0, 0, splashCanvas.width, splashCanvas.height);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  // Maintain particle count
  particles = particles.filter(p => p.alpha > 0);
  while (particles.length < 40) {
    particles.push(new Particle());
  }
  
  splashes.forEach(s => {
    s.update();
    s.draw();
  });
  splashes = splashes.filter(s => !s.isDead());
  
  requestAnimationFrame(animate);
}
animate();

// --- Interaction Logic ---

function createSplash(x, y, color) {
  splashes.push(new Splash(x, y, color));
  
  // Chance to show a joke
  if (Math.random() > 0.7) {
    showJoke(x, y);
  }
}

function showJoke(x, y) {
  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  jokePopup.textContent = joke;
  jokePopup.classList.add('show');
  jokePopup.style.left = `${x}px`;
  jokePopup.style.top = `${y}px`;
  
  // Hide after a short time
  setTimeout(() => {
    jokePopup.classList.remove('show');
  }, 2000);
}

// Mouse/Touch Tracking
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener('touchmove', (e) => {
  if (e.touches[0]) {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
  }
});

// Main Click Handler
document.addEventListener('click', (e) => {
  // Handle Run Away Button
  if (e.target.id === 'run-btn') {
    moveButton();
    return;
  }
  
  // Handle Celebrate Button
  if (e.target.id === 'celebrate-btn') {
    celebrateBurst();
    return;
  }
  
  // Handle Color Buttons
  if (e.target.classList.contains('color-btn')) {
    createSplash(e.clientX, e.clientY, e.target.dataset.color);
    return;
  }
  
  // Default: Splash random color
  createSplash(e.clientX, e.clientY);
});

// --- Funny Button Logic ---

const runBtn = document.getElementById('run-btn');

function moveButton() {
  // Show a quick taunt
  showJoke(runBtn.getBoundingClientRect().left, runBtn.getBoundingClientRect().top);
  
  // Calculate random position
  const maxX = window.innerWidth - 150;
  const maxY = window.innerHeight - 80;
  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;
  
  // Make it absolute positioned
  runBtn.style.position = 'fixed';
  runBtn.style.left = `${newX}px`;
  runBtn.style.top = `${newY}px`;
  runBtn.style.zIndex = '1000';
  runBtn.style.transition = 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  runBtn.style.transform = `rotate(${Math.random() * 360}deg)`;
  
  // Change text occasionally
  const texts = ["Click for $100", "Not here!", "Too slow!", "Try again!", "Haha!", "Missed me!"];
  runBtn.textContent = texts[Math.floor(Math.random() * texts.length)];
}

// Auto Celebration
function celebrateBurst() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  // Create a massive burst
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const offsetX = (Math.random() - 0.5) * 400;
      const offsetY = (Math.random() - 0.5) * 400;
      createSplash(centerX + offsetX, centerY + offsetY, colors[i % colors.length]);
    }, i * 80);
  }
  
  // Shake the screen effect
  document.body.style.animation = 'shake 0.5s';
  setTimeout(() => {
    document.body.style.animation = '';
  }, 500);
}

// Touch Support for running button
runBtn.addEventListener('touchstart', (e) => {
  e.preventDefault(); 
  moveButton();
});

// Initial Auto Burst
setTimeout(() => {
  celebrateBurst();
}, 1000);