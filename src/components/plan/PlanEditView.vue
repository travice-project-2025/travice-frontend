<!-- components/plan/PlanEditView.vue -->
<template>
  <div class="plan-edit-view">
    <div class="plan-content">
      <!-- 왼쪽: 지도 영역 -->
      <div class="map-section">
        <div class="map-search-container">
          <PlaceSearch @select-place="handleSelectPlace" />
        </div>
        <TripMap 
          :places="currentDayPlaces"
          :selected-place-id="selectedPlaceId"
          @marker-click="handleMarkerClick" 
        />
      </div>

      <!-- 오른쪽: 일정 영역 -->
      <div class="itinerary-section">
        <div class="itinerary-header">
          <DayTab v-model="activeDay" :total-days="calculateTotalDays" />
        </div>

        <div class="itinerary-body">
          <PlaceList
            :places="currentDayPlaces"
            @update:places="updateCurrentDayPlaces"
            @delete-place="deletePlaceById"
            @add-place="showAddPlaceModal = true"
            @place-click="handlePlaceClick"
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
import { ref, computed, watch } from 'vue'
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

// 상태 관리
const activeDay = ref(1)
const selectedPlaceId = ref(null)

// 마커 클릭 핸들러
const handleMarkerClick = (placeId) => {
  selectedPlaceId.value = selectedPlaceId.value === placeId ? null : placeId
}

// 장소 리스트에서 장소 클릭 핸들러
const handlePlaceClick = (place) => {
  selectedPlaceId.value = selectedPlaceId.value === place.id ? null : place.id
}

const showAddPlaceModal = ref(false)
const newPlace = ref({
  planDetailName: '',
  arrivalTime: '12:00:00',
  departureTime: '13:00:00',
  memo: '',
  transportName: '자가용',
  latitude: 33.38,
  longitude: 126.54,
  address: ''
})

// 로컬 데이터 복사본
const localPlanData = ref(JSON.parse(JSON.stringify(props.planData)))

// props.planData 변경 감지
watch(() => props.planData, (newValue) => {
  localPlanData.value = JSON.parse(JSON.stringify(newValue))
}, { deep: true })

