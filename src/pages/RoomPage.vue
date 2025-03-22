<script setup>
  import { ref } from 'vue'

  let ws = new WebSocket('ws://172.20.10.4:8000/')

  let mediaRecorder
  const isRecording = ref(false)
  const phrases = ref([])

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

  ws.onopen = function (e) {
    console.log('open -> ', e)
  }

  ws.onmessage = function (e) {
    console.log('message -> ', e.data)
    phrases.value.push(e.data)
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
    <button @click="startRecording">start</button>
    <button @click="stopRecording">stop</button>

    <div
      style="width: 100px; height: 100px; background-color: #0f0"
      v-if="isRecording"></div>
    <div
      style="width: 100px; height: 100px; background-color: #f00"
      v-if="!isRecording"></div>

    <div v-for="phrase in phrases">
      <p>{{ phrase }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
