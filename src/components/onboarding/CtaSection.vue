<script setup>
import { ref, onMounted } from 'vue';

const visible = ref(false);
const isActive = ref(false);
const ctaSection = ref(null);

// 섹션 가시성 감지
onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible.value = entry.isIntersecting;
      isActive.value = entry.isIntersecting;
    },
    { threshold: 0.3 }
  );
  
  if (ctaSection.value) {
    observer.observe(ctaSection.value);
  }
});
</script>

<template>
  <section 
    ref="ctaSection" 
    class="cta-section" 
    :class="{ 'animate-in': visible, 'section-active': isActive }"
  >
    <div class="cta-content">
      <div class="cta-accent"></div>
      <h2 class="cta-title">지금 시작하세요</h2>
      <p class="cta-description">
        TRAVICE와 함께하는 새로운 여행 경험
      </p>
      <button class="cta-button">
        Travice와 함께 시작하기
        <span class="btn-icon">→</span>
      </button>
    </div>
    
    <!-- 배경 요소 -->
    <div class="bg-elements">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>
  </section>
</template>

<style scoped>
/* CTA 섹션 스타일 */
.cta-section {
  position: relative;
  background: linear-gradient(135deg, #f6f3fd 0%, #eee8fc 100%);
  text-align: center;
  padding: 8rem 4rem;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  overflow: hidden;
  scroll-snap-align: start;
  height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cta-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.cta-section.section-active {
  opacity: 1;
  transform: translateY(0);
}

.cta-content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(98, 49, 203, 0.15);
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);
}

.cta-accent {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #6231cb, #8f5cf6);
  border-radius: 2px;
}

.cta-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #333;
  position: relative;
  display: inline-block;
}

.cta-description {
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  color: #666;
  line-height: 1.6;
}

.cta-button {
  background: linear-gradient(135deg, #6231cb 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(98, 49, 203, 0.3);
}

.btn-icon {
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 25px rgba(98, 49, 203, 0.4);
}

.cta-button:hover .btn-icon {
  transform: translateX(5px);
}

/* 배경 요소 */
.bg-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: #6231cb;
  top: -100px;
  right: 10%;
  animation: float 20s infinite alternate ease-in-out;
}

.circle-2 {
  width: 200px;
  height: 200px;
  background: #8b5cf6;
  bottom: -50px;
  left: 10%;
  animation: float 15s infinite alternate-reverse ease-in-out;
}

.circle-3 {
  width: 150px;
  height: 150px;
  background: #6231cb;
  top: 30%;
  left: 5%;
  animation: float 18s infinite alternate ease-in-out;
}

@keyframes float {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(20px, 20px);
  }
}

/* 반응형 스타일 */
@media (max-width: 1024px) {
  .cta-section {
    padding: 4rem 2rem;
  }
  
  .cta-content {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .cta-title {
    font-size: 2.5rem;
  }
  
  .cta-description {
    font-size: 1.1rem;
  }
}
</style>