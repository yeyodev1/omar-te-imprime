<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { gsap, splitWords, prefersReducedMotion } from '@/composables/useMotion'
import { WA_DEFAULT, WHATSAPP_DISPLAY, INSTAGRAM_URL } from '@/data/site'

const root = ref<HTMLElement>()
const title = ref<HTMLElement>()
let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    const words = splitWords(title.value!)
    if (prefersReducedMotion()) return
    gsap.from(words, {
      yPercent: 115,
      duration: 1.2,
      stagger: 0.06,
      ease: 'expo.out',
      scrollTrigger: { trigger: title.value, start: 'top 85%' },
    })
    gsap.from('.cta__actions > *', {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.cta__actions', start: 'top 95%' },
    })
    gsap.fromTo(
      'h2',
      { scale: 0.8, letterSpacing: '0em' },
      { scale: 1, letterSpacing: '-0.035em', ease: 'none', scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'top 25%', scrub: true } },
    )
    gsap.to('.cta__star', {
      rotate: 180,
      ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: 1 },
    })
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section ref="root" class="cta">
    <div class="cta__wrap">
      <AppIcon name="spark" class="cta__star" />
      <h2 ref="title">¿A quién imprimimos <em class="serif">primero?</em></h2>
      <p>Mándanos tus fotos por WhatsApp y hoy mismo te confirmamos tiempos y reserva.</p>
      <div class="cta__actions">
        <a class="btn btn--ink cta__wa" :href="WA_DEFAULT" target="_blank" rel="noopener">
          <AppIcon name="wa" /> Escribir al {{ WHATSAPP_DISPLAY }}
        </a>
        <a class="btn cta__ig" :href="INSTAGRAM_URL" target="_blank" rel="noopener">
          <AppIcon name="ig" /> @3d.omar.riva
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cta {
  background: $lime;
  color: $ink;
  padding: 140px 0 110px;
  margin-top: -36px;
  overflow: hidden;

  &__wrap {
    @include container;
    position: relative;
    display: grid;
    justify-items: center;
    text-align: center;
    gap: 22px;
  }

  &__star {
    width: 64px;
    height: 64px;
  }

  h2 {
    @include display(3rem, 8.5rem);
    max-width: 14ch;
  }

  p {
    max-width: 28rem;
    font-size: 1.1rem;
    color: rgba($ink, 0.75);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    width: 100%;
    margin-top: 8px;

    .btn {
      flex: 1 1 260px;
      max-width: 340px;
    }
  }

  &__wa {
    &::before {
      background: $wa !important;
    }
    @include hover {
      color: #06291a;
    }
  }

  &__ig {
    box-shadow: inset 0 0 0 1.5px rgba($ink, 0.4);
    &::before {
      background: $ink;
    }
    @include hover {
      color: $paper;
    }
  }
}
</style>
