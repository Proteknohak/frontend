let mediaRecorder
let audioChunks = []

async function getMicrophoneStream() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    return stream
  } catch (error) {
    console.error('Ошибка доступа к микрофону:', error)
  }
}

async function startRecording() {
  const stream = await getMicrophoneStream()
  if (!stream) return

  mediaRecorder = new MediaRecorder(stream)
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data)
    }
  }
  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
    await sendAudioToServer(audioBlob)
    audioChunks = []
  }
  mediaRecorder.start()
}

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop()
  }
}

async function sendAudioToServer(blob) {
  const formData = new FormData()
  formData.append('audio', blob, 'recording.wav')

  try {
    const response = await fetch('http://172.20.10.4:8000/', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()
    console.log('Сервер ответил:', result)
  } catch (error) {
    console.error('Ошибка при отправке аудио:', error)
  }
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text)
  const voices = speechSynthesis.getVoices()
  utterance.voice =
    voices.find(
      (voice) => voice.name.includes('Wavenet') || voice.name.includes('Neural')
    ) || voices[0]
  utterance.lang = 'ru-RU' // Указываем язык (можно поменять)
  utterance.rate = 1 // Скорость (0.1 - 10)
  utterance.pitch = 1 // Тон (0 - 2)
  utterance.volume = 1 // Громкость (0 - 1)

  speechSynthesis.speak(utterance)
}

function getVoices() {
  const voices = speechSynthesis.getVoices()
  console.log(voices)
}

async function startVolumeTracking() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const audioContext = new AudioContext()
  const analyser = audioContext.createAnalyser()
  const microphone = audioContext.createMediaStreamSource(stream)
  const dataArray = new Uint8Array(analyser.frequencyBinCount)

  analyser.fftSize = 256 // Чем выше значение, тем точнее анализ (128–1024)
  microphone.connect(analyser)

  function updateVolume() {
    analyser.getByteFrequencyData(dataArray)
    let sum = dataArray.reduce((a, b) => a + b, 0)
    let volume = sum / dataArray.length // Среднее значение громкости

    console.log('Громкость:', volume)
    requestAnimationFrame(updateVolume)
  }

  updateVolume()
}
