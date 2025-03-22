<script setup>
  import { useUserStore } from '../store/userStore.ts'
  import { useRouter } from 'vue-router'
  import { createUser } from '../api/userApi.js'
  import { createRoom, joinRoom } from '../api/roomApi.js'
  import { useRoomStore } from '../store/roomStore.js'

  const userStore = useUserStore()
  const roomStore = useRoomStore()
  const router = useRouter()

  async function pushToRoom() {
    const user = await createUser(userStore.name, userStore.lang)
    userStore.userId = user.id
    console.log('user', user)
    let room
    if (userStore.isCreator) {
      room = await createRoom(userStore.roomId, user.id)
    } else {
      room = await joinRoom(userStore.roomId, user.id)

    }
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
        <h2 class="form-title">{{userStore.isCreator ? 'Создать встречу' : 'Подключиться'}}</h2>
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
          <button
            type="submit"
            class="submit-button"
            @click="pushToRoom">
            {{userStore.isCreator ? 'Создать' : 'Войти'}}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  $primary-color: #9770c0;
  $secondary-color: #ece6f0;
  $text-color: #333;
  $border-radius: 12px;
  $box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  $box-shadow-hover: 0 6px 14px rgba(0, 0, 0, 0.15);

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }

  .container {
    width: 100%;
    max-width: 400px;
  }

  .form-box {
    background-color: $secondary-color;
    padding: 50px 20px;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: $box-shadow-hover;
    }
  }

  .form-title {
    text-align: center;
    margin-bottom: 40px;
    color: $text-color;
    font-size: 32px;
  }

  .form-group {
    margin-bottom: 16px;

    input,
    select {
      background-color: #fff;
      width: 100%;
      padding: 15px;
      border: 1px solid #bbb;
      border-radius: $border-radius;
      transition:
        border-color 0.3s,
        box-shadow 0.3s;

      &:focus {
        border-color: darken($primary-color, 10%);
        box-shadow: 0 0 8px rgba($primary-color, 0.5);
        outline: none;
      }
    }

    input {
      width: calc(100% - 15 * 2px);
    }
  }

  .submit-button {
    width: 100%;
    padding: 16px;
    background-color: $primary-color;
    color: white;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition:
      background-color 0.3s,
      transform 0.2s,
      box-shadow 0.3s;
    box-shadow: $box-shadow;

    &:hover {
      background-color: darken($primary-color, 10%);
      box-shadow: $box-shadow-hover;
    }

    &:active {
      transform: scale(0.95);
    }
  }
</style>
