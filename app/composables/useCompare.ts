export interface CompareData {
  startLabel: string | null
  todayLabel: string | null
  startPhotoUrl: string | null
  latestPhotoUrl: string | null
  metrics: { label: string; value: string; percent: number }[]
}

/**
 * Before/after comparison for a given angle, computed from the user's
 * earliest and latest photos plus their logged symptoms.
 */
export async function useCompare(angle: Ref<string> | string = 'face') {
  const angleRef = toRef(angle)
  const { data: compare, refresh } = await useAsyncData(
    () => `compare-${angleRef.value}`,
    () => apiFetch<CompareData>('/compare', { query: { angle: angleRef.value } }),
    { watch: [angleRef] },
  )

  return { compare, refresh }
}
