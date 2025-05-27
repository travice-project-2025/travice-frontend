<template>
  <div class="travice-container">
    <AppHeader :is-shrunk="isScrolled" />

    <!-- 배경 오버레이 -->
    <div class="background-overlay"></div>

    <!-- 히어로 비디오 섹션 -->
    <div
      class="video-container"
      :style="{
        transform: `scale(${videoScale}) translateY(${videoTranslateY}px)`,
        transformOrigin: 'center bottom',
      }"
    >
      <div class="video-wrapper">
        <video
          ref="heroVideo"
          src="../assets/travel.mp4"
          class="hero-image"
          autoplay
          loop
          muted
          playsinline
          style="filter: contrast(1) saturate(1.3) brightness(0.7)"
        />
        <div class="video-overlay">
          <div class="overlay-content">
            <h2 class="hero-title marines-bold">여행을 더 특별하게</h2>
            <p class="hero-subtitle">트래비스와 함께 떠나는 당신만의 여정</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <main class="main-content">
      <!-- Step 01 - AI 계획 -->
      <section class="step-section step-1" id="step1">
        <div class="step-background">
          <div class="step-number">01</div>
          <div class="step-content">
            <div class="step-emoji">🤖</div>
            <h2 class="step-title">
              말만 하면<br/>
              <span class="highlight">AI가 척척</span>
            </h2>
            <p class="step-subtitle">
              "제주도 2박3일 힐링여행" 한 마디면<br/>
              완벽한 일정이 뚝딱!
            </p>
            <div class="demo-chat">
              <div class="chat-bubble user">
                제주도 2박3일로 힐링여행 계획해줘
              </div>
              <div class="chat-bubble ai">
                🌊 성산일출봉 일출 → 카페거리 산책<br/>
                🍊 귤밭 체험 → 온천 힐링<br/>
                ✨ 맞춤 맛집까지 추천완료!
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Step 02 - 동행 매칭 -->
      <section class="step-section step-2" id="step2">
        <div class="step-background">
          <div class="step-number">02</div>
          <div class="step-content">
            <div class="step-emoji">👥</div>
            <h2 class="step-title">
              혼자가기 아쉽다면<br/>
              <span class="highlight">동행 찾기</span>
            </h2>
            <p class="step-subtitle">
              MBTI, 취향, 여행스타일까지<br/>
              딱 맞는 여행 메이트를 찾아드려요
            </p>
            <div class="matching-demo">
              <div class="profile-card card-me">
                <div class="profile-img">😊</div>
                <div class="profile-info">
                  <div class="name">나</div>
                  <div class="mlti">ENFP</div>
                  <div class="style">#액티브 #맛집탐방</div>
                </div>
              </div>
              <div class="match-icon">💝</div>
              <div class="profile-card card-match">
                <div class="profile-img">😄</div>
                <div class="profile-info">
                  <div class="name">김여행</div>
                  <div class="mbti">ENFJ</div>
                  <div class="style">#액티브 #맛집탐방</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Step 03 - 실시간 공유 -->
      <section class="step-section step-3" id="step3">
        <div class="step-background">
          <div class="step-number">03</div>
          <div class="step-content">
            <div class="step-emoji">📱</div>
            <h2 class="step-title">
              여행 중에도<br/>
              <span class="highlight">실시간 소통</span>
            </h2>
            <p class="step-subtitle">
              계획 변경부터 맛집 공유까지<br/>
              모든 걸 함께 즐겨요
            </p>
            <div class="live-demo">
              <div class="notification-card">
                <div class="noti-icon">📍</div>
                <div class="noti-text">
                  <strong>김여행님</strong>이 새로운 맛집을 발견했어요!
                </div>
              </div>
              <div class="notification-card">
                <div class="noti-icon">💬</div>
                <div class="noti-text">
                  <strong>3명</strong>이 내일 일정 변경을 제안했어요
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA 섹션 - 수정된 버전 -->
      <section class="cta-section">
        <div class="cta-container">
          <div class="cta-content">
            <div class="cta-emoji">✨</div>
            <h2 class="cta-title">
              지금 바로<br/>
              <span class="cta-highlight">시작해보세요!</span>
            </h2>
            <p class="cta-description">
              완벽한 여행 계획, 더 이상 혼자 고민하지 마세요
            </p>
            <div class="cta-buttons">
              <button class="btn-primary">
                지금 바로 시작하기
                <span class="btn-icon">→</span>
              </button>
            </div>
            <div class="trust-badges">
              <div class="badge">
                <span class="badge-icon">⭐</span>
                <span>5/5 만족도</span>
              </div>
              <div class="badge">
                <span class="badge-icon">👥</span>
                <span>10만+ 사용자</span>
              </div>
              <div class="badge">
                <span class="badge-icon">🎯</span>
                <span>95% 매칭 성공</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 푸터 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-main">
          <div class="footer-logo">
            <div class="logo-icon">T</div>
            <span class="logo-text">Travice</span>
          </div>
          <p class="footer-tagline">
            여행이 이렇게 쉬워도 되나요? 🌍
          </p>
          <div class="social-links">
            <a href="#" class="social-link">📧</a>
            <a href="#" class="social-link">💬</a>
            <a href="#" class="social-link">📱</a>
          </div>
        </div>
        
        <div class="footer-links">
          <div class="link-group">
            <h4>서비스</h4>
            <a href="#">AI 여행계획</a>
            <a href="#">동행 찾기</a>
            <a href="#">여행 커뮤니티</a>
          </div>
          
          <div class="link-group">
            <h4>지원</h4>
            <a href="#">도움말</a>
            <a href="#">문의하기</a>
            <a href="#">FAQ</a>
          </div>
          
          <div class="link-group">
            <h4>회사</h4>
            <a href="#">About</a>
            <a href="#">채용</a>
            <a href="#">개인정보처리방침</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 Travice. 모든 여행을 특별하게 ✨</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 반응형 상태
