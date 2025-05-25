<!-- components/plan/PlanViewMode.vue -->
<template>
  <div class="plan-view-mode">
    <div class="plan-content">
      <!-- 왼쪽: 지도 영역 -->
      <div class="map-section">
        <TripMap :places="filteredPlaces" />
      </div>

      <!-- 오른쪽: 일정 영역 -->
      <div class="itinerary-section">
        <div class="itinerary-header">
          <DayTab v-model="activeDay" :total-days="planData.totalDays" />
        </div>

        <div class="itinerary-body">
          <div v-if="filteredPlaces.length === 0" class="empty-state">
            <div class="empty-icon">📅</div>
            <p>이 날짜에 일정이 없습니다.</p>
          </div>
          
          <div v-else class="places-timeline">
            <div v-for="(place, index) in filteredPlaces" :key="place.id" class="place-timeline-item">
              <!-- 이동 수단 표시 (첫 번째 아이템이 아닌 경우) -->
              <div v-if="index > 0" class="transport-between">
                <div class="transport-line"></div>
                <div class="transport-icon-container">
                  <div class="transport-icon">
                    <span class="transport-emoji">
                      {{ getTransportEmoji(place.transportFromPrevious ? place.transportFromPrevious.name : '이동') }}
                    </span>
                  </div>
                  <div class="transport-details">
                    <div class="transport-name">{{ place.transportFromPrevious ? place.transportFromPrevious.name : '이동' }}</div>
                    <div class="transport-duration">{{ calculateDuration(index) }}</div>
                  </div>
                </div>
                <div class="transport-line"></div>
              </div>
              
              <!-- 장소 카드 -->
              <div class="place-card-view">
                <div class="place-order">{{ index + 1 }}</div>
                <div class="place-content">
                  <div class="place-time-transport">
                    <span class="place-time">
                      {{ formatTime(place.arrivalTime) }} - {{ formatTime(place.departureTime) }}
                    </span>
                  </div>
                  <h3 class="place-name">{{ place.planDetailName }}</h3>
                  <p v-if="place.memo" class="place-memo">{{ place.memo }}</p>
                  <p v-if="place.address" class="place-address">
                    <span class="address-icon">📍</span>
                    {{ place.address }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 계획 정보 요약 -->
    <div class="plan-summary">
      <div class="summary-card">
        <div class="summary-header">
          <h3>🗓️ 여행 정보</h3>
          <div class="summary-badge">
            <span class="badge-icon">👥</span>
            {{ planData.memberCount }}명
          </div>
        </div>
        
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-label">
              <span class="label-icon">📅</span>
              여행 기간
            </div>
            <div class="summary-value">{{ formatDateRange(planData.startDate, planData.endDate) }}</div>
          </div>
          
          <div class="summary-item">
            <div class="summary-label">
              <span class="label-icon">⏰</span>
              총 일수
            </div>
            <div class="summary-value">{{ planData.totalDays }}일</div>
          </div>
          
          <div class="summary-item">
            <div class="summary-label">
              <span class="label-icon">🌍</span>
              여행 지역
            </div>
            <div class="summary-value">{{ planData.region || '미설정' }}</div>
          </div>
          
          <div class="summary-item">
            <div class="summary-label">
              <span class="label-icon">👁️</span>
              공개 여부
            </div>
            <div class="summary-value">
              <span class="visibility-badge" :class="{ 'public': planData.isPublic, 'private': !planData.isPublic }">
                {{ planData.isPublic ? '🌐 공개' : '🔒 비공개' }}
              </span>
            </div>
          </div>
          
          <div class="summary-item">
            <div class="summary-label">
              <span class="label-icon">📍</span>
              총 장소 수
            </div>
            <div class="summary-value">{{ planData.details.length }}개 장소</div>
          </div>
          
          <div class="summary-item">
            <div class="summary-label">
              <span class="label-icon">🕐</span>
              생성일
            </div>
            <div class="summary-value">{{ formatCreatedDate() }}</div>
          </div>
        </div>

        <!-- 일자별 요약 -->
        <div class="daily-summary">
          <h4>📋 일자별 일정 요약</h4>
          <div class="daily-grid">
            <div v-for="day in getDailySummary()" :key="day.day" class="daily-item" @click="activeDay = day.day">
              <div class="daily-number">{{ day.day }}</div>
              <div class="daily-info">
                <div class="daily-count">{{ day.placeCount }}개 장소</div>
                <div class="daily-time">{{ day.duration }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DayTab from '@/components/plan/DayTab.vue'
import TripMap from '@/components/plan/TripMap.vue'

const props = defineProps({
  planData: {
    type: Object,
    required: true
  }
})

const activeDay = ref(1)

// 현재 선택된 일자의 장소들
const filteredPlaces = computed(() => {
  return props.planData.details
    .filter(detail => detail.day === activeDay.value)
    .sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime))
})

// 시간 포맷팅
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  return timeStr.substring(0, 5)
}

// 날짜 범위 포맷팅
const formatDateRange = (startDate, endDate) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  }
  return `${formatDate(startDate)} ~ ${formatDate(endDate)}`
}

