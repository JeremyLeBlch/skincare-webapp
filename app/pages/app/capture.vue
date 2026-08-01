<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const router = useRouter()
const { save } = await useEntry()

const angles = ['Face', 'Profil G', 'Profil D']
const angle = ref('Face')
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)

const angleKey = computed(() => ({ Face: 'photoFace', 'Profil G': 'photoLeft', 'Profil D': 'photoRight' })[angle.value] as 'photoFace' | 'photoLeft' | 'photoRight')

function openCamera() {
  fileInput.value?.click()
}

async function onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploading.value = true
  try {
    await save({ [angleKey.value]: file })
    router.push('/app/entry')
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col">
    <!-- Mobile (< lg): fullscreen camera mock -->
    <div class="relative flex flex-1 flex-col overflow-hidden lg:hidden" style="background: linear-gradient(160deg, #2b3a30, #1a2620); color: #f7f2e9">
      <div class="flex items-center justify-between px-6 pt-4">
        <span class="text-xs font-semibold">Jour 24 · {{ angle.toLowerCase() }}</span>
        <span class="rounded-full px-3 py-[5px] text-[11px] tracking-wide" style="background: rgba(247, 242, 233, 0.15)">
          {{ angles.indexOf(angle) + 1 }} / 3 angles
        </span>
      </div>

      <div class="absolute inset-x-[30px] top-[78px] bottom-[250px] grid place-items-center rounded-[120px] border-2" style="border-color: rgba(247, 242, 233, 0.4)">
        <div class="h-[210px] w-[150px] rounded-[100px] border-2 border-dashed" style="border-color: rgba(247, 242, 233, 0.7)" />
      </div>

      <div class="mt-auto px-6 pb-[30px]">
        <div class="mb-[18px] rounded-[22px] p-4 text-[12.5px] leading-relaxed" style="background: rgba(247, 242, 233, 0.12)">
          Alignez-vous sur le contour de <strong>votre photo d'hier</strong>. Même lumière, même distance — c'est ce
          qui rend la comparaison honnête.
        </div>

        <div class="flex items-center justify-between">
          <div class="h-[52px] w-[52px] flex-none rounded-[18px]" style="background: rgba(247, 242, 233, 0.2)" />
          <button
            type="button"
            class="grid h-[78px] w-[78px] cursor-pointer place-items-center rounded-full border-[3px] disabled:opacity-50"
            style="border-color: #f7f2e9"
            :disabled="uploading"
            @click="openCamera"
          >
            <span class="h-[62px] w-[62px] rounded-full" style="background: #f7f2e9" />
          </button>
          <input ref="fileInput" type="file" accept="image/*" capture="environment" class="hidden" @change="onFileSelected">
          <span v-if="uploading" class="absolute bottom-[110px] left-1/2 -translate-x-1/2 text-[11px] font-semibold">Envoi…</span>
          <div class="flex w-[52px] flex-col items-center gap-1 text-[10px] font-semibold">
            <span class="text-lg">◐</span>
            Fantôme
          </div>
        </div>

        <div class="mt-[18px] flex justify-center gap-2.5">
          <button
            v-for="a in angles"
            :key="a"
            type="button"
            class="rounded-full px-3 py-[5px] text-[11px] tracking-wide"
            :style="a === angle ? 'background:#f7f2e9;color:#1c2a22' : 'background:rgba(247,242,233,.15);color:#f7f2e9'"
            @click="angle = a"
          >
            {{ a }}
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop (lg+): capture is a mobile-only step -->
    <div class="hidden flex-1 flex-col items-center justify-center gap-3 px-6 text-center lg:flex">
      <EyebrowLabel muted>Capture photo</EyebrowLabel>
      <p class="max-w-sm text-sm text-ink/60">
        Cette étape se fait depuis votre mobile. Sur ordinateur, importez vos photos directement.
      </p>
      <BaseButton variant="primary" @click="router.push('/app/entry')">Aller à l'import photo</BaseButton>
    </div>
  </div>
</template>
