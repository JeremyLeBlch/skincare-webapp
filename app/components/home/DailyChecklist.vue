<script setup lang="ts">
import type { TodayTask } from '~/composables/useToday'

defineProps<{ items: TodayTask[] }>()
defineEmits<{ toggle: [id: number] }>()
</script>

<template>
  <div class="mt-3 flex flex-col gap-2.5">
    <ChecklistItem
      v-for="item in items"
      :key="item.id"
      :label="item.label"
      :sub-label="item.subLabel"
      :meta="item.meta"
      :done="item.done"
      :tag="item.tag"
      clickable
      @toggle="$emit('toggle', item.id)"
    />
  </div>
</template>
