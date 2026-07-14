// Load anime.js at runtime from CDN if it's not already available.
// This avoids build-time bundler export issues with some animejs package versions.
function loadAnime() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.anime) return Promise.resolve(window.anime);
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/animejs@3.2.1/lib/anime.min.js';
    s.async = true;
    s.onload = () => resolve(window.anime);
    s.onerror = (e) => reject(e);
    document.head.appendChild(s);
  });
}

// Observe elements with class `animate-on-scroll` and run a simple anime.js
// animation when they enter the viewport. Elements can set data attributes
// to customize animation via `data-anim` (e.g. "fade-up") and
// `data-delay` in ms.
export function initScrollAnimations(root = document) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const anim = el.dataset.anim || 'fade-up';
        const delay = Number(el.dataset.delay) || 0;
        // ensure anime is loaded before running
        loadAnime().then((anime) => runAnimation(anime, el, anim, delay)).catch(() => runAnimation(null, el, anim, delay));
        obs.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );

  const elems = Array.from(root.querySelectorAll('.animate-on-scroll'));
  elems.forEach((e) => observer.observe(e));
}

function runAnimation(anime, el, anim, delay = 0) {
  // Fallback to simple CSS transition if anime isn't available
  if (!anime) {
    el.style.transition = 'transform 0.7s ease, opacity 0.7s ease';
    switch (anim) {
      case 'fade-left':
        el.style.transform = 'translateX(0)';
        el.style.opacity = '1';
        break;
      case 'fade-scale':
        el.style.transform = 'scale(1)';
        el.style.opacity = '1';
        break;
      case 'fade-up':
      default:
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
        break;
    }
    return;
  }

  switch (anim) {
    case 'fade-left':
      anime({
        targets: el,
        translateX: [-32, 0],
        opacity: [0, 1],
        easing: 'easeOutCubic',
        duration: 700,
        delay,
      });
      break;
    case 'fade-scale':
      anime({
        targets: el,
        scale: [0.96, 1],
        opacity: [0, 1],
        easing: 'easeOutBack',
        duration: 700,
        delay,
      });
      break;
    case 'fade-up':
    default:
      anime({
        targets: el,
        translateY: [24, 0],
        opacity: [0, 1],
        easing: 'easeOutCubic',
        duration: 700,
        delay,
      });
      break;
  }
}

export function animateLayout(el) {
  loadAnime().then((anime) => {
    if (!anime) return;
    anime({
      targets: el,
      translateZ: [60, 80],
      rotateX: ['14deg', '12deg'],
      rotateY: ['-16deg', '-14deg'],
      duration: 900,
      easing: 'easeOutCubic',
    });
  }).catch(() => {
    // fallback: tiny CSS transform tweak
    el.style.transform = getComputedStyle(el).transform;
  });
}

export default {
  initScrollAnimations,
  animateLayout,
};
