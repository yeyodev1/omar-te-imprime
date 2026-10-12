<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import { gsap, splitWords, prefersReducedMotion } from '@/composables/useMotion'
import { useCheckout } from '@/composables/useCheckout'
import { WA_DEFAULT } from '@/data/site'
import { cld, cldSet } from '@/data/cloudinary'

const props = defineProps<{ ready: boolean }>()
const { openCheckout } = useCheckout()
const root = ref<HTMLElement>()
const title = ref<HTMLElement>()
let ctx: gsap.Context | null = null
let intro: gsap.core.Timeline | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    const words = splitWords(title.value!)
    if (prefersReducedMotion()) return

    intro = gsap
      .timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .from('.hero__eyebrow', { y: 20, opacity: 0, duration: 0.8 })
      .from(words, { yPercent: 115, rotate: 4, duration: 1.2, stagger: 0.05 }, '<0.1')
      .from('.hero__media', { clipPath: 'inset(100% 0 0 0 round 28px)', duration: 1.4, ease: 'expo.inOut' }, 0.1)
      .from('.hero__media img', { scale: 1.4, duration: 1.8 }, '<')
      .from('.hero__lead, .hero__actions', { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, '-=1.1')
      .from('.hero__chip', { scale: 0, rotate: -12, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'back.out(1.8)' }, '-=0.8')
      .from('.hero__badge', { scale: 0, rotate: -90, duration: 1.1, ease: 'back.out(1.4)' }, '-=0.8')
      .from('.hero__scroll', { opacity: 0, duration: 0.8 }, '-=0.4')

    gsap.to('.hero__media img', {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true },
    })
    gsap.to('.hero__visual', {
      scale: 0.88,
      rotate: -3,
      ease: 'none',
      scrollTrigger: { trigger: '.hero__visual', start: 'top 60%', end: 'bottom top', scrub: true },
    })
    gsap.to('.hero__chip--a', {
      yPercent: -120,
      ease: 'none',
      scrollTrigger: { trigger: '.hero__visual', start: 'top bottom', end: 'bottom top', scrub: true },
    })
    gsap.to('.hero__copy', {
      yPercent: -12,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true },
    })
    gsap.to('.hero__badge', {
      rotate: 360,
      ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: 1 },
    })
  }, root.value)

  if (props.ready) intro?.play()
})

