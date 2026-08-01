<script setup lang="ts">
type Variant = 'accent' | 'accent-2' | 'neutral' | 'outline'

withDefaults(defineProps<{ variant?: Variant }>(), { variant: 'neutral' })
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-3 py-[5px] text-[11px] tracking-wide"
    :class="{
      'bg-accent-100 text-accent-800': variant === 'accent',
      'bg-accent-2-100 text-accent-2-800': variant === 'accent-2',
      'bg-neutral-100 text-neutral-800': variant === 'neutral',
      'border border-accent text-accent': variant === 'outline',
    }"
  >
    <slot />
  </span>
</template>
