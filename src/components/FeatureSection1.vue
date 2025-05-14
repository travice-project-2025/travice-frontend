<script setup>
// 관찰 상태를 props로 받아옴
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <section id="section1" class="feature-section" :class="{ 'animate-in': visible, 'section-active': isActive }">
    <div class="feature-content left">
      <div class="feature-placeholder">
        <div class="monitor-frame">
          <div class="monitor-screen">
            <img src="/src/assets/sample1.png" alt="Sample 1" class="sample-image" />
          </div>
          <div class="monitor-stand"></div>
        </div>
      </div>
      <div class="feature-text">
        <div class="feature-icon purple-icon">✈️</div>
        <h2 class="feature-title">
          취향대로 검색하기기
        </h2>
        <p class="feature-description">
          내가 원하는 여행지를 세부 필터로 찾아보세요
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 피처 섹션 스타일 */
.feature-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4rem;
  position: relative;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  overflow: hidden;
}

.feature-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* 현재 보고 있는 섹션은 항상 표시 */
.feature-section.section-active {
  opacity: 1;
  transform: translateY(0);
}

/* 섹션 배경 그라데이션 */
.feature-section {
  background-color: #fff;
}

.feature-content {
  display: flex;
  align-items: center;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-content.left {
  flex-direction: row;
}

.feature-placeholder {
  flex: 1;
  display: flex;
  justify-content: center;
}

/* 모니터 프레임 스타일 */
.monitor-frame {
  width: 400px;
  height: 350px;
  position: relative;
  margin-bottom: 20px;
}

.monitor-screen {
  width: 100%;
  height: 280px;
  background-color: #fff;
  border: 10px solid #333;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.monitor-stand {
  width: 80px;
  height: 60px;
  background-color: #333;
  margin: 0 auto;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  position: relative;
}

.monitor-stand:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 20px;
  background-color: #222;
  border-radius: 50%;
}

.sample-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.feature-text {
  flex: 1;
}

.feature-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background-color: #f8f5fe;
  border-radius: 12px;
}

.purple-icon {
  color: #6231cb;
}

.feature-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #333;
}

.feature-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
}

/* 반응형 스타일 */
@media (max-width: 1024px) {
  .feature-section {
    padding: 4rem 2rem;
  }
  
  .feature-content {
    flex-direction: column;
    gap: 3rem;
  }
  
  .feature-content.left {
    flex-direction: column;
  }
  
  .feature-title {
    font-size: 2rem;
  }
  
  .monitor-frame {
    width: 320px;
    height: 280px;
  }
  
  .monitor-screen {
    height: 220px;
  }
}

@media (max-width: 768px) {
  .feature-title {
    font-size: 1.8rem;
  }
  
  .monitor-frame {
    width: 280px;
    height: 250px;
  }
  
  .monitor-screen {
    height: 200px;
  }
}
</style>