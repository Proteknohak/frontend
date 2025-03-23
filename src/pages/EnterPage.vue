<script setup>
  import { useUserStore } from '../store/userStore.ts'
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { createUser } from '../api/userApi.js'
  import { createRoom, joinRoom } from '../api/roomApi.js'
  import { useRoomStore } from '../store/roomStore.js'

  const userStore = useUserStore()
  const roomStore = useRoomStore()
  const regex =
    /\b([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/i

  const roomLink = ref(`${userStore.roomId}`)

  watch(roomLink, () => {
    let match = roomLink.value.match(regex)
    if (match) {
      userStore.roomId = match[1]
    }
  })
  const router = useRouter()

  async function createWorld() {
    const user = await createUser(userStore.name, userStore.lang)
    userStore.userId = user.id
    console.log('user ', user)
    const room = await createRoom(userStore.roomId, user.id)
    console.log('room', room)
    roomStore.creatorId = room.creator_id
    roomStore.roomId = room.id
    roomStore.users = room.users
    await router.push(`/${room.id}`)
  }

  async function joinWorld() {
    const user = await createUser(userStore.name, userStore.lang)
    userStore.userId = user.id
    console.log('user', user)
    const room = await joinRoom(userStore.roomId, user.id)
    console.log('room', room)
    roomStore.creatorId = room.creator_id
    roomStore.roomId = room.id
    roomStore.users = room.users
    await router.push(`/${room.id}`)
  }
</script>

<template>
  <div class="wrapper">
    <div class="form">
      <h1>{{ userStore.isCreator ? 'Создать встречу' : 'Подключиться' }}</h1>

      <div class="parts">
        <div class="left">
          <div class="block">
            <label for="id">Ссылка на вашу комнату:</label>

            <input
              id="id"
              v-model="userStore.roomId"
              placeholder="http://8fb3a712-3924..." />
          </div>

          <div class="block">
            <label for="name">Введите ваше имя:</label>
            <input
              id="name"
              placeholder="Иванов Иван"
              v-model="userStore.name" />
          </div>
          <div class="block">
            <p>Ваш язык:</p>
            <select v-model="lang">
              <option value="ru">Русский</option>
              <option value="en">Английский</option>
              <option value="fr">Французский</option>
              <option value="ur">Урду</option>
              <option value="ha">Хауса</option>
            </select>
          </div>
          <div class="block">
            <button v-if="userStore.isCreator" @click="createWorld">
              Создать
            </button>
            <button v-else @click="joinWorld">Подключиться</button>
          </div>
        </div>
        <!--        <div class="right"></div>-->
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