// 생성일 포맷팅 (현재는 임시로 오늘 날짜)
const formatCreatedDate = () => {
  const today = new Date()
  return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`
}

// 교통수단 이모지
const getTransportEmoji = (transportName) => {
  switch (transportName?.trim()) {
    case '자가용': return '🚗'
    case '택시': return '🚕'
    case '자전거': return '🚲'
    case '도보': return '🚶'
    case '항공': return '✈️'
    case '버스': return '🚌'
    case '지하철': return '🚃'
    case '기차': return '🚊'
    default: return '🚗'
  }
}

// 이동 소요시간 계산
const calculateDuration = (currentIndex) => {
  if (currentIndex <= 0 || !filteredPlaces.value[currentIndex] || !filteredPlaces.value[currentIndex-1]) {
    return '정보 없음'
  }
  
  const prevPlace = filteredPlaces.value[currentIndex-1]
  const currentPlace = filteredPlaces.value[currentIndex]
  
  if (!prevPlace.departureTime || !currentPlace.arrivalTime) {
    return '정보 없음'
  }
  
  // 시간 포맷 변환 (HH:MM:SS -> 분 단위)
  const convertTimeToMinutes = (timeStr) => {
    const parts = timeStr.split(':')
    const hours = parseInt(parts[0], 10)
    const minutes = parseInt(parts[1], 10)
    return hours * 60 + minutes
  }
  
  const departureMinutes = convertTimeToMinutes(prevPlace.departureTime)
  const arrivalMinutes = convertTimeToMinutes(currentPlace.arrivalTime)
  
  // 소요 시간 계산 (분 단위)
  let durationMinutes = arrivalMinutes - departureMinutes
  
  // 날짜를 넘어가는 경우 (음수인 경우 처리)
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60 // 하루를 더함
  }
  
  // 시간과 분으로 변환
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60
  
  // 포맷팅
  if (hours > 0) {
    return `${hours}시간 ${minutes > 0 ? minutes + '분' : ''}`
  }
  return `${minutes}분`
}

// 일자별 요약 정보
const getDailySummary = () => {
  const summary = []
  
  for (let day = 1; day <= props.planData.totalDays; day++) {
    const dayPlaces = props.planData.details.filter(detail => detail.day === day)
    
    let duration = '정보 없음'
    if (dayPlaces.length > 0) {
      const firstPlace = dayPlaces.find(p => p.arrivalTime)
      const lastPlace = dayPlaces.reverse().find(p => p.departureTime)
      
      if (firstPlace && lastPlace && firstPlace.arrivalTime && lastPlace.departureTime) {
        const startTime = firstPlace.arrivalTime.substring(0, 5)
        const endTime = lastPlace.departureTime.substring(0, 5)
        duration = `${startTime} ~ ${endTime}`
      }
    }
    
    summary.push({
      day,
      placeCount: dayPlaces.length,
      duration
    })
  }
  
  return summary
}
</script>

<style scoped>
.plan-view-mode {
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
  height: calc(100vh - 10rem);
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.itinerary-section {
  width: 500px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
  background-color: #f9fafb;
  border-radius: 12px;
  margin: 1rem 0;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 0.875rem;
  margin: 0;
}

.places-timeline {
  display: flex;
  flex-direction: column;
}

.place-timeline-item {
  margin-bottom: 0.75rem;
}

.place-timeline-item:last-child {
  margin-bottom: 0;
}

.place-card-view {
  background-color: #f9f7ff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0e7fd;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.2s ease;
}

.place-card-view:hover {
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.15);
  transform: translateY(-1px);
}

.place-order {
  width: 2rem;
  height: 2rem;
  background-color: #8e6ad9;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
}

.place-content {
  flex: 1;
}

.place-time-transport {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.place-time {
  background-color: #8e6ad9;
  color: white;
  border-radius: 6px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.place-name {
  margin: 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.place-memo {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.place-address {
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.address-icon {
  font-size: 0.875rem;
}

/* 이동 수단 관련 스타일 */
.transport-between {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  margin-left: 2.5rem;
}

.transport-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(to right, #e5e7eb, #cbd5e1, #e5e7eb);
}

.transport-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1rem;
}

.transport-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: white;
  border: 2px solid #e5e7eb;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.transport-emoji {
  font-size: 1.25rem;
  line-height: 1;
}

.transport-details {
  text-align: center;
}

.transport-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.transport-duration {
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

/* 계획 요약 */
.plan-summary {
  padding: 1rem;
  background-color: #f9fafb;
}

.summary-card {
  max-width: 1600px;
  margin: 0 auto;
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.summary-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.summary-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #a78bda;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-icon {
  font-size: 1rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.label-icon {
  font-size: 1rem;
}

.summary-value {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 500;
}

.visibility-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.visibility-badge.public {
  background-color: #dcfce7;
  color: #166534;
}

.visibility-badge.private {
  background-color: #fef2f2;
  color: #dc2626;
}

/* 일자별 요약 */
.daily-summary {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.daily-summary h4 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.daily-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.daily-item {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.daily-item:hover {
  background-color: #f0e7fd;
  border-color: #a78bda;
  transform: translateY(-1px);
}

.daily-number {
  font-size: 1.25rem;
  font-weight: 600;
  color: #8e6ad9;
  margin-bottom: 0.25rem;
}

.daily-info {
  font-size: 0.75rem;
  color: #6b7280;
}

.daily-count {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.daily-time {
  color: #9ca3af;
}

/* 반응형 */
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

  .summary-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .plan-content {
    padding: 0.5rem;
  }

  .summary-card {
    padding: 1.5rem;
  }

  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .summary-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .daily-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
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