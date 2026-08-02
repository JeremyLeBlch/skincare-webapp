<script setup lang="ts">
const route = useRoute()
const slug = computed(() => (route.query.slug as string) || DEFAULT_ADVICE_SLUG)

const { advice, apply } = await useAdvice(slug)

const applying = ref(false)
async function onApply() {
  applying.value = true
  try {
    await apply()
  } finally {
    applying.value = false
  }
}
</script>

<template>
  <div v-if="advice" class="flex flex-1 flex-col lg:min-h-0">
    <!-- Mobile (< lg) -->
    <div class="flex flex-1 flex-col lg:hidden">
      <div class="flex items-center gap-3 px-[22px] pt-3">
        <NuxtLink to="/app" class="grid h-[38px] w-[38px] flex-none place-items-center rounded-full border border-ink/16">←</NuxtLink>
        <span class="flex-1 text-[11.5px] font-semibold text-ink/50">Fiche conseil</span>
        <!-- The only way to the ingredient library from a phone: it is absent
             from the bottom bar, which is full. -->
        <NuxtLink to="/app/ingredients" class="text-[11.5px] font-semibold text-accent">Ingrédients →</NuxtLink>
      </div>

      <!-- The other cards written for this profile, as a scrollable row. -->
      <div v-if="advice.related.length" class="mt-3 flex gap-1.5 overflow-x-auto px-[22px] pb-1">
        <NuxtLink
          v-for="item in advice.related"
          :key="item.slug"
          :to="{ path: '/app/advice', query: { slug: item.slug } }"
          class="flex-none rounded-full px-3.5 py-2 text-[12.5px] whitespace-nowrap"
          :class="item.active ? 'bg-accent font-semibold text-bg' : 'bg-surface text-ink'"
        >
          {{ item.label }}
        </NuxtLink>
      </div>

      <div class="flex-1 overflow-auto px-[22px] pt-[18px] pb-6">
        <EyebrowLabel>{{ advice.context }}</EyebrowLabel>
        <h2 class="mt-2.5 text-pretty font-heading text-[28px] font-normal leading-[1.15]">{{ advice.title }}</h2>
        <div class="text-[11.5px] text-ink/50">{{ advice.subtitle }}</div>
        <p class="mt-3.5 text-sm leading-relaxed">{{ advice.intro }}</p>

        <div class="my-3.5 grid grid-cols-2 gap-2.5">
          <div v-for="stat in advice.stats" :key="stat.label" class="rounded-lg bg-surface p-3.5">
            <div class="text-[11.5px] font-semibold text-ink/50">{{ stat.label }}</div>
            <div class="font-heading text-[22px] font-normal">{{ stat.value }}</div>
          </div>
        </div>

        <div class="rounded-lg bg-accent-100 p-4">
          <div class="font-heading text-[17px] font-normal">{{ advice.sandwichRule.title }}</div>
          <p class="mt-1 text-sm leading-relaxed">{{ advice.sandwichRule.body }}</p>
        </div>

        <div class="mt-4">
          <div class="font-heading text-[17px] font-normal">{{ advice.stopWarning.title }}</div>
          <p class="mt-1 text-[13.5px] leading-relaxed">{{ advice.stopWarning.body }}</p>
        </div>

        <EyebrowLabel class="mt-5">Appliquer à mon traitement</EyebrowLabel>
        <div class="mt-3 flex flex-col gap-2 rounded-lg bg-surface p-[18px]">
          <div class="text-[10px] tracking-wide text-accent uppercase">{{ advice.suggestion.kicker }}</div>
          <div class="font-heading text-[17px] font-normal leading-tight">{{ advice.suggestion.title }}</div>
          <p class="text-[13px] text-ink/80">{{ advice.suggestion.body }}</p>
          <BaseButton variant="primary" block class="mt-1.5" :disabled="applying" @click="onApply">
            {{ applying ? 'Application…' : 'Appliquer' }}
          </BaseButton>
        </div>

        <template v-if="advice.relatedProduct">
          <EyebrowLabel muted class="mt-5">Concerné dans votre routine</EyebrowLabel>
          <div class="mt-3 flex items-center gap-3 rounded-lg bg-surface p-3.5">
            <div class="h-11 w-11 flex-none rounded-md" style="background: linear-gradient(140deg, #e0d5c4, #c9bda8)" />
            <div class="text-[13.5px] font-semibold">{{ advice.relatedProduct }}</div>
          </div>
        </template>
        <p v-if="advice.relatedNote" class="mt-2.5 text-[12.5px] leading-relaxed text-ink/65">{{ advice.relatedNote }}</p>

        <div class="mt-5 border-t border-ink/16 pt-3.5">
          <EyebrowLabel muted>Sources</EyebrowLabel>
          <ol class="mt-2.5 list-decimal space-y-1.5 pl-5 text-[12.5px] leading-relaxed text-ink/70">
            <li v-for="source in advice.sources" :key="source.text">
              {{ source.text }} <a href="#" class="font-semibold text-accent-2">{{ source.link }}</a>
            </li>
          </ol>
          <div class="mt-2.5 text-[11px] text-ink/50">{{ advice.reviewedNote }}</div>
        </div>
      </div>
    </div>

    <!-- Desktop (lg+) -->
    <div class="hidden lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[230px_1fr_300px]">
      <div class="overflow-auto border-r border-ink/16 p-6">
        <EyebrowLabel muted>Pour votre profil</EyebrowLabel>
        <div class="mt-3.5 flex flex-col gap-1.5">
          <NuxtLink
            v-for="item in advice.related"
            :key="item.slug"
            :to="{ path: '/app/advice', query: { slug: item.slug } }"
            class="rounded-full px-3.5 py-2.5 text-[13.5px]"
            :class="item.active ? 'bg-accent font-semibold text-bg' : 'text-ink'"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>

      <div class="overflow-auto border-r border-ink/16 px-9 py-[26px]">
        <EyebrowLabel>{{ advice.context }}</EyebrowLabel>
        <h1 class="mt-2.5 max-w-[18ch] text-pretty font-heading text-[40px] font-normal leading-[1.1]">{{ advice.title }}</h1>
        <div class="text-[11.5px] text-ink/50">{{ advice.subtitle }}</div>
        <p class="mt-3.5 max-w-[62ch] text-[15px] leading-relaxed">{{ advice.intro }}</p>

        <div class="my-[18px] grid max-w-[62ch] grid-cols-3 gap-3">
          <div v-for="stat in advice.stats" :key="stat.label" class="rounded-lg bg-surface p-3.5">
            <div class="text-[11.5px] font-semibold text-ink/50">{{ stat.label }}</div>
            <div class="font-heading text-[26px] font-normal">{{ stat.value }}</div>
          </div>
        </div>

        <div class="max-w-[62ch] rounded-lg bg-accent-100 p-4">
          <h4 class="font-heading text-[17px] font-normal">{{ advice.sandwichRule.title }}</h4>
          <p class="mt-1.5 text-sm leading-relaxed">{{ advice.sandwichRule.body }}</p>
        </div>

        <div class="mt-4 max-w-[62ch]">
          <h4 class="font-heading text-[17px] font-normal">{{ advice.stopWarning.title }}</h4>
          <p class="mt-1 text-[13.5px] leading-relaxed">{{ advice.stopWarning.body }}</p>
        </div>

        <div class="mt-4 border-t border-ink/16 pt-3.5">
          <EyebrowLabel muted>Sources</EyebrowLabel>
          <ol class="mt-2.5 max-w-[74ch] list-decimal space-y-1.5 pl-5 text-[12.5px] leading-relaxed text-ink/70">
            <li v-for="source in advice.sources" :key="source.text">
              {{ source.text }} <a href="#" class="font-semibold text-accent-2">{{ source.link }}</a>
            </li>
          </ol>
          <div class="mt-2.5 text-[11.5px] text-ink/50">{{ advice.reviewedNote }}</div>
        </div>
      </div>

      <div class="flex flex-col gap-3.5 overflow-auto p-6">
        <EyebrowLabel>Appliquer à mon traitement</EyebrowLabel>
        <div class="flex flex-col gap-2 rounded-lg bg-surface p-[18px]">
          <div class="text-[10px] tracking-wide text-accent uppercase">{{ advice.suggestion.kicker }}</div>
          <div class="font-heading text-[17px] font-normal leading-tight">{{ advice.suggestion.title }}</div>
          <p class="text-[13px] text-ink/80">{{ advice.suggestion.body }}</p>
          <BaseButton variant="primary" block class="mt-1.5" :disabled="applying" @click="onApply">
            {{ applying ? 'Application…' : 'Appliquer' }}
          </BaseButton>
        </div>

        <template v-if="advice.relatedProduct">
          <EyebrowLabel muted>Concerné dans votre routine</EyebrowLabel>
          <div class="flex items-center gap-3 rounded-lg bg-surface p-3.5">
            <div class="h-11 w-11 flex-none rounded-md" style="background: linear-gradient(140deg, #e0d5c4, #c9bda8)" />
            <div class="text-[13.5px] font-semibold">{{ advice.relatedProduct }}</div>
          </div>
        </template>
        <p v-if="advice.relatedNote" class="text-[12.5px] leading-relaxed text-ink/65">{{ advice.relatedNote }}</p>
      </div>
    </div>
  </div>
</template>
