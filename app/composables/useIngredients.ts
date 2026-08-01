import type { TagVariant } from './useToday'

export interface IngredientDetail {
  eyebrow: string
  description: string
  stats: { label: string; value: string }[]
  pairsWith: string[]
  cautionWith: string[]
  sources: { text: string; link: string }[]
  reviewedNote: string
}

export interface Ingredient {
  name: string
  tag: { label: string; variant: TagVariant }
  subtitle: string
  body: string
  meta?: string
  dimmed?: boolean
  detail?: IngredientDetail
}

/**
 * Mock data for the ingredient library. No backend yet — this is the seam
 * to swap for a real API call once the Laravel app exists.
 */
export function useIngredients() {
  const filters = ['Pour ma peau', 'Anti-imperfections', 'Apaisant', 'Hydratant', 'À éviter']

  const ingredients: Ingredient[] = [
    {
      name: 'Niacinamide',
      tag: { label: 'preuve élevée', variant: 'accent' },
      subtitle: 'Vitamine B3 · 4 à 5 %',
      body: 'Réduit la production de sébum et les rougeurs. Se marie bien avec votre rétinoïde le soir.',
      meta: '3 études citées · dernière revue 2024',
      detail: {
        eyebrow: 'Actif · convient à votre peau mixte',
        description:
          "Réduit la production de sébum et l'aspect des rougeurs, et soutient la barrière cutanée. C'est l'un des rares actifs qui se marie sans conflit avec un rétinoïde le même soir.",
        stats: [
          { label: 'Preuve', value: 'Élevée' },
          { label: 'Délai', value: '4–8 sem.' },
          { label: 'Irritation', value: 'Faible' },
        ],
        pairsWith: ['Rétinoïdes', 'Céramides', 'Acide azélaïque'],
        cautionWith: ['Vitamine C pure', 'Acides forts'],
        sources: [
          { text: 'Bissett D. et al. Dermatol Surg, 2005 — niacinamide topique et signes cutanés.', link: 'PubMed ↗' },
          { text: 'Draelos Z. J Cosmet Dermatol, 2006 — sébum et niacinamide 2 %.', link: 'DOI ↗' },
          { text: 'Revue Cochrane Skin, actifs anti-acné hors ordonnance, 2024.', link: 'Revue ↗' },
        ],
        reviewedNote: "Relu le 04/02/2026. Information générale, ne remplace pas l'avis de votre dermatologue.",
      },
    },
    {
      name: 'Acide azélaïque',
      tag: { label: 'preuve élevée', variant: 'accent' },
      subtitle: '15 à 20 % · sur ordonnance au-delà',
      body: 'Anti-inflammatoire, agit sur les marques post-acné. Tolérable pendant la grossesse.',
      meta: '5 études citées · dernière revue 2025',
    },
    {
      name: 'Céramides',
      tag: { label: 'preuve modérée', variant: 'neutral' },
      subtitle: 'Réparation de la barrière cutanée',
      body: 'Restaure le film lipidique et réduit la sensation de tiraillement, notamment avec un rétinoïde.',
    },
    {
      name: 'Acide glycolique',
      tag: { label: 'prudence', variant: 'accent-2' },
      subtitle: 'Interagit avec votre rétinoïde',
      body: 'Exfoliant efficace, mais à alterner plutôt qu\'à combiner le même soir avec la trétinoïne.',
    },
    {
      name: 'Huile de coco',
      tag: { label: 'à éviter', variant: 'accent-2' },
      subtitle: 'Comédogène sur peau mixte',
      body: 'Populaire mais mal tolérée sur les peaux à tendance acnéique. Peu de données solides.',
      dimmed: true,
    },
  ]

  return { filters, ingredients }
}
