<script setup lang="ts">
import type { TreatmentItem } from '~/composables/useToday'

defineProps<{ items: TreatmentItem[] }>()
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <div v-for="item in items" :key="item.name" class="flex items-center justify-between text-[13.5px]">
      <span>{{ item.name }}</span>
      <TagBadge :variant="item.tag.variant">{{ item.tag.label }}</TagBadge>
    </div>
  </div>
</template>
