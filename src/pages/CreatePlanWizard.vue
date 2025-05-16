<!-- CreatePlanWizard.vue 템플릿 부분 -->
<template>
  <div class="wizard-container">
    <AppHeader :is-shrunk="true" />

    <div class="wizard-progress">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      <div class="step-indicators">
        <div
          v-for="step in 6"
          :key="step"
          class="step-indicator"
          :class="{
            active: currentStep >= step,
            current: currentStep === step,
          }"
          @click="goToStep(step)"
        >
          {{ step }}
        </div>
      </div>
    </div>

    <!-- 단계별 컴포넌트 -->
    <div class="wizard-content">
      <transition name="fade" mode="out-in">
        <!-- 1단계: 여행 기간 -->
        <div v-if="currentStep === 1" class="step-content">
          <h2 class="step-title">여행 기간을 선택해주세요</h2>

          <div class="date-picker-container">
            <div class="date-picker">
              <label for="start-date">시작일</label>
              <DatePicker
                v-model="tripData.startDate"
                :min-date="today"
                @update:model-value="calculateDuration"
                :masks="masks"
                color="purple"
                is-expanded
                trim-weeks
                class="custom-datepicker"
              />
            </div>

            <div class="date-picker">
              <label for="end-date">종료일</label>
              <DatePicker
                v-model="tripData.endDate"
                :min-date="tripData.startDate || today"
                @update:model-value="calculateDuration"
                :masks="masks"
                color="purple"
                is-expanded
                trim-weeks
                class="custom-datepicker"
              />
            </div>
          </div>

          <div v-if="tripDuration > 0" class="trip-duration">
            총 <span class="duration-highlight">{{ tripDuration }}</span
            >일 여행입니다
          </div>
        </div>

        <!-- 2단계: 인원 수 + 여행 목적 -->
        <div v-else-if="currentStep === 2" class="step-content">
          <h2 class="step-title">인원 수와 여행 목적을 선택해주세요</h2>

          <div class="people-count-container">
            <label for="people-count">인원 수</label>
            <select
              id="people-count"
              v-model="tripData.peopleCount"
              class="people-dropdown"
            >
              <option value="1">1명</option>
              <option value="2">2명</option>
              <option value="3">3명</option>
              <option value="4">4명</option>
              <option value="5">5명</option>
              <option value="6">6명 이상</option>
            </select>
          </div>

          <h3 class="subsection-title">여행 목적</h3>
          <div class="trip-purpose-grid">
            <div
              v-for="purpose in tripPurposes"
              :key="purpose.code"
              class="trip-purpose-card"
              :class="{ selected: tripData.purpose === purpose.code }"
              @click="tripData.purpose = purpose.code"
            >
              <div class="purpose-content">
                <div class="purpose-code">{{ purpose.code }}</div>
                <div class="purpose-label">{{ purpose.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3단계: 지역 선택 -->
        <div v-else-if="currentStep === 3" class="step-content">
          <h2 class="step-title">여행 지역을 선택해주세요</h2>

          <div class="region-grid">
            <div
              v-for="region in filteredRegions"
              :key="region.code"
              class="region-card"
              :class="{ selected: tripData.region === region.code }"
              @click="tripData.region = region.code"
            >
              {{ region.name }}
            </div>
          </div>
        </div>

        <!-- 4단계: 이동 수단 -->
        <div v-else-if="currentStep === 4" class="step-content">
          <h2 class="step-title">이동 수단을 선택해주세요</h2>
          <p class="step-description">복수 선택 가능합니다</p>

          <div class="transportation-grid">
            <div
              v-for="transport in transportations"
              :key="transport.id"
              class="transport-card"
              :class="{
                selected: tripData.transportation.includes(transport.id),
              }"
              @click="toggleTransportation(transport.id)"
            >
              <div class="transport-icon">
                <span v-html="transport.icon"></span>
              </div>
              <div class="transport-label">{{ transport.label }}</div>
            </div>
          </div>
        </div>

        <!-- 5단계: 여행 컨셉 -->
        <div v-else-if="currentStep === 5" class="step-content">
          <h2 class="step-title">여행 컨셉을 선택해주세요</h2>

          <div class="concept-grid">
            <div
              v-for="concept in tripConcepts"
              :key="concept.code"
              class="concept-card"
              :class="{ selected: tripData.concept === concept.code }"
              @click="tripData.concept = concept.code"
            >
              <div class="concept-content">
                <div class="concept-code">{{ concept.code }}</div>
                <div class="concept-label">{{ concept.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 6단계: MBTI 선택 -->
        <div v-else-if="currentStep === 6" class="step-content">
          <h2 class="step-title">여행 성향을 알려주세요</h2>
          <p class="step-description">MBTI 유형을 선택해주세요</p>

          <div class="mbti-selector">
            <div class="mbti-row">
              <div class="mbti-option">
                <button
                  :class="{ active: tripData.mbti.includes('E') }"
                  @click="toggleMbtiOption('E', 'I')"
                >
                  E
                </button>
                <div class="mbti-description">외향적</div>
              </div>
              <div class="mbti-vs">VS</div>
              <div class="mbti-option">
                <button
                  :class="{ active: tripData.mbti.includes('I') }"
                  @click="toggleMbtiOption('I', 'E')"
                >
                  I
                </button>
                <div class="mbti-description">내향적</div>
              </div>
            </div>

            <div class="mbti-row">
              <div class="mbti-option">
                <button
                  :class="{ active: tripData.mbti.includes('S') }"
                  @click="toggleMbtiOption('S', 'N')"
                >
                  S
                </button>
                <div class="mbti-description">현실적</div>
              </div>
              <div class="mbti-vs">VS</div>
              <div class="mbti-option">
                <button
                  :class="{ active: tripData.mbti.includes('N') }"
                  @click="toggleMbtiOption('N', 'S')"
                >
                  N
                </button>
                <div class="mbti-description">직관적</div>
              </div>
            </div>

            <div class="mbti-row">
              <div class="mbti-option">
                <button
                  :class="{ active: tripData.mbti.includes('T') }"
                  @click="toggleMbtiOption('T', 'F')"
                >
                  T
                </button>
                <div class="mbti-description">논리적</div>
              </div>
              <div class="mbti-vs">VS</div>
              <div class="mbti-option">
                <button
                  :class="{ active: tripData.mbti.includes('F') }"
                  @click="toggleMbtiOption('F', 'T')"
                >
                  F
                </button>
                <div class="mbti-description">감정적</div>
              </div>
            </div>

            <div class="mbti-row">
              <div class="mbti-option">
                <button
                  :class="{ active: tripData.mbti.includes('J') }"
                  @click="toggleMbtiOption('J', 'P')"
                >
                  J
                </button>
                <div class="mbti-description">계획적</div>
              </div>
              <div class="mbti-vs">VS</div>
              <div class="mbti-option">
                <button
                  :class="{ active: tripData.mbti.includes('P') }"
                  @click="toggleMbtiOption('P', 'J')"
                >
                  P
                </button>
                <div class="mbti-description">즉흥적</div>
              </div>
            </div>

            <div class="mbti-result" v-if="tripData.mbti.length === 4">
              선택한 MBTI:
              <span class="mbti-highlight">{{ tripData.mbti }}</span>
            </div>
          </div>
        </div>

        <!-- 최종 확인 단계 -->
        <div v-else-if="currentStep === 7" class="step-content">
          <h2 class="step-title">여행 취향 분석 준비 완료!</h2>

          <div class="summary-container">
            <div class="summary-card">
              <h3>여행 정보 요약</h3>
              <div class="summary-item">
                <div class="summary-label">기간</div>
                <div class="summary-value">
                  {{ formatDate(tripData.startDate) }} -
                  {{ formatDate(tripData.endDate) }} ({{ tripDuration }}일)
                </div>
              </div>
              <div class="summary-item">
                <div class="summary-label">인원</div>
                <div class="summary-value">{{ tripData.peopleCount }}명</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">목적</div>
                <div class="summary-value">
                  {{ getPurposeLabel(tripData.purpose) }}
                </div>
              </div>
              <div class="summary-item">
                <div class="summary-label">지역</div>
                <div class="summary-value">
                  {{ getRegionName(tripData.region) }}
                </div>
              </div>
              <div class="summary-item">
                <div class="summary-label">이동수단</div>
                <div class="summary-value">
                  {{ getTransportationLabels().join(", ") }}
                </div>
              </div>
              <div class="summary-item">
                <div class="summary-label">컨셉</div>
                <div class="summary-value">
                  {{ getConceptLabel(tripData.concept) }}
                </div>
              </div>
              <div class="summary-item">
                <div class="summary-label">MBTI</div>
                <div class="summary-value">{{ tripData.mbti }}</div>
              </div>
            </div>
          </div>

          <div class="generating-message">
            <div class="loading-spinner"></div>
            <p>AI를 통해 맞춤형 여행 계획을 생성 중입니다...</p>
          </div>
        </div>
      </transition>
    </div>

    <!-- 하단 네비게이션 버튼 -->
    <div class="wizard-navigation">
      <button
        v-if="currentStep > 1 && currentStep < 7"
        class="navigation-button back-button"
        @click="prevStep"
      >
        이전
      </button>
      <button
        v-if="currentStep < 7"
        class="navigation-button next-button"
        @click="nextStep"
        :disabled="!canGoNext"
      >
        {{ currentStep === 6 ? "완료" : "다음" }}
      </button>
    </div>
  </div>
</template>

<!-- CreatePlanWizard.vue 스크립트 부분 -->
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "@/components/common/AppHeader.vue";
import { DatePicker } from "v-calendar";



// 라우터 설정
const router = useRouter();

// 현재 단계 및 진행도
const currentStep = ref(1);
const progressPercentage = computed(() => (currentStep.value - 1) * 20); // 5단계 = 20%씩

// 오늘 날짜 (YYYY-MM-DD 형식)
const today = new Date();

// 날짜 형식 마스크 추가
const masks = {
  input: 'YYYY년 MM월 DD일',
  title: 'YYYY년 MM월'
};

// 여행 정보 데이터
const tripData = ref({
  startDate: null,
  endDate: null,
  peopleCount: "2",
  purpose: "",
  region: "",
  transportation: [],
  concept: "",
  mbti: "",
});

// 여행 기간 계산
const tripDuration = ref(0);
const calculateDuration = () => {
  if (tripData.value.startDate && tripData.value.endDate) {
    // Date 객체 처리
    const start = tripData.value.startDate instanceof Date 
      ? tripData.value.startDate 
      : new Date(tripData.value.startDate);
      
    const end = tripData.value.endDate instanceof Date 
      ? tripData.value.endDate 
      : new Date(tripData.value.endDate);
      
    const difference = end - start;
    tripDuration.value = Math.round(difference / (1000 * 60 * 60 * 24)) + 1; // 당일도 1일로 계산
  }
};

// 지역 검색
const regionSearch = ref('');
const filteredRegions = computed(() => {
  if (!regionSearch.value) return regions;
  return regions.filter(region => 
    region.name.toLowerCase().includes(regionSearch.value.toLowerCase())
  );
});

// 다음 단계로 넘어갈 수 있는지 검증
const canGoNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return (
        tripData.value.startDate &&
        tripData.value.endDate &&
        tripDuration.value > 0
      );
    case 2:
      return tripData.value.peopleCount && tripData.value.purpose;
    case 3:
      return tripData.value.region;
    case 4:
      return tripData.value.transportation.length > 0;
    case 5:
      return tripData.value.concept;
    case 6:
      return tripData.value.mbti.length === 4; // MBTI 모든 요소 선택 시
    default:
      return true;
  }
});

