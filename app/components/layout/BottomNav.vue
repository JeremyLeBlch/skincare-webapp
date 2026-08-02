<script setup lang="ts">
// `/app/profile` is the treatment plan and `/app/account` the account itself —
// the desktop nav names them "Mon traitement" and "Mon profil", so labelling
// the first one "Profil" here left the account with no way in on a phone.
const items = [
  { label: "Aujourd'hui", to: '/app' },
  { label: 'Suivi', to: '/app/tracking' },
  { label: 'Conseils', to: '/app/advice' },
  { label: 'Traitement', to: '/app/profile' },
  { label: 'Compte', to: '/app/account' },
]

const route = useRoute()
</script>

<template>
  <!-- Sticky: the mobile screens scroll well past a viewport, and the bar used
       to scroll away with them. -->
  <nav class="sticky bottom-0 z-40 grid grid-cols-5 gap-1 border-t border-ink/16 bg-bg px-2 pt-2.5 pb-[22px] lg:hidden">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center gap-[3px] rounded-full px-0.5 py-2 text-center font-body text-[10px] leading-tight font-semibold"
      :class="route.path === item.to ? 'bg-accent text-bg' : 'text-ink/50'"
    >
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>
