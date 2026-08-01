<script setup lang="ts">
withDefaults(defineProps<{ size?: number; full?: boolean }>(), { size: 30, full: false })
</script>

<template>
  <svg viewBox="0 0 64 64" :width="size" :height="size" class="flex-none" aria-hidden="true">
    <rect width="64" height="64" rx="18" fill="#2f5741" />
    <path
      v-if="full"
      d="M32 16c2.9 0 4.9 2.3 4.9 5.2 0 2.5-1.6 3.9-1.6 6.2 0 2.1 3.3 3.5 3.3 7.9 0 3.1-2.1 4.4-2.1 6.7 0 2.5 1.4 3.9 1.4 6 0 3.1-2.6 5.2-5.9 5.2s-5.9-2.1-5.9-5.2c0-2.1 1.4-3.5 1.4-6 0-2.3-2.1-3.6-2.1-6.7 0-4.4 3.3-5.8 3.3-7.9 0-2.3-1.6-3.7-1.6-6.2 0-2.9 2-5.2 4.9-5.2z"
      fill="#f7f2e9"
      opacity=".16"
    />
    <path
      d="M46 6c0 0 5.2 5.9 5.2 9.2a5.2 5.2 0 1 1-10.4 0C40.8 11.9 46 6 46 6z"
      fill="#f7f2e9"
      opacity=".5"
    />
    <text x="32" y="43" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="800" font-size="30" letter-spacing="-1" fill="#f7f2e9">SP</text>
  </svg>
</template>
