<template>
  <div class="plans-page">
    <AppHeader :is-shrunk="isScrolled" />
    <main class="container main-content">
      <!-- 사용자 환영 메시지 -->
      <div class="welcome-section">
        <h1 class="welcome-title">
          안녕하세요,
          <span class="highlight">{{
            userNickname ? userNickname : userName
          }}</span
          >님!
        </h1>
        <p class="welcome-subtitle">여행 계획을 생성하거나 관리해보세요</p>
      </div>

      <!-- 여행 계획이 없을 때 - 중앙 배치된 새 여행 추가 블록 -->
      <div v-if="!hasPlans && !isLoading" class="empty-state">
        <div class="empty-card" @click="goToCreate">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5 12H19"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="create-text">새 여행</span>
        </div>
        <p class="empty-text">
          아직 여행 일정이 없습니다. 첫 여행을 계획해보세요!
        </p>
      </div>

      <!-- 여행 계획 목록 (로딩 중 상태) -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>여행 계획을 불러오는 중...</p>
      </div>

      <!-- 여행 계획 목록 그리드 -->
      <div v-if="hasPlans && !isLoading" class="plans-grid">
        <!-- 여행 계획 카드들 -->
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="plan-card"
          @click="viewPlanDetails(plan.id)"
        >
          <div class="plan-image" @click.stop>
            <img :src="plan.thumbnail || defaultPlanImage" alt="여행 이미지" />
            <!-- 이미지 수정 버튼 (호버 시에만 표시) -->
            <div class="image-edit-overlay">
              <button
                @click="openImageEdit(plan)"
                class="image-edit-btn"
                title="이미지 변경"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="plan-info">
            <h3>{{ plan.title }}</h3>
            <p class="plan-date">
              {{ formatDate(plan.startDate) }} - {{ formatDate(plan.endDate) }}
            </p>
            <p class="plan-location">{{ getCityName(plan.cityName) }}</p>
            <div class="plan-meta">
              <span class="member-count">인원: {{ plan.memberCount }}명</span>
              <span
                class="visibility-badge"
                :class="{ private: !plan.isPublic }"
              >
                {{ plan.isPublic ? "공개" : "비공개" }}
              </span>
            </div>
          </div>
        </div>

        <!-- 새 여행 추가 카드 -->
        <div class="plan-card add-card" @click="goToCreate">
          <div class="add-icon">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5 12H19"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <p class="add-text">새로 여행을 추가해보세요</p>
        </div>
      </div>

      <!-- 오류 메시지 -->
      <div v-if="apiError" class="error-container">
        <div class="error-content">
          <div class="error-icon">😥</div>
          <h3>데이터를 불러올 수 없습니다</h3>
          <p class="error-message">{{ apiErrorMessage }}</p>
          <div class="error-actions">
            <button @click="fetchPlans" class="retry-button">다시 시도</button>
          </div>
        </div>
      </div>

      <!-- 프로필 설정 안내 모달 -->
      <div v-if="showProfileModal" class="modal-overlay">
        <div class="profile-modal">
          <div class="modal-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="#8e6ad9"
                strokeWidth="2"
              />
              <path
                d="M12 16V12"
                stroke="#8e6ad9"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="8" r="1" fill="#8e6ad9" />
            </svg>
          </div>
          <h3 class="modal-title">개인 정보를 설정하시겠어요?</h3>
          <div class="modal-description">
            나이와 성별을 설정하시면<br />
            더 정확한 AI 맞춤 여행 추천을 받으실 수 있습니다.
          </div>
          <div class="modal-buttons">
            <button class="modal-button secondary" @click="continueToCreate">
              다음에 설정하기
            </button>
            <button class="modal-button primary" @click="goToProfile">
              개인 정보 설정하기
            </button>
          </div>
        </div>
      </div>

      <!-- 이미지 수정 모달 -->
      <div
        v-if="showImageEditModal"
        class="modal-overlay"
        @click="closeImageEdit"
      >
        <div class="image-edit-modal" @click.stop>
          <div class="modal-header">
            <h3>여행 이미지 변경</h3>
            <button @click="closeImageEdit" class="close-button">✕</button>
          </div>
          <div class="modal-body">
            <div class="current-image">
              <img
                :src="selectedPlan?.thumbnail || defaultPlanImage"
                alt="현재 이미지"
              />
              <p class="image-label">현재 이미지</p>
            </div>

            <div class="image-upload-section">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleImageSelect"
                style="display: none"
              />
              <button @click="$refs.fileInput.click()" class="upload-button">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <polyline
                    points="7,10 12,15 17,10"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <line
                    x1="12"
                    y1="15"
                    x2="12"
                    y2="3"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
                새 이미지 선택
              </button>

              <!-- 미리보기 -->
              <div v-if="previewImage" class="preview-section">
                <img :src="previewImage" alt="미리보기" />
                <p class="image-label">미리보기</p>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="closeImageEdit" class="cancel-button">취소</button>
            <button
              @click="updatePlanImage"
              :disabled="!previewImage || isUpdating"
              class="save-button"
            >
              {{ isUpdating ? "저장 중..." : "저장" }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "@/components/common/AppHeader.vue";
import { useAuth } from "../composables/userAuth";
import axios from "axios";
// 디폴트 이미지 import
import defaultPlanImage from "@/assets/images/default_plan.png";

const router = useRouter();

// 모달 상태 관리
const showProfileModal = ref(false);
const userAge = ref(null);

// 인증 컴포저블 사용
const {
  loggedIn,
  userName,
  userNickname,
  checkLoginStatus,
  logout,
  goToLogin,
} = useAuth();

// 반응형 상태 정의
const isScrolled = ref(false);
const isLoading = ref(true);
const hasPlans = ref(false);
const plans = ref([]);
const apiError = ref(false);
const apiErrorMessage = ref("");

// 이미지 수정 관련 상태들
const showImageEditModal = ref(false);
const selectedPlan = ref(null);
const previewImage = ref(null);
const selectedFile = ref(null);
const isUpdating = ref(false);

// API URL
const API_URL = "http://localhost:8080/api/v1/plans";

// 사용자 정보 가져오기
const fetchUserInfo = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/v1/users/me", {
      withCredentials: true,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.data) {
      userAge.value = response.data.age || 0;
      console.log("사용자 나이:", userAge.value);
    }
  } catch (error) {
    console.error("사용자 정보를 불러오는 중 오류 발생:", error);
  }
};

