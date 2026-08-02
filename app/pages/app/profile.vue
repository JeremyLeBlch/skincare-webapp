<script setup lang="ts">
import type { NewProduct } from '~/composables/useTreatment'

const { treatment, addProduct, removeProduct, alternateProduct, dismissWarning } = await useTreatment()

const viewOptions = [
  { label: 'Par moment', value: 'moment' },
  { label: 'Par semaine', value: 'week' },
  { label: 'Ingrédients', value: 'ingredients' },
]
const view = ref('moment')

function onAdd(period: 'morning' | 'evening', payload: { name: string; meta: string; frequency: string; highlight: boolean }) {
  const product: NewProduct = {
    period,
    name: payload.name,
    meta: payload.meta || undefined,
    tag_label: payload.frequency,
    tag_variant: payload.highlight ? 'accent-2' : 'neutral',
    highlight: payload.highlight,
  }
  addProduct(product)
}

function onAlternate() {
  const id = treatment.value?.interactionWarning?.itemId
  if (id) alternateProduct(id)
}
</script>

<template>
  <div v-if="treatment" class="flex flex-1 flex-col lg:min-h-0">
    <!-- Mobile (< lg) -->
    <div class="flex flex-1 flex-col lg:hidden">
      <div class="flex items-baseline justify-between px-[22px] pt-3.5">
        <h3 class="font-heading text-[25px] font-normal">Mon traitement</h3>
        <span class="text-[11.5px] font-semibold text-ink/50">{{ treatment.productCount }} produits</span>
      </div>
      <div class="px-[22px] text-[11.5px] text-ink/50">{{ treatment.startedLabel }}</div>

      <div class="flex-1 overflow-auto px-[22px] pt-4 pb-6">
        <EyebrowLabel>Matin · {{ treatment.morning.length }} étapes</EyebrowLabel>
        <div class="mt-3 flex flex-col gap-2.5">
          <ProductRow v-for="p in treatment.morning" :key="p.id" v-bind="p" removable @remove="removeProduct(p.id)" />
        </div>
        <AddProductCard title="Ajouter au matin" subtitle="Nom et fréquence" @add="onAdd('morning', $event)" />

        <EyebrowLabel class="mt-[22px]">Soir · {{ treatment.evening.length }} étapes</EyebrowLabel>
        <div class="mt-3 flex flex-col gap-2.5">
          <ProductRow v-for="p in treatment.evening" :key="p.id" v-bind="p" removable @remove="removeProduct(p.id)" />
        </div>
        <AddProductCard title="Ajouter au soir" subtitle="Nom et fréquence" @add="onAdd('evening', $event)" />

        <EyebrowLabel class="mt-[22px]">Vérifications</EyebrowLabel>
        <div class="mt-3 flex flex-col gap-2.5">
          <InfoNote v-if="treatment.interactionWarning" tone="accent-2">
            <strong>{{ treatment.interactionWarning.title }}</strong> {{ treatment.interactionWarning.body }}
            <div class="mt-2.5 flex gap-2.5">
              <BaseButton variant="primary" class="text-[13px]" @click="onAlternate">Alterner</BaseButton>
              <BaseButton variant="secondary" class="text-[13px]" @click="dismissWarning">Ignorer</BaseButton>
            </div>
          </InfoNote>
          <InfoNote v-if="treatment.photoprotectionNote">
            <strong>Photoprotection.</strong> {{ treatment.photoprotectionNote }}
          </InfoNote>
          <InfoNote v-if="treatment.guide">
            <strong>{{ treatment.guide.title }}.</strong> {{ treatment.guide.advice }}
          </InfoNote>
        </div>

        <EyebrowLabel muted class="mt-[22px]">Rythme de la semaine</EyebrowLabel>
        <div class="mt-3 flex flex-col gap-2.5">
          <div
            v-for="d in treatment.weeklySchedule"
            :key="d.day"
            class="flex justify-between text-[13.5px]"
            :class="d.active ? '' : 'text-ink/50'"
          >
            <span>{{ d.day }}</span>
            <span :class="d.active ? 'font-semibold' : ''">{{ d.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop (lg+) -->
    <div class="hidden lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
      <div class="flex items-end justify-between px-7 pt-[26px]">
        <div>
          <div class="text-sm font-semibold text-ink/50">{{ treatment.productCount }} produits · {{ treatment.startedLabel }}</div>
          <h2 class="mt-2 font-heading text-[32px] font-normal">Mon traitement</h2>
        </div>
        <div class="flex items-center gap-3">
          <SegmentedControl v-model="view" name="treatment-view" :options="viewOptions" />
        </div>
      </div>

      <div class="grid min-h-0 flex-1 grid-cols-3 gap-6 px-7 pt-6 pb-7">
        <div class="flex flex-col overflow-auto">
          <EyebrowLabel>Matin · {{ treatment.morning.length }} étapes</EyebrowLabel>
          <div class="mt-3.5 flex flex-col gap-3">
            <ProductRow v-for="p in treatment.morning" :key="p.id" v-bind="p" removable @remove="removeProduct(p.id)" />
          </div>
          <AddProductCard title="Ajouter au matin" subtitle="Nom et fréquence" @add="onAdd('morning', $event)" />
        </div>

        <div class="flex flex-col overflow-auto">
          <EyebrowLabel>Soir · {{ treatment.evening.length }} étapes</EyebrowLabel>
          <div class="mt-3.5 flex flex-col gap-3">
            <ProductRow v-for="p in treatment.evening" :key="p.id" v-bind="p" removable @remove="removeProduct(p.id)" />
          </div>
          <AddProductCard title="Ajouter au soir" subtitle="Nom et fréquence" @add="onAdd('evening', $event)" />
        </div>

        <div class="flex flex-col gap-3.5 overflow-auto">
          <EyebrowLabel>Vérifications</EyebrowLabel>
          <InfoNote v-if="treatment.interactionWarning" tone="accent-2">
            <strong>{{ treatment.interactionWarning.title }}</strong> {{ treatment.interactionWarning.body }}
            <div class="mt-3 flex gap-2.5">
              <BaseButton variant="primary" class="text-[13px]" @click="onAlternate">Alterner</BaseButton>
              <BaseButton variant="secondary" class="text-[13px]" @click="dismissWarning">Ignorer</BaseButton>
            </div>
          </InfoNote>
          <InfoNote v-if="treatment.photoprotectionNote">
            <strong>Photoprotection.</strong> {{ treatment.photoprotectionNote }}
          </InfoNote>
          <InfoNote v-if="treatment.guide">
            <strong>{{ treatment.guide.title }}.</strong> {{ treatment.guide.advice }}
          </InfoNote>

          <EyebrowLabel muted class="mt-1.5">Rythme de la semaine</EyebrowLabel>
          <div class="flex flex-col gap-2.5">
            <div
              v-for="d in treatment.weeklySchedule"
              :key="d.day"
              class="flex justify-between text-[13.5px]"
              :class="d.active ? '' : 'text-ink/50'"
            >
              <span>{{ d.day }}</span>
              <span :class="d.active ? 'font-semibold' : ''">{{ d.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
