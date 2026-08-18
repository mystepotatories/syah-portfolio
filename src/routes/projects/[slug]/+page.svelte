<script lang="ts">
  import { fade } from 'svelte/transition';
  import { projectSlug } from '$lib/projects';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let zoomedImage = $state('');

  const iconFor = (technology: string) => {
    const name = technology.toLowerCase();
    const base = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
    if (name.includes('flutter')) return `${base}/flutter/flutter-original.svg`;
    if (name.includes('firebase') || name.includes('firestore')) return `${base}/firebase/firebase-original.svg`;
    if (name.includes('sqlite')) return `${base}/sqlite/sqlite-original.svg`;
    if (name.includes('wordpress')) return `${base}/wordpress/wordpress-plain.svg`;
    if (name.includes('ionic')) return `${base}/ionic/ionic-original.svg`;
    if (name.includes('mysql')) return `${base}/mysql/mysql-original.svg`;
    if (name.includes('laravel')) return `${base}/laravel/laravel-original.svg`;
    if (name.includes('mssql')) return `${base}/microsoftsqlserver/microsoftsqlserver-plain.svg`;
    return '';
  };
</script>

<svelte:head><title>{data.project.title} — SYERRY</title><meta name="description" content={data.project.desc} /></svelte:head>
<svelte:window on:keydown={(event) => event.key === 'Escape' && (zoomedImage = '')} />

<header class="nav"><a class="logo" href="/">SYAHIRAH</a><nav aria-label="Primary navigation"><a href="/projects">All projects</a><a href="/#about">About</a><a href="mailto:hello@nursyahirah.dev">Contact</a></nav></header>

<main>
  <section class={`project-hero ${data.project.tone}`}>
    <div class="hero-copy"><a class="back" href="/projects">← All projects</a><p>{data.project.category}</p><h1>{data.project.title}</h1><span>{data.project.desc}</span></div>
    <button class="hero-image" type="button" on:click={() => (zoomedImage = data.project.image)} aria-label="Enlarge cover image"><img src={data.project.image} alt={`${data.project.title} project interface`} fetchpriority="high" /><i>Enlarge ↗</i></button>
  </section>

  <section class="details">
    <div class="detail-block"><p class="label">Technologies</p><div class="technology-grid">{#each data.project.technologies as technology}<div class="technology">{#if iconFor(technology)}<img src={iconFor(technology)} alt="" />{:else}<span aria-hidden="true">◆</span>{/if}<b>{technology}</b></div>{/each}</div>{#if data.project.cvNote}<p class="cv-note">{data.project.cvNote}</p>{/if}</div>
    <div class="detail-block"><p class="label">Use cases</p><ul>{#each data.project.useCases as item}<li>{item}</li>{/each}</ul></div>
    <div class="detail-block"><p class="label">Edge-case thinking</p><ul>{#each data.project.edgeCases as item}<li>{item}</li>{/each}</ul></div>
  </section>

  <section class="gallery"><header><p class="label">Project gallery</p><h2>Interface details</h2></header><div>{#each data.project.images as image, index}<button type="button" on:click={() => (zoomedImage = image)} aria-label={`Enlarge project image ${index + 1}`}><img src={image} alt={`${data.project.title} interface ${index + 1}`} loading={index ? 'lazy' : 'eager'} /><span>0{index + 1} · Enlarge ↗</span></button>{/each}</div></section>

  <a class="next-project" href={`/projects/${projectSlug(data.next.title)}`}><span>Next project</span><b>{data.next.title} →</b></a>
</main>

{#if zoomedImage}<div class="lightbox" role="dialog" aria-modal="true" aria-label="Enlarged project image" transition:fade={{ duration: 140 }}><button type="button" on:click={() => (zoomedImage = '')} aria-label="Close enlarged image">×</button><img src={zoomedImage} alt="Enlarged project interface" /></div>{/if}

<style>@import './project.css';</style>
