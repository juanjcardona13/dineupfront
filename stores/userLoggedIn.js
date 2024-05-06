import { defineStore } from 'pinia'

export const useUserLoggedInStore = defineStore('user', {
  state: () => ({
    userLoggedIn: {},
    isUserLoggedIn: false
  }),
  getters: {
    getUserLoggedIn(state) {
      return state.userLoggedIn
    },
    getIsUserLoggedIn(state) {
      return state.isUserLoggedIn
    },
  },
  actions: {
    setUserLoggedIn(user) {
      this.userLoggedIn = user
    },
    setIsUserLoggedIn(status) {
      this.isUserLoggedIn = status
    },
  },
})