const scrollY = ref(0)
const videoScale = ref(1)
const videoTranslateY = ref(0)
const isScrolled = ref(false)
const heroVideo = ref(null)

// 스크롤 핸들러
const handleScroll = () => {
  const currentScrollY = window.scrollY
  scrollY.value = currentScrollY
  isScrolled.value = currentScrollY > 30
  
  // 비디오 스케일링 로직 - 더 민감하게 반응
  const maxScrollForAnimation = 120
  
  if (currentScrollY < 20) {
    videoScale.value = 1
    videoTranslateY.value = 0
  } else if (currentScrollY < maxScrollForAnimation) {
    const progress = (currentScrollY - 20) / (maxScrollForAnimation - 20)
    videoScale.value = 1 - (0.2 * progress) // 80%까지 축소
    videoTranslateY.value = progress * 60
  } else {
    videoScale.value = 0.8
    videoTranslateY.value = 60
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // 비디오 자동 재생 및 2배속 설정
  if (heroVideo.value) {
    heroVideo.value.playbackRate = 2.0 // 2배속 설정
    heroVideo.value.play().catch(err => {
      console.warn("비디오 자동 재생을 시작할 수 없습니다:", err)
      
      // 자동 재생 실패 시 사용자 상호작용을 기다린 후 재시도
      document.addEventListener('click', () => {
        if (heroVideo.value) {
          heroVideo.value.playbackRate = 2.0
          heroVideo.value.play().catch(e => console.error("클릭 후에도 재생 실패:", e))
        }
      }, { once: true })
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 웹폰트 설정 */
@font-face { 
  font-family: 'MarinesBold'; 
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2502-1@1.0/MarinesBold.woff2') format('woff2'); 
  font-weight: 400; 
  font-style: normal; 
}

/* 기본 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.travice-container {
  font-family: 'MarinesBold', "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", sans-serif;
  color: #1a1a1a;
  background: url('../assets/images/board.jpg') center/cover no-repeat fixed;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.marines-bold {
  font-family: 'MarinesBold', sans-serif;
}

/* 배경 오버레이 */
.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(247, 245, 254, 0.7);
  backdrop-filter: blur(8px);
  z-index: 0;
}

/* 헤더 스타일 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
}

.header-scrolled {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 18px;
}

.logo-text {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #667eea;
}

.login-btn {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 10px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.login-btn:hover {
  background: #667eea;
  color: white;
}

/* 히어로 비디오 섹션 */
.video-container {
  position: relative;
  width: 100%;
  height: 110vh;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 10;
  scroll-snap-align: start;
}

.video-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.video-container[style*="scale(0.8)"] .video-wrapper {
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(98, 49, 203, 0.3);
}

.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-content {
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 24px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: -2px;
  font-family: 'MarinesBold', sans-serif;
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 400;
  opacity: 0.9;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  font-family: 'MarinesBold', sans-serif;
}

/* 메인 콘텐츠 - 스텝별 전환 효과 */
.main-content {
  position: relative;
  z-index: 5;
  background: transparent;
}

/* 스텝 섹션 공통 스타일 */
.step-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  scroll-snap-align: start;
}

.step-background {
  position: relative;
  width: 100%;
  max-width: 1200px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-number {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8rem;
  font-weight: 900;
  color: rgba(98, 49, 203, 0.1);
  font-family: 'MarinesBold', sans-serif;
  z-index: 1;
}

.step-content {
  text-align: center;
  position: relative;
  z-index: 2;
  max-width: 800px;
}

.step-emoji {
  font-size: 5rem;
  margin-bottom: 32px;
  display: block;
  animation: bounce 2s ease-in-out infinite;
}

.step-title {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 24px;
  color: #1a1a1a;
  font-family: 'MarinesBold', sans-serif;
}

.highlight {
  color: #6231cb;
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  height: 12px;
  background: linear-gradient(135deg, rgba(98, 49, 203, 0.2), rgba(143, 92, 246, 0.2));
  border-radius: 6px;
  z-index: -1;
}

.step-subtitle {
  font-size: 1.4rem;
  color: #6b7280;
  margin-bottom: 48px;
  line-height: 1.6;
  font-family: 'MarinesBold', sans-serif;
}

/* Step 1 - AI 계획 */
.step-1 {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.demo-chat {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(98, 49, 203, 0.15);
  max-width: 500px;
  margin: 0 auto;
}

.chat-bubble {
  padding: 16px 20px;
  border-radius: 20px;
  margin-bottom: 16px;
  font-size: 1rem;
  line-height: 1.5;
  font-family: 'MarinesBold', sans-serif;
}

.chat-bubble.user {
  background: #6231cb;
  color: white;
  margin-left: 40px;
  border-bottom-right-radius: 8px;
}

.chat-bubble.ai {
  background: #f1f5f9;
  color: #1a1a1a;
  margin-right: 40px;
  border-bottom-left-radius: 8px;
  animation: typeWriter 2s ease-in-out;
}

/* Step 2 - 동행 매칭 */
.step-2 {
  background: linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%);
}

.matching-demo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-top: 48px;
}

.profile-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 15px 40px rgba(98, 49, 203, 0.12);
  text-align: center;
  min-width: 140px;
  transform: scale(0.9);
  animation: profilePop 1s ease-out 0.5s forwards;
}

.profile-img {
  font-size: 3rem;
  margin-bottom: 12px;
}

.name {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 4px;
  font-family: 'MarinesBold', sans-serif;
}

.mbti {
  background: #6231cb;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  display: inline-block;
  font-family: 'MarinesBold', sans-serif;
}

.style {
  font-size: 0.85rem;
  color: #6b7280;
  font-family: 'MarinesBold', sans-serif;
}

.match-icon {
  font-size: 2.5rem;
  animation: heartBeat 1.5s ease-in-out infinite;
}

/* Step 3 - 실시간 공유 */
.step-3 {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.live-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
  margin: 0 auto;
}

.notification-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.15);
  transform: translateX(-100px);
  opacity: 0;
  animation: slideInLeft 0.8s ease-out forwards;
}