// 단계 이동 함수
const nextStep = () => {
  if (canGoNext.value && currentStep.value < 7) {
    currentStep.value++;

    // 마지막 단계 도달 시 데이터 제출
    if (currentStep.value === 7) {
      submitTripData();
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const goToStep = (step) => {
  // 이미 완료된 단계나 현재 단계로만 이동 가능
  if (step <= Math.max(currentStep.value, 2)) {
    currentStep.value = step;
  }
};

// 이동수단 토글 함수
const toggleTransportation = (id) => {
  const index = tripData.value.transportation.indexOf(id);
  if (index === -1) {
    tripData.value.transportation.push(id);
  } else {
    tripData.value.transportation.splice(index, 1);
  }
};

// MBTI 옵션 토글 함수
const toggleMbtiOption = (option, opposite) => {
  let mbti = tripData.value.mbti;

  // 반대 옵션 제거
  mbti = mbti.replace(opposite, "");

  // 현재 옵션이 없으면 추가
  if (!mbti.includes(option)) {
    mbti += option;
  }

  // MBTI 순서 맞추기 (E/I-S/N-T/F-J/P)
  const order = { E: 0, I: 0, S: 1, N: 1, T: 2, F: 2, J: 3, P: 3 };
  mbti = [...mbti].sort((a, b) => order[a] - order[b]).join("");

  tripData.value.mbti = mbti;
};

// 데이터 제출 함수 (GPT에 전송)
const submitTripData = () => {
  // 실제 구현 시 API 호출
  console.log("제출된 여행 데이터:", tripData.value);

  // 5초 후 결과 페이지로 이동 (데모용)
  setTimeout(() => {
    router.push("/plans"); // 결과 페이지로 이동
  }, 5000);
};

// 날짜 포맷팅 (YYYY-MM-DD -> YYYY년 MM월 DD일)
const formatDate = (dateString) => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");
  return `${year}년 ${month}월 ${day}일`;
};

// 여행 목적 라벨 가져오기
const getPurposeLabel = (code) => {
  const purpose = tripPurposes.find((p) => p.code === code);
  return purpose ? purpose.label : "";
};

// 지역 이름 가져오기
const getRegionName = (code) => {
  const region = regions.find((r) => r.code === code);
  return region ? region.name : "";
};

// 이동수단 라벨 가져오기
const getTransportationLabels = () => {
  return tripData.value.transportation.map((id) => {
    const transport = transportations.find((t) => t.id === id);
    return transport ? transport.label : "";
  });
};

// 컨셉 라벨 가져오기
const getConceptLabel = (code) => {
  const concept = tripConcepts.find((c) => c.code === code);
  return concept ? concept.label : "";
};

// 데이터 목록
const tripPurposes = [
  { code: "solo", label: "혼자 여행" },
  { code: "couple", label: "커플 여행" },
  { code: "family", label: "가족 여행" },
  { code: "friends", label: "친구들과 여행" },
  { code: "pet", label: "반려동물 동반 여행" },
  { code: "senior", label: "부모님/효도 여행" },
  { code: "team", label: "단체/워크숍/MT" },
];

const regions = [
  { code: "seoul", name: "서울" },
  { code: "busan", name: "부산" },
  { code: "jeju", name: "제주" },
  { code: "gangneung", name: "강릉" },
  { code: "gyeongju", name: "경주" },
  { code: "jeonju", name: "전주" },
  { code: "sokcho", name: "속초" },
  { code: "yeosu", name: "여수" },
  { code: "suwon", name: "수원" },
  { code: "incheon", name: "인천" },
  { code: "daegu", name: "대구" },
  { code: "daejeon", name: "대전" },
  { code: "gwangju", name: "광주" },
  { code: "ulsan", name: "울산" },
  { code: "andong", name: "안동" },
];

const transportations = [
  {
    id: "car",
    label: "자가용",
    icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16.5H17C19.2091 16.5 21 14.7091 21 12.5V12.5C21 10.2909 19.2091 8.5 17 8.5H7C4.79086 8.5 3 10.2909 3 12.5V12.5C3 14.7091 4.79086 16.5 7 16.5Z" /><path d="M5.5 16.5V19.5" /><path d="M18.5 16.5V19.5" /><path d="M6 11H8" /><path d="M16 11H18" /><path d="M3 13.5H21" /></svg>',
  },
  {
    id: "public",
    label: "대중교통",
    icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 18H17C18.6569 18 20 16.6569 20 15V7C20 5.34315 18.6569 4 17 4H7C5.34315 4 4 5.34315 4 7V15C4 16.6569 5.34315 18 7 18Z" /><path d="M5 11H19" /><path d="M8 21L8 18" /><path d="M16 21L16 18" /><path d="M7 8H9" /><path d="M15 8H17" /><path d="M7 14.5C7 15.0523 7.44772 15.5 8 15.5H9C9.55228 15.5 10 15.0523 10 14.5V14.5C10 13.9477 9.55228 13.5 9 13.5H8C7.44772 13.5 7 13.9477 7 14.5V14.5Z" /><path d="M14 14.5C14 15.0523 14.4477 15.5 15 15.5H16C16.5523 15.5 17 15.0523 17 14.5V14.5C17 13.9477 16.5523 13.5 16 13.5H15C14.4477 13.5 14 13.9477 14 14.5V14.5Z" /></svg>',
  },
  {
    id: "walk",
    label: "도보",
    icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5.5" r="2.5" /><path d="M11 20L12 13.5L10 9.5L12.5 8L15 10L16.5 13L18.5 20" /><path d="M9 14L8 20" /></svg>',
  },
  {
    id: "bicycle",
    label: "자전거",
    icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="17" r="4" /><circle cx="18" cy="17" r="4" /><path d="M6 17L12 7H15" /><path d="M12 17L9 12M12 17H18" /><path d="M15 5.5C15 6.32843 14.3284 7 13.5 7C12.6716 7 12 6.32843 12 5.5C12 4.67157 12.6716 4 13.5 4C14.3284 4 15 4.67157 15 5.5Z" /></svg>',
  },
  {
    id: "taxi",
    label: "택시",
    icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 17H18C19.1046 17 20 16.1046 20 15V12C20 10.8954 19.1046 10 18 10H6C4.89543 10 4 10.8954 4 12V15C4 16.1046 4.89543 17 6 17Z" /><rect x="7" y="17" width="2" height="2" /><rect x="15" y="17" width="2" height="2" /><path d="M14.8 7L16.8 10H7.2L9.2 7H14.8Z" /><path d="M5 14H19" /><path d="M6.2 14L6.8 12" /><path d="M17.8 14L17.2 12" /></svg>',
  },
];

const tripConcepts = [
  { code: "food", label: "맛집 탐방" },
  { code: "cafe", label: "카페 투어" },
  { code: "photo", label: "사진 명소 중심" },
  { code: "activity", label: "액티비티" },
  { code: "healing", label: "조용한 휴식" },
  { code: "shopping", label: "쇼핑 중심" },
  { code: "culture", label: "역사/문화 탐방" },
  { code: "nature", label: "자연 감상 (산/숲/해변 등)" },
];

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  // 오늘 날짜로 시작일 설정 (사용자 편의를 위해)
  tripData.value.startDate = today;
});
</script>

