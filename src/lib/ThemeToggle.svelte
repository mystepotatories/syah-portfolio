<script lang="ts">
  import { onMount } from 'svelte';

  let dark = $state(false);

  onMount(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => { dark = document.documentElement.dataset.theme === 'dark'; };
    const followSystem = () => {
      let saved = null;
      try { saved = localStorage.getItem('portfolio-theme'); } catch { /* Storage may be disabled. */ }
      if (!saved) document.documentElement.dataset.theme = media.matches ? 'dark' : 'light';
      sync();
    };
    sync();
    media.addEventListener('change', followSystem);
    return () => media.removeEventListener('change', followSystem);
  });

  function toggleTheme() {
    dark = !dark;
    const theme = dark ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('portfolio-theme', theme); } catch { /* Keep the toggle usable without storage. */ }
  }
</script>

<button class="theme-toggle" type="button" onclick={toggleTheme} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} title={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
    {#if dark}
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    {:else}
      <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" />
    {/if}
  </svg>
  <span>{dark ? 'Light' : 'Dark'}</span>
</button>
