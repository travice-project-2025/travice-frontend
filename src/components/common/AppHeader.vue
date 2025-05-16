<!-- src/components/common/AppHeader.vue -->
<template>
  <header :class="['header', { shrink: isShrunk }]">
    <div class="logo">Travice</div>
    <div class="header-right">
      <div v-if="loggedIn" class="user-controls">
        <span class="user-name">{{ userName }}님 </span>
        <button @click="logout" class="login-btn">로그아웃</button>
      </div>
      <div v-else>
        <button @click="goToLogin" class="login-btn">로그인</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

const router = useRouter()
const loggedIn = ref(false)
const userName = ref('')

// Props 정의
defineProps({
  isShrunk: {
    type: Boolean,
    default: false
  }
})

// 로그인 페이지로 이동
const goToLogin = () => {
  router.push('/login')
}

// 로그인 상태 확인 함수
const checkLoginStatus = async () => {
  const hasToken = !!Cookies.get('JWT-TOKEN');
  loggedIn.value = hasToken;
  
  if (hasToken) {
    await fetchUserName();
  } else {
    userName.value = '';
  }
}

// 서버에서 사용자 정보 가져오기
const fetchUserName = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/info', {
      credentials: 'include' // 쿠키 포함
    });
    
    if (response.ok) {
      const userData = await response.json();
      userName.value = userData.name;
    } else {
      // 인증 실패 처리
      loggedIn.value = false;
      userName.value = '';
    }
  } catch (error) {
    console.error('사용자 정보 요청 오류:', error);
    loggedIn.value = false;
    userName.value = '';
  }
}

// 로그아웃 처리
const logout = () => {
  Cookies.remove('JWT-TOKEN');
  loggedIn.value = false;
  userName.value = '';
  router.push('/');
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

.login-btn {
  background-color: #F0F0FF;
  color: #333;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}
</style>