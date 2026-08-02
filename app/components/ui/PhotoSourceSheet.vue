<script setup lang="ts">
/**
 * The two ways to add a photo: shoot it now, or pick one that already exists.
 * Both are plain file inputs — only the camera one carries `capture`, which is
 * what makes a phone open the camera instead of the gallery. Without a second,
 * capture-less input there is no way to import an older shot on mobile.
 *
 * The `default` slot takes extra fields (angle, day) the caller needs to
 * resolve before the file lands.
 */
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    busy?: boolean
  }>(),
  { title: 'Ajouter une photo', subtitle: undefined, busy: false },
)

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ select: [File] }>()

const cameraInput = ref<HTMLInputElement | null>(null)
const libraryInput = ref<HTMLInputElement | null>(null)

function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  // Re-picking the same file fires no `change` — clear it so a retry works.
  input.value = ''
  if (file) emit('select', file)
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 lg:items-center lg:p-6"
    @click.self="busy || (open = false)"
  >
    <div class="w-full max-w-[420px] rounded-t-lg bg-bg p-[22px] pb-7 lg:rounded-lg lg:pb-[22px]">
      <div class="font-heading text-[21px] font-normal">{{ title }}</div>
      <p v-if="subtitle" class="mt-1 text-[12.5px] leading-relaxed text-ink/60">{{ subtitle }}</p>

      <slot />

      <div class="mt-[18px] flex flex-col gap-2.5">
        <BaseButton variant="primary" block :disabled="busy" @click="cameraInput?.click()">
          {{ busy ? 'Envoi…' : 'Prendre une photo' }}
        </BaseButton>
        <BaseButton variant="secondary" block :disabled="busy" @click="libraryInput?.click()">
          Importer depuis mes photos
        </BaseButton>
      </div>

      <input ref="cameraInput" type="file" accept="image/*" capture="environment" class="hidden" @change="onFile">
      <input ref="libraryInput" type="file" accept="image/*" class="hidden" @change="onFile">

      <!-- Anything else this day can be given: the note, the mood… -->
      <slot name="footer" />


      <button
        type="button"
        class="mt-3.5 w-full cursor-pointer text-center text-[12.5px] font-semibold text-ink/55 disabled:opacity-45"
        :disabled="busy"
        @click="open = false"
      >
        Annuler
      </button>
    </div>
  </div>
</template>
