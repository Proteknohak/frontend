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
    <div class="content">
      <div class="top">
        <img src="../assets/logo.svg" alt="Connecto" class="logo" />
        <p class="title">
          Говори свободно <br />
          Понимай мгновенно
        </p>
      </div>
      <div class="bottom">
        <div class="buttons">
          <button class="primary">Создать встречу</button>
          <button class="secondary">Подключиться к встрече</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  $primary-color: #9770c0;

  .wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content {
    width: 75%;
    height: 55%;
  }

  .top {
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: row;
    justify-content: start;
  }

  .bottom {
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: row;
    justify-content: end;
  }

  .logo {
    width: 57%;
  }

  .title {
    color: $primary-color;
    width: fit-content;
  }

  .buttons {
    width: fit-content;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .buttons > button {
    width: 20vw;
    height: 6.25vw;
    border-radius: 100px;
  }

  .primary {
    background-color: $primary-color;
    color: #fff;
    border: none;
  }

  .secondary {
    color: #000;
    border: 1px solid $primary-color;
    background-color: #fff;
  }
</style>
