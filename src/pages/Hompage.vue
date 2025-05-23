<template>
  <div class="onboarding-container">
    <!-- 배경 오버레이 -->
    <div class="background-overlay"></div>
    
    <!-- 헤더 영역 -->
    <header class="header">
      <div class="logo-container">
        <img src="../assets/images/logo.png" alt="Travice Logo" class="logo-image">
        <div class="logo-text">Travice</div>
      </div>
      <button class="login-btn" @click="goToLogin">로그인</button>
    </header>

    <!-- 메인 콘텐츠 -->
    <main class="main-content">
      <!-- 왼쪽: 소개 텍스트 -->
      <div class="intro-section">
        <h1 class="main-title">
          AI와 함께 <span class="highlight">쉽고 즐겁게</span><br>
          여행 계획을 세워보세요
        </h1>
        <p class="subtitle">
          Travice와 함께라면 모든 여행이 특별해집니다.<br>
          당신만의 완벽한 여행 일정을 만들어 드립니다.
        </p>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">✓</div>
            <div class="feature-text">AI 기반 맞춤형 여행 추천</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">✓</div>
            <div class="feature-text">간편한 일정 관리와 공유</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">✓</div>
            <div class="feature-text">맞춤형 여행 동행 매칭</div>
          </div>
        </div>
        <div class="cta-buttons">
          <button class="btn-start" @click="goToSignup">시작하기</button>
          <button class="btn-demo" @click="showDemo">둘러보기</button>
        </div>
      </div>

      <!-- 오른쪽: 이미지/애니메이션 -->
      <div class="visual-section">
        <div class="device-mockup">
          <div class="mockup-content">
            <div class="mockup-screen">
              <!-- 캐러셀 컨테이너 -->
              <div class="carousel-container">
                <!-- 캐러셀 아이템 1: 여행 계획 -->
                <div class="carousel-item" :class="{ active: activeIndex === 0 }">
                  <div class="carousel-image">
                    <img src="../assets/images/airplane_img.png" alt="여행 계획 화면">
                  </div>
                  <div class="carousel-text">
                    <h3>맞춤형 여행 계획</h3>
                    <p>당신의 취향과 일정에 맞는 최적의 여행 코스를 제안합니다</p>
                  </div>
                </div>
                
                <!-- 캐러셀 아이템 2: 실시간 정보 -->
                <div class="carousel-item" :class="{ active: activeIndex === 1 }">
                  <div class="carousel-image">
                    <img src="../assets/images/carrier_img.png" alt="실시간 정보 화면">
                  </div>
                  <div class="carousel-text">
                    <h3>간편한 일정 관리</h3>
                    <p>Travice와 함께 간편하게 일정을 관리하세요요</p>
                  </div>
                </div>
                
                <!-- 캐러셀 아이템 3: 여행 추억 -->
                <div class="carousel-item" :class="{ active: activeIndex === 2 }">
                  <div class="carousel-image">
                    <img src="../assets/images/tree_img.png" alt="여행 추억 화면">
                  </div>
                  <div class="carousel-text">
                    <h3>함께 하는 여행</h3>
                    <p>함께 여행 갈 동행을 구해 여행을 떠나보세요</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="carousel-dots">
              <span 
                v-for="(_, index) in 3" 
                :key="index" 
                class="dot" 
                :class="{ active: activeIndex === index }"
                @click="setActiveSlide(index)"
              ></span>
            </div>
          </div>
      </div>
      </div>
    </main>

    <!-- 하단 특징 섹션 -->
    <section class="features-section">
      <div class="container">
        <div class="feature-card">
          <div class="feature-icon-large">🗺️</div>
          <h3>스마트한 계획</h3>
          <p>AI가 추천하는 최적의 여행 코스로 시간을 절약하세요</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon-large">🚄</div>
          <h3>교통편 추천</h3>
          <p>최적의 이동 수단과 경로를 한눈에 확인하세요</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon-large">👥</div>
          <h3>함께하는 여행</h3>
          <p>친구들과 일정을 공유하고 함께 계획을 세워보세요</p>
        </div>
      </div>
    </section>

    <!-- 푸터 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-logo">Travice</div>
        <div class="footer-links">
          <a href="#">서비스 소개</a>
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
          <a href="#">고객센터</a>
        </div>
        <div class="copyright">© 2025 Travice. All rights reserved.</div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.onboarding-container {
  font-family: "Marines", "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", sans-serif;
  color: #333;
  background: url("../assets/images/board.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
}

/* 배경 오버레이 - 흐릿한 효과 */
.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(3px);
  z-index: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.logo-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo-image {
  height: 32px;
  margin-right: 10px;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.login-btn {
  background-color: transparent;
  color: #8e6ad9;
  border: 2px solid #8e6ad9;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.login-btn:hover {
  background-color: rgba(142, 106, 217, 0.1);
}

.main-content {
  display: flex;
  max-width: 1400px;
  margin: 120px auto 80px;
  padding: 0 40px;
  min-height: calc(100vh - 200px);
  align-items: center;
  position: relative;
  z-index: 1;
}

.intro-section {
  flex: 1.2;
  padding-right: 60px;
}

.main-title {
  font-size: 52px;
  font-weight: 800;
  margin-bottom: 30px;
  line-height: 1.2;
  color: #2c3e50;
}

.highlight {
  color: #8e6ad9;
}

.subtitle {
  font-size: 22px;
  color: #5d6778;
  margin-bottom: 50px;
  line-height: 1.6;
}

.feature-list {
  margin-bottom: 50px;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.feature-icon {
  width: 28px;
  height: 28px;
  background-color: #8e6ad9;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 16px;
  font-weight: bold;
}

.feature-text {
  font-size: 18px;
  color: #4a4a4a;
  font-weight: 500;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  margin-top: 40px;
}

.btn-start {
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
  color: white;
  border: none;
  padding: 18px 40px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 20px rgba(142, 106, 217, 0.3);
}

.btn-start:hover {
  background: linear-gradient(135deg, #7c59c5, #9333ea);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(142, 106, 217, 0.4);
}

.btn-demo {
  background-color: rgba(255, 255, 255, 0.9);
  color: #8e6ad9;
  border: 2px solid #8e6ad9;
  padding: 18px 40px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.btn-demo:hover {
  background-color: rgba(142, 106, 217, 0.1);
  transform: translateY(-2px);
}

.visual-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.device-mockup {
  width: 420px;
  height: 750px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 35px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  padding: 20px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.mockup-content {
  width: 100%;
  height: 100%;
  border-radius: 25px;
  overflow: hidden;
  position: relative;
}

.mockup-screen {
  width: 100%;
  height: 100%;
  background: #f5f5f7;
  display: flex;
  flex-direction: column;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 30px;
  text-align: center;
  position: absolute;
  width: 100%;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.5s ease;
}

.carousel-item.active {
  opacity: 1;
  transform: translateX(0);
  z-index: 1;
}

.carousel-image {
  width: 100%;
  max-width: 280px;
  margin-bottom: 40px;
}

.carousel-image img {
  width: 100%;
  height: auto;
}

.carousel-text h3 {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #333;
}

.carousel-text p {
  font-size: 18px;
  color: #666;
  line-height: 1.6;
}

.carousel-dots {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #d0d0d0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background-color: #8e6ad9;
  width: 12px;
  height: 12px;
}

.features-section {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 100px 0;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.feature-card {
  flex: 1;
  background-color: rgba(248, 249, 250, 0.8);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  background-color: rgba(255, 255, 255, 0.9);
}

.feature-icon-large {
  font-size: 48px;
  margin-bottom: 25px;
}

.feature-card h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #333;
}

.feature-card p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
}

.footer {
  background-color: rgba(245, 245, 247, 0.95);
  padding: 50px 0;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.footer .container {
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

.footer-logo {
  font-size: 28px;
  font-weight: 700;
  color: #8e6ad9;
}

.footer-links {
  display: flex;
  gap: 30px;
}

.footer-links a {
  font-size: 16px;
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #8e6ad9;
}

.copyright {
  font-size: 14px;
  color: #999;
  margin-top: 15px;
}

/* 반응형 스타일 */
@media (max-width: 1200px) {
  .main-content {
    max-width: 1200px;
    padding: 0 30px;
  }
  
  .main-title {
    font-size: 46px;
  }
  
  .device-mockup {
    width: 380px;
    height: 680px;
  }
}

@media (max-width: 992px) {
  .main-content {
    flex-direction: column;
    margin-top: 100px;
  }
  
  .intro-section {
    padding-right: 0;
    margin-bottom: 80px;
    text-align: center;
  }
  
  .feature-item {
    justify-content: center;
  }
  
  .container {
    flex-direction: column;
  }
  
  .main-title {
    font-size: 40px;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 36px;
  }
  
  .subtitle {
    font-size: 18px;
  }
  
  .device-mockup {
    width: 320px;
    height: 580px;
  }
  
  .main-content {
    padding: 0 20px;
  }
}

@media (max-width: 576px) {
  .header {
    padding: 15px 20px;
  }
  
  .cta-buttons {
    flex-direction: column;
    gap: 15px;
  }
  
  .device-mockup {
    width: 300px;
    height: 540px;
  }
  
  .main-title {
    font-size: 32px;
  }
  
  .subtitle {
    font-size: 16px;
  }
}
</style>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAuth } from '../composables/userAuth'; // 이 줄 추가

// useAuth 사용
const { checkLoginStatus } = useAuth();


// 캐러셀 상태 관리
const activeIndex = ref(0);
const slidesCount = 3;
let autoSlideTimer = null;

// 특정 슬라이드로 이동
const setActiveSlide = (index) => {
  activeIndex.value = index;
  resetAutoSlideTimer(); // 사용자가 수동으로 변경 시 타이머 재설정
};

// 다음 슬라이드로 이동
const nextSlide = () => {
  activeIndex.value = (activeIndex.value + 1) % slidesCount;
};

// 자동 슬라이드 타이머 설정
const startAutoSlideTimer = () => {
  autoSlideTimer = setInterval(() => {
    nextSlide();
  }, 4000); // 4초마다 슬라이드 변경
};

// 타이머 재설정
const resetAutoSlideTimer = () => {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer);
  }
  startAutoSlideTimer();
};

// 컴포넌트 마운트 시 자동 슬라이드 시작
onMounted(() => {
  checkLoginStatus(false);
  startAutoSlideTimer();
});

// 컴포넌트 언마운트 전에 타이머 정리
onBeforeUnmount(() => {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer);
  }
});

// 기존 함수 유지
const goToLogin = () => {
  window.location.href = '/login';
};

const goToSignup = () => {
  window.location.href = '/signup';
};

const showDemo = () => {
  window.location.href = '/demo';
};
</script>