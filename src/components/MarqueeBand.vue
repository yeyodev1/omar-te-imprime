<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/composables/useMotion'

const items = ['Regalos de cumpleaños', 'Parejas y aniversarios', 'San Valentín', 'Conmemorar la vida', 'Día de la Madre', 'Mascotas']
const root = ref<HTMLElement>()
let ctx: gsap.Context | null = null

onMounted(() => {
  if (prefersReducedMotion()) return
  ctx = gsap.context(() => {
    const tracks = gsap.utils.toArray<HTMLElement>('.marquee__track')
    const loops = tracks.map((t, i) =>
      gsap.fromTo(t, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 28, ease: 'none', repeat: -1 }),
    )
    gsap.fromTo('.marquee__row--lime', { rotate: 2 }, { rotate: -6, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true } })
    gsap.fromTo('.marquee__row--ink', { rotate: -3 }, { rotate: 5, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true } })
    ScrollTrigger.create({
      trigger: root.value,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 4)
        loops.forEach((l) => {
          gsap.killTweensOf(l)
          gsap.timeline().to(l, { timeScale: boost, duration: 0.2 }).to(l, { timeScale: 1, duration: 1.2 })
        })
      },
    })
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="marquee" aria-label="Ocasiones">
    <div class="marquee__row marquee__row--lime">
      <div class="marquee__track">
        <template v-for="n in 2" :key="n">
          <span v-for="item in items" :key="item + n">{{ item }} <b>✦</b></span>
        </template>
      </div>
    </div>
    <div class="marquee__row marquee__row--ink" aria-hidden="true">
      <div class="marquee__track">
        <template v-for="n in 2" :key="n">
          <span v-for="item in ['Impreso en 3D', 'Pintado a mano', 'Hecho desde tus fotos', 'Envío a todo Ecuador']" :key="item + n">{{ item }} <b>●</b></span>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.marquee {
  position: relative;
  z-index: 2;
  padding: 36px 0;
  overflow: hidden;

  &__row {
    display: flex;
    overflow: hidden;
    white-space: nowrap;
    width: 110%;
    margin-left: -5%;

    &--lime {
      background: $lime;
      color: $ink;
      transform: rotate(-3deg);
      padding: 14px 0;
      position: relative;
      z-index: 1;
    }

    &--ink {
      background: $paper;
      color: $ink;
      transform: rotate(2deg);
      margin-top: -6px;
      padding: 10px 0;
      span {
        font-size: clamp(0.95rem, 3vw, 1.25rem);
        font-weight: 600;
        font-family: $font-body;
        letter-spacing: -0.01em;
      }
    }
  }

  &__track {
    display: flex;
    flex-shrink: 0;
    will-change: transform;

    span {
      display: inline-flex;
      align-items: center;
      gap: 0.6em;
      padding-right: 0.6em;
      font-family: $font-display;
      font-weight: 800;
      font-size: clamp(1.4rem, 5vw, 2.6rem);
      letter-spacing: -0.03em;
      text-transform: uppercase;
    }

    b {
      font-size: 0.6em;
    }
  }
}
</style>
