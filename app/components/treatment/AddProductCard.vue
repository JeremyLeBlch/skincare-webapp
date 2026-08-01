<script setup lang="ts">
defineProps<{ title: string; subtitle: string }>()
</script>

<template>
  <button type="button" class="mt-4 flex w-full items-center gap-3 rounded-lg border-2 border-dashed border-ink/20 p-4 text-left">
    <span class="font-heading text-[22px] font-normal text-accent">+</span>
    <div>
      <div class="text-sm font-semibold">{{ title }}</div>
      <div class="text-[11.5px] text-ink/50">{{ subtitle }}</div>
    </div>
  </button>
</template>
