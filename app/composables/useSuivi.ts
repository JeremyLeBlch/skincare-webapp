export type CellState = 'full' | 'partial' | 'missed' | 'empty'

export interface TrackingCell {
  day: number | null
  state: CellState
}

export interface Milestone {
  label: string
  state: 'done' | 'current' | 'pending'
  note?: string
}

export interface SuiviData {
  streak: number
  record: number
  cells: TrackingCell[]
  milestones: Milestone[]
  strip: { label: string; photoUrl?: string | null }[]
  adherence: { label: string; value: string }[]
  moodTrend: { label: string; value: number }[]
  adviceCards: { kicker: string; title: string; body: string; meta: string }[]
}

/**
 * "Mon suivi" — 12-week dashboard, computed from the user's real daily
 * entries (calendar cells, streak, milestones, adherence).
 */
export async function useSuivi() {
  const { data: suivi, refresh } = await useAsyncData('tracking', () => apiFetch<SuiviData>('/tracking'))

  return { suivi, refresh }
}
