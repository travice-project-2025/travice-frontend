<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 스크롤 위치 추적
const scrollY = ref(0)
const scrollPercentage = ref(0)
const heroStage = ref(0) // 0: 보이지 않음, 1: charactor0, 2: charactor1, 3: charactor2, 4: charactor3 (액자)

// 섹션 가시성 추적
const sectionVisible = ref(false)
const sectionOffset = ref(0)

// 스크롤 핸들러
const handleScroll = () => {
  scrollY.value = window.scrollY
  
  // 섹션 위치 계산 (섹션이 화면에 보이기 시작하는 위치에서 조금 위)
  const sectionTop = sectionOffset.value - window.innerHeight * 0.3
  
  // 히어로 섹션이 화면에 충분히 표시되기 전에는 캐릭터를 표시하지 않음
  if (scrollY.value < sectionTop) {
    heroStage.value = 0 // 보이지 않음
    return
  }
  
  // 섹션 내부에서의 상대적 스크롤 위치 계산
  const relativeScroll = scrollY.value - sectionTop
  
  // 캐릭터 단계 전환을 위한 스크롤 임계값
  // 더 작은 간격으로 설정하여 2배 더 민감하게 반응
  const threshold1 = 25   // charactor0 시작 (기존 50에서 절반으로)
  const threshold2 = 60   // charactor1 시작 (기존 120에서 절반으로)
  const threshold3 = 100  // charactor2 시작 (기존 200에서 절반으로)
  const threshold4 = 140  // charactor3 (액자) 시작 (기존 280에서 절반으로)
  
  // 히어로 단계 결정
  if (relativeScroll < threshold1) {
    heroStage.value = 0 // 아직 보이지 않음
  } else if (relativeScroll < threshold2) {
    heroStage.value = 1 // charactor0.png
  } else if (relativeScroll < threshold3) {
    heroStage.value = 2 // charactor1.png
  } else if (relativeScroll < threshold4) {
    heroStage.value = 3 // charactor2.png
  } else {
    heroStage.value = 4 // charactor3.png (액자)
  }
}

// 섹션 위치 초기화 함수
const initSectionPosition = () => {
  const heroSection = document.querySelector('.hero-section')
  if (heroSection) {
    // 히어로 섹션의 문서 상단에서부터의 거리 측정
    sectionOffset.value = heroSection.getBoundingClientRect().top + window.scrollY
    // 초기 스크롤 위치에 따라 히어로 단계 설정
    handleScroll()
  }
}

// 라이프사이클 훅
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 컴포넌트가 마운트된 후 섹션 위치 초기화
  // DOM이 완전히 렌더링된 후 위치 계산을 위해 setTimeout 사용
  setTimeout(() => {
    initSectionPosition()
  }, 100)
  
  // 창 크기가 변경될 때마다 섹션 위치 다시 계산
  window.addEventListener('resize', initSectionPosition)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', initSectionPosition)
})
</script>

<template>
  <!-- 말풍선 -->
  <div class="speech-bubble-container" v-if="heroStage > 0">
    <div class="speech-bubble">
      지금 보고 있는 너!
    </div>
  </div>

  <div class="scroll-indicator" v-if="heroStage > 0">스크롤을 내려보세요 ↓</div>
  
  <!-- 히어로 섹션 - 스크롤에 따라 이미지가 변경됨 -->
  <section class="hero-section">
    <!-- 첫 번째 상태 (charactor0) -->
    <div class="hero-stage" v-if="heroStage === 1">
      <div class="character-container">
        <img src="/src/assets/charactor0.png" alt="Character 0" class="character-image" />
      </div>
    </div>
    
    <!-- 두 번째 상태 (charactor1) -->
    <div class="hero-stage" v-else-if="heroStage === 2">
      <div class="character-container">
        <img src="/src/assets/charactor1.png" alt="Character 1" class="character-image" />
      </div>
    </div>
    
    <!-- 세 번째 상태 (charactor2) -->
    <div class="hero-stage" v-else-if="heroStage === 3">
      <div class="character-container">
        <img src="/src/assets/charactor2.png" alt="Character 2" class="character-image" />
      </div>
    </div>
    
    <!-- 네 번째 상태 (charactor3, 액자) -->
    <div class="hero-framed" v-else-if="heroStage === 4">
      <div class="framed-content">
        <div class="framed-container">
          <img src="/src/assets/charactor3.png" alt="Character 3" class="framed-image" />
        </div>
        <div class="framed-title satoori-text">
          마! 내랑 여행가자!
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 말풍선 스타일 */
.speech-bubble-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 2rem 2rem;
  position: relative;
  z-index: 3;
  margin-top: -70px;
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.speech-bubble {
  background-color: #f5f0ff;
  color: #6231cb;
  font-size: 1.8rem;
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 30px;
  position: relative;
  display: inline-block;
  box-shadow: 0 6px 15px rgba(98, 49, 203, 0.15);
  animation: float 3s ease-in-out infinite;
  text-align: center;
  max-width: 300px;
  z-index: 10;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 15px solid #f5f0ff;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 히어로 섹션 스타일 */
.hero-section {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 3rem 0;
  margin-top: -3rem; /* 캐릭터를 말풍선 가까이 배치 */
  min-height: 500px; /* 최소 높이 설정 */
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
  animation: bounce 2s infinite;
  z-index: 5;
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards, bounce 2s infinite 0.5s;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-10px) translateX(-50%);
  }
  60% {
    transform: translateY(-5px) translateX(-50%);
  }
}

.hero-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50vh;
  padding: 0 4rem;
  text-align: center;
  transition: opacity 0.8s ease;
  animation: fadeIn 0.5s ease-in-out;
}

.character-container {
  width: 100%;
  max-width: 500px;
  height: 400px;
  position: relative;
  background-color: #f8f5fe;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  box-shadow: 0 15px 30px rgba(98, 49, 203, 0.1);
}

.character-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

/* 프레임 모드 히어로 스타일 */
.hero-framed {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 4rem 2rem;
  animation: fadeIn 0.8s ease-in-out;
  transition: opacity 0.5s ease;
  position: relative;
  z-index: 4;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.framed-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.framed-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
  font-family: 'Pretendard', sans-serif;
}

.framed-container {
  width: 90%;
  max-width: 800px;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 10px solid white;
  background-color: #f8f5fe;
  transition: transform 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.framed-container:hover {
  transform: scale(1.02);
}

.framed-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

/* 반응형 스타일 */
@media (max-width: 1024px) {
  .speech-bubble {
    font-size: 1.5rem;
    padding: 0.8rem 1.5rem;
  }
  
  .hero-framed {
    padding: 5rem 2rem 1rem;
  }
}

@media (max-width: 768px) {
  .speech-bubble {
    font-size: 1.2rem;
    padding: 0.7rem 1.2rem;
    max-width: 250px;
  }
  
  .speech-bubble::after {
    bottom: -10px;
    border-left-width: 10px;
    border-right-width: 10px;
    border-top-width: 10px;
  }
  
  .hero-stage {
    height: 40vh;
    padding: 0 2rem;
  }
  
  .character-container {
    height: 300px;
  }
}
</style>