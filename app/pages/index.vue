<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const stats = [
  { value: '12 sem.', label: "durée d'un suivi type" },
  { value: '1 min', label: 'par jour, photo comprise' },
  { value: 'Libre', label: 'gratuit, sans abonnement' },
]

const features = [
  {
    title: 'Décrivez votre peau',
    body: 'Six questions sur votre type de peau, vos réactions passées et votre traitement — prescrit ou non.',
  },
  {
    title: 'Photographiez chaque jour',
    body: "Un calque de la veille vous aligne. Ajoutez une note, vos sensations, ce que vous avez appliqué.",
  },
  {
    title: 'Comparez aux attentes',
    body: 'Avant / après, jalons S2 à S12, courbe réelle contre courbe attendue. Exportable pour votre dermatologue.',
  },
]

const excerptSources = [
  { text: 'Leyden J. et al.', em: 'Am J Clin Dermatol', year: '2017.' },
  { text: 'Recommandations SFD, acné, 2015 (màj 2021).', em: '', year: '' },
  { text: 'Draelos Z.', em: 'J Cosmet Dermatol', year: '2019.' },
]
</script>

<template>
  <div class="flex flex-1 flex-col">
    <nav class="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-ink/16 px-6 py-4">
      <NuxtLink to="/" class="flex items-center gap-2.5 font-body text-lg font-extrabold">
        <BrandMark :size="30" />
        Skincare Planning
      </NuxtLink>
      <div class="ml-auto flex flex-wrap items-center gap-x-6 gap-y-2">
        <a href="#how-it-works" class="hidden text-sm sm:inline">Comment ça marche</a>
        <a href="#sources" class="hidden text-sm sm:inline">Nos sources</a>
        <a href="#" class="hidden text-sm sm:inline">Confidentialité</a>
        <NuxtLink to="/login" class="text-sm font-semibold">Se connecter</NuxtLink>
        <BaseButton variant="primary" @click="$router.push('/signup')">Créer mon compte</BaseButton>
      </div>
    </nav>

    <!-- Hero -->
    <div class="grid grid-cols-1 items-center gap-8 px-6 py-10 sm:px-11 sm:py-14 lg:grid-cols-[1.15fr_1fr] lg:gap-11">
      <div>
        <EyebrowLabel>Suivi de traitement dermatologique</EyebrowLabel>
        <h1 class="mt-4 max-w-[20ch] text-pretty font-heading text-[40px] leading-[1.05] font-normal sm:text-[52px] lg:text-[66px]">
          Votre peau change lentement. Gardez-en la trace.
        </h1>
        <p class="mt-4 max-w-[56ch] text-base leading-relaxed sm:text-[16px]">
          Une photo par jour, une note quand vous en avez besoin, et des conseils qui citent leurs sources. Vous
          voyez enfin si votre traitement fonctionne — et vous arrivez en consultation avec des faits, pas des
          impressions.
        </p>
        <div class="mt-6 flex flex-wrap items-center gap-4">
          <BaseButton variant="primary" class="px-6 py-3.5 text-[15px]" @click="$router.push('/signup')">Commencer mon suivi</BaseButton>
          <NuxtLink to="/login" class="text-sm font-semibold">J'ai déjà un compte →</NuxtLink>
        </div>
        <div class="mt-8 flex flex-wrap gap-7 border-t border-ink/16 pt-5">
          <div v-for="stat in stats" :key="stat.label">
            <div class="font-heading text-[26px] font-normal sm:text-[30px]">{{ stat.value }}</div>
            <div class="text-[11.5px] text-ink/50">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3.5">
        <div class="col-span-2 flex h-[180px] items-end rounded-lg p-3 sm:h-[230px]" style="background: linear-gradient(140deg, #e4dacb, #cec2ad)">
          <span class="rounded-full bg-bg/90 px-3 py-[5px] text-[13px] font-semibold">Jour 1</span>
        </div>
        <div class="h-[130px] rounded-lg sm:h-[150px]" style="background: linear-gradient(140deg, #e4dacb, #cec2ad)" />
        <div class="flex h-[130px] items-end rounded-lg p-3 sm:h-[150px]" style="background: linear-gradient(140deg, #e8dfd0, #d6cab5)">
          <span class="rounded-full bg-bg/90 px-3 py-[5px] text-[13px] font-semibold">Jour 84</span>
        </div>
      </div>
    </div>

    <!-- Feature band -->
    <div id="how-it-works" class="grid grid-cols-1 gap-8 bg-accent px-6 py-11 text-bg sm:px-11 sm:grid-cols-3">
      <div v-for="feature in features" :key="feature.title">
        <div class="font-heading text-[26px] leading-[1.1] font-normal sm:text-[34px]">{{ feature.title }}</div>
        <p class="mt-2.5 text-sm leading-relaxed opacity-85">{{ feature.body }}</p>
      </div>
    </div>

    <!-- Trust section -->
    <div id="sources" class="grid grid-cols-1 gap-8 px-6 py-12 sm:px-11 lg:grid-cols-2 lg:gap-11">
      <div>
        <EyebrowLabel>Ce qui nous différencie</EyebrowLabel>
        <h2 class="mt-3 max-w-[22ch] text-pretty font-heading text-[30px] leading-[1.1] font-normal sm:text-[42px]">
          Chaque conseil cite l'étude dont il vient
        </h2>
        <p class="mt-3.5 max-w-[54ch] text-[15px] leading-relaxed">
          Aucun produit à vendre, aucune routine sponsorisée. Chaque fiche indique son niveau de preuve, sa date de
          relecture et ses références — publications à comité de lecture, recommandations de sociétés savantes,
          revues systématiques.
        </p>
        <p class="mt-3.5 max-w-[54ch] text-[13px] leading-relaxed text-ink/60">
          Skincare Planning est un outil de suivi. Il ne pose pas de diagnostic et ne remplace pas une consultation
          dermatologique.
        </p>
      </div>

      <div class="rounded-lg bg-surface p-6">
        <EyebrowLabel muted>Extrait d'une fiche</EyebrowLabel>
        <div class="mt-2.5 font-heading text-[24px] leading-[1.15] font-normal sm:text-[26px]">
          Introduire un rétinoïde sans irriter
        </div>
        <div class="mt-3 flex gap-2">
          <TagBadge variant="accent">preuve élevée</TagBadge>
          <TagBadge variant="neutral">relu 03/2026</TagBadge>
        </div>
        <ol class="mt-4 list-decimal space-y-1.5 pl-5 text-[12.5px] leading-relaxed text-ink/70">
          <li v-for="s in excerptSources" :key="s.text">
            {{ s.text }} <em v-if="s.em">{{ s.em }}</em>, {{ s.year }}
          </li>
        </ol>
      </div>
    </div>

    <!-- Bottom CTA -->
    <div class="flex flex-col items-start gap-5 border-t border-ink/16 px-6 py-9 sm:px-11 sm:flex-row sm:items-center">
      <div>
        <div class="font-heading text-[26px] font-normal sm:text-[34px]">Commencez ce soir</div>
        <p class="mt-1.5 text-sm text-ink/50">
          Gratuit et sans abonnement. Vos photos restent sur votre appareil par défaut.
        </p>
      </div>
      <div class="flex flex-wrap gap-3 sm:ml-auto">
        <BaseButton variant="secondary" class="px-5 py-3.5">Voir un exemple de suivi</BaseButton>
        <BaseButton variant="primary" class="px-5 py-3.5" @click="$router.push('/signup')">Créer mon compte</BaseButton>
      </div>
    </div>
  </div>
</template>
