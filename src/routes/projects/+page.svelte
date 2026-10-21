<script lang="ts">
  import { projects, projectSlug } from '$lib/projects';
  import Header from '$lib/Header.svelte';
  import ProjectImage from '$lib/ProjectImage.svelte';
  import FluidParticlesBackground from '$lib/FluidParticlesBackground.svelte';
  import { reveal } from '$lib/reveal';
</script>

<svelte:head><title>Projects — SYERRY</title></svelte:head>

<Header />
<div class="projects-shell">
  <div class="particle-backdrop" aria-hidden="true">
    <div class="particle-viewport"><FluidParticlesBackground variant="drift" /></div>
  </div>
<main class="projects-page">
  <p class="eyebrow" use:reveal>Selected work</p>
  <h1 use:reveal={80}>Projects</h1>
  <section>
    {#each projects as project, index}
      <article class={project.tone} use:reveal={80}>
        <a class="project-card" href={`/projects/${projectSlug(project.title)}`}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div class="list-image"><ProjectImage src={project.image} alt={`${project.title} project interface`} /></div>
          <div><small>{project.category}</small><h2>{project.title}</h2><p>{project.desc}</p><b class="text-link">View project ↗</b></div>
        </a>
      </article>
    {/each}
  </section>
</main>
</div>

<style>
  .projects-shell{position:relative;isolation:isolate;overflow:clip}
  .projects-page{position:relative;z-index:1;max-width:88rem;margin:auto;padding:clamp(2rem,5vw,4rem) var(--gutter)}
  .particle-backdrop{position:absolute;z-index:0;inset:0;pointer-events:none}
  .particle-viewport{position:sticky;top:0;height:100vh;height:100dvh}
  h1{font-size:clamp(2.75rem,6vw,5rem);margin:0 0 2rem;line-height:1.1}
  section{display:grid;gap:1.25rem}
  article{border-radius:var(--radius);color:var(--card-ink);overflow:hidden}
  article a{display:grid;grid-template-columns:2rem minmax(0,1.1fr) minmax(0,1fr);gap:clamp(1rem,3vw,2.5rem);align-items:center;padding:clamp(1.25rem,3vw,2.5rem)}
  article a>span{align-self:start;font-weight:600}
  .list-image{display:grid;grid-template-rows:minmax(0,1fr);place-items:center;height:clamp(15rem,26vw,23rem);min-width:0}
  .list-image :global(img){display:block;min-width:0;min-height:0;max-height:100%;width:100%;height:100%;object-fit:contain;transition:transform .5s var(--ease-out)}
  small{font-size:.8rem;font-weight:700}
  h2{font-size:clamp(1.75rem,3vw,2.75rem);margin:.4rem 0;line-height:1.15}
  p{line-height:1.65} b{display:inline-block;margin-top:.5rem}
  @media(hover:hover){article a:hover .list-image :global(img){transform:translateY(-4px)}}
  @media(max-width:700px){article a{grid-template-columns:1fr;gap:1.25rem}article a>span{display:none}.list-image{height:18rem}}
</style>
