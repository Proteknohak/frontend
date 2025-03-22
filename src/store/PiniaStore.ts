import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isCreator: false,
    uuid: '',
  }),
})
