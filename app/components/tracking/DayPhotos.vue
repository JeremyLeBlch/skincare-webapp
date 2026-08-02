<script setup lang="ts">
import type { PhotoAngle } from '~/composables/useEntry'
import type { TrackingPhoto } from '~/composables/useTracking'

/**
 * One day of the photo strip: every angle taken that day, side by side, each
 * badged with the angle it shows — a face and a profile are otherwise hard to
 * tell apart at thumbnail size.
 */
withDefaults(
  defineProps<{
    day: TrackingPhoto
    /** Size classes for a single thumbnail. */
    tile?: string
    interactive?: boolean
  }>(),
  { tile: 'h-[110px] w-[84px]', interactive: true },
)

defineEmits<{ pick: [PhotoAngle] }>()
</script>

<template>
  <div class="flex-none">
    <div class="flex gap-1">
      <component
        :is="interactive ? 'button' : 'div'"
        v-for="photo in day.photos"
        :key="photo.angle"
        :type="interactive ? 'button' : undefined"
        class="relative overflow-hidden rounded-lg bg-cover bg-center"
        :class="[tile, interactive ? 'cursor-pointer' : '']"
        :style="{ backgroundImage: `url('${photo.photoUrl}')` }"
        @click="interactive && $emit('pick', photo.angle)"
      >
        <span class="absolute inset-x-1 bottom-1 truncate rounded-full bg-bg/85 py-[2px] text-center text-[9px] font-semibold text-ink/70">
          {{ photo.label }}
        </span>
      </component>
    </div>
    <div class="mt-1.5 text-[11px] text-ink/50">{{ day.label }}</div>
  </div>
</template>
