<template>
  <section
    ref="section"
    class="onboarding-section"
    :class="{ visible: isVisible }"
  >
    <!-- 1) 텍스트 박스 -->
    <div :class="['text-box', textAlign]">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>

    <!-- 2) 이미지 -->
    <img
      :src="imageSrc"
      alt=""
      class="section-image"
    />
  </section>
</template>

<script>
export default {
  name: 'OnboardingSection',

  // 3) 부모로부터 받을 데이터(=props)를 정의
  props: {
    title: String,        // <h3>에 들어갈 텍스트
    description: String,  // <p>에 들어갈 설명
    imageSrc: String,     // <img>의 src
    textAlign: {          // 'left' 또는 'right' 중 하나
      type: String,
      default: 'left'
    }
  },

  data() {
    return {
      isVisible: false    // 화면에 섹션이 보이면(true) 애니메이션이 트리거
    };
  },

  mounted() {
    // 4) IntersectionObserver 로 'visible' 토글
    const observer = new IntersectionObserver(
      ([entry]) => {
        this.isVisible = entry.isIntersecting;
      },
      { threshold: 0.3 }
    );
    observer.observe(this.$refs.section);
  }
}
</script>

<style scoped>
/* (A) section 기본셋팅 */
.onboarding-section {
  position: relative;
  min-height: calc(100vh - 60px); /* 헤더 높이(60px) 빼고 화면 전체 */
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 40px;
  box-sizing: border-box;
  height: calc(100vh - 60px);
  scroll-snap-align: start;
} 

/* (B) 텍스트 박스 : 기본은 안 보이고, visible일 때 슬라이드업+페이드인 */
.text-box {
  max-width: 50%;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}
/* 좌/우 정렬을 위한 클래스 */
.text-box.left  { margin-right: auto; }
.text-box.right { margin-left: auto; text-align: right; }

.onboarding-section.visible .text-box {
  opacity: 1;
  transform: translateY(0);
}

/* (C) 이미지 : 시작은 화면 밖(오른쪽 아래), visible일 때 스티키로 고정 + 페이드인 */
.section-image {
  position: absolute;
  bottom: -20%;
  right: -20%;
  width: 300px;
  opacity: 0;
  transform: translate(100%, 100%);
  transition: all 0.8s ease;
}
.onboarding-section.visible .section-image {
  opacity: 1;
  transform: translate(0, 0);
  position: sticky;
  bottom: 20%;
  right: 10%;
}
</style>