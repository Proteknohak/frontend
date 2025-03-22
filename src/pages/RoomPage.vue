<script setup>
  import { ref, watch } from 'vue'
  import { useRoomStore } from '../store/roomStore.js'
  import { useUserStore } from '../store/userStore.js'

  let ws = new WebSocket('ws://172.20.10.4:8000/')
  ws.binaryType = 'blob'

  let mediaRecorder
  const isRecording = ref(false)
  const lang = ref('ru')
  const roomStore = useRoomStore()
  const userStore = useUserStore()

  watch(lang, () => {
    ws.send(lang.value)
    ws.send(userStore.isCreator ? 1 : 0)
    console.log('send lang ->', lang.value)
  })

  async function startRecording() {
    if (isRecording.value) return
    isRecording.value = true

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

    mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size > 0 && isRecording.value) {
        const webmBlob = new Blob([event.data], { type: 'audio/webm' })

        ws.send(webmBlob)

        console.log('Отправлен фрагмент')
      }
    }

    mediaRecorder.start()
    setInterval(() => {
      if (isRecording.value) {
        mediaRecorder.requestData()
      }
    }, 5000)
  }

  function stopRecording() {
    isRecording.value = false // Останавливаем отправку данных
    if (mediaRecorder) {
      mediaRecorder.stop()
      console.log('Запись остановлена')
    }
  }

  const audioBlob = ref(null)
  const audioPlayer = ref(null)
  const isPlaying = ref(false)

  const handleIncomingMessage = (event) => {
    if (event.data instanceof Blob) {
      audioBlob.value = event.data
      playAudio()
    }
  }

  // Функция воспроизведения аудиофайла
  const playAudio = () => {
    if (audioBlob.value) {
      const audioUrl = URL.createObjectURL(audioBlob.value)
      audioPlayer.value.src = audioUrl
      audioPlayer.value.play()
      isPlaying.value = true

      // Обновление состояния после завершения воспроизведения
      audioPlayer.value.onended = () => {
        isPlaying.value = false
      }
    }
  }

  ws.onopen = function (e) {
    console.log('open -> ', e)
  }

  ws.onmessage = function (e) {
    console.log('message -> ', e.data)
    if (!userStore.isCreator) {
      handleIncomingMessage(e)
    }
  }

  ws.onclose = function (e) {
    mediaRecorder.stop()
    console.log('close -> ', e)
    if (e.wasClean) {
      console.log(
        `Соединение было закрыто нормально, code=${e.code} reason=${e.reason}`
      )
    } else {
      console.log('Соединение закрыто грязно')
    }
  }

  ws.onerror = function (e) {
    console.log('error -> ', e)
  }
</script>

<template>
  <div>
    <button v-if="userStore.isCreator" @click="startRecording">start</button>
    <button v-if="userStore.isCreator" @click="stopRecording">stop</button>

    <select v-model="lang">
      <option value="ru">Русский</option>
      <option value="en">English (Английский)</option>
      <option value="fr">Français (Французский)</option>
      <option value="ha">Hausa (Хауса)</option>
      <option value="ur">اردو (Урду)</option>
    </select>

    <div
      style="width: 100px; height: 100px; background-color: #0f0"
      v-if="userStore.isCreator && isRecording"></div>
    <div
      style="width: 100px; height: 100px; background-color: #f00"
      v-if="userStore.isCreator && !isRecording"></div>

    <div v-if="!userStore.isCreator">
      <p v-if="isPlaying">🔊 Воспроизводится...</p>
      <audio ref="audioPlayer" controls></audio>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
