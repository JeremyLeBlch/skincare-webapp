/**
 * Mock data for the "Fiche conseil" article. No backend yet — this is the
 * seam to swap for a real API call once the Laravel app exists.
 */
export function useAdvice() {
  return {
    context: 'Peau mixte · acné légère',
    title: 'Introduire un rétinoïde sans irriter',
    subtitle: 'Starting a retinoid gently',
    intro:
      'Commencez à 2 soirs par semaine pendant 3 semaines, puis augmentez si votre peau le tolère. La rougeur et la desquamation des premières semaines sont attendues — c\'est le « retinoid uglies », pas un échec.',
    stats: [
      { label: 'Effet visible', value: '8–12 sem.' },
      { label: 'Niveau de preuve', value: 'Élevé' },
      { label: 'Tolérance', value: 'Moyenne' },
    ],
    sandwichRule: {
      title: 'La règle du sandwich',
      body: "Appliquez la crème hydratante avant et après le rétinoïde les premiers soirs : la tolérance s'améliore sans perte d'efficacité mesurable.",
    },
    stopWarning: {
      title: 'Ce qui doit vous faire arrêter',
      body: 'Brûlure persistante, gonflement, suintement : suspendez et parlez-en à votre dermatologue.',
    },
    sources: [
      { text: "Leyden J. et al. Am J Clin Dermatol, 2017 — tolérance des rétinoïdes topiques.", link: 'PubMed ↗' },
      { text: "Recommandations SFD, prise en charge de l'acné, 2015 (mise à jour 2021).", link: 'PDF ↗' },
      { text: 'Draelos Z. J Cosmet Dermatol, 2019 — méthode « moisturizer sandwich ».', link: 'DOI ↗' },
    ],
    reviewedNote: 'Relu le 12/03/2026 par notre comité. Information générale, ne remplace pas l\'avis de votre dermatologue.',
    related: [
      { label: 'Introduire un rétinoïde', active: true },
      { label: 'Gérer la desquamation', active: false },
      { label: 'Choisir un SPF non comédogène', active: false },
      { label: 'Marques post-acné', active: false },
      { label: 'Quand consulter', active: false },
    ],
    suggestion: {
      kicker: 'Suggestion',
      title: 'Passer à 2 soirs/sem.',
      body: 'Adapte votre calendrier du soir sur les 10 prochains jours.',
    },
    relatedProduct: 'Trétinoïne 0,025 %',
    relatedNote:
      'Vous avez signalé de la desquamation 3 fois cette semaine — cette fiche vous a été remontée pour cette raison.',
  }
}
