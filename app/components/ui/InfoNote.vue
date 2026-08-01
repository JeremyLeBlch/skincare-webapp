<script setup lang="ts">
type Tone = 'surface' | 'accent' | 'accent-2'

withDefaults(defineProps<{ tone?: Tone }>(), { tone: 'surface' })
</script>

<template>
  <div
    class="rounded-lg p-4 text-[13px] leading-relaxed"
    :class="{
      'bg-surface': tone === 'surface',
      'bg-accent-100': tone === 'accent',
      'bg-accent-2-100': tone === 'accent-2',
    }"
  >
    <slot />
  </div>
</template>
