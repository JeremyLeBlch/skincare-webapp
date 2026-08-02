<script setup lang="ts">
import type { EntryData, Mood, PhotoAngle } from '~/composables/useEntry'

/**
 * One day, opened from the calendar: its photos at a size worth looking at,
 * plus what was written that day. The calendar cell is a thumbnail — this is
 * where a user actually compares a profile to last week's.
 */
const props = defineProps<{
  /** Y-m-d of the day on show. */
  date: string | null
  /** "J12" */
  label: string | null
}>()

const open = defineModel<boolean>('open', { default: false })

// `replacing` tells the import sheet whether it is about to overwrite a shot,
// so it can warn instead of promising a blank slot.
const emit = defineEmits<{ addPhoto: [{ angle: PhotoAngle; replacing: boolean }] }>()

const entry = ref<EntryData | null>(null)
const loading = ref(false)
const error = ref(false)

const moodLabels: Record<Mood, string> = { better: 'Mieux', same: 'Pareil', worse: 'Moins bien' }

const angles = computed(() =>
  PHOTO_ANGLES.map((angle) => ({ ...angle, photoUrl: entry.value?.photos[angle.value] ?? null })),
)

const taken = computed(() => entry.value?.tasks.filter((task) => task.done).length ?? 0)

async function load() {
  if (!props.date) return

  loading.value = true
  error.value = false
  try {
    entry.value = await apiFetch<EntryData>(`/entries/${props.date}`)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

// Reload whenever another day is opened, and after a photo lands on this one.
watch([open, () => props.date], ([isOpen]) => {
  if (!isOpen) return
  entry.value = null
  load()
})

defineExpose({ reload: load })
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-40 flex items-end justify-center bg-ink/55 lg:items-center lg:p-6"
    @click.self="open = false"
  >
    <div class="flex max-h-[92vh] w-full flex-col rounded-t-lg bg-bg lg:max-h-[88vh] lg:max-w-[880px] lg:rounded-lg">
      <div class="flex items-center gap-3 border-b border-ink/16 px-[22px] py-3.5">
        <div class="flex-1">
          <div class="font-heading text-[21px] font-normal">{{ label ?? 'Journée' }}</div>
          <div v-if="entry" class="text-[11.5px] font-semibold text-ink/55">{{ entry.dateLabel }}</div>
        </div>
        <button
          type="button"
          class="grid h-[38px] w-[38px] flex-none cursor-pointer place-items-center rounded-full border border-ink/16"
          @click="open = false"
        >
          ✕
        </button>
      </div>

      <div class="flex-1 overflow-auto px-[22px] py-4">
        <p v-if="loading" class="text-[12.5px] text-ink/55">Chargement…</p>
        <InfoNote v-else-if="error" tone="accent-2">
          Impossible de charger cette journée. Vérifiez votre connexion et réessayez.
        </InfoNote>

        <template v-else-if="entry">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div v-for="angle in angles" :key="angle.value">
              <div
                v-if="angle.photoUrl"
                class="h-[260px] rounded-lg bg-cover bg-center sm:h-[300px]"
                :style="{ backgroundImage: `url('${angle.photoUrl}')` }"
              />
              <button
                v-else
                type="button"
                class="grid h-[140px] w-full cursor-pointer place-items-center gap-1 rounded-lg border-2 border-dashed border-ink/20 text-ink/50 sm:h-[300px]"
                @click="emit('addPhoto', { angle: angle.value, replacing: false })"
              >
                <span class="font-heading text-[22px] font-normal text-accent">+</span>
                <span class="text-[11px] font-semibold">Ajouter {{ angle.label }}</span>
              </button>
              <div class="mt-1.5 flex items-center justify-between text-[11px] text-ink/50">
                <span>{{ angle.label }}</span>
                <button
                  v-if="angle.photoUrl"
                  type="button"
                  class="cursor-pointer font-semibold text-accent"
                  @click="emit('addPhoto', { angle: angle.value, replacing: true })"
                >
                  Remplacer
                </button>
              </div>
            </div>
          </div>

          <EyebrowLabel class="mt-5">Ce jour-là</EyebrowLabel>
          <div class="mt-3 flex flex-wrap items-center gap-2">
            <TagBadge v-if="entry.mood" variant="accent">{{ moodLabels[entry.mood] }}</TagBadge>
            <TagBadge v-for="symptom in entry.symptoms" :key="symptom">{{ symptom }}</TagBadge>
            <TagBadge v-if="entry.tasks.length" variant="outline">{{ taken }}/{{ entry.tasks.length }} pris</TagBadge>
            <span v-if="!entry.mood && !entry.symptoms.length" class="text-[12.5px] text-ink/50">
              Rien de noté ce jour-là.
            </span>
          </div>
          <p v-if="entry.note" class="mt-3 rounded-lg bg-surface p-3.5 text-[13px] leading-relaxed">{{ entry.note }}</p>
        </template>
      </div>

      <div class="flex gap-2.5 border-t border-ink/16 px-[22px] py-3.5 pb-[22px]">
        <BaseButton variant="secondary" block @click="emit('addPhoto', { angle: 'face', replacing: !!entry?.photos.face })">
          Ajouter une photo
        </BaseButton>
        <BaseButton
          variant="primary"
          block
          @click="navigateTo({ path: '/app/entry', query: { date: props.date } })"
        >
          Remplir les notes
        </BaseButton>
      </div>
    </div>
  </div>
</template>
