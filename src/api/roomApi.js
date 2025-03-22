import axios from 'axios'

const URL = 'http://172.20.10.4:8000'

export async function createRoom(roomId, creatorId) {
  try {
    const response = await axios.post(URL + '/room', {
      id: roomId,
      creator_id: creatorId,
    })
    return response.data
  } catch (e) {
    console.error(e)
  }
}

export async function joinRoom(roomId, userId) {
  try {
    const response = await axios.get(URL + `/room/${roomId}?user_id=${userId}`)
    return response.data
  } catch (e) {
    console.error(e)
  }
}

export async function leaveRoom(roomId, userId) {
  try {
    const response = await axios.delete(URL + `/room/${roomId}?user_id=${userId}`)
    return response.data
  } catch (e) {
    console.error(e)
  }
}
