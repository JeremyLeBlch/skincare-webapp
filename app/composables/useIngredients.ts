import type { TagVariant } from './useToday'

export interface IngredientDetail {
  eyebrow: string
  description: string
  stats: { label: string; value: string }[]
  pairsWith: string[]
  cautionWith: string[]
  sources: { text: string; link: string }[]
  reviewedNote: string
}

export interface Ingredient {
  slug: string
  name: string
  tag: { label: string; variant: TagVariant }
  subtitle: string
  body: string
  meta?: string
  dimmed?: boolean
  categories: string[] | null
  detail?: IngredientDetail
}

export interface IngredientFilter {
  key: string
  label: string
}

/**
 * Ingredient library, loaded once and filtered client-side by search text
 * and category — both wired to the real backend dataset.
 */
export async function useIngredients() {
  const { data, refresh } = await useAsyncData('ingredients', () =>
    apiFetch<{ filters: IngredientFilter[]; ingredients: Ingredient[] }>('/ingredients'),
  )

  const filters = computed(() => data.value?.filters ?? [])
  const allIngredients = computed(() => data.value?.ingredients ?? [])

  const search = ref('')
  const activeCategory = ref<string | null>(null)

  const ingredients = computed(() => {
    return allIngredients.value.filter((ing) => {
      const matchesSearch = !search.value
        || ing.name.toLowerCase().includes(search.value.toLowerCase())
        || ing.subtitle.toLowerCase().includes(search.value.toLowerCase())
      const matchesCategory = !activeCategory.value || (ing.categories ?? []).includes(activeCategory.value)

      return matchesSearch && matchesCategory
    })
  })

  return { filters, ingredients, allIngredients, search, activeCategory, refresh }
}
