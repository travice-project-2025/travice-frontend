<template>
  <div class="login-page">
    <div class="login-image">
      <img src="@/assets/images/travel-bg.jpg" alt="Login Visual" />
    </div>
    <div class="login-form">
      <h1 class="login-title">환영합니다</h1>
      <p class="login-subtitle">소셜 계정으로 빠르게 시작하세요</p>
      <SocialLogin @login="handleSocialLogin" />
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import SocialLogin from '@/components/auth/SocialLogin.vue'

const router = useRouter()
const route = useRoute()

// 페이지 로드 시 redirect 파라미터 확인
onMounted(() => {
  console.log('Login page - redirect param:', route.query.redirect)
  
  // OAuth 콜백 처리 (소셜 로그인 후 돌아온 경우)
  checkOAuthCallback()
})

// OAuth 콜백 확인 및 처리
const checkOAuthCallback = () => {
  // URL에서 OAuth 성공 여부 확인 (예: ?success=true&token=xxx)
  if (route.query.success === 'true') {
    console.log('OAuth login successful')
    handleRedirect()
  }
}

// 리다이렉트 처리 함수
const handleRedirect = () => {
  const redirectPath = route.query.redirect || localStorage.getItem('redirectPath')
  console.log('Handling redirect to:', redirectPath)
  
  if (redirectPath) {
    // localStorage에서 제거
    localStorage.removeItem('redirectPath')
    // 원래 가려던 페이지로 이동
    router.push(redirectPath)
  } else {
    // 기본 페이지로 이동
    router.push('/plans')
  }
}

// 소셜 로그인 처리
function handleSocialLogin(provider) {
  console.log(`${provider} 로그인 시도`)
  
  // redirect 파라미터를 localStorage에 저장 (OAuth 후에도 유지하기 위해)
  if (route.query.redirect) {
    localStorage.setItem('redirectPath', route.query.redirect)
  }
  
  // OAuth 로그인 URL로 리다이렉트
  if (provider === 'google') {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  } else if (provider === 'kakao') {
    window.location.href = 'http://localhost:8080/oauth2/authorization/kakao'
  }
  // 실제 OAuth 인증 후 백엔드에서 /login?success=true 같은 형태로 리다이렉트 해주어야 함
}

// 일반 로그인 처리 (만약 이메일/패스워드 로그인도 있다면)
const handleLogin = async () => {
  try {
    // 로그인 API 호출
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      }),
      credentials: 'include'
    });
    
    if (response.ok) {
      // 로그인 성공 시 redirect 처리
      handleRedirect()
    } else {
      // 로그인 실패 시 에러 메시지 표시
      console.error('로그인 실패')
      // 에러 메시지 표시 로직
    }
  } catch (error) {
    console.error('로그인 오류:', error)
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.login-image {
  flex: 7;
}
.login-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.login-form {
  flex: 3;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.login-title {
  font-size: 2.25rem;
  margin-bottom: 0.5rem;
}
.login-subtitle {
  color: #666;
  margin-bottom: 1.5rem;
}
</style>