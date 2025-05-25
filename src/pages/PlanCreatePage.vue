<!-- pages/PlanCreatePage.vue -->
<template>
  <div class="plan-create-page">
    <AppHeader :title="getHeaderTitle()" :subtitle="getHeaderSubtitle()">
      <template #actions>
        <div class="header-actions">
          <button @click="goBack" class="back-button">
            <span class="back-icon">←</span>
            뒤로가기
          </button>
          
          <!-- 편집 단계에서만 저장 버튼 표시 -->
          <div v-if="step === 'edit'" class="edit-actions">
            <button @click="savePlan" class="save-button" :disabled="isSaving">
              <span class="save-icon">💾</span>
              {{ isSaving ? "저장 중..." : "여행 계획 저장" }}
            </button>
          </div>
        </div>
      </template>
    </AppHeader>

    <!-- 진행 단계 표시 -->
    <div class="progress-container" v-if="!isLoading">
      <div class="progress-content">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <div class="progress-steps">
          <div class="progress-step" :class="{ active: step === 'recommendation' }">
            <span class="step-number">1</span>
            <span class="step-label">추천 확인</span>
          </div>
          <div class="progress-step" :class="{ active: step === 'edit' }">
            <span class="step-number">2</span>
            <span class="step-label">상세 편집</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 추천 결과 표시 -->
    <PlanRecommendationView
      v-if="step === 'recommendation'"
      :loading="loading"
      :recommendation-data="recommendationData"
      @back="goBack"
      @proceed="convertToEditablePlan"
    />

    <!-- 상세 편집 -->
    <PlanEditView
      v-else-if="step === 'edit'"
      v-model:plan-data="planData"
      :is-saving="isSaving"
      :show-save-bar="true"
      @save="savePlan"
    />

    <!-- 로딩 상태 (데이터 변환 중) -->
    <div v-if="isConverting" class="conversion-overlay">
      <div class="conversion-content">
        <div class="conversion-spinner"></div>
        <h3>여행 계획을 준비하고 있습니다</h3>
        <p>장소 정보를 검색하고 지도에 표시하는 중...</p>
        <div class="conversion-progress">
          <div class="conversion-step" v-for="(step, index) in conversionSteps" :key="index" 
               :class="{ active: currentConversionStep >= index, completed: currentConversionStep > index }">
            <div class="step-icon">{{ step.icon }}</div>
            <div class="step-text">{{ step.text }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 저장 성공 토스트 -->
    <Transition name="toast">
      <div v-if="showSuccessToast" class="success-toast">
        <span class="toast-icon">🎉</span>
        <div class="toast-content">
          <div class="toast-title">여행 계획이 저장되었습니다!</div>
          <div class="toast-subtitle">이제 언제든지 수정하고 관리할 수 있습니다</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/userAuth'
import AppHeader from '@/components/common/AppHeader.vue'
import PlanRecommendationView from '@/components/plan/PlanRecommendationView.vue'
import PlanEditView from '@/components/plan/PlanEditView.vue'
import { usePlanData } from '@/composables/usePlanData'
import { usePlanSave } from '@/composables/usePlanSave'

const router = useRouter()
const route = useRoute()
const { checkLoginStatus } = useAuth()

// 상태 관리
const step = ref('recommendation')
const loading = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)
const isConverting = ref(false)
const showSuccessToast = ref(false)
const currentConversionStep = ref(0)

// 컴포저블 사용
const { 
  recommendationData, 
  travelInfo, 
  planData,
  loadRecommendationData,
  convertToEditablePlan: convertPlan
} = usePlanData()

const { savePlan: savePlanData } = usePlanSave()

// 변환 단계
const conversionSteps = [
  { icon: '🔍', text: '장소 정보 검색 중...' },
  { icon: '🗺️', text: '지도 좌표 확인 중...' },
  { icon: '📍', text: '마커 생성 중...' },
  { icon: '✨', text: '완료!' }
]

// 컴퓨티드
const progressPercentage = computed(() => {
  return step.value === 'recommendation' ? 50 : 100
})