<style scoped>
.wizard-container {
  min-height: 100vh;
  padding-top: 60px;
  padding-bottom: 80px;
  background-color: #fbfaff;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui,
    Roboto, "Helvetica Neue", "Segoe UI", sans-serif;
}

/* 진행 표시 바 */
.wizard-progress {
  width: 90%;
  max-width: 600px;
  margin: 40px auto 30px;
}

.progress-bar {
  height: 6px;
  background-color: #efe6ff;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background-color: #8e6ad9;
  transition: width 0.3s ease;
}

.step-indicators {
  display: flex;
  justify-content: space-between;
  padding: 0 2px;
}

.step-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #efe6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #9895a7;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.step-indicator.active {
  background-color: #8e6ad9;
  color: white;
}

.step-indicator.current {
  transform: scale(1.2);
  box-shadow: 0 2px 10px rgba(142, 106, 217, 0.3);
}

/* 단계별 컨텐츠 */
.wizard-content {
  width: 90%;
  max-width: 700px;
  margin: 0 auto;
  padding: 40px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(142, 106, 217, 0.04);
  min-height: 500px;
}

.step-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
  color: #2c3e50;
}

.step-description {
  text-align: center;
  color: #667080;
  margin-bottom: 24px;
  font-size: 15px;
}

/* 단계 전환 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 1단계: 날짜 선택 */
.date-picker-container {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  justify-content: center;
}

