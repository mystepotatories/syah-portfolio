<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { projects, projectSlug } from '$lib/projects';
  const featuredProjects = projects.slice(0, 3);
</script>

<svelte:head>
  <title>SYERRY — Web & App Developer</title>
  <meta name="description" content="Selected web and application work by SYERRY." />
</svelte:head>

<header class="nav">
  <a class="logo" href="#top">SYAHIRAH</a>
  <nav aria-label="Primary navigation"><a href="/projects">Projects</a><a href="#about">About</a><a href="mailto:hello@nursyahirah.dev">Contact</a></nav>
</header>

<main id="top">
  <section class="hero">
    <div class="hero-copy" in:fly={{ y: 24, duration: 500 }}>
      <p class="eyebrow">Web & App Developer · Kuala Lumpur</p>
      <h1>I design and build useful digital experiences.</h1>
      <p class="intro">From mobile applications to GIS dashboards, I turn real requirements into clear, working products.</p>
      <a class="button" href="/projects">View projects <span>↗</span></a>
    </div>
    <div class="hero-art" aria-label="Preview of selected application projects" in:fade={{ duration: 700 }}>
      <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
      <img class="shot shot-one" src="/projects/baron-hotel.png" alt="Baron Hotel travel application" fetchpriority="high" />
      <img class="shot shot-two" src="/projects/etow-reference.png" alt="eTow towing application" fetchpriority="high" />
      <span class="spark spark-one">✦</span><span class="spark spark-two">✦</span>
    </div>
  </section>

  <section class="work" id="work">
    <header class="section-head"><p class="eyebrow">Featured work</p><h2>A few selected projects.</h2></header>
    <div class="project-grid">
      {#each featuredProjects as project, index}
        <article class={`project ${project.tone}`}>
          <a href={`/projects/${projectSlug(project.title)}`} aria-label={`View ${project.title}`}>
            <span class="project-number">0{index + 1}</span>
            <div class="project-image"><img src={project.image} alt={`${project.title} project interface`} loading="lazy" /></div>
            <div class="project-copy"><p>{project.category}</p><h3>{project.title}</h3><span>View project ↗</span></div>
          </a>
        </article>
      {/each}
    </div>
    <div class="view-all"><a class="button button-light" href="/projects">View all projects <span>↗</span></a></div>
  </section>

  <section class="about" id="about">
    <p class="eyebrow">About me</p>
    <div><h2>Hello, I’m SYERRY.</h2><p>I create web and mobile products across travel, ecommerce, services, asset management and GIS. I care about interfaces that feel clear, approachable and useful.</p></div>
  </section>

</main>

<style>@import './style.css';</style>
