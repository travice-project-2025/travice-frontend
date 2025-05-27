<template>
  <div class="join-plan-page">
    <div class="join-container" v-if="!isLoading">
      <div v-if="planInfo" class="plan-info-card">
        <h2>여행 계획 참여하기</h2>
        <div class="plan-details">
          <h3>{{ planInfo.title }}</h3>
          <p>주최자: {{ planInfo.ownerNickname }}</p>
          <p>기간: {{ planInfo.startDate }} ~ {{ planInfo.endDate }}</p>
          <p>참여 인원: {{ planInfo.memberCount }}명</p>
        </div>

        <div class="action-buttons">
          <button @click="joinPlan" class="join-button" :disabled="isJoining">
            {{ isJoining ? '참여 중...' : '참여하기' }}
          </button>
          <button @click="goBack" class="cancel-button">취소</button>
        </div>
      </div>

      <div v-else class="error-message">
        <h3>유효하지 않거나 만료된 초대 링크입니다.</h3>
        <button @click="goHome">홈으로 돌아가기</button>
      </div>
    </div>

    <div v-else class="loading">
      <p>정보를 불러오는 중...</p>
    </div>

    <!-- 성공 토스트 -->
    <transition name="toast">
      <div class="success-toast" v-if="showSuccessToast">
        <div class="toast-icon">🎉</div>
        <div class="toast-content">
          <div class="toast-title">참여 완료</div>
          <div class="toast-subtitle">여행 계획에 성공적으로 참여했어요!</div>
        </div>
      </div>
    </transition>

    <!-- 실패 토스트 -->
    <transition name="toast">
      <div class="success-toast error" v-if="showErrorToast">
        <div class="toast-icon">⚠️</div>
        <div class="toast-content">
          <div class="toast-title">참여 실패</div>
          <div class="toast-subtitle">{{ errorMessage }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { inviteService } from '@/services/inviteService'

const route = useRoute()
const router = useRouter()

const planInfo = ref(null)
const isLoading = ref(true)
const isJoining = ref(false)

const showSuccessToast = ref(false)
const showErrorToast = ref(false)
const errorMessage = ref('')

// 플랜 정보 조회
const fetchPlanInfo = async () => {
  try {
    const inviteCode = route.query.code
    if (!inviteCode) throw new Error('초대 코드가 없습니다')
    planInfo.value = await inviteService.getPlanInfo(inviteCode)
  } catch (error) {
    console.error('플랜 정보 조회 실패:', error)
    planInfo.value = null
  } finally {
    isLoading.value = false
  }
}

// 플랜 참여
const joinPlan = async () => {
  isJoining.value = true
  try {
    const inviteCode = route.query.code
    const response = await inviteService.joinPlan(inviteCode)

    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
      router.push(`/plans/${response.planId}`)
    }, 3000)
  } catch (error) {
    console.error('플랜 참여 실패:', error)
    errorMessage.value = error.response?.data?.message || '플랜 참여에 실패했습니다. 다시 시도해주세요.'
    showErrorToast.value = true
    setTimeout(() => {
      showErrorToast.value = false
    }, 3000)
  } finally {
    isJoining.value = false
  }
}

const goBack = () => router.back()
const goHome = () => router.push('/plans')

onMounted(() => {
  fetchPlanInfo()
})
</script>

<style scoped>
.join-plan-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f2ff;
  padding: 20px;
  position: relative;
}

.success-toast {
  position: fixed;
  top: 80px;
  right: 10px;
  left: 10px;
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
  margin: 0 auto;
}

.success-toast.error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.toast-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.toast-subtitle {
  font-size: 0.75rem;
  opacity: 0.9;
}

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

/* 나머지 스타일은 기존 그대로 유지 */
.join-container {
  width: 100%;
  max-width: 500px;
}


.plan-info-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(142, 106, 217, 0.1);
}

.plan-info-card h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.plan-details {
  background-color: #f7f2ff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.plan-details h3 {
  color: #8e6ad9;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.plan-details p {
  color: #667080;
  margin: 0.5rem 0;
  font-size: 0.95rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.join-button,
.cancel-button {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-button {
  background-color: #8e6ad9;
  color: white;
}

.join-button:hover:not(:disabled) {
  background-color: #7c59c5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.3);
}

.join-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #f3f4f6;
  color: #667080;
}

.cancel-button:hover {
  background-color: #e5e7eb;
}

.error-message {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(142, 106, 217, 0.1);
}

.error-message h3 {
  color: #dc2626;
  margin-bottom: 2rem;
}

.error-message button {
  background-color: #8e6ad9;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.error-message button:hover {
  background-color: #7c59c5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.3);
}

.loading {
  text-align: center;
  color: #8e6ad9;
  font-size: 1.1rem;
}
</style>