// 총 일수 계산
const calculateTotalDays = computed(() => {
  if (!localPlanData.value?.startDate || !localPlanData.value?.endDate) return 1
  
  const start = new Date(localPlanData.value.startDate)
  const end = new Date(localPlanData.value.endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays + 1 // 당일 포함
})

// 현재 일자에 해당하는 장소들 - 지도에 전달할 형태로 정리
const currentDayPlaces = computed(() => {
  if (!localPlanData.value?.details) return []
  
  return localPlanData.value.details
    .filter(detail => detail.day === activeDay.value)
    .sort((a, b) => {
      const timeA = normalizeTime(a.arrivalTime)
      const timeB = normalizeTime(b.arrivalTime)
      return timeA.localeCompare(timeB)
    })
    .map(place => ({
      id: place.id,
      planDetailName: place.planDetailName,
      latitude: parseFloat(place.latitude),
      longitude: parseFloat(place.longitude),
      arrivalTime: place.arrivalTime,
      departureTime: place.departureTime,
      memo: place.memo || '',
      address: place.address || '',
      transportFromPrevious: place.transportFromPrevious,
      day: place.day
    }))
})

// 시간 정규화 함수
const normalizeTime = (time) => {
  if (!time) return '00:00:00'
  const timeStr = time.toString()
  
  // 이미 HH:MM:SS 형식인 경우
  if (timeStr.match(/^\d{2}:\d{2}:\d{2}$/)) {
    return timeStr
  }
  
  // HH:MM 형식인 경우
  if (timeStr.match(/^\d{2}:\d{2}$/)) {
    return timeStr + ':00'
  }
  
  // 다른 형식이면 기본값
  return '00:00:00'
}

// 현재 일자의 장소들 업데이트
const updateCurrentDayPlaces = (newPlaces) => {
  // 다른 날의 장소들 보존
  const otherDayPlaces = localPlanData.value.details.filter(
    detail => detail.day !== activeDay.value
  )
  
  // 새로운 장소들을 현재 날짜로 설정 (day 속성 추가)
  const updatedPlaces = newPlaces.map(place => ({
    ...place,
    day: activeDay.value
  }))
  
  // 새로운 장소들과 합치기
  localPlanData.value.details = [...otherDayPlaces, ...updatedPlaces]
  
  // 부모 컴포넌트에 변경사항 전달
  emitUpdate()
}

// 장소 삭제
const deletePlaceById = (id) => {
  console.log('장소 삭제:', id)
  
  localPlanData.value.details = localPlanData.value.details.filter(
    detail => detail.id !== id
  )
  
  // 선택된 장소가 삭제된 경우 선택 해제
  if (selectedPlaceId.value === id) {
    selectedPlaceId.value = null
  }
  
  // 부모 컴포넌트에 변경사항 전달
  emitUpdate()
}

// 새 장소 추가
const addNewPlace = () => {
  if (!newPlace.value.planDetailName.trim()) {
    alert('장소명을 입력해주세요.')
    return
  }

  // 새 ID 생성 - 1000 이상의 임시 ID 사용
  const existingIds = localPlanData.value.details.map(d => d.id || 0)
  const maxId = Math.max(...existingIds, 0)
  const newId = maxId >= 1000 ? maxId + 1 : 1001
  
  const placeDetail = {
    id: newId, // 임시 ID
    planDetailName: newPlace.value.planDetailName,
    day: activeDay.value,
    arrivalTime: normalizeTime(newPlace.value.arrivalTime),
    departureTime: normalizeTime(newPlace.value.departureTime),
    memo: newPlace.value.memo || '',
    transportFromPrevious: { 
      name: newPlace.value.transportName || '자가용' 
    },
    latitude: parseFloat(newPlace.value.latitude) || 33.38,
    longitude: parseFloat(newPlace.value.longitude) || 126.54,
    address: newPlace.value.address || ''
  }

  console.log('새 장소 추가:', placeDetail)
  
  // 로컬 데이터에 추가
  localPlanData.value.details.push(placeDetail)
  
  // 부모 컴포넌트에 변경사항 전달
  emitUpdate()

  // 모달 닫기 및 폼 초기화
  showAddPlaceModal.value = false
  resetNewPlace()
}

// 부모 컴포넌트에 변경사항 전달
const emitUpdate = () => {
  emit('update:planData', JSON.parse(JSON.stringify(localPlanData.value)))
}

// 새 장소 폼 초기화
const resetNewPlace = () => {
  newPlace.value = {
    planDetailName: '',
    arrivalTime: '12:00:00',
    departureTime: '13:00:00',
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
  let defaultArrivalTime = '10:00:00'
  let defaultDepartureTime = '11:00:00'

  const dayPlaces = currentDayPlaces.value

  if (dayPlaces.length > 0) {
    const lastPlace = dayPlaces[dayPlaces.length - 1]
    const lastDepartureTime = normalizeTime(lastPlace.departureTime)
    const [hours, minutes] = lastDepartureTime.split(':')
    
    let arrivalHour = parseInt(hours)
    let arrivalMinute = parseInt(minutes) + 30

    if (arrivalMinute >= 60) {
      arrivalHour += 1
      arrivalMinute -= 60
    }
    if (arrivalHour >= 24) {
      arrivalHour = 0
    }

    defaultArrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}:00`

    // 도착 후 1시간 체류 가정
    let departureHour = arrivalHour + 1
    let departureMinute = arrivalMinute

    if (departureHour >= 24) {
      departureHour = 0
    }

    defaultDepartureTime = `${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}:00`
  }

  // 새 장소 정보 설정
  newPlace.value = {
    planDetailName: place.planDetailName || place.place_name || place.name,
    arrivalTime: defaultArrivalTime,
    departureTime: defaultDepartureTime,
    memo: '',
    transportName: dayPlaces.length > 0 ? '자가용' : '시작점',
    latitude: parseFloat(place.latitude || place.y) || 33.38,
    longitude: parseFloat(place.longitude || place.x) || 126.54,
    address: place.address || place.road_address_name || place.address_name || ''
  }

  showAddPlaceModal.value = true
}

// 액티브 데이 변경 시 선택된 장소 초기화
watch(activeDay, () => {
  selectedPlaceId.value = null
})
</script>

<style scoped>
/* 기존 스타일 유지 */
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
</style>