import { defineStore } from 'pinia'

export const usePiniaStore = defineStore('pinia', {
  state: () => ({
    value: 0,
  }),
  getters: {
    multiValue(state) {
      return state.value * 10
    },
  },
  actions: {
    incrementValue() {
      this.value++
    },
  },
})
