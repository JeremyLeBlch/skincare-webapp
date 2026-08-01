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

/**
 * Mock data for "Mon suivi" / the 12-week dashboard. No backend yet — this
 * is the seam to swap for a real API call once the Laravel app exists.
 */
export function useSuivi() {
  const pattern = [
    3, 3, 3, 3, 3, 2, 3, 3, 3, 1, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 1, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]
  const stateMap: Record<number, CellState> = { 3: 'full', 2: 'partial', 1: 'missed', 0: 'empty' }
  const cells: TrackingCell[] = pattern.map((v, i) => ({
    day: i < 25 ? i + 1 : null,
    state: stateMap[v],
  }))

  return {
    streak: 24,
    record: 31,
    cells,
    milestones: [
      { label: "S2 — période d'adaptation passée", state: 'done' },
      { label: "S4 — moins d'inflammation", state: 'current', note: 'en cours' },
      { label: 'S8 — texture plus lisse', state: 'pending' },
      { label: 'S12 — bilan avec le dermatologue', state: 'pending' },
    ] satisfies Milestone[],
    strip: [
      { label: 'J1', shade: '#bdb098' },
      { label: 'J4', shade: '#c3b8a0' },
      { label: 'J7', shade: '#c9bfa8' },
      { label: 'J10', shade: '#cec5b0' },
      { label: 'J13', shade: '#d3cab8' },
      { label: 'J16', shade: '#d8d0c0' },
      { label: 'J19', shade: '#ddd5c8' },
      { label: 'J24', shade: '#e2dbd0' },
    ],
    adherence: [
      { label: 'Photos', value: '24/26' },
      { label: 'Trétinoïne (3×/sem)', value: '11/12' },
      { label: 'SPF le matin', value: '26/26' },
      { label: 'Notes rédigées', value: '18/26' },
    ],
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
    ],
  }
}
