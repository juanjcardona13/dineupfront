import { useUserLoggedInStore } from '~/stores/userLoggedIn.js'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide("getUserLoggedIn", (forceUpdate) => {
        const { $auth, $pinia } = nuxtApp
        const config = useAppConfig()
        const userStore = useUserLoggedInStore($pinia)
        const isUserLoggedIn = userStore.getIsUserLoggedIn
        if (isUserLoggedIn) {
          if (forceUpdate || isEmpty(config.userLoggedIn)) {
            getDataUserLoggedIn(nuxtApp, userStore)
          }
        } else {
          const token = $auth.getToken()
          if (token) {
            userStore.setIsUserLoggedIn(true)
            if (forceUpdate || isEmpty(config.userLoggedIn)) {
              getDataUserLoggedIn(nuxtApp, userStore)
            }
          } else {
            console.error("USUARIO NO ESTA LOGUEADO, QUE SE DEBE DE HACER, UN SET_TIME_INTERVAL O RECARGAR LA PAGINA??")
          }
        }
        return config.userLoggedIn
    })
})