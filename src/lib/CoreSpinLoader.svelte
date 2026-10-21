<script lang="ts">
  let { size = 48, label = 'Loading' }: { size?: number; label?: string } = $props();
</script>

<span class="core-spin" role="status" aria-label={label} style:--loader-size={`${size}px`}>
  <span class="core-track" aria-hidden="true"></span>
  <span class="core-ring outer" aria-hidden="true"></span>
  <span class="core-ring inner" aria-hidden="true"></span>
  <span class="core" aria-hidden="true"></span>
</span>

<style>
  .core-spin { position: relative; display: inline-grid; place-items: center; width: var(--loader-size); height: var(--loader-size); max-width: 100%; max-height: 100%; color: var(--accent); }
  .core-track, .core-ring, .core { position: absolute; border-radius: 50%; }
  .core-track { inset: 0; border: 2px solid color-mix(in srgb, var(--accent) 15%, transparent); }
  .core-ring { inset: 0; border: 2px solid transparent; border-top-color: currentColor; border-right-color: color-mix(in srgb, var(--accent) 45%, transparent); animation: core-spin 1.1s linear infinite !important; }
  .core-ring.inner { inset: 20%; color: #38a8e5; border-top-color: currentColor; border-right-color: transparent; border-bottom-color: currentColor; animation-direction: reverse !important; animation-duration: .85s !important; }
  .core { inset: 40%; background: currentColor; box-shadow: 0 0 12px color-mix(in srgb, var(--accent) 60%, transparent); animation: core-pulse 1.1s ease-in-out infinite !important; }
  @keyframes core-spin { to { transform: rotate(360deg); } }
  @keyframes core-pulse { 0%, 100% { transform: scale(.75); opacity: .6; } 50% { transform: scale(1.15); opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .core-ring { animation-duration: 3s !important; } .core { animation: none !important; } }
</style>
