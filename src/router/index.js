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
import JoinPlan from '../pages/JoinPlan.vue'

// 쿠키에서 값 가져오기 헬퍼 함수
const getCookieValue = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

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
  },
  // 초대 링크로 접속하는 페이지 추가
  {
    path: '/plan/join',
    name: 'JoinPlan',
    component: JoinPlan,
    meta: {
      requiresAuth: true  // 로그인 필요
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 네비게이션 가드 - 쿠키 기반 인증 확인
router.beforeEach((to, from, next) => {
  // JWT-TOKEN 쿠키 확인
  const isAuthenticated = getCookieValue('JWT-TOKEN')
  
  console.log('Route Guard - To:', to.path)
  console.log('Route Guard - Authenticated:', !!isAuthenticated)
  console.log('Route Guard - Requires Auth:', to.meta.requiresAuth)
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // 로그인이 필요한 페이지인데 로그인이 안 되어 있으면
    // 초대 코드를 쿼리 파라미터로 유지하면서 로그인 페이지로 리다이렉트
    console.log('Redirecting to login with redirect:', to.fullPath)
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router