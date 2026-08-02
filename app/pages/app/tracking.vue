<script setup lang="ts">
import type { PhotoAngle } from '~/composables/useEntry'
import type { TrackingPhoto } from '~/composables/useTracking'

const { tracking, refresh } = await useTracking()
const { account } = await useAccount()

function photoStyle(photo: TrackingPhoto | null | undefined, fallback: string) {
  return photo?.photoUrl ? { backgroundImage: `url("${photo.photoUrl}")` } : { background: fallback }
}

// Filing a photo on a day already gone by: the user shot it at the time but
// never uploaded it, or is catching up on a whole week at once.
const importOpen = ref(false)
const importDate = ref('')
const importLabel = ref<string | null>(null)
const importAngle = ref<PhotoAngle>('face')
const importHasPhoto = ref(false)
const importPickDate = ref(false)
const importing = ref(false)
const importError = ref<string | null>(null)

/** Without a date, the sheet asks for one (any day since the treatment started). */
function openImport(date: string | null = null, label: string | null = null, hasPhoto = false, angle: PhotoAngle = 'face') {
  importDate.value = date ?? tracking.value?.today ?? ''
  importLabel.value = label
  importPickDate.value = date === null
  importHasPhoto.value = hasPhoto
  importAngle.value = angle
  importError.value = null
  importOpen.value = true
}

