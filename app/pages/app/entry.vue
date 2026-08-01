<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const router = useRouter()

const moodOptions = [
  { label: 'Mieux', value: 'better' },
  { label: 'Pareil', value: 'same' },
  { label: 'Moins bien', value: 'worse' },
]
const mood = ref('same')

const feelingTags = [
  { label: 'Tiraillements', variant: 'accent' },
  { label: 'Rougeurs', variant: 'neutral' },
  { label: 'Desquamation', variant: 'accent' },
  { label: 'Démangeaisons', variant: 'neutral' },
  { label: 'Nouveau bouton', variant: 'neutral' },
  { label: '+ autre', variant: 'outline' },
] as const

const note = ref("Peau qui pèle sur le menton depuis 2 jours, j'ai sauté la trétinoïne hier soir.")

const eveningChecklist = [
  { label: 'Nettoyant', done: true },
  { label: 'Trétinoïne 0,025 %', done: false, tag: { label: 'prévu', variant: 'accent-2' as const } },
  { label: 'Crème céramides', done: false },
]
</script>

<template>
  <div class="flex flex-1 flex-col">
    <!-- Mobile (< lg) -->
    <div class="flex flex-1 flex-col lg:hidden">
      <div class="flex items-center gap-3 px-[22px] pt-3">
        <button type="button" class="grid h-[38px] w-[38px] flex-none place-items-center rounded-full border border-ink/16" @click="router.push('/app')">✕</button>
        <div class="flex-1">
          <div class="font-heading text-lg font-normal">Mercredi 12 mars</div>
          <div class="text-[11.5px] font-semibold text-ink/50">Jour 24 · semaine 4</div>
        </div>
        <BaseButton variant="ghost" @click="router.push('/app')">Ignorer</BaseButton>
      </div>

      <div class="flex gap-2.5 px-[22px] pt-4">
        <div class="flex h-[180px] flex-1 items-end justify-start rounded-lg p-2.5 text-[10px] font-semibold text-ink/55" style="background: linear-gradient(140deg, #e0d5c4, #c9bda8)">
          Face · aujourd'hui
        </div>
        <div class="flex w-[92px] flex-col gap-2.5">
          <div class="grid flex-1 place-items-center rounded-[20px] border-2 border-dashed border-ink/20 text-center text-[10px] font-semibold text-ink/45">+ Profil G</div>
          <div class="grid flex-1 place-items-center rounded-[20px] border-2 border-dashed border-ink/20 text-center text-[10px] font-semibold text-ink/45">+ Profil D</div>
        </div>
      </div>

      <div class="flex-1 overflow-auto px-[22px] pt-5 pb-6">
        <EyebrowLabel>Aujourd'hui, ma peau est…</EyebrowLabel>
        <SegmentedControl v-model="mood" name="mood-mobile" :options="moodOptions" block class="mt-2.5" />

        <EyebrowLabel class="mt-5">Ce que je ressens</EyebrowLabel>
        <div class="mt-2.5 flex flex-wrap gap-1.5">
          <TagBadge v-for="tag in feelingTags" :key="tag.label" :variant="tag.variant">{{ tag.label }}</TagBadge>
        </div>

        <div class="mt-5">
          <label class="mb-1.5 block text-xs font-semibold">Note libre</label>
          <textarea v-model="note" class="min-h-[86px] w-full rounded-md bg-surface p-3.5 text-sm" />
        </div>

        <InfoNote tone="accent" class="mt-3">
          Sauter un soir n'annule rien. Reprenez au prochain jour prévu, sans doubler la dose.
        </InfoNote>

        <BaseButton variant="primary" block class="mt-3.5" @click="router.push('/app')">Enregistrer la journée</BaseButton>
      </div>
    </div>

    <!-- Desktop (lg+) -->
    <div class="hidden lg:flex lg:flex-1 lg:flex-col">
      <div class="flex items-center gap-6 border-b border-ink/16 px-6 py-4">
        <NuxtLink to="/app" class="flex items-center gap-2.5 font-body text-lg font-extrabold">
          <BrandMark :size="30" />
          Skincare Planning
        </NuxtLink>
        <span class="text-sm font-semibold text-ink/50">Mercredi 12 mars · Jour 24</span>
        <div class="ml-auto flex items-center gap-3">
          <BaseButton variant="ghost" @click="router.push('/app')">Ignorer aujourd'hui</BaseButton>
          <BaseButton variant="primary" @click="router.push('/app')">Enregistrer la journée</BaseButton>
        </div>
      </div>

      <div class="grid flex-1 grid-cols-[1.25fr_1fr]">
        <div class="flex min-h-0 flex-col border-r border-ink/16 p-7">
          <div class="flex items-baseline justify-between">
            <EyebrowLabel>Photos du jour · 1 sur 3</EyebrowLabel>
            <span class="text-sm text-ink/50">Glissez-déposez ou webcam</span>
          </div>

          <div class="mt-3.5 grid min-h-0 flex-1 grid-cols-[2fr_1fr] gap-3.5">
            <div class="flex items-end justify-end rounded-lg p-2.5" style="background: linear-gradient(140deg, #e0d5c4, #c9bda8)">
              <span class="rounded-full bg-bg/90 px-3 py-[5px] text-[10px] font-semibold text-ink/55">Face · J24</span>
            </div>
            <div class="flex min-h-0 flex-col gap-3.5">
              <div class="grid flex-1 place-items-center gap-1.5 rounded-lg border-2 border-dashed border-ink/20 text-ink/50">
                <span class="font-heading text-[22px] font-normal text-accent">+</span>
                <span class="text-[11px] font-semibold">Profil gauche</span>
              </div>
              <div class="grid flex-1 place-items-center gap-1.5 rounded-lg border-2 border-dashed border-ink/20 text-ink/50">
                <span class="font-heading text-[22px] font-normal text-accent">+</span>
                <span class="text-[11px] font-semibold">Profil droit</span>
              </div>
            </div>
          </div>

          <InfoNote tone="accent" class="mt-4">
            <strong>Même lumière, même distance.</strong> Le calque de votre photo d'hier s'affiche en transparence
            pour vous aligner — c'est ce qui rend la comparaison honnête.
          </InfoNote>
        </div>

        <div class="flex flex-col overflow-auto p-7">
          <EyebrowLabel>Aujourd'hui, ma peau est…</EyebrowLabel>
          <SegmentedControl v-model="mood" name="mood-desktop" :options="moodOptions" block class="mt-3" />

          <EyebrowLabel class="mt-6">Ce que je ressens</EyebrowLabel>
          <div class="mt-3 flex flex-wrap gap-2">
            <TagBadge v-for="tag in feelingTags" :key="tag.label" :variant="tag.variant">{{ tag.label }}</TagBadge>
          </div>

          <EyebrowLabel class="mt-6">Traitement suivi ce soir</EyebrowLabel>
          <div class="mt-3 flex flex-col gap-2.5">
            <ChecklistItem v-for="item in eveningChecklist" :key="item.label" v-bind="item" />
          </div>

          <div class="mt-6">
            <label class="mb-1.5 block text-xs font-semibold">Note libre · optionnelle</label>
            <textarea v-model="note" class="min-h-[100px] w-full rounded-md bg-surface p-3.5 text-sm" />
          </div>

          <InfoNote class="mt-3">
            Sauter un soir n'annule rien. Reprenez au prochain jour prévu, sans doubler la dose.
          </InfoNote>
        </div>
      </div>
    </div>
  </div>
</template>
