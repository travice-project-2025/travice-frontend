<template>
  <div class="plan-detail-page">
    <!-- 헤더 영역 -->
    <div class="page-header">
      <div class="header-content">
        <button @click="goBack" class="back-button">
          <span class="back-icon">←</span>
          목록으로
        </button>
        
        <div class="header-info">
          <div class="title-container">
            <h1 class="page-title">{{ pageTitle }}</h1>
            <span v-if="isEditMode && !isLoading" class="edit-indicator">편집중</span>
          </div>
          <p class="page-subtitle">{{ pageSubtitle }}</p>
          <!-- 모드 설명을 헤더 정보 안으로 이동 -->
          <div class="mode-description" v-if="!isLoading">
            {{
              isEditMode
                ? "일정을 자유롭게 수정할 수 있습니다"
                : "여행 계획을 확인하고 있습니다"
            }}
          </div>
        </div>
        
        <div class="header-actions">
          <!-- 통합된 모드 전환 버튼 -->
          <button
            @click="toggleEditMode"
            class="mode-toggle-button"
            :class="{ 'edit-mode': isEditMode, 'view-mode': !isEditMode }"
            :disabled="isLoading"
          >
            <span class="mode-text">{{ isEditMode ? "보기 모드" : "편집하기" }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <h3>여행 계획을 불러오는 중...</h3>
        <p>잠시만 기다려주세요</p>
      </div>
    </div>

    <!-- 오류 상태 -->
    <div v-else-if="hasError" class="error-container">
      <div class="error-content">
        <div class="error-icon">😥</div>
        <h3>여행 계획을 불러올 수 없습니다</h3>
        <p class="error-message">{{ errorMessage }}</p>
        <div class="error-actions">
          <button @click="retry" class="retry-button">
            <span class="retry-icon">🔄</span>
            다시 시도
          </button>
          <button @click="goBack" class="back-button-error">
            <span class="back-icon">←</span>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div v-else class="main-content">
      <!-- 데이터가 없을 때 -->
      <div v-if="!planData || !planData.title" class="no-data-container">
        <div class="no-data-content">
          <div class="no-data-icon">📋</div>
          <h3>여행 계획 데이터가 없습니다</h3>
          <p>데이터를 불러오는 중 문제가 발생했습니다.</p>
          <button @click="retry" class="retry-button">다시 시도</button>
        </div>
      </div>

      <!-- 보기 모드 -->
      <PlanViewMode
        v-else-if="!isEditMode && planData"
        :plan-data="planData"
      />

      <!-- 편집 모드 -->
      <PlanEditView
        v-else-if="isEditMode && editablePlanData"
        v-model:plan-data="editablePlanData"
        :is-saving="isSaving"
        :show-save-bar="false"
        @save="savePlan"
      />

      <!-- 편집 모드 시 추가 액션 -->
      <div v-if="isEditMode" class="edit-mode-footer">
        <div class="footer-content">
          <div class="edit-info">
            <span class="info-icon">💡</span>
            <div class="info-text">
              <div class="info-title">편집 팁</div>
              <div class="info-description">
                지도에서 장소를 검색하여 추가하거나, 드래그로 순서를 변경할 수
                있습니다
              </div>
            </div>
          </div>
          <div class="edit-actions">
            <button @click="cancelEdit" class="cancel-button">
              취소
            </button>
            <button
              @click="savePlan"
              class="save-button-large"
              :disabled="isSaving"
            >
              <span class="save-icon">💾</span>
              {{ isSaving ? "저장 중..." : "변경사항 저장" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 저장 성공 토스트 -->
    <Transition name="toast">
      <div v-if="showSuccessToast" class="success-toast">
        <span class="toast-icon">✅</span>
        <span class="toast-message"
          >여행 계획이 성공적으로 저장되었습니다!</span
        >
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/userAuth";
import PlanEditView from "@/components/plan/PlanEditView.vue";
import PlanViewMode from "@/components/plan/PlanViewMode.vue";
import { usePlanDetail } from "@/composables/usePlanDetail";
import { usePlanSave } from "@/composables/usePlanSave";

const route = useRoute();
const router = useRouter();
const { checkLoginStatus } = useAuth();

// 상태 관리
const isEditMode = ref(false);
const isSaving = ref(false);
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref("");
const showSuccessToast = ref(false);
const originalPlanData = ref(null); // 편집 취소용
const editablePlanData = ref(null); // 편집용 데이터

// Composables
const { planData, loadPlanDetail } = usePlanDetail();
const { updatePlan } = usePlanSave();

// 컴퓨티드
const pageTitle = computed(() => {
  if (isLoading.value) return "여행 계획 로딩 중...";
  if (hasError.value) return "오류 발생";
  return planData.value?.title || "여행 계획";
});

const pageSubtitle = computed(() => {
  if (isLoading.value || hasError.value) return "";
  return formatDateRange(planData.value?.startDate, planData.value?.endDate);
});

// 라이프사이클
onMounted(async () => {
  await checkLoginStatus();
  await loadPlan();
});

// planData 변경 감지하여 editablePlanData 업데이트
watch(planData, (newValue) => {
  if (newValue && !isEditMode.value) {
    editablePlanData.value = JSON.parse(JSON.stringify(newValue));
  }
}, { deep: true });

// 메서드들
const loadPlan = async () => {
  const planId = route.params.planId;

  if (!planId) {
    hasError.value = true;
    errorMessage.value = "잘못된 계획 ID입니다.";
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = "";

    await loadPlanDetail(planId);

    // 편집용 데이터 복사
    editablePlanData.value = JSON.parse(JSON.stringify(planData.value));
    
    console.log("계획 로드 완료:", planData.value);
  } catch (error) {
    console.error("계획 로드 오류:", error);
    hasError.value = true;
    errorMessage.value = error.message || "여행 계획을 불러올 수 없습니다.";
  } finally {
    isLoading.value = false;
  }
};

const retry = async () => {
  await loadPlan();
};

const goBack = () => {
  if (isEditMode.value && hasChanges()) {
    const confirmed = confirm(
      "저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?"
    );
    if (!confirmed) return;
  }
  router.push("/plans");
};

const toggleEditMode = () => {
  console.log("=== toggleEditMode 시작 ===");
  console.log("현재 isEditMode:", isEditMode.value);
  console.log("현재 planData:", planData.value);
  console.log("현재 editablePlanData:", editablePlanData.value);

  if (!planData.value) {
    console.error("planData가 없습니다.");
    alert("여행 계획 데이터를 먼저 로드해주세요.");
    return;
  }

  if (isEditMode.value && hasChanges()) {
    const confirmed = confirm(
      "저장하지 않은 변경사항이 있습니다. 편집을 취소하시겠습니까?"
    );
    if (!confirmed) {
      console.log("사용자가 취소했습니다.");
      return;
    }

    // 원본 데이터로 복원
    editablePlanData.value = JSON.parse(JSON.stringify(originalPlanData.value));
    console.log("원본 데이터로 복원했습니다.");
  }

  const previousMode = isEditMode.value;
  isEditMode.value = !isEditMode.value;
  console.log(`모드 전환: ${previousMode} → ${isEditMode.value}`);

  // 편집 모드 진입 시 원본 백업
  if (isEditMode.value) {
    console.log("편집 모드로 진입합니다.");
    
    // 원본 데이터 백업
    originalPlanData.value = JSON.parse(JSON.stringify(planData.value));
    
    // editablePlanData가 없으면 생성
    if (!editablePlanData.value) {
      editablePlanData.value = JSON.parse(JSON.stringify(planData.value));
    }
    
    // details 배열 확인 및 초기화
    if (!editablePlanData.value.details) {
      editablePlanData.value.details = [];
    }

    const startDate = editablePlanData.value.startDate;
    const endDate = editablePlanData.value.endDate;

    if (!startDate || !endDate) {
      console.error("시작일 또는 종료일이 없습니다.");
      alert("여행 계획의 날짜 정보가 올바르지 않습니다.");
      isEditMode.value = false;
      return;
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      console.error("날짜 형식이 올바르지 않습니다:", { startDate, endDate });
      alert("여행 계획의 날짜 형식이 올바르지 않습니다.");
      isEditMode.value = false;
      return;
    }

    console.log("편집 모드 진입 완료");
  }
};

const cancelEdit = () => {
  if (hasChanges()) {
    const confirmed = confirm(
      "저장하지 않은 변경사항이 있습니다. 정말 취소하시겠습니까?"
    );
    if (!confirmed) return;
  }

  // 원본 데이터로 복원
  editablePlanData.value = JSON.parse(JSON.stringify(originalPlanData.value));
  isEditMode.value = false;
};

const savePlan = async () => {
  isSaving.value = true;

  try {
    // editablePlanData를 서버에 저장
    await updatePlan(editablePlanData.value);

    // 성공 시 planData와 originalPlanData 업데이트
    planData.value = JSON.parse(JSON.stringify(editablePlanData.value));
    originalPlanData.value = JSON.parse(JSON.stringify(editablePlanData.value));

    // 성공 토스트 표시
    showSuccessToast.value = true;
    setTimeout(() => {
      showSuccessToast.value = false;
    }, 3000);

    // 보기 모드로 전환
    isEditMode.value = false;
  } catch (error) {
    console.error("저장 오류:", error);
    alert(`여행 계획을 저장하는 중 오류가 발생했습니다: ${error.message}`);
  } finally {
    isSaving.value = false;
  }
};

// 변경사항 감지
const hasChanges = () => {
  if (!originalPlanData.value || !editablePlanData.value) return false;
  return (
    JSON.stringify(editablePlanData.value) !== JSON.stringify(originalPlanData.value)
  );
};

const formatDateRange = (startDate, endDate) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };
  return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
};

// 페이지 이탈 시 확인
window.addEventListener("beforeunload", (e) => {
  if (isEditMode.value && hasChanges()) {
    e.preventDefault();
    e.returnValue = "";
  }
});
</script>

<style scoped>
.plan-detail-page {
  min-height: 100vh;
  background-color: #f9fafb;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-info {
  flex: 1;
  margin: 0 1rem;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  font-family: "Marines", "Pretendard", sans-serif;
}

.edit-indicator {
  font-size: 0.75rem;
  color: #9ca3af;
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.page-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.mode-description {
  margin: 0.25rem 0 0 0;
  font-size: 0.75rem;
  color: #9ca3af;
}

/* 헤더 액션 */
.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.back-button {
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
  font-family: "Marines", "Pretendard", sans-serif;
  background-color: #f3f4f6;
  color: #4b5563;
}

.back-button:hover {
  background-color: #e5e7eb;
  transform: translateY(-1px);
}

/* 모드 전환 버튼 */
.mode-toggle-button {
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
  font-family: "Marines", "Pretendard", sans-serif;
}

.mode-toggle-button.view-mode {
  background-color: #dbeafe;
  color: #1e40af;
}

.mode-toggle-button.edit-mode {
  background-color: #fef3c7;
  color: #d97706;
}

.mode-toggle-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.mode-toggle-button:disabled {
  background-color: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

/* 로딩 상태 */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
}

.loading-content {
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #a78bda;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-content h3 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-family: "Marines", "Pretendard", sans-serif;
}

.loading-content p {
  margin: 0;
  color: #718096;
}

/* 오류 상태 */
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
}

.error-content {
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-content h3 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-family: "Marines", "Pretendard", sans-serif;
}

.error-message {
  margin: 0 0 2rem 0;
  color: #718096;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.retry-button,
.back-button-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Marines", "Pretendard", sans-serif;
}

.retry-button {
  background-color: #a78bda;
  color: white;
}

.retry-button:hover {
  background-color: #9979d5;
  transform: translateY(-1px);
}

.back-button-error {
  background-color: #f3f4f6;
  color: #4b5563;
}

.back-button-error:hover {
  background-color: #e5e7eb;
  transform: translateY(-1px);
}

/* 메인 콘텐츠 */
.main-content {
  position: relative;
}

.no-data-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
}

