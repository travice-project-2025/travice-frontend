<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import MainSlogan from '../components/MainSlogan.vue'
import VideoSection from '../components/VideoSection.vue'
import HeroSection from '../components/HeroSection.vue'
import FeatureSection1 from '../components/FeatureSection1.vue'
import FeatureSection2 from '../components/FeatureSection2.vue'
import FeatureSection3 from '../components/FeatureSection3.vue'
import FeatureSection4 from '../components/FeatureSection4.vue'
import CtaSection from '../components/CtaSection.vue'
import FooterSection from '../components/FooterSection.vue'

// 섹션 가시성 상태
const sections = ref([
  { id: 'section1', visible: false },
  { id: 'section2', visible: false },
  { id: 'section3', visible: false },
  { id: 'section4', visible: false },
  { id: 'section5', visible: false }
])

// Intersection Observer 설정
const setupObservers = () => {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // 10% 이상 보이면 감지
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const sectionId = entry.target.id
      const sectionIndex = sections.value.findIndex(section => section.id === sectionId)
      
      if (sectionIndex !== -1) {
        sections.value[sectionIndex].visible = entry.isIntersecting
      }
    })
  }, options)

  // 각 섹션에 observer 등록
  sections.value.forEach(section => {
    const element = document.getElementById(section.id)
    if (element) observer.observe(element)
  })
}

// 라이프사이클 훅
onMounted(() => {
  setupObservers()
})

// 현재 활성화된 섹션 추적을 위한 변수 (기본값 0)
const currentSection = ref(0)
</script>

<template>
  <div class="brand-page">
    <!-- 헤더 컴포넌트 -->
    <HeaderNav />
    
    <!-- 비디오 섹션 컴포넌트 -->
    <VideoSection />

    <!-- 메인 슬로건 컴포넌트 -->
    <MainSlogan />

    <br><br><br><br><br><br><br>

    <!-- 말풍선 및 히어로 섹션 컴포넌트 -->
    <HeroSection />

    <!-- 설명 섹션 컴포넌트들 -->
    <FeatureSection1 
      :visible="sections[0].visible" 
      :isActive="currentSection === 1" 
    />

    <FeatureSection2 
      :visible="sections[1].visible" 
      :isActive="currentSection === 2" 
    />

    <FeatureSection3 
      :visible="sections[2].visible" 
      :isActive="currentSection === 3" 
    />

    <FeatureSection4 
      :visible="sections[3].visible" 
      :isActive="currentSection === 4" 
    />

    <CtaSection 
      :visible="sections[4].visible" 
      :isActive="currentSection === 5" 
    />

    <!-- 푸터 컴포넌트 -->
    <FooterSection />
  </div>
</template>

<style scoped>
/* 기본 스타일 */
.brand-page {
  font-family: 'Pretendard', sans-serif;
  color: #333;
  background-color: #fff;
  overflow-x: hidden;
}
</style>