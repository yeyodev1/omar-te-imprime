<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { gsap, splitWords, prefersReducedMotion } from '@/composables/useMotion'
import { useCheckout } from '@/composables/useCheckout'

const { openCheckout } = useCheckout()
const root = ref<HTMLElement>()
const title = ref<HTMLElement>()
let ctx: gsap.Context | null = null

const steps = [
  { icon: 'camera', title: 'Envías tus fotos', text: 'Por WhatsApp. No importa si en la foto no está sola la persona o si no es de cuerpo completo.' },
  { icon: 'lock', title: 'Separas tu lugar', text: 'Con la reserva de tu estilo aseguras tu turno en el taller. Solo abrimos 30 cupos al mes.' },
  { icon: 'cube', title: 'Modelado e impresión', text: 'Esculpimos tu retrato digitalmente y te lo enviamos para revisión y aprobación antes de imprimir.' },
  { icon: 'brush', title: 'Pintado a mano y envío', text: 'Se lija, se pinta a mano y finalmente viaja segura hasta tu puerta.' },
] as const

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
    gsap.fromTo(
      '.process__line i',
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.process__steps', start: 'top 70%', end: 'bottom 60%', scrub: true },
      },
    )
    gsap.utils.toArray<HTMLElement>('.step').forEach((step) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: 'top 75%' } })
      tl.from(step.querySelector('.step__icon'), { scale: 0, rotate: -45, duration: 0.8, ease: 'back.out(2)' })
        .from(step.querySelector('.step__num'), { xPercent: -30, opacity: 0, duration: 1, ease: 'expo.out' }, '<')
        .from(step.querySelectorAll('h3, p'), { y: 24, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '<0.1')
        .add(() => step.classList.add('is-on'), 0)
      gsap.fromTo(
        step,
        { opacity: 0.35, x: 24 },
        { opacity: 1, x: 0, ease: 'none', scrollTrigger: { trigger: step, start: 'top 90%', end: 'top 55%', scrub: true } },
      )
    })
    gsap.fromTo(
      '.process__head h2',
      { scale: 0.88, transformOrigin: '0% 50%' },
      { scale: 1, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'top 30%', scrub: true } },
    )
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="proceso" ref="root" class="process">
    <div class="process__wrap">
      <header class="process__head">
        <span class="process__eyebrow">02 — Proceso</span>
        <h2 ref="title">De tus fotos a tu repisa en <em class="serif">4 pasos.</em></h2>
        <p class="process__pill"><i /> Solo 30 cupos por mes</p>
        <button class="btn btn--lime process__cta" @click="openCheckout()">
          Separa tu cupo aquí <AppIcon name="arrow" />
        </button>
      </header>

      <ol class="process__steps">
        <span class="process__line" aria-hidden="true"><i /></span>
        <li v-for="(s, i) in steps" :key="s.title" class="step">
          <span class="step__icon"><AppIcon :name="s.icon" /></span>
          <div>
            <span class="step__num">Paso 0{{ i + 1 }}</span>
            <h3>{{ s.title }}</h3>
            <p>{{ s.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped lang="scss">
.process {
  background: $ink;
  padding: 100px 0;
  border-radius: 36px 36px 0 0;
  margin-top: -36px;
  position: relative;
  z-index: 1;

  &__wrap {
    @include container;
    display: grid;
    gap: 56px;

    @include up($bp-lg) {
      grid-template-columns: 0.9fr 1.1fr;
      gap: 80px;
      align-items: start;
    }
  }

  &__head {
    display: grid;
    gap: 18px;
    justify-items: start;

    @include up($bp-lg) {
      position: sticky;
      top: 120px;
    }

    h2 {
      @include display(2.6rem, 5.2rem);
      em {
        color: $lime;
      }
    }
  }

  &__eyebrow {
    @include eyebrow;
    color: $muted;
  }

  &__pill {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba($lime, 0.1);
    color: $lime;
    font-weight: 600;
    font-size: 0.85rem;
    i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $lime;
    }
  }

  &__cta {
    margin-top: 6px;
  }

  &__steps {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 44px;
  }

  &__line {
    position: absolute;
    left: 27px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: rgba($paper, 0.1);
    i {
      display: block;
      height: 100%;
      background: $lime;
      transform-origin: top;
    }
  }
}

.step {
  position: relative;
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 20px;

  &__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: $ink-2;
    box-shadow: inset 0 0 0 1.5px rgba($paper, 0.14);
    transition: background-color 0.5s, color 0.5s, box-shadow 0.5s;
    position: relative;
    z-index: 1;
    svg {
      width: 24px;
      height: 24px;
    }
  }

  &.is-on &__icon {
    background: $lime;
    color: $ink;
    box-shadow: 0 0 0 8px rgba($lime, 0.12);
  }

  &__num {
    @include eyebrow;
    display: block;
    color: $lime;
    margin-bottom: 6px;
  }

  h3 {
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(1.5rem, 5vw, 2.1rem);
    letter-spacing: -0.03em;
    line-height: 1.05;
    margin-bottom: 8px;
  }

  p {
    color: rgba($paper, 0.66);
    max-width: 30rem;
  }
}
</style>
