<script lang="ts">
  import '../../style.css';
  import { onNavigate } from '$app/navigation';
  import { navigating } from '$app/state';
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

{#if navigating.to}<div class="navigation-progress" role="status" aria-label="Loading page"></div>{/if}
{@render children()}