// 새 여행 생성 페이지로 이동 (수정됨)
const goToCreate = async () => {
  // 사용자 나이가 설정되지 않았다면 모달 표시
  if (userAge.value === 0) {
    showProfileModal.value = true;
  } else {
    // 바로 생성 페이지로 이동
    router.push("/create-plan");
  }
};

// 계속해서 생성 페이지로 이동
const continueToCreate = () => {
  showProfileModal.value = false;
  router.push("/create-plan");
};

// 프로필 페이지로 이동
const goToProfile = () => {
  showProfileModal.value = false;
  router.push("/profile");
};

// 여행 상세보기 페이지로 이동 (수정됨)
const viewPlanDetails = (planId) => {
  router.push(`/plans/${planId}`);
};

// 이미지 수정 모달 열기
const openImageEdit = (plan) => {
  selectedPlan.value = plan;
  showImageEditModal.value = true;
  previewImage.value = null;
  selectedFile.value = null;
};

// 이미지 수정 모달 닫기
const closeImageEdit = () => {
  showImageEditModal.value = false;
  selectedPlan.value = null;
  previewImage.value = null;
  selectedFile.value = null;
};

// 이미지 파일 선택 처리
const handleImageSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하로 선택해주세요.");
      return;
    }

    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다.");
      return;
    }

    selectedFile.value = file;

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 이미지 업데이트 (실제 API 호출)
const updatePlanImage = async () => {
  if (!selectedFile.value || !selectedPlan.value) return;

  isUpdating.value = true;

  try {
    const formData = new FormData();
    formData.append("image", selectedFile.value);

    // API 호출 (실제 엔드포인트에 맞게 수정 필요)
    const response = await axios.put(
      `${API_URL}/${selectedPlan.value.id}/image`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // 성공 시 로컬 상태 업데이트
    const planIndex = plans.value.findIndex(
      (p) => p.id === selectedPlan.value.id
    );
    if (planIndex !== -1) {
      plans.value[planIndex].thumbnail =
        response.data.thumbnailUrl || previewImage.value;
    }

    closeImageEdit();

    // 성공 메시지 (선택사항)
    console.log("이미지가 성공적으로 업데이트되었습니다.");
  } catch (error) {
    console.error("이미지 업데이트 중 오류 발생:", error);
    alert("이미지 업데이트에 실패했습니다. 다시 시도해주세요.");
  } finally {
    isUpdating.value = false;
  }
};

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

// 날짜 형식 변환 함수
const formatDate = (dateString) => {
  if (!dateString) return "날짜 미정";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "날짜 형식 오류";
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    console.error("날짜 변환 오류:", error);
    return "날짜 형식 오류";
  }
};

const getCityName = (cityId) => {
  const cityMap = {
    1: "서울",
    2: "부산",
    3: "제주",
    4: "강릉",
    5: "경주",
    6: "전주",
    7: "속초",
    8: "여수",
    9: "수원",
    10: "인천",
    11: "대구",
    12: "대전",
    13: "광주",
    14: "울산",
    15: "안동",
    16: "양양",
    17: "고성",
    18: "가평",
    19: "순천",
    20: "남해",
    21: "목포",
    22: "천안",
    23: "보성",
    24: "포항",
    25: "무주",
  };
  return cityMap[cityId] || "알 수 없는 지역";
};

