<script lang="ts">
  import { projects, projectSlug } from '$lib/projects';
</script>

<svelte:head><title>Projects — SYERRY</title></svelte:head>

<header><a href="/">SYAHIRAH</a><a href="/#about">About</a></header>
<main>
  <p>Selected work</p>
  <h1>Projects</h1>
  <section>
    {#each projects as project, index}
      <article class={project.tone}>
        <a href={`/projects/${projectSlug(project.title)}`}>
          <span>0{index + 1}</span>
          <img src={project.image} alt={`${project.title} project interface`} />
          <div><small>{project.category}</small><h2>{project.title}</h2><p>{project.desc}</p><b>View project ↗</b></div>
        </a>
      </article>
    {/each}
  </section>
</main>

<style>
  :global(*){box-sizing:border-box} :global(body){margin:0;background:#11100e;color:#f6f0e5;font-family:Arial,sans-serif} header{display:flex;justify-content:space-between;padding:1.5rem 4vw} a{color:inherit;text-decoration:none} main{padding:5vw} h1{font-size:clamp(4rem,12vw,10rem);margin:.1em 0 .5em} section{display:grid;gap:2rem} article{background:#24211d} article a{display:grid;grid-template-columns:3rem minmax(0,1fr) minmax(16rem,.7fr);gap:2rem;align-items:center;padding:2rem} img{width:100%;max-height:28rem;object-fit:contain} h2{font-size:clamp(2rem,5vw,5rem);margin:.15em 0} p{line-height:1.6} b{color:#ffc400}@media(max-width:700px){article a{grid-template-columns:1fr}article a>span{display:none}}
</style>