watch(
  () => props.ready,
  (r) => r && intro?.play(),
)

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="top" ref="root" class="hero">
    <div class="hero__glow" aria-hidden="true" />
    <div class="hero__grid">
      <div class="hero__copy">
        <p class="hero__eyebrow">
          <AppIcon name="spark" /> Impresión 3D · pintado a mano · 100% tú
        </p>
        <h1 ref="title" class="hero__title">
          Convertimos personas en <em class="serif">arte</em> que puedes tener <span class="hero__hl">cerca.</span>
        </h1>
        <p class="hero__lead">
          El regalo que no se marchita ni se guarda en un cajón: la persona que amas, hecha figura. Impresa en filamento de
          alta calidad y pintada a mano.
        </p>
        <div class="hero__actions">
          <button class="btn btn--lime" @click="openCheckout()">
            Separa tu cupo <AppIcon name="arrow" />
          </button>
          <a class="btn btn--ghost" :href="WA_DEFAULT" target="_blank" rel="noopener">
            <AppIcon name="wa" /> Envíanos tus fotos
          </a>
        </div>
      </div>

      <div class="hero__visual">
        <div class="hero__media">
          <img :src="cld('omar-taller', 1100)" :srcset="cldSet('omar-taller')" sizes="(min-width: 1100px) 520px, 92vw" alt="Omar en su taller con decenas de figuras 3D personalizadas" fetchpriority="high" />
        </div>
        <div class="hero__chip hero__chip--a">
          <strong>+3.000</strong>
          <span>figuras entregadas</span>
        </div>
        <div class="hero__chip hero__chip--b">
          <i class="dot" /> Solo 30 cupos al mes
        </div>
        <svg class="hero__badge" viewBox="0 0 120 120" aria-hidden="true">
          <defs><path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
          <circle cx="60" cy="60" r="60" />
          <text><textPath href="#circ">PINTADO A MANO ✦ HECHO EN ECUADOR ✦ </textPath></text>
          <path class="star" d="M60 44c.8 7 3.6 10.5 11.4 12v.4c-7.8 1.4-10.6 5-11.4 12h-.3c-.8-7-3.6-10.6-11.4-12v-.4c7.8-1.5 10.6-5 11.4-12h.3Z" />
        </svg>
      </div>
    </div>
    <div class="hero__scroll" aria-hidden="true">
      <span>Desliza</span>
      <i />
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  min-height: 100svh;
  padding: 96px 0 72px;
  overflow: hidden;

  @include up($bp-lg) {
    display: flex;
    align-items: center;
    padding: 120px 0 80px;
  }

  &__glow {
    position: absolute;
    width: 90vw;
    aspect-ratio: 1;
    right: -30vw;
    top: 30%;
    background: radial-gradient(circle, rgba($lime, 0.18), transparent 62%);
    filter: blur(30px);
    pointer-events: none;
  }

  &__grid {
    @include container;
    position: relative;
    display: grid;
    gap: 40px;

    @include up($bp-lg) {
      grid-template-columns: 1.15fr 0.85fr;
      align-items: center;
      gap: 56px;
    }
  }

  &__eyebrow {
    @include eyebrow;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: $lime;
    margin-bottom: 20px;
    svg {
      width: 14px;
      height: 14px;
    }
  }

  &__title {
    @include display(2.9rem, 6.6rem);
    em {
      color: $lime;
      font-size: 1.08em;
    }
  }

  &__hl {
    position: relative;
    white-space: nowrap;
  }

  &__lead {
    margin-top: 22px;
    max-width: 34rem;
    color: rgba($paper, 0.72);
    font-size: clamp(1rem, 2.8vw, 1.15rem);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;

    .btn {
      flex: 1 1 200px;
      @include up($bp-sm) {
        flex: 0 0 auto;
      }
    }
  }

  &__visual {
    position: relative;
    max-width: 520px;
    width: 100%;
    justify-self: center;
  }

  &__media {
    aspect-ratio: 4 / 4.6;
    border-radius: 28px;
    overflow: hidden;
    clip-path: inset(0 0 0 0 round 28px);
    background: $ink-2;

    img {
      width: 100%;
      height: 118%;
      margin-top: -9%;
      object-fit: cover;
      object-position: 50% 40%;
    }
  }

  &__chip {
    position: absolute;
    border-radius: 18px;
    padding: 12px 16px;
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 1.2;
    box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.55);

    &--a {
      left: -6px;
      bottom: 18%;
      background: $paper;
      color: $ink;
      display: grid;
      strong {
        font-family: $font-display;
        font-size: 1.7rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1;
      }
      span {
        color: rgba($ink, 0.6);
        font-weight: 500;
      }
      @include up($bp-md) {
        left: -36px;
      }
    }

    &--b {
      right: 10px;
      top: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba($ink, 0.7);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: $paper;
      border-radius: 999px;
      box-shadow: inset 0 0 0 1px rgba($paper, 0.15);

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: $lime;
        box-shadow: 0 0 0 0 rgba($lime, 0.7);
        animation: ping 1.8s infinite;
      }
    }
  }

  &__badge {
    position: absolute;
    right: -10px;
    bottom: -34px;
    width: 116px;
    height: 116px;

    circle {
      fill: $lime;
    }
    text {
      font-family: $font-body;
      font-size: 10.2px;
      font-weight: 700;
      letter-spacing: 0.14em;
      fill: $ink;
    }
    .star {
      fill: $ink;
    }

    @include up($bp-md) {
      width: 140px;
      height: 140px;
      right: -40px;
    }
  }

  &__scroll {
    position: absolute;
    left: 50%;
    bottom: 18px;
    translate: -50% 0;
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    @include eyebrow;
    font-size: 0.62rem;
    color: $muted;

    i {
      width: 1px;
      height: 36px;
      background: linear-gradient($lime, transparent);
      animation: drip 2s $ease-in-out infinite;
      transform-origin: top;
    }

    @include up($bp-lg) {
      display: flex;
    }
  }
}

@keyframes ping {
  70% {
    box-shadow: 0 0 0 10px rgba($lime, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba($lime, 0);
  }
}

@keyframes drip {
  0% {
    transform: scaleY(0);
  }
  50% {
    transform: scaleY(1);
    transform-origin: top;
  }
  51% {
    transform-origin: bottom;
  }
  100% {
    transform: scaleY(0);
    transform-origin: bottom;
  }
}
</style>