.notification-card:nth-child(1) { animation-delay: 0.2s; }
.notification-card:nth-child(2) { animation-delay: 0.4s; }

.noti-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.noti-text {
  font-size: 0.95rem;
  color: #374151;
  line-height: 1.4;
  font-family: 'MarinesBold', sans-serif;
}

.noti-text strong {
  color: #0ea5e9;
  font-weight: 700;
}

/* CTA 섹션 - 밝은 테마로 수정 */
.cta-section {
  background: linear-gradient(135deg, #fef7ff 0%, #f0f4ff 50%, #e0f2fe 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  scroll-snap-align: start;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="25" cy="25" r="1" fill="rgba(98,49,203,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(98,49,203,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(98,49,203,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(98,49,203,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(98,49,203,0.1)"/></svg>');
  animation: starMove 20s linear infinite;
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 40px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.cta-emoji {
  font-size: 4rem;
  margin-bottom: 32px;
  display: block;
  animation: sparkle 3s ease-in-out infinite;
}

.cta-title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 24px;
  line-height: 1.1;
  color: #1a1a1a;
  font-family: 'MarinesBold', sans-serif;
}

.cta-highlight {
  color: #6231cb;
  position: relative;
}

.cta-highlight::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  height: 16px;
  background: linear-gradient(135deg, rgba(98, 49, 203, 0.2), rgba(143, 92, 246, 0.2));
  border-radius: 8px;
  z-index: -1;
}

.cta-description {
  font-size: 1.5rem;
  margin-bottom: 48px;
  color: #6b7280;
  font-family: 'MarinesBold', sans-serif;
}

.cta-buttons {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-bottom: 64px;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #6231cb, #8b5fbf);
  color: white;
  border: none;
  padding: 18px 36px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(98, 49, 203, 0.3);
  font-family: 'MarinesBold', sans-serif;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(98, 49, 203, 0.4);
}

.btn-icon {
  font-size: 1.5rem;
  transition: transform 0.3s;
}

.btn-primary:hover .btn-icon {
  transform: translateX(4px);
}

.btn-secondary {
  background: white;
  color: #6231cb;
  border: 2px solid #6231cb;
  padding: 18px 36px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'MarinesBold', sans-serif;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 25px rgba(98, 49, 203, 0.1);
}

