/**
 * Global Animation Enforcer & Scroll Reveal Observer
 */
(function enforceSiteAnimations() {
  // 1. Enable scroll-reveal readiness so CSS hides .reveal elements until scrolled into view
  document.documentElement.classList.add('js-reveal-ready');

  // 2. Inject override stylesheet for continuous keyframe animations
  const style = document.createElement('style');
  style.id = 'force-animations-override';
  style.textContent = `
    /* Force continuous keyframe animations to run regardless of OS settings */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-play-state: running !important;
      }

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
    }
  `;
  document.head.appendChild(style);

  // 3. Trigger scroll reveal animations dynamically as user scrolls
  const initScrollObserver = () => {
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        },
        {
          threshold: 0.15, // Animates when 15% of element enters viewport
          rootMargin: '0px 0px -40px 0px'
        }
      );

      revealElements.forEach((el) => observer.observe(el));
    } else {
      // Fallback for legacy browsers
      revealElements.forEach((el) => el.classList.add('is-visible'));
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollObserver);
  } else {
    initScrollObserver();
  }
})();