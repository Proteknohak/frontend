<script setup>
  import { useRouter } from 'vue-router'
  import { useUserStore } from '../store/PiniaStore.js'
  import { onMounted } from 'vue'

  const router = useRouter()
  const store = useUserStore()

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        let r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      }
    )
  }

  function createRoom() {
    store.uuid = generateUUID()
    store.isCreator = true
    router.push('/enter')
  }

  function joinRoom() {
    store.isCreator = false
    router.push('enter')
  }

  onMounted(() => {
    store.uuid = ''
    store.isCreator = false
  })
</script>

<template>
  <div class="wrapper">
    <div class="left">
      <img class="logo" src="../assets/logo.svg" alt="Conntecto" />
      <div class="buttons">
        <button class="create-btn" @click="createRoom">Создать встречу</button>
        <button class="join-btn" @click="joinRoom">
          Подключиться к встрече
        </button>
      </div>
    </div>
    <div class="right"></div>
  </div>
</template>

<style scoped lang="scss">
  .wrapper {
    width: 100vw;
    height: 100vh;
  }

  .left {
    width: 60vw;
    height: 100vh;
    display: flex;
    align-items: center;
  }
  .right {
    width: 40vw;
    height: 100vh;
  }

  .left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 220px;
  }

  .logo {
    max-width: 840px;
  }

  .buttons {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 26px;
  }

  button {
    width: calc(407px - 24 * 2px);
    height: calc(117px - 16 * 2px);
    border-radius: 102px;
    border: 1px solid #000;
    background-color: #fff;
    font-size: 20px;
  }

  .join-btn {
    background-color: #d7d7d7;
  }
</style>