.btn-secondary:hover {
  background: #6231cb;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(98, 49, 203, 0.2);
}

.play-icon {
  font-size: 1rem;
  color: inherit;
}

.trust-badges {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}

.badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 12px 20px;
  border-radius: 50px;
  border: 2px solid rgba(98, 49, 203, 0.1);
  font-size: 0.9rem;
  font-weight: 500;
  color: #4a5568;
  font-family: 'MarinesBold', sans-serif;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(98, 49, 203, 0.08);
}

.badge:hover {
  background: #f8f4ff;
  border-color: rgba(98, 49, 203, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(98, 49, 203, 0.15);
}

.badge-icon {
  font-size: 1rem;
}

/* 푸터 */
.footer {
  background: #f8fafc;
  color: #4a5568;
  position: relative;
  z-index: 5;
  border-top: 1px solid #e2e8f0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 40px 0;
  display: flex;
  justify-content: space-between;
  gap: 60px;
}

.footer-main {
  flex: 1;
  max-width: 400px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.footer-tagline {
  color: #6b7280;
  font-size: 1.1rem;
  margin-bottom: 24px;
  font-family: 'MarinesBold', sans-serif;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  width: 44px;
  height: 44px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s;
  color: #6b7280;
}

.social-link:hover {
  background: #6231cb;
  border-color: #6231cb;
  color: white;
  transform: translateY(-2px);
}

.footer-links {
  display: flex;
  gap: 48px;
}

.link-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-group h4 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a1a1a;
  font-family: 'MarinesBold', sans-serif;
}

.link-group a {
  color: #6b7280;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
  font-family: 'MarinesBold', sans-serif;
}

.link-group a:hover {
  color: #6231cb;
}

.footer-bottom {
  border-top: 1px solid #e2e8f0;
  padding: 24px 40px;
  text-align: center;
  max-width: 1200px;
  margin: 24px auto 0;
}

.footer-bottom p {
  color: #6b7280;
  font-size: 0.9rem;
  font-family: 'MarinesBold', sans-serif;
}

/* 애니메이션 */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes sparkle {
  0%, 100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(-10px) rotate(5deg) scale(1.1);
  }
}

@keyframes typeWriter {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes profilePop {
  0% {
    transform: scale(0.9);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes heartBeat {
  0%, 50%, 100% {
    transform: scale(1);
  }
  25%, 75% {
    transform: scale(1.1);
  }
}

@keyframes slideInLeft {
  0% {
    transform: translateX(-100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes starMove {
  0% {
    transform: translateY(0px) translateX(0px);
  }
  100% {
    transform: translateY(-10px) translateX(-10px);
  }
}

/* 스크롤 스냅 효과 */
html {
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .header-content,
  .step-background,
  .cta-container,
  .footer-content {
    max-width: 1200px;
    padding-left: 32px;
    padding-right: 32px;
  }
  
  .step-title {
    font-size: 3rem;
  }
  
  .hero-title {
    font-size: 4rem;
  }
}

@media (max-width: 992px) {
  .nav-links {
    display: none;
  }
  
  .step-title {
    font-size: 2.5rem;
  }
  
  .hero-title {
    font-size: 3.5rem;
  }
  
  .cta-title {
    font-size: 3rem;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 12px 20px;
  }
  
  .step-background {
    padding: 0 20px;
  }
  
  .step-number {
    font-size: 4rem;
    top: -30px;
  }
  
  .step-emoji {
    font-size: 3rem;
  }
  
  .step-title {
    font-size: 2.5rem;
  }
  
  .step-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .matching-demo {
    flex-direction: column;
    gap: 20px;
  }
  
  .profile-card {
    min-width: 120px;
  }
  
  .demo-chat {
    padding: 24px;
  }
  
  .chat-bubble.user {
    margin-left: 20px;
  }
  
  .chat-bubble.ai {
    margin-right: 20px;
  }
  
  .cta-title {
    font-size: 2.8rem;
  }
  
  .cta-description {
    font-size: 1.3rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
  
  .trust-badges {
    gap: 16px;
  }
  
  .badge {
    font-size: 0.8rem;
    padding: 10px 16px;
  }
  
  .footer-content {
    padding: 40px 20px 0;
  }
  
  .footer-links {
    gap: 32px;
  }
}

@media (max-width: 576px) {
  .logo-text {
    font-size: 20px;
  }
  
  .step-title {
    font-size: 2rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .step-subtitle {
    font-size: 1.1rem;
  }
  
  .step-emoji {
    font-size: 2.5rem;
  }
  
  .cta-container {
    padding: 0 20px;
  }
  
  .cta-title {
    font-size: 2.2rem;
  }
  
  .cta-emoji {
    font-size: 3rem;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 24px;
  }
}

/* 스크린 리더 접근성 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>