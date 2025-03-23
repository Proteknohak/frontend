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

  const roomLink = ref(`${window.location.href}/${userStore.roomId}`)

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
    <div class="container">
      <div class="form-box">
        <h2 class="form-title">
          {{ userStore.isCreator ? 'Создать встречу' : 'Подключиться' }}
        </h2>

        <form class="form">
          <div class="form-group">
            <input
              placeholder="Введите код страницы"
              v-model="userStore.roomId" />
          </div>

          <div class="form-group">
            <input placeholder="Введите ваше имя" v-model="userStore.name" />
          </div>

          <div class="form-group">
            <select v-model="userStore.lang">
              <option value="ru">Русский</option>

              <option value="en">Английский</option>
            </select>
          </div>

          <button type="submit" class="submit-button" @click="pushToRoom">
            {{ userStore.isCreator ? 'Создать' : 'Войти' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
