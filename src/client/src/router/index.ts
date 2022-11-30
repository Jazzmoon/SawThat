import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MultipleChoiceView from '../views/MultiChoiceQuestion.vue'
import TextInputQuestionView from '@/views/TextInputQuestion.vue'
import MainView from '@/views/MainView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/mc-question',
      name: 'multiple choice',
      component: MultipleChoiceView
    },
    {
      path: '/txt-question',
      name: 'text input',
      component: TextInputQuestionView
    },
    {
      path: '/leaderboard',
      name: 'main-view',
      component: MainView
    },
  ]
})

export default router
