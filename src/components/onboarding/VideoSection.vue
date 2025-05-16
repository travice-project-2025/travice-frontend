<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 영상/액자 상태
const videoScale = ref(1) // 1: 원본 크기, 0.5: 50% 축소
const videoTranslateY = ref(0) // 비디오 Y축 이동 (스크롤에 따라 변함)
const frameVisible = ref(false) // 액자가 보이는지 여부
const scrollY = ref(0)
const scrollPercentage = ref(0)

// 스크롤 핸들러
const handleScroll = () => {
  scrollY.value = window.scrollY
  
  // 문서 전체 높이 계산
  const documentHeight = Math.max(
    document.body.scrollHeight, 
    document.body.offsetHeight, 
    document.documentElement.clientHeight, 
    document.documentElement.scrollHeight, 
    document.documentElement.offsetHeight
  ) - window.innerHeight
  
  // 스크롤 퍼센트 계산 (0-100)
  scrollPercentage.value = (scrollY.value / documentHeight) * 100
  
  // 영상 축소 애니메이션 계산 (더 짧은 스크롤 범위에서 애니메이션)
  // 0~80px 스크롤 범위로 줄여 민감도 향상 (기존 0~200px)
  const maxScrollForAnimation = 80 // 기존 200px에서 80px로 줄임
  
  if (scrollY.value < 20) { // 기존 50px에서 20px로 줄임
    // 거의 스크롤하지 않은 상태 - 전체화면 비디오
    videoScale.value = 1
    videoTranslateY.value = 0
    frameVisible.value = false
  } else if (scrollY.value < maxScrollForAnimation) {
    // 스크롤 진행 중 - 비디오 축소 애니메이션
    // 20px에서 80px 사이의 스크롤에 따라 1에서 0.5로 축소 (기존 0.7에서 더 작게)
    const progress = (scrollY.value - 20) / (maxScrollForAnimation - 20)
    videoScale.value = 1 - (0.5 * progress) // 기존 0.3에서 0.5로 변경하여 더 작게 축소
    videoTranslateY.value = progress * 70 // 기존 50px에서 70px로 변경하여 더 위로 이동
    
    // 액자는 50% 이상 축소되었을 때 표시 (기존 75%에서 빠르게 표시)
    frameVisible.value = progress > 0.5
  } else {
    // 충분히 스크롤 - 액자 형태로 전환
    videoScale.value = 0.5 // 기존 0.7에서 0.5로 변경하여 더 작게
    videoTranslateY.value = 70 // 기존 50px에서 70px로 변경하여 더 위로 이동
    frameVisible.value = true
  }
}

// 라이프사이클 훅
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <!-- 전체 화면 비디오와 애니메이션 섹션 -->
  <div class="video-wrapper">
    <div class="video-container" :style="{
      transform: `scale(${videoScale}) translateY(${videoTranslateY}px)`,
      transformOrigin: 'center bottom'
    }">
      <video class="full-video" autoplay loop muted playsinline>
        <source src="/src/assets/travel.mp4" type="video/mp4">
        비디오를 지원하지 않는 브라우저입니다.
      </video>
    </div>
  </div>

  <!-- 메인 서브 슬로건 -->
  <div class="main-subslogan-container">
    <h2 class="marines-text">
      여행지 맞춤 추천부터<br>
      스케줄링 까지<br>
      트래비스와 함께 여행하다
    </h2>
  </div>
</template>

<style scoped>
/* 비디오 래퍼 - 전체 너비를 차지하면서 가운데 정렬 */
.video-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

/* 비디오 컨테이너 스타일 - 16:9 비율 유지 */
.video-container {
  position: relative;
  width: 100%;
  /* 16:9 비율 계산: 높이는 너비의 9/16 (56.25%) */
  padding-top: 56.25%; 
  overflow: hidden;
  transition: transform 0.5s ease-out;
  z-index: 1;
  max-width: 1920px; /* 원본 비디오 너비 */
  max-height: 1080px; /* 원본 비디오 높이 */
}

.full-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

/* MarinesBold 폰트 설정 */
@font-face {
  font-family: 'MarinesBold';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2502-1@1.0/MarinesBold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
}

/* 서브 슬로건 (MarinesBold 텍스트) */
.main-subslogan-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 2rem 1rem;
  text-align: center;
  position: relative;
  z-index: 4;
}

.marines-text {
  font-family: 'MarinesBold', sans-serif;
  font-size: 2.5rem;
  line-height: 1.3;
  color: purple;
  text-align: center;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .marines-text {
    font-size: 2rem;
  }
}

/* 큰 화면에서 비디오 크기 제한 */
@media (min-width: 1921px) {
  .video-container {
    width: 1920px;
    padding-top: 1080px; /* 명시적 높이 */
  }
}
</style>