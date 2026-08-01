export type Mood = 'better' | 'same' | 'worse'

export interface EntryTask {
  id: number
  label: string
  done: boolean
}

export interface EntryData {
  mood: Mood | null
  symptoms: string[]
  note: string | null
  skipped: boolean
  photos: { face: string | null; left: string | null; right: string | null }
  tasks: EntryTask[]
}

/**
 * Today's entry: mood, symptoms, note and the three angle photos. Backs
 * both the quick capture screen and the full end-of-day entry form.
 */
export async function useEntry() {
  const { data: entry, refresh } = await useAsyncData('entry-today', () => apiFetch<EntryData>('/entries/today'))

  async function save(payload: {
    mood?: Mood
    symptoms?: string[]
    note?: string | null
    skipped?: boolean
    photoFace?: File | null
    photoLeft?: File | null
    photoRight?: File | null
  }) {
    const form = new FormData()
    if (payload.mood) form.append('mood', payload.mood)
    if (payload.symptoms) payload.symptoms.forEach((s) => form.append('symptoms[]', s))
    if (payload.note !== undefined && payload.note !== null) form.append('note', payload.note)
    if (payload.skipped !== undefined) form.append('skipped', payload.skipped ? '1' : '0')
    if (payload.photoFace) form.append('photo_face', payload.photoFace)
    if (payload.photoLeft) form.append('photo_left', payload.photoLeft)
    if (payload.photoRight) form.append('photo_right', payload.photoRight)

    entry.value = await apiFetch<EntryData>('/entries', { method: 'POST', body: form })
    return entry.value
  }

  return { entry, refresh, save }
}
