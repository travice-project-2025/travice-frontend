// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import OnboardingPage from '../pages/OnboardingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import PlansPage from '../pages/PlansPage.vue' // 새로운 페이지 임포트

const routes = [
  {
    path: '/',
    name: 'Onboarding',
    component: OnboardingPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: {
      hideHeader: true
    }
  },
  {
    path: '/plans',
    name: 'Plans',
    component: PlansPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})



export default router