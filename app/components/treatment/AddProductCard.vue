<script setup lang="ts">
const props = defineProps<{ title: string; subtitle: string }>()
const emit = defineEmits<{ add: [payload: { name: string; meta: string; frequency: string; highlight: boolean }] }>()

const open = ref(false)
const name = ref('')
const meta = ref('')
const frequency = ref('1×/j')
const highlight = ref(false)

function submit() {
  if (!name.value.trim()) return
  emit('add', { name: name.value.trim(), meta: meta.value.trim(), frequency: frequency.value.trim() || '1×/j', highlight: highlight.value })
  name.value = ''
  meta.value = ''
  frequency.value = '1×/j'
  highlight.value = false
  open.value = false
}
</script>

<template>
  <button
    v-if="!open"
    type="button"
    class="mt-4 flex w-full items-center gap-3 rounded-lg border-2 border-dashed border-ink/20 p-4 text-left"
    @click="open = true"
  >
    <span class="font-heading text-[22px] font-normal text-accent">+</span>
    <div>
      <div class="text-sm font-semibold">{{ props.title }}</div>
      <div class="text-[11.5px] text-ink/50">{{ props.subtitle }}</div>
    </div>
  </button>

  <form v-else class="mt-4 flex flex-col gap-2.5 rounded-lg border border-ink/16 p-4" @submit.prevent="submit">
    <input v-model="name" type="text" placeholder="Nom du produit" required class="w-full rounded-md bg-surface px-3.5 py-2.5 text-sm">
    <div class="flex gap-2.5">
      <input v-model="meta" type="text" placeholder="Précision (optionnel)" class="w-full flex-1 rounded-md bg-surface px-3.5 py-2.5 text-sm">
      <input v-model="frequency" type="text" placeholder="1×/j" class="w-24 flex-none rounded-md bg-surface px-3.5 py-2.5 text-sm">
    </div>
    <label class="flex cursor-pointer items-center gap-2 text-[13px]">
      <input v-model="highlight" type="checkbox" class="h-4 w-4">
      Produit clé (mis en avant)
    </label>
    <div class="flex gap-2.5">
      <BaseButton type="submit" variant="primary" class="flex-1 justify-center">Ajouter</BaseButton>
      <BaseButton type="button" variant="secondary" @click="open = false">Annuler</BaseButton>
    </div>
  </form>
</template>
