export type Mood = 'better' | 'same' | 'worse'

export type PhotoAngle = 'face' | 'left' | 'right'

export const PHOTO_ANGLES: { value: PhotoAngle; label: string }[] = [
  { value: 'face', label: 'Face' },
  { value: 'left', label: 'Profil G' },
  { value: 'right', label: 'Profil D' },
]

export interface EntryTask {
  id: number
  label: string
  done: boolean
}

export interface EntryData {
  /** Y-m-d of the day this entry belongs to. */
  date: string
  dayNumber: number
  /** "Lundi 21 juillet" */
  dateLabel: string
  isToday: boolean
  mood: Mood | null
  symptoms: string[]
  note: string | null
  skipped: boolean
  photos: { face: string | null; left: string | null; right: string | null }
  tasks: EntryTask[]
}

/**
 * One day's entry: mood, symptoms, note and the three angle photos. Backs the
 * quick capture screen and the full entry form.
 *
 * `date` (Y-m-d) opens a day already gone by — the form is the same, so a user
 * can come back and write the note they skipped. Omit it for today.
 */
export async function useEntry(date: string | null = null) {
  const day = date ?? 'today'
  const { data: entry, refresh } = await useAsyncData(`entry-${day}`, () => apiFetch<EntryData>(`/entries/${day}`))

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
    if (date) form.append('date', date)
    if (payload.mood) form.append('mood', payload.mood)
    if (payload.symptoms) {
      // An empty list leaves no trace in a multipart body, so unticking the last
      // symptom would read as "field untouched". This flag says otherwise.
      form.append('symptoms_edited', '1')
      payload.symptoms.forEach((s) => form.append('symptoms[]', s))
    }
    if (payload.note !== undefined && payload.note !== null) form.append('note', payload.note)
    if (payload.skipped !== undefined) form.append('skipped', payload.skipped ? '1' : '0')

    // Camera originals are far too heavy for both the API limit and a mobile
    // connection — downscale before they hit the wire.
    if (payload.photoFace) form.append('photo_face', await compressImage(payload.photoFace))
    if (payload.photoLeft) form.append('photo_left', await compressImage(payload.photoLeft))
    if (payload.photoRight) form.append('photo_right', await compressImage(payload.photoRight))

    entry.value = await apiFetch<EntryData>('/entries', { method: 'POST', body: form })
    return entry.value
  }

  return { entry, refresh, save }
}

/**
 * File one angle photo on any past day of the treatment (or today) — used by
 * the tracking screen, where a user catches up on a day they photographed
 * but never uploaded. `date` is Y-m-d; the API refuses future days and days
 * before the treatment started.
 */
export async function saveEntryPhoto(date: string, angle: PhotoAngle, file: File) {
  const form = new FormData()
  form.append('date', date)
  form.append(`photo_${angle}`, await compressImage(file))

  return apiFetch<EntryData>('/entries', { method: 'POST', body: form })
}
