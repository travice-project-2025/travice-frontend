<template>
  <div class="onboarding-container">
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
            <div class="feature-text">최적의 이동 경로 제안</div>
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
                    <h3>실시간 여행 정보</h3>
                    <p>항공편 변경, 날씨 업데이트, 현지 소식을 실시간으로 확인하세요</p>
                  </div>
                </div>
                
                <!-- 캐러셀 아이템 3: 여행 추억 -->
                <div class="carousel-item" :class="{ active: activeIndex === 2 }">
                  <div class="carousel-image">
                    <img src="../assets/images/tree_img.png" alt="여행 추억 화면">
                  </div>
                  <div class="carousel-text">
                    <h3>추억 공유 서비스</h3>
                    <p>소중한 여행 순간을 기록하고 친구들과 쉽게 공유할 수 있습니다</p>
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
  background-color: #FAFAFA;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
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
  max-width: 1200px;
  margin: 100px auto 60px;
  padding: 0 20px;
  min-height: calc(100vh - 180px);
  align-items: center;
}

.intro-section {
  flex: 1;
  padding-right: 40px;
}

.main-title {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.2;
  color: #2c3e50;
}

.highlight {
  color: #8e6ad9;
}

.subtitle {
  font-size: 18px;
  color: #5d6778;
  margin-bottom: 40px;
  line-height: 1.5;
}

.feature-list {
  margin-bottom: 40px;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.feature-icon {
  width: 24px;
  height: 24px;
  background-color: #8e6ad9;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 14px;
}

.feature-text {
  font-size: 16px;
  color: #4a4a4a;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.btn-start {
  background-color: #8e6ad9;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 8px rgba(142, 106, 217, 0.3);
}

.btn-start:hover {
  background-color: #7c59c5;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(142, 106, 217, 0.4);
}

.btn-demo {
  background-color: transparent;
  color: #8e6ad9;
  border: 2px solid #8e6ad9;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-demo:hover {
  background-color: rgba(142, 106, 217, 0.1);
}

.visual-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.device-mockup {
  width: 360px;
  height: 640px;
  background-color: white;
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  padding: 15px;
  position: relative;
  overflow: hidden;
}

.mockup-content {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.mockup-screen {
  width: 100%;
  height: 100%;
  background-color: #f5f5f7;
  display: flex;
  flex-direction: column;
}

.carousel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  text-align: center;
}

.carousel-image {
  width: 100%;
  max-width: 250px;
  margin-bottom: 30px;
}

.carousel-image img {
  width: 100%;
  height: auto;
}

.carousel-text h3 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #333;
}

.carousel-text p {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
}

.carousel-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #d0d0d0;
}

.dot.active {
  background-color: #8e6ad9;
}

.features-section {
  background-color: white;
  padding: 80px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  gap: 30px;
}

.feature-card {
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon-large {
  font-size: 36px;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #333;
}

.feature-card p {
  font-size: 15px;
  color: #666;
  line-height: 1.5;
}

.footer {
  background-color: #f5f5f7;
  padding: 40px 0;
}

.footer .container {
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.footer-logo {
  font-size: 24px;
  font-weight: 700;
  color: #8e6ad9;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  font-size: 14px;
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
  margin-top: 10px;
}

/* 반응형 스타일 */
@media (max-width: 992px) {
  .main-content {
    flex-direction: column;
    margin-top: 80px;
  }
  
  .intro-section {
    padding-right: 0;
    margin-bottom: 60px;
    text-align: center;
  }
  
  .feature-item {
    justify-content: center;
  }
  
  .container {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 32px;
  }
  
  .subtitle {
    font-size: 16px;
  }
  
  .device-mockup {
    width: 300px;
    height: 540px;
  }
}

@media (max-width: 576px) {
  .header {
    padding: 15px 20px;
  }
  
  .cta-buttons {
    flex-direction: column;
    gap: 12px;
  }
  
  .device-mockup {
    width: 280px;
    height: 500px;
  }
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
  padding: 20px;
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

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #d0d0d0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dot.active {
  background-color: #8e6ad9;
  width: 10px;
  height: 10px;
}

.carousel-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}
</style>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

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