<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const router = useRouter()
const today = useToday()
const { login } = useAuth()

const email = ref('lea.martin@email.fr')
const password = ref('')
const remember = ref(true)
const errorMessage = ref('')
const loading = ref(false)

async function submit() {
  errorMessage.value = ''
  loading.value = true
  try {
    await login({ email: email.value, password: password.value })
    router.push('/app')
  } catch (error: any) {
    errorMessage.value = error?.data?.message ?? 'Adresse e-mail ou mot de passe incorrect.'
  } finally {
    loading.value = false
  }
}

const highlights = [
  { title: 'Gérer la desquamation', meta: '4 études citées · relu en juillet' },
  { title: 'Choisir un SPF non comédogène', meta: '6 études citées · relu en juin' },
  { title: 'Marques post-acné', meta: '5 études citées · relu en juin' },
]
</script>

<template>
  <div class="grid flex-1 grid-cols-1 lg:grid-cols-2">
    <div class="flex flex-col px-6 py-8 sm:px-11 sm:py-10 lg:px-14">
      <NuxtLink to="/" class="flex items-center gap-2.5 font-body text-lg font-extrabold">
        <BrandMark :size="32" />
        Skincare Planning
      </NuxtLink>

      <div class="mx-auto my-auto w-full max-w-[400px] py-10">
        <h1 class="font-heading text-[36px] font-normal sm:text-[46px]">Bon retour</h1>
        <p class="mt-2 text-sm text-ink/50">Votre série vous attend — {{ today.streak }} jours d'affilée.</p>

        <form class="mt-7 flex flex-col gap-3.5" @submit.prevent="submit">
          <div>
            <label class="mb-1.5 block text-xs font-semibold">Adresse e-mail</label>
            <input v-model="email" type="email" required class="w-full rounded-md bg-surface px-3.5 py-2.5 text-sm">
          </div>
          <div>
            <label class="mb-1.5 flex items-center justify-between text-xs font-semibold">
              Mot de passe
              <a href="#" class="font-semibold text-accent-2">Oublié ?</a>
            </label>
            <input v-model="password" type="password" required class="w-full rounded-md bg-surface px-3.5 py-2.5 text-sm">
          </div>
          <label class="flex cursor-pointer items-center gap-2.5 text-[13.5px]">
            <input v-model="remember" type="checkbox" class="sr-only">
            <span
              class="grid h-5 w-5 flex-none place-items-center rounded-[7px] text-[11px]"
              :class="remember ? 'bg-accent text-bg' : 'border-2 border-ink/20'"
            >{{ remember ? '✓' : '' }}</span>
            Rester connectée sur cet appareil
          </label>
          <p v-if="errorMessage" class="text-[13px] font-semibold text-accent-2">{{ errorMessage }}</p>
          <BaseButton type="submit" variant="primary" block :disabled="loading" class="mt-0.5 py-3.5 text-[15px]">
            {{ loading ? 'Connexion…' : 'Se connecter' }}
          </BaseButton>
        </form>

        <div class="my-6 flex items-center gap-3.5">
          <span class="h-px flex-1 bg-ink/16" />
          <span class="text-xs text-ink/50">ou</span>
          <span class="h-px flex-1 bg-ink/16" />
        </div>

        <div class="flex gap-3">
          <BaseButton variant="secondary" class="flex-1 justify-center py-3">Continuer avec Apple</BaseButton>
          <BaseButton variant="secondary" class="flex-1 justify-center py-3">Continuer avec Google</BaseButton>
        </div>

        <p class="mt-6 text-[13.5px]">
          Pas encore de compte ? <NuxtLink to="/signup" class="font-semibold">Commencer un suivi</NuxtLink>
        </p>
      </div>

      <p class="max-w-[52ch] text-[11.5px] leading-relaxed text-ink/50">
        Vos photos sont chiffrées et ne sont jamais utilisées pour entraîner un modèle. Vous pouvez les exporter ou
        tout supprimer à tout moment.
      </p>
    </div>

    <div class="hidden flex-col justify-between gap-8 bg-accent px-8 py-10 text-bg lg:flex lg:px-12 lg:py-13">
      <div class="text-[11px] font-semibold tracking-[0.1em] text-bg/70 uppercase">Pendant votre absence</div>
      <div>
        <div class="max-w-[20ch] font-heading text-[38px] leading-[1.06] font-normal xl:text-[52px]">
          Trois nouvelles fiches relues pour votre profil.
        </div>
        <div class="mt-7 flex flex-col gap-3">
          <div v-for="h in highlights" :key="h.title" class="rounded-lg bg-bg/10 px-4 py-4">
            <div class="font-heading text-[22px] font-normal">{{ h.title }}</div>
            <div class="mt-0.5 text-[12.5px] opacity-75">{{ h.meta }}</div>
          </div>
        </div>
      </div>
      <p class="max-w-[44ch] text-[12.5px] leading-relaxed opacity-75">
        Chaque fiche indique son niveau de preuve et ses références. Aucun contenu sponsorisé.
      </p>
    </div>
  </div>
</template>
