<script setup lang="ts">
import type { DayState } from '~/composables/useToday'

defineProps<{
  streak: number
  days: { label: string; state: DayState }[]
}>()
</script>

<template>
  <div class="rounded-lg bg-accent p-5 text-bg lg:p-[22px]">
    <div class="font-body text-[11px] font-semibold tracking-[0.08em] uppercase opacity-75">
      Série en cours
    </div>
    <div class="mt-0.5 flex items-baseline gap-2.5">
      <span class="font-heading text-[56px] leading-none font-normal lg:text-[65px]">{{ streak }}</span>
      <span class="font-body text-base font-semibold lg:text-[17px]">jours d'affilée</span>
    </div>
    <div class="mt-4 flex gap-1.5 lg:mt-[18px]">
      <div
        v-for="day in days"
        :key="day.label"
        class="h-[34px] flex-1 rounded-full lg:h-9"
        :class="{
          'bg-bg/92': day.state === 'done',
          'bg-bg/28': day.state === 'missed',
          'border-2 border-bg/90': day.state === 'today',
        }"
      />
    </div>
    <div class="mt-[7px] flex justify-between font-body text-[10px] font-semibold opacity-80">
      <span v-for="day in days" :key="day.label">{{ day.label }}</span>
    </div>
  </div>
</template>
