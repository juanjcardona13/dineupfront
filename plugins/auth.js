// plugins/auth.js

export default defineNuxtPlugin((NuxtApp) => {
    // Crear una función para obtener el token
    const getToken = () => {
      return localStorage.getItem('authToken')
    }
  
    // Crear una función para establecer el token
    const setToken = (token) => {
      localStorage.setItem('authToken', token)
    }
  
    // Crear una función para eliminar el token
    const removeToken = () => {
      localStorage.removeItem('authToken')
    }
  
    // Inyectar las funciones en el contexto de Nuxt
    NuxtApp.provide('auth', {
      getToken,
      setToken,
      removeToken
    })
})
  