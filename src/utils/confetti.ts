/**
 * Pure Canvas Confetti & Elegant "Segera Hadir" Notification
 * High performance, zero dependencies, auto cleanup + instant dismiss.
 */

export function triggerConfetti() {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  // Elegant, sophisticated palette (champagne, silver, soft blue, coral, slate)
  const colors = [
    '#3B82F6', '#60A5FA', '#93C5FD',
    '#F8FAFC', '#E2E8F0', '#94A3B8',
    '#38BDF8', '#818CF8', '#F43F5E'
  ];

  const particleCount = 75;
  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    w: number;
    h: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
  }> = [];

  const originX = window.innerWidth / 2;
  const originY = window.innerHeight * 0.55;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.random() * Math.PI) - Math.PI / 2 + (Math.random() - 0.5);
    const speed = 7 + Math.random() * 12;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
      vy: Math.sin(angle) * speed - 4,
      w: 7 + Math.random() * 7,
      h: 4 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
    });
  }

  let startTime: number | null = null;
  const duration = 2200; // ms

  function render(now: number) {
    if (!startTime) startTime = now;
    const elapsed = now - startTime;
    const progress = elapsed / duration;

    ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.32; // gravity
      p.vx *= 0.98; // air drag
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - progress);

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.rotation * Math.PI) / 180);
      ctx!.globalAlpha = p.opacity;
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx!.restore();
    }

    if (elapsed < duration) {
      requestAnimationFrame(render);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(render);
}

/**
 * Elegant, minimal obsidian notification with instant close button
 */
export function showComingSoonToast(featureName: string = 'Google Sign-In') {
  if (typeof window === 'undefined') return;

  // Remove any existing toast
  const existing = document.getElementById('coming-soon-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'coming-soon-toast';
  // Minimal, premium dark obsidian card with subtle border & blur
  toast.className = 'fixed top-5 left-1/2 -translate-x-1/2 z-[100000] flex items-center justify-between gap-4 px-4 py-3 rounded-2xl bg-[#0B0C10]/95 backdrop-blur-2xl border border-white/15 text-white shadow-[0_16px_48px_rgba(0,0,0,0.5)] transition-all duration-200 animate-fade-in-up max-w-[90vw] sm:max-w-md';

  toast.innerHTML = `
    <div class="flex items-center gap-3 min-w-0">
      <div class="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0">
        <svg class="w-4 h-4 fill-white" viewBox="0 0 256 256" aria-hidden="true">
          <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
        </svg>
      </div>
      <div class="flex flex-col min-w-0">
        <span class="text-[11px] font-mono uppercase tracking-wider text-white/50 font-semibold">Segera Hadir</span>
        <span class="text-sm font-medium text-white/95 truncate">${featureName} segera dapat digunakan</span>
      </div>
    </div>
    <button
      id="toast-close-btn"
      type="button"
      aria-label="Tutup notifikasi"
      class="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
    >
      <svg class="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  document.body.appendChild(toast);

  const dismiss = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -10px)';
    setTimeout(() => {
      toast.remove();
    }, 200);
  };

  const closeBtn = toast.querySelector('#toast-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', dismiss);
  }

  // Auto remove after 3.8 seconds
  const timer = setTimeout(dismiss, 3800);

  // Clear timer if user closes early
  if (closeBtn) {
    closeBtn.addEventListener('click', () => clearTimeout(timer));
  }
}
