<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const router = useRouter()
const { entry, save } = await useEntry()

const moodOptions = [
  { label: 'Mieux', value: 'better' },
  { label: 'Pareil', value: 'same' },
  { label: 'Moins bien', value: 'worse' },
]
const mood = ref(entry.value?.mood ?? 'same')

const feelingLabels = ['Tiraillements', 'Rougeurs', 'Desquamation', 'Démangeaisons', 'Nouveau bouton']
const selectedSymptoms = ref<string[]>([...(entry.value?.symptoms ?? [])])

function toggleSymptom(label: string) {
  const i = selectedSymptoms.value.indexOf(label)
  if (i === -1) selectedSymptoms.value.push(label)
  else selectedSymptoms.value.splice(i, 1)
}

const note = ref(entry.value?.note ?? '')

const faceInput = ref<HTMLInputElement | null>(null)
const leftInput = ref<HTMLInputElement | null>(null)
const rightInput = ref<HTMLInputElement | null>(null)
const uploadingAngle = ref<string | null>(null)
const photoError = ref<string | null>(null)

async function onAnglePhoto(angle: 'photoFace' | 'photoLeft' | 'photoRight', event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploadingAngle.value = angle
  photoError.value = null
  try {
    await save({ [angle]: file })
  } catch {
    photoError.value = "L'envoi de la photo a échoué. Vérifiez votre connexion et réessayez."
  } finally {
    uploadingAngle.value = null
    // Let the same file be picked again after a failure — without this the
    // input keeps its value and re-selecting it fires no `change` event.
    input.value = ''
  }
}

const saving = ref(false)

async function submit() {
  saving.value = true
  try {
    await save({ mood: mood.value as 'better' | 'same' | 'worse', symptoms: selectedSymptoms.value, note: note.value })
    router.push('/app')
  } finally {
    saving.value = false
  }
}

