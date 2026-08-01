export type DayState = 'done' | 'missed' | 'today'

export type TagVariant = 'accent' | 'accent-2' | 'neutral' | 'outline'

export interface TodayTask {
  label: string
  subLabel?: string
  meta?: string
  done: boolean
  tag?: { label: string; variant: TagVariant }
}

export interface RecentDay {
  caption: string
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

/**
 * Mock data for the "Aujourd'hui" screen. No backend yet — this is the seam
 * to swap for a real API call once the Laravel app exists.
 */
export function useToday() {
  return {
    dateLabel: 'Mercredi 12 mars',
    dayNumber: 24,
    weekLabel: 'semaine 4 sur 12',
    userName: 'Léa',
    streak: 24,
    days: [
      { label: 'Jeu', state: 'done' as DayState },
      { label: 'Ven', state: 'done' as DayState },
      { label: 'Sam', state: 'done' as DayState },
      { label: 'Dim', state: 'done' as DayState },
      { label: 'Lun', state: 'done' as DayState },
      { label: 'Mar', state: 'missed' as DayState },
      { label: 'Auj.', state: 'today' as DayState },
    ],
    tasks: [
      { label: 'Routine du matin', meta: '7:20', done: true },
      { label: 'Photo du jour + note', done: false, tag: { label: '2 min', variant: 'accent' } },
      {
        label: 'Trétinoïne',
        subLabel: 'soir',
        done: false,
        tag: { label: 'clé', variant: 'accent-2' },
      },
    ] satisfies TodayTask[],
    desktopTasks: [
      { label: 'Routine du matin', subLabel: '2 étapes', meta: '7:20', done: true },
      { label: 'Photo du jour + note', done: false, tag: { label: '2 min', variant: 'accent' } },
      {
        label: 'Trétinoïne 0,025 %',
        subLabel: 'soir',
        done: false,
        tag: { label: 'clé', variant: 'accent-2' },
      },
      { label: 'Crème réparatrice céramides', meta: 'après', done: false },
    ] satisfies TodayTask[],
    weeklyNote: {
      title: 'Semaine 4 sur 12.',
      body: "C'est souvent la semaine la plus rêche — vos photos montrent déjà moins de rougeurs sur la joue droite.",
    },
    recentDays: [
      { caption: 'J21', shade: '#e0d5c4' },
      { caption: 'J22', shade: '#dccfba' },
      { caption: 'J23', shade: '#d6cab5' },
      { caption: 'J24', placeholderLabel: "Aujourd'hui" },
    ] satisfies RecentDay[],
    milestone: {
      title: "S4 — moins d'inflammation",
      body: "Encore 4 jours de suivi avant le point d'étape. On comparera vos photos J1 et J28.",
      linkLabel: "Voir l'avant / après →",
      linkTo: '/app/compare',
    },
    adviceCards: [
      {
        kicker: 'Adaptation',
        title: "Espacez d'un soir",
        body: 'Trois signalements de desquamation en 5 jours. Passer à 2 soirs/semaine pendant 10 jours reste efficace.',
        meta: 'Leyden 2017 · SFD 2021',
      },
      {
        kicker: 'Barrière cutanée',
        title: 'Sandwich hydratant',
        body: "Crème avant et après le rétinoïde les soirs d'application.",
        meta: 'Draelos 2019',
      },
    ] satisfies AdviceCardData[],
    treatment: [
      { name: 'Trétinoïne 0,025 %', tag: { label: '3×/sem', variant: 'accent-2' } },
      { name: 'SPF 50 fluide', tag: { label: 'clé', variant: 'accent' } },
      { name: 'Nettoyant sans sulfate', tag: { label: '1×/j', variant: 'neutral' } },
      { name: 'Crème céramides', tag: { label: '1×/j', variant: 'neutral' } },
    ] satisfies TreatmentItem[],
  }
}
