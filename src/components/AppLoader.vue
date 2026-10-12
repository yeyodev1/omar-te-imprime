<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BrandMark from './BrandMark.vue'
import { gsap, prefersReducedMotion } from '@/composables/useMotion'

const emit = defineEmits<{ done: [] }>()
const root = ref<HTMLElement>()
const count = ref(0)
const visible = ref(true)

onMounted(() => {
  if (prefersReducedMotion()) {
    visible.value = false
    emit('done')
    return
  }
  document.body.classList.add('is-locked')
  const counter = { v: 0 }
  const tl = gsap.timeline({
    onComplete: () => {
      visible.value = false
      document.body.classList.remove('is-locked')
    },
  })
  tl.from('.loader__mark', { yPercent: 110, duration: 0.9, ease: 'expo.out' })
    .to(counter, {
      v: 100,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => (count.value = Math.round(counter.v)),
    }, 0.1)
    .to('.loader__bar i', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0.1)
    .to('.loader__inner', { yPercent: -40, opacity: 0, duration: 0.6, ease: 'power3.in' }, '+=0.1')
    .add(() => emit('done'), '-=0.15')
    .to(root.value!, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.3')
})
</script>

<template>
  <div v-if="visible" ref="root" class="loader" aria-hidden="true">
    <div class="loader__inner">
      <div class="loader__mask"><BrandMark class="loader__mark" /></div>
      <p class="loader__line">Imprimiendo a tu persona favorita…</p>
      <div class="loader__bar"><i /></div>
      <span class="loader__count">{{ count.toString().padStart(3, '0') }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loader {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: $ink;
  display: grid;
  place-items: center;
  clip-path: inset(0 0 0 0);

  &__inner {
    display: grid;
    justify-items: center;
    gap: 18px;
    width: min(320px, 80vw);
  }

  &__mask {
    overflow: hidden;
    font-size: clamp(4rem, 22vw, 7rem);
    color: $paper;
  }

  &__line {
    font-size: 0.85rem;
    color: $muted;
  }

  &__bar {
    width: 100%;
    height: 3px;
    background: rgba($paper, 0.1);
    border-radius: 3px;
    overflow: hidden;
    i {
      display: block;
      height: 100%;
      background: $lime;
      transform: scaleX(0);
      transform-origin: left;
    }
  }

  &__count {
    font-family: $font-display;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: $lime;
    font-size: 0.9rem;
    letter-spacing: 0.1em;
  }
}
</style>
