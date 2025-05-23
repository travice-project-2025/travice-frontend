<!-- components/plan/PlanEditView.vue -->
<template>
  <div class="plan-edit-view">
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

    <!-- 하단 저장 버튼 -->
    <div class="floating-save-bar" v-if="showSaveBar">
      <div class="save-bar-content">
        <p>여행 계획을 편집 중입니다</p>
        <button @click="$emit('save')" class="save-button-large" :disabled="isSaving">
          {{ isSaving ? "저장 중..." : "여행 계획 저장하기" }}
        </button>
      </div>
    </div>

    <!-- 장소 추가 모달 -->
    <AddPlaceModal 
      v-if="showAddPlaceModal"
      v-model:show="showAddPlaceModal"
      v-model:place="newPlace"
      @add="addNewPlace"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DayTab from '@/components/plan/DayTab.vue'
import PlaceList from '@/components/plan/PlaceList.vue'
import PlaceSearch from '@/components/plan/PlaceSearch.vue'
import TripMap from '@/components/plan/TripMap.vue'
import AddPlaceModal from '@/components/plan/AddPlaceModal.vue'

const props = defineProps({
  planData: {
    type: Object,
    required: true
  },
  isSaving: {
    type: Boolean,
    default: false
  },
  showSaveBar: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['save', 'update:planData'])

const activeDay = ref(1)
const showAddPlaceModal = ref(false)
const newPlace = ref({
  planDetailName: '',
  arrivalTime: '12:00',
  departureTime: '13:00',
  memo: '',
  transportName: '자가용',
  latitude: 33.38,
  longitude: 126.54,
  address: ''
})

// 현재 일자에 해당하는 장소들
const filteredPlaces = computed({
  get: () => {
    return props.planData.details
      .filter(detail => detail.day === activeDay.value)
      .sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime))
  },
  set: (newPlaces) => {
    const otherDayPlaces = props.planData.details.filter(
      detail => detail.day !== activeDay.value
    )
    const updatedPlanData = {
      ...props.planData,
      details: [...otherDayPlaces, ...newPlaces]
    }
    emit('update:planData', updatedPlanData)
  }
})

// 장소 삭제
const deletePlaceById = (id) => {
  const updatedDetails = props.planData.details.filter(detail => detail.id !== id)
  emit('update:planData', { ...props.planData, details: updatedDetails })
}

// 새 장소 추가
const addNewPlace = () => {
  if (!newPlace.value.planDetailName.trim()) {
    alert('장소명을 입력해주세요.')
    return
  }

  const newId = Math.max(...props.planData.details.map(d => d.id || 0), 0) + 1
  
  const placeDetail = {
    id: newId,
    planDetailName: newPlace.value.planDetailName,
    day: activeDay.value,
    arrivalTime: newPlace.value.arrivalTime,
    departureTime: newPlace.value.departureTime,
    memo: newPlace.value.memo,
    transportFromPrevious: { name: newPlace.value.transportName },
    latitude: newPlace.value.latitude,
    longitude: newPlace.value.longitude,
    address: newPlace.value.address || ''
  }

  const updatedDetails = [...props.planData.details, placeDetail]
  emit('update:planData', { ...props.planData, details: updatedDetails })

  // 모달 닫기 및 폼 초기화
  showAddPlaceModal.value = false
  resetNewPlace()
}

// 새 장소 폼 초기화
const resetNewPlace = () => {
  newPlace.value = {
    planDetailName: '',
    arrivalTime: '12:00',
    departureTime: '13:00',
    memo: '',
    transportName: '자가용',
    latitude: 33.38,
    longitude: 126.54,
    address: ''
  }
}

// 장소 검색에서 선택했을 때
const handleSelectPlace = (place) => {
  // 마지막 장소의 출발 시간을 기본 도착 시간으로 설정
  let defaultArrivalTime = '10:00'
  let defaultDepartureTime = '11:00'

  const dayPlaces = props.planData.details
    .filter(detail => detail.day === activeDay.value)
    .sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime))

  if (dayPlaces.length > 0) {
    const lastPlace = dayPlaces[dayPlaces.length - 1]
    const [hours, minutes] = lastPlace.departureTime.substring(0, 5).split(':')
    let arrivalHour = parseInt(hours)
    let arrivalMinute = parseInt(minutes) + 30

    if (arrivalMinute >= 60) {
      arrivalHour += 1
      arrivalMinute -= 60
    }
    if (arrivalHour >= 24) {
      arrivalHour -= 24
    }

    defaultArrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`

    // 도착 후 1시간 체류 가정
    let departureHour = arrivalHour
    let departureMinute = arrivalMinute + 60

    if (departureMinute >= 60) {
      departureHour += 1
      departureMinute -= 60
    }
    if (departureHour >= 24) {
      departureHour -= 24
    }

    defaultDepartureTime = `${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}`
  }

  // 새 장소 정보 설정
  newPlace.value = {
    planDetailName: place.planDetailName,
    arrivalTime: defaultArrivalTime,
    departureTime: defaultDepartureTime,
    memo: '',
    transportName: dayPlaces.length > 0 ? '자가용' : '시작점',
    latitude: place.latitude,
    longitude: place.longitude,
    address: place.address || ''
  }

  showAddPlaceModal.value = true
}
</script>

<style scoped>
.plan-edit-view {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px);
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

/* TripMap 컴포넌트가 남은 공간을 차지하도록 */
:deep(.trip-map-container) {
  flex: 1;
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
  max-height: calc(100vh - 15rem);
}

/* 하단 저장 바 */
.floating-save-bar {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.save-bar-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.save-bar-content p {
  margin: 0;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
}

.save-button-large {
  padding: 0.75rem 2rem;
  background-color: #a78bda;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.save-button-large:hover:not(:disabled) {
  background-color: #9979d5;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(167, 139, 218, 0.2);
}

.save-button-large:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .plan-content {
    flex-direction: column;
    padding: 0.5rem;
  }

  .map-section {
    height: 400px;
    order: 2;
  }

  .itinerary-section {
    width: 100%;
    order: 1;
    max-height: 500px;
  }

  .itinerary-body {
    max-height: 400px;
  }

  .save-bar-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .save-button-large {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .plan-content {
    padding: 0.25rem;
    gap: 0.5rem;
  }

  .map-section {
    height: 300px;
  }

  .itinerary-section {
    max-height: 400px;
  }

  .itinerary-body {
    padding: 0.75rem;
    max-height: 300px;
  }

  .save-bar-content {
    padding: 0.75rem;
  }

  .save-button-large {
    padding: 0.625rem 1.5rem;
    font-size: 0.875rem;
  }
}

/* 스크롤바 스타일링 */
.itinerary-body::-webkit-scrollbar {
  width: 6px;
}

.itinerary-body::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.itinerary-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.itinerary-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>