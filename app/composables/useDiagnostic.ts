export interface DiagnosticOption {
  id: number
  value: string
  label: string
}

export interface DiagnosticQuestion {
  id: number
  code: string
  label: string
  type: 'single_choice' | 'multiple_choice' | 'text' | 'number'
  options: DiagnosticOption[]
  answer: { option_ids: number[]; value: string | null }
}

/**
 * Onboarding diagnostic questionnaire, sourced from the real question bank
 * (skin type, primary concern, past reactions, current treatment, etc.).
 */
export async function useDiagnostic() {
  const { data, refresh } = await useAsyncData('diagnostic-questions', () =>
    apiFetch<{ questions: DiagnosticQuestion[] }>('/questions'),
  )

  const questions = computed(() => data.value?.questions ?? [])

  async function submit(answers: { question_id: number; option_ids?: number[]; value?: string | null }[]) {
    return apiFetch('/diagnostic', { method: 'POST', body: { answers } })
  }

  return { questions, refresh, submit }
}