const importSubtitle = computed(() => {
  const day = new Date(`${importDate.value}T00:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return importHasPhoto.value
    ? `${day} — la photo importée remplacera celle de cet angle.`
    : `${day} — prenez-la maintenant ou importez celle que vous avez déjà.`
})

async function onImportPhoto(file: File) {
  importing.value = true
  importError.value = null
  try {
    await saveEntryPhoto(importDate.value, importAngle.value, file)
    await refresh()
    importOpen.value = false
  } catch {
    importError.value = "L'import a échoué. Vérifiez votre connexion et réessayez."
  } finally {
    importing.value = false
  }
}

/**
 * A photo is rarely the whole story: the same day still wants its mood, its
 * symptoms and its note. The entry form takes a date, so it opens on that day.
 */
function openEntryForm() {
  navigateTo({ path: '/app/entry', query: { date: importDate.value } })
}

const rangeOptions = [
  { label: 'Mois', value: 'month' },
  { label: '12 sem.', value: '12w' },
  { label: 'Tout', value: 'all' },
]
const range = ref('12w')

const weekdayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const moodPoints = computed(() => {
  const trend = tracking.value?.moodTrend ?? []
  if (trend.length < 2) return ''
  const step = 320 / (trend.length - 1)
  return trend.map((t, i) => `${Math.round(i * step)},${15 + (t.value - 1) * 60}`).join(' ')
})

const exporting = ref(false)
async function onExport() {
  exporting.value = true
  try {
    await exportAccountData()
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <div v-if="tracking" class="flex flex-1 flex-col lg:min-h-0">
    <!-- Mobile (< lg) -->
    <div class="flex flex-1 flex-col lg:hidden">
      <div class="flex items-baseline justify-between px-[22px] pt-3.5">
        <h3 class="font-heading text-[25px] font-normal">Mon suivi</h3>
        <TagBadge variant="accent">{{ tracking.streak }} jours</TagBadge>
      </div>

      <div class="flex-1 overflow-auto px-[22px] pt-4 pb-6">
        <div class="rounded-lg bg-surface p-[18px]">
          <div class="grid grid-cols-7 gap-1.5">
            <div v-for="d in weekdayLabels" :key="d" class="text-center text-[11px] text-ink/45">{{ d }}</div>
            <button
              v-for="(cell, i) in tracking.cells"
              :key="i"
              type="button"
              class="relative grid aspect-square cursor-pointer place-items-center rounded-full text-[10px] font-semibold disabled:cursor-default"
              :class="{
                'bg-accent text-bg': cell.state === 'full',
                'bg-accent-300 text-ink': cell.state === 'partial',
                'bg-neutral-300 text-ink/50': cell.state === 'missed',
                'border border-ink/16': cell.state === 'empty',
              }"
              :disabled="!cell.date"
              @click="openImport(cell.date, `J${cell.day}`, cell.hasPhoto)"
            >
              {{ cell.day }}
              <span v-if="cell.hasPhoto" class="absolute bottom-[3px] h-1 w-1 rounded-full bg-current opacity-70" />
            </button>
          </div>
          <div class="mt-3.5 flex gap-3.5 text-[10px] font-semibold text-ink/60">
            <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-accent" />Photo + note</span>
            <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-accent-300" />Partiel</span>
            <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-neutral-300" />Manqué</span>
          </div>
          <p class="mt-2.5 text-[11px] leading-relaxed text-ink/55">
            Touchez un jour — même passé — pour ajouter sa photo ou remplir ses notes.
          </p>
        </div>

        <div v-if="tracking.startPhoto" class="mt-3.5 flex gap-2.5">
          <div
            class="flex h-[130px] flex-1 items-start rounded-lg bg-cover bg-center p-2.5"
            :style="photoStyle(tracking.startPhoto, 'linear-gradient(140deg, #d3c7b2, #bdb098)')"
          >
            <span class="rounded-full bg-bg/85 px-2 py-[3px] text-[10px] font-semibold text-ink/60">
              Départ · {{ tracking.startPhoto.label }}
              <template v-if="tracking.startPhoto.angleLabel"> · {{ tracking.startPhoto.angleLabel }}</template>
            </span>
          </div>
          <div
            v-if="tracking.latestPhoto"
            class="flex h-[130px] flex-1 items-start rounded-lg bg-cover bg-center p-2.5"
            :style="photoStyle(tracking.latestPhoto, 'linear-gradient(140deg, #e8dfd0, #d6cab5)')"
          >
            <span class="rounded-full bg-bg/85 px-2 py-[3px] text-[10px] font-semibold text-ink/60">
              Auj. · {{ tracking.latestPhoto.label }}
              <template v-if="tracking.latestPhoto.angleLabel"> · {{ tracking.latestPhoto.angleLabel }}</template>
            </span>
          </div>
          <div v-else class="grid h-[130px] flex-1 place-items-center rounded-lg border-2 border-dashed border-ink/20 p-2.5 text-center text-[10px] font-semibold text-ink/45">
            Votre prochaine photo apparaîtra ici
          </div>
        </div>
        <InfoNote v-else class="mt-3.5">
          Vos photos apparaîtront ici dès votre première entrée avec photo.
        </InfoNote>
        <BaseButton variant="secondary" block class="mt-2.5" :disabled="!tracking.startPhoto" @click="$router.push('/app/compare')">Comparer en grand</BaseButton>

        <EyebrowLabel class="mt-[22px]">Mes photos</EyebrowLabel>
        <div class="mt-3 flex gap-3 overflow-x-auto pb-1">
          <DayPhotos
            v-for="s in tracking.strip"
            :key="s.date"
            :day="s"
            @pick="openImport(s.date, s.label, true, $event)"
          />
          <div class="w-[84px] flex-none">
            <button
              type="button"
              class="grid h-[110px] w-full cursor-pointer place-items-center gap-1 rounded-lg border-2 border-dashed border-ink/20 text-ink/50"
              @click="openImport()"
            >
              <span class="font-heading text-[22px] font-normal text-accent">+</span>
              <span class="text-[10px] font-semibold">Ajouter</span>
            </button>
            <div class="mt-1.5 text-[11px] text-ink/50">Un autre jour</div>
          </div>
        </div>

        <EyebrowLabel class="mt-[22px]">Jalons</EyebrowLabel>
        <div class="mt-3 flex flex-col gap-2">
          <div
            v-for="m in tracking.milestones"
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

        <EyebrowLabel class="mt-[22px]">Ma peau ressentie au fil des jours</EyebrowLabel>
        <div class="relative mt-3 h-[150px] rounded-lg bg-surface p-3.5">
          <svg
            v-if="moodPoints"
            viewBox="0 0 320 150"
            preserveAspectRatio="none"
            class="absolute inset-3.5"
            style="width: calc(100% - 28px); height: calc(100% - 28px)"
          >
            <polyline :points="moodPoints" fill="none" stroke="#2f5741" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p v-else class="text-[12.5px] leading-relaxed text-ink/50">
            Renseignez « Aujourd'hui, ma peau est… » dans vos entrées pour voir cette courbe.
          </p>
        </div>
        <div class="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-ink/60">
          <span class="h-[3px] w-3.5 rounded-full bg-accent" />Mieux → moins bien, d'après vos entrées
        </div>

        <EyebrowLabel class="mt-[22px]">Observance</EyebrowLabel>
        <div class="mt-3 flex flex-col gap-2.5">
          <div v-for="a in tracking.adherence" :key="a.label" class="flex justify-between text-[13.5px]">
            <span>{{ a.label }}</span>
            <span class="font-semibold">{{ a.value }}</span>
          </div>
        </div>
        <div class="mt-3 rounded-lg bg-surface p-3.5 text-[12.5px] leading-relaxed">
          Série actuelle : <strong>{{ tracking.streak }} jours</strong>. Record : {{ tracking.record }} jours.
        </div>

        <EyebrowLabel class="mt-[22px]">Ce qu'on vous conseille cette semaine</EyebrowLabel>
        <div class="mt-3 flex flex-col gap-3">
          <AdviceCard v-for="card in tracking.adviceCards" :key="card.title" v-bind="card" />
        </div>

        <BaseButton variant="secondary" block class="mt-[22px]" :disabled="exporting" @click="onExport">
          {{ exporting ? 'Export…' : 'Exporter pour mon dermato' }}
        </BaseButton>
        <p class="mt-3 text-[11.5px] leading-relaxed text-ink/60">
          Ces conseils sont issus de publications relues et référencées en bas de chaque fiche. Ils ne remplacent pas
          votre dermatologue — l'export reprend photos, notes et observance pour votre prochaine consultation.
        </p>
      </div>
    </div>

    <!-- Desktop (lg+) -->
    <div class="hidden lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-3">
      <div class="col-span-2 flex min-h-0 flex-col border-r border-ink/16 p-6">
        <div class="flex items-end justify-between">
          <div>
            <EyebrowLabel>{{ account?.treatmentProgressLabel }}</EyebrowLabel>
            <h2 class="mt-2 font-heading text-[32px] font-normal">
              {{ account?.firstName }}<template v-if="account?.skinTags.length"> · {{ account.skinTags.map((t) => t.label).join(', ') }}</template>
            </h2>
          </div>
          <div class="flex items-center gap-3">
            <SegmentedControl v-model="range" name="range" :options="rangeOptions" />
            <BaseButton variant="secondary" @click="openImport()">Ajouter une photo</BaseButton>
            <BaseButton variant="secondary" :disabled="exporting" @click="onExport">
              {{ exporting ? 'Export…' : 'Exporter pour mon dermato' }}
            </BaseButton>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-3">
          <DayPhotos
            v-for="s in tracking.strip"
            :key="s.date"
            :day="s"
            tile="h-[112px] w-[80px]"
            @pick="openImport(s.date, s.label, true, $event)"
          />
          <div class="w-[80px]">
            <button
              type="button"
              class="grid h-[112px] w-full cursor-pointer place-items-center gap-1 rounded-lg border-2 border-dashed border-ink/20 text-ink/50"
              @click="openImport()"
            >
              <span class="font-heading text-[22px] font-normal text-accent">+</span>
              <span class="text-[11px] font-semibold">Ajouter</span>
            </button>
            <div class="mt-1.5 text-[11px] text-ink/50">Jour au choix</div>
          </div>
        </div>
        <InfoNote v-if="!tracking.strip.length" class="mt-2.5">
          Vos photos apparaîtront ici au fil de vos entrées — vous pouvez aussi importer celles des jours passés.
        </InfoNote>

        <div class="mt-6 flex min-h-0 flex-1 gap-6">
          <div class="flex flex-1 flex-col">
            <EyebrowLabel>Ma peau ressentie au fil des jours</EyebrowLabel>
            <div class="relative mt-3 min-h-[160px] flex-1 rounded-lg bg-surface p-3.5">
              <svg v-if="moodPoints" viewBox="0 0 320 150" preserveAspectRatio="none" class="absolute inset-3.5" style="width: calc(100% - 28px); height: calc(100% - 28px)">
                <polyline :points="moodPoints" fill="none" stroke="#2f5741" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <p v-else class="absolute inset-3.5 flex items-center text-[12.5px] text-ink/50">
                Renseignez « Aujourd'hui, ma peau est… » dans vos entrées pour voir cette courbe.
              </p>
            </div>
            <div class="mt-2.5 flex gap-4 text-[11px] font-semibold text-ink/60">
              <span class="flex items-center gap-1.5"><span class="h-[3px] w-3.5 rounded-full bg-accent" />Mieux → moins bien, d'après vos entrées</span>
            </div>
          </div>

          <div class="w-[300px] flex-none">
            <EyebrowLabel>Observance</EyebrowLabel>
            <div class="mt-3.5 flex flex-col gap-3">
              <div v-for="a in tracking.adherence" :key="a.label" class="flex justify-between text-sm">
                <span>{{ a.label }}</span>
                <span class="font-semibold">{{ a.value }}</span>
              </div>
            </div>
            <div class="mt-[18px] rounded-lg bg-surface p-4 text-[12.5px] leading-relaxed">
              Série actuelle : <strong>{{ tracking.streak }} jours</strong>. Record : {{ tracking.record }} jours.
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3.5 overflow-auto p-6">
        <EyebrowLabel>Ce qu'on vous conseille cette semaine</EyebrowLabel>
        <AdviceCard v-for="card in tracking.adviceCards" :key="card.title" v-bind="card" />
        <hr class="border-t border-ink/16">
        <EyebrowLabel muted>Rappel</EyebrowLabel>
        <p class="text-[12.5px] leading-relaxed text-ink/70">
          Ces conseils sont issus de publications relues et référencées en bas de chaque fiche. Ils ne remplacent
          pas votre dermatologue — l'export PDF reprend photos, notes et observance pour votre prochaine
          consultation.
        </p>
      </div>
    </div>

    <PhotoSourceSheet
      v-model:open="importOpen"
      :title="importLabel ?? 'Ajouter une photo'"
      :subtitle="importSubtitle"
      :busy="importing"
      @select="onImportPhoto"
    >
      <div v-if="importPickDate" class="mt-3.5">
        <label class="mb-1.5 block text-xs font-semibold">Jour de la photo</label>
        <input
          v-model="importDate"
          type="date"
          :min="tracking.startDate"
          :max="tracking.today"
          class="w-full rounded-md bg-surface p-3 text-sm"
        >
      </div>

      <EyebrowLabel class="mt-3.5">Angle</EyebrowLabel>
      <SegmentedControl
        :model-value="importAngle"
        name="import-angle"
        :options="PHOTO_ANGLES"
        block
        class="mt-2"
        @update:model-value="importAngle = $event as PhotoAngle"
      />

      <InfoNote v-if="importError" tone="accent-2" class="mt-3">{{ importError }}</InfoNote>

      <template #footer>
        <button
          type="button"
          class="mt-3 w-full cursor-pointer rounded-md bg-surface py-2.5 text-center text-[12.5px] font-semibold disabled:opacity-45"
          :disabled="importing"
          @click="openEntryForm"
        >
          Remplir les notes de ce jour
        </button>
      </template>
    </PhotoSourceSheet>
  </div>
</template>
