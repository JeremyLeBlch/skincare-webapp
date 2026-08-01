export type Sex = 'male' | 'female' | 'other'

export interface AuthUser {
  id: number
  first_name: string
  last_name: string
  email: string
  sex: Sex
}

export interface RegisterPayload {
  first_name: string
  last_name: string
  email: string
  password: string
  sex: Sex
}

export interface LoginPayload {
  email: string
  password: string
}

interface AuthResponse {
  user: AuthUser
  token: string
}

/**
 * Auth state shared across the app. The token lives in a cookie so it
 * survives reloads and is readable during SSR; the user object lives in
 * app state and is repopulated from /me when a token is present.
 */
export function useAuth() {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const token = useCookie<string | null>('auth_token', {
    default: () => null,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  })

  async function register(payload: RegisterPayload) {
    const response = await apiFetch<AuthResponse>('/register', {
      method: 'POST',
      body: { ...payload, password_confirmation: payload.password },
    })
    token.value = response.token
    user.value = response.user
    return response
  }

  async function login(payload: LoginPayload) {
    const response = await apiFetch<AuthResponse>('/login', {
      method: 'POST',
      body: payload,
    })
    token.value = response.token
    user.value = response.user
    return response
  }

  async function logout() {
    try {
      await apiFetch('/logout', { method: 'POST' })
    } finally {
      token.value = null
      user.value = null
    }
  }

  async function fetchUser() {
    if (!token.value) return null
    user.value = await apiFetch<AuthUser>('/me')
    return user.value
  }

  return { user, token, register, login, logout, fetchUser }
}
