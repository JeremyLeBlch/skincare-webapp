<script setup lang="ts">
withDefaults(defineProps<{ muted?: boolean }>(), { muted: false })
</script>

<template>
  <div
    class="font-body text-[11px] font-semibold tracking-[0.1em] uppercase"
    :class="muted ? 'text-ink/50' : 'text-accent-2'"
  >
    <slot />
  </div>
</template>
