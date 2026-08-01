<script setup lang="ts">
const suivi = useSuivi()

const rangeOptions = [
  { label: 'Mois', value: 'month' },
  { label: '12 sem.', value: '12w' },
  { label: 'Tout', value: 'all' },
]
const range = ref('12w')

const weekdayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
</script>

<template>
  <div class="flex flex-1 flex-col lg:min-h-0">
    <!-- Mobile (< lg) -->
    <div class="flex flex-1 flex-col lg:hidden">
      <div class="flex items-baseline justify-between px-[22px] pt-3.5">
        <h3 class="font-heading text-[25px] font-normal">Mon suivi</h3>
        <TagBadge variant="accent">{{ suivi.streak }} jours</TagBadge>
      </div>

      <div class="flex-1 overflow-auto px-[22px] pt-4 pb-6">
        <div class="rounded-lg bg-surface p-[18px]">
          <div class="grid grid-cols-7 gap-1.5">
            <div v-for="d in weekdayLabels" :key="d" class="text-center text-[11px] text-ink/45">{{ d }}</div>
            <div
              v-for="(cell, i) in suivi.cells"
              :key="i"
              class="grid aspect-square place-items-center rounded-full text-[10px] font-semibold"
              :class="{
                'bg-accent text-bg': cell.state === 'full',
                'bg-accent-300 text-ink': cell.state === 'partial',
                'bg-neutral-300 text-ink/50': cell.state === 'missed',
                'border border-ink/16': cell.state === 'empty',
              }"
            >
              {{ cell.day }}
            </div>
          </div>
          <div class="mt-3.5 flex gap-3.5 text-[10px] font-semibold text-ink/60">
            <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-accent" />Photo + note</span>
            <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-accent-300" />Partiel</span>
            <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-neutral-300" />Manqué</span>
          </div>
        </div>

        <div class="mt-3.5 flex gap-2.5">
          <div class="flex h-[130px] flex-1 items-start rounded-lg p-2.5 text-[10px] font-semibold text-ink/55" style="background: linear-gradient(140deg, #d3c7b2, #bdb098)">
            Départ · J1
          </div>
          <div class="flex h-[130px] flex-1 items-start rounded-lg p-2.5 text-[10px] font-semibold text-ink/55" style="background: linear-gradient(140deg, #e8dfd0, #d6cab5)">
            Auj. · J24
          </div>
        </div>
        <BaseButton variant="secondary" block class="mt-2.5" @click="$router.push('/app/compare')">Comparer en grand</BaseButton>

        <EyebrowLabel class="mt-[22px]">Jalons</EyebrowLabel>
        <div class="mt-3 flex flex-col gap-2">
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
      </div>
    </div>

    <!-- Desktop (lg+) -->
    <div class="hidden lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-3">
      <div class="col-span-2 flex min-h-0 flex-col border-r border-ink/16 p-6">
        <div class="flex items-end justify-between">
          <div>
            <EyebrowLabel>Trétinoïne 0,025 % · semaine 4 sur 12</EyebrowLabel>
            <h2 class="mt-2 font-heading text-[32px] font-normal">Léa · peau mixte, acné légère</h2>
          </div>
          <div class="flex items-center gap-3">
            <SegmentedControl v-model="range" name="range" :options="rangeOptions" />
            <BaseButton variant="secondary">Exporter pour mon dermato</BaseButton>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-8 gap-2.5">
          <div v-for="s in suivi.strip" :key="s.label">
            <div class="h-[112px] rounded-[20px]" :style="{ background: s.shade }" />
            <div class="mt-1.5 text-[11px] text-ink/50">{{ s.label }}</div>
          </div>
        </div>

        <div class="mt-6 flex min-h-0 flex-1 gap-6">
          <div class="flex flex-1 flex-col">
            <EyebrowLabel>Sévérité déclarée vs. attendue</EyebrowLabel>
            <div class="relative mt-3 min-h-[160px] flex-1 rounded-lg bg-surface p-3.5">
              <svg viewBox="0 0 320 150" preserveAspectRatio="none" class="absolute inset-3.5" style="width: calc(100% - 28px); height: calc(100% - 28px)">
                <polyline points="0,20 40,26 80,44 120,30 160,58 200,66 240,84 280,92 320,104" fill="none" stroke="#2f5741" stroke-width="3" stroke-linecap="round" />
                <polyline points="0,24 40,34 80,46 120,56 160,64 200,74 240,84 280,94 320,102" fill="none" stroke="#8a5a3b" stroke-width="2" stroke-dasharray="6 7" opacity=".7" />
              </svg>
            </div>
            <div class="mt-2.5 flex gap-4 text-[11px] font-semibold text-ink/60">
              <span class="flex items-center gap-1.5"><span class="h-[3px] w-3.5 rounded-full bg-accent" />Vos notes</span>
              <span class="flex items-center gap-1.5"><span class="h-0.5 w-3.5 bg-accent-2" />Courbe attendue</span>
            </div>
          </div>

          <div class="w-[300px] flex-none">
            <EyebrowLabel>Observance</EyebrowLabel>
            <div class="mt-3.5 flex flex-col gap-3">
              <div v-for="a in suivi.adherence" :key="a.label" class="flex justify-between text-sm">
                <span>{{ a.label }}</span>
                <span class="font-semibold">{{ a.value }}</span>
              </div>
            </div>
            <div class="mt-[18px] rounded-lg bg-surface p-4 text-[12.5px] leading-relaxed">
              Série actuelle : <strong>{{ suivi.streak }} jours</strong>. Record : {{ suivi.record }} jours.
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3.5 overflow-auto p-6">
        <EyebrowLabel>Ce qu'on vous conseille cette semaine</EyebrowLabel>
        <AdviceCard v-for="card in suivi.adviceCards" :key="card.title" v-bind="card" />
        <hr class="border-t border-ink/16">
        <EyebrowLabel muted>Rappel</EyebrowLabel>
        <p class="text-[12.5px] leading-relaxed text-ink/70">
          Ces conseils sont issus de publications relues et référencées en bas de chaque fiche. Ils ne remplacent
          pas votre dermatologue — l'export PDF reprend photos, notes et observance pour votre prochaine
          consultation.
        </p>
      </div>
    </div>
  </div>
</template>
