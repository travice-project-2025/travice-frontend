// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import OnboardingPage from '../pages/OnboardingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import PlansPage from '../pages/PlansPage.vue' 
import CreatePlanWizard from '../pages/CreatePlanWizard.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import BoardPage from '../pages/BoardPage.vue'
import PlanCreatePage from '../pages/PlanCreatePage.vue'
import CreateBoard from '../pages/CreateBoard.vue'
import BoardDetail from '../pages/BoardDetail.vue'
import PlanDetailPage from '../pages/PlanDetailPage.vue'

const routes = [
  {
    path: "/",
    name: "onBoarding",
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
    path: '/plan-create',
    name: 'PlanCreate', 
    component: PlanCreatePage
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage
  },
  {
    path: '/board',
    name: 'Board',
    component: BoardPage
  },
  {
    path: '/createboard',
    name: 'CreateBoard',
    component: CreateBoard
  },  
  {
    path: '/board/:id',
    name: 'BoardDetail',
    component: BoardDetail,
    props: true
  },
  { path: '/edit-plan/:id',
    name: 'edit-plan',
    component: BoardPage
  },
  {
    path: '/plans/:planId',
    name: 'PlanDetail', 
    component: PlanDetailPage,
    props: true
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})



export default router