const hasRecommendationData = computed(() => {
  return recommendationData.value && 
         recommendationData.value.days && 
         recommendationData.value.days.length > 0
})

const getHeaderTitle = () => {
  switch (step.value) {
    case 'recommendation': return '🎯 맞춤 여행 추천'
    case 'edit': return planData.value.title || '✏️ 여행 계획 편집'
    default: return '새 여행 계획 만들기'
  }
}

const getHeaderSubtitle = () => {
  if (step.value === 'edit') {
    return formatDateRange(planData.value.startDate, planData.value.endDate)
  }
  if (step.value === 'recommendation' && travelInfo.value.region) {
    return `${travelInfo.value.region} ${travelInfo.value.duration}일 여행`
  }
  return ''
}

// 라이프사이클
onMounted(async () => {
  await checkLoginStatus()
  
  if (route.query.step) {
    step.value = route.query.step
  }
  
  await loadRecommendationData()
  
  if (!recommendationData.value?.days?.length && step.value === 'recommendation') {
    console.warn('추천 데이터가 없습니다. 여행 목록 페이지로 이동합니다.')
    alert('여행 데이터를 불러올 수 없습니다. 여행 목록 페이지로 이동합니다.')
    router.push('/plans')
  }
})

// 메서드들
const goBack = () => {
  if (step.value === 'edit') {
    const confirmed = confirm('편집 중인 내용이 사라집니다. 정말 돌아가시겠습니까?')
    if (!confirmed) return
  }
  router.push('/plans')
}

const convertToEditablePlan = async () => {
  isConverting.value = true
  currentConversionStep.value = 0
  
  try {
    // 단계별 진행 시뮬레이션
    for (let i = 0; i < conversionSteps.length - 1; i++) {
      currentConversionStep.value = i
      await new Promise(resolve => setTimeout(resolve, 800))
    }
    
    await convertPlan(recommendationData.value, travelInfo.value)
    
    currentConversionStep.value = conversionSteps.length - 1
    await new Promise(resolve => setTimeout(resolve, 500))
    
    step.value = 'edit'
    
  } catch (error) {
    console.error('계획 변환 오류:', error)
    alert('계획을 변환하는 중 오류가 발생했습니다. 다시 시도해주세요.')
  } finally {
    isConverting.value = false
    currentConversionStep.value = 0
  }
}

const savePlan = async () => {
  isSaving.value = true
  
  try {
    await savePlanData(planData.value, travelInfo.value)
    
    // 성공 토스트 표시
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
      // 토스트가 사라진 후 페이지 이동
      setTimeout(() => {
        router.push('/plans')
      }, 500)
    }, 3000)
    
  } catch (error) {
    console.error('저장 오류:', error)
    alert(`여행 계획을 저장하는 중 오류가 발생했습니다: ${error.message}`)
  } finally {
    isSaving.value = false
  }
}

const formatDateRange = (startDate, endDate) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  }
  return `${formatDate(startDate)} ~ ${formatDate(endDate)}`
}
</script>

<style scoped>
.plan-create-page {
  min-height: 100vh;
  background-color: #f9fafb;
  position: relative;
}

/* 헤더 액션 */
.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.back-button,
.save-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.back-button {
  background-color: #f3f4f6;
  color: #4b5563;
}

.back-button:hover {
  background-color: #e5e7eb;
  transform: translateY(-1px);
}

.save-button {
  background-color: #10b981;
  color: white;
}

.save-button:hover:not(:disabled) {
  background-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2);
}

