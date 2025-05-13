<template>
  <div class="onboarding-page">
    <AppHeader :is-shrunk="isShrunk" />

    <div class="content" ref="scrollContainer">
      <!-- 1) 첫 스냅: hero 단독 -->
      <div class="snap-unit">
        <HeroSection :is-shrunk="false" :scale="1" />
      </div>

      <!-- 2) 두 번째 스냅: shrink된 hero + features -->
      <div class="snap-unit">
        <HeroSection :is-shrunk="isShrunk" :scale="scale" />
        <FeaturesSection />
      </div>

      <!-- 3+) 나머지 섹션들 -->
      <OnboardingSection
        v-for="(sec, i) in sections"
        :key="i"
        :title="sec.title"
        :description="sec.description"
        :image-src="sec.image"
        :text-align="sec.align"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import HeroSection from '@/components/onboarding/HeroSection.vue';
import FeaturesSection from '@/components/onboarding/FeaturesSection.vue';
import OnboardingSection from '@/components/onboarding/OnboardingSection.vue';

import step1Image from '@/assets/images/carrier_img.png';
import step2Image from '@/assets/images/tree_img.png';
import step3Image from '@/assets/images/airplane_img.png';
import step4Image from '@/assets/images/jeju_img.png';

export default {
  components: { AppHeader, HeroSection, FeaturesSection, OnboardingSection },
  setup() {
    const isShrunk = ref(false);
    const scale = ref(1);
    const scrollContainer = ref(null);

    const onScroll = () => {
      const y = scrollContainer.value.scrollTop
      // 0→300px 사이에만 1→0.7 스케일
      scale.value = y < 100 ? 1
                   : y < 300 ? 1 - ((y-100)/200)*0.3
                   : 0.7
      isShrunk.value = y > 100
    };

    // setup() 내부
    onMounted(() => {
        if (scrollContainer.value) {
        scrollContainer.value.addEventListener('scroll', onScroll)
        }
    })
    onUnmounted(() => {
        if (scrollContainer.value) {
        scrollContainer.value.removeEventListener('scroll', onScroll)
        }
    })

    const sections = [
      { title: '취향대로 검색하기', description: '내가 원하는 여행지를 세부 필터로 찾아보세요', image: step1Image, align: 'left' },
      { title: '일정 자동 생성',     description: '선택한 여행지로 최적의 일정을 추천해 드립니다', image: step2Image, align: 'right' },
      { title: '친구 초대 및 공유', description: '같이 갈 친구를 초대하고, 일정도 공유해 보세요', image: step3Image, align: 'left' },
      { title: '동행 찾기',         description: '함께할 여행 동행을 찾아보세요', image: step4Image, align: 'right' }
    ];

    return { isShrunk, scale, scrollContainer, sections };
  }
};
</script>

<style scoped>
.content {
  height: calc(100vh - 60px);  /* 헤더(60px) 제외한 뷰포트 */
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

/* 한 화면에 Hero + Features 묶음 */
.snap-unit {
  scroll-snap-align: start;
  height: calc(100vh - 60px);
  /*overflow: hidden;          /* 축소된 뒤 나머지는 잘라서 안 보이게 */
  overflow: visible;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 축소된 HeroSection 아래에 피처 텍스트 뜨도록 */
.below-hero {
  /* Hero가 (100vh-60px)*0.7 높이만차지하고 나머지 공간 남겨둡니다 */
  margin-top: calc( (100vh - 60px) - ((100vh - 60px) * 0.7) + 20px );
}
</style>