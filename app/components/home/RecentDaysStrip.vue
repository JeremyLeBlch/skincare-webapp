<script setup lang="ts">
import type { RecentDay } from '~/composables/useToday'

defineProps<{ days: RecentDay[] }>()
</script>

<template>
  <div class="grid grid-cols-4 gap-2.5">
    <figure v-for="day in days" :key="day.caption">
      <div
        v-if="day.placeholderLabel"
        class="grid h-[100px] place-items-center rounded-lg border-2 border-dashed border-ink/20 text-[10px] font-semibold text-ink/45"
      >
        {{ day.placeholderLabel }}
      </div>
      <div
        v-else
        class="h-[100px] rounded-lg bg-cover bg-center"
        :style="day.photoUrl ? { backgroundImage: `url('${day.photoUrl}')` } : { background: day.shade }"
      />
      <figcaption class="mt-1 text-[11px] text-ink/55">{{ day.caption }}</figcaption>
    </figure>
  </div>
</template>
