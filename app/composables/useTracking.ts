import type { PhotoAngle } from './useEntry'

export type CellState = 'full' | 'partial' | 'missed' | 'empty'

export interface TrackingCell {
  day: number | null
  /** Y-m-d, or null for days still to come. */
  date: string | null
  state: CellState
  hasPhoto: boolean
  /** Thumbnail shown inside the cell — the face shot when there is one. */
  photoUrl: string | null
}

/** A metric with a bar: taken / due, as a percentage. */
export interface TrackingStat {
  label: string
  value: string
  percent: number
}

export interface Milestone {
  label: string
  state: 'done' | 'current' | 'pending'
  note?: string
}

/** One angle actually photographed on a given day. */
export interface TrackingAnglePhoto {
  angle: PhotoAngle
  /** Face · Profil G · Profil D */
  label: string
  photoUrl: string
}

export interface TrackingPhoto {
  label: string
  date: string
  /** The day's representative shot — face when there is one. */
  photoUrl?: string | null
  /** Which angle `photoUrl` shows. */
  angleLabel?: string | null
  photos: TrackingAnglePhoto[]
}

export interface TrackingData {
  /** Bounds for filing a photo on a past day (Y-m-d). */
  startDate: string
  today: string
  streak: number
  record: number
  cells: TrackingCell[]
  milestones: Milestone[]
  strip: TrackingPhoto[]
  startPhoto: TrackingPhoto | null
  latestPhoto: TrackingPhoto | null
  /** One row per product: how often it was actually taken. */
  treatmentStats: TrackingStat[]
  /** The totals for the whole treatment so far. */
  summary: { label: string; value: string }[]
  moodTrend: { label: string; value: number }[]
  adviceCards: { kicker: string; title: string; body: string; meta: string }[]
}

/**
 * The 12-week tracking dashboard, computed from the user's real daily entries
 * (calendar cells, streak, milestones, adherence, photos).
 */
export async function useTracking() {
  const { data: tracking, refresh } = await useAsyncData('tracking', () => apiFetch<TrackingData>('/tracking'))

  return { tracking, refresh }
}
