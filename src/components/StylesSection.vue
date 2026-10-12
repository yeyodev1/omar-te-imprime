<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { gsap, splitWords, prefersReducedMotion } from '@/composables/useMotion'
import { useCheckout } from '@/composables/useCheckout'
import { products, SHIPPING, waLink } from '@/data/site'
import { cld, cldSet } from '@/data/cloudinary'

const { openCheckout } = useCheckout()
const root = ref<HTMLElement>()
const title = ref<HTMLElement>()
let ctx: gsap.Context | null = null

const money = (n: number) => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`)

onMounted(() => {
  ctx = gsap.context(() => {
    const words = splitWords(title.value!)
    if (prefersReducedMotion()) return

    gsap.from(words, {
      yPercent: 115,
      duration: 1.1,
      stagger: 0.06,
      ease: 'expo.out',
      scrollTrigger: { trigger: title.value, start: 'top 85%' },
    })
    gsap.from('.styles__intro p', {
      y: 24,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: title.value, start: 'top 80%' },
    })

    const cards = gsap.utils.toArray<HTMLElement>('.card')
    cards.forEach((card) => {
      gsap.from(card.querySelector('.card__img img'), {
        scale: 1.3,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 20%', scrub: true },
      })
    })

    const mm = gsap.matchMedia()
    // Móvil: cada tarjeta entra girando/escalando atada al scroll y se hunde al salir.
    mm.add('(max-width: 819px)', () => {
      cards.forEach((card, i) => {
        const inner = card.querySelector('.card__inner')
        gsap.fromTo(
          inner,
          { scale: 0.82, rotate: i % 2 ? 4 : -4, y: 80, clipPath: 'inset(8% 10% 8% 10% round 40px)' },
          {
            scale: 1,
            rotate: 0,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0% round 28px)',
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 35%', scrub: 0.6 },
          },
        )
        gsap.to(inner, {
          scale: 0.9,
          filter: 'brightness(0.5)',
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'bottom 55%', end: 'bottom top', scrub: 0.6 },
        })
        gsap.from(card.querySelectorAll('.card__body > *'), {
          x: (j) => (j % 2 ? 40 : -40),
          opacity: 0,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: card.querySelector('.card__body'), start: 'top 95%', end: 'top 45%', scrub: 0.6 },
        })
        gsap.fromTo(
          card.querySelector('.card__num'),
          { yPercent: 80, opacity: 0 },
          { yPercent: -40, opacity: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 90%', end: 'top 20%', scrub: true } },
        )
      })
    })
    // Escritorio: tarjetas apiladas, la anterior se hunde mientras la siguiente la tapa.
    mm.add('(min-width: 820px)', () => {
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next) return
        gsap.to(card.querySelector('.card__inner'), {
          scale: 0.92,
          filter: 'brightness(0.55)',
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 100px', scrub: true },
        })
      })
    })
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="estilos" ref="root" class="styles">
    <div class="styles__wrap">
      <header class="styles__intro">
        <span class="styles__eyebrow">01 — Estilos</span>
        <h2 ref="title">Elige tu <em class="serif">versión.</em></h2>
        <p>Tres formas de volverte figura, más un trofeo a medida. Todas se modelan desde tus fotos y se pintan a mano en el taller.</p>
      </header>

      <div class="styles__list">
        <article v-for="(p, i) in products" :key="p.id" class="card" :style="{ '--i': i }">
          <div class="card__inner">
            <div class="card__img">
              <img :src="cld(p.image)" :srcset="cldSet(p.image)" sizes="(min-width: 820px) 45vw, 92vw" :alt="`Figura estilo ${p.name}`" loading="lazy" />
              <span class="card__num">0{{ i + 1 }}</span>
              <span v-if="p.highlight" class="card__fav"><AppIcon name="spark" /> {{ p.highlight }}</span>
            </div>
            <div class="card__body">
              <span class="card__tag">{{ p.tag }}</span>
              <h3 class="card__name">{{ p.name }}</h3>
              <p class="card__sub">{{ p.subtitle }} · <span>{{ p.occasion }}</span></p>
              <p class="card__desc">{{ p.description }}</p>

              <dl class="card__price">
                <div class="card__main">
                  <dt class="sr">Precio</dt>
                  <dd>{{ money(p.price) }}<small>{{ p.unit }}</small></dd>
                </div>
                <div>
                  <dt>Separas con</dt>
                  <dd>{{ money(p.deposit) }}</dd>
                </div>
                <div>
                  <dt>Envío</dt>
                  <dd>{{ money(SHIPPING) }}</dd>
                </div>
              </dl>

              <div class="card__actions">
                <button class="btn btn--ink" @click="openCheckout(p)">
                  <AppIcon name="card" /> Separar con tarjeta
                </button>
                <a class="btn card__wa" :href="waLink(`¡Hola Omar! Me interesa el estilo ${p.name} (${money(p.price)}). ¿Tienes cupo este mes?`)" target="_blank" rel="noopener" :aria-label="`Pedir ${p.name} por WhatsApp`">
                  <AppIcon name="wa" />
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.styles {
  position: relative;
  background: $paper;
  color: $ink;
  border-radius: 36px 36px 0 0;
  padding: 88px 0 100px;
  margin-top: -8px;

  &__wrap {
    @include container;
  }

  &__intro {
    display: grid;
    gap: 16px;
    margin-bottom: 48px;

    h2 {
      @include display(3rem, 7rem);
      em {
        color: $lime-deep;
      }
    }

    p {
      max-width: 30rem;
      color: rgba($ink, 0.65);
      font-size: 1.05rem;
    }

    @include up($bp-lg) {
      grid-template-columns: 1fr auto;
      align-items: end;
      span {
        grid-column: 1 / -1;
      }
    }
  }

  &__eyebrow {
    @include eyebrow;
    color: rgba($ink, 0.5);
  }

  &__list {
    display: grid;
    gap: 18px;
  }
}

.card {
  @include up($bp-md) {
    position: sticky;
    top: calc(96px + var(--i) * 16px);
  }

  &__inner {
    display: grid;
    background: $ink;
    color: $paper;
    border-radius: 28px;
    overflow: hidden;
    clip-path: inset(0 0 0 0 round 28px);
    transform-origin: 50% 0;
    box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.5);

    @include up($bp-md) {
      grid-template-columns: 0.9fr 1.1fr;
      min-height: 520px;
    }
  }

  &:nth-child(2) &__inner {
    background: $ink-2;
  }
  &:nth-child(3) &__inner {
    background: #23231f;
  }
  &:nth-child(4) &__inner {
    background: $ink-3;
  }

  &__img {
    position: relative;
    aspect-ratio: 4 / 3.2;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @include up($bp-md) {
      aspect-ratio: auto;
    }
  }

  &__num {
    position: absolute;
    left: 16px;
    bottom: 10px;
    font-family: $font-display;
    font-weight: 800;
    font-size: 4.5rem;
    line-height: 1;
    color: $paper;
    mix-blend-mode: difference;
    letter-spacing: -0.05em;
  }

  &__fav {
    position: absolute;
    top: 14px;
    left: 14px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: $lime;
    color: $ink;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 7px 12px;
    border-radius: 999px;
    svg {
      width: 12px;
      height: 12px;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 24px 20px 22px;

    @include up($bp-md) {
      padding: 40px;
      justify-content: center;
    }
  }

  &__tag {
    @include eyebrow;
    color: $lime;
  }

  &__name {
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(2.2rem, 7vw, 3.6rem);
    letter-spacing: -0.04em;
    line-height: 0.95;
  }

  &__sub {
    font-weight: 600;
    span {
      color: $muted;
      font-weight: 500;
    }
  }

  &__desc {
    color: rgba($paper, 0.7);
    font-size: 0.95rem;
    max-width: 32rem;
  }

  &__price {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: end;
    gap: 18px;
    margin: 12px 0 6px;
    padding-top: 16px;
    border-top: 1px dashed rgba($paper, 0.18);

    dt {
      font-size: 0.7rem;
      color: $muted;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
    }
    dd {
      margin: 0;
      font-family: $font-display;
      font-weight: 600;
      font-size: 1.15rem;
    }
  }

  &__main dd {
    font-size: clamp(2.4rem, 8vw, 3.2rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    color: $lime;
    small {
      display: block;
      font-family: $font-body;
      font-size: 0.75rem;
      font-weight: 500;
      color: $muted;
      letter-spacing: 0;
      margin-top: 4px;
    }
  }

  &__actions {
    display: flex;
    gap: 10px;
    margin-top: 6px;

    .btn--ink {
      flex: 1;
      background: $paper;
      color: $ink;
      &::before {
        background: $lime;
      }
    }
  }

  &__wa {
    width: 54px;
    padding: 0;
    background: rgba($wa, 0.14);
    color: $wa;
    &::before {
      background: $wa;
    }
    @include hover {
      color: $ink;
    }
  }
}

.sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
</style>
