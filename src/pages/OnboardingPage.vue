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
        transformOrigin: 'center bottom'
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
   style="filter: contrast(1.2) saturate(1.3) brightness(1.1);"
 />
 <div class="video-overlay">
   <div class="overlay-content">
     <h1 class="hero-title marines-bold">With Travice</h1>
     <p class="hero-subtitle">AI와 함께하는 완벽한 여행</p>
   </div>
 </div>
</div>
      
    </div>

    <!-- 메인 콘텐츠 -->
    <main class="main-content">
      <!-- 첫 번째 섹션 - 서비스 소개 -->
      <section class="intro-section">
        <div class="content-wrapper">
          <div class="text-content">
            <h2 class="section-title">
              AI와 함께 <span class="highlight">쉽고 즐겁게</span><br/>
              여행 계획을 세워보세요
            </h2>
            <p class="section-description">
              Travice와 함께라면 모든 여행이 특별해집니다.<br/>
              당신만의 완벽한 여행 일정을 만들어 드립니다.
            </p>
            <div class="feature-list">
              <div class="feature-item">
                <div class="feature-icon">✓</div>
                <span>AI 기반 맞춤형 여행 추천</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">✓</div>
                <span>간편한 일정 관리와 공유</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">✓</div>
                <span>맞춤형 여행 동행 매칭</span>
              </div>
            </div>
          </div>
          <div class="visual-content">
            <div class="device-mockup">
              <div class="browser-window">
                <div class="browser-header">
                  <div class="browser-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div class="browser-content">
                  <img src="../assets/images/sample2.jpg" alt="여행 계획 화면" class="mockup-image" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 두 번째 섹션 - 기능 소개 -->
      <section class="features-section">
        <div class="content-wrapper reverse">
          <div class="visual-content">
            <div class="device-mockup">
              <div class="monitor-mockup">
                <div class="monitor-screen">
                  <img src="../assets/images/sample2.jpg" alt="AI 추천 화면" class="mockup-image" />
                </div>
                <div class="monitor-stand"></div>
              </div>
            </div>
          </div>
          <div class="text-content">
            <h2 class="section-title">
              <span class="highlight">스마트한 AI</span>가<br/>
              완벽한 여행을 제안합니다
            </h2>
            <p class="section-description">
              복잡한 여행 계획, 이제 AI에게 맡기세요.<br/>
              취향, 성격, MBTI를 모두 고려해 계획을 만들어줍니다.
            </p>
            <div class="stats-grid">
              <div class="stat-item">
                <h3>100%</h3>
                <p>사용자 만족도</p>
              </div>
              <div class="stat-item">
                <h3>50만+</h3>
                <p>추천 여행지</p>
              </div>
              <div class="stat-item">
                <h3>GPT-4o</h3>
                <p>AI Model</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 세 번째 섹션 - 협업 기능 -->
      <section class="collaboration-section">
        <div class="content-wrapper">
          <div class="text-content">
            <h2 class="section-title">
              동행을 구해<br/>
              <span class="highlight">여행을 즐기세요</span>
            </h2>
            <p class="section-description">
              자신의 계획을 공유하고 함께 할 친구를 만들어보세요.<br/>
              마음에 드는 계획에 함께 참여하세요.
            </p>
            <div class="collaboration-features">
              <div class="collab-item">
                <div class="collab-icon">👥</div>
                <div>
                  <h4>동행 구하기</h4>
                  <p>새로운 친구 만들기</p>
                </div>
              </div>
              <div class="collab-item">
                <div class="collab-icon">💬</div>
                <div>
                  <h4>채팅 & 댓글</h4>
                  <p>여행 계획 공유</p>
                </div>
              </div>
              <div class="collab-item">
                <div class="collab-icon">📱</div>
                <div>
                  <h4>모바일 동기화</h4>
                  <p>언제 어디서나 접근</p>
                </div>
              </div>
            </div>
          </div>
          <div class="visual-content">
            <div class="collaboration-visual">
              <div class="floating-card card-1">
                <div class="user-avatar">👤</div>
                <p>이태호님이 제주도 <br> 계획을 올렸습니다.</p>
              </div>
              <div class="floating-card card-2">
                <div class="user-avatar">👤</div>
                <p>홍정인님이 이태호님에게 <br> 댓글을 달았습니다.</p>
              </div>
              <div class="floating-card card-3">
                <div class="user-avatar">👤</div>
                <p>이태호님과 홍정인님의 <br> 동행이 매칭되었습니다.</p>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      <!-- CTA 섹션 -->
      <section class="cta-section">
        <div class="cta-container">
          <div class="cta-content">
            <h2 class="cta-title">지금 바로 시작하세요</h2>
            <p class="cta-description">
              Travice와 함께하는 새로운 여행 경험이 기다리고 있습니다
            </p>
            <div class="cta-buttons">
              <button class="btn-primary">시작하기</button>
              <button class="btn-secondary">둘러보기</button>
            </div>
          </div>
          <div class="cta-visual">
            <div class="floating-elements">
              <div class="float-element element-1">✈️</div>
              <div class="float-element element-2">🗺️</div>
              <div class="float-element element-3">📸</div>
              <div class="float-element element-4">🎒</div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 푸터 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <div class="logo-icon">T</div>
            <span class="logo-text">Travice</span>
          </div>
          <p class="footer-description">
            AI와 함께하는 스마트한 여행 계획 서비스
          </p>
        </div>
        <div class="footer-section">
          <h4>서비스</h4>
          <ul>
            <li><a href="#">여행 계획</a></li>
            <li><a href="#">AI 추천</a></li>
            <li><a href="#">커뮤니티</a></li>
            <li><a href="#">동행 찾기</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>지원</h4>
          <ul>
            <li><a href="#">고객센터</a></li>
            <li><a href="#">사용법</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">문의하기</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>회사</h4>
          <ul>
            <li><a href="#">회사 소개</a></li>
            <li><a href="#">이용약관</a></li>
            <li><a href="#">개인정보처리방침</a></li>
            <li><a href="#">채용</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 Travice. All rights reserved.</p>
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
  height: 100vh;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 10;
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
  font-size: 5rem;
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