.date-picker {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.date-picker label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #4b5563;
}

.date-input {
  padding: 14px;
  border: 1px solid #efe6ff;
  border-radius: 12px;
  font-size: 16px;
  width: 100%;
  min-width: 150px;
  transition: all 0.2s;
}

.date-input:focus {
  outline: none;
  border-color: #8e6ad9;
  box-shadow: 0 0 0 3px rgba(142, 106, 217, 0.15);
}

.trip-duration {
  text-align: center;
  font-size: 18px;
  margin-top: 24px;
  color: #4b5563;
  background-color: #f7f2ff;
  padding: 14px;
  border-radius: 12px;
  font-weight: 500;
}

.duration-highlight {
  font-weight: 700;
  color: #8e6ad9;
  font-size: 22px;
}

/* 2단계: 인원 수 및 여행 목적 */
.people-count-container {
  margin-bottom: 36px;
  text-align: center;
}

.people-count-container label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #4b5563;
  font-size: 16px;
}

.people-dropdown {
  padding: 14px 20px;
  border: 1px solid #efe6ff;
  border-radius: 12px;
  font-size: 16px;
  background-color: white;
  min-width: 180px;
  text-align: center;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='14' height='8' viewBox='0 0 14 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L7 7L13 1' stroke='%238e6ad9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
  cursor: pointer;
}

