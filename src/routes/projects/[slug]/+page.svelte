<script lang="ts">
  import { fade } from 'svelte/transition';
  import { projectSlug } from '$lib/projects';
  import Header from '$lib/Header.svelte';
  import ProjectImage from '$lib/ProjectImage.svelte';
  import InteractiveFolderGallery from '$lib/InteractiveFolderGallery.svelte';
  import FluidParticlesBackground from '$lib/FluidParticlesBackground.svelte';
  import OceanBackground from '$lib/OceanBackground.svelte';
  import { reveal } from '$lib/reveal';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let zoomedImage = $state('');

  $effect(() => {
    if (!zoomedImage) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = previousOverflow; };
  });

  const technologyIcons: Record<string, string> = {
    react: 'react.png',
    'node.js': 'nodejs.svg',
    laravel: 'laravel.svg',
    fme: 'fme.png',
    arcgis: 'arcgis.png',
    oracle: 'oracle.png',
    vue: 'vue.svg',
    inertia: 'inertia.png',
    wordpress: 'wordpress.png',
    woocommerce: 'woocommerce.png',
    wpbakery: 'wpbakery.png',
    billplz: 'billplz.svg',
    'j&t': 'jnt.png',
    kpkt: 'kpkt.png',
    'mbs clicks': 'mbs.png',
    elementor: 'elementor.svg',
    php: 'php.svg',
    html: 'html.svg',
    css: 'css.svg',
    flutter: 'flutter.svg',
    firebase: 'firebase.png',
    firestore: 'firebase.png',
    sqlite: 'sqlite.svg',
    ionic: 'ionic.png',
    ipay88: 'ipay88.png',
    mysql: 'mysql.png',
    mssql: 'mssql.svg'
  };

  const iconFor = (technology: string) => {
    const icon = Object.entries(technologyIcons).find(([name]) => technology.toLowerCase().includes(name))?.[1];
    return icon ? `/technologies/${icon}` : '';
  };
</script>

<svelte:head><title>{data.project.title} — SYERRY</title><meta name="description" content={data.project.desc} /></svelte:head>
<svelte:window onkeydown={(event) => event.key === 'Escape' && (zoomedImage = '')} />

<Header />

{#key data.project.title}<main>
  <section class={`project-hero ${data.project.tone}`}>
    <div class="hero-particles" aria-hidden="true"><FluidParticlesBackground variant="zero-gravity" /></div>
    <div class="hero-copy" use:reveal><a class="back" href="/projects">← All projects</a><p>{data.project.category}</p><h1>{data.project.title}</h1><span>{data.project.desc}</span></div>
    <button class="hero-image" disabled={!data.project.image} type="button" onclick={() => (zoomedImage = data.project.image)} aria-label="Enlarge cover image"><ProjectImage src={data.project.image} alt={`${data.project.title} project interface`} loading="eager" priority />{#if data.project.image}<i>Enlarge ↗</i>{/if}</button>
  </section>

  <section class="details">
    <div class="detail-block" use:reveal><p class="label">Technologies</p><div class="technology-grid">{#each data.project.technologies as technology}<div class="technology">{#if iconFor(technology)}<img src={iconFor(technology)} alt="" width="24" height="24" />{/if}<b>{technology}</b></div>{/each}</div></div>
    <div class="detail-block" use:reveal><p class="label">Use cases</p><ul>{#each data.project.useCases as item}<li>{item}</li>{/each}</ul></div>
    <div class="detail-block" use:reveal><p class="label">Edge-case thinking</p><ul>{#each data.project.edgeCases as item}<li>{item}</li>{/each}</ul></div>
  </section>

  {#if data.project.images.length}<section class="gallery-section"><div class="gallery-ocean" aria-hidden="true"><OceanBackground /></div><div class="gallery"><header use:reveal><p class="label">Project gallery</p>
    <!-- <h2>Interface details</h2> -->
  </header><InteractiveFolderGallery images={data.project.images} title={data.project.title} onselect={(image) => (zoomedImage = image)} /></div></section>{/if}

  <nav class="project-pagination" aria-label="Project navigation">
    <a class="next-project" use:reveal href={`/projects/${projectSlug(data.previous.title)}`}><span>Previous project</span><b>← {data.previous.title}</b></a>
    <a class="next-project forward" use:reveal href={`/projects/${projectSlug(data.next.title)}`}><span>Next project</span><b>{data.next.title} →</b></a>
  </nav>
</main>{/key}

{#if zoomedImage}<div class="lightbox" role="dialog" aria-modal="true" aria-label="Enlarged project image" tabindex="-1" transition:fade={{ duration: 140 }}><button type="button" onclick={() => (zoomedImage = '')} aria-label="Close enlarged image">×</button><ProjectImage src={zoomedImage} alt="Enlarged project interface" loading="eager" /></div>{/if}

<style>
  @import '../../../../project.css';
  /* Keep background positioning local so Svelte scopes these wrapper classes. */
  .hero-particles, .gallery-ocean { position: absolute; z-index: 0; inset: 0; overflow: hidden; contain: paint; pointer-events: none; }
  .gallery-section { position: relative; isolation: isolate; overflow: clip; }
  .gallery { position: relative; z-index: 1; max-width: 76rem; margin: auto; padding: clamp(2rem, 4vw, 3rem) var(--gutter); }
  .lightbox>button { z-index: 2; }
  .project-pagination { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(1rem, 4vw, 4rem); padding: clamp(1.5rem, 3vw, 2.25rem) var(--gutter); background: var(--surface-alt); }
  .project-pagination>.next-project { min-width: 0; align-content: start; padding: 0; background: transparent; }
  .project-pagination .next-project b { font-size: clamp(1rem, 1.8vw, 1.5rem); line-height: 1.4; }
  .project-pagination .next-project span { font-size: .6875rem; }
  .forward { justify-items: end; text-align: right; }
  .forward b { transform-origin: right center; }
</style>
