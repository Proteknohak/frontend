<script setup>
  import { useUserStore } from '../store/PiniaStore.js'
  import { computed, reactive } from 'vue'
  import { useRouter } from 'vue-router'

  const store = useUserStore()
  console.log(store.uuid)

  const userData = reactive({
    name: '',
    lang: 'ru',
    isCreator: store.isCreator,
  })

  const roomLink = computed(() => {
    return `${window.location.href}/${store.uuid}`
  })
  const router = useRouter()
</script>

<template>
  <div class="wrapper">
    <div class="form">
      <div class="block">
        <label for="id" v-if="store.isCreator">Ссылка на вашу комнату:</label>
        <input v-if="store.isCreator" id="id" readonly v-model="roomLink" />
      </div>

      <div class="block">
        <label for="link" v-if="!store.isCreator"
          >Вставьте ссылку на вашу компану:</label
        >
        <input
          v-if="!store.isCreator"
          id="link"
          placeholder="https://8fb3a712-3924..."
          v-model="roomLink" />
      </div>

      <div class="block">
        <label for="name">Введите ваше имя:</label>
        <input id="name" placeholder="Иванов Иван" v-model="userData.name" />
      </div>

      <div class="block">
        <p>Ваш язык:</p>

        <select v-model="userData.lang">
          <option value="ru">Русский</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <div class="block">
        <button v-if="store.isCreator" @click="router.push(`/${store.uuid}`)">
          Создать
        </button>
        <button v-else>Подключиться</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .form {
    background-color: lightgray;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 30px;
    border-radius: 20px;
  }

  .block {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
