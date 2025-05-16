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
import { useRouter } from 'vue-router'
import SocialLogin from '@/components/auth/SocialLogin.vue'

const router = useRouter()
function handleSocialLogin(provider) {
  console.log(`${provider} 로그인 시도`)
  // TODO: 실제 인증 로직 연결 (OAuth redirect 등)
  // 예: router.push('/')
}



// LoginPage.vue 또는 로그인 처리 컴포넌트에서

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
      // 로그인 성공 시 PlansPage로 리다이렉트
      router.push({ name: 'Plans' });
    } else {
      // 로그인 실패 시 에러 메시지 표시 후 Onboarding 페이지 유지
      // (현재 페이지가 Login이라면 Onboarding으로 이동)
      if (router.currentRoute.value.name === 'Login') {
        router.push({ name: 'Onboarding' });
      }
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    // 오류 발생 시에도 Onboarding 페이지로 이동
    if (router.currentRoute.value.name === 'Login') {
      router.push({ name: 'Onboarding' });
    }
  }
};

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