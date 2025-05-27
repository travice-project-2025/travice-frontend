<!-- components/plan/PlanRecommendationView.vue -->
<template>
  <div class="recommendation-view">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>여행 계획을 추천하는 중입니다...</p>
    </div>

    <div v-else-if="hasRecommendationData" class="recommendation-result">
      <div class="recommendation-content">
        <div class="recommendation-header">
          <h2>✨ 맞춤 여행 계획이 완성되었어요!</h2>
          <p>아래 일정을 확인하고 마음에 드시면 진행해주세요</p>
        </div>

        <div class="days-container">
          <div v-for="day in recommendationData.days" :key="day.day" class="day-plan">
            <h3 class="day-title">
              <span class="day-number">Day {{ day.day }}</span>
            </h3>

            <div class="places-list">
              <template v-for="(place, placeIndex) in day.places || []" :key="placeIndex">
                <div class="place-card">
                  <div class="place-info">
                    <span class="place-time">
                      {{ place.arrival }} - {{ place.departure }}
                    </span>
                    <div class="place-details">
                      <h4 class="place-name">{{ place.name }}</h4>
                      <p class="place-activity">{{ place.activity }}</p>
                    </div>
                  </div>
                </div>

                <div v-if="placeIndex < day.places.length - 1 && placeIndex < day.transports.length" class="transport-info">
                  <div class="transport-content">
                    <div class="transport-icon">
                      {{ getTransportEmoji(day.transports[placeIndex].type) }}
                    </div>
                    <span class="transport-type">{{ day.transports[placeIndex].type }}</span>
                    <span class="transport-duration">{{ day.transports[placeIndex].duration }}</span>
                  </div>
                  <div class="transport-arrow">⬇</div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="action-buttons-container">
          <div class="action-buttons">
            <button @click="$emit('back')" class="back-button">
              <span>🔄</span>
              다시 추천받기
            </button>
            <button @click="$emit('proceed')" class="proceed-button">
              <span>✏️</span>
              이 계획으로 진행하기
            </button>
          </div>
          
          <!-- 다음 단계 안내 -->
          <div class="next-step-info">
            <div class="info-content">
              <div class="info-icon">💡</div>
              <div class="info-text">
                <strong>다음 단계:</strong> "이 계획으로 진행하기"를 누르면 지도에서 일정을 자세히 편집하고 저장할 수 있습니다
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-data-container">
      <div class="no-data-content">
        <div class="no-data-icon">😅</div>
        <h3>추천 데이터가 아직 준비되지 않았습니다</h3>
        <p>잠시 후 다시 시도해주세요</p>
        <div class="action-buttons">
          <button @click="$emit('back')" class="back-button">
            목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  recommendationData: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['back', 'proceed'])

const hasRecommendationData = computed(() => {
  return props.recommendationData && 
         props.recommendationData.days && 
         props.recommendationData.days.length > 0
})

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
  }
  return emojiMap[transportType] || '🚗'
}
</script>

<style scoped>
.recommendation-view {
  width: 100%;
  min-height: calc(100vh - 60px);
  background-color: #fafafa;
  padding: 1rem;
}

