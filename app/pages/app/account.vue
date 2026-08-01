<script setup lang="ts">
const router = useRouter()
const { account, updateProfile, updatePassword, updateNotifications, uploadAvatar, exportData, deleteAccount } = await useAccount()
const { logout } = useAuth()

const tabs = ['Informations', 'Mon profil de peau', 'Rappels', 'Confidentialité', 'Mes données']
const activeTab = ref('Informations')

const firstName = ref(account.value?.firstName ?? '')
const lastName = ref(account.value?.lastName ?? '')
const sex = ref(account.value?.sex ?? 'unspecified')

watch(account, (a) => {
  if (!a) return
  firstName.value = a.firstName
  lastName.value = a.lastName
  sex.value = a.sex
})

function resetProfileForm() {
  if (!account.value) return
  firstName.value = account.value.firstName
  lastName.value = account.value.lastName
  sex.value = account.value.sex
}

const sexOptions = [
  { label: 'Femme', value: 'female' },
  { label: 'Homme', value: 'male' },
  { label: 'Autre', value: 'other' },
  { label: 'Je préfère ne pas dire', value: 'unspecified' },
]

const savingProfile = ref(false)
const profileMessage = ref('')
async function saveProfile() {
  savingProfile.value = true
  profileMessage.value = ''
  try {
    await updateProfile({ first_name: firstName.value, last_name: lastName.value, sex: sex.value })
    profileMessage.value = 'Enregistré.'
  } finally {
    savingProfile.value = false
  }
}

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordSaving = ref(false)
const passwordError = ref('')
const passwordSuccess = ref(false)

const passwordStrength = computed(() => {
  const len = newPassword.value.length
  if (len === 0) return 0
  if (len < 6) return 1
  if (len < 9) return 2
  if (len < 12) return 3
  return 4
})

async function savePassword() {
  passwordError.value = ''
  passwordSuccess.value = false
  passwordSaving.value = true
  try {
    await updatePassword({
      current_password: currentPassword.value,
      password: newPassword.value,
      password_confirmation: confirmPassword.value,
    })
    passwordSuccess.value = true
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (error: any) {
    passwordError.value = error?.data?.errors?.current_password?.[0]
      ?? error?.data?.errors?.password?.[0]
      ?? error?.data?.message
      ?? 'Une erreur est survenue.'
  } finally {
    passwordSaving.value = false
  }
}

const avatarInput = ref<HTMLInputElement | null>(null)
const avatarUploading = ref(false)
async function onAvatarSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  avatarUploading.value = true
  try {
    await uploadAvatar(file)
  } finally {
    avatarUploading.value = false
  }
}

const notifyEnabled = ref(account.value?.notifyEnabled ?? false)
const notifyTime = ref(account.value?.notifyTime?.slice(0, 5) ?? '20:00')
watch(account, (a) => {
  if (!a) return
  notifyEnabled.value = a.notifyEnabled
  notifyTime.value = a.notifyTime?.slice(0, 5) ?? '20:00'
})
const savingNotifications = ref(false)
async function saveNotifications() {
  savingNotifications.value = true
  try {
    await updateNotifications({ notify_enabled: notifyEnabled.value, notify_time: notifyEnabled.value ? notifyTime.value : null })
  } finally {
    savingNotifications.value = false
  }
}

const exporting = ref(false)
async function onExport() {
  exporting.value = true
  try {
    await exportData()
  } finally {
    exporting.value = false
  }
}

const deleting = ref(false)
const confirmingDelete = ref(false)
async function onDeleteAccount() {
  if (!confirmingDelete.value) {
    confirmingDelete.value = true
    return
  }
  deleting.value = true
  try {
    await deleteAccount()
    router.push('/login')
  } finally {
    deleting.value = false
  }
}

const loggingOut = ref(false)
async function handleLogout() {
  loggingOut.value = true
  try {
    await logout()
  } finally {
    router.push('/login')
  }
}
</script>

