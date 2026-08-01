export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/app')) return

  const { user, token, fetchUser } = useAuth()

  if (!token.value) {
    return navigateTo('/login')
  }

  if (!user.value) {
    try {
      await fetchUser()
    } catch {
      token.value = null
      return navigateTo('/login')
    }
  }
})
