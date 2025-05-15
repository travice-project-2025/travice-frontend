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