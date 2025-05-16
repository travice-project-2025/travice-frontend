// src/composables/userAuth.js
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

export function useAuth() {
  const loggedIn = ref(false)
  const userName = ref('')
  const router = useRouter()

  // 로그인 상태 확인 함수
  const checkLoginStatus = async () => {
    const hasToken = !!Cookies.get('JWT-TOKEN')
    loggedIn.value = hasToken
    
    if (hasToken) {
      await fetchUserName()
    } else {
      userName.value = ''
    }
    
    return hasToken
  }

  // 서버에서 사용자 정보 가져오기
  const fetchUserName = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/info', {
        credentials: 'include' // 쿠키 포함
      })
      
      if (response.ok) {
        const userData = await response.json()
        userName.value = userData.name
        return userData
      } else {
        // 인증 실패 처리
        loggedIn.value = false
        userName.value = ''
        return null
      }
    } catch (error) {
      console.error('사용자 정보 요청 오류:', error)
      loggedIn.value = false
      userName.value = ''
      return null
    }
  }

  // 로그아웃 처리
  const logout = () => {
    Cookies.remove('JWT-TOKEN')
    loggedIn.value = false
    userName.value = ''
    router.push('/')
  }

  // 로그인 페이지로 이동
  const goToLogin = () => {
    router.push('/login')
  }

  // 보호된 경로 접근 시 로그인 상태 체크 후 필요시 리다이렉트
  const requireAuth = async (redirectPath = '/login') => {
    const isAuthenticated = await checkLoginStatus()
    if (!isAuthenticated) {
      router.push(redirectPath)
      return false
    }
    return true
  }

  return {
    loggedIn,
    userName,
    checkLoginStatus,
    fetchUserName,
    logout,
    goToLogin,
    requireAuth
  }
}