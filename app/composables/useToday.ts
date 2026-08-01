export type DayState = 'done' | 'missed' | 'today'

export type TagVariant = 'accent' | 'accent-2' | 'neutral' | 'outline'

export interface TodayTask {
  id: number
  label: string
  subLabel?: string
  meta?: string
  done: boolean
  tag?: { label: string; variant: TagVariant }
}

export interface RecentDay {
  caption: string
  photoUrl?: string | null
  shade?: string
  placeholderLabel?: string
}

export interface AdviceCardData {
  kicker: string
  title: string
  body: string
  meta: string
}

export interface TreatmentItem {
  name: string
  tag: { label: string; variant: TagVariant }
}

export interface TodayData {
  dateLabel: string
  dayNumber: number
  weekLabel: string
  userName: string
  streak: number
  days: { label: string; state: DayState }[]
  tasks: TodayTask[]
  desktopTasks: TodayTask[]
  weeklyNote: { title: string; body: string }
  recentDays: RecentDay[]
  milestone: { title: string; body: string; linkLabel: string; linkTo: string }
  adviceCards: AdviceCardData[]
  treatment: TreatmentItem[]
}

/**
 * "Aujourd'hui" dashboard: today's tasks, streak, milestone and treatment
 * summary, all computed server-side from the user's real routine and entries.
 */
export async function useToday() {
  const { data: today, refresh } = await useAsyncData('today', () => apiFetch<TodayData>('/today'))

  async function toggleTask(taskId: number) {
    today.value = await apiFetch<TodayData>(`/today/tasks/${taskId}`, { method: 'PATCH' })
  }

  return { today, refresh, toggleTask }
}
