<script setup lang="ts">
const suivi = useSuivi()

const pos = ref(46)
const clipBefore = computed(() => `inset(0 ${100 - pos.value}% 0 0)`)
const handleLeft = computed(() => `${pos.value}%`)

const metrics = [
  { label: 'Rougeurs', value: '−38 %', percent: 62, tone: 'accent' },
  { label: 'Boutons actifs', value: '12 → 5', percent: 42, tone: 'accent' },
  { label: 'Sécheresse ressentie', value: 'en hausse', percent: 72, tone: 'accent-2' },
] as const

const angleOptions = [
  { label: 'Face', value: 'face' },
  { label: 'Profil G', value: 'left' },
  { label: 'Profil D', value: 'right' },
]
const angle = ref('face')
</script>

<template>
  <div class="flex flex-1 flex-col lg:min-h-0">
    <!-- Mobile (< lg) -->
    <div class="flex flex-1 flex-col lg:hidden">
      <div class="flex items-baseline justify-between px-[22px] pt-3.5">
        <h3 class="font-heading text-[25px] font-normal">Progression</h3>
        <span class="text-[11.5px] font-semibold text-ink/50">J1 → J24</span>
      </div>

      <div class="relative mx-[22px] mt-4 h-[390px] overflow-hidden rounded-lg" style="background: #d6cab5">
        <div class="absolute inset-0 flex items-start justify-end p-2.5" style="background: linear-gradient(140deg, #e8dfd0, #d6cab5)">
          <span class="rounded-full bg-bg/90 px-3 py-[5px] text-[11px] font-semibold">Aujourd'hui · J24</span>
        </div>
        <div class="absolute inset-0" :style="{ clipPath: clipBefore }">
          <div class="absolute inset-0 flex items-start p-2.5" style="background: linear-gradient(140deg, #d3c7b2, #bdb098)">
            <span class="rounded-full bg-bg/90 px-3 py-[5px] text-[11px] font-semibold">Départ · J1</span>
          </div>
        </div>
        <div class="absolute top-0 bottom-0 w-0.5 bg-bg" :style="{ left: handleLeft }" />
        <div
          class="absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-bg"
          :style="{ left: handleLeft }"
        >↔</div>
        <input v-model.number="pos" type="range" min="0" max="100" class="absolute inset-0 h-full w-full cursor-ew-resize opacity-0">
      </div>

      <div class="flex-1 overflow-auto px-[22px] pt-[18px] pb-6">
        <EyebrowLabel>Ce qui a changé</EyebrowLabel>
        <div class="mt-3 flex flex-col gap-3">
          <div v-for="metric in metrics" :key="metric.label">
            <div class="mb-1.5 flex justify-between text-[13px]">
              <span>{{ metric.label }}</span>
              <span class="font-semibold">{{ metric.value }}</span>
            </div>
            <div class="h-2.5 rounded-full bg-neutral-300">
              <div class="h-full rounded-full" :class="metric.tone === 'accent-2' ? 'bg-accent-2' : 'bg-accent'" :style="{ width: metric.percent + '%' }" />
            </div>
          </div>
        </div>

        <InfoNote class="mt-[18px]">
          Attendu à la semaine 4 : moins d'inflammation, plus de sécheresse. Vous êtes exactement dans la courbe.
        </InfoNote>
      </div>
    </div>

    <!-- Desktop (lg+) -->
    <div class="hidden lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[1fr_380px]">
      <div class="flex min-h-0 flex-col border-r border-ink/16 p-6">
        <div class="flex items-end justify-between">
          <div>
            <EyebrowLabel>Comparaison · face</EyebrowLabel>
            <h3 class="mt-1.5 font-heading text-[25px] font-normal">Départ J1 → Aujourd'hui J24</h3>
          </div>
          <SegmentedControl v-model="angle" name="angle" :options="angleOptions" />
        </div>

        <div class="relative mt-4 min-h-0 flex-1 overflow-hidden rounded-lg" style="background: #d6cab5">
          <div class="absolute inset-0 flex items-start justify-end p-2.5" style="background: linear-gradient(140deg, #e8dfd0, #d6cab5)">
            <span class="rounded-full bg-bg/90 px-3 py-[5px] text-[11px] font-semibold">Aujourd'hui · J24</span>
          </div>
          <div class="absolute inset-0" :style="{ clipPath: clipBefore }">
            <div class="absolute inset-0 flex items-start p-2.5" style="background: linear-gradient(140deg, #d3c7b2, #bdb098)">
              <span class="rounded-full bg-bg/90 px-3 py-[5px] text-[11px] font-semibold">Départ · J1</span>
            </div>
          </div>
          <div class="absolute top-0 bottom-0 w-0.5 bg-bg" :style="{ left: handleLeft }" />
          <div
            class="absolute top-1/2 grid h-[46px] w-[46px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-bg"
            :style="{ left: handleLeft }"
          >↔</div>
          <input v-model.number="pos" type="range" min="0" max="100" class="absolute inset-0 h-full w-full cursor-ew-resize opacity-0">
        </div>

        <div class="mt-3.5 grid grid-cols-8 gap-2">
          <div v-for="s in suivi.strip" :key="s.label">
            <div class="h-[66px] rounded-md" :style="{ background: s.shade }" />
            <div class="mt-1 text-[11px] text-ink/50">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <div class="flex flex-col overflow-auto p-6">
        <EyebrowLabel>Ce qui a changé</EyebrowLabel>
        <div class="mt-3.5 flex flex-col gap-4">
          <div v-for="metric in metrics" :key="metric.label">
            <div class="mb-[5px] flex justify-between text-[13px]">
              <span>{{ metric.label }}</span>
              <span class="font-semibold">{{ metric.value }}</span>
            </div>
            <div class="h-2.5 rounded-full bg-neutral-300">
              <div class="h-full rounded-full" :class="metric.tone === 'accent-2' ? 'bg-accent-2' : 'bg-accent'" :style="{ width: metric.percent + '%' }" />
            </div>
          </div>
        </div>

        <InfoNote class="mt-[18px]">
          Attendu à la semaine 4 : moins d'inflammation, plus de sécheresse. Vous êtes exactement dans la courbe.
        </InfoNote>

        <EyebrowLabel class="mt-6">Jalons</EyebrowLabel>
        <div class="mt-3.5 flex flex-col gap-3">
          <div
            v-for="m in suivi.milestones"
            :key="m.label"
            class="flex items-center gap-3"
            :class="[m.state === 'current' ? 'rounded-lg bg-accent-100 px-3.5 py-3' : '', m.state === 'pending' ? 'opacity-50' : '']"
          >
            <span
              class="grid h-[22px] w-[22px] flex-none place-items-center rounded-full text-[11px]"
              :class="m.state === 'done' ? 'bg-accent text-bg' : m.state === 'current' ? 'border-2 border-accent text-accent' : 'border-2 border-ink/20'"
            >{{ m.state === 'done' ? '✓' : '' }}</span>
            <div class="flex-1 text-[13.5px]" :class="m.state === 'current' ? 'font-semibold' : ''">
              {{ m.label }}
              <span v-if="m.note" class="font-normal opacity-60">· {{ m.note }}</span>
            </div>
          </div>
        </div>

        <p class="mt-auto pt-4 text-[11.5px] leading-relaxed text-ink/50">
          Photos comparées à cadrage et lumière équivalents. Les pourcentages viennent de vos propres notes, pas
          d'une mesure clinique.
        </p>
      </div>
    </div>
  </div>
</template>
