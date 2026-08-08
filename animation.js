/**
 * Global Animation Enforcer
 * Overrides OS/Browser reduced-motion settings and forces all animations to run.
 */
(function enforceSiteAnimations() {
  // 1. Dynamically inject an override stylesheet into <head>
  const style = document.createElement('style');
  style.id = 'force-animations-override';
  style.textContent = `
    /* Override OS/Browser reduced motion restrictions globally */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: unset !important;
        animation-delay: unset !important;
        animation-iteration-count: unset !important;
        animation-play-state: running !important;
        transition-duration: unset !important;
      }

      /* Explicitly force continuous keyframe animations */
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

      /* Ensure scroll reveal elements remain visible */
      .reveal {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    }
  `;

  document.head.appendChild(style);

  // 2. Force animation play-state on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
      '.earth, .mars, .profile-frame-wrapper, .planet, .reveal'
    );
    animatedElements.forEach((el) => {
      el.style.animationPlayState = 'running';
    });
  });
})();