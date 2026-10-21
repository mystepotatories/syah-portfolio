<script lang="ts">
  import '../../style.css';
  import { onNavigate } from '$app/navigation';
  import { navigating } from '$app/state';
  import CoreSpinLoader from '$lib/CoreSpinLoader.svelte';
  let { children } = $props();

  onNavigate((navigation) => {
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches
      || navigation.from?.url.pathname === navigation.to?.url.pathname) return;

    return new Promise<void>((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

{#if navigating.to}<div class="page-loading"><CoreSpinLoader label="Loading page" size={56} /></div>{/if}
{@render children()}

<style>
  .page-loading { position: fixed; z-index: 100; inset: 0; display: grid; place-items: center; background: color-mix(in srgb, var(--bg) 55%, transparent); backdrop-filter: blur(3px); pointer-events: none; }
</style>
