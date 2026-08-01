<script setup lang="ts">
const items = [
  { label: "Aujourd'hui", to: '/app' },
  { label: 'Suivi', to: '/app/tracking' },
  { label: 'Conseils', to: '/app/advice' },
  { label: 'Ingrédients', to: '/app/ingredients' },
  { label: 'Mon traitement', to: '/app/profile' },
]

const route = useRoute()
</script>

<template>
  <nav class="hidden items-center border-b border-ink/16 px-6 py-4 lg:flex">
    <NuxtLink to="/app" class="flex items-center gap-2.5 font-body text-lg font-extrabold">
      <BrandMark :size="30" />
      Skincare Planning
    </NuxtLink>
    <div class="ml-auto flex items-center gap-6">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="text-sm"
        :class="route.path === item.to ? 'text-accent' : 'text-ink'"
      >
        {{ item.label }}
      </NuxtLink>
    </div>
  </nav>
</template>
