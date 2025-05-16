<!-- src/components/common/AppHeader.vue -->
<template>
  <header :class="['header', { shrink: isShrunk }]">
    <div class="logo">Travice</div>
    <div class="header-right">
      <div v-if="loggedIn" class="user-controls">
        <span class="user-name">{{ userName }}님 </span>
        <button @click="goToProfile" class="profile-btn">내 정보</button>
        <button @click="logout" class="login-btn">로그아웃</button>
      </div>
      <div v-else>
        <button @click="goToLogin" class="login-btn">로그인</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/userAuth'

// Props 정의
defineProps({
  isShrunk: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

// 인증 컴포저블 사용
const { loggedIn, userName, checkLoginStatus, logout, goToLogin } = useAuth()

// 프로필 페이지로 이동
const goToProfile = () => {
  router.push('/profile')
}

// 컴포넌트가 마운트될 때 로그인 상태 확인
onMounted(() => {
  checkLoginStatus()
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 100;
  background-color: #F9FAFC;
  transition: box-shadow 0.3s ease;
}

.header.shrink {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-right {
  margin-left: auto;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  margin-right: 10px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.login-btn, .profile-btn {
  background-color: #F0F0FF;
  color: #333;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.profile-btn {
  background-color: #E6F0FF;
}
</style>