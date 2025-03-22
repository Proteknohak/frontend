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
      <h1>{{ store.isCreator ? 'Создать встречу' : 'Подключиться' }}</h1>
      <div class="parts">
        <div class="left">
          <div class="block">
            <label for="id"
              >Ссылка на вашу комнату:</label
            >
            <input
              id="id"
              readonly
              v-model="roomLink"
              placeholder="http://8fb3a712-3924..." />
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
            </select>
          </div>

          <div class="block">
            <button v-if="store.isCreator" @click="router.push(`/${store.uuid}`)">
              Создать
            </button>
            <button v-else>Подключиться</button>
          </div>
        </div>
        <div class="right"></div>
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
    background-color: #ece6f0;
    border-radius: 28px;
    width: 50vw;
    height: 70vh;
    padding: 50px;
  }

  .parts {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .left,
  .right {
    width: 49%;
    height: 100%;
  }
</style>
