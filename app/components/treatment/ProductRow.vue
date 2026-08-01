<script setup lang="ts">
defineProps<{
  name: string
  meta: string
  tag: { label: string; variant: 'accent' | 'accent-2' | 'neutral' | 'outline' }
  highlight?: boolean
}>()
</script>

<template>
  <div class="flex items-center gap-3.5 rounded-lg p-3 lg:p-3.5" :class="highlight ? 'bg-accent-100' : 'bg-surface'">
    <div
      class="h-[46px] w-[46px] flex-none rounded-md lg:h-[54px] lg:w-[54px]"
      style="background: linear-gradient(140deg, #e0d5c4, #c9bda8)"
    />
    <div class="flex-1">
      <div class="text-sm font-semibold">{{ name }}</div>
      <div class="text-[11.5px] text-ink/50">{{ meta }}</div>
    </div>
    <TagBadge :variant="tag.variant">{{ tag.label }}</TagBadge>
  </div>
</template>
