<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const router = useRouter()
const { questions, submit } = await useDiagnostic()

const currentIndex = ref(0)
const currentQuestion = computed(() => questions.value[currentIndex.value])
const total = computed(() => questions.value.length)
const submitting = ref(false)

// question_id -> answer draft, prefilled from any existing answers.
const drafts = reactive<Record<number, { optionIds: number[]; value: string }>>({})

watchEffect(() => {
  for (const q of questions.value) {
    if (!(q.id in drafts)) {
      drafts[q.id] = { optionIds: [...(q.answer?.option_ids ?? [])], value: q.answer?.value ?? '' }
    }
  }
})

const draft = computed(() => currentQuestion.value ? drafts[currentQuestion.value.id] : null)

function isSelected(optionId: number) {
  return draft.value?.optionIds.includes(optionId) ?? false
}

function selectSingle(optionId: number) {
  if (draft.value) draft.value.optionIds = [optionId]
}

function toggleMultiple(optionId: number) {
  if (!draft.value) return
  const idx = draft.value.optionIds.indexOf(optionId)
  if (idx === -1) draft.value.optionIds.push(optionId)
  else draft.value.optionIds.splice(idx, 1)
}

const canContinue = computed(() => {
  if (!currentQuestion.value || !draft.value) return false
  if (currentQuestion.value.type === 'text' || currentQuestion.value.type === 'number') return true
  return draft.value.optionIds.length > 0
})

async function goNext() {
  if (currentIndex.value < total.value - 1) {
    currentIndex.value++
    return
  }
  await finish()
}

function goBack() {
  if (currentIndex.value > 0) currentIndex.value--
  else router.push('/app/account')
}

async function finish() {
  submitting.value = true
  try {
    const answers = questions.value.map((q) => ({
      question_id: q.id,
      option_ids: drafts[q.id]?.optionIds ?? [],
      value: drafts[q.id]?.value || null,
    }))
    await submit(answers)
    router.push('/app')
  } finally {
    submitting.value = false
  }
}

function stepState(index: number): 'done' | 'current' | 'pending' {
  if (index < currentIndex.value) return 'done'
  if (index === currentIndex.value) return 'current'
  return 'pending'
}

function stepMeta(question: (typeof questions.value)[number]) {
  const d = drafts[question.id]
  if (!d) return undefined
  const labels = question.options.filter((o) => d.optionIds.includes(o.id)).map((o) => o.label)
  return labels.length ? labels.join(', ') : (d.value || undefined)
}
</script>

