<template>
  <!-- 전체 화면 비디오와 애니메이션 섹션 -->
  <div class="video-section">
    <div class="video-container">
      <video ref="videoRef" class="full-video" autoplay loop muted playsinline>
        <source src="/src/assets/travel.mp4" type="video/mp4">
        비디오를 지원하지 않는 브라우저입니다.
      </video>
      
      <!-- 비디오 오버레이 -->
      <div class="video-overlay">
        <div class="overlay-content">
          <h1 class="headline">여행을 더 특별하게</h1>
          <p class="subheadline">트래비스와 함께 떠나는 당신만의 여정</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// props로 스크롤 위치 값 받기 (필요시에만 사용)
const props = defineProps({
  scrollY: {
    type: Number,
    default: 0
  }
});

const videoRef = ref(null);

// 비디오 로드 확인
onMounted(() => {
  if (videoRef.value) {
    // 비디오 자동 재생 보장
    videoRef.value.play().catch(err => {
      console.warn("비디오 자동 재생을 시작할 수 없습니다:", err);
      
      // 자동 재생 실패 시 사용자 상호작용을 기다린 후 재시도
      document.addEventListener('click', () => {
        videoRef.value.play().catch(e => console.error("클릭 후에도 재생 실패:", e));
      }, { once: true });
    });
  }
});
</script>

<style scoped>
/* 비디오 섹션 */
.video-section {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: #000;
}

/* 비디오 컨테이너 스타일 */
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.full-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 비디오 오버레이 */
.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-content {
  text-align: center;
  color: white;
  padding: 0 20px;
  max-width: 800px;
}

.headline {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.subheadline {
  font-size: 1.5rem;
  font-weight: 400;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* 반응형 스타일 */
@media (max-width: 992px) {
  .headline {
    font-size: 2.8rem;
  }
  
  .subheadline {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .headline {
    font-size: 2.2rem;
  }
  
  .subheadline {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .headline {
    font-size: 1.8rem;
  }
  
  .subheadline {
    font-size: 1rem;
  }
}
</style>