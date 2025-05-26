<template>
  <div class="onboarding-page">
    <!-- 비디오 섹션 래퍼 -->
    <div class="video-wrapper" 
         :style="{ 
           transform: `scale(${videoScale})`,
           borderRadius: `${borderRadius}px`
         }">
      <videoSection />
    </div>
    
    <!-- 콘텐츠 섹션 -->
    <div class="content-sections" :style="{ marginTop: contentMargin + 'px' }">
      <!-- 나머지 섹션들 -->
      <OnboardingSection
        v-for="(sec, i) in sections"
        :key="i"
        :title="sec.title"
        :description="sec.description"
        :image-src="sec.image"
        :text-align="sec.align"
      />

      <CtaSection/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import OnboardingSection from '@/components/onboarding/OnboardingSection.vue';
import videoSection from '@/components/onboarding/VideoSection.vue';
import CtaSection from '@/components/onboarding/CtaSection.vue';
import step1Image from '@/assets/images/carrier_img.png';
import step2Image from '@/assets/images/tree_img.png';
import step3Image from '@/assets/images/airplane_img.png';
import step4Image from '@/assets/images/jeju_img.png';

const scrollY = ref(0);
const videoHeight = ref(window.innerHeight); // 초기 비디오 높이

// 스크롤에 따른 비디오 스케일 계산
const videoScale = computed(() => {
  const maxScroll = 300; // 스크롤 300px까지 애니메이션
  const progress = Math.min(scrollY.value / maxScroll, 1);
  return 1 - (progress * 0.3); // 1 → 0.7로 축소
});

// 스크롤에 따른 border-radius 계산
const borderRadius = computed(() => {
  const maxScroll = 300;
  const progress = Math.min(scrollY.value / maxScroll, 1);
  return progress * 40; // 0 → 20px로 둥글게
});

// 콘텐츠 섹션의 마진 계산 (비디오가 축소되면서 공간이 생기는 것을 보정)
const contentMargin = computed(() => {
  const shrinkAmount = (1 - videoScale.value) * videoHeight.value;
  return -shrinkAmount + 50; // 50px 간격 유지
});

const onScroll = () => {
  scrollY.value = window.pageYOffset || document.documentElement.scrollTop;
};

onMounted(() => {
  window.addEventListener('scroll', onScroll);
  // 윈도우 리사이즈 시 비디오 높이 재계산
  const onResize = () => {
    videoHeight.value = window.innerHeight;
  };
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
});

const sections = [
  { title: '취향대로 검색하기', description: '내가 원하는 여행지를 세부 필터로 찾아보세요', image: step1Image, align: 'left' },
  { title: '일정 자동 생성', description: '선택한 여행지로 최적의 일정을 추천해 드립니다', image: step2Image, align: 'right' },
  { title: '친구 초대 및 공유', description: '같이 갈 친구를 초대하고, 일정도 공유해 보세요', image: step3Image, align: 'left' },
  { title: '동행 찾기', description: '함께할 여행 동행을 찾아보세요', image: step4Image, align: 'right' }
];
</script>

<style scoped>
.onboarding-page {
  position: relative;
  min-height: 100vh;
}

.video-wrapper {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  transform-origin: top center;
  transition: transform 0.3s ease-out, border-radius 0.3s ease-out;
  overflow: hidden;
  z-index: 1;
  background: #000; /* 비디오 배경색 */
}

.content-sections {
  position: relative;
  z-index: 2;
  background: white;
  /* 초기에는 비디오 아래에 위치 */
  margin-top: 0;
  transition: margin-top 0.3s ease-out;
}

/* 모바일에서 더 자연스러운 효과를 위한 미디어 쿼리 */
@media (max-width: 768px) {
  .video-wrapper {
    /* 모바일에서는 조금 더 작게 축소 */
    transform-origin: top center;
  }
  
  .content-sections {
    /* 모바일에서 콘텐츠 간격 조정 */
    padding-top: 20px;
  }
}

/* 부드러운 스크롤 효과 */
html {
  scroll-behavior: smooth;
}
</style>