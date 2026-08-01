<script setup lang="ts">
const items = [
  { label: "Aujourd'hui", to: '/app' },
  { label: 'Suivi', to: '/app/tracking' },
  { label: 'Conseils', to: '/app/advice' },
  { label: 'Profil', to: '/app/profile' },
]

const route = useRoute()
</script>

<template>
  <nav class="grid grid-cols-4 gap-1.5 border-t border-ink/16 px-3 pt-2.5 pb-[22px] lg:hidden">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center gap-[3px] rounded-full py-2 font-body text-[10px] font-semibold"
      :class="route.path === item.to ? 'bg-accent text-bg' : 'text-ink/50'"
    >
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>
