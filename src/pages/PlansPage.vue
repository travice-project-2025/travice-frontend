<!-- PlansPage.vue -->
<template>
  <div class="plans-page">
    <AppHeader :is-shrunk="isScrolled" />
    <main class="container main-content">
      <!-- 사용자 환영 메시지 -->
      <div class="welcome-section">
        <h1 class="welcome-title">안녕하세요, <span class="highlight">{{ userName }}</span>님!</h1>
        <p class="welcome-subtitle">여행 계획을 생성하거나 관리해보세요</p>
      </div>
      
      <!-- 여행 계획이 없을 때 - 중앙 배치된 새 여행 추가 블록 -->
      <div v-if="!hasPlans && !isLoading" class="empty-state">
        <div class="empty-card" @click="goToCreate">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="create-text">새 여행</span>
        </div>
        <p class="empty-text">아직 여행 일정이 없습니다. 첫 여행을 계획해보세요!</p>
      </div>
      
      <!-- 여행 계획 목록 (로딩 중 상태) -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>여행 계획을 불러오는 중...</p>
      </div>
      
      <!-- 여행 계획 목록 그리드 -->
      <div v-if="hasPlans && !isLoading" class="plans-grid">
        <!-- 여행 계획 카드들 -->
        <div 
          v-for="plan in plans" 
          :key="plan.id" 
          class="plan-card"
          @click="viewPlanDetails(plan.id)"
        >
          <div class="plan-image">
            <img :src="plan.imageUrl || '/placeholder-image.jpg'" alt="여행 이미지">
          </div>
          <div class="plan-info">
            <h3>{{ plan.title }}</h3>
            <p class="plan-date">{{ plan.startDate }} - {{ plan.endDate }}</p>
          </div>
        </div>
        
        <!-- 새 여행 추가 카드 -->
        <div class="plan-card add-card" @click="goToCreate">
          <div class="add-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="add-text">새로 여행을 추가해보세요</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import { useAuth } from '@/composables/userAuth';

// 인증 관련 컴포저블
const { userName, requireAuth } = useAuth();

// 반응형 상태 정의
const isScrolled = ref(false);
const isLoading = ref(true);
const hasPlans = ref(false);

// 샘플 데이터 (실제로는 API에서 가져올 데이터)
const plans = ref([
  {
    id: 1,
    title: '강릉 2025 2월 1-3',
    startDate: '2025-02-01',
    endDate: '2025-02-03',
    imageUrl: '/images/gangneung.jpg' // 실제 이미지 경로로 대체
  },
  {
    id: 2,
    title: '제주 2025 5월 11-13',
    startDate: '2025-05-11',
    endDate: '2025-05-13',
    imageUrl: '/images/jeju.jpg' // 실제 이미지 경로로 대체
  },
  {
    id: 3,
    title: '부산 2025 7월 21-25',
    startDate: '2025-07-21',
    endDate: '2025-07-25',
    imageUrl: '/images/busan.jpg' // 실제 이미지 경로로 대체
  }
]);

// 라우터 설정
const router = useRouter();

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

// 새 여행 생성 페이지로 이동
const goToCreate = () => {
  router.push('/create-plan'); // 새 여행 생성 페이지 경로로 변경
};

// 여행 상세보기 페이지로 이동
const viewPlanDetails = (planId) => {
  router.push(`/plan/${planId}`); // 상세보기 페이지로 이동
};

// 여행 계획 데이터 가져오기 (API 연결 시 구현)
const fetchPlans = async () => {
  // 실제 구현 시 API 호출로 대체
  // const response = await fetch('/api/plans', { credentials: 'include' });
  // const plansData = await response.json();
  // plans.value = plansData;
  
  // 예시 데이터를 사용하여 시각적 표현
  // plans.value는 이미 위에서 정의됨
  hasPlans.value = plans.value.length > 0;
  
  // API 연동 시 아래와 같이 구현
  // hasPlans.value = plansData.length > 0;
};

// 컴포넌트 마운트 시 이벤트 리스너 등록 및 데이터 로드
onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  
  // 인증 상태 확인 (로그인이 필요한 페이지)
  const isAuthenticated = await requireAuth();
  if (!isAuthenticated) return; // 인증되지 않았으면 requireAuth 내부에서 리다이렉트
  
  // 데모용 코드 (API 연동 전)
  setTimeout(() => {
    isLoading.value = false;
    hasPlans.value = plans.value.length > 0;
  }, 1000); // 로딩 상태 시뮬레이션
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.plans-page {
  padding-top: 60px;
  min-height: 100vh;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.welcome-section {
  margin-bottom: 40px;
  text-align: center;
}

.welcome-title {
  font-size: 28px;
  margin-bottom: 8px;
}

.highlight {
  color: #4a6ee0;
}

.welcome-subtitle {
  font-size: 16px;
  color: #666;
}

/* 여행 계획이 없을 때 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
}

.empty-card {
  width: 180px;
  height: 180px;
  background-color: #4a6ee0;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.empty-card:hover {
  transform: scale(1.05);
}

.create-text {
  color: white;
  font-size: 18px;
  margin-top: 12px;
}

.empty-text {
  font-size: 16px;
  color: #666;
}

/* 로딩 상태 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4a6ee0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 여행 계획 그리드 */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.plan-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.plan-image {
  height: 160px;
  overflow: hidden;
}

.plan-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plan-info {
  padding: 16px;
}

.plan-info h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.plan-date {
  font-size: 14px;
  color: #666;
}

/* 새 여행 추가 카드 */
.add-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f7ff;
  height: 236px; /* 여행 계획 카드와 동일한 높이 */
  border: 2px dashed #d0d8ff;
}

.add-icon {
  background-color: #4a6ee0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.add-text {
  font-size: 16px;
  color: #666;
}
</style>