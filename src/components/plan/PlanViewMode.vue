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
          <div class="summary-actions">
            <div class="summary-badge">
              <span class="badge-icon">👥</span>
              {{ planData.memberCount }}명
            </div>
            <button class="share-button" @click="openShareModal" title="공유하기">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor"/>
              </svg>
            </button>
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

    <!-- 공유 링크 모달 -->
    <div v-if="showShareModal" class="modal-overlay" @click="closeShareModal">
      <div class="share-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title-section">
            <div class="modal-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor"/>
              </svg>
            </div>
            <h3>여행 계획 공유</h3>
          </div>
          <button class="close-button" @click="closeShareModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <p class="modal-description">
            이 링크를 공유하여 다른 사용자와 함께 여행 계획을 편집할 수 있습니다.
          </p>
          
          <div class="share-options">
            <div class="share-option view-option">
              <div class="option-header">
                <div class="option-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="option-content">
                  <span class="option-title">보기 전용</span>
                  <p class="option-description">다른 사용자가 계획을 볼 수만 있습니다</p>
                </div>
              </div>
              <div class="link-container">
                <input 
                  type="text" 
                  :value="viewOnlyLink" 
                  readonly 
                  class="link-input"
                  ref="viewLinkInput"
                >
                <button class="copy-button" @click="copyLink('view')">
                  <svg v-if="!copiedStates.view" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="share-option edit-option">
              <div class="option-header">
                <div class="option-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="option-content">
                  <span class="option-title">편집 가능</span>
                  <p class="option-description">다른 사용자가 계획을 함께 편집할 수 있습니다</p>
                </div>
              </div>
              <div class="link-container">
                <input 
                  type="text" 
                  :value="editableLink" 
                  readonly 
                  class="link-input"
                  ref="editLinkInput"
                >
                <button class="copy-button" @click="copyLink('edit')">
                  <svg v-if="!copiedStates.edit" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="regenerate-button" @click="regenerateLinks">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="23,4 23,10 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="1,20 1,14 7,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              새 링크 생성
            </button>
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
const showShareModal = ref(false)
const copiedStates = ref({
  view: false,
  edit: false
})

// 공유 링크 (실제로는 서버에서 생성된 링크를 사용해야 함)
const viewOnlyLink = ref(`${window.location.origin}/plan/${props.planData.id}/view?token=${generateToken()}`)
const editableLink = ref(`${window.location.origin}/plan/${props.planData.id}/edit?token=${generateToken()}`)

// 현재 선택된 일자의 장소들
const filteredPlaces = computed(() => {
  return props.planData.details
    .filter(detail => detail.day === activeDay.value)
    .sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime))
})

// 공유 모달 열기/닫기
const openShareModal = () => {
  showShareModal.value = true
}

const closeShareModal = () => {
  showShareModal.value = false
  // 복사 상태 초기화
  copiedStates.value = { view: false, edit: false }
}

// 링크 복사
const copyLink = async (type) => {
  try {
    const link = type === 'view' ? viewOnlyLink.value : editableLink.value
    await navigator.clipboard.writeText(link)
    
    copiedStates.value[type] = true
    
    // 2초 후 복사 상태 초기화
    setTimeout(() => {
      copiedStates.value[type] = false
    }, 2000)
  } catch (err) {
    console.error('링크 복사 실패:', err)
    // 폴백: 텍스트 선택
    const input = type === 'view' ? 
      document.querySelector('.link-input[readonly]') : 
      document.querySelectorAll('.link-input[readonly]')[1]
    input.select()
    document.execCommand('copy')
    copiedStates.value[type] = true
    setTimeout(() => {
      copiedStates.value[type] = false
    }, 2000)
  }
}

// 새 링크 생성
const regenerateLinks = () => {
  viewOnlyLink.value = `${window.location.origin}/plan/${props.planData.id}/view?token=${generateToken()}`
  editableLink.value = `${window.location.origin}/plan/${props.planData.id}/edit?token=${generateToken()}`
}

// 토큰 생성 (실제로는 서버에서 생성해야 함)
function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

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
  background-color: #fbfaff;
  font-family: "Marines", "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", sans-serif;
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
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(142, 106, 217, 0.04);
  overflow: hidden;
}

.itinerary-section {
  width: 500px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(142, 106, 217, 0.04);
  overflow: hidden;
}

.itinerary-header {
  border-bottom: 1px solid #efe6ff;
}

.itinerary-body {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #667080;
  background-color: #f7f2ff;
  border-radius: 20px;
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
  background-color: #f7f2ff;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.08);
  border: 1px solid #efe6ff;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;
}

.place-card-view:hover {
  box-shadow: 0 8px 20px rgba(142, 106, 217, 0.15);
  transform: translateY(-2px);
  border-color: #d4c2f0;
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
  box-shadow: 0 4px 8px rgba(142, 106, 217, 0.3);
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
  border-radius: 8px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(142, 106, 217, 0.2);
}

