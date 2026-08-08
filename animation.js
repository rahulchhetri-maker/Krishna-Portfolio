/**
 * Global Animation Enforcer
 * Overrides OS/Browser reduced-motion settings and forces all animations to run.
 */
(function enforceSiteAnimations() {
  // 1. Inject an override stylesheet into <head> without setting duration to 0s
  const style = document.createElement('style');
  style.id = 'force-animations-override';
  style.textContent = `
    /* Override OS/Browser reduced motion restrictions globally */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-play-state: running !important;
      }

      /* Explicitly re-declare active keyframe durations */
      body {
        animation: pageFadeIn 0.5s ease-out forwards !important;
      }

      .profile-frame-wrapper {
        animation: float 6s ease-in-out infinite !important;
      }

      .earth {
        animation: earth-orbit-top 24s linear infinite !important;
      }

      .mars {
        animation: mars-orbit-left-reverse 14s linear infinite !important;
      }

      .earth::after {
        animation: moon-orbit 4s linear infinite !important;
      }

      /* Guarantee scroll-reveal elements stay visible on iOS */
      .reveal {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    }
  `;

  document.head.appendChild(style);

  // 2. Force running state & reveal visibility on DOM load
  const runAnimations = () => {
    const animatedElements = document.querySelectorAll(
      '.earth, .mars, .profile-frame-wrapper, .planet, .reveal'
    );
    animatedElements.forEach((el) => {
      el.style.animationPlayState = 'running';
      if (el.classList.contains('reveal')) {
        el.classList.add('is-visible');
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAnimations);
  } else {
    runAnimations();
  }
})();