<script setup>
  import { onMounted, ref } from 'vue'
  import { useUserStore } from '../store/userStore.js'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

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

  function sendHuinya() {
    ws.send(userStore.lang)
    ws.send(userStore.isCreator ? 1 : 0)
  }

  // Ссылка на элемент video
  const localVideo = ref(null)

  // Функция для получения потока с камеры
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (localVideo.value) {
        localVideo.value.srcObject = stream
      }
    } catch (error) {
      console.error('Ошибка при доступе к камере: ', error)
    }
  }

  // Запуск камеры при монтировании компонента
  onMounted(() => {
    startCamera()
  })
</script>

<template>
  <main>
    <section class="video-container">
      <audio ref="audioPlayer"></audio>
      <video ref="localVideo" autoplay></video>
    </section>
    <aside class="sidebar">
      <div class="participants">
        <h3>{{ t('users') }} (3)</h3>
        <ul>
          <li>Иван Иванов</li>
          <li>Мария Петрова</li>
          <li>Алексей Смирнов</li>
        </ul>
      </div>
      <div class="chat">
        <h3>{{ t('chat') }}</h3>
        <div class="messages">
          <p>
            <strong>Иван:</strong> Не понимаю второй пункт, можете привести
            пример?
          </p>
        </div>
        <div class="chat-input">
          <input type="text" :placeholder="t('message')" />
          <button>
            <img src="../assets/send.svg" alt="" />
          </button>
        </div>
      </div>
    </aside>
  </main>
  <!--  <MainFooter />-->
  <footer>
    <div class="footer-group footer-group-left">
      <button class="footer-btn footer-btn-round" @click="sendHuinya">
        <img src="../assets/link.svg" alt="Button 1" />
      </button>
    </div>
    <div class="footer-group footer-group-center">
      <button class="footer-btn footer-btn-pill">
        {{ t('broadcast') }}
        <img src="../assets/tv.svg" alt="Button 3" />
      </button>
      <button class="footer-btn footer-btn-round use">
        <img src="../assets/video.svg" alt="Button 4" />
      </button>
      <button
        @click="startRecording"
        class="footer-btn footer-btn-round use"
        :class="{ green: isRecording }">
        <img src="../assets/mic.svg" alt="Button 5" />
      </button>
      <button class="footer-btn footer-btn-pill">
        {{ t('users') }}
        <img src="../assets/users.svg" alt="Button 6" />
      </button>
      <button class="footer-btn footer-btn-pill">
        {{ t('chat') }}
        <img src="../assets/chat.svg" alt="Button 7" />
      </button>
    </div>
    <div class="footer-group footer-group-right">
      <button class="footer-btn footer-btn-round">
        <img src="../assets/more-vertical.svg" alt="Button 8" />
      </button>
      <button class="footer-btn footer-btn-round">
        <img src="../assets/leave.svg" alt="Button 9" />
      </button>
    </div>
  </footer>
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

  .participants,
  .chat {
    text-align: left;
    font-size: 16px;
    background-color: #fff;
    border-radius: 12px;
    padding: 20px;
  }

  .participants h3,
  .chat h3 {
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
    transition:
      background-color 0.3s ease,
      transform 0.2s ease;
  }

  .chat-input button:hover {
    background-color: darken($primary-color, 10%);
    transform: scale(1.05);
  }

  $primary-color: #9770c0;
  $secondary-color: #ece6f0;
  $text-color: #333;
  $hover-color: #e8e8e8;
  footer {
    background-color: $secondary-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .footer-group {
    display: flex;
    align-items: center;
  }

  .footer-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;
    margin: 0 5px;
    background-color: #fff;
    transition:
      background-color 0.3s ease,
      box-shadow 0.3s ease;
    padding: 12px;
    border-radius: 8px;
  }

  .footer-btn:hover {
    background-color: $hover-color;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .footer-btn-round {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .use {
    background-color: #9770c0;
  }

  .green {
    background-color: limegreen;
  }

  .footer-btn-pill {
    font-size: 14px;
    border-radius: 25px;
    padding: 12px 25px;
  }

  .footer-btn img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
</style>
