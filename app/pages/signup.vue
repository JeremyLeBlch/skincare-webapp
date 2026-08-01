<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const router = useRouter()
const { register } = useAuth()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const sex = ref('female')
const acceptTerms = ref(true)
const reminderOptIn = ref(false)
const errorMessage = ref('')
const loading = ref(false)

const sexOptions = [
  { label: 'Femme', value: 'female' },
  { label: 'Homme', value: 'male' },
  { label: 'Autre', value: 'other' },
]

const passwordStrength = computed(() => {
  const len = password.value.length
  if (len === 0) return 0
  if (len < 6) return 1
  if (len < 9) return 2
  if (len < 12) return 3
  return 4
})

async function submit() {
  errorMessage.value = ''
  loading.value = true
  try {
    await register({
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      password: password.value,
      sex: sex.value as 'male' | 'female' | 'other',
    })
    router.push('/app')
  } catch (error: any) {
    const errors = error?.data?.errors as Record<string, string[]> | undefined
    errorMessage.value = errors ? Object.values(errors)[0]?.[0] : (error?.data?.message ?? 'Une erreur est survenue.')
  } finally {
    loading.value = false
  }
}

const steps = [
  { title: 'Six questions sur votre peau', body: 'Type de peau, réactions passées, traitement en cours' },
  { title: 'Votre photo de départ', body: 'Elle servira de référence pour tous vos avant / après' },
  { title: 'Vos premières fiches sourcées', body: 'Choisies selon votre profil, avec leur niveau de preuve' },
]
</script>

<template>
  <div class="grid flex-1 grid-cols-1 lg:grid-cols-2">
    <div class="flex flex-col px-6 py-8 sm:px-11 sm:py-10 lg:px-14">
      <NuxtLink to="/" class="flex items-center gap-2.5 font-body text-lg font-extrabold">
        <BrandMark :size="32" />
        Skincare Planning
      </NuxtLink>

      <div class="mx-auto my-auto w-full max-w-[410px] py-10">
        <h1 class="font-heading text-[34px] font-normal sm:text-[44px]">Créer mon compte</h1>
        <p class="mt-2 text-sm text-ink/50">Deux minutes, puis on parle de votre peau. Gratuit, sans abonnement.</p>

        <div class="mt-6 flex gap-3">
          <BaseButton variant="secondary" class="flex-1 justify-center py-3">Continuer avec Apple</BaseButton>
          <BaseButton variant="secondary" class="flex-1 justify-center py-3">Continuer avec Google</BaseButton>
        </div>

        <div class="my-5.5 flex items-center gap-3.5">
          <span class="h-px flex-1 bg-ink/16" />
          <span class="text-xs text-ink/50">ou avec un e-mail</span>
          <span class="h-px flex-1 bg-ink/16" />
        </div>

        <form class="flex flex-col gap-3.5" @submit.prevent="submit">
          <div class="flex gap-3">
            <div class="flex-1">
              <label class="mb-1.5 block text-xs font-semibold">Prénom</label>
              <input v-model="firstName" type="text" required class="w-full rounded-md bg-surface px-3.5 py-2.5 text-sm">
            </div>
            <div class="flex-1">
              <label class="mb-1.5 block text-xs font-semibold">Nom</label>
              <input v-model="lastName" type="text" required class="w-full rounded-md bg-surface px-3.5 py-2.5 text-sm">
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-semibold">Sexe</label>
            <SegmentedControl v-model="sex" name="sex" :options="sexOptions" block />
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-semibold">Adresse e-mail</label>
            <input v-model="email" type="email" required class="w-full rounded-md bg-surface px-3.5 py-2.5 text-sm">
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-semibold">Mot de passe</label>
            <input v-model="password" type="password" required class="w-full rounded-md bg-surface px-3.5 py-2.5 text-sm">
            <div class="mt-2 flex gap-1.5">
              <span
                v-for="i in 4"
                :key="i"
                class="h-[5px] flex-1 rounded-full"
                :class="i <= passwordStrength ? 'bg-accent' : 'bg-neutral-300'"
              />
            </div>
            <div class="mt-1.5 text-xs text-ink/50">
              {{
                passwordStrength >= 3
                  ? 'Bon mot de passe'
                  : password.length
                    ? 'Encore un peu court'
                    : '12 caractères minimum recommandé'
              }}
            </div>
          </div>

          <div class="mt-1.5 flex flex-col gap-3">
            <label class="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed">
              <input v-model="acceptTerms" type="checkbox" required class="sr-only">
              <span
                class="mt-0.5 grid h-[22px] w-[22px] flex-none place-items-center rounded-[8px] text-[11px]"
                :class="acceptTerms ? 'bg-accent text-bg' : 'border-2 border-ink/20'"
              >{{ acceptTerms ? '✓' : '' }}</span>
              <span>J'accepte les <a href="#" class="font-semibold text-accent-2">conditions d'utilisation</a> et la <a href="#" class="font-semibold text-accent-2">politique de confidentialité</a>.</span>
            </label>
            <label class="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed">
              <input v-model="reminderOptIn" type="checkbox" class="sr-only">
              <span
                class="mt-0.5 grid h-[22px] w-[22px] flex-none place-items-center rounded-[8px] text-[11px]"
                :class="reminderOptIn ? 'bg-accent text-bg' : 'border-2 border-ink/20'"
              >{{ reminderOptIn ? '✓' : '' }}</span>
              <span>Me rappeler ma photo du soir, à l'heure que je choisirai.</span>
            </label>
          </div>

          <p v-if="errorMessage" class="text-[13px] font-semibold text-accent-2">{{ errorMessage }}</p>
          <BaseButton type="submit" variant="primary" block :disabled="loading" class="mt-1 py-3.5 text-[15px]">
            {{ loading ? 'Création…' : 'Créer mon compte' }}
          </BaseButton>
        </form>

        <p class="mt-5 text-[13.5px]">
          Déjà inscrite ? <NuxtLink to="/login" class="font-semibold">Se connecter</NuxtLink>
        </p>
      </div>
    </div>

    <div class="hidden flex-col justify-between gap-8 bg-accent px-8 py-10 text-bg lg:flex lg:px-12 lg:py-13">
      <div class="text-[11px] font-semibold tracking-[0.1em] text-bg/70 uppercase">Ce qui vous attend</div>
      <div>
        <div class="max-w-[20ch] font-heading text-[34px] leading-[1.08] font-normal xl:text-[46px]">
          Votre premier suivi commence ce soir.
        </div>
        <div class="mt-7 flex flex-col gap-3.5">
          <div v-for="(step, i) in steps" :key="step.title" class="flex items-baseline gap-3.5">
            <span class="font-heading text-[26px] font-normal opacity-60">{{ i + 1 }}</span>
            <div>
              <div class="text-[14.5px] font-semibold">{{ step.title }}</div>
              <div class="text-[12.5px] opacity-75">{{ step.body }}</div>
            </div>
          </div>
        </div>
        <div class="mt-6 rounded-lg bg-bg/10 p-4 text-[13px] leading-relaxed">
          Aucun produit à vendre, aucune routine sponsorisée. Skincare Planning est un outil de suivi : il ne pose
          pas de diagnostic et ne remplace pas une consultation dermatologique.
        </div>
      </div>
      <p class="max-w-[44ch] text-[12.5px] leading-relaxed opacity-75">
        Vos photos sont chiffrées et ne servent jamais à entraîner un modèle. Export ou suppression à tout moment.
      </p>
    </div>
  </div>
</template>
