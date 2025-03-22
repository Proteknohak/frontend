import axios from 'axios'

const URL = 'http://172.20.10.4:3000'

export async function getUsers(name, lang) {
  try {
    const response = await axios.get(URL + '/user')
    return response.data
  } catch (e) {
    console.error(e)
  }
}

export async function createUser(name, lang) {
  try {
    const response = await axios.post(URL + '/user', {
      name: name,
      lang: lang,
    })
    return response.data
  } catch (e) {
    console.error(e)
  }
}

export async function changeLang(userId, lang) {
  try {
    await axios.patch(URL + `/user/${userId}`, { lang: lang }).then((r) => {
      return r.data
    })
  } catch (e) {
    console.error(e)
  }
}