.place-name {
  margin: 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.place-memo {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #667080;
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
  background: linear-gradient(to right, #efe6ff, #d4c2f0, #efe6ff);
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
  border: 2px solid #efe6ff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 8px rgba(142, 106, 217, 0.1);
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
  font-weight: 600;
  color: #667080;
  margin-bottom: 0.25rem;
}

.transport-duration {
  font-size: 0.75rem;
  color: #8e6ad9;
  background-color: #efe6ff;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-weight: 500;
}

/* 계획 요약 */
.plan-summary {
  padding: 1rem;
  background-color: #fbfaff;
}

.summary-card {
  max-width: 1600px;
  margin: 0 auto;
  background-color: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(142, 106, 217, 0.04);
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
  font-weight: 700;
  color: #2c3e50;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.summary-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.summary-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #efe6ff;
  color: #8e6ad9;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(142, 106, 217, 0.1);
}

.badge-icon {
  font-size: 1rem;
}

.share-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #8e6ad9;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.3);
}

.share-button:hover {
  background-color: #7c59c5;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(142, 106, 217, 0.4);
}

.share-button:active {
  transform: translateY(0);
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
  font-weight: 600;
  color: #667080;
}

.label-icon {
  font-size: 1rem;
}

.summary-value {
  font-size: 0.875rem;
  color: #2c3e50;
  font-weight: 600;
}

.visibility-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
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
  border-top: 1px solid #efe6ff;
  padding-top: 1.5rem;
}

.daily-summary h4 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #2c3e50;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.daily-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.daily-item {
  background-color: #f7f2ff;
  border: 1px solid #efe6ff;
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.daily-item:hover {
  background-color: #f0e7fd;
  border-color: #d4c2f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(142, 106, 217, 0.1);
}

.daily-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #8e6ad9;
  margin-bottom: 0.25rem;
}

.daily-info {
  font-size: 0.75rem;
  color: #667080;
}

.daily-count {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.daily-time {
  color: #9ca3af;
}

/* 공유 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(17, 24, 39, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.share-modal {
  background: white;
  border-radius: 20px;
  padding: 0;
  width: 90vw;
  max-width: 520px;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(142, 106, 217, 0.25);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  background-color: #f7f2ff;
  border-bottom: 1px solid #efe6ff;
}

.modal-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon {
  width: 32px;
  height: 32px;
  background-color: #8e6ad9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 8px rgba(142, 106, 217, 0.3);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.close-button {
  background-color: #f0e7fd;
  border: none;
  color: #8e6ad9;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background-color: #e5d1fd;
  color: #7c59c5;
}

.modal-body {
  padding: 28px;
}

.modal-description {
  margin: 0 0 24px 0;
  color: #667080;
  line-height: 1.6;
  font-size: 0.95rem;
}

.share-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.share-option {
  border: 1px solid #efe6ff;
  border-radius: 16px;
  padding: 20px;
  background-color: #f7f2ff;
  transition: all 0.3s ease;
}

.share-option:hover {
  border-color: #d4c2f0;
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.1);
  transform: translateY(-1px);
}

.view-option {
  border-left: 4px solid #06b6d4;
}

.edit-option {
  border-left: 4px solid #8e6ad9;
}

.option-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.option-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.view-option .option-icon {
  background: linear-gradient(135deg, #67e8f9 0%, #06b6d4 100%);
  color: white;
}

.edit-option .option-icon {
  background-color: #8e6ad9;
  color: white;
}

.option-content {
  flex: 1;
}

.option-title {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  display: block;
  margin-bottom: 4px;
}

.option-description {
  margin: 0;
  font-size: 0.875rem;
  color: #667080;
  line-height: 1.4;
}

.link-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.link-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #efe6ff;
  border-radius: 12px;
  font-size: 0.875rem;
  background-color: white;
  color: #667080;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  transition: all 0.2s ease;
}

.link-input:focus {
  outline: none;
  border-color: #8e6ad9;
  box-shadow: 0 0 0 3px rgba(142, 106, 217, 0.15);
}

.copy-button {
  padding: 12px;
  background-color: #f7f2ff;
  color: #8e6ad9;
  border: 1px solid #efe6ff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
}

.copy-button:hover {
  background-color: #8e6ad9;
  color: white;
  border-color: #8e6ad9;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(142, 106, 217, 0.3);
}

.modal-actions {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #efe6ff;
}

.regenerate-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f7f2ff;
  color: #8e6ad9;
  border: 1px solid #efe6ff;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.regenerate-button:hover {
  background-color: #8e6ad9;
  color: white;
  border-color: #8e6ad9;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(142, 106, 217, 0.3);
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

  .summary-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
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

  .summary-actions {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    width: 100%;
    justify-content: space-between;
  }

  .summary-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .daily-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .share-modal {
    width: 95vw;
    margin: 1rem;
  }

  .modal-header {
    padding: 1rem 1.5rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .link-container {
    flex-direction: column;
    align-items: stretch;
  }

  .copy-button {
    width: 100%;
  }

  .share-options {
    gap: 1rem;
  }

  .share-option {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .summary-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .share-button {
    justify-content: center;
  }
}

/* 스크롤바 스타일링 */
.itinerary-body::-webkit-scrollbar {
  width: 6px;
}

.itinerary-body::-webkit-scrollbar-track {
  background: #f7f2ff;
  border-radius: 3px;
}

.itinerary-body::-webkit-scrollbar-thumb {
  background: #d4c2f0;
  border-radius: 3px;
}

.itinerary-body::-webkit-scrollbar-thumb:hover {
  background: #c4b1e8;
}

.share-modal::-webkit-scrollbar {
  width: 6px;
}

.share-modal::-webkit-scrollbar-track {
  background: #f7f2ff;
  border-radius: 3px;
}

.share-modal::-webkit-scrollbar-thumb {
  background: #d4c2f0;
  border-radius: 3px;
}

.share-modal::-webkit-scrollbar-thumb:hover {
  background: #c4b1e8;
}

/* 트랜지션 및 애니메이션 효과 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>