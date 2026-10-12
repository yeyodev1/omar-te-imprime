<script setup lang="ts">
import { ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import { gsap } from '@/composables/useMotion'
import { WA_DEFAULT } from '@/data/site'

const props = defineProps<{ ready: boolean }>()
const root = ref<HTMLElement>()

watch(
  () => props.ready,
  (r) => {
    if (!r) return
    gsap.from(root.value!, { scale: 0, rotate: -90, duration: 1, delay: 1.6, ease: 'back.out(1.8)' })
  },
)
</script>

<template>
  <a ref="root" class="fab" :href="WA_DEFAULT" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">
    <span class="fab__tip">¿Dudas? Escríbenos</span>
    <span class="fab__btn"><AppIcon name="wa" /></span>
  </a>
</template>

<style scoped lang="scss">
.fab {
  position: fixed;
  right: 14px;
  bottom: calc(14px + env(safe-area-inset-bottom));
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 10px;

  &__tip {
    background: $paper;
    color: $ink;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 999px;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
    opacity: 0;
    transform: translateX(10px);
    transition: opacity 0.4s, transform 0.5s $ease-out;
    pointer-events: none;
  }

  @include hover {
    .fab__tip {
      opacity: 1;
      transform: none;
    }
  }

  &__btn {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: $wa;
    color: #fff;
    box-shadow: 0 14px 34px -10px rgba($wa, 0.7);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid $wa;
      animation: ring 2.4s $ease-out infinite;
    }

    svg {
      width: 30px;
      height: 30px;
    }
  }
}

@keyframes ring {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}
</style>
