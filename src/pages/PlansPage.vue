<template>
  <div class="plans-page">
    <AppHeader :is-shrunk="isScrolled" />
    <main class="container main-content">
      <!-- 사용자 환영 메시지 -->
      <div class="welcome-section">
        <h1 class="welcome-title">안녕하세요, <span class="highlight">{{ userNickname ? userNickname : userName }}</span>님!</h1>
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
            <img :src="plan.thumbnail || '/placeholder-image.jpg'" alt="여행 이미지">
          </div>
          <div class="plan-info">
            <h3>{{ plan.planTitle }}</h3>
            <p class="plan-date">{{ formatDate(plan.startDate) }} - {{ formatDate(plan.endDate) }}</p>
            <p class="plan-location">{{ getCityName(plan.cityName) }}</p>
            <div class="plan-meta">
              <span class="member-count">인원: {{ plan.memberCount }}명</span>
              <span class="visibility-badge" :class="{ 'private': !plan.isPublic }">
                {{ plan.isPublic ? '공개' : '비공개' }}
              </span>
            </div>
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
      
      <!-- 오류 메시지 -->
      <div v-if="apiError" class="error-message">
        <p>{{ apiErrorMessage }}</p>
        <button @click="fetchPlans" class="retry-button">다시 시도</button>
      </div>

      
      <!-- 새로 추가: 프로필 설정 안내 모달 -->
      <div v-if="showProfileModal" class="modal-overlay">
        <div class="profile-modal">
          <div class="modal-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#8e6ad9" stroke-width="2"/>
              <path d="M12 16V12" stroke="#8e6ad9" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="8" r="1" fill="#8e6ad9"/>
            </svg>
          </div>
          <h3 class="modal-title">개인 정보를 설정하시겠어요?</h3>
          <div class="modal-description">
            나이와 성별을 설정하시면<br>
            더 정확한 AI 맞춤 여행 추천을 받으실 수 있습니다.
          </div>
          <div class="modal-buttons">
            <button class="modal-button secondary" @click="continueToCreate">
              다음에 설정하기
            </button>
            <button class="modal-button primary" @click="goToProfile">
              개인 정보 설정하기
            </button>
          </div>
        </div>
      </div>



    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import { useAuth } from '../composables/userAuth';
import axios from 'axios';

// 새로 추가: 모달 상태 관리
const showProfileModal = ref(false);
const userAge = ref(null);


// 새로 추가: 사용자 정보 가져오기
const fetchUserInfo = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/users/me', {
      withCredentials: true,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.data) {
      userAge.value = response.data.age || 0;
      console.log('사용자 나이:', userAge.value);
    }
  } catch (error) {
    console.error('사용자 정보를 불러오는 중 오류 발생:', error);
  }
};



// 새 여행 생성 페이지로 이동 (기존 함수 수정)
const goToCreate = async () => {
  // 사용자 나이가 설정되지 않았다면 모달 표시
  if (userAge.value === 0) {
    showProfileModal.value = true;
  } else {
    // 바로 생성 페이지로 이동
    router.push('/create-plan');
  }
};

// 새로 추가: 계속해서 생성 페이지로 이동
const continueToCreate = () => {
  showProfileModal.value = false;
  router.push('/create-plan');
};

// 새로 추가: 프로필 페이지로 이동
const goToProfile = () => {
  showProfileModal.value = false;
  router.push('/profile');
};

// 컴포넌트 마운트 시 초기화 (기존 함수 수정)
onMounted(() => {
  console.log('컴포넌트 마운트됨');
  window.addEventListener('scroll', handleScroll);
  checkLoginStatus();
  fetchPlans();
  fetchUserInfo(); // 사용자 정보 가져오기 추가
});


// 인증 컴포저블 사용
const { loggedIn, userName, userNickname, checkLoginStatus, logout, goToLogin } = useAuth()

