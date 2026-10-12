<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { gsap, splitWords, prefersReducedMotion } from '@/composables/useMotion'
import { useCheckout } from '@/composables/useCheckout'
import { cldFace } from '@/data/cloudinary'

const { openCheckout } = useCheckout()
const root = ref<HTMLElement>()
const title = ref<HTMLElement>()
let ctx: gsap.Context | null = null

const stats = [
  { value: 3000, prefix: '+', suffix: '', label: 'esculturas y figuras personalizadas' },
  { value: 5, prefix: '+', suffix: ' años', label: 'de experiencia en modelado digital' },
  { value: 30, prefix: '', suffix: '', label: 'cupos por mes, para cuidar cada pieza' },
]

const fmt = (n: number) => Math.round(n).toLocaleString('es-EC')

onMounted(() => {
  ctx = gsap.context(() => {
    const words = splitWords(title.value!)
    if (prefersReducedMotion()) return
    gsap.from(words, {
      yPercent: 115,
      duration: 1.1,
      stagger: 0.05,
      ease: 'expo.out',
      scrollTrigger: { trigger: title.value, start: 'top 85%' },
    })
    gsap.from('.about__photo', {
      clipPath: 'circle(0% at 50% 50%)',
      duration: 1.6,
      ease: 'expo.inOut',
      scrollTrigger: { trigger: '.about__photo', start: 'top 85%' },
    })
    gsap.from('.about__photo img', {
      scale: 1.5,
      duration: 2,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.about__photo', start: 'top 85%' },
    })
    gsap.utils.toArray<HTMLElement>('.stat__value b').forEach((el) => {
      const target = Number(el.dataset.value)
      const obj = { v: 0 }
      gsap.to(obj, {
        v: target,
        duration: 2,
        ease: 'power3.out',
        onUpdate: () => (el.textContent = fmt(obj.v)),
        scrollTrigger: { trigger: el, start: 'top 90%' },
      })
    })
    gsap.fromTo(
      '.about__visual',
      { rotate: -4, y: 60 },
      { rotate: 2, y: -30, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true } },
    )
    gsap.fromTo(
      '.about__sign',
      { xPercent: 60, rotate: 10 },
      { xPercent: 0, rotate: -6, ease: 'none', scrollTrigger: { trigger: '.about__visual', start: 'top 90%', end: 'bottom 50%', scrub: true } },
    )
    gsap.from('.stat', {
      yPercent: 40,
      opacity: 0,
      stagger: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: '.about__stats', start: 'top 95%', end: 'top 55%', scrub: true },
    })
    gsap.from('.about__facts li', {
      x: -20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.about__facts', start: 'top 85%' },
    })
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="omar" ref="root" class="about">
    <div class="about__wrap">
      <div class="about__visual">
        <div class="about__photo">
          <img :src="cldFace('omar-taller', 720, 860, 0.55)" alt="Omar Rivadeneira, artista 3D" loading="lazy" />
        </div>
        <span class="about__sign">Omar ✦</span>
      </div>

      <div class="about__copy">
        <span class="about__eyebrow">04 — Quién está detrás</span>
        <h2 ref="title">Hola, soy <em class="serif">Omar Rivadeneira.</em></h2>
        <p class="about__lead">
          Profesional en Infografía, especializado en diseño digital, modelado 3D y representación tridimensional. Mi mayor
          satisfacción es <mark>ver la reacción</mark> de quien recibe su figura por primera vez.
        </p>

        <ul class="about__stats">
          <li v-for="s in stats" :key="s.label" class="stat">
            <span class="stat__value">{{ s.prefix }}<b :data-value="s.value">{{ fmt(s.value) }}</b>{{ s.suffix }}</span>
            <span class="stat__label">{{ s.label }}</span>
          </li>
        </ul>

        <ul class="about__facts">
          <li><AppIcon name="spark" /> Trabaja junto a su esposa y socia, quien se asegura de que cada cliente reciba la mejor atención.</li>
          <li><AppIcon name="spark" /> Apasionado por el arte, el diseño y la creatividad desde joven.</li>
        </ul>

        <button class="btn btn--ink" @click="openCheckout()">Separa tu cupo aquí <AppIcon name="arrow" /></button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.about {
  background: $paper;
  color: $ink;
  border-radius: 36px;
  padding: 96px 0;
  position: relative;
  z-index: 1;

  &__wrap {
    @include container;
    display: grid;
    gap: 48px;

    @include up($bp-lg) {
      grid-template-columns: 0.85fr 1.15fr;
      gap: 80px;
      align-items: center;
    }
  }

  &__visual {
    position: relative;
    max-width: 440px;
    width: 100%;
    justify-self: center;
  }

  &__photo {
    aspect-ratio: 36 / 43;
    border-radius: 200px 200px 28px 28px;
    overflow: hidden;
    background: $paper-2;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__sign {
    position: absolute;
    right: -6px;
    bottom: 24px;
    background: $lime;
    color: $ink;
    font-family: $font-serif;
    font-style: italic;
    font-size: 1.6rem;
    padding: 6px 18px 8px;
    border-radius: 999px;
    rotate: -6deg;
  }

  &__copy {
    display: grid;
    gap: 22px;
    justify-items: start;
  }

  &__eyebrow {
    @include eyebrow;
    color: rgba($ink, 0.5);
  }

  h2 {
    @include display(2.6rem, 5.4rem);
    em {
      display: block;
    }
  }

  &__lead {
    font-size: 1.08rem;
    color: rgba($ink, 0.72);
    max-width: 36rem;

    mark {
      background: linear-gradient(transparent 55%, $lime 55%);
      color: $ink;
      font-weight: 600;
    }
  }

  &__stats {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    display: grid;
    gap: 2px;
    border-radius: 22px;
    overflow: hidden;

    @include up($bp-sm) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__facts {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 12px;

    li {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      color: rgba($ink, 0.75);
    }

    svg {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      margin-top: 4px;
      color: $lime-deep;
    }
  }
}

.stat {
  background: $ink;
  color: $paper;
  padding: 20px;
  display: grid;
  gap: 4px;

  &__value {
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(2.2rem, 7vw, 2.8rem);
    letter-spacing: -0.04em;
    line-height: 1;
    color: $lime;
    font-variant-numeric: tabular-nums;
    b {
      font-weight: inherit;
    }
  }

  &__label {
    font-size: 0.82rem;
    color: rgba($paper, 0.62);
  }
}
</style>
