import type { TagVariant } from './useToday'

export interface Product {
  id: number
  name: string
  meta: string | null
  tag: { label: string; variant: TagVariant }
  highlight?: boolean
}

export interface ScheduleDay {
  day: string
  label: string
  active: boolean
}

export interface TreatmentGuide {
  title: string
  advice: string
  recommendedIngredients: string[]
  ingredientsToAvoid: string[]
  pregnancySafeNote: string | null
}

export interface TreatmentData {
  productCount: number
  startedLabel: string
  morning: Product[]
  evening: Product[]
  guide: TreatmentGuide | null
  interactionWarning: { title: string; body: string; itemId: number | null } | null
  photoprotectionNote: string | null
  weeklySchedule: ScheduleDay[]
}

export interface NewProduct {
  period: 'morning' | 'evening'
  name: string
  meta?: string
  tag_label: string
  tag_variant: TagVariant
  highlight?: boolean
}

/**
 * "Mon traitement" — the user's real AM/PM routine, with an interaction
 * warning computed from the actual products they've added.
 */
export async function useTreatment() {
  const { data: treatment, refresh } = await useAsyncData('treatment', () => apiFetch<TreatmentData>('/treatment'))

  async function addProduct(product: NewProduct) {
    treatment.value = await apiFetch<TreatmentData>('/routine', { method: 'POST', body: product })
  }

  async function removeProduct(id: number) {
    treatment.value = await apiFetch<TreatmentData>(`/routine/${id}`, { method: 'DELETE' })
  }

  async function alternateProduct(id: number) {
    treatment.value = await apiFetch<TreatmentData>(`/routine/${id}/alternate`, { method: 'POST' })
  }

  async function dismissWarning() {
    treatment.value = await apiFetch<TreatmentData>('/routine/dismiss-warning', { method: 'POST' })
  }

  return { treatment, refresh, addProduct, removeProduct, alternateProduct, dismissWarning }
}