// 반응형 상태 정의
const isScrolled = ref(false);
const isLoading = ref(true);
const hasPlans = ref(false);
const plans = ref([]);
const apiError = ref(false);
const apiErrorMessage = ref('');

// API URL - 개발용 공개 API로 변경
const API_URL = 'http://localhost:8080/api/v1/plans';

// 날짜 형식 변환 함수
const formatDate = (dateString) => {
  if (!dateString) return '날짜 미정';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '날짜 형식 오류';
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit'
    });
  } catch (error) {
    console.error('날짜 변환 오류:', error);
    return '날짜 형식 오류';
  }
};

const getCityName = (cityId) => {
  const cityMap = {
    1: '서울',
    2: '부산',
    3: '제주',
    // 더 많은 도시 추가
  };
  return cityMap[cityId] || '알 수 없는 지역';
};

// 라우터 설정
const router = useRouter();

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};


// 여행 상세보기 페이지로 이동
const viewPlanDetails = (planId) => {
  router.push(`/plan/${planId}`);
};

// 여행 계획 데이터 가져오기
const fetchPlans = async () => {
  console.log('여행 계획 가져오기 시작');
  isLoading.value = true;
  apiError.value = false;
  
  try {
    const response = await axios.get(API_URL, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API 응답 받음:', response);
    
    // 데이터 받아오기 성공
    if (response.data && Array.isArray(response.data)) {
      plans.value = response.data;
      hasPlans.value = plans.value.length > 0;
      console.log('받아온 여행 계획 데이터:', plans.value);
    } else {
      console.warn('API 응답이 배열이 아닙니다:', response.data);
      throw new Error('잘못된 데이터 형식');
    }
  } catch (error) {
    console.error('여행 계획을 불러오는 중 오류 발생:', error);
    apiError.value = true;
    apiErrorMessage.value = '데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.';

    if (error.response.status === 401) {
        apiErrorMessage.value = '인증이 필요합니다. 다시 로그인해주세요.';
      }

  } finally {
    isLoading.value = false;
  }
};

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  console.log('컴포넌트 마운트됨');
  window.addEventListener('scroll', handleScroll);
  checkLoginStatus()
  fetchPlans();
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>


<style scoped>
/* 기존 스타일 유지하고 추가 */
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
  color: #8e6ad9;
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
  background-color: #8e6ad9;
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
  border-top: 4px solid #8e6ad9;
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
  box-shadow: 0 8px 20px rgba(142, 106, 217, 0.15);
}

.plan-image {
  height: 200px;
  overflow: hidden;
}

.plan-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plan-info {
  padding: 20px;
}

.plan-info h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.plan-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.plan-location {
  font-size: 14px;
  color: #8e6ad9;
  margin-bottom: 8px;
}

.plan-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  font-size: 13px;
}

.member-count {
  color: #666;
}

.visibility-badge {
  background-color: #a5f3c0;
  color: #0d5030;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.visibility-badge.private {
  background-color: #ffe0e0;
  color: #b42424;
}

/* 새 여행 추가 카드 */
.add-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f7f2ff;
  height: 276px; /* 여행 계획 카드와 동일한 높이 */
  border: 2px dashed #a78bfa;
}

.add-icon {
  background-color: #8e6ad9;
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
  color: #4b5563;
}


/* 모달 스타일 추가 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.profile-modal {
  background-color: white;
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: modal-appear 0.3s ease;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-icon {
  margin-bottom: 20px;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
}

.modal-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 25px;
  line-height: 1.5;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.modal-button {
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.modal-button.primary {
  background-color: #8e6ad9;
  color: white;
}

.modal-button.primary:hover {
  background-color: #7c59c5;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(142, 106, 217, 0.15);
}

.modal-button.secondary {
  background-color: #f0ebfa;
  color: #8e6ad9;
}

.modal-button.secondary:hover {
  background-color: #e4daff;
  transform: translateY(-2px);
}
</style>