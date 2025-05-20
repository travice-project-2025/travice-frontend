<!-- pages/PlanCreatePage.vue -->
<template>
  <div class="plan-create-page">
    <AppHeader
      :title="getHeaderTitle()"
      :subtitle="getHeaderSubtitle()"
    >
      <template #actions>
        <div class="header-actions" v-if="step === 'edit'">
          <button 
            @click="savePlan" 
            class="save-button"
            :disabled="isSaving"
          >
            {{ isSaving ? '저장 중...' : '여행 계획 저장' }}
          </button>
        </div>
      </template>
    </AppHeader>

    <!-- 1단계: 여행 정보 입력 -->
    <div v-if="step === 'input'" class="step-container">
      <TravelInfoForm
        v-model="travelInfo"
        @submit="getRecommendation"
      />
    </div>

    <!-- 2단계: 추천 결과 표시 -->
    <div v-else-if="step === 'recommendation'" class="step-container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>여행 계획을 추천하는 중입니다...</p>
      </div>
      
      <div v-else class="recommendation-result">
        <div v-for="day in recommendationData.days" :key="day.day" class="day-plan">
          <h3 class="day-title">Day {{ day.day }}</h3>
          
          <div v-for="(place, placeIndex) in day.places" :key="placeIndex" class="place-card">
            <div class="place-header">
              <h4 class="place-name">{{ place.name }}</h4>
              <span class="place-time">{{ place.arrival }} - {{ place.departure }}</span>
            </div>
            <p class="place-activity">{{ place.activity }}</p>
            
            <!-- 다음 장소로 이동하는 교통편 표시 (마지막 장소가 아닌 경우) -->
            <div v-if="placeIndex < day.transports.length" class="transport-info">
              <div class="transport-icon">{{ getTransportEmoji(day.transports[placeIndex].type) }}</div>
              <span class="transport-type">{{ day.transports[placeIndex].type }}</span>
              <span class="transport-duration">{{ day.transports[placeIndex].duration }}</span>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button @click="step = 'input'" class="back-button">
            이전으로
          </button>
          <button @click="convertToEditablePlan" class="proceed-button">
            이 계획으로 진행하기
          </button>
          <button @click="getRecommendation" class="regenerate-button">
            다시 추천받기
          </button>
        </div>
      </div>
    </div>

    <!-- 3단계: 상세 편집 (PlanDetailPage 기능 통합) -->
    <div v-else-if="step === 'edit'" class="step-container">
      <div class="plan-content">
        <!-- 왼쪽: 지도 영역 -->
        <div class="map-section">
          <div class="map-search-container">
            <PlaceSearch @select-place="handleSelectPlace" />
          </div>
          <TripMap :places="filteredPlaces" />
        </div>

        <!-- 오른쪽: 일정 영역 -->
        <div class="itinerary-section">
          <div class="itinerary-header">
            <DayTab v-model="activeDay" :total-days="planData.totalDays" />
          </div>

          <div class="itinerary-body">
            <PlaceList
              v-model:places="filteredPlaces"
              @delete-place="deletePlaceById"
              @add-place="showAddPlaceModal = true"
            />
          </div>
        </div>
      </div>

      <!-- 하단 저장 버튼 (모바일 환경 고려) -->
      <div class="floating-save-bar">
        <div class="save-bar-content">
          <p>여행 계획을 편집 중입니다</p>
          <button @click="savePlan" class="save-button-large" :disabled="isSaving">
            {{ isSaving ? '저장 중...' : '여행 계획 저장하기' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 장소 추가 모달 (편집 단계에서 사용) -->
    <div
      v-if="showAddPlaceModal"
      class="modal-overlay"
      @click.self="showAddPlaceModal = false"
    >
      <!-- 모달 내용 (PlanDetailPage의 모달과 동일) -->
      <div class="modal-content">
        <!-- ... 모달 내용 ... -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import TravelInfoForm from '@/components/plan/TravelInfoForm.vue';
import DayTab from '@/components/plan/DayTab.vue';
import PlaceList from '@/components/plan/PlaceList.vue';
import PlaceSearch from '@/components/plan/PlaceSearch.vue';
import TripMap from '@/components/plan/TripMap.vue';

export default {
  name: 'PlanCreatePage',
  components: {
    AppHeader,
    TravelInfoForm,
    DayTab,
    PlaceList,
    PlaceSearch,
    TripMap
  },
  setup() {
    const router = useRouter();
    
    // 단계 관리 (input → recommendation → edit)
    const step = ref('input');
    const loading = ref(false);
    const isSaving = ref(false);
    
    // 여행 정보 입력 데이터
    const travelInfo = ref({
      duration: 3,
      people: 2,
      purpose: '휴식',
      region: '제주도',
      transports: ['자가용', '도보'],
      concept: '힐링',
      mbti: 'INFP'
    });
    
    // GPT 추천 결과 데이터
    const recommendationData = ref(null);
    
    // 편집 가능한 여행 계획 데이터 (PlanDetailPage에서 가져온 구조)
    const planData = ref({
      id: null,
      title: '',
      startDate: '',
      endDate: '',
      totalDays: 3,
      details: []
    });
    
    // 현재 선택된 일자 (편집 단계에서 사용)
    const activeDay = ref(1);
    
    // 현재 일자에 해당하는 장소들 (편집 단계에서 사용)
    const filteredPlaces = computed({
      get: () => {
        return planData.value.details
          .filter((detail) => detail.day === activeDay.value)
          .sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime));
      },
      set: (newPlaces) => {
        const otherDayPlaces = planData.value.details.filter(
          (detail) => detail.day !== activeDay.value
        );
        planData.value.details = [...otherDayPlaces, ...newPlaces];
      },
    });
    
    // 장소 추가 모달 관련 상태
    const showAddPlaceModal = ref(false);
    const newPlace = ref({
      planDetailName: '',
      arrivalTime: '12:00',
      departureTime: '13:00',
      memo: '',
      transportName: '자가용',
      latitude: 33.38,
      longitude: 126.54,
    });
    
    // 페이지 제목 계산
    const getHeaderTitle = () => {
      switch(step.value) {
        case 'input': return '새 여행 계획 만들기';
        case 'recommendation': return '추천 여행 계획';
        case 'edit': return planData.value.title;
        default: return '여행 계획';
      }
    };
    
    // 페이지 부제목 계산
    const getHeaderSubtitle = () => {
      if (step.value === 'edit') {
        return formatDateRange(planData.value.startDate, planData.value.endDate);
      }
      return '';
    };
    
    // GPT 추천 요청
    const getRecommendation = async () => {
      loading.value = true;
      step.value = 'recommendation';
      
      try {
        const response = await fetch('/api/v1/plans/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            summary: travelInfo.value
          })
        });
        
        if (!response.ok) {
          throw new Error('추천 요청에 실패했습니다.');
        }
        
        recommendationData.value = await response.json();
      } catch (error) {
        console.error('추천 요청 오류:', error);
        alert('여행 계획 추천을 가져오는 중 오류가 발생했습니다.');
        step.value = 'input';
      } finally {
        loading.value = false;
      }
    };
    
    // 추천 결과를 편집 가능한 계획으로 변환
    const convertToEditablePlan = () => {
      // 추천 데이터가 없는 경우 처리
      if (!recommendationData.value || !recommendationData.value.days) {
        alert('추천 데이터가 없습니다.');
        return;
      }
      
      // 계획 기본 정보 설정
      planData.value = {
        id: null, // 새 계획이므로 ID는 null
        title: `${travelInfo.value.region} ${travelInfo.value.duration}일 여행`,
        startDate: calculateStartDate(),
        endDate: calculateEndDate(),
        totalDays: travelInfo.value.duration,
        details: []
      };
      
      // 추천 데이터를 상세 계획으로 변환
      let detailId = 1;
      
      recommendationData.value.days.forEach(day => {
        day.places.forEach((place, index) => {
          // 장소 정보 생성
          const placeDetail = {
            id: detailId++,
            planDetailName: place.name,
            day: day.day,
            arrivalTime: place.arrival + ':00', // HH:MM -> HH:MM:SS 형식으로 맞춤
            departureTime: place.departure + ':00',
            memo: place.activity,
            // 첫 번째 장소가 아닌 경우에만 이전 장소에서의 이동수단 정보 추가
            transportFromPrevious: index > 0 && day.transports && day.transports[index-1] ? 
              { name: day.transports[index-1].type } : 
              { name: '시작점' },
            // 위도, 경도는 임의로 설정 (실제로는 장소 검색 API로부터 받아와야 함)
            latitude: 33.38 + Math.random() * 0.3,  
            longitude: 126.5 + Math.random() * 0.5
          };
          
          planData.value.details.push(placeDetail);
        });
      });
      
      // 편집 단계로 이동
      step.value = 'edit';
      activeDay.value = 1; // 첫 번째 날짜 활성화
    };
    
    // 시작일 계산 (기본: 오늘로부터 1주일 후)
    const calculateStartDate = () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);
      return startDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    };
    
    // 종료일 계산 (시작일 + 기간 - 1)
    const calculateEndDate = () => {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7 + travelInfo.value.duration - 1);
      return endDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    };
    
    // 날짜 범위 포맷팅
    const formatDateRange = (startDate, endDate) => {
      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return `${date.getFullYear()}년 ${
          date.getMonth() + 1
        }월 ${date.getDate()}일`;
      };

      return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
    };
    
    // 이동수단 이모지 반환
    const getTransportEmoji = (transportType) => {
      const emojiMap = {
        '자가용': '🚗',
        '택시': '🚕',
        '자전거': '🚲',
        '도보': '🚶',
        '항공': '✈️',
        '버스': '🚌',
        '지하철': '🚃',
        '기차': '🚊'
      };
      
      return emojiMap[transportType] || '🚗';
    };
    
    // 장소 삭제 메서드 (편집 단계에서 사용)
    const deletePlaceById = (id) => {
      planData.value.details = planData.value.details.filter(
        (detail) => detail.id !== id
      );
    };
    
    // 장소 추가 메서드 (편집 단계에서 사용)
    const addNewPlace = () => {
      const newId = Math.max(...planData.value.details.map((d) => d.id), 0) + 1;

      planData.value.details.push({
        id: newId,
        planDetailName: newPlace.value.planDetailName,
        day: activeDay.value,
        arrivalTime: newPlace.value.arrivalTime,
        departureTime: newPlace.value.departureTime,
        memo: newPlace.value.memo,
        transportFromPrevious: { name: newPlace.value.transportName },
        latitude: newPlace.value.latitude,
        longitude: newPlace.value.longitude,
      });

      // 모달 닫기 및 폼 초기화
      showAddPlaceModal.value = false;
      newPlace.value = {
        planDetailName: '',
        arrivalTime: '12:00',
        departureTime: '13:00',
        memo: '',
        transportName: '자가용',
        latitude: 33.38,
        longitude: 126.54,
      };
    };
    
    // 검색에서 장소 선택 처리 (편집 단계에서 사용)
    const handleSelectPlace = (place) => {
      newPlace.value = {
        ...newPlace.value,
        planDetailName: place.planDetailName,
        latitude: place.latitude,
        longitude: place.longitude,
      };

      showAddPlaceModal.value = true;
    };
    
    // 여행 계획 저장
    const savePlan = async () => {
      isSaving.value = true;
      
      try {
        // API 메서드 결정 (신규 생성 또는 업데이트)
        const method = planData.value.id ? 'PUT' : 'POST';
        const url = planData.value.id 
          ? `/api/v1/plans/${planData.value.id}`
          : '/api/v1/plans';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(planData.value)
        });
        
        if (!response.ok) {
          throw new Error('여행 계획 저장에 실패했습니다.');
        }
        
        const savedPlan = await response.json();
        
        // 성공 메시지
        alert('여행 계획이 성공적으로 저장되었습니다.');
        
        // 저장 후 계획 목록 페이지로 이동
        router.push('/plans');
      } catch (error) {
        console.error('여행 계획 저장 오류:', error);
        alert('여행 계획을 저장하는 중 오류가 발생했습니다.');
      } finally {
        isSaving.value = false;
      }
    };
    
    return {
      step,
      loading,
      isSaving,
      travelInfo,
      recommendationData,
      planData,
      activeDay,
      filteredPlaces,
      showAddPlaceModal,
      newPlace,
      getHeaderTitle,
      getHeaderSubtitle,
      getRecommendation,
      convertToEditablePlan,
      formatDateRange,
      getTransportEmoji,
      deletePlaceById,
      addNewPlace,
      handleSelectPlace,
      savePlan
    };
  }
}
</script>


