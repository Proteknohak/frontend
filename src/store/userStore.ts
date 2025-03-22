import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: '',
    name: '',
    roomId: '',
    lang: '',
    isCreator: false,
  }),
})