/* 메인 콘텐츠 */
.main-content {
  position: relative;
  z-index: 5;
  background: rgba(249, 250, 252, 0.9);
  backdrop-filter: blur(10px);
}

/* 공통 섹션 스타일 */
.intro-section,
.features-section,
.collaboration-section {
  padding: 120px 0;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  gap: 80px;
}

.content-wrapper.reverse {
  flex-direction: row-reverse;
}

.text-content {
  flex: 1;
}

.visual-content {
  flex: 1;
  display: flex;
  justify-content: center;
}

.section-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 32px;
  color: #1a1a1a;
  letter-spacing: -1px;
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

.section-description {
  font-size: 1.25rem;
  line-height: 1.7;
  color: #4a5568;
  margin-bottom: 48px;
  font-family: 'MarinesBold', sans-serif;
}

/* 기능 리스트 */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.feature-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6231cb, #8f5cf6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

/* 통계 그리드 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-top: 48px;
}

.stat-item {
  text-align: center;
}

.stat-item h3 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #6231cb;
  margin-bottom: 8px;
  font-family: 'MarinesBold', sans-serif;
}

.stat-item p {
  color: #6b7280;
  font-weight: 500;
  font-family: 'MarinesBold', sans-serif;
}

/* 협업 기능 */
.collaboration-features {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.collab-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.collab-icon {
  font-size: 2rem;
  background: linear-gradient(135deg, #6231cb, #8f5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.collab-item h4 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a1a1a;
  font-family: 'MarinesBold', sans-serif;
}

.collab-item p {
  color: #6b7280;
  line-height: 1.5;
  font-family: 'MarinesBold', sans-serif;
}

/* 디바이스 모형 */
.device-mockup {
  position: relative;
}

.browser-window {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 480px;
}

.browser-header {
  background: #f8f9fa;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
}

.browser-dots {
  display: flex;
  gap: 8px;
}

.browser-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #dee2e6;
}

.browser-dots span:nth-child(1) { background: #ff5f56; }
.browser-dots span:nth-child(2) { background: #ffbd2e; }
.browser-dots span:nth-child(3) { background: #27ca3f; }

.browser-content {
  height: 320px;
  overflow: hidden;
}

.monitor-mockup {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.monitor-screen {
  background: #1a1a1a;
  border-radius: 8px;
  padding: 8px;
  width: 500px;
  height: 320px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.monitor-stand {
  width: 80px;
  height: 40px;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e0);
  border-radius: 0 0 8px 8px;
  margin-top: -4px;
}

.mockup-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

/* 협업 비주얼 */
.collaboration-visual {
  position: relative;
  width: 480px;
  height: 320px;
}

.floating-card {
  position: absolute;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  max-width: 400px;
  animation: float 3s ease-in-out infinite;
}

.card-1 {
  top: 20px;
  left: 20px;
  animation-delay: 0s;
}

.card-2 {
  top: 100px;
  right: 20px;
  animation-delay: 1s;
}

.card-3 {
  bottom: 40px;
  left: 40px;
  animation-delay: 2s;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.main-screen {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 180px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* CTA 섹션 */
.cta-section {
  background: linear-gradient(135deg, #6231cb 0%, #8f5cf6 100%);
  padding: 120px 0;
  color: white;
  position: relative;
  overflow: hidden;
}

.cta-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
}

.cta-content {
  flex: 1;
}

.cta-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.1;
  font-family: 'MarinesBold', sans-serif;
}

.cta-description {
  font-size: 1.25rem;
  margin-bottom: 48px;
  opacity: 0.9;
  line-height: 1.6;
  font-family: 'MarinesBold', sans-serif;
}

.cta-buttons {
  display: flex;
  gap: 20px;
}

.btn-primary {
  background: rgba(249, 250, 252, 0.95);
  color: #6231cb;
  border: none;
  padding: 16px 32px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  font-family: 'MarinesBold', sans-serif;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.4);
  padding: 16px 32px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  font-family: 'MarinesBold', sans-serif;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.6);
}

.cta-visual {
  flex: 1;
  position: relative;
  height: 300px;
}

.floating-elements {
  position: relative;
  width: 100%;
  height: 100%;
}

.float-element {
  position: absolute;
  font-size: 3rem;
  animation: floatRotate 6s ease-in-out infinite;
}

.element-1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.element-2 {
  top: 60%;
  right: 30%;
  animation-delay: 1.5s;
}

.element-3 {
  bottom: 30%;
  left: 30%;
  animation-delay: 3s;
}

.element-4 {
  top: 10%;
  right: 10%;
  animation-delay: 4.5s;
}

@keyframes floatRotate {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(-10px) rotate(-5deg);
  }
  75% {
    transform: translateY(-15px) rotate(3deg);
  }
}

/* 푸터 */
.footer {
  background: rgba(26, 26, 26, 0.95);
  color: white;
  position: relative;
  z-index: 5;
  backdrop-filter: blur(10px);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 40px 40px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 60px;
}

.footer-section h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: white;
  font-family: 'MarinesBold', sans-serif;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 12px;
}

.footer-section ul li a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.2s;
  font-family: 'MarinesBold', sans-serif;
}

.footer-section ul li a:hover {
  color: #8f5cf6;
}

.footer-description {
  color: #9ca3af;
  line-height: 1.6;
  margin-top: 16px;
  font-family: 'MarinesBold', sans-serif;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding: 24px 40px;
  text-align: center;
  max-width: 1400px;
  margin: 0 auto;
}

.footer-bottom p {
  color: #6b7280;
  font-size: 0.9rem;
  font-family: 'MarinesBold', sans-serif;
}.cta-visual {
  flex: 1;
  position: relative;
  height: 300px;
}

.floating-elements {
  position: relative;
  width: 100%;
  height: 100%;
}

.float-element {
  position: absolute;
  font-size: 3rem;
  animation: floatRotate 6s ease-in-out infinite;
}

.element-1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.element-2 {
  top: 60%;
  right: 30%;
  animation-delay: 1.5s;
}

.element-3 {
  bottom: 30%;
  left: 30%;
  animation-delay: 3s;
}

.element-4 {
  top: 10%;
  right: 10%;
  animation-delay: 4.5s;
}

@keyframes floatRotate {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(-10px) rotate(-5deg);
  }
  75% {
    transform: translateY(-15px) rotate(3deg);
  }
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .header-content,
  .content-wrapper,
  .cta-container,
  .footer-content {
    max-width: 1200px;
    padding-left: 32px;
    padding-right: 32px;
  }
  
  .section-title {
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
  
  .content-wrapper {
    flex-direction: column;
    gap: 60px;
    text-align: center;
  }
  
  .content-wrapper.reverse {
    flex-direction: column;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .hero-title {
    font-size: 3.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  
  .cta-container {
    flex-direction: column;
    text-align: center;
    gap: 60px;
  }
  
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 12px 20px;
  }
  
  .intro-section,
  .features-section,
  .collaboration-section {
    padding: 80px 0;
  }
  
  .content-wrapper {
    padding: 0 20px;
    gap: 40px;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .browser-window {
    width: 100%;
    max-width: 400px;
  }
  
  .monitor-screen {
    width: 100%;
    max-width: 320px;
    height: 200px;
  }
  
  .collaboration-visual {
    width: 100%;
    max-width: 400px;
  }
  
  .cta-title {
    font-size: 2.5rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    gap: 16px;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 576px) {
  .logo-text {
    font-size: 20px;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .section-description {
    font-size: 1.1rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .floating-card {
    font-size: 12px;
    padding: 12px;
    max-width: 160px;
  }
  
  .user-avatar {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  
  .main-screen {
    width: 240px;
    height: 150px;
  }
}

/* 스크롤 애니메이션 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.intro-section,
.features-section,
.collaboration-section {
  animation: fadeInUp 0.8s ease-out;
}

/* 부드러운 스크롤 */
html {
  scroll-behavior: smooth;
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

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .header-content,
  .content-wrapper,
  .cta-container,
  .footer-content {
    max-width: 1200px;
    padding-left: 32px;
    padding-right: 32px;
  }
  
  .section-title {
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
  
  .content-wrapper {
    flex-direction: column;
    gap: 60px;
    text-align: center;
  }
  
  .content-wrapper.reverse {
    flex-direction: column;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .hero-title {
    font-size: 3.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  
  .cta-container {
    flex-direction: column;
    text-align: center;
    gap: 60px;
  }
  
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 12px 20px;
  }
  
  .intro-section,
  .features-section,
  .collaboration-section {
    padding: 80px 0;
  }
  
  .content-wrapper {
    padding: 0 20px;
    gap: 40px;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .browser-window {
    width: 100%;
    max-width: 400px;
  }
  
  .monitor-screen {
    width: 100%;
    max-width: 320px;
    height: 200px;
  }
  
  .collaboration-visual {
    width: 100%;
    max-width: 400px;
  }
  
  .cta-title {
    font-size: 2.5rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    gap: 16px;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 576px) {
  .logo-text {
    font-size: 20px;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .section-description {
    font-size: 1.1rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .floating-card {
    font-size: 12px;
    padding: 12px;
    max-width: 160px;
  }
  
  .user-avatar {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  
  .main-screen {
    width: 240px;
    height: 150px;
  }
}

/* 스크롤 애니메이션 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.intro-section,
.features-section,
.collaboration-section {
  animation: fadeInUp 0.8s ease-out;
}

/* 부드러운 스크롤 */
html {
  scroll-behavior: smooth;
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