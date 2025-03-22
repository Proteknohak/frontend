<template>
  <div>
    <button @click="startRecording">start</button>
    <button @click="stopRecording">start</button>
  </div>
</template>

<script setup>
  let mediaRecorder
  let audioChunks = []
  let ws = new WebSocket('ws://5.35.80.93:8000/')

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data)
      }
    }

    mediaRecorder.onstop = async () => {
      const webmBlob = new Blob(audioChunks, { type: 'audio/webm' })
      const wavBlob = await convertWebMToWav(webmBlob)
      ws.send(wavBlob)
    }

    mediaRecorder.start()
  }

  function stopRecording() {
    if (mediaRecorder) {
      mediaRecorder.stop()
    }
  }

  // Функция конвертации WebM → WAV
  async function convertWebMToWav(webmBlob) {
    const arrayBuffer = await webmBlob.arrayBuffer()
    const audioContext = new AudioContext()
    const decodedAudio = await audioContext.decodeAudioData(arrayBuffer)

    return encodeWav(decodedAudio)
  }

  // Кодировщик WAV
  function encodeWav(audioBuffer) {
    const numOfChan = audioBuffer.numberOfChannels
    const sampleRate = audioBuffer.sampleRate
    const length = audioBuffer.length * numOfChan * 2 + 44
    const buffer = new ArrayBuffer(length)
    const view = new DataView(buffer)

    // WAV заголовок
    writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + audioBuffer.length * numOfChan * 2, true)
    writeString(view, 8, 'WAVE')
    writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numOfChan, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numOfChan * 2, true)
    view.setUint16(32, numOfChan * 2, true)
    view.setUint16(34, 16, true)
    writeString(view, 36, 'data')
    view.setUint32(40, audioBuffer.length * numOfChan * 2, true)

    // Запись PCM данных
    const interleaved = interleave(audioBuffer)
    let offset = 44
    for (let i = 0; i < interleaved.length; i++, offset += 2) {
      view.setInt16(offset, interleaved[i] * 0x7fff, true)
    }

    return new Blob([buffer], { type: 'audio/wav' })
  }

  // Вспомогательные функции
  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  function interleave(audioBuffer) {
    const inputL = audioBuffer.getChannelData(0)
    const inputR =
      audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : inputL
    const length = inputL.length + inputR.length
    const result = new Float32Array(length)

    let index = 0
    for (let i = 0; i < inputL.length; i++) {
      result[index++] = inputL[i]
      result[index++] = inputR[i]
    }
    return result
  }
</script>
