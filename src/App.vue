<script setup>
  import { useUserStore } from './store/userStore.ts'
  import { watch } from 'vue'

  const store = useUserStore()
  if (localStorage.getItem('userId')) {
    store.userId = localStorage.getItem('userId')
    store.name = localStorage.getItem('name')
    store.roomId = localStorage.getItem('roomId')
    store.lang = localStorage.getItem('lang')
    store.isCreator = Boolean(JSON.parse(localStorage.getItem('isCreator')))
  }

  watch(() => [store.userId, store.name, store.roomId, store.lang, store.isCreator], () => {
    console.log([store.userId, store.roomId, store.name, store.lang, store.isCreator])
    localStorage.setItem('userId', store.userId)
    localStorage.setItem('name', store.name)
    localStorage.setItem('roomId', store.roomId)
    localStorage.setItem('lang', store.lang)
    localStorage.setItem('isCreator', store.isCreator)
  })
</script>

<template>
  <div class="wrapper">
    <router-view />
  </div>
</template>

<style lang="scss"></style>
