// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import OnboardingPage from '../pages/OnboardingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import PlansPage from '../pages/PlansPage.vue' 
import CreatePlanWizard from '../pages/CreatePlanWizard.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import Hompage from '../pages/Hompage.vue'
import BoardPage from '../pages/BoardPage.vue'

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
  },
  {
    path: '/create-plan', 
    name: 'CreatePlan',
    component: CreatePlanWizard
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage
  },
  {
    path: '/home',
    name: 'testHome',
    component: Hompage
  },
  {
    path: '/board',
    name: 'Board',
    component: BoardPage
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})



export default router