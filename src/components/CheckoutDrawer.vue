<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import CardPreview from './CardPreview.vue'
import { gsap, lockScroll } from '@/composables/useMotion'
import { useCheckout } from '@/composables/useCheckout'
import { products, DEMO_CHARGE, WA_DEFAULT, waLink, type Product } from '@/data/site'
import { cld } from '@/data/cloudinary'

type Stage = 'form' | 'processing' | 'success'

const { checkout, openCheckout, closeCheckout } = useCheckout()
const stage = ref<Stage>('form')
const flipped = ref(false)
const processingText = ref('')
const orderId = ref('')
const panel = ref<HTMLElement>()
const successEl = ref<HTMLElement>()

const form = reactive({ name: '', number: '', expiry: '', cvc: '', email: '' })
const touched = reactive({ name: false, number: false, expiry: false, cvc: false, email: false })
const submitted = ref(false)

const amount = `$${DEMO_CHARGE.toFixed(2)}`
const product = computed(() => checkout.product as Product)
const digits = computed(() => form.number.replace(/\D/g, ''))

const brand = computed(() => {
  const d = digits.value
  if (/^4/.test(d)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'mastercard'
  if (/^3[47]/.test(d)) return 'amex'
  if (/^3(0[0-5]|[68])/.test(d)) return 'diners'
  return ''
})

function luhn(num: string) {
  let sum = 0
  let dbl = false
  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i])
    if (dbl) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    dbl = !dbl
  }
  return num.length >= 13 && sum % 10 === 0
}

const errors = computed(() => {
  const e: Partial<Record<keyof typeof form, string>> = {}
  if (form.name.trim().length < 3) e.name = 'Escribe el nombre como aparece en la tarjeta'
  if (!luhn(digits.value)) e.number = 'Número de tarjeta inválido'
  const [mm, yy] = form.expiry.split('/').map(Number)
  const now = new Date()
  const exp = mm && yy ? new Date(2000 + yy, mm, 0, 23, 59) : null
  if (!exp || mm < 1 || mm > 12 || exp < now) e.expiry = 'Fecha inválida'
  if (!/^\d{3,4}$/.test(form.cvc)) e.cvc = 'CVV inválido'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido'
  return e
})

const showError = (k: keyof typeof form) => (touched[k] || submitted.value) && errors.value[k]
const isValid = computed(() => Object.keys(errors.value).length === 0)

function onNumber(e: Event) {
  const d = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 19)
  form.number = d.replace(/(.{4})/g, '$1 ').trim()
}

function onExpiry(e: Event) {
  const d = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4)
  form.expiry = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

function onCvc(e: Event) {
  form.cvc = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4)
}

function fillDemo() {
  const y = (new Date().getFullYear() + 3) % 100
  Object.assign(form, { name: 'ANA MARÍA TORRES', number: '4242 4242 4242 4242', expiry: `12/${y}`, cvc: '123', email: 'ana@correo.com' })
}

function reset() {
  stage.value = 'form'
  submitted.value = false
  flipped.value = false
  Object.assign(form, { name: '', number: '', expiry: '', cvc: '', email: '' })
  Object.keys(touched).forEach((k) => (touched[k as keyof typeof touched] = false))
}

