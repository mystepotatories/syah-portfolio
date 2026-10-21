<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let unavailable = $state(false);

  onMount(() => {
    let disposed = false;
    let renderer: { dispose: () => void } | undefined;

    async function start() {
      try {
        const { createRenderer } = await import('./ocean/renderer');
        if (disposed) return;
        const next = createRenderer({ canvas });
        renderer = next;
        await next.ready;
      } catch (error) {
        renderer?.dispose();
        if (!disposed) {
          unavailable = true;
          console.warn('Particle ocean requires an available WebGPU adapter.', error);
        }
      }
    }

    void start();
    return () => { disposed = true; renderer?.dispose(); };
  });
</script>

<canvas bind:this={canvas} class:unavailable aria-hidden="true"></canvas>

<style>
  canvas { position: absolute; inset: 0; display: block; width: 100%; height: 100%; transform: translateY(48%); pointer-events: none; }
  :global(:root[data-theme='dark']) canvas { opacity: 1; }
  canvas.unavailable { visibility: hidden; }
</style>
