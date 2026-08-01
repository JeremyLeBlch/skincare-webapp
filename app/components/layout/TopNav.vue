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
      <NuxtLink
        to="/app/account"
        class="flex items-center gap-2.5 rounded-full py-[5px] pr-3.5 pl-[5px] text-[13px] font-semibold no-underline"
        :class="route.path === '/app/account' ? 'bg-accent text-bg' : 'bg-surface text-ink'"
      >
        <span class="h-8 w-8 flex-none rounded-full" style="background: linear-gradient(140deg, #e0d5c4, #c9bda8)" />
        Mon profil
      </NuxtLink>
    </div>
  </nav>
</template>
