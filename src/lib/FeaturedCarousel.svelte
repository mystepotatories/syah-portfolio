<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import ProjectImage from './ProjectImage.svelte';
  import { projectSlug, type projects } from './projects';

  let { items }: { items: typeof projects } = $props();
  let turn = $state(untrack(() => Math.max(0, items.findIndex((project) => project.image))));
  let playing = $state(false);
  let reduced = $state(true);
  let stage: HTMLDivElement;
  let carousel: HTMLElement;
  let visible = false;
  let drag: { id: number; x: number; y: number; captured: boolean } | null = null;
  let suppressClickUntil = 0;
  const total = $derived(items.length);
  const active = $derived(((turn % total) + total) % total);
  const angle = $derived(turn * (360 / total));
  const current = $derived(items[active]);

  function move(step: number, user = true) {
    if (user) playing = false;
    turn += step;
  }

  function select(index: number) {
    if (performance.now() < suppressClickUntil) return;
    let distance = (index - active + total) % total;
    if (distance > total / 2) distance -= total;
    move(distance);
  }

  function keydown(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      select(event.key === 'Home' ? 0 : total - 1);
    }
  }

  function pointerdown(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0) return;
    playing = false;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, captured: false };
  }

  function pointermove(event: PointerEvent) {
    if (!drag || drag.id !== event.pointerId) return;
    const x = event.clientX - drag.x;
    const y = event.clientY - drag.y;
    if (!drag.captured && Math.abs(x) > 8 && Math.abs(x) > Math.abs(y)) {
      stage.setPointerCapture(event.pointerId);
      drag.captured = true;
    }
  }

  function pointerup(event: PointerEvent) {
    const start = drag;
    drag = null;
    if (!start || start.id !== event.pointerId) return;
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    if (start.captured) {
      suppressClickUntil = performance.now() + 300;
      const distance = event.clientX - start.x;
      if (Math.abs(distance) >= 30) move(-Math.sign(distance));
    }
  }

  onMount(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { reduced = media.matches; if (reduced) playing = false; };
    sync();
    media.addEventListener('change', sync);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(stage);
    const timer = window.setInterval(() => {
      if (playing && visible && !document.hidden && !reduced) move(1, false);
    }, 4000);
    let lastWheel = 0;
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || (Math.abs(event.deltaY) >= Math.abs(event.deltaX) && !stage.contains(document.activeElement))) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (Math.abs(delta) < 8) return;
      event.preventDefault();
      if (performance.now() - lastWheel < 720) return;
      lastWheel = performance.now();
      move(Math.sign(delta));
    };
    stage.addEventListener('wheel', wheel, { passive: false });
    carousel.addEventListener('keydown', keydown);
    return () => {
      media.removeEventListener('change', sync);
      observer.disconnect();
      window.clearInterval(timer);
      stage.removeEventListener('wheel', wheel);
      carousel.removeEventListener('keydown', keydown);
    };
  });
</script>

