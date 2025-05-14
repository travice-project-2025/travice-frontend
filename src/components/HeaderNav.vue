<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 로그인 페이지로 이동
const goToLogin = () => {
  router.push('/login')
}

// 로그아웃 처리
const logout = () => {
  // 직접 Spring Security의 로그아웃 URL로 이동
  window.location.href = 'http://localhost:8080/api/logout'
}
</script>

<template>
  <header class="header">
    <div class="logo">
      <img src="/src/assets/logo.png" alt="TRAVICE 로고" class="logo-image" />
      <span class="logo-text">TRAVICE</span>
    </div>
    <nav class="nav">
      <a href="#" class="nav-link">서비스 소개</a>
      <a href="#" class="nav-link">내 여행 계획</a>
      <a href="#" class="nav-link">게시글 보기</a>
      <a href="#" class="nav-link">공유하기</a>
      <button @click="goToLogin" class="nav-btn">로그인</button>
      <button @click="logout" class="nav-btn logout-btn">로그아웃</button>
    </nav>
  </header>
</template>

<style scoped>
/* 헤더 스타일 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 4rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.logo-image {
  width: 32px;
  height: 32px;
  margin-right: 4px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #6231cb;
}

.nav-btn {
  background-color: #6231cb;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 24px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-btn:hover {
  background-color: #4f27a3;
}

.logout-btn {
  background-color: #f44336;
  margin-left: 8px;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

/* 반응형 스타일 */
@media (max-width: 1024px) {
  .header {
    padding: 1rem 2rem;
  }
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }
}
</style>