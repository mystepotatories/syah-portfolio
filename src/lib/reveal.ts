import type { Action } from 'svelte/action';

// Keep content visible in SSR and without JavaScript. Animate once on entry.
export const reveal: Action<HTMLElement, number | undefined> = (node, delay = 0) => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const animation = node.animate(
    [
      { opacity: 0, transform: 'translate3d(0, 28px, 0)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0)' }
    ],
    { duration: 800, delay, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' }
  );
  animation.pause();

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      animation.play();
      observer.disconnect();
    }
  }, { threshold: 0.08 });

  const show = () => {
    animation.cancel();
    observer.disconnect();
  };
  const onPreferenceChange = () => { if (reducedMotion.matches) show(); };
  animation.onfinish = () => animation.cancel();
  observer.observe(node);
  node.addEventListener('focusin', show);
  reducedMotion.addEventListener('change', onPreferenceChange);

  return {
    destroy() {
      show();
      node.removeEventListener('focusin', show);
      reducedMotion.removeEventListener('change', onPreferenceChange);
    }
  };
};
