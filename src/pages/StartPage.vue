<script setup>
  import { useRouter } from 'vue-router'
  import { useUserStore } from '../store/userStore.ts'
  import { useI18n } from 'vue-i18n'

  const router = useRouter()
  const store = useUserStore()
  const { t } = useI18n();

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
    store.roomId = generateUUID()
    store.isCreator = true
    router.push('/enter')
  }

  function joinRoom() {
    store.roomId = ''
    store.isCreator = false
    router.push('enter')
  }
</script>

<template>
  <div class="wrapper">
    <div class="content">
      <div class="top">
        <div class="top-slogan">
          <img src="../assets/logo.svg" alt="Connecto" class="logo" />
          <p class="title">
            {{t('speak-freely')}} <br />
            {{t('understand-instantly')}}
          </p>
        </div>
      </div>
      <div class="bottom">
        <div class="buttons">
          <button class="primary" @click="createRoom">{{t('create-meeting')}}</button>
          <button class="secondary" @click="joinRoom">
            {{t('join-meeting')}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  $primary-color: #9770c0;
  $primary-color-darker: #745594;

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

  .top-slogan {
    display: flex;
    flex-direction: column;
    align-items: start;
  }

  .bottom {
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: row;
    justify-content: end;
  }

  .logo {
    width: 70%;
  }

  .title {
    color: $primary-color;
    width: fit-content;
    text-align: left;
    padding-left: 16%;
  }

  .buttons {
    width: fit-content;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .buttons > button {
    font-size: 18px;
    width: 20vw;
    height: 6.25vw;
    border-radius: 100px;
    padding: 5px;
  }

  .primary {
    background-color: $primary-color;
    color: #fff;
    border: none;

    &:hover {
      background-color: $primary-color-darker;
    }
  }

  .secondary {
    color: #000;
    border: 1px solid $primary-color;
    background-color: #fff;

    &:hover {
      background-color: #d9d9d9;
    }
  }
</style>
