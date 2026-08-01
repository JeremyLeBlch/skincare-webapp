<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const router = useRouter()

const options = [
  { value: 'oily', label: 'Brillante et grasse', subLabel: 'Oily / shiny' },
  { value: 'combination', label: 'Grasse au centre, sèche ailleurs', subLabel: 'Combination' },
  { value: 'normal', label: 'Confortable, sans excès', subLabel: 'Normal' },
  { value: 'dry', label: 'Tiraille, desquame', subLabel: 'Dry / flaking' },
]
const skinType = ref('combination')

const progressSteps = [
  { label: 'Objectif du suivi', state: 'done', meta: 'Acné légère' },
  { label: 'Sensibilité de la peau', state: 'done', meta: 'Moyenne' },
  { label: 'Sébum en fin de journée', state: 'current' },
  { label: 'Réactions passées', state: 'pending' },
  { label: 'Traitement prescrit ?', state: 'pending' },
  { label: 'Première photo', state: 'pending' },
]
</script>

<template>
  <div class="flex flex-1 flex-col">
    <!-- Mobile (< lg) -->
    <div class="flex flex-1 flex-col lg:hidden">
      <div class="flex items-center gap-3 px-[22px] pt-3">
        <NuxtLink to="/app" class="grid h-[38px] w-[38px] flex-none place-items-center rounded-full border border-ink/16">←</NuxtLink>
        <div class="h-1.5 flex-1 rounded-full bg-neutral-300">
          <div class="h-full w-1/2 rounded-full bg-accent" />
        </div>
        <span class="text-xs font-semibold">3/6</span>
      </div>

      <div class="px-[22px] pt-[26px]">
        <EyebrowLabel>Votre peau</EyebrowLabel>
        <h2 class="mt-2.5 text-pretty font-heading text-[30px] font-normal leading-[1.15]">
          En fin de journée, votre zone T est…
        </h2>
        <div class="text-[11.5px] text-ink/50">How does your T-zone feel by evening?</div>

        <div class="mt-5 flex flex-col gap-2.5">
          <RadioOption
            v-for="opt in options"
            :key="opt.value"
            v-model="skinType"
            :value="opt.value"
            :label="opt.label"
            :sub-label="opt.subLabel"
            name="skin-type-mobile"
          />
        </div>

        <InfoNote tone="accent" class="mt-[18px]">
          Pas d'inquiétude si vous hésitez — on affinera avec vos photos des premières semaines.
        </InfoNote>
      </div>

      <div class="mt-auto px-[22px] pb-[26px] pt-4">
        <BaseButton variant="primary" block @click="router.push('/app')">Continuer</BaseButton>
      </div>
    </div>

    <!-- Desktop (lg+) -->
    <div class="hidden lg:flex lg:flex-1 lg:flex-col">
      <div class="flex items-center gap-6 border-b border-ink/16 px-6 py-4">
        <NuxtLink to="/app" class="flex items-center gap-2.5 font-body text-lg font-extrabold">
          <BrandMark :size="30" />
          Skincare Planning
        </NuxtLink>
        <span class="text-sm font-semibold text-ink/50">Étape 3 sur 6</span>
        <BaseButton variant="ghost" class="ml-auto" @click="router.push('/app')">Reprendre plus tard</BaseButton>
      </div>

      <div class="h-1.5 bg-neutral-200">
        <div class="h-full w-1/2 rounded-r-full bg-accent" />
      </div>

      <div class="grid flex-1 grid-cols-2">
        <div class="flex flex-col px-11 py-[52px]">
          <EyebrowLabel>Votre peau</EyebrowLabel>
          <h1 class="mt-3 max-w-[16ch] text-pretty font-heading text-[48px] font-normal leading-[1.1]">
            En fin de journée, votre zone T est…
          </h1>
          <div class="text-[11.5px] text-ink/50">How does your T-zone feel by evening?</div>

          <div class="mt-[26px] flex flex-col gap-3">
            <RadioOption
              v-for="opt in options"
              :key="opt.value"
              v-model="skinType"
              :value="opt.value"
              :label="opt.label"
              :sub-label="opt.subLabel"
              name="skin-type-desktop"
            />
          </div>

          <div class="mt-auto flex items-center gap-3 pt-8">
            <BaseButton variant="secondary" @click="router.back()">Retour</BaseButton>
            <BaseButton variant="primary" @click="router.push('/app')">Continuer</BaseButton>
            <span class="ml-auto text-xs text-ink/50">Entrée pour valider</span>
          </div>
        </div>

        <div class="flex flex-col bg-surface px-11 py-[52px]">
          <EyebrowLabel muted>Où vous en êtes</EyebrowLabel>
          <div class="mt-4 flex flex-col gap-3.5">
            <div
              v-for="step in progressSteps"
              :key="step.label"
              class="flex items-center gap-3"
              :class="step.state === 'pending' ? 'opacity-50' : ''"
            >
              <span
                class="grid h-[22px] w-[22px] flex-none place-items-center rounded-full text-[11px]"
                :class="
                  step.state === 'done'
                    ? 'bg-accent text-bg'
                    : step.state === 'current'
                      ? 'border-2 border-accent text-accent'
                      : 'border-2 border-ink/20'
                "
              >{{ step.state === 'done' ? '✓' : '' }}</span>
              <span class="flex-1 text-sm" :class="step.state === 'current' ? 'font-semibold' : ''">{{ step.label }}</span>
              <span v-if="step.meta" class="text-xs text-ink/50">{{ step.meta }}</span>
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
