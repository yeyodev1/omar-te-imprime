<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import BrandMark from './BrandMark.vue'
import AppIcon from './AppIcon.vue'
import { scrollToTarget } from '@/composables/useMotion'
import { useCheckout } from '@/composables/useCheckout'

defineProps<{ ready: boolean }>()
const { openCheckout } = useCheckout()
const hidden = ref(false)
const scrolled = ref(false)
let last = 0

function onScroll() {
  const y = window.scrollY
  scrolled.value = y > 40
  hidden.value = y > 300 && y > last
  last = y
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header" :class="{ 'is-in': ready, 'is-hidden': hidden, 'is-scrolled': scrolled }">
    <a href="#top" class="header__brand" aria-label="Omar te imprime, inicio" @click.prevent="scrollToTarget('#top')">
      <BrandMark class="header__mark" />
      <span class="header__name">omar te imprime</span>
    </a>
    <nav class="header__nav" aria-label="Principal">
      <a href="#estilos" @click.prevent="scrollToTarget('#estilos')">Estilos</a>
      <a href="#proceso" @click.prevent="scrollToTarget('#proceso')">Proceso</a>
      <a href="#omar" @click.prevent="scrollToTarget('#omar')">Omar</a>
    </nav>
    <button class="btn btn--lime header__cta" @click="openCheckout()">
      Separa tu cupo
      <AppIcon name="arrow" />
    </button>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 10px;
  left: 10px;
  right: 10px;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 8px 8px 16px;
  border-radius: 999px;
  transform: translateY(-160%);
  transition: transform 0.9s $ease-out, background-color 0.4s, backdrop-filter 0.4s, box-shadow 0.4s;

  &.is-in {
    transform: none;
    transition-delay: 0.5s, 0s, 0s, 0s;
  }

  &.is-scrolled {
    background: rgba($ink-2, 0.72);
    backdrop-filter: blur(14px) saturate(140%);
    -webkit-backdrop-filter: blur(14px) saturate(140%);
    box-shadow: inset 0 0 0 1px rgba($paper, 0.08);
  }

  &.is-in.is-hidden {
    transform: translateY(-160%);
    transition-delay: 0s;
  }

  @include up($bp-md) {
    top: 16px;
    left: 50%;
    right: auto;
    width: min(1100px, calc(100% - 32px));
    translate: -50% 0;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__mark {
    font-size: 1.7rem;
  }

  &__name {
    font-family: $font-display;
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: -0.02em;
    display: none;
    @include up(400px) {
      display: inline;
    }
  }

  &__nav {
    display: none;
    gap: 28px;
    font-size: 0.92rem;
    font-weight: 500;
    color: rgba($paper, 0.75);

    a {
      position: relative;
      transition: color 0.3s;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -4px;
        height: 1.5px;
        background: $lime;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.5s $ease-out;
      }
      @include hover {
        color: $paper;
        &::after {
          transform: scaleX(1);
          transform-origin: left;
        }
      }
    }

    @include up($bp-md) {
      display: flex;
    }
  }

  &__cta {
    min-height: 44px;
    padding: 0 1.1rem;
    font-size: 0.88rem;
  }
}
</style>
