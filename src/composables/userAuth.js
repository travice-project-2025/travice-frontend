// src/composables/userAuth.js
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

export function useAuth() {
  const loggedIn = ref(false)
  const userName = ref('')
  const userNickname = ref('')
  const router = useRouter()


 const checkLoginStatus = async () => {
  const userData = await fetchUserName()
  
  if (userData) {
    loggedIn.value = true
    return true
  } else {
    loggedIn.value = false
    userName.value = ''
    userNickname.value = ''
    return false
  }
}



const fetchUserName = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/info', {
      method : 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    if (response.ok) {
      const userData = await response.json()
      userName.value = userData.name
      userNickname.value = userData.nickname
      console.log('사용자 정보 로드 성공:', userName.value, userNickname.value)
      return userData
    } else {
      console.warn(`사용자 정보 로드 실패: ${response.status}, 로그인 페이지로 이동`)
      loggedIn.value = false
      userName.value = ''
      userNickname.value = ''
      router.push('/login')
      return null
    }
  } catch (error) {
    console.warn('사용자 정보 요청 오류 발생, 로그인 페이지로 이동:', error)
    loggedIn.value = false
    userName.value = ''
    userNickname.value = ''
    router.push('/login')
    return null
  }
}


  // 명시적 로그아웃만 허용
  const logout = () => {
    console.log('명시적 로그아웃 실행')
    Cookies.remove('JWT-TOKEN')
    localStorage.removeItem('JWT-TOKEN')
    loggedIn.value = false
    userName.value = ''
    userNickname.value = ''
    router.push('/')
  }

  // 로그인 페이지로 이동
  const goToLogin = () => {
    router.push('/login')
  }

  // 보호된 경로 접근 시 토큰만 확인 (서버 응답은 무시)
  const requireAuth = async (redirectPath = '/login') => {
    const hasToken = !!Cookies.get('JWT-TOKEN') || !!localStorage.getItem('JWT-TOKEN');
    
    if (!hasToken) {
      console.log('토큰이 없어서 로그인 페이지로 리다이렉트')
      router.push(redirectPath)
      return false
    }
    
    // 토큰이 있으면 로그인 상태로 설정
    loggedIn.value = true
    
    // 백그라운드에서 사용자 정보 시도
    try {
      await fetchUserName()
    } catch (error) {
      console.warn('사용자 정보 로드 실패했지만 토큰이 있으므로 계속 진행')
    }
    
    return true
  }

  return {
    loggedIn,
    userName,
    userNickname,
    checkLoginStatus,
    fetchUserName,
    logout,
    goToLogin,
    requireAuth
  }
}