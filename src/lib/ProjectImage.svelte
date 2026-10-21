<script lang="ts">
  import CoreSpinLoader from './CoreSpinLoader.svelte';

  let { src, alt, loading = 'lazy', priority = false }: {
    src: string; alt: string; loading?: 'lazy' | 'eager'; priority?: boolean;
  } = $props();
  let failedSource = $state('');
  let loadedSource = $state('');
  let portrait = $state(false);
  let pending = $derived(!!src && loadedSource !== src && failedSource !== src);

  function imageLoaded(image: HTMLImageElement) {
    loadedSource = src;
    portrait = image.naturalHeight > image.naturalWidth * 1.2;
  }

  function checkCached(image: HTMLImageElement) {
    if (image.complete && image.naturalWidth > 0) imageLoaded(image);
  }
</script>

<span class="image-frame" aria-busy={pending}>
{#if !src || failedSource === src}
  <div class="image-fallback"><span aria-hidden="true">↗</span><p>{alt}</p><small>Preview unavailable</small></div>
{:else}
  {#key src}<img {src} {alt} {loading} fetchpriority={priority ? 'high' : 'auto'} class:portrait class:pending use:checkCached onload={(event) => imageLoaded(event.currentTarget as HTMLImageElement)} onerror={() => { failedSource = src; }} />{/key}
  {#if pending}<span class="image-loading"><CoreSpinLoader label="Loading image" /></span>{/if}
{/if}
</span>

<style>
  .image-frame { position: relative; display: grid; grid-template-rows: minmax(0, 1fr); place-items: center; width: 100%; height: 100%; min-width: 0; min-height: 0; }
  img { display: block; width: 100%; height: 100%; max-height: 100%; min-width: 0; min-height: 0; object-fit: contain; }
  img.pending { opacity: 0; }
  .image-loading { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; }
</style>
