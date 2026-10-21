<script lang="ts">
  import { onMount } from 'svelte';

  let { variant = 'fluid' }: { variant?: 'fluid' | 'particles' | 'drift' } = $props();
  let canvas: HTMLCanvasElement;

  onMount(() => {
    const context = canvas.getContext('2d');
    const hero = canvas.parentElement;
    if (!context || !hero) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let previous = 0;
    let visible = true;
    let pointer: { x: number; y: number } | null = null;
    let fluidPointer = { x: .5, y: .5 };
    let particles: { x: number; y: number; vx: number; vy: number; color: number; life: number }[] = [];
    const colors = ['138, 91, 220', '67, 162, 228', '70, 189, 197'];

    function resize() {
      if (!context) return;
      width = hero!.clientWidth;
      height = hero!.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.min(180, Math.max(60, Math.floor(width * height / 6000))) }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        color: index % colors.length,
        life: Math.random() * 220
      }));
    }

    function draw(time: number) {
      frame = 0;
      if (!context || !visible || document.hidden) return;
      frame = requestAnimationFrame(draw);
      if (time - previous < 1000 / 30) return;
      const step = Math.min((time - previous) / 16.67, 2);
      previous = time;
      const phase = time * .00012;

      context.clearRect(0, 0, width, height);
      if (variant === 'fluid') {
        // Broad, overlapping dye currents instead of accumulating hairline trails.
        fluidPointer.x += ((pointer ? pointer.x / width : .5) - fluidPointer.x) * .025;
        fluidPointer.y += ((pointer ? pointer.y / height : .5) - fluidPointer.y) * .025;
        const driftX = (fluidPointer.x - .5) * width * .16;
        const driftY = (fluidPointer.y - .5) * height * .16;
        for (let i = 0; i < 9; i++) {
          const orbit = phase * .65 + i * Math.PI * 2 / 9;
          const x = width * (.5 + Math.cos(orbit) * .35) + driftX;
          const y = height * (.5 + Math.sin(orbit * 1.3 + i * .4) * .32) + driftY;
          const radius = Math.min(width, height) * (.26 + Math.sin(orbit + i) * .04);
          context.save();
          context.translate(x, y);
          context.rotate(orbit * .6);
          context.scale(1.6, .75);
          const dye = context.createRadialGradient(0, 0, 0, 0, 0, radius);
          dye.addColorStop(0, `rgba(${colors[i % colors.length]}, .22)`);
          dye.addColorStop(.45, `rgba(${colors[i % colors.length]}, .10)`);
          dye.addColorStop(1, `rgba(${colors[i % colors.length]}, 0)`);
          context.fillStyle = dye;
          context.fillRect(-radius, -radius, radius * 2, radius * 2);
          context.restore();
        }
        return;
      }

      for (const particle of particles) {
        const angle = Math.sin(particle.x * .004 + phase) * 2 + Math.cos(particle.y * .005 - phase) * 2;
        const speed = variant === 'particles' ? .45 : 1.1;
        let vx = Math.cos(angle) * speed;
        let vy = Math.sin(angle) * speed;
        if (variant === 'drift') {
          vx = Math.sin(phase + particle.y * .003) * .35;
          vy = -.3 - particle.color * .15;
        }
        if (pointer) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 1 && distance < 180) {
            const force = (1 - distance / 180) * 3;
            vx += -dy / distance * force;
            vy += dx / distance * force;
          }
        }
        particle.vx += (vx - particle.vx) * .08;
        particle.vy += (vy - particle.vy) * .08;
        particle.x += particle.vx * step;
        particle.y += particle.vy * step;
        particle.life += step;
        if (particle.x < 0 || particle.x > width || particle.y < 0 || particle.y > height || particle.life > 260) {
          particle.x = Math.random() * width;
          particle.y = Math.random() * height;
          particle.life = 0;
          continue;
        }
        const opacity = Math.min(1, particle.life / 20, (260 - particle.life) / 30);
        context.beginPath();
        const radius = variant === 'drift' ? 1.5 + particle.color * 1.4 : particle.color === 0 ? 2.4 : 1.6;
        context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${colors[particle.color]}, ${opacity * .65})`;
        context.fill();
      }

      if (variant === 'particles') {
        context.lineWidth = .7;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const distance = Math.hypot(a.x - b.x, a.y - b.y);
            if (distance >= 100) continue;
            const opacity = (1 - distance / 100) * .18 * Math.min(1, a.life / 20, b.life / 20);
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.strokeStyle = `rgba(${colors[a.color]}, ${opacity})`;
            context.stroke();
          }
        }
      }
    }

    function resume() {
      if (!frame && visible && !document.hidden) {
        previous = performance.now();
        frame = requestAnimationFrame(draw);
      }
    }

    function move(event: PointerEvent) {
      const bounds = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    }

    const leave = () => { pointer = null; };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      resume();
    });
    resize();
    resizeObserver.observe(hero);
    intersectionObserver.observe(hero);
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', resume);
    resume();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', resume);
    };
  });
</script>

<canvas class="fluid-particles" data-variant={variant} bind:this={canvas} aria-hidden="true"></canvas>

<style>
  .fluid-particles { position: absolute; z-index: 0; inset: 0; display: block; width: 100%; height: 100%; pointer-events: none; }
</style>