// 여행 계획 데이터 가져오기
const fetchPlans = async () => {
  console.log("여행 계획 가져오기 시작");
  isLoading.value = true;
  apiError.value = false;

  try {
    const response = await axios.get(API_URL, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("API 응답 받음:", response);

    // 데이터 받아오기 성공
    if (response.data && Array.isArray(response.data)) {
      plans.value = response.data;
      hasPlans.value = plans.value.length > 0;
      console.log("받아온 여행 계획 데이터:", plans.value);
    } else {
      console.warn("API 응답이 배열이 아닙니다:", response.data);
      throw new Error("잘못된 데이터 형식");
    }
  } catch (error) {
    console.error("여행 계획을 불러오는 중 오류 발생:", error);
    apiError.value = true;
    apiErrorMessage.value =
      "데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.";

    if (error.response?.status === 401) {
      apiErrorMessage.value = "인증이 필요합니다. 다시 로그인해주세요.";
    }
  } finally {
    isLoading.value = false;
  }
};

// 라이프사이클 훅
onMounted(async () => {
  await checkLoginStatus();
  await fetchUserInfo();
  await fetchPlans();
  window.addEventListener("scroll", handleScroll);
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
/* 기존 스타일들 */
.plans-page {
  padding-top: 60px;
  min-height: 100vh;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.welcome-section {
  margin-bottom: 40px;
  text-align: center;
}

.welcome-title {
  font-size: 28px;
  margin-bottom: 8px;
}

.highlight {
  color: #8e6ad9;
}

.welcome-subtitle {
  font-size: 16px;
  color: #666;
}

/* 여행 계획이 없을 때 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
}

.empty-card {
  width: 180px;
  height: 180px;
  background-color: #8e6ad9;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.empty-card:hover {
  transform: scale(1.05);
}

.create-text {
  color: white;
  font-size: 18px;
  margin-top: 12px;
}

.empty-text {
  font-size: 16px;
  color: #666;
}

/* 로딩 상태 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #8e6ad9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 여행 계획 그리드 */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 28px;
}

.plan-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(142, 106, 217, 0.15);
}

/* 이미지 수정 관련 스타일 */
.plan-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.plan-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-edit-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.plan-card:hover .image-edit-overlay {
  opacity: 1;
}

.image-edit-btn {
  width: 32px;
  height: 32px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.image-edit-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.plan-info {
  padding: 20px;
}

.plan-info h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.plan-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.plan-location {
  font-size: 14px;
  color: #8e6ad9;
  margin-bottom: 8px;
}

.plan-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  font-size: 13px;
}

.member-count {
  color: #666;
}

.visibility-badge {
  background-color: #a5f3c0;
  color: #0d5030;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.visibility-badge.private {
  background-color: #ffe0e0;
  color: #b42424;
}

/* 새 여행 추가 카드 */
.add-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f7f2ff;
  min-height: 276px;
  border: 2px dashed #a78bfa;
}

.add-icon {
  background-color: #8e6ad9;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.add-text {
  font-size: 16px;
  color: #4b5563;
}

/* 모달 기본 스타일 */
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
  z-index: 100;
}

/* 프로필 모달 스타일 */
.profile-modal {
  background-color: white;
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: modal-appear 0.3s ease;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-icon {
  margin-bottom: 20px;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
}

.modal-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 25px;
  line-height: 1.5;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.modal-button {
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.modal-button.primary {
  background-color: #8e6ad9;
  color: white;
}

.modal-button.primary:hover {
  background-color: #7c59c5;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(142, 106, 217, 0.15);
}

.modal-button.secondary {
  background-color: #f0ebfa;
  color: #8e6ad9;
}

.modal-button.secondary:hover {
  background-color: #e4daff;
  transform: translateY(-2px);
}

/* 이미지 수정 모달 스타일 */
.image-edit-modal {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.current-image {
  text-align: center;
  margin-bottom: 2rem;
}

.current-image img {
  width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
}

.image-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.image-upload-section {
  text-align: center;
}

.upload-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #8e6ad9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;
}

.upload-button:hover {
  background-color: #7c5bd0;
  transform: translateY(-1px);
}

.preview-section {
  margin-top: 1rem;
}

.preview-section img {
  width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background-color: #e5e7eb;
}

.save-button {
  padding: 0.75rem 1.5rem;
  background-color: #8e6ad9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-button:hover:not(:disabled) {
  background-color: #7c5bd0;
  transform: translateY(-1px);
}

.save-button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

/* 오류 처리 스타일 */
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  margin: 2rem 0;
}

.error-content {
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 400px;
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
  justify-content: center;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background-color: #a78bda;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Marines", "Pretendard", sans-serif;
}

.retry-button:hover {
  background-color: #9979d5;
  transform: translateY(-1px);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .main-content {
    padding: 20px 15px;
  }

  .welcome-title {
    font-size: 24px;
  }

  .plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    align-items: stretch;
  }

  .image-edit-modal {
    width: 95%;
    max-height: 90vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }

  .current-image img,
  .preview-section img {
    width: 160px;
    height: 96px;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .profile-modal {
    width: 95%;
    padding: 20px;
  }

  .image-edit-btn {
    width: 28px;
    height: 28px;
  }

  .image-edit-btn svg {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 480px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }

  .welcome-title {
    font-size: 20px;
  }

  .welcome-subtitle {
    font-size: 14px;
  }

  .empty-card {
    width: 150px;
    height: 150px;
  }

  .create-text {
    font-size: 16px;
  }
}
</style>