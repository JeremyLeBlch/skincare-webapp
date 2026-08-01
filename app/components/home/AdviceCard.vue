<script setup lang="ts">
defineProps<{
  kicker: string
  title: string
  body: string
  meta: string
}>()
</script>

<template>
  <div class="flex flex-col gap-2 rounded-lg bg-surface p-[18px]">
    <div class="text-[10px] tracking-wide text-accent uppercase">{{ kicker }}</div>
    <div class="font-heading text-[17px] font-normal leading-tight">{{ title }}</div>
    <p class="flex-1 text-[13px] text-ink/80">{{ body }}</p>
    <div class="text-[11px] text-ink/50">{{ meta }}</div>
  </div>
</template>