.people-dropdown:focus {
  outline: none;
  border-color: #8e6ad9;
  box-shadow: 0 0 0 3px rgba(142, 106, 217, 0.15);
}

.subsection-title {
  font-size: 18px;
  margin: 24px 0 16px;
  color: #2c3e50;
  text-align: center;
  font-weight: 600;
}

.trip-purpose-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.trip-purpose-card {
  height: 110px;
  border-radius: 16px;
  background-color: #f7f2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid transparent;
}

.trip-purpose-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
}

.trip-purpose-card.selected {
  border-color: #8e6ad9;
  background-color: #f0e7fd;
  box-shadow: 0 8px 16px rgba(142, 106, 217, 0.18);
}

.purpose-content {
  text-align: center;
}

.purpose-code {
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 16px;
  color: #2c3e50;
}

.purpose-label {
  font-size: 14px;
  color: #667080;
}

/* 3단계: 지역 선택 */
.region-search {
  margin-bottom: 28px;
}

.region-search-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #efe6ff;
  border-radius: 12px;
  font-size: 16px;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z' stroke='%23667080' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M19 19L14.65 14.65' stroke='%23667080' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
}

.region-search-input:focus {
  outline: none;
  border-color: #8e6ad9;
  box-shadow: 0 0 0 3px rgba(142, 106, 217, 0.15);
}