async function skipToday() {
  saving.value = true
  try {
    await save({ skipped: true })
    router.push('/app')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col">
    <!-- Mobile (< lg) -->
    <div class="flex flex-1 flex-col lg:hidden">
      <div class="flex items-center gap-3 px-[22px] pt-3">
        <button type="button" class="grid h-[38px] w-[38px] flex-none place-items-center rounded-full border border-ink/16" @click="router.push('/app')">✕</button>
        <div class="flex-1">
          <div class="font-heading text-lg font-normal">Entrée du jour</div>
        </div>
        <BaseButton variant="ghost" :disabled="saving" @click="skipToday">Ignorer</BaseButton>
      </div>

      <div class="flex gap-2.5 px-[22px] pt-4">
        <div
          class="flex h-[180px] flex-1 items-end justify-start rounded-lg bg-cover bg-center p-2.5 text-[10px] font-semibold text-ink/55"
          :style="entry?.photos.face ? { backgroundImage: `url('${entry.photos.face}')` } : 'background: linear-gradient(140deg, #e0d5c4, #c9bda8)'"
        >
          Face · aujourd'hui
        </div>
        <div class="flex w-[92px] flex-col gap-2.5">
          <button
            type="button"
            class="grid flex-1 place-items-center rounded-[20px] border-2 border-dashed border-ink/20 bg-cover bg-center text-center text-[10px] font-semibold text-ink/45"
            :style="entry?.photos.left ? { backgroundImage: `url('${entry.photos.left}')` } : ''"
            :disabled="uploadingAngle === 'photoLeft'"
            @click="leftInput?.click()"
          >
            {{ entry?.photos.left ? '' : '+ Profil G' }}
          </button>
          <button
            type="button"
            class="grid flex-1 place-items-center rounded-[20px] border-2 border-dashed border-ink/20 bg-cover bg-center text-center text-[10px] font-semibold text-ink/45"
            :style="entry?.photos.right ? { backgroundImage: `url('${entry.photos.right}')` } : ''"
            :disabled="uploadingAngle === 'photoRight'"
            @click="rightInput?.click()"
          >
            {{ entry?.photos.right ? '' : '+ Profil D' }}
          </button>
        </div>
      </div>
      <InfoNote v-if="photoError" tone="accent-2" class="mx-[22px] mt-2.5">{{ photoError }}</InfoNote>
      <input ref="faceInput" type="file" accept="image/*" capture="environment" class="hidden" @change="onAnglePhoto('photoFace', $event)">
      <input ref="leftInput" type="file" accept="image/*" capture="environment" class="hidden" @change="onAnglePhoto('photoLeft', $event)">
      <input ref="rightInput" type="file" accept="image/*" capture="environment" class="hidden" @change="onAnglePhoto('photoRight', $event)">

      <div class="flex-1 overflow-auto px-[22px] pt-5 pb-6">
        <EyebrowLabel>Aujourd'hui, ma peau est…</EyebrowLabel>
        <SegmentedControl v-model="mood" name="mood-mobile" :options="moodOptions" block class="mt-2.5" />

        <EyebrowLabel class="mt-5">Ce que je ressens</EyebrowLabel>
        <div class="mt-2.5 flex flex-wrap gap-1.5">
          <TagBadge
            v-for="label in feelingLabels"
            :key="label"
            :variant="selectedSymptoms.includes(label) ? 'accent' : 'neutral'"
            class="cursor-pointer"
            @click="toggleSymptom(label)"
          >
            {{ label }}
          </TagBadge>
        </div>

        <div class="mt-5">
          <label class="mb-1.5 block text-xs font-semibold">Note libre</label>
          <textarea v-model="note" class="min-h-[86px] w-full rounded-md bg-surface p-3.5 text-sm" />
        </div>

        <InfoNote tone="accent" class="mt-3">
          Sauter un soir n'annule rien. Reprenez au prochain jour prévu, sans doubler la dose.
        </InfoNote>

        <BaseButton variant="primary" block class="mt-3.5" :disabled="saving" @click="submit">
          {{ saving ? 'Enregistrement…' : 'Enregistrer la journée' }}
        </BaseButton>
      </div>
    </div>

    <!-- Desktop (lg+) -->
    <div class="hidden lg:flex lg:flex-1 lg:flex-col">
      <div class="flex items-center gap-6 border-b border-ink/16 px-6 py-4">
        <NuxtLink to="/app" class="flex items-center gap-2.5 font-body text-lg font-extrabold">
          <BrandMark :size="30" />
          Skincare Planning
        </NuxtLink>
        <span class="text-sm font-semibold text-ink/50">Entrée du jour</span>
        <div class="ml-auto flex items-center gap-3">
          <BaseButton variant="ghost" :disabled="saving" @click="skipToday">Ignorer aujourd'hui</BaseButton>
          <BaseButton variant="primary" :disabled="saving" @click="submit">
            {{ saving ? 'Enregistrement…' : 'Enregistrer la journée' }}
          </BaseButton>
        </div>
      </div>

      <div class="grid flex-1 grid-cols-[1.25fr_1fr]">
        <div class="flex min-h-0 flex-col border-r border-ink/16 p-7">
          <div class="flex items-baseline justify-between">
            <EyebrowLabel>Photos du jour · {{ [entry?.photos.face, entry?.photos.left, entry?.photos.right].filter(Boolean).length }} sur 3</EyebrowLabel>
            <span class="text-sm text-ink/50">Cliquez pour importer</span>
          </div>

          <div class="mt-3.5 grid min-h-0 flex-1 grid-cols-[2fr_1fr] gap-3.5">
            <button
              type="button"
              class="flex items-end justify-end rounded-lg bg-cover bg-center p-2.5"
              :style="entry?.photos.face ? { backgroundImage: `url('${entry.photos.face}')` } : 'background: linear-gradient(140deg, #e0d5c4, #c9bda8)'"
              @click="faceInput?.click()"
            >
              <span class="rounded-full bg-bg/90 px-3 py-[5px] text-[10px] font-semibold text-ink/55">Face</span>
            </button>
            <div class="flex min-h-0 flex-col gap-3.5">
              <button
                type="button"
                class="grid flex-1 place-items-center gap-1.5 rounded-lg border-2 border-dashed border-ink/20 bg-cover bg-center text-ink/50"
                :style="entry?.photos.left ? { backgroundImage: `url('${entry.photos.left}')` } : ''"
                @click="leftInput?.click()"
              >
                <template v-if="!entry?.photos.left">
                  <span class="font-heading text-[22px] font-normal text-accent">+</span>
                  <span class="text-[11px] font-semibold">Profil gauche</span>
                </template>
              </button>
              <button
                type="button"
                class="grid flex-1 place-items-center gap-1.5 rounded-lg border-2 border-dashed border-ink/20 bg-cover bg-center text-ink/50"
                :style="entry?.photos.right ? { backgroundImage: `url('${entry.photos.right}')` } : ''"
                @click="rightInput?.click()"
              >
                <template v-if="!entry?.photos.right">
                  <span class="font-heading text-[22px] font-normal text-accent">+</span>
                  <span class="text-[11px] font-semibold">Profil droit</span>
                </template>
              </button>
            </div>
          </div>

          <InfoNote v-if="photoError" tone="accent-2" class="mt-4">{{ photoError }}</InfoNote>

          <InfoNote tone="accent" class="mt-4">
            <strong>Même lumière, même distance.</strong> Photographiez-vous dans les mêmes conditions que la veille
            — c'est ce qui rend la comparaison honnête.
          </InfoNote>
        </div>

        <div class="flex flex-col overflow-auto p-7">
          <EyebrowLabel>Aujourd'hui, ma peau est…</EyebrowLabel>
          <SegmentedControl v-model="mood" name="mood-desktop" :options="moodOptions" block class="mt-3" />

          <EyebrowLabel class="mt-6">Ce que je ressens</EyebrowLabel>
          <div class="mt-3 flex flex-wrap gap-2">
            <TagBadge
              v-for="label in feelingLabels"
              :key="label"
              :variant="selectedSymptoms.includes(label) ? 'accent' : 'neutral'"
              class="cursor-pointer"
              @click="toggleSymptom(label)"
            >
              {{ label }}
            </TagBadge>
          </div>

          <EyebrowLabel class="mt-6">Traitement suivi ce soir</EyebrowLabel>
          <div class="mt-3 flex flex-col gap-2.5">
            <ChecklistItem v-for="item in entry?.tasks ?? []" :key="item.id" :label="item.label" :done="item.done" />
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
