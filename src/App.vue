<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppLoader from '@/components/AppLoader.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import HeroSection from '@/components/HeroSection.vue'
import MarqueeBand from '@/components/MarqueeBand.vue'
import StylesSection from '@/components/StylesSection.vue'
import ProcessSection from '@/components/ProcessSection.vue'
import GallerySection from '@/components/GallerySection.vue'
import AboutSection from '@/components/AboutSection.vue'
import FinalCta from '@/components/FinalCta.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import WhatsAppFab from '@/components/WhatsAppFab.vue'
import CheckoutDrawer from '@/components/CheckoutDrawer.vue'
import { initSmoothScroll, ScrollTrigger } from '@/composables/useMotion'

const ready = ref(false)

onMounted(() => {
  initSmoothScroll()
})

function onLoaded() {
  ready.value = true
  requestAnimationFrame(() => ScrollTrigger.refresh())
}
</script>

<template>
  <AppLoader @done="onLoaded" />
  <SiteHeader :ready="ready" />
  <main>
    <HeroSection :ready="ready" />
    <MarqueeBand />
    <StylesSection />
    <ProcessSection />
    <GallerySection />
    <AboutSection />
    <FinalCta />
  </main>
  <SiteFooter />
  <WhatsAppFab :ready="ready" />
  <CheckoutDrawer />
  <div class="grain" aria-hidden="true" />
</template>
