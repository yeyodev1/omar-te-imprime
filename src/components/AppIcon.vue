<script setup lang="ts">
defineProps<{ name: 'wa' | 'ig' | 'arrow' | 'arrow-down' | 'close' | 'lock' | 'check' | 'alert' | 'spark' | 'card' | 'camera' | 'truck' | 'brush' | 'cube' }>()
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <template v-if="name === 'wa'">
      <path fill="currentColor" stroke="none" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </template>
    <template v-else-if="name === 'ig'">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </template>
    <path v-else-if="name === 'arrow'" d="M5 12h14M13 6l6 6-6 6" />
    <path v-else-if="name === 'arrow-down'" d="M12 5v14M6 13l6 6 6-6" />
    <path v-else-if="name === 'close'" d="M6 6l12 12M18 6 6 18" />
    <template v-else-if="name === 'lock'"><rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 1 1 8 0v3" /></template>
    <path v-else-if="name === 'check'" d="M5 12.5l4.5 4.5L19 7.5" />
    <template v-else-if="name === 'alert'"><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 10v4M12 17.2v.1" /></template>
    <path v-else-if="name === 'spark'" fill="currentColor" stroke="none" d="M12 2c.6 4.9 2.6 7.4 8 8.4v.2c-5.4 1-7.4 3.5-8 8.4h-.2c-.6-4.9-2.6-7.4-8-8.4v-.2c5.4-1 7.4-3.5 8-8.4h.2Z" />
    <template v-else-if="name === 'card'"><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 10h19M6 15h4" /></template>
    <template v-else-if="name === 'camera'"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></template>
    <template v-else-if="name === 'truck'"><path d="M2 6h12v10H2zM14 10h4l3 3v3h-7" /><circle cx="6" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></template>
    <template v-else-if="name === 'brush'"><path d="M14 4l6 6-8.5 8.5a3 3 0 0 1-4.2 0l-1.8-1.8a3 3 0 0 1 0-4.2Z" /><path d="M5.5 18.5 3 21" /></template>
    <template v-else-if="name === 'cube'"><path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7Z" /><path d="M3.5 7 12 11.5 20.5 7M12 11.5v10" /></template>
  </svg>
</template>
