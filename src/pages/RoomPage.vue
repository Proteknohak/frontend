<script setup>
  import { ref, watch } from 'vue'
  import { useUserStore } from '../store/userStore.js'
  import MainFooter from '../components/MainFooter.vue'

  let ws = new WebSocket('ws://172.20.10.4:8000/')
  ws.binaryType = 'blob'

  let mediaRecorder
  const isRecording = ref(false)
  const lang = ref('ru')
  const userStore = useUserStore()

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
    }, 7000)
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

  const playAudio = () => {
    if (audioBlob.value) {
      const audioUrl = URL.createObjectURL(audioBlob.value)
      audioPlayer.value.src = audioUrl
      audioPlayer.value.play()
      isPlaying.value = true
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
  }
  ws.onerror = function (e) {
    console.log('error -> ', e)
  }
  watch(lang, () => {
    ws.send(lang.value)
    ws.send(userStore.isCreator ? 1 : 0)
    console.log('send lang ->', lang.value)
  })
</script>

<template>
  <main>
    <section class="video-container">
      <audio ref="audioPlayer"></audio>
    </section>
    <aside class="sidebar">
      <div class="participants">
        <h3>Участники (29)</h3>
        <ul>
          <li>Иван Иванов</li>
          <li>Мария Петрова</li>
          <li>Алексей Смирнов</li>
        </ul>
      </div>
      <div class="chat">
        <h3>Чат</h3>
        <div class="messages">
          <p><strong>Иван:</strong> Не понимаю второй пункт, можете привести пример?</p>
        </div>
        <div class="chat-input">
          <input type="text" placeholder="Сообщение">
          <button>
            <img src="../assets/send.svg" alt="">
          </button>
        </div>
      </div>
    </aside>
  </main>
  <MainFooter />
</template>

<style scoped lang="scss">
  $primary-color: #9770c0;
  $secondary-color: #ece6f0;
  $text-color: #333;
  $hover-color: #e8e8e8;

  main {
    height: calc(100% - 70px);
    width: 100%;
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .video-container {
    flex: 3;
    background-color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sidebar {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: $secondary-color;
    border-left: 1px solid #ddd;
    padding: 20px;
    overflow-y: auto;
  }

  .participants, .chat {
    text-align: left;
    font-size: 16px;
    background-color: #fff;
    border-radius: 12px;
    padding: 20px;
  }

  .participants h3, .chat h3 {
    margin-bottom: 10px;
    color: $text-color;
  }

  .participants ul {
    list-style: none;
    padding-left: 0;
    color: $text-color;
  }

  .chat {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 10px;
    padding-right: 10px;
    color: $text-color;
  }

  .chat-input {
    display: flex;
    border-top: 1px solid #ddd;
    padding-top: 10px;
  }

  .chat-input input {
    width: 100%;
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-right: 10px;
    transition: border-color 0.3s ease;
  }

  .chat-input input:focus {
    border-color: $primary-color;
  }

  .chat-input button {
    border: none;
    background-color: $primary-color;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .chat-input button:hover {
    background-color: darken($primary-color, 10%);
    transform: scale(1.05);
  }
</style>
