/**
 * All-In-One Cross-Platform Animation Enforcer (JS)
 * Forces all components to animate on Windows, macOS, Linux, iOS, and Android.
 */
(function enforceAllAnimations() {
  // 1. Inject high-priority global rules into the document head
  const style = document.createElement('style');
  style.id = 'cross-platform-animation-enforcer';
  style.textContent = `
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        -webkit-animation-play-state: running !important;
        animation-play-state: running !important;
      }
    }
    
    .earth, .mars, .profile-frame-wrapper, .earth::after, .planet, .reveal {
      -webkit-animation-play-state: running !important;
      animation-play-state: running !important;
    }
  `;
  document.head.appendChild(style);

  // 2. Force play states via DOM traversal for mobile/desktop rendering engines
  const activateAnimations = () => {
    const animatedElements = document.querySelectorAll(
      '.earth, .mars, .profile-frame-wrapper, .planet, .reveal, [class*="anim"]'
    );

    animatedElements.forEach((el) => {
      el.style.webkitAnimationPlayState = 'running';
      el.style.animationPlayState = 'running';
      
      // Prevent hidden states on mobile scroll elements
      if (el.classList.contains('reveal')) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  };

  // Run on load, DOMContentLoaded, and window focus to catch mobile tab switches
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activateAnimations);
  } else {
    activateAnimations();
  }

  window.addEventListener('load', activateAnimations);
  window.addEventListener('pageshow', activateAnimations);
})();