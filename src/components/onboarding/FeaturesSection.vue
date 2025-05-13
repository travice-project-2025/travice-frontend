<!-- src/components/onboarding/FeaturesSection.vue -->
<template>
  <section class="features-section">
    <div class="container features-container">
      <div class="features-content">
        <h2>여행지 맞춤 추천부터</h2>
        <h2>스케줄링 까지</h2>
        <h2>트래비스와 함께 여행하다.</h2>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FeaturesSection'
}
</script>

<style scoped>
.features-section {
  /* 헤더(60px) 제외한 뷰포트 전체 높이 */
  min-height: calc(100vh - 60px);
  /* 기본 페이지 배경색과 동일하게 */
  background-color: white;
  /* 위아래 여백 */
  padding: 80px 20px;
  box-sizing: border-box;
  scroll-snap-align: start;
}


.features-content {
  text-align: center;
}

.features-content h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  line-height: 1.4;
}
</style>