<section class="carousel" class:reduced bind:this={carousel} aria-roledescription="carousel" aria-label="Featured projects" onfocusin={(event) => { if (!(event.target as HTMLElement).closest('.play-control')) playing = false; }} onmouseenter={() => { playing = false; }}>
  <div class="wheel-column">
    <div class="wheel-stage" bind:this={stage} role="group" aria-label="Browse featured projects" aria-describedby="carousel-help" onpointerdown={pointerdown} onpointermove={pointermove} onpointerup={pointerup} onpointercancel={() => { drag = null; }} onlostpointercapture={() => { drag = null; }}>
      <span class="on-view" aria-hidden="true">On view <span>⌄</span></span>
      <svg class="wheel-base" viewBox="0 0 400 400" fill="none" aria-hidden="true"><path d="M200 184 146 362M200 184 254 362M124 362H276" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
      <div class="wheel" style:transform={`rotate(${angle}deg)`}>
        <div class="inner-rim" aria-hidden="true"></div>
        {#each Array(24) as _, index}
          <span class="rim-light" aria-hidden="true" style:left={`${50 + Math.sin(index * Math.PI / 12) * 50}%`} style:top={`${50 - Math.cos(index * Math.PI / 12) * 50}%`}></span>
        {/each}
        {#each items as project, index}
          {@const radians = -index * (2 * Math.PI / total)}
          <span class="spoke" aria-hidden="true" style:transform={`rotate(${-90 - index * (360 / total)}deg)`}></span>
          <div class="gondola-anchor" class:selected={active === index} style:left={`${50 + Math.sin(radians) * 50}%`} style:top={`${50 - Math.cos(radians) * 50}%`} style:width={`${Math.min(34, 270 / total)}%`}>
            <div class="counter" style:transform={`rotate(${-angle}deg)`}>
              <div class="gondola">
                <span class="hanger" aria-hidden="true"></span>
                <button class="thumbnail" type="button" aria-label={`Select ${project.title}, ${index + 1} of ${total}`} aria-current={active === index ? 'true' : undefined} aria-controls="featured-project-detail" onclick={() => select(index)}>
                  <span class={`thumbnail-image ${project.tone}`}><ProjectImage src={project.image} alt="" /></span>
                  <span class="thumbnail-title">{project.title}</span>
                  <span class="thumbnail-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
      <div class="hub" aria-hidden="true"><strong>{String(total).padStart(2, '0')}</strong><span>Projects</span></div>
    </div>
    <p class="help" id="carousel-help">Drag to explore <span aria-hidden="true">/</span> Use ← → or select a project</p>
  </div>

  <div class="detail" id="featured-project-detail">
    <div class={`preview-frame ${current.tone}`}>
      {#key active}<div class="preview-layer" transition:fade={{ duration: reduced ? 0 : 300 }}><ProjectImage src={current.image} alt={`${current.title} project interface`} loading="eager" /></div>{/key}
    </div>
    <div class="caption-space">
      {#key active}<div class="caption" in:fly={{ y: reduced ? 0 : 12, duration: reduced ? 0 : 400, easing: cubicOut }}>
        <p class="project-category">{current.category}</p>
        <h3>{current.title}</h3>
        <p class="description">{current.desc}</p>
        <a class="project-link" href={`/projects/${projectSlug(current.title)}`}>View project <span aria-hidden="true">↗</span></a>
      </div>{/key}
    </div>
    <div class="controls">
      <button class="round-control" type="button" aria-label="Previous project" onclick={() => move(-1)}>←</button>
      <button class="round-control next" type="button" aria-label="Next project" onclick={() => move(1)}>→</button>
      {#if !reduced}<button class="play-control" type="button" aria-label={playing ? 'Pause carousel' : 'Play carousel'} aria-pressed={playing} onclick={() => { playing = !playing; }}>{playing ? 'Ⅱ Pause' : '▷ Play'}</button>{/if}
      <span class="counter-text" aria-hidden="true">{String(active + 1).padStart(2, '0')} <span>/ {String(total).padStart(2, '0')}</span></span>
    </div>
    <p class="sr-only" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">{current.title}, project {active + 1} of {total}</p>
  </div>
</section>

<style>
  .carousel { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); align-items: center; gap: clamp(1.5rem, 4vw, 4rem); padding-top: 1.5rem; border-top: 1px solid var(--border); }
  .wheel-column, .detail { min-width: 0; }
  .wheel-stage { position: relative; width: 100%; aspect-ratio: 1; overflow: hidden; touch-action: pan-y; user-select: none; cursor: grab; border-radius: 1rem; }
  .wheel-stage:active { cursor: grabbing; }
  .wheel-stage:focus-visible { outline: 3px solid var(--focus); outline-offset: 5px; }
  .on-view { position: absolute; inset: 0 0 auto; display: grid; justify-items: center; color: var(--muted); text-transform: uppercase; font-size: .75rem; letter-spacing: .18em; }
  .on-view>span { font-size: 1rem; line-height: 1; }
  .wheel-base { position: absolute; inset: 0; width: 100%; height: 100%; color: var(--border); pointer-events: none; }
  .wheel { position: absolute; left: 17%; top: 13%; width: 66%; height: 66%; border: 2px solid var(--border); border-radius: 50%; }
  .wheel, .counter { transition: transform 700ms cubic-bezier(.22, 1, .36, 1); }
  .inner-rim { position: absolute; inset: 6%; border: 1px solid var(--border); border-radius: 50%; opacity: .55; }
  .rim-light { position: absolute; width: 4px; height: 4px; border-radius: 50%; background: var(--accent); transform: translate(-50%, -50%); }
  .spoke { position: absolute; left: 50%; top: 50%; width: 50%; height: 1px; background: var(--border); transform-origin: left; opacity: .6; }
  .gondola-anchor { position: absolute; z-index: 2; }
  .gondola-anchor.selected { z-index: 3; }
  .counter { position: relative; transform-origin: top left; }
  .gondola { position: absolute; top: 0; left: 0; width: 100%; transform: translateX(-50%); }
  .hanger { display: block; width: 2px; height: .5rem; margin: auto; background: var(--border); }
  .thumbnail { display: block; width: 100%; padding: .3rem; border: 1px solid var(--border); border-radius: .65rem; background: var(--surface); box-shadow: 0 2px 5px #00000015; text-align: center; transition: transform .4s var(--ease-out), scale .25s var(--ease-out), background-color .25s ease, border-color .3s !important; }
  .selected .thumbnail { transform: scale(1.1); border-color: var(--accent); box-shadow: 0 0 0 2px var(--surface), 0 0 0 3px var(--accent); }
  .thumbnail:is(:hover, :focus-visible) { border-color: var(--accent); background: var(--surface-alt); scale: 1.04; }
  .thumbnail-image { display: grid; grid-template-rows: minmax(0, 1fr); place-items: center; width: 100%; aspect-ratio: 1.6; overflow: hidden; border-radius: .3rem; color: var(--card-ink); }
  .thumbnail-image :global(img) { display: block; width: 100%; height: 100%; min-height: 0; object-fit: contain; pointer-events: none; }
  .thumbnail-image :global(.image-fallback) { min-height: 0; padding: 0; border: 0; }
  .thumbnail-image :global(.image-fallback>span) { font-size: 1.3rem; }
  .thumbnail-image :global(.image-fallback p), .thumbnail-image :global(.image-fallback small) { display: none; }
  .thumbnail-title { display: block; margin-top: .3rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: clamp(.55rem, .75vw, .75rem); font-weight: 600; line-height: 1.4; }
  .thumbnail-number { display: block; color: var(--muted); font-size: .625rem; line-height: 1.4; }
  .hub { position: absolute; z-index: 4; left: 50%; top: 46%; display: grid; align-content: center; justify-items: center; width: 18%; aspect-ratio: 1; border: 2px solid var(--border); border-radius: 50%; background: var(--surface); transform: translate(-50%, -50%); box-shadow: 0 3px 8px #00000012; pointer-events: none; }
  .hub strong { font-size: clamp(1rem, 2vw, 1.5rem); font-weight: 500; line-height: 1.3; }
  .hub>span { color: var(--muted); font-size: clamp(.5rem, .7vw, .65rem); text-transform: uppercase; letter-spacing: .08em; }
  .help { margin: .5rem 0 0; text-align: center; color: var(--muted); font-size: .8125rem; }
  .help>span { margin-inline: .4rem; color: var(--border); }
  .preview-frame { position: relative; width: 100%; height: clamp(14rem, 23vw, 21rem); border-radius: 1.25rem; overflow: hidden; color: var(--card-ink); }
  .preview-layer { position: absolute; inset: 0; display: grid; grid-template-rows: minmax(0, 1fr); place-items: center; padding: 1rem; }
  .preview-layer :global(img) { display: block; width: 100%; height: 100%; min-height: 0; max-height: 100%; object-fit: contain; }
  .preview-layer :global(.image-fallback) { min-height: 0; }
  .caption-space { min-height: 15.5rem; padding-top: 1.5rem; }
  .project-category { margin: 0 0 .65rem; padding-left: .65rem; border-left: 2px solid var(--accent); color: var(--muted); font-size: .8125rem; line-height: 1.5; }
  h3 { margin: 0; font-size: clamp(1.5rem, 2.6vw, 2.25rem); line-height: 1.2; }
  .description { margin: .75rem 0; color: var(--muted); font-size: 1rem; line-height: 1.65; }
  .project-link { display: inline-flex; align-items: center; gap: .6rem; min-height: 44px; padding: .5rem 1rem; border-radius: 99px; font-weight: 700; }
  .project-link>span { transition: transform .35s var(--ease-out); }
  .project-link:is(:hover, :focus-visible)>span { transform: translate(3px, -3px); }
  .controls { display: flex; align-items: center; gap: .65rem; margin-top: .75rem; }
  .round-control { --button-bg: #d3edff; --button-text: #174965; --button-hover: #b2ddfa; --button-active: #91cef3; --button-shadow: #62b4ec40; display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 1px solid var(--border); border-radius: 50%; background: var(--surface); color: var(--text); font-size: 1.3rem; transition: transform .3s var(--ease-out), background-color .3s; }
  .next { background: var(--button-bg); color: var(--button-text); border-color: transparent; }
  .play-control { min-height: 44px; padding: .4rem .65rem; border: 0; border-radius: 99px; background: transparent; color: var(--muted); font-size: .875rem; }
  .play-control:hover { background: var(--surface-alt); color: var(--text); }
  .counter-text { margin-left: auto; font-size: .8125rem; font-variant-numeric: tabular-nums; }
  .counter-text>span { color: var(--muted); }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .reduced .wheel, .reduced .counter { transition: none; }
  @media(max-width: 760px) {
    .carousel { grid-template-columns: 1fr; gap: 1.75rem; }
    .wheel-column { width: 100%; max-width: 32rem; justify-self: center; }
    .thumbnail-title { font-size: .625rem; }
    .preview-frame { height: clamp(14rem, 55vw, 22rem); }
    .caption-space { min-height: 0; }
    .help { font-size: .75rem; }
    .controls { margin-top: 1rem; }
  }
</style>