.save-button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* 진행 단계 */
.progress-container {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

.progress-bar {
  height: 6px;
  background-color: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #a78bda 0%, #8e6ad9 100%);
  transition: width 0.5s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  max-width: 400px;
  margin: 0 auto;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.progress-step.active {
  opacity: 1;
}

.step-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.progress-step.active .step-number {
  background-color: #8e6ad9;
  color: white;
}

.step-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.progress-step.active .step-label {
  color: #1f2937;
}

/* 변환 오버레이 */
.conversion-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.conversion-content {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 90%;
}

.conversion-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #a78bda;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

.conversion-content h3 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.conversion-content p {
  margin: 0 0 2rem 0;
  color: #6b7280;
}

.conversion-progress {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.conversion-step {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  background-color: #f9fafb;
  transition: all 0.3s ease;
}

.conversion-step.active {
  background-color: #fef3c7;
  transform: scale(1.02);
}

.conversion-step.completed {
  background-color: #d1fae5;
}

.step-icon {
  font-size: 1.5rem;
  width: 2rem;
  text-align: center;
}

.step-text {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

/* 성공 토스트 */
.success-toast {
  position: fixed;
  top: 100px;
  right: 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 100;
  max-width: 400px;
}

.toast-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.toast-subtitle {
  font-size: 0.875rem;
  opacity: 0.9;
}

/* 토스트 애니메이션 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .progress-content {
    padding: 1rem;
  }
  
  .conversion-content {
    margin: 1rem;
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .header-actions {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .header-actions button {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }

  .progress-content {
    padding: 1rem;
  }

  .progress-steps {
    gap: 0.5rem;
  }

  .step-label {
    font-size: 0.625rem;
  }

  .conversion-content {
    padding: 2rem;
  }

  .conversion-step {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .success-toast {
    right: 10px;
    left: 10px;
    top: 80px;
  }

  .edit-actions {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .plan-create-page {
    min-height: 100vh;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .header-actions button {
    width: 100%;
    justify-content: center;
  }
  
  .progress-content {
    padding: 0.75rem;
  }
  
  .progress-steps {
    flex-direction: column;
    gap: 1rem;
    max-width: 200px;
  }
  
  .progress-step {
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
  }
  
  .step-number {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
  }
  
  .conversion-content {
    padding: 1.5rem;
    margin: 0.5rem;
  }
  
  .conversion-spinner {
    width: 40px;
    height: 40px;
    margin-bottom: 1.5rem;
  }
  
  .conversion-content h3 {
    font-size: 1.1rem;
  }
  
  .conversion-content p {
    font-size: 0.875rem;
  }
  
  .success-toast {
    right: 5px;
    left: 5px;
    top: 70px;
    padding: 1rem;
  }
  
  .toast-title {
    font-size: 0.875rem;
  }
  
  .toast-subtitle {
    font-size: 0.75rem;
  }
}

/* 애니메이션 키프레임 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 접근성 개선 */
@media (prefers-reduced-motion: reduce) {
  .conversion-spinner {
    animation: none;
  }
  
  .progress-fill {
    transition: none;
  }
  
  .conversion-step {
    transition: none;
  }
  
  * {
    transition: none !important;
    animation: none !important;
  }
}

/* 다크 모드 대응 (선택사항) */
@media (prefers-color-scheme: dark) {
  .plan-create-page {
    background-color: #111827;
  }
  
  .progress-container {
    background: #1f2937;
    border-color: #374151;
  }
  
  .conversion-content {
    background: #1f2937;
    color: #f9fafb;
  }
  
  .conversion-content h3 {
    color: #f9fafb;
  }
  
  .conversion-content p {
    color: #d1d5db;
  }
}

/* 포커스 관리 */
.back-button:focus,
.save-button:focus {
  outline: 2px solid #a78bda;
  outline-offset: 2px;
}

/* 상태별 추가 스타일 */
.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.save-button:disabled:hover {
  background-color: #d1d5db;
  box-shadow: none;
  transform: none;
}

/* 고해상도 디스플레이 대응 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .conversion-spinner {
    border-width: 2px;
  }
  
  .progress-bar {
    height: 4px;
  }
}

/* 터치 디바이스 최적화 */
@media (hover: none) and (pointer: coarse) {
  .back-button,
  .save-button {
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    min-height: 44px; /* iOS 권장 터치 타겟 크기 */
  }
}

/* 프린트 스타일 */
@media print {
  .plan-create-page {
    background: white;
  }
  
  .conversion-overlay,
  .success-toast,
  .header-actions {
    display: none;
  }
}
</style>