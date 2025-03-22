import { createRouter, createWebHistory } from 'vue-router'
import RoomPage from '../pages/RoomPage.vue'
import StartPage from '../pages/StartPage.vue'
import EnterPage from '../pages/EnterPage.vue'

const routes = [
  { path: '/', name: 'start', component: StartPage },
  { path: '/enter', name: 'enter', component: EnterPage },
  { path: '/:roomId', name: 'room', component: RoomPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
