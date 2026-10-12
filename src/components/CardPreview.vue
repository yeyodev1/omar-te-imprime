<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  number: string
  name: string
  expiry: string
  cvc: string
  brand: string
  flipped: boolean
}>()

const shownNumber = computed(() => {
  const d = props.number.replace(/\s/g, '').padEnd(16, '•')
  return d.replace(/(.{4})/g, '$1 ').trim()
})
</script>

<template>
  <div class="cc" :class="[{ 'is-flipped': flipped }, brand && `cc--${brand}`]" aria-hidden="true">
    <div class="cc__inner">
      <div class="cc__face cc__front">
        <div class="cc__top">
          <span class="cc__chip" />
          <span class="cc__brand">
            <template v-if="brand === 'mastercard'"><i class="mc mc--a" /><i class="mc mc--b" /></template>
            <template v-else-if="brand">{{ brand.toUpperCase() }}</template>
            <template v-else>OM ✦</template>
          </span>
        </div>
        <p class="cc__number">{{ shownNumber }}</p>
        <div class="cc__bottom">
          <div>
            <small>Titular</small>
            <span>{{ name || 'TU NOMBRE' }}</span>
          </div>
          <div>
            <small>Vence</small>
            <span>{{ expiry || 'MM/AA' }}</span>
          </div>
        </div>
      </div>
      <div class="cc__face cc__back">
        <span class="cc__stripe" />
        <div class="cc__cvc">
          <small>CVV</small>
          <span>{{ cvc || '•••' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cc {
  perspective: 1200px;
  width: 100%;
  max-width: 380px;
  margin-inline: auto;

  &__inner {
    position: relative;
    aspect-ratio: 1.586;
    transform-style: preserve-3d;
    transition: transform 0.8s $ease-out;
  }

  &.is-flipped &__inner {
    transform: rotateY(180deg);
  }

  &__face {
    position: absolute;
    inset: 0;
    border-radius: 18px;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    overflow: hidden;
    color: $paper;
    background:
      radial-gradient(120% 140% at 100% 0%, rgba($lime, 0.55), transparent 50%),
      radial-gradient(90% 120% at 0% 100%, rgba(#3b82f6, 0.25), transparent 55%),
      linear-gradient(135deg, #2b2b27, #121211);
    box-shadow:
      0 24px 50px -20px rgba(0, 0, 0, 0.8),
      inset 0 0 0 1px rgba($paper, 0.12);
    transition: background 0.6s;
  }

  &--visa &__face {
    background:
      radial-gradient(120% 140% at 100% 0%, rgba(#4f7cff, 0.7), transparent 55%),
      linear-gradient(135deg, #1a237e, #0b0f2e);
  }

  &--mastercard &__face {
    background:
      radial-gradient(120% 140% at 100% 0%, rgba(#ff9a3c, 0.6), transparent 55%),
      linear-gradient(135deg, #3a1d14, #140a07);
  }

  &--amex &__face,
  &--diners &__face {
    background:
      radial-gradient(120% 140% at 100% 0%, rgba(#38d6c4, 0.55), transparent 55%),
      linear-gradient(135deg, #0f3d3a, #071816);
  }

  &__front {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 18px 20px;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__chip {
    width: 42px;
    height: 32px;
    border-radius: 7px;
    background: linear-gradient(135deg, #e9d48b, #b89b4a);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
  }

  &__brand {
    display: flex;
    font-family: $font-display;
    font-weight: 800;
    font-style: italic;
    font-size: 1.15rem;
    letter-spacing: 0.02em;
  }

  .mc {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    &--a {
      background: #eb001b;
    }
    &--b {
      background: #f79e1b;
      margin-left: -12px;
      mix-blend-mode: screen;
    }
  }

  &__number {
    font-family: $font-display;
    font-weight: 600;
    font-size: clamp(1.1rem, 5.4vw, 1.45rem);
    letter-spacing: 0.08em;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    gap: 12px;

    div {
      display: grid;
      min-width: 0;
    }
    small {
      font-size: 0.58rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      opacity: 0.6;
    }
    span {
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__back {
    transform: rotateY(180deg);
  }

  &__stripe {
    display: block;
    height: 42px;
    margin-top: 22px;
    background: #050505;
  }

  &__cvc {
    margin: 18px 20px 0;
    display: grid;
    justify-items: end;
    gap: 4px;

    small {
      font-size: 0.6rem;
      letter-spacing: 0.14em;
      opacity: 0.6;
    }
    span {
      width: 100%;
      padding: 8px 12px;
      border-radius: 6px;
      background: $paper;
      color: $ink;
      text-align: right;
      font-weight: 700;
      font-style: italic;
      letter-spacing: 0.1em;
    }
  }
}
</style>