<style scoped>
.plan-detail-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9fafb;
}

.plan-content {
  display: flex;
  flex: 1;
  padding: 1rem;
  gap: 1rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.map-section {
  flex: 1;
  height: calc(100vh - 10rem);
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.itinerary-section {
  width: 500px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.itinerary-header {
  border-bottom: 1px solid #e5e7eb;
}

.itinerary-body {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

/* 모달 스타일 */
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
  z-index: 50;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  font-family: "Marines", "Pretendard", sans-serif;
}

.modal-close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close-button:hover {
  background-color: #f3f4f6;
  color: #6b7280;
}

.modal-body {
  padding: 1.5rem;
}

/* 폼 스타일 */
.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #8e6ad9;
  box-shadow: 0 0 0 3px rgba(142, 106, 217, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background-color: #e5e7eb;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #a78bda;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover {
  background-color: #9979d5;
}

/* PlanDetailPage.vue - 지도 위 검색바 관련 CSS 추가 */
.map-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 10rem);
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.map-search-container {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

/* TripMap 컴포넌트는 이제 flex-grow: 1로 설정하여 남은 공간을 차지하도록 수정 */
:deep(.trip-map-container) {
  flex: 1;
}

/* 반응형 스타일 */
@media (max-width: 1024px) {
  .plan-content {
    flex-direction: column;
  }

  .map-section {
    height: 400px;
  }

  .itinerary-section {
    width: 100%;
  }
}
</style>