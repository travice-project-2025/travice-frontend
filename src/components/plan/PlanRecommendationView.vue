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
  background-color: #f9fafb;
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
  border-top: 4px solid #a78bda;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #4b5563;
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
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 헤더 스타일 */
.recommendation-header {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #a78bda 0%, #8e6ad9 100%);
  color: white;
}

.recommendation-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.recommendation-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.days-container {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
}

/* 각 날짜 계획 스타일 */
.day-plan {
  margin-bottom: 2rem;
}

.day-plan:last-child {
  margin-bottom: 0;
}

.day-title {
  text-align: center;
  margin-bottom: 1.5rem;
}

.day-number {
  display: inline-block;
  background: linear-gradient(135deg, #a78bda 0%, #8e6ad9 100%);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

/* 장소 리스트 */
.places-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* 장소 카드 스타일 */
.place-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.place-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.place-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.place-time {
  align-self: flex-start;
  background: #a78bda;
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.place-details {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.place-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  font-family: 'Marines', 'Pretendard', sans-serif;
  flex-shrink: 0;
  min-width: 120px;
}

.place-activity {
  margin: 0;
  color: #4a5568;
  font-size: 0.9rem;
  line-height: 1.4;
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
  background: linear-gradient(to bottom, #e2e8f0, #a0aec0);
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
  padding: 0.75rem 1.25rem;
  border-radius: 25px;
  font-size: 0.85rem;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}

.transport-icon {
  font-size: 1.2rem;
}

.transport-type {
  font-weight: 600;
  color: #2d3748;
}

.transport-duration {
  color: #718096;
  font-weight: 500;
}

.transport-arrow {
  font-size: 1.2rem;
  color: #a0aec0;
  font-weight: bold;
}

/* 액션 버튼 컨테이너 */
.action-buttons-container {
  padding: 2rem;
  background: #f7fafc;
  border-top: 1px solid #e2e8f0;
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
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.back-button:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
  transform: translateY(-1px);
}

.proceed-button {
  background: linear-gradient(135deg, #a78bda 0%, #8e6ad9 100%);
  color: white;
}

.proceed-button:hover {
  background: linear-gradient(135deg, #9979d5 0%, #7c5dd0 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(167, 139, 218, 0.3);
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
  padding: 1.5rem;
  background: linear-gradient(135deg, #f9eeff 0%, #fde6ff 100%);
  border-radius: 12px;
  border: 1px solid #f2d9ff;
}

.info-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-text {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #92400e;
}

.info-text strong {
  color: #78350f;
  font-weight: 600;
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
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

.no-data-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-data-content h3 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.no-data-content p {
  margin: 0 0 2rem 0;
  color: #718096;
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
  background: #f1f5f9;
  border-radius: 3px;
}

.days-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.days-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
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