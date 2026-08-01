<script setup lang="ts">
const treatment = useTreatment()

const viewOptions = [
  { label: 'Par moment', value: 'moment' },
  { label: 'Par semaine', value: 'week' },
  { label: 'Ingrédients', value: 'ingredients' },
]
const view = ref('moment')
</script>

<template>
  <div class="flex flex-1 flex-col lg:min-h-0">
    <!-- Mobile (< lg) -->
    <div class="flex flex-1 flex-col lg:hidden">
      <div class="flex items-baseline justify-between px-[22px] pt-3.5">
        <h3 class="font-heading text-[25px] font-normal">Mon traitement</h3>
        <span class="text-[11.5px] font-semibold text-ink/50">{{ treatment.productCount }} produits</span>
      </div>

      <div class="flex-1 overflow-auto px-[22px] pt-4 pb-6">
        <EyebrowLabel>Matin · {{ treatment.morning.length }} étapes</EyebrowLabel>
        <div class="mt-3 flex flex-col gap-2.5">
          <ProductRow v-for="p in treatment.morning" :key="p.name" v-bind="p" />
        </div>

        <EyebrowLabel class="mt-[22px]">Soir · {{ treatment.evening.length }} étapes</EyebrowLabel>
        <div class="mt-3 flex flex-col gap-2.5">
          <ProductRow v-for="p in treatment.evening" :key="p.name" v-bind="p" />
        </div>

        <AddProductCard title="Ajouter un produit" subtitle="Scan du code-barres ou recherche INCI" />

        <InfoNote tone="accent-2" class="mt-3.5">
          <strong>{{ treatment.interactionWarning.title }}</strong> {{ treatment.interactionWarning.body }}
          <NuxtLink to="/app/advice" class="mt-1.5 block font-semibold text-accent-2">Voir pourquoi →</NuxtLink>
        </InfoNote>
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
          <BaseButton variant="primary">Ajouter un produit</BaseButton>
        </div>
      </div>

      <div class="grid min-h-0 flex-1 grid-cols-3 gap-6 px-7 pt-6 pb-7">
        <div class="flex flex-col overflow-auto">
          <EyebrowLabel>Matin · {{ treatment.morning.length }} étapes</EyebrowLabel>
          <div class="mt-3.5 flex flex-col gap-3">
            <ProductRow v-for="p in treatment.morning" :key="p.name" v-bind="p" />
          </div>
          <AddProductCard title="Ajouter au matin" subtitle="Recherche INCI ou code-barres" />
        </div>

        <div class="flex flex-col overflow-auto">
          <EyebrowLabel>Soir · {{ treatment.evening.length }} étapes</EyebrowLabel>
          <div class="mt-3.5 flex flex-col gap-3">
            <ProductRow v-for="p in treatment.evening" :key="p.name" v-bind="p" />
          </div>
          <AddProductCard title="Ajouter au soir" subtitle="Recherche INCI ou code-barres" />
        </div>

        <div class="flex flex-col gap-3.5 overflow-auto">
          <EyebrowLabel>Vérifications</EyebrowLabel>
          <InfoNote tone="accent-2">
            <strong>{{ treatment.interactionWarning.title }}</strong> {{ treatment.interactionWarning.body }}
            <div class="mt-3 flex gap-2.5">
              <BaseButton variant="primary" class="text-[13px]">Alterner</BaseButton>
              <BaseButton variant="secondary" class="text-[13px]">Ignorer</BaseButton>
            </div>
          </InfoNote>
          <InfoNote>
            <strong>Photoprotection.</strong> {{ treatment.photoprotectionNote }}
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
