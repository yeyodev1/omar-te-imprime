<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { gsap, splitWords, prefersReducedMotion } from '@/composables/useMotion'
import { cld, cldSet } from '@/data/cloudinary'

const root = ref<HTMLElement>()
const title = ref<HTMLElement>()
let ctx: gsap.Context | null = null

const shots = [
  { id: 'cliente-figuras', caption: 'Dos personas, en versión de bolsillo', tag: 'Cartoonízame', speed: -8 },
  { id: 'cliente-cumple', caption: 'Un cumpleaños que no se olvida', tag: 'Cumpleaños', speed: 10 },
  { id: 'cliente-mascota', caption: 'Su compañera de cuatro patas', tag: 'Mascotas', speed: -14 },
  { id: 'bobblehead', caption: 'Con su fiel compañero', tag: 'Bobblehead', speed: 6 },
]

onMounted(() => {
  ctx = gsap.context(() => {
    const words = splitWords(title.value!)
    if (prefersReducedMotion()) return
    gsap.from(words, {
      yPercent: 115,
      rotate: 3,
      duration: 1.2,
      stagger: 0.07,
      ease: 'expo.out',
      scrollTrigger: { trigger: title.value, start: 'top 85%' },
    })
    const mm = gsap.matchMedia()
    mm.add('(max-width: 819px)', () => {
      const grid = root.value!.querySelector<HTMLElement>('.gallery__grid')!
      grid.classList.add('is-pinned')
      const distance = () => grid.scrollWidth - window.innerWidth
      const tween = gsap.to(grid, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.value,
          start: 'top top',
          end: () => `+=${distance() * 1.2}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
      gsap.utils.toArray<HTMLElement>('.shot').forEach((el, i) => {
        gsap.fromTo(
          el,
          { rotate: i % 2 ? 6 : -6, scale: 0.88 },
          {
            rotate: i % 2 ? -3 : 3,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: el, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
          },
        )
      })
      return () => grid.classList.remove('is-pinned')
    })
    mm.add('(min-width: 820px)', () => {
      gsap.utils.toArray<HTMLElement>('.shot').forEach((el) => {
        gsap.to(el, {
          yPercent: Number(el.dataset.speed),
          ease: 'none',
          scrollTrigger: { trigger: '.gallery__grid', start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })
    gsap.from('.shot__frame', {
      clipPath: 'inset(100% 0% 0% 0% round 22px)',
      duration: 1.3,
      stagger: 0.12,
      ease: 'expo.inOut',
      scrollTrigger: { trigger: '.gallery__grid', start: 'top 92%' },
    })
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="gallery">
    <div class="gallery__wrap">
      <span class="gallery__eyebrow">03 — Clientes reales</span>
      <h2 ref="title" class="gallery__title">Ya viven en <em class="serif">otras casas.</em></h2>
      <p class="gallery__lead">Cada figura sale del taller con una historia. Estas son algunas de las que ya encontraron su repisa.</p>
    </div>
    <div class="gallery__grid">
      <figure v-for="s in shots" :key="s.id" class="shot" :data-speed="s.speed">
        <div class="shot__frame">
          <img :src="cld(s.id, 800)" :srcset="cldSet(s.id, [420, 640, 900])" sizes="(min-width: 820px) 24vw, 72vw" :alt="s.caption" loading="lazy" />
          <span class="shot__tag">{{ s.tag }}</span>
        </div>
        <figcaption>{{ s.caption }}</figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped lang="scss">
.gallery {
  background: $ink;
  padding: 0 0 60px;

  @media (max-width: 819px) {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 70px 0 30px;
  }

  @include up($bp-md) {
    padding: 40px 0 120px;
  }
  overflow: hidden;

  &__wrap {
    @include container;
    display: grid;
    gap: 14px;
    margin-bottom: 20px;

    @include up($bp-md) {
      padding-top: 0;
      margin-bottom: 44px;
    }
  }

  &__eyebrow {
    @include eyebrow;
    color: $muted;
  }

  &__title {
    @include display(3rem, 8rem);
    em {
      color: $lime;
    }
  }

  &__lead {
    color: rgba($paper, 0.65);
    max-width: 30rem;
  }

  // Móvil: carrusel nativo con snap; escritorio: cuadrícula con parallax.
  &__grid {
    display: flex;
    will-change: transform;
    gap: 14px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: 10px $gutter 20px;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }

    &.is-pinned {
      overflow: visible;
      width: max-content;
      scroll-snap-type: none;
    }

    @include up($bp-md) {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      overflow: visible;
      max-width: $max;
      margin-inline: auto;
      padding: 60px $gutter;
    }
  }
}

.shot {
  margin: 0;
  flex: 0 0 min(66vw, 280px);
  scroll-snap-align: center;

  @include up($bp-md) {
    max-width: none;
    &:nth-child(even) {
      margin-top: 80px;
    }
  }

  &__frame {
    position: relative;
    aspect-ratio: 4 / 5;
    border-radius: 22px;
    overflow: hidden;
    clip-path: inset(0 0 0 0 round 22px);
    background: $ink-2;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 1.2s $ease-out;
    }

    @include hover {
      img {
        transform: scale(1.06);
      }
    }
  }

  &__tag {
    position: absolute;
    left: 12px;
    top: 12px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba($ink, 0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    font-size: 0.72rem;
    font-weight: 600;
  }

  figcaption {
    margin-top: 12px;
    font-family: $font-serif;
    font-style: italic;
    font-size: 1.2rem;
    color: rgba($paper, 0.8);
  }
}
</style>
