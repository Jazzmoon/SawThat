import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainView from '@/views/MainView.vue'
import QuestionView from '@/views/Question.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/question',
      name: 'question',
      component: QuestionView
    },
    {
      path: '/game',
      name: 'main-view',
      component: MainView
    },
  ]
})

export default router
