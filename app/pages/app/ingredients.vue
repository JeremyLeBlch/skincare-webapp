<script setup lang="ts">
const { filters, ingredients } = useIngredients()

const selected = ref(ingredients[0])
</script>

<template>
  <div class="flex flex-1 flex-col lg:min-h-0">
    <!-- Mobile (< lg) -->
    <div class="flex flex-1 flex-col lg:hidden">
      <div class="px-[22px] pt-3.5">
        <h3 class="mb-3 font-heading text-[25px] font-normal">Ingrédients</h3>
        <input class="w-full rounded-md bg-surface px-3.5 py-2.5 text-sm" placeholder="Niacinamide, acide azélaïque…">
      </div>

      <div class="flex flex-wrap gap-1.5 px-[22px] pt-3.5">
        <TagBadge v-for="(f, i) in filters" :key="f" :variant="i === 0 ? 'accent' : 'neutral'">{{ f }}</TagBadge>
      </div>

      <div class="flex-1 overflow-auto px-[22px] pt-4 pb-6">
        <div class="flex flex-col gap-3">
          <div
            v-for="ing in ingredients"
            :key="ing.name"
            class="rounded-lg bg-surface p-4"
            :class="ing.dimmed ? 'opacity-75' : ''"
          >
            <div class="flex items-baseline justify-between">
              <div class="font-heading text-[19px] font-normal">{{ ing.name }}</div>
              <TagBadge :variant="ing.tag.variant">{{ ing.tag.label }}</TagBadge>
            </div>
            <div class="mt-0.5 text-[11.5px] text-ink/50">{{ ing.subtitle }}</div>
            <p class="mt-1.5 text-[12.5px] leading-relaxed">{{ ing.body }}</p>
            <div v-if="ing.meta" class="mt-2 text-[10.5px] text-ink/45">{{ ing.meta }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop (lg+): master list + detail -->
    <div class="hidden lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
      <div class="grid min-h-0 flex-1 grid-cols-[1fr_1.4fr]">
        <div class="flex min-h-0 flex-col border-r border-ink/16 p-6">
          <div class="flex flex-wrap gap-2">
            <TagBadge v-for="(f, i) in filters" :key="f" :variant="i === 0 ? 'accent' : 'neutral'">{{ f }}</TagBadge>
          </div>

          <div class="mt-4 flex flex-1 flex-col gap-2.5 overflow-auto">
            <button
              v-for="ing in ingredients"
              :key="ing.name"
              type="button"
              class="rounded-lg p-4 text-left"
              :class="[
                selected.name === ing.name ? 'bg-accent text-bg' : 'bg-surface',
                ing.dimmed && selected.name !== ing.name ? 'opacity-75' : '',
              ]"
              @click="selected = ing"
            >
              <div class="flex items-baseline justify-between">
                <div class="font-heading text-[22px] font-normal">{{ ing.name }}</div>
                <TagBadge v-if="selected.name !== ing.name" :variant="ing.tag.variant">{{ ing.tag.label }}</TagBadge>
                <span v-else class="rounded-full px-3 py-[5px] text-[11px] tracking-wide" style="background: rgba(247, 242, 233, 0.2)">
                  {{ ing.tag.label }}
                </span>
              </div>
              <div class="mt-0.5 text-xs" :class="selected.name === ing.name ? 'opacity-80' : 'text-ink/50'">
                {{ ing.subtitle }}
              </div>
            </button>
          </div>
        </div>

        <div class="overflow-auto px-9 py-7">
          <EyebrowLabel>{{ selected.detail?.eyebrow ?? selected.subtitle }}</EyebrowLabel>
          <h2 class="mt-2.5 font-heading text-[32px] font-normal">{{ selected.name }}</h2>
          <div class="text-[11.5px] text-ink/50">{{ selected.subtitle }}</div>
          <p class="mt-4 max-w-[60ch] text-[15px] leading-relaxed">
            {{ selected.detail?.description ?? selected.body }}
          </p>

          <template v-if="selected.detail">
            <div class="my-5 grid grid-cols-3 gap-3">
              <div v-for="stat in selected.detail.stats" :key="stat.label" class="rounded-lg bg-surface p-3.5">
                <div class="text-[11.5px] font-semibold text-ink/50">{{ stat.label }}</div>
                <div class="font-heading text-[26px] font-normal">{{ stat.value }}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <h5 class="font-heading text-base font-normal">Se marie avec</h5>
                <div class="mt-2 flex flex-wrap gap-1.5">
                  <TagBadge v-for="item in selected.detail.pairsWith" :key="item" variant="accent">{{ item }}</TagBadge>
                </div>
              </div>
              <div>
                <h5 class="font-heading text-base font-normal">Prudence avec</h5>
                <div class="mt-2 flex flex-wrap gap-1.5">
                  <TagBadge v-for="item in selected.detail.cautionWith" :key="item" variant="accent-2">{{ item }}</TagBadge>
                </div>
              </div>
            </div>

            <div class="mt-6 border-t border-ink/16 pt-3.5">
              <EyebrowLabel muted>Sources</EyebrowLabel>
              <ol class="mt-2.5 max-w-[72ch] list-decimal space-y-1.5 pl-5 text-[12.5px] leading-relaxed text-ink/70">
                <li v-for="source in selected.detail.sources" :key="source.text">
                  {{ source.text }} <a href="#" class="font-semibold text-accent-2">{{ source.link }}</a>
                </li>
              </ol>
              <div class="mt-2.5 text-[11.5px] text-ink/50">{{ selected.detail.reviewedNote }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
