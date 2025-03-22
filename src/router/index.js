import { createRouter, createWebHistory } from 'vue-router'
import RoomPage from '../pages/RoomPage.vue'
import StartPage from '../pages/StartPage.vue'
import EnterPage from '../pages/EnterPage.vue'

const routes = [
  { path: '/', component: StartPage },
  { path: '/enter', component: EnterPage },
  { path: '/:uuid', component: RoomPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