/* 로딩 컨테이너 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #c4b5fd;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
}

/* 추천 결과 메인 컨테이너 */
.recommendation-result {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.recommendation-content {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(196, 181, 253, 0.08);
  overflow: hidden;
  border: 1px solid rgba(196, 181, 253, 0.15);
}

/* 헤더 스타일 - 매우 연한 보라 */
.recommendation-header {
  text-align: center;
  padding: 2.5rem 2rem;
  background: linear-gradient(135deg, #f3f0ff 0%, #e9e5ff 100%);
  color: #374151;
  position: relative;
}

.recommendation-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.6rem;
  font-weight: 700;
  font-family: 'Marines', 'Pretendard', sans-serif;
  color: #1f2937;
}

.recommendation-header p {
  margin: 0;
  color: #6b7280;
  font-size: 1rem;
}

.days-container {
  padding: 2.5rem;
  max-height: 60vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #f8f6ff 0%, #f3f0ff 100%);
}

/* 각 날짜 계획 스타일 - 경계 강화 */
.day-plan {
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #ffffff 0%, #fefeff 100%);
  border-radius: 20px;
  padding: 2.5rem;
  border: 2px solid rgba(139, 92, 246, 0.12);
  box-shadow: 
    0 4px 20px rgba(139, 92, 246, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
}

.day-plan::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #c4b5fd 0%, #ddd6fe 50%, #c4b5fd 100%);
  border-radius: 20px 20px 0 0;
}

.day-plan:last-child {
  margin-bottom: 0;
}

.day-title {
  text-align: center;
  margin-bottom: 2rem;
  margin-top: -0.5rem;
}

.day-number {
  display: inline-block;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'Marines', 'Pretendard', sans-serif;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 장소 카드 스타일 - 더 뚜렷한 구분 */
.place-card {
  background: #fafafa;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 0.75rem;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.place-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.12);
  border-color: rgba(139, 92, 246, 0.3);
  background: white;
}

.place-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* 시간 태그 - 연한 보라 */
.place-time {
  align-self: flex-start;
  background: #c4b5fd;
  color: #4c1d95;
  padding: 0.5rem 1.25rem;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
}

.place-details {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.place-name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
  font-family: 'Marines', 'Pretendard', sans-serif;
  flex-shrink: 0;
  min-width: 120px;
}

.place-activity {
  margin: 0;
  color: #4b5563;
  font-size: 0.95rem;
  line-height: 1.5;
  flex: 1;
}

/* 교통편 정보 스타일 */
.transport-info {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.transport-info::before,
.transport-info::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 20px;
  background: linear-gradient(to bottom, #f3f4f6, #d1d5db);
}

.transport-info::before {
  top: -20px;
}

.transport-info::after {
  bottom: -20px;
}

.transport-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  padding: 0.875rem 1.5rem;
  border-radius: 30px;
  font-size: 0.875rem;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}

.transport-icon {
  font-size: 1.2rem;
}

.transport-type {
  font-weight: 600;
  color: #374151;
}

.transport-duration {
  color: #6b7280;
  font-weight: 500;
}

.transport-arrow {
  font-size: 1.2rem;
  color: #d1d5db;
  font-weight: bold;
}

/* 액션 버튼 컨테이너 */
.action-buttons-container {
  padding: 2.5rem;
  background: #fafafa;
  border-top: 1px solid #f3f4f6;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  max-width: 500px;
  margin: 0 auto 1.5rem;
}

/* 버튼 스타일 */
.back-button,
.proceed-button {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.back-button {
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

.back-button:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.proceed-button {
  background: linear-gradient(135deg, #c4b5fd 0%, #ddd6fe 100%);
  color: #4c1d95;
  font-weight: 700;
}

.proceed-button:hover {
  background: linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(196, 181, 253, 0.3);
}

/* 다음 단계 안내 */
.next-step-info {
  max-width: 500px;
  margin: 0 auto;
}

.info-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.75rem;
  background: #fef7ff;
  border-radius: 16px;
  border: 1px solid #f3e8ff;
}

.info-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #6b7280;
}

.info-text strong {
  color: #374151;
  font-weight: 700;
}

/* 데이터 없음 스타일 */
.no-data-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.no-data-content {
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  max-width: 400px;
  border: 1px solid #f3f4f6;
}

.no-data-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-data-content h3 {
  margin: 0 0 0.5rem 0;
  color: #111827;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.no-data-content p {
  margin: 0 0 2rem 0;
  color: #6b7280;
}

.no-data-content .action-buttons {
  display: flex;
  justify-content: center;
  margin: 0;
}

.no-data-content .back-button {
  flex: none;
  padding: 0.75rem 1.5rem;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .recommendation-view {
    padding: 0.5rem;
  }

  .recommendation-header {
    padding: 1.5rem;
  }

  .recommendation-header h2 {
    font-size: 1.3rem;
  }

  .days-container {
    padding: 1.5rem;
    max-height: 70vh;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }

  .place-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .place-time {
    align-self: flex-start;
  }

  .place-name {
    min-width: auto;
  }

  .info-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .recommendation-header h2 {
    font-size: 1.1rem;
  }

  .days-container {
    padding: 1rem;
  }

  .place-card {
    padding: 1rem;
  }

  .action-buttons-container {
    padding: 1.5rem;
  }

  .no-data-content {
    padding: 2rem;
    margin: 1rem;
  }

  .action-buttons button {
    font-size: 0.875rem;
    padding: 0.875rem 1.5rem;
  }
}

/* 스크롤바 스타일링 */
.days-container::-webkit-scrollbar {
  width: 6px;
}

.days-container::-webkit-scrollbar-track {
  background: #f9fafb;
  border-radius: 3px;
}

.days-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.days-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* 애니메이션 효과 */
.place-card {
  animation: fadeInUp 0.6s ease-out;
}

.place-card:nth-child(1) { animation-delay: 0.1s; }
.place-card:nth-child(2) { animation-delay: 0.2s; }
.place-card:nth-child(3) { animation-delay: 0.3s; }
.place-card:nth-child(4) { animation-delay: 0.4s; }
.place-card:nth-child(5) { animation-delay: 0.5s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 접근성 개선 */
@media (prefers-reduced-motion: reduce) {
  .place-card {
    animation: none;
  }
  
  .loading-spinner {
    animation: none;
  }
  
  * {
    transition: none !important;
  }
}
</style>