<script setup lang="ts">
defineProps<{
  title: string
  body: string
  linkLabel: string
  linkTo: string
}>()
</script>

<template>
  <div class="rounded-lg bg-accent-100 p-4">
    <div class="font-heading text-[19px] font-normal">{{ title }}</div>
    <p class="mt-1 text-[13px] leading-relaxed">{{ body }}</p>
    <NuxtLink :to="linkTo" class="mt-2.5 inline-block text-[13px] font-semibold">{{ linkLabel }}</NuxtLink>
  </div>
</template>