<template>
  <div v-if="account" class="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
    <!-- Settings tabs -->
    <div class="border-b border-ink/16 px-6 py-5 lg:w-[230px] lg:flex-none lg:border-r lg:border-b-0 lg:px-6 lg:py-6">
      <EyebrowLabel muted>Mon compte</EyebrowLabel>
      <div class="mt-3.5 flex gap-1.5 overflow-x-auto lg:mt-3.5 lg:flex-col lg:gap-1.5 lg:overflow-visible">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          class="flex-none rounded-full px-3.5 py-2.5 text-left text-[13.5px] whitespace-nowrap"
          :class="tab === activeTab ? 'bg-accent font-semibold text-bg' : 'text-ink'"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Main tab content -->
    <div class="flex-1 overflow-auto px-6 py-7 lg:px-9 lg:py-7">
      <div class="flex items-center gap-5">
        <span
          class="h-[84px] w-[84px] flex-none rounded-full bg-cover bg-center"
          :style="account.avatarUrl ? { backgroundImage: `url('${account.avatarUrl}')` } : 'background: linear-gradient(140deg, #e0d5c4, #c9bda8)'"
        />
        <div class="flex-1">
          <h1 class="font-heading text-[32px] font-normal lg:text-[40px]">{{ account.firstName }} {{ account.lastName }}</h1>
          <div class="mt-1 text-xs text-ink/50">{{ account.memberSinceLabel }} · {{ account.streak }} jours de série</div>
        </div>
        <BaseButton variant="secondary" class="hidden sm:inline-flex" :disabled="avatarUploading" @click="avatarInput?.click()">
          {{ avatarUploading ? 'Envoi…' : 'Changer la photo' }}
        </BaseButton>
        <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="onAvatarSelected">
      </div>

      <hr class="my-6 border-t border-ink/16">

      <template v-if="activeTab === 'Informations'">
        <EyebrowLabel>Informations personnelles</EyebrowLabel>
        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-xs font-semibold">Prénom</label>
            <input v-model="firstName" type="text" class="w-full rounded-md bg-surface px-3.5 py-2.5 text-sm">
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-semibold">Nom</label>
            <input v-model="lastName" type="text" class="w-full rounded-md bg-surface px-3.5 py-2.5 text-sm">
          </div>
        </div>

        <div class="mt-4">
          <label class="mb-2 block text-xs font-semibold">Sexe</label>
          <div class="flex flex-wrap gap-2.5">
            <label
              v-for="opt in sexOptions"
              :key="opt.value"
              class="flex cursor-pointer items-center gap-2.5 rounded-full px-4.5 py-2.5 text-sm"
              :class="sex === opt.value ? 'bg-accent text-bg' : 'bg-surface text-ink'"
            >
              <input v-model="sex" type="radio" name="account-sex" :value="opt.value" class="sr-only">
              <span
                class="h-[18px] w-[18px] flex-none rounded-full"
                :class="sex === opt.value ? 'bg-bg shadow-[inset_0_0_0_4px_var(--color-accent)]' : 'border-2 border-ink/20'"
              />
              {{ opt.label }}
            </label>
          </div>
          <div class="mt-2 text-xs text-ink/50">Utilisé uniquement pour affiner certaines recommandations hormonales.</div>
        </div>

        <div class="mt-5">
          <label class="mb-1.5 block text-xs font-semibold">Adresse e-mail</label>
          <div class="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center">
            <input :value="account.email" disabled class="w-full flex-1 cursor-not-allowed rounded-md bg-neutral-200 px-3.5 py-2.5 text-sm text-ink/55 sm:w-auto">
            <TagBadge>identifiant du compte</TagBadge>
          </div>
          <div class="mt-2 text-xs text-ink/50">
            L'e-mail est la base de votre compte. Pour le modifier,
            <a href="#" class="font-semibold text-accent">écrivez-nous</a> — nous vérifions la nouvelle adresse avant le changement.
          </div>
        </div>

        <div class="mt-6 flex items-center gap-3">
          <BaseButton type="button" variant="primary" :disabled="savingProfile" @click="saveProfile">
            {{ savingProfile ? 'Enregistrement…' : 'Enregistrer' }}
          </BaseButton>
          <BaseButton type="button" variant="ghost" @click="resetProfileForm">Annuler</BaseButton>
          <span v-if="profileMessage" class="text-xs font-semibold text-accent">{{ profileMessage }}</span>
        </div>

        <hr class="my-6 border-t border-ink/16">

        <EyebrowLabel>Mot de passe</EyebrowLabel>
        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-xs font-semibold">Mot de passe actuel</label>
            <input v-model="currentPassword" type="password" class="w-full rounded-md bg-surface px-3.5 py-2.5 text-sm">
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-semibold">Nouveau mot de passe</label>
            <input v-model="newPassword" type="password" class="w-full rounded-md bg-surface px-3.5 py-2.5 text-sm">
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
                  : newPassword.length
                    ? 'Encore un peu court'
                    : '12 caractères minimum recommandé'
              }}
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-xs font-semibold">Confirmer</label>
            <input v-model="confirmPassword" type="password" class="w-full rounded-md bg-surface px-3.5 py-2.5 text-sm">
          </div>
        </div>
        <p v-if="passwordError" class="mt-2 text-[13px] font-semibold text-accent-2">{{ passwordError }}</p>
        <p v-if="passwordSuccess" class="mt-2 text-[13px] font-semibold text-accent">Mot de passe mis à jour.</p>
        <BaseButton type="button" variant="primary" class="mt-5" :disabled="passwordSaving" @click="savePassword">
          {{ passwordSaving ? 'Mise à jour…' : 'Mettre à jour le mot de passe' }}
        </BaseButton>
      </template>

      <template v-else-if="activeTab === 'Mon profil de peau'">
        <EyebrowLabel>Profil de peau</EyebrowLabel>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <TagBadge v-for="tag in account.skinTags" :key="tag.label" :variant="tag.variant">{{ tag.label }}</TagBadge>
          <span v-if="!account.skinTags.length" class="text-sm text-ink/50">Diagnostic pas encore réalisé.</span>
        </div>
        <p class="mt-4 max-w-[54ch] text-sm leading-relaxed text-ink/70">
          Ce profil vient de vos réponses au diagnostic initial. Il détermine les fiches conseil et les ingrédients
          mis en avant pour vous.
        </p>
        <NuxtLink
          to="/app/diagnostic"
          class="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-ink/16 px-5 py-3.5 font-heading text-[15px] font-normal text-ink no-underline hover:bg-ink/5 active:bg-ink/10"
        >
          Refaire le diagnostic
        </NuxtLink>
      </template>

      <template v-else-if="activeTab === 'Rappels'">
        <EyebrowLabel>Rappels</EyebrowLabel>
        <label class="mt-4 flex cursor-pointer items-center gap-3 text-sm">
          <input v-model="notifyEnabled" type="checkbox" class="h-4 w-4">
          Me rappeler ma photo du soir
        </label>
        <div v-if="notifyEnabled" class="mt-3 max-w-[200px]">
          <label class="mb-1.5 block text-xs font-semibold">Heure du rappel</label>
          <input v-model="notifyTime" type="time" class="w-full rounded-md bg-surface px-3.5 py-2.5 text-sm">
        </div>
        <BaseButton type="button" variant="primary" class="mt-5" :disabled="savingNotifications" @click="saveNotifications">
          {{ savingNotifications ? 'Enregistrement…' : 'Enregistrer' }}
        </BaseButton>
      </template>

      <template v-else-if="activeTab === 'Confidentialité'">
        <EyebrowLabel>Confidentialité</EyebrowLabel>
        <p class="mt-3 max-w-[56ch] text-sm leading-relaxed text-ink/70">
          Vos photos et notes ne sont utilisées que pour vous montrer votre propre progression. Elles ne sont
          jamais utilisées pour entraîner un modèle ni partagées avec des tiers.
        </p>
        <p class="mt-3 max-w-[56ch] text-sm leading-relaxed text-ink/70">
          Vous pouvez exporter ou supprimer l'intégralité de vos données à tout moment depuis l'onglet
          « Mes données ».
        </p>
      </template>

      <template v-else-if="activeTab === 'Mes données'">
        <EyebrowLabel>Mes données</EyebrowLabel>
        <p class="mt-3 max-w-[56ch] text-sm leading-relaxed text-ink/70">
          Téléchargez une copie de votre profil, vos réponses au diagnostic, votre traitement et vos entrées
          quotidiennes au format JSON.
        </p>
        <BaseButton variant="secondary" class="mt-4" :disabled="exporting" @click="onExport">
          {{ exporting ? 'Export…' : 'Exporter mes données' }}
        </BaseButton>

        <hr class="my-6 border-t border-ink/16">

        <p class="max-w-[56ch] text-sm leading-relaxed text-ink/70">
          Supprimer votre compte efface définitivement votre profil, vos photos et vos notes. Cette action est
          irréversible.
        </p>
        <BaseButton
          type="button"
          variant="secondary"
          class="mt-4 text-accent-2"
          :disabled="deleting"
          @click="onDeleteAccount"
        >
          {{ deleting ? 'Suppression…' : confirmingDelete ? 'Confirmer la suppression définitive' : 'Supprimer mon compte' }}
        </BaseButton>
        <BaseButton v-if="confirmingDelete" type="button" variant="ghost" class="mt-4 ml-2" @click="confirmingDelete = false">
          Annuler
        </BaseButton>
      </template>
    </div>

    <!-- Suivi summary -->
    <div class="flex flex-col gap-3.5 border-t border-ink/16 px-6 py-6 lg:w-[300px] lg:flex-none lg:border-t-0 lg:border-l lg:px-6 lg:py-6">
      <EyebrowLabel>Mon suivi</EyebrowLabel>
      <div class="rounded-lg bg-accent p-4 text-bg">
        <div class="text-[11px] font-semibold tracking-[0.08em] text-bg/75 uppercase">Série en cours</div>
        <div class="mt-0.5 flex items-baseline gap-2">
          <span class="font-heading text-[44px] leading-none font-normal">{{ account.streak }}</span>
          <span class="text-[15px] font-semibold">jours</span>
        </div>
      </div>
      <div class="flex flex-col gap-2.5">
        <div class="flex justify-between text-[13.5px]">
          Photos enregistrées<span class="font-semibold">{{ account.photosCount }}</span>
        </div>
        <div class="flex justify-between text-[13.5px]">
          Notes rédigées<span class="font-semibold">{{ account.notesCount }}</span>
        </div>
        <div class="flex justify-between text-[13.5px]">
          Traitement en cours<span class="font-semibold">{{ account.treatmentProgressLabel }}</span>
        </div>
      </div>

      <hr class="border-t border-ink/16">

      <EyebrowLabel muted>Profil de peau</EyebrowLabel>
      <div class="flex flex-wrap gap-1.5">
        <TagBadge v-for="tag in account.skinTags" :key="tag.label" :variant="tag.variant">{{ tag.label }}</TagBadge>
      </div>
      <NuxtLink
        to="/app/diagnostic"
        class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/16 px-5 py-3.5 font-heading text-[15px] font-normal text-ink no-underline hover:bg-ink/5 active:bg-ink/10"
      >
        Refaire le diagnostic
      </NuxtLink>

      <hr class="border-t border-ink/16">

      <BaseButton variant="secondary" block class="justify-center" :disabled="exporting" @click="onExport">
        {{ exporting ? 'Export…' : 'Exporter mes données' }}
      </BaseButton>
      <BaseButton type="button" variant="secondary" block class="justify-center" :disabled="loggingOut" @click="handleLogout">
        {{ loggingOut ? 'Déconnexion…' : 'Se déconnecter' }}
      </BaseButton>
      <p class="text-xs leading-relaxed text-ink/50">
        Supprimer votre compte efface définitivement photos et notes.
        <button type="button" class="text-accent-2 underline" @click="activeTab = 'Mes données'">Supprimer mon compte</button>
      </p>
    </div>
  </div>
</template>