.no-data-content {
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.no-data-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

/* 편집 모드 푸터 */
.edit-mode-footer {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.05);
  z-index: 20;
}

.footer-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.edit-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.info-icon {
  font-size: 1.5rem;
}

.info-text {
  flex: 1;
}

.info-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.info-description {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
}

.edit-actions {
  display: flex;
  gap: 0.75rem;
}

.cancel-button,
.save-button-large {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Marines", "Pretendard", sans-serif;
}

.cancel-button {
  background-color: #f3f4f6;
  color: #4b5563;
}

.cancel-button:hover {
  background-color: #e5e7eb;
  transform: translateY(-1px);
}

.save-button-large {
  background-color: #10b981;
  color: white;
}

.save-button-large:hover:not(:disabled) {
  background-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2);
}

.save-button-large:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

/* 성공 토스트 */
.success-toast {
  position: fixed;
  top: 100px;
  right: 20px;
  background-color: #10b981;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 100;
  font-weight: 500;
}

.toast-icon {
  font-size: 1.25rem;
}

/* 토스트 애니메이션 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 반응형 */
@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .back-button {
    order: -1;
    width: 100%;
  }

  .header-info {
    order: 0;
    margin: 0;
  }

  .header-actions {
    order: 1;
    margin-left: auto;
  }

  .title-container {
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .edit-indicator {
    font-size: 0.625rem;
    padding: 0.125rem 0.375rem;
  }

  .header-actions button {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }

  .footer-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .edit-actions {
    width: 100%;
  }

  .cancel-button,
  .save-button-large {
    flex: 1;
  }

  .error-content,
  .loading-content {
    padding: 2rem;
    margin: 1rem;
  }

  .error-actions {
    flex-direction: column;
  }

  .retry-button,
  .back-button-error {
    width: 100%;
    justify-content: center;
  }

  .success-toast {
    right: 10px;
    left: 10px;
    top: 80px;
  }
}
</style>