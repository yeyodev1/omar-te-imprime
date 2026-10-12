<script setup lang="ts">
import { WA_DEFAULT, INSTAGRAM_URL } from '@/data/site'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__wrap">
      <p class="footer__word" aria-hidden="true">omar te imprime</p>
      <div class="footer__row">
        <span>Figuras 3D pintadas a mano · Ecuador</span>
        <nav>
          <a :href="WA_DEFAULT" target="_blank" rel="noopener">WhatsApp</a>
          <a :href="INSTAGRAM_URL" target="_blank" rel="noopener">Instagram</a>
        </nav>
        <span>© {{ year }} Omar Rivadeneira</span>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: $ink;
  padding: 60px 0 calc(28px + env(safe-area-inset-bottom));
  overflow: hidden;

  &__wrap {
    @include container;
  }

  &__word {
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(2.6rem, 11.5vw, 10rem);
    letter-spacing: -0.06em;
    line-height: 0.85;
    color: transparent;
    -webkit-text-stroke: 1px rgba($paper, 0.22);
    white-space: nowrap;
  }

  &__row {
    margin-top: 28px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px 24px;
    font-size: 0.85rem;
    color: $muted;

    nav {
      display: flex;
      gap: 20px;
      a {
        color: $paper;
        transition: color 0.3s;
        @include hover {
          color: $lime;
        }
      }
    }
  }
}
</style>
