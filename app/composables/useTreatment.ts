import type { TagVariant } from './useToday'

export interface Product {
  name: string
  meta: string
  tag: { label: string; variant: TagVariant }
  highlight?: boolean
}

export interface ScheduleDay {
  day: string
  label: string
  active: boolean
}

/**
 * Mock data for "Mon traitement". No backend yet — this is the seam to swap
 * for a real API call once the Laravel app exists.
 */
export function useTreatment() {
  return {
    productCount: 5,
    startedLabel: 'démarré le 17 février',
    morning: [
      { name: 'Nettoyant doux sans sulfate', meta: 'pH 5,5', tag: { label: '1×/j', variant: 'neutral' } },
      { name: 'SPF 50 fluide', meta: 'Indispensable avec un rétinoïde', tag: { label: 'clé', variant: 'accent' } },
    ] satisfies Product[],
    evening: [
      { name: 'Nettoyant doux', meta: 'Tous les soirs', tag: { label: '1×/j', variant: 'neutral' } },
      {
        name: 'Trétinoïne 0,025 %',
        meta: 'Prescrit · lun / mer / ven',
        tag: { label: '3×/sem', variant: 'accent-2' },
        highlight: true,
      },
      { name: 'Crème réparatrice céramides', meta: 'Avant et après le rétinoïde', tag: { label: '1×/j', variant: 'neutral' } },
    ] satisfies Product[],
    interactionWarning: {
      title: 'Attention interaction.',
      body: 'Trétinoïne + acide glycolique le même soir : irritation probable. On vous propose de les alterner.',
    },
    photoprotectionNote:
      "Un rétinoïde sensibilise au soleil : le SPF du matin fait partie du traitement, pas de l'option.",
    weeklySchedule: [
      { day: 'Lundi', label: 'Trétinoïne', active: true },
      { day: 'Mardi', label: 'Repos · céramides', active: false },
      { day: 'Mercredi', label: 'Trétinoïne', active: true },
      { day: 'Jeudi', label: 'Repos · céramides', active: false },
      { day: 'Vendredi', label: 'Trétinoïne', active: true },
    ] satisfies ScheduleDay[],
  }
}
