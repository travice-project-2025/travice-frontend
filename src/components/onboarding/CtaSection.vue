<script setup>

</script>

<template>
  <section id="section5" class="feature-section" :class="{ 'animate-in': visible, 'section-active': isActive }">
    <div class="cta-content">
      <h2 class="cta-title">지금 시작하세요</h2>
      <p class="cta-description">
        TRAVICE와 함께하는 새로운 여행 경험
      </p>
      <button class="cta-button">Travice와 함께 시작하기</button>
    </div>
  </section>
</template>

<style scoped>
/* CTA 섹션 스타일 */
.feature-section {
  background-color: #f6f3fd;
  text-align: center;
  padding: 8rem 4rem;
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

.cta-content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
}

@media (min-width: 1025px) {
  .cta-content {
    max-width: 50%;
  }
}

.cta-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #333;
}

.cta-description {
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  color: #666;
}

.cta-button {
  background-color: #6231cb;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background-color: #4f27a3;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(98, 49, 203, 0.2);
}

/* 반응형 스타일 */
@media (max-width: 1024px) {
  .feature-section {
    padding: 4rem 2rem;
  }
}

@media (max-width: 768px) {
  .cta-title {
    font-size: 2.5rem;
  }
}
</style>