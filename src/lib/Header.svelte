<script lang="ts">
  import ThemeToggle from './ThemeToggle.svelte';

  let contactOpen = $state(false);
  let contactRoot: HTMLDivElement;
  let contactButton: HTMLButtonElement;

  function closeContact() {
    contactOpen = false;
    contactButton.focus({ preventScroll: true });
  }
</script>

<svelte:window onclick={(event) => { if (contactOpen && !contactRoot.contains(event.target as Node)) contactOpen = false; }} onkeydown={(event) => { if (contactOpen && event.key === 'Escape') closeContact(); }} />

<header class="nav">
  <a class="logo" href="/">SYERRY</a>
  <nav aria-label="Primary navigation">
    <a href="/projects">Projects</a>
    <a href="/#about">About</a>
    <div class="contact-wrap" bind:this={contactRoot}>
      <button class="contact-trigger" bind:this={contactButton} type="button" aria-expanded={contactOpen} aria-controls="contact-card" onclick={() => (contactOpen = !contactOpen)}><svg class="contact-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></svg>Contact</button>
      {#if contactOpen}
        <div class="contact-card" id="contact-card" role="dialog" aria-labelledby="contact-title">
          <p id="contact-title">Contact</p>
          <button class="contact-close" type="button" aria-label="Close contact card" onclick={closeContact}>×</button>
          <a class="contact-row" href="mailto:syahirahzakariah@gmail.com">
            <span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></svg></span>
            <span><small>Email</small>syahirahzakariah@gmail.com</span>
          </a>
          <a class="contact-row" href="tel:+601158159556">
            <span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" /></svg></span>
            <span><small>Phone</small>+6011-58159556</span>
          </a>
        </div>
      {/if}
    </div>
    <ThemeToggle />
  </nav>
</header>

<style>
  .contact-wrap { position: relative; }
  .nav .contact-trigger { --button-bg: #e0f2fe; --button-text: #075985; --button-hover: #bae6fd; --button-active: #7dd3fc; --button-shadow: #38bdf833; display: inline-flex; align-items: center; gap: .45rem; min-height: 44px; padding: .4rem .85rem; border: 1px solid #7bc4ee; border-radius: .7rem; font-size: .875rem; font-weight: 600; }
  .contact-trigger-icon { width: 18px; height: 18px; }
  .contact-card { position: absolute; z-index: 70; top: calc(100% + .75rem); right: 0; width: min(21rem, calc(100vw - 2.5rem)); padding: 1rem; border: 1px solid var(--border); border-radius: 1rem; background: var(--surface); color: var(--text); box-shadow: 0 12px 35px #25144126; animation: contact-enter .2s var(--ease-out); }
  .contact-card>p { margin: 0 0 .75rem; padding-right: 2rem; font-weight: 700; }
  .contact-close { position: absolute; top: .65rem; right: .65rem; display: grid; place-items: center; width: 30px; height: 30px; padding: 0; border: 0; border-radius: 50%; font-size: 1.3rem; line-height: 1; }
  .contact-card .contact-row { display: flex; align-items: center; gap: .75rem; min-height: 56px; padding: .5rem; border-radius: .65rem; font-size: .8125rem; transition: background-color .2s, translate .2s; }
  .contact-row:is(:hover, :focus-visible) { background: var(--surface-alt); translate: 2px 0; }
  .contact-icon { display: grid; place-items: center; flex-shrink: 0; width: 36px; height: 36px; border-radius: .6rem; background: var(--surface-alt); color: var(--accent); }
  .contact-icon svg { width: 20px; height: 20px; }
  .contact-row>span:last-child { min-width: 0; overflow-wrap: anywhere; }
  .contact-row small { display: block; margin-bottom: .1rem; color: var(--muted); font-size: .6875rem; }
  @keyframes contact-enter { from { opacity: 0; transform: translateY(-6px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @media (max-width: 540px) { .contact-card { right: -3.5rem; } }
</style>
