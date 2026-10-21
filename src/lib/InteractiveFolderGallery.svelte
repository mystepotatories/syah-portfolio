<script lang="ts">
  import { tick } from 'svelte';
  import ProjectImage from './ProjectImage.svelte';

  let { images, title, onselect }: {
    images: string[];
    title: string;
    onselect: (image: string) => void;
  } = $props();

  let opened = $state(false);
  let hovering = $state(false);
  let drag = $state<{ id: number; index: number; x: number; y: number; dx: number; dy: number } | null>(null);
  let folderButton: HTMLButtonElement;
  let scroller: HTMLDivElement;
  let photoButtons: HTMLButtonElement[] = [];
  let suppressClickUntil = 0;

  async function open() {
    opened = true;
    hovering = false;
    await tick();
    photoButtons[0]?.focus({ preventScroll: true });
  }

  function close() {
    opened = false;
    hovering = false;
    drag = null;
    scroller.scrollLeft = 0;
    folderButton.focus({ preventScroll: true });
  }

  function pointerdown(event: PointerEvent, index: number) {
    if (!opened || !event.isPrimary || event.button !== 0) return;
    drag = { id: event.pointerId, index, x: event.clientX, y: event.clientY, dx: 0, dy: 0 };
  }

  function pointermove(event: PointerEvent) {
    if (!drag || drag.id !== event.pointerId) return;
    drag.dx = event.clientX - drag.x;
    drag.dy = event.clientY - drag.y;
    if (Math.hypot(drag.dx, drag.dy) > 8) {
      (event.currentTarget as HTMLButtonElement).setPointerCapture(event.pointerId);
    }
  }

  function pointerup(event: PointerEvent) {
    if (!drag || drag.id !== event.pointerId) return;
    const moved = Math.hypot(drag.dx, drag.dy) > 8;
    const down = event.clientY - drag.y;
    const button = event.currentTarget as HTMLButtonElement;
    drag = null;
    if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId);
    if (moved) suppressClickUntil = performance.now() + 350;
    if (down > 100) close();
  }
</script>

