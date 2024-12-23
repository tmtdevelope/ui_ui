import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  persist: true,
  state: () => ({
    user: null,
    userRole: null,
    authenticated: false,
  }),
  actions: {
    setUser(user) {
      this.user = user
      this.userRole = user.roles[0]
      this.authenticated = !!user
    },
    logout() {
      this.user = null
      this.userRole = null
      this.authenticated = false
    },
  },
  getters: {
    getUser(state) {
      return state.user
    },
    getUserRole(state) {
      return state.userRole
    },
    isAuthenticated(state) {
      return state.authenticated
    },
  },
})
