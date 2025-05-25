<template>
  <header :class="['header', { shrink: isShrunk }]">
    <!-- 로고 부분: 클릭 시 로그인 상태에 따라 다른 페이지로 이동 -->
    <div class="logo-container" @click="navigateByLoginStatus">
      <img src="../../assets/images/logo.png" alt="Travice Logo" class="logo-image">
      <div class="logo-text">Travice</div>
    </div>
    
    <div class="header-right">
      <div v-if="loggedIn" class="user-controls">
        <!-- 게시판 버튼 추가 -->
        <button @click="goToBoard" class="board-btn">게시판</button>
        
        <div class="dropdown" @click.stop>
          <div class="dropdown-trigger" @click="toggleDropdown">
            <span class="user-name">{{ userNickname ? userNickname : userName }}님</span>
            <span class="dropdown-arrow" :class="{ 'open': isDropdownOpen }"></span>
          </div>
          <div v-if="isDropdownOpen" class="dropdown-menu">
            <div class="dropdown-item" @click="goToProfile">
              <span>내 정보</span>
            </div>
            <div class="dropdown-item" @click="logout">
              <span>로그아웃</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <button @click="goToLogin" class="login-btn">로그인</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/userAuth'
const router = useRouter()

// Props 정의
defineProps({
  isShrunk: {
    type: Boolean,
    default: false
  }
})

// 로그인 상태에 따라 네비게이션 처리하는 함수 추가
const navigateByLoginStatus = () => {
  if (loggedIn.value) {
    router.push('/plans')
  } else {
    router.push('/')
  }
}

// 게시판으로 이동하는 함수 추가
const goToBoard = () => {
  router.push('/board')
}

// script setup 부분에 추가할 함수
const goToProfile = () => {
  router.push('/profile')
  isDropdownOpen.value = false
}

// 드롭다운 상태 관리
const isDropdownOpen = ref(false)


// 인증 컴포저블 사용
const { loggedIn, userName, userNickname, checkLoginStatus, logout, goToLogin } = useAuth()

// 드롭다운 토글 함수
const toggleDropdown = (event) => {
  event.stopPropagation() // 이벤트 버블링 방지
  isDropdownOpen.value = !isDropdownOpen.value
}

// 드롭다운 외부 클릭 시 닫기
const closeDropdownOnOutsideClick = (event) => {
  const dropdown = document.querySelector('.dropdown')
  if (dropdown && !dropdown.contains(event.target) && isDropdownOpen.value) {
    isDropdownOpen.value = false
  }
}

// 컴포넌트가 마운트될 때 로그인 상태 확인 및 이벤트 리스너 등록
onMounted(() => {
  checkLoginStatus()
  document.addEventListener('click', closeDropdownOnOutsideClick)
})

// 컴포넌트가 언마운트될 때 이벤트 리스너 제거
onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdownOnOutsideClick)
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
  justify-content: center; /* 중앙 정렬 */
  align-items: center;
  z-index: 100;
  background-color: #F9FAFC;
  transition: box-shadow 0.3s ease;
}

.header-container {
  max-width: 1400px;
  width: 100%;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header.shrink {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.logo-container:hover {
  opacity: 0.8;
}

.logo-image {
  height: 28px;
  margin-right: 8px;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.header-right {
  margin-left: auto;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 16px; /* 간격 조정 */
}

/* 게시판 버튼 스타일 추가 */
.board-btn {
  background-color: #F0F0FF;
  color: #555;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.board-btn:hover {
  background-color: #E5E5FF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.dropdown {
  position: relative;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 20px;
  background-color: #F0F0FF;
  transition: all 0.2s ease;
  font-weight: 500; /* 글씨 두께 조정 */
}

.dropdown-trigger:hover {
  background-color: #E5E5FF;
}

.user-name {
  margin-right: 6px;
  font-weight: 500; /* 글씨 두께 조정 */
  font-size: 14px;
  color: #555;
}

.dropdown-arrow {
  font-size: 10px;
  transition: transform 0.2s ease;
  color: #666;
  margin-left: 2px;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  width: 140px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 101;
  border: 1px solid #f5f5f5;
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  color: #444;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background-color: #F8F8FF;
  color: #333;
}

.login-btn {
  background-color: #F0F0FF;
  color: #555;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.login-btn:hover {
  background-color: #E5E5FF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>