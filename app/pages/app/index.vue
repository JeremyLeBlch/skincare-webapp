<script setup lang="ts">
const { today, toggleTask } = await useToday()
const router = useRouter()

async function onToggleTask(id: number) {
  try {
    await toggleTask(id)
  } catch {
    // Photo/note tasks are derived automatically and can't be toggled directly.
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col lg:min-h-0">
    <!-- Mobile (< lg): stacked single column -->
    <div class="flex flex-1 flex-col lg:hidden">
      <div class="flex items-center justify-between px-[22px] pt-3.5">
        <div class="flex items-center gap-2.5">
          <BrandMark :size="30" full />
          <span class="font-heading text-base font-normal">Skincare Planning</span>
        </div>
        <NuxtLink to="/app/profile" class="h-[38px] w-[38px] flex-none rounded-full bg-neutral-300" />
      </div>

      <div class="px-[22px] pt-5">
        <div class="text-[11.5px] font-semibold text-ink/50">
          {{ today.dateLabel }} · Jour {{ today.dayNumber }} · {{ today.weekLabel }}
        </div>
        <h2 class="mt-1 font-heading text-[32px] font-normal">Bonjour {{ today.userName }}</h2>
      </div>

      <div class="px-[22px] pt-[18px]">
        <StreakCard :streak="today.streak" :days="today.days" />
      </div>

      <div class="flex-1 overflow-auto px-[22px] pt-[22px] pb-6">
        <EyebrowLabel>À faire aujourd'hui</EyebrowLabel>
        <DailyChecklist :items="today.tasks" @toggle="onToggleTask" />

        <InfoNote class="mt-3.5">
          <strong>{{ today.weeklyNote.title }}</strong> {{ today.weeklyNote.body }}
        </InfoNote>

        <BaseButton variant="primary" block class="mt-3.5" @click="router.push('/app/capture')">Prendre la photo du jour</BaseButton>

        <EyebrowLabel class="mt-[22px]">Derniers jours</EyebrowLabel>
        <RecentDaysStrip class="mt-3" :days="today.recentDays" />

        <EyebrowLabel class="mt-[22px]">Prochain jalon</EyebrowLabel>
        <MilestoneCard
          class="mt-3"
          :title="today.milestone.title"
          :body="today.milestone.body"
          :link-label="today.milestone.linkLabel"
          :link-to="today.milestone.linkTo"
        />

        <EyebrowLabel class="mt-[22px]">Pour vous aujourd'hui</EyebrowLabel>
        <div class="mt-3 flex flex-col gap-3">
          <AdviceCard v-for="card in today.adviceCards" :key="card.title" v-bind="card" />
        </div>

        <EyebrowLabel muted class="mt-[22px]">Mon traitement</EyebrowLabel>
        <TreatmentTable class="mt-3" :items="today.treatment" />
        <BaseButton variant="secondary" block class="mt-3" @click="router.push('/app/profile')">Modifier mon traitement</BaseButton>
      </div>
    </div>

    <!-- Desktop (lg+): dashboard grid, main column + sidebar -->
    <div class="hidden lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[2fr_1fr]">
      <div class="flex min-h-0 flex-col border-r border-ink/16 p-7">
        <div class="text-sm font-semibold text-ink/50">
          {{ today.dateLabel }} · Jour {{ today.dayNumber }} · {{ today.weekLabel }}
        </div>
        <h1 class="mt-2 font-heading text-[46px] font-normal">Bonjour {{ today.userName }}</h1>

        <div class="mt-[22px] grid min-h-0 flex-1 grid-cols-2 gap-[22px]">
          <div class="flex flex-col">
            <StreakCard :streak="today.streak" :days="today.days" />

            <InfoNote class="mt-[18px]">
              <strong>{{ today.weeklyNote.title }}</strong> {{ today.weeklyNote.body }}
            </InfoNote>

            <EyebrowLabel class="mt-[22px]">Derniers jours</EyebrowLabel>
            <RecentDaysStrip class="mt-3" :days="today.recentDays" />
          </div>

          <div class="flex min-h-0 flex-col">
            <EyebrowLabel>À faire aujourd'hui</EyebrowLabel>
            <DailyChecklist :items="today.desktopTasks" @toggle="onToggleTask" />

            <EyebrowLabel class="mt-6">Prochain jalon</EyebrowLabel>
            <MilestoneCard
              class="mt-3"
              :title="today.milestone.title"
              :body="today.milestone.body"
              :link-label="today.milestone.linkLabel"
              :link-to="today.milestone.linkTo"
            />
          </div>
        </div>
      </div>

      <aside class="flex flex-col gap-3.5 overflow-auto p-7">
        <EyebrowLabel>Pour vous aujourd'hui</EyebrowLabel>
        <AdviceCard v-for="card in today.adviceCards" :key="card.title" v-bind="card" />

        <hr class="border-t border-ink/16">

        <EyebrowLabel muted>Mon traitement</EyebrowLabel>
        <TreatmentTable :items="today.treatment" />

        <BaseButton variant="secondary" block @click="router.push('/app/profile')">Modifier mon traitement</BaseButton>
      </aside>
    </div>
  </div>
</template>
