<script setup lang="ts">
defineProps<{
  label: string
  subLabel?: string
  meta?: string
  done: boolean
  tag?: { label: string; variant: 'accent' | 'accent-2' | 'neutral' | 'outline' }
  clickable?: boolean
}>()

defineEmits<{ toggle: [] }>()
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-lg bg-surface px-4 py-3.5"
    :class="[done ? 'opacity-60' : '', clickable ? 'cursor-pointer' : '']"
    @click="clickable ? $emit('toggle') : undefined"
  >
    <div v-if="done" class="grid h-6 w-6 flex-none place-items-center rounded-full bg-accent text-xs text-bg">✓</div>
    <div v-else class="h-6 w-6 flex-none rounded-full border-2 border-ink/20" />

    <div class="flex-1 text-sm" :class="done ? 'line-through' : 'text-ink'">
      {{ label }}
      <span v-if="subLabel" class="opacity-60">· {{ subLabel }}</span>
    </div>

    <span v-if="meta" class="text-xs text-ink/60">{{ meta }}</span>
    <TagBadge v-if="tag" :variant="tag.variant">{{ tag.label }}</TagBadge>
  </div>
</template>
