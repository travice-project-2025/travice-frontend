// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import OnboardingPage from '../pages/OnboardingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import PlansPage from '../pages/PlansPage.vue'
import Board from '../pages/Board.vue'
import BoardDetailPage from '../pages/BoardDetailPage.vue'
import PartnerRequestPage from '../pages/PartnerRequestPage.vue'
import CreatePlanWizard from '../pages/CreatePlanWizard.vue'

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
    path: '/board',
    name: 'Board',
    component: Board
  },
  {
    path: '/boarddetail',
    name: 'BoardDetail',
    component: BoardDetailPage
  },
  {
    path: '/partner',
    name: 'PartnerRequest',
    component: PartnerRequestPage
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})



export default router