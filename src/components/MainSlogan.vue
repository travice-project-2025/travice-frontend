<script setup>
// 메인 슬로건 컴포넌트는 특별한 스크립트 로직이 필요 없습니다
</script>

<template>
  <div class="main-slogan-container">
    <h1 class="main-slogan">나의 여행 비서 <span>TRAVICE</span></h1>
  </div>
</template>

<style scoped>
/* 메인 슬로건 스타일 */
.main-slogan-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 9rem 2rem 3rem;
  text-align: center;
  background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(245,238,251,0.3) 100%);
  position: relative;
  z-index: 2;
  box-sizing: border-box;
}

@media (min-width: 1025px) {
  .main-slogan-container {
    max-width: none;
    width: 100%;
    padding-left: 5%;
    padding-right: 5%;
  }
}

.main-slogan {
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: #333;
  text-align: center;
  position: relative;
  letter-spacing: -0.03em;
  text-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.main-slogan span {
  color: #6231cb;
  position: relative;
  font-weight: 900;
  display: inline-block;
  background: linear-gradient(135deg, #6231cb 0%, #9966cc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
}

.main-slogan span::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  height: 8px;
  background-color: rgba(98, 49, 203, 0.2);
  z-index: -1;
  border-radius: 4px;
}

/* 반응형 스타일 */
@media (max-width: 1024px) {
  .main-slogan {
    font-size: 3.5rem;
  }
  
  .main-slogan-container {
    padding: 8rem 2rem 2.5rem;
  }
}

@media (max-width: 768px) {
  .main-slogan {
    font-size: 2.5rem;
  }
  
  .main-slogan-container {
    padding: 7rem 1.5rem 2rem;
  }
  
  .main-slogan span::after {
    height: 5px;
    bottom: 5px;
  }
}
</style>