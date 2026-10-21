<script lang="ts">
  import Header from '$lib/Header.svelte';
  import FeaturedCarousel from '$lib/FeaturedCarousel.svelte';
  import FluidParticlesBackground from '$lib/FluidParticlesBackground.svelte';
  import ProjectImage from '$lib/ProjectImage.svelte';
  import { reveal } from '$lib/reveal';
  import { projects } from '$lib/projects';
</script>

<svelte:head>
  <title>SYERRY — Web & App Developer</title>
  <meta name="description" content="Selected web and application work by SYERRY." />
</svelte:head>

<Header />

<main id="top">
  <section class="hero">
    <FluidParticlesBackground />
    <div class="hero-art" aria-hidden="true">
      <svg class="swirl swirl-one" viewBox="0 0 600 600" fill="none"><path d="M515.266 181.33C377.943 51.564 128.537 136.256 50.8123 293.565C-26.9127 450.874 125.728 600 125.728 600" /></svg>
      <svg class="swirl swirl-two" viewBox="0 0 700 700" fill="none"><path d="M26.8838 528.274C193.934 689.816 480.051 637.218 594.397 451.983C708.742 266.748 543.953 2.22235 543.953 2.22235" /></svg>
      <span class="shot shot-one"><ProjectImage src="/projects/etow-reference.png" alt="" loading="eager" priority /></span>
      <span class="shot shot-two"><ProjectImage src="/projects/jksm.webp" alt="" loading="eager" priority /></span>
      <span class="shot shot-three"><ProjectImage src="/projects/enilai-online.webp" alt="" loading="eager" /></span>
      <span class="shot shot-four"><ProjectImage src="/projects/icomm-mpaj.webp" alt="" loading="eager" /></span>
      <span class="spark spark-one">✦</span><span class="spark spark-two">✦</span>
    </div>
    <div class="hero-copy">
      <p class="eyebrow">Web & App Developer · Integration Specialist</p>
      <h1>I design and build useful digital experiences.</h1>
      <p class="intro">From mobile applications to GIS dashboards, I turn real requirements into clear, working products.</p>
      <a class="button" href="/projects">View projects <span>↗</span></a>
    </div>

  </section>

  <section class="work" id="work">
    <header class="section-head" use:reveal><p class="eyebrow">Featured work</p><h2>A few selected projects.</h2></header>
    <FeaturedCarousel items={projects.filter((project) => project.featured !== false)} />
    <div class="view-all" use:reveal><a class="button button-light" href="/projects">View all projects <span>↗</span></a></div>
  </section>

  <section class="about" id="about">

    <p class="eyebrow" use:reveal>About me</p>
    <div class="about-copy" use:reveal={100}><h2>Hello, I’m Syerry.</h2><p>I build web and mobile applications across multiple technology stacks, with broad experience in enterprise systems, ecommerce, asset management and GIS.</p></div>
    <div class="about-particles" aria-hidden="true">
      {#each Array(16) as _, index}
        <span
            class="about-particle"
            class:dot={index % 4 !== 0}
            style:left={`${4 + (index * 17) % 92}%`}
            style:top={`${12 + (index * 29) % 76}%`}
            style:--size={`${index % 4 === 0 ? 22 : 5 + index % 4}px`}
            style:--delay={`${index * -.6}s`}
            style:--duration={`${5 + index % 4}s`}
            style:--drift={`${index % 2 ? 15 : -15}px`}
        >{index % 4 === 0 ? '✦' : ''}</span>
      {/each}
    </div>
  </section>

</main>

<style>
  @import './home.css';

  .about { position: relative; isolation: isolate; overflow: hidden; }
  .about>.eyebrow { grid-column: 1; grid-row: 1; }
  .about>.about-copy { grid-column: 2; grid-row: 1; width: 100%; }
  .about>.about-particles { position: absolute; z-index: 0; inset: 0; width: 100%; max-width: none; pointer-events: none; }
  .about-particle { position: absolute; width: var(--size); height: var(--size); color: var(--accent); font-size: var(--size); line-height: 1; animation: about-float var(--duration) ease-in-out var(--delay) infinite !important; }
  .about-particle.dot { border-radius: 50%; background: currentColor; }
  .about-particle:nth-child(2n) { color: #4faee0; }
  @keyframes about-float { 0%, 100% { opacity: .15; transform: translate3d(0, 0, 0) rotate(0deg); } 50% { opacity: .45; transform: translate3d(var(--drift), -22px, 0) rotate(30deg); } }
  @media (max-width: 760px) { .about>.eyebrow { grid-column: 1; grid-row: 1; } .about>.about-copy { grid-column: 1; grid-row: 2; } }
  @media (max-width: 600px) { .about-particle:nth-child(n + 9) { display: none; } }
</style>
