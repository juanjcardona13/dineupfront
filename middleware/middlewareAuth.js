export default defineNuxtRouteMiddleware((to, from) => {
  const { $auth } = useNuxtApp()
  const token = $auth.getToken()
  if (!token) {
    return navigateTo('/auth/signin')
  }
})