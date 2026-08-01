export interface AdviceData {
  context: string
  title: string
  subtitle: string
  intro: string
  stats: { label: string; value: string }[]
  sandwichRule: { title: string; body: string }
  stopWarning: { title: string; body: string }
  sources: { text: string; link: string }[]
  reviewedNote: string
  related: { slug: string; label: string; active: boolean }[]
  suggestion: { kicker: string; title: string; body: string }
  relatedProduct: string | null
  relatedNote: string | null
}

export const DEFAULT_ADVICE_SLUG = 'retinoide-sans-irriter'

/**
 * "Fiche conseil" article, keyed by slug, plus the sidebar list of related
 * articles and the "Appliquer" action that adjusts the user's real routine.
 */
export async function useAdvice(slug: Ref<string> | string) {
  const slugRef = toRef(slug)
  const { data: advice, refresh } = await useAsyncData(
    () => `advice-${slugRef.value}`,
    () => apiFetch<AdviceData>(`/advice/${slugRef.value}`),
    { watch: [slugRef] },
  )

  async function apply() {
    await apiFetch(`/advice/${slugRef.value}/apply`, { method: 'POST' })
  }

  return { advice, refresh, apply }
}

export async function useAdviceList() {
  const { data } = await useAsyncData('advice-list', () => apiFetch<{ articles: { slug: string; title: string; meta: string | null }[] }>('/advice'))

  return computed(() => data.value?.articles ?? [])
}