async function pay() {
  submitted.value = true
  if (!isValid.value) {
    gsap.fromTo('.co__pay', { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
    return
  }
  stage.value = 'processing'
  const msgs = ['Conectando con el banco…', 'Verificando tu tarjeta…', 'Confirmando la reserva…']
  for (const m of msgs) {
    processingText.value = m
    await new Promise((r) => setTimeout(r, 900))
  }
  orderId.value = `OM-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
  stage.value = 'success'
  await nextTick()
  celebrate()
}

function celebrate() {
  const host = successEl.value
  if (!host) return
  gsap.from(host.querySelectorAll('.co__success > *'), { y: 24, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'expo.out' })
  gsap.fromTo('.co__check path', { strokeDashoffset: 30 }, { strokeDashoffset: 0, duration: 0.7, delay: 0.25, ease: 'power3.out' })
  const colors = ['#c3f22f', '#f4f1ea', '#25d366', '#ffffff']
  for (let i = 0; i < 46; i++) {
    const p = document.createElement('i')
    p.className = 'confetti'
    p.style.background = colors[i % colors.length]
    host.appendChild(p)
    gsap.fromTo(
      p,
      { x: 0, y: 0, rotate: 0, opacity: 1 },
      {
        x: gsap.utils.random(-180, 180),
        y: gsap.utils.random(-220, -40),
        rotate: gsap.utils.random(-360, 360),
        duration: gsap.utils.random(0.8, 1.3),
        ease: 'power3.out',
        onComplete: () => {
          gsap.to(p, { y: '+=260', opacity: 0, duration: 1.2, ease: 'power1.in', onComplete: () => p.remove() })
        },
      },
    )
  }
}

const waAfterPay = computed(() =>
  waLink(
    `¡Hola Omar! 🙌 Acabo de separar mi cupo en la web.\n\nPedido: ${orderId.value}\nEstilo: ${product.value.name}\nMonto: ${amount}\n\nTe envío mis fotos 📸`,
  ),
)

// Animación de apertura/cierre del panel (bottom sheet en móvil, lateral en escritorio).
function onEnter(el: Element, done: () => void) {
  const desktop = window.matchMedia('(min-width: 820px)').matches
  const sheet = el.querySelector('.co__panel')
  gsap
    .timeline({ onComplete: done })
    .from(el.querySelector('.co__backdrop'), { opacity: 0, duration: 0.4 })
    .from(sheet, desktop ? { xPercent: 100, duration: 0.8, ease: 'expo.out' } : { yPercent: 100, duration: 0.8, ease: 'expo.out' }, 0)
    .from(el.querySelectorAll('.co__stagger'), { y: 24, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }, 0.25)
}

function onLeave(el: Element, done: () => void) {
  const desktop = window.matchMedia('(min-width: 820px)').matches
  gsap
    .timeline({ onComplete: done })
    .to(el.querySelector('.co__panel'), desktop ? { xPercent: 100, duration: 0.5, ease: 'expo.in' } : { yPercent: 100, duration: 0.5, ease: 'expo.in' })
    .to(el.querySelector('.co__backdrop'), { opacity: 0, duration: 0.3 }, '-=0.2')
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && stage.value !== 'processing') closeCheckout()
}

watch(
  () => checkout.open,
  (open) => {
    lockScroll(open)
    if (open) {
      reset()
      window.addEventListener('keydown', onKey)
      nextTick(() => panel.value?.querySelector<HTMLElement>('.co__close')?.focus())
    } else {
      window.removeEventListener('keydown', onKey)
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition :css="false" @enter="onEnter" @leave="onLeave">
      <div v-if="checkout.open" class="co" role="dialog" aria-modal="true" aria-labelledby="co-title">
        <div class="co__backdrop" @click="stage !== 'processing' && closeCheckout()" />

        <div ref="panel" class="co__panel">
          <span class="co__grab" aria-hidden="true" />
          <header class="co__head co__stagger">
            <div>
              <span class="co__eyebrow"><AppIcon name="lock" /> Pago seguro · demo</span>
              <h2 id="co-title">Separa tu cupo</h2>
            </div>
            <button class="co__close" aria-label="Cerrar" :disabled="stage === 'processing'" @click="closeCheckout()">
              <AppIcon name="close" />
            </button>
          </header>

          <!-- Formulario -->
          <div v-if="stage === 'form'" class="co__body">
            <div class="co__alert co__stagger" role="note">
              <AppIcon name="alert" />
              <div>
                <strong>Pago simulado.</strong> Falta integrar <b>Payphone</b> próximamente: no se realizará ningún cobro.
                Por ahora puedes hablarnos por WhatsApp.
                <a :href="WA_DEFAULT" target="_blank" rel="noopener"><AppIcon name="wa" /> Escribir por WhatsApp</a>
              </div>
            </div>

            <fieldset class="co__styles co__stagger">
              <legend>Estilo</legend>
              <button
                v-for="p in products"
                :key="p.id"
                type="button"
                class="co__style"
                :class="{ 'is-active': p.id === product.id }"
                :aria-pressed="p.id === product.id"
                @click="openCheckout(p)"
              >
                <img :src="cld(p.image, 160)" alt="" />
                <span>{{ p.name }}</span>
              </button>
            </fieldset>

            <div class="co__stagger">
              <CardPreview
                :number="form.number"
                :name="form.name"
                :expiry="form.expiry"
                :cvc="form.cvc"
                :brand="brand"
                :flipped="flipped"
              />
            </div>

            <form class="co__form co__stagger" novalidate @submit.prevent="pay">
              <button type="button" class="co__demo" @click="fillDemo">
                <AppIcon name="spark" /> Usar tarjeta de prueba
              </button>

              <label class="field" :class="{ 'has-error': showError('number') }">
                <span>Número de tarjeta</span>
                <input
                  :value="form.number"
                  inputmode="numeric"
                  autocomplete="cc-number"
                  placeholder="0000 0000 0000 0000"
                  @input="onNumber"
                  @blur="touched.number = true"
                />
                <small v-if="showError('number')">{{ errors.number }}</small>
              </label>

              <label class="field" :class="{ 'has-error': showError('name') }">
                <span>Nombre en la tarjeta</span>
                <input v-model="form.name" autocomplete="cc-name" placeholder="Como aparece en la tarjeta" @blur="touched.name = true" />
                <small v-if="showError('name')">{{ errors.name }}</small>
              </label>

              <div class="field-row">
                <label class="field" :class="{ 'has-error': showError('expiry') }">
                  <span>Vencimiento</span>
                  <input :value="form.expiry" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/AA" @input="onExpiry" @blur="touched.expiry = true" />
                  <small v-if="showError('expiry')">{{ errors.expiry }}</small>
                </label>
                <label class="field" :class="{ 'has-error': showError('cvc') }">
                  <span>CVV</span>
                  <input
                    :value="form.cvc"
                    inputmode="numeric"
                    autocomplete="cc-csc"
                    placeholder="123"
                    @input="onCvc"
                    @focus="flipped = true"
                    @blur="flipped = false; touched.cvc = true"
                  />
                  <small v-if="showError('cvc')">{{ errors.cvc }}</small>
                </label>
              </div>

              <label class="field" :class="{ 'has-error': showError('email') }">
                <span>Correo para tu comprobante</span>
                <input v-model="form.email" type="email" inputmode="email" autocomplete="email" placeholder="tu@correo.com" @blur="touched.email = true" />
                <small v-if="showError('email')">{{ errors.email }}</small>
              </label>

              <dl class="co__summary">
                <div><dt>Estilo</dt><dd>{{ product.name }}</dd></div>
                <div><dt>Precio de la figura</dt><dd>${{ product.price }} · reserva ${{ product.deposit }}</dd></div>
                <div class="co__total"><dt>Total a pagar (simulación)</dt><dd>{{ amount }}</dd></div>
              </dl>

              <button type="submit" class="btn btn--lime co__pay">
                <AppIcon name="lock" /> Pagar {{ amount }}
              </button>
              <p class="co__fine">Demostración sin cobro real. Los datos no se envían a ningún servidor.</p>
            </form>
          </div>

          <!-- Procesando -->
          <div v-else-if="stage === 'processing'" class="co__body co__processing" aria-live="polite">
            <div class="co__spinner" />
            <p>{{ processingText }}</p>
            <span>{{ amount }} · {{ product.name }}</span>
          </div>

          <!-- Éxito -->
          <div v-else ref="successEl" class="co__body co__success-wrap" aria-live="polite">
            <div class="co__success">
              <svg class="co__check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              <h3>¡Cupo separado!</h3>
              <p>Tu figura <b>{{ product.name }}</b> ya tiene turno en el taller.</p>

              <dl class="co__receipt">
                <div><dt>Pedido</dt><dd>{{ orderId }}</dd></div>
                <div><dt>Tarjeta</dt><dd>{{ brand ? brand.toUpperCase() : 'Tarjeta' }} •••• {{ digits.slice(-4) }}</dd></div>
                <div><dt>Monto</dt><dd>{{ amount }}</dd></div>
              </dl>

              <div class="co__alert co__alert--soft" role="note">
                <AppIcon name="alert" />
                <div>
                  Esto fue una <strong>simulación</strong>: no se hizo ningún cobro. La integración con <b>Payphone</b> llega
                  próximamente. Para reservar de verdad hoy, escríbenos por WhatsApp.
                </div>
              </div>

              <a class="btn btn--wa co__wa" :href="waAfterPay" target="_blank" rel="noopener">
                <AppIcon name="wa" /> Enviar mis fotos por WhatsApp
              </a>
              <button class="co__again" @click="closeCheckout()">Volver al sitio</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.co {
  position: fixed;
  inset: 0;
  z-index: 150;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(5, 5, 4, 0.66);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }

  &__panel {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    max-height: 94svh;
    display: flex;
    flex-direction: column;
    background: $ink-2;
    border-radius: 28px 28px 0 0;
    box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.5);
    overflow: hidden;

    @include up($bp-md) {
      left: auto;
      top: 12px;
      right: 12px;
      bottom: 12px;
      width: 480px;
      max-height: none;
      border-radius: 28px;
    }
  }

  &__grab {
    width: 44px;
    height: 5px;
    border-radius: 5px;
    background: rgba($paper, 0.2);
    margin: 10px auto 0;
    flex-shrink: 0;
    @include up($bp-md) {
      display: none;
    }
  }

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 20px 12px;
    flex-shrink: 0;

    h2 {
      font-family: $font-display;
      font-weight: 800;
      font-size: 1.7rem;
      letter-spacing: -0.03em;
      line-height: 1.1;
    }
  }

  &__eyebrow {
    @include eyebrow;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: $lime;
    font-size: 0.65rem;
    svg {
      width: 12px;
      height: 12px;
    }
  }

  &__close {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: rgba($paper, 0.08);
    transition: background-color 0.3s, transform 0.4s $ease-out;
    svg {
      width: 20px;
      height: 20px;
    }
    @include hover {
      background: rgba($paper, 0.16);
      transform: rotate(90deg);
    }
  }

  &__body {
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 4px 20px calc(24px + env(safe-area-inset-bottom));
    display: grid;
    gap: 18px;
  }

  &__alert {
    display: flex;
    gap: 12px;
    padding: 14px;
    border-radius: 16px;
    background: rgba(#ffb020, 0.12);
    box-shadow: inset 0 0 0 1px rgba(#ffb020, 0.35);
    color: #ffe2a8;
    font-size: 0.86rem;
    line-height: 1.45;

    > svg {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      color: #ffb020;
      margin-top: 1px;
    }

    a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      padding: 7px 12px;
      border-radius: 999px;
      background: $wa;
      color: #06291a;
      font-weight: 700;
      font-size: 0.8rem;
      svg {
        width: 16px;
        height: 16px;
      }
    }

    &--soft {
      text-align: left;
    }
  }

  &__styles {
    border: 0;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;

    legend {
      @include eyebrow;
      color: $muted;
      margin-bottom: 8px;
    }
  }

  &__style {
    display: grid;
    gap: 6px;
    justify-items: center;
    padding: 6px 4px 8px;
    border-radius: 14px;
    background: rgba($paper, 0.05);
    box-shadow: inset 0 0 0 1.5px transparent;
    font-size: 0.7rem;
    font-weight: 600;
    line-height: 1.15;
    text-align: center;
    transition: box-shadow 0.3s, background-color 0.3s, transform 0.3s $ease-out;

    img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 10px;
    }

    &.is-active {
      background: rgba($lime, 0.1);
      box-shadow: inset 0 0 0 1.5px $lime;
      color: $lime;
    }

    &:active {
      transform: scale(0.96);
    }
  }

  &__form {
    display: grid;
    gap: 14px;
  }

  &__demo {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    color: $lime;
    padding: 6px 0;
    svg {
      width: 14px;
      height: 14px;
    }
  }

  &__summary {
    margin: 4px 0 0;
    padding: 16px;
    border-radius: 16px;
    background: rgba($paper, 0.04);
    display: grid;
    gap: 8px;
    font-size: 0.88rem;

    div {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    dt {
      color: $muted;
    }
    dd {
      margin: 0;
      font-weight: 600;
      text-align: right;
    }
  }

  &__total {
    padding-top: 10px;
    margin-top: 4px;
    border-top: 1px dashed rgba($paper, 0.15);
    align-items: baseline;
    dt {
      color: $paper !important;
      font-weight: 600;
    }
    dd {
      font-family: $font-display;
      font-weight: 800 !important;
      font-size: 1.8rem;
      color: $lime;
      letter-spacing: -0.03em;
    }
  }

  &__pay {
    width: 100%;
    min-height: 58px;
    font-size: 1.05rem;
  }

  &__fine {
    text-align: center;
    font-size: 0.74rem;
    color: $muted;
  }

  &__processing {
    min-height: 360px;
    place-content: center;
    justify-items: center;
    text-align: center;

    p {
      font-family: $font-display;
      font-weight: 600;
      font-size: 1.3rem;
    }
    span {
      color: $muted;
      font-size: 0.9rem;
    }
  }

  &__spinner {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 4px solid rgba($paper, 0.1);
    border-top-color: $lime;
    animation: spin 0.8s linear infinite;
  }

  &__success-wrap {
    position: relative;
  }

  &__success {
    display: grid;
    gap: 16px;
    justify-items: center;
    text-align: center;
    padding-top: 10px;

    h3 {
      font-family: $font-display;
      font-weight: 800;
      font-size: 2.2rem;
      letter-spacing: -0.04em;
    }

    > p {
      color: rgba($paper, 0.72);
    }
  }

  &__check {
    width: 84px;
    height: 84px;
    padding: 18px;
    border-radius: 50%;
    background: $lime;
    fill: none;
    stroke: $ink;
    stroke-width: 2.6;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 30;
    box-shadow: 0 0 0 10px rgba($lime, 0.12);
  }

  &__receipt {
    width: 100%;
    margin: 0;
    padding: 16px;
    border-radius: 16px;
    background: rgba($paper, 0.05);
    display: grid;
    gap: 10px;
    font-size: 0.9rem;

    div {
      display: flex;
      justify-content: space-between;
    }
    dt {
      color: $muted;
    }
    dd {
      margin: 0;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
  }

  &__wa {
    width: 100%;
  }

  &__again {
    font-size: 0.9rem;
    color: $muted;
    text-decoration: underline;
    text-underline-offset: 4px;
    padding: 8px;
  }
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;

  span {
    font-size: 0.78rem;
    font-weight: 600;
    color: rgba($paper, 0.7);
  }

  input {
    width: 100%;
    min-height: 52px;
    padding: 0 16px;
    border-radius: 14px;
    border: 0;
    background: rgba($paper, 0.06);
    box-shadow: inset 0 0 0 1.5px rgba($paper, 0.1);
    color: $paper;
    font: inherit;
    font-size: 16px; // evita el zoom automático en iOS
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
    transition: box-shadow 0.25s, background-color 0.25s;

    &::placeholder {
      color: rgba($paper, 0.3);
    }

    &:focus {
      outline: none;
      background: rgba($paper, 0.09);
      box-shadow: inset 0 0 0 1.5px $lime;
    }
  }

  small {
    color: $danger;
    font-size: 0.75rem;
  }

  &.has-error input {
    box-shadow: inset 0 0 0 1.5px $danger;
  }
}

:deep(.confetti) {
  position: absolute;
  left: 50%;
  top: 60px;
  width: 8px;
  height: 12px;
  border-radius: 2px;
  pointer-events: none;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
