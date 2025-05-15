// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import OnboardingPage from '../pages/OnboardingPage.vue'
import LoginPage from '../pages/LoginPage.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router