.region-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 14px;
}

.region-card {
  padding: 16px 8px;
  background-color: #f7f2ff;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid transparent;
  font-weight: 500;
}

.region-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
}

.region-card.selected {
  border-color: #8e6ad9;
  background-color: #f0e7fd;
  box-shadow: 0 8px 16px rgba(142, 106, 217, 0.18);
}

/* 4단계: 이동 수단 */
.transportation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 20px;
}

.transport-card {
  height: 135px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f7f2ff;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid transparent;
  padding: 16px;
}

.transport-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
}

.transport-card.selected {
  border-color: #8e6ad9;
  background-color: #f0e7fd;
  box-shadow: 0 8px 16px rgba(142, 106, 217, 0.18);
}

.transport-icon {
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8e6ad9;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(142, 106, 217, 0.1);
}

.transport-label {
  font-size: 15px;
  font-weight: 500;
  color: #2c3e50;
  text-align: center;
}

/* 5단계: 여행 컨셉 */
.concept-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.concept-card {
  height: 110px;
  border-radius: 16px;
  background-color: #f7f2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid transparent;
}

.concept-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
}

.concept-card.selected {
  border-color: #8e6ad9;
  background-color: #f0e7fd;
  box-shadow: 0 8px 16px rgba(142, 106, 217, 0.18);
}