<div class="folder-gallery" class:opened class:hovering style:--count={images.length}>
  <div class="folder-particles" aria-hidden="true">
    {#each Array(18) as _, index}
      <span class="particle" class:dot={index % 3 !== 0}
        style:left={`${8 + (index * 19) % 84}%`}
        style:top={`${12 + (index * 23) % 72}%`}
        style:--size={`${index % 3 === 0 ? 28 : 7 + index % 4}px`}
        style:--delay={`${index * -.7}s`}
        style:--duration={`${5 + index % 4}s`}
        style:--drift={`${index % 2 ? 12 : -12}px`}
      >{index % 3 === 0 ? '✦' : ''}</span>
    {/each}
  </div>
  <div class="folder-scroller" bind:this={scroller}>
    <div class="folder-stage">
      <div class="folder-back" aria-hidden="true"><div></div></div>

      {#each images as image, index (image)}
        {@const offset = index - (images.length - 1) / 2}
        {@const dragging = drag?.index === index}
        <button
          bind:this={photoButtons[index]}
          class="photo"
          class:dragging
          type="button"
          tabindex={opened ? 0 : -1}
          aria-hidden={!opened}
          aria-label={`Enlarge ${title} image ${index + 1} of ${images.length}`}
          style:--offset={offset}
          style:--fan={`${offset * Math.min(64, 240 / Math.max(1, images.length - 1))}px`}
          style:--stack={`${offset * Math.min(42, 168 / Math.max(1, images.length - 1))}px`}
          style:--stack-y={`${offset * -5}px`}
          style:--fan-y={`${offset * -10 - 40}px`}
          style:--angle={`${offset * (hovering ? 8 : 5)}deg`}
          style:--scale={1 - Math.abs(offset) * .03}
          style:--layer={index + 1}
          style:--drag-x={`${dragging ? drag?.dx ?? 0 : 0}px`}
          style:--drag-y={`${dragging ? drag?.dy ?? 0 : 0}px`}
          onpointerdown={(event) => pointerdown(event, index)}
          onpointermove={pointermove}
          onpointerup={pointerup}
          onpointercancel={() => (drag = null)}
          onlostpointercapture={() => (drag = null)}
          onclick={() => { if (opened && performance.now() >= suppressClickUntil) onselect(image); }}
        >
          <ProjectImage src={image} alt={`${title} interface ${index + 1}`} loading={index < 3 ? 'eager' : 'lazy'} />
          <span>{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
        </button>
      {/each}

      <button
          class="folder-front"
          bind:this={folderButton}
          type="button"
          aria-expanded={opened}
          aria-label={`${opened ? 'Close' : 'Open'} ${title} gallery, ${images.length} images`}
          onpointerenter={(event) => { if (event.pointerType === 'mouse') hovering = true; }}
          onpointerleave={() => (hovering = false)}
          onfocus={() => (hovering = true)}
          onblur={() => (hovering = false)}
          onclick={() => opened ? close() : open()}
      ><span>{title}.gallery <small>{images.length} {images.length === 1 ? 'image' : 'images'}</small></span></button>
    </div>
  </div>

  <div class="gallery-controls">
    <p aria-live="polite">{opened ? 'Drag any image down to close · Select to enlarge' : 'Open the folder to explore the project images'}</p>
    {#if opened}<button type="button" class="close-folder" onclick={close}>Close folder <span aria-hidden="true">↓</span></button>{/if}
  </div>
</div>

<style>
  .folder-gallery { --card-width: clamp(12rem, 22vw, 18rem); --card-height: clamp(16rem, 27vw, 21rem); --spread: clamp(7rem, 12vw, 10rem); --folder-height: clamp(10rem, 18vw, 14rem); --lift: calc(var(--folder-height) + 2rem); position: relative; isolation: isolate; padding: clamp(.75rem, 2vw, 1.5rem); border: 1px solid var(--border); border-radius: var(--radius); background: linear-gradient(135deg, #a9ddff30, #cdb8f530), var(--bg); }
  .folder-gallery { background: linear-gradient(135deg, #ffffff99, #e0efff80 45%, #eee8ff8c); border: 1px solid #ffffffb3; backdrop-filter: blur(6px) saturate(160%); -webkit-backdrop-filter: blur(6px) saturate(160%); box-shadow: inset 0 2px 0 #ffffffcc, inset 1px 0 0 #ffffff80, inset 0 -1px 0 #9bbfe040, 0 18px 48px #46739c20, 0 2px 8px #46739c0d; }
  :global(:root[data-theme='dark']) .folder-gallery { background: linear-gradient(135deg, #211d2baa, #20304380 45%, #30263b99); border-color: #ffffff30; box-shadow: inset 0 1px 0 #ffffff40, inset 1px 0 0 #ffffff1a, 0 18px 48px #00000040; }
  .folder-particles { position: absolute; z-index: 0; inset: 2rem 0 6rem; pointer-events: none; overflow: hidden; }
  .folder-particles::before { content: ''; position: absolute; inset: 4% 8% 0; border-radius: 50%; background: radial-gradient(ellipse, #8dd7ff33, #c6b4f51a 45%, transparent 72%); }
  .folder-particles::after { content: ''; position: absolute; left: 50%; top: 50%; width: min(85%, 48rem); aspect-ratio: 1.65; border: 1px solid #8accef66; border-radius: 50%; transform: translate(-50%, -40%) rotate(-12deg); }
  .particle { position: absolute; width: var(--size); height: var(--size); color: #4faee0; font-size: var(--size); line-height: 1; animation: particle-float var(--duration) ease-in-out var(--delay) infinite !important; }
  .particle.dot { border-radius: 50%; background: currentColor; }
  .particle:nth-child(3n + 1) { color: var(--accent); }
  @keyframes particle-float { 0%, 100% { opacity: .25; transform: translate3d(0, 0, 0) rotate(0deg); } 50% { opacity: .65; transform: translate3d(var(--drift), -24px, 0) rotate(25deg); } }
  @media (max-width: 600px) { .particle:nth-child(n + 9) { display: none; } }
  .folder-scroller { position: relative; z-index: 1; overflow-x: auto; overflow-y: hidden; padding-block: 1rem 1.5rem; overscroll-behavior-x: contain; scrollbar-color: var(--border) transparent; }
  .folder-stage { position: relative; width: 100%; height: 26rem; perspective: 1000px; }
  .opened .folder-stage { height: calc(var(--card-height) + var(--lift) + 6rem); min-width: calc((var(--count) - 1) * var(--spread) + var(--card-width) + 3rem); }
  .folder-back { position: absolute; left: 50%; bottom: 1.5rem; width: min(28.5rem, 80%); height: calc(var(--folder-height) + 3rem); border: 1px solid #5aaedd; border-radius: .8rem; background: linear-gradient(#96d9ff, #58b5eb); box-shadow: 0 1.5rem 2.5rem #2678a32b; transform: translateX(-50%); transition: opacity .35s, scale .35s; }
  .folder-back::before { content: ''; position: absolute; left: -1px; top: -1.5rem; width: 40%; height: 2rem; border: 1px solid #5aaedd; border-bottom: 0; border-radius: .8rem .8rem 0 0; background: #96d9ff; }
  .folder-back>div { position: absolute; inset: .5rem; border-radius: .5rem; background: #6bbced; }
  .photo { position: absolute; z-index: var(--layer); left: 50%; bottom: 2.5rem; display: grid; grid-template-rows: minmax(0, 1fr) auto; width: var(--card-width); height: var(--card-height); padding: .5rem; border: 1px solid var(--border); border-radius: .85rem; background: var(--surface); box-shadow: 0 1.2rem 2.5rem #00000030; transform-origin: bottom center; transform: translateX(-50%) translate(var(--stack), var(--stack-y)) rotate(var(--angle)) scale(var(--scale)); transition: transform .6s cubic-bezier(.22, 1.15, .36, 1), box-shadow .3s; pointer-events: none; user-select: none; touch-action: pan-x pinch-zoom; }
  .hovering:not(.opened) .photo { transform: translateX(-50%) translate(var(--fan), var(--fan-y)) rotate(var(--angle)) scale(var(--scale)); }
  .photo :global(img) { display: block; width: 100%; height: 100%; min-height: 0; object-fit: contain; pointer-events: none; border-radius: .4rem; }
  .photo :global(.image-fallback) { min-height: 0; font-size: .75rem; }
  .opened .photo:is(:hover, :focus-visible) { background: var(--surface-alt); border-color: var(--accent); }
  .photo>span { display: block; padding: .45rem 0 .1rem; color: var(--muted); font-size: .6875rem; letter-spacing: .08em; }
  .folder-front { position: absolute; z-index: 30; left: 50%; bottom: 0; display: flex; align-items: end; justify-content: center; width: min(30rem, 86%); height: var(--folder-height); padding: 1.5rem; border: 1px solid #7bc4ee; border-radius: 1rem; background: linear-gradient(#b7e8ff, #71c8f3); box-shadow: inset 0 2px 10px #ffffff80, 0 -.75rem 2rem #2678a329; transform-origin: bottom; transform: translateX(-50%); transition: transform .45s var(--ease-out), scale .25s var(--ease-out), filter .25s ease, opacity .3s !important; color: #174965; }
  .folder-front:is(:hover, :focus-visible) { scale: 1.04; filter: brightness(1.05); }
  .folder-front:active { scale: .98; }
  .folder-front::before { content: ''; position: absolute; inset: 0 1rem auto; height: 1px; background: linear-gradient(90deg, transparent, #ffffff66, transparent); }
  .folder-front>span { max-width: 100%; padding: .65rem 1rem; border: 1px solid #ffffff99; border-radius: .5rem; background: #dff4ff; font-size: 1rem; font-weight: 600; overflow-wrap: anywhere; }
  .folder-front small { display: block; color: #32668a; font-size: .8125rem; font-weight: 400; }
  .hovering:not(.opened) .folder-front { transform: translateX(-50%) translateY(10px) rotateX(-25deg); }
  .opened .folder-front { transform: translateX(-50%) translateY(10px) rotateX(-25deg); }
  .opened .photo { transform: translateX(-50%) translate(calc(var(--offset) * var(--spread) + var(--drag-x)), calc(0px - var(--lift) + var(--drag-y))) scale(1.05); pointer-events: auto; cursor: grab; }
  .opened .photo:is(:hover, :focus-visible) { z-index: 40; transform: translateX(-50%) translate(calc(var(--offset) * var(--spread)), calc(0px - var(--lift) - .5rem)) scale(1.1); }
  .opened .photo.dragging { z-index: 50; transform: translateX(-50%) translate(calc(var(--offset) * var(--spread) + var(--drag-x)), calc(0px - var(--lift) + var(--drag-y))) rotate(5deg) scale(1.12); transition: none; cursor: grabbing; }
  .gallery-controls { position: relative; z-index: 1; display: flex; min-height: 4rem; align-items: center; justify-content: center; flex-wrap: wrap; gap: .75rem 1.25rem; padding: .75rem .25rem 0; text-align: center; }
  .gallery-controls p { margin: 0; color: var(--muted); font-size: .8125rem; }
  .close-folder { display: inline-flex; align-items: center; gap: .75rem; min-height: 44px; padding: .5rem 1rem; border: 1px solid var(--border); border-radius: 99px; background: var(--surface); font-size: .8125rem; transition: transform .2s var(--ease-out); }
  @media (max-width: 600px) { .folder-stage { height: 24rem; } .opened .folder-stage { height: calc(var(--card-height) + var(--lift) + 5rem); } .opened .photo { bottom: 1rem; } }
  @media (prefers-reduced-motion: reduce) { .photo, .folder-front, .folder-back, .close-folder { transition: none; } }
</style>
