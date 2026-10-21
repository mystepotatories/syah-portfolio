<script lang="ts">
  let { src, alt, loading = 'lazy', priority = false }: {
    src: string; alt: string; loading?: 'lazy' | 'eager'; priority?: boolean;
  } = $props();
  let failed = $state(false);
  let portrait = $state(false);

  $effect(() => { src; failed = false; portrait = false; });
</script>

{#if !src || failed}
  <div class="image-fallback"><span aria-hidden="true">↗</span><p>{alt}</p><small>Preview unavailable</small></div>
{:else}
  <img {src} {alt} {loading} fetchpriority={priority ? 'high' : 'auto'} class:portrait onload={(event) => { const image = event.currentTarget as HTMLImageElement; portrait = image.naturalHeight > image.naturalWidth * 1.2; }} onerror={() => { failed = true; }} />
{/if}