<template>
  <div v-if="currentQuestion" class="flex flex-1 flex-col">
    <!-- Mobile (< lg) -->
    <div class="flex flex-1 flex-col lg:hidden">
      <div class="flex items-center gap-3 px-[22px] pt-3">
        <button type="button" class="grid h-[38px] w-[38px] flex-none place-items-center rounded-full border border-ink/16" @click="goBack">←</button>
        <div class="h-1.5 flex-1 rounded-full bg-neutral-300">
          <div class="h-full rounded-full bg-accent" :style="{ width: `${((currentIndex + 1) / total) * 100}%` }" />
        </div>
        <span class="text-xs font-semibold">{{ currentIndex + 1 }}/{{ total }}</span>
      </div>

      <div class="px-[22px] pt-[26px]">
        <EyebrowLabel>Votre peau</EyebrowLabel>
        <h2 class="mt-2.5 text-pretty font-heading text-[30px] font-normal leading-[1.15]">
          {{ currentQuestion.label }}
        </h2>

        <div v-if="currentQuestion.type === 'single_choice'" class="mt-5 flex flex-col gap-2.5">
          <RadioOption
            v-for="opt in currentQuestion.options"
            :key="opt.id"
            :model-value="isSelected(opt.id) ? 'sel' : ''"
            value="sel"
            :label="opt.label"
            name="diag-mobile"
            @update:model-value="selectSingle(opt.id)"
          />
        </div>

        <div v-else-if="currentQuestion.type === 'multiple_choice'" class="mt-5 flex flex-wrap gap-2">
          <TagBadge
            v-for="opt in currentQuestion.options"
            :key="opt.id"
            :variant="isSelected(opt.id) ? 'accent' : 'neutral'"
            class="cursor-pointer"
            @click="toggleMultiple(opt.id)"
          >
            {{ opt.label }}
          </TagBadge>
        </div>

        <textarea
          v-else
          v-model="draft!.value"
          class="mt-5 min-h-[100px] w-full rounded-md bg-surface p-3.5 text-sm"
          placeholder="Facultatif — laissez vide si non concerné"
        />

        <InfoNote tone="accent" class="mt-[18px]">
          Pas d'inquiétude si vous hésitez — on affinera avec vos photos des premières semaines.
        </InfoNote>
      </div>

      <div class="mt-auto px-[22px] pb-[26px] pt-4">
        <BaseButton variant="primary" block :disabled="!canContinue || submitting" @click="goNext">
          {{ submitting ? 'Enregistrement…' : (currentIndex === total - 1 ? 'Terminer' : 'Continuer') }}
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
        <span class="text-sm font-semibold text-ink/50">Étape {{ currentIndex + 1 }} sur {{ total }}</span>
        <BaseButton variant="ghost" class="ml-auto" @click="router.push('/app')">Reprendre plus tard</BaseButton>
      </div>

      <div class="h-1.5 bg-neutral-200">
        <div class="h-full rounded-r-full bg-accent" :style="{ width: `${((currentIndex + 1) / total) * 100}%` }" />
      </div>

      <div class="grid flex-1 grid-cols-2">
        <div class="flex flex-col px-11 py-[52px]">
          <EyebrowLabel>Votre peau</EyebrowLabel>
          <h1 class="mt-3 max-w-[20ch] text-pretty font-heading text-[48px] font-normal leading-[1.1]">
            {{ currentQuestion.label }}
          </h1>

          <div v-if="currentQuestion.type === 'single_choice'" class="mt-[26px] flex flex-col gap-3">
            <RadioOption
              v-for="opt in currentQuestion.options"
              :key="opt.id"
              :model-value="isSelected(opt.id) ? 'sel' : ''"
              value="sel"
              :label="opt.label"
              name="diag-desktop"
              @update:model-value="selectSingle(opt.id)"
            />
          </div>

          <div v-else-if="currentQuestion.type === 'multiple_choice'" class="mt-[26px] flex flex-wrap gap-2.5">
            <TagBadge
              v-for="opt in currentQuestion.options"
              :key="opt.id"
              :variant="isSelected(opt.id) ? 'accent' : 'neutral'"
              class="cursor-pointer"
              @click="toggleMultiple(opt.id)"
            >
              {{ opt.label }}
            </TagBadge>
          </div>

          <textarea
            v-else
            v-model="draft!.value"
            class="mt-[26px] min-h-[120px] w-full max-w-[52ch] rounded-md bg-surface p-3.5 text-sm"
            placeholder="Facultatif — laissez vide si non concerné"
          />

          <div class="mt-auto flex items-center gap-3 pt-8">
            <BaseButton variant="secondary" @click="goBack">Retour</BaseButton>
            <BaseButton variant="primary" :disabled="!canContinue || submitting" @click="goNext">
              {{ submitting ? 'Enregistrement…' : (currentIndex === total - 1 ? 'Terminer' : 'Continuer') }}
            </BaseButton>
          </div>
        </div>

        <div class="flex flex-col bg-surface px-11 py-[52px]">
          <EyebrowLabel muted>Où vous en êtes</EyebrowLabel>
          <div class="mt-4 flex flex-col gap-3.5 overflow-auto">
            <div
              v-for="(q, i) in questions"
              :key="q.id"
              class="flex items-center gap-3"
              :class="stepState(i) === 'pending' ? 'opacity-50' : ''"
            >
              <span
                class="grid h-[22px] w-[22px] flex-none place-items-center rounded-full text-[11px]"
                :class="
                  stepState(i) === 'done'
                    ? 'bg-accent text-bg'
                    : stepState(i) === 'current'
                      ? 'border-2 border-accent text-accent'
                      : 'border-2 border-ink/20'
                "
              >{{ stepState(i) === 'done' ? '✓' : '' }}</span>
              <span class="flex-1 text-sm" :class="stepState(i) === 'current' ? 'font-semibold' : ''">{{ q.label }}</span>
              <span v-if="stepMeta(q)" class="text-xs text-ink/50">{{ stepMeta(q) }}</span>
            </div>
          </div>

          <div class="mt-7 rounded-lg bg-bg p-[18px] text-[13px] leading-relaxed">
            Pas d'inquiétude si vous hésitez — on affinera avec vos photos des premières semaines. Vos réponses
            restent modifiables à tout moment.
          </div>

          <p class="mt-auto pt-8 text-[11.5px] leading-relaxed text-ink/50">
            Questionnaire adapté des critères de phototype et de séborrhée utilisés en consultation. Il ne pose pas
            de diagnostic médical.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