.concept-content {
  text-align: center;
}

.concept-code {
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 16px;
  color: #2c3e50;
}

.concept-label {
  font-size: 14px;
  color: #667080;
}

/* 6단계: MBTI 선택 */
.mbti-selector {
  max-width: 500px;
  margin: 0 auto;
}

.mbti-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.mbti-option {
  flex: 1;
  text-align: center;
}

.mbti-option button {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: 2px solid #efe6ff;
  background-color: white;
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-bottom: 10px;
}

.mbti-option button:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.mbti-option button.active {
  background-color: #8e6ad9;
  border-color: #8e6ad9;
  color: white;
  box-shadow: 0 6px 16px rgba(142, 106, 217, 0.25);
}

.mbti-description {
  font-size: 15px;
  color: #4b5563;
  font-weight: 500;
}

.mbti-vs {
  width: 60px;
  text-align: center;
  font-weight: 600;
  color: #9a8cb0;
  font-size: 14px;
}

.mbti-result {
  text-align: center;
  margin-top: 30px;
  font-size: 18px;
  color: #4b5563;
  background-color: #f7f2ff;
  padding: 14px;
  border-radius: 12px;
  font-weight: 500;
}

.mbti-highlight {
  font-weight: 700;
  color: #8e6ad9;
  font-size: 24px;
  margin-left: 4px;
}

/* 최종 확인 단계 */
.summary-container {
  max-width: 560px;
  margin: 0 auto 35px;
}

.summary-card {
  background-color: #f7f2ff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(142, 106, 217, 0.05);
}

.summary-card h3 {
  text-align: center;
  margin-bottom: 24px;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 700;
}

.summary-item {
  display: flex;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #efe6ff;
}

.summary-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.summary-label {
  flex: 1;
  font-weight: 600;
  color: #4b5563;
}

.summary-value {
  flex: 2;
  color: #2c3e50;
}

.generating-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 35px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f5f0ff;
  border-top: 3px solid #8e6ad9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 18px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.generating-message p {
  font-size: 16px;
  color: #4b5563;
}

/* 하단 네비게이션 */
.wizard-navigation {
  width: 90%;
  max-width: 700px;
  margin: 24px auto 0;
  display: flex;
  justify-content: space-between;
}

.navigation-button {
  padding: 14px 32px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  border: none;
}

.back-button {
  background-color: #f5f0ff;
  color: #4b5563;
}

.back-button:hover {
  background-color: #efe6ff;
}

.next-button {
  background-color: #8e6ad9;
  color: white;
}

.next-button:hover {
  background-color: #7c59c5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.2);
}

.next-button:disabled {
  background-color: #d0c5e6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 빈 컨텐츠 상태 */
.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  text-align: center;
  color: #667080;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .wizard-content {
    width: 95%;
    padding: 30px 20px;
  }

  .trip-purpose-grid,
  .concept-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .transportation-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .region-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}

@media (max-width: 600px) {
  .wizard-content {
    padding: 24px 16px;
  }

  .date-picker-container {
    flex-direction: column;
    gap: 16px;
  }

  .trip-purpose-grid,
  .concept-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  }

  .transportation-grid {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  }

  .region-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }

  .mbti-option button {
    width: 55px;
    height: 55px;
    font-size: 20px;
  }

  .mbti-vs {
    width: 40px;
  }

  .navigation-button {
    padding: 12px 24px;
  }

  .summary-card {
    padding: 24px 16px;
  }
}
</style>
