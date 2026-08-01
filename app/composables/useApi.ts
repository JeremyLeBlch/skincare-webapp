/**
 * Thin wrapper around $fetch pointed at the Laravel API. Resolves to the
 * internal Docker network address during SSR and to the published host
 * port in the browser, and attaches the bearer token when present.
 */
export function apiFetch<T = unknown>(path: string, options: Parameters<typeof $fetch>[1] = {}) {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('auth_token')
  const baseURL = import.meta.server ? config.apiBase : config.public.apiBase

  return $fetch<T>(path, {
    baseURL: `${baseURL}/api`,
    ...options,
    headers: {
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      ...options.headers,
    },
  })
}

export interface ApiValidationError {
  message: string
  errors?: Record<string, string[]>
}
