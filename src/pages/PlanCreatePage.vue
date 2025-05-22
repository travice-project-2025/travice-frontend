<!-- pages/PlanCreatePage.vue -->
<template>
  <div class="plan-create-page">
    <AppHeader :title="getHeaderTitle()" :subtitle="getHeaderSubtitle()">
      <template #actions>
        <div class="header-actions" v-if="step === 'edit'">
          <button @click="savePlan" class="save-button" :disabled="isSaving">
            {{ isSaving ? "저장 중..." : "여행 계획 저장" }}
          </button>
        </div>
      </template>
    </AppHeader>

    <!-- 2단계: 추천 결과 표시 -->
    <div v-if="step === 'recommendation'" class="step-container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>여행 계획을 추천하는 중입니다...</p>
      </div>

      <div
        v-else-if="
          recommendationData &&
          recommendationData.days &&
          recommendationData.days.length > 0
        "
        class="recommendation-result"
      >
        <div
          v-for="day in recommendationData.days"
          :key="day.day"
          class="day-plan"
        >
          <h3 class="day-title">Day {{ day.day }}</h3>

          <div
            v-for="(place, placeIndex) in day.places || []"
            :key="placeIndex"
            class="place-card"
          >
            <div class="place-header">
              <h4 class="place-name">{{ place.name }}</h4>
              <span class="place-time"
                >{{ place.arrival }} - {{ place.departure }}</span
              >
            </div>
            <p class="place-activity">{{ place.activity }}</p>

            <!-- 다음 장소로 이동하는 교통편 표시 (마지막 장소가 아닌 경우) -->
            <div
              v-if="
                placeIndex < day.places.length - 1 &&
                placeIndex < day.transports.length
              "
              class="transport-info"
            >
              <div class="transport-icon">
                {{ getTransportEmoji(day.transports[placeIndex].type) }}
              </div>
              <span class="transport-type">{{
                day.transports[placeIndex].type
              }}</span>
              <span class="transport-duration">{{
                day.transports[placeIndex].duration
              }}</span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="$router.push('/plans')" class="back-button">
            취소
          </button>
          <button @click="convertToEditablePlan" class="proceed-button">
            이 계획으로 진행하기
          </button>
        </div>
      </div>
      <div v-else class="no-data-messgae">
        <p>추천 데이터가 아직 준비되지 않았습니다.</p>
        <div class="action-buttons">
          <button @click="$router.push('/plans')" class="back-button">
            목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>

    <!-- 3단계: 상세 편집 (PlanDetailPage 기능 통합) -->
    <div v-else-if="step === 'edit'" class="step-container">
      <div class="plan-content">
        <!-- 왼쪽: 지도 영역 -->
        <div class="map-section">
          <div class="map-search-container">
            <PlaceSearch @select-place="handleSelectPlace" />
          </div>
          <TripMap :places="filteredPlaces" />
        </div>

        <!-- 오른쪽: 일정 영역 -->
        <div class="itinerary-section">
          <div class="itinerary-header">
            <DayTab v-model="activeDay" :total-days="planData.totalDays" />
          </div>

          <div class="itinerary-body">
            <PlaceList
              v-model:places="filteredPlaces"
              @delete-place="deletePlaceById"
              @add-place="showAddPlaceModal = true"
            />
          </div>
        </div>
      </div>

      <!-- 하단 저장 버튼 (모바일 환경 고려) -->
      <div class="floating-save-bar">
        <div class="save-bar-content">
          <p>여행 계획을 편집 중입니다</p>
          <button
            @click="savePlan"
            class="save-button-large"
            :disabled="isSaving"
          >
            {{ isSaving ? "저장 중..." : "여행 계획 저장하기" }}
          </button>
        </div>
      </div>
    </div>

    <!-- 장소 추가 모달 (편집 단계에서 사용) -->
    <div
      v-if="showAddPlaceModal"
      class="modal-overlay"
      @click.self="showAddPlaceModal = false"
    >
      <!-- 모달 내용 (PlanDetailPage의 모달과 동일) -->
      <div class="modal-content">
        <div class="modal-header">
          <h2>장소 추가</h2>
          <button @click="showAddPlaceModal = false" class="modal-close-button">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="place-name">장소명</label>
            <input
              type="text"
              id="place-name"
              v-model="newPlace.planDetailName"
              class="form-input"
              placeholder="장소명을 입력하세요"
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="arrival-time">도착시간</label>
              <input
                type="time"
                id="arrival-time"
                v-model="newPlace.arrivalTime"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="departure-time">출발 시간</label>
              <input
                type="time"
                id="departure-time"
                v-model="newPlace.departureTime"
                class="form-input"
              />
            </div>
          </div>
          <div class="form-group">
            <label for="transport">이전 장소에서의 이동수단</label>
            <select
              id="transport"
              v-model="newPlace.transportName"
              class="form-select"
            >
              <option value="자가용">자가용</option>
              <option value="택시">택시</option>
              <option value="도보">도보</option>
              <option value="버스">버스</option>
              <option value="지하철">지하철</option>
              <option value="기차">기차</option>
              <option value="항공">항공</option>
              <option value="시작점">시작점 (첫 번째 장소)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="memo">메모</label>
            <textarea
              id="memo"
              v-model="newPlace.memo"
              class="form-textarea"
              placeholder="활동 내용, 방문 목적 등"
            ></textarea>
          </div>
          <div class="form-group" v-if="newPlace.address">
            <label>주소</label>
            <div class="address-display">{{ newPlace.address }}</div>
          </div>

          <div class="form-actions">
            <button @click="showAddPlaceModal = false" class="cancel-button">
              취소
            </button>
            <button @click="addNewPlace" class="submit-button">추가</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/userAuth"; // 추가
import Cookies from "js-cookie";
import AppHeader from "@/components/common/AppHeader.vue";
import DayTab from "@/components/plan/DayTab.vue";
import PlaceList from "@/components/plan/PlaceList.vue";
import PlaceSearch from "@/components/plan/PlaceSearch.vue";
import TripMap from "@/components/plan/TripMap.vue";

export default {
  name: "PlanCreatePage",
  components: {
    AppHeader,
    DayTab,
    PlaceList,
    PlaceSearch,
    TripMap,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { checkLoginStatus, requireAuth } = useAuth();

    const step = ref("recommendation");
    const loading = ref(false);
    const isSaving = ref(false);

    const getCookie = (name) => {
      return Cookies.get(name);
    };

    // 여행 정보 입력 데이터
    const travelInfo = ref({
      duration: 3,
      people: 2,
      purpose: "휴식",
      region: "제주도",
      transports: ["자가용", "도보"],
      concept: "힐링",
      mbti: "INFP",
    });

    // GPT 추천 결과 데이터
    const recommendationData = ref(null);

    onMounted(async () => {
      // route.query.step이 있으면 해당 단계로 설정
      if (route.query.step) {
        step.value = route.query.step;
      }
      await checkLoginStatus();

      // 데이터를 가져오는 과정
      let hasData = false;

      // 1. 먼저 라우터 상태에서 데이터 가져오기 시도
      try {
        const routerState = history.state?.state || {};

        if (routerState.recommendationData) {
          // 데이터 정규화 적용
          recommendationData.value = normalizeRecommendationData(
            routerState.recommendationData
          );
          console.log("라우터에서 추천 데이터 받음:", recommendationData.value);
          hasData = true;
        }

        if (routerState.travelInfo) {
          travelInfo.value = routerState.travelInfo;
          console.log("라우터에서 여행 정보 받음:", travelInfo.value);
        }
      } catch (err) {
        console.error("라우터 상태 읽기 실패:", err);
      }

      // 2. 라우터 상태에 데이터가 없으면 localStorage 확인
      if (!hasData) {
        const storedRecommendation = localStorage.getItem("recommendationData");
        const storedTravelInfo = localStorage.getItem("travelInfo");

        if (storedRecommendation) {
          try {
            const parsedData = JSON.parse(storedRecommendation);
            recommendationData.value = normalizeRecommendationData(parsedData);
            console.log(
              "로컬 스토리지에서 추천 데이터 로드:",
              recommendationData.value
            );
            hasData = true;

            // 5번 - 데이터를 읽은 후 바로 삭제 (일회성 보장)
            localStorage.removeItem("recommendationData");
          } catch (e) {
            console.error("추천 데이터 파싱 오류:", e);
          }
        }

        if (storedTravelInfo) {
          try {
            travelInfo.value = JSON.parse(storedTravelInfo);
            console.log("로컬 스토리지에서 여행 정보 로드:", travelInfo.value);

            // 5번 - 데이터를 읽은 후 바로 삭제 (일회성 보장)
            localStorage.removeItem("travelInfo");
          } catch (e) {
            console.error("여행 정보 파싱 오류:", e);
          }
        }
      }

      // 추천 데이터가 있지만 단계가 초기값일 경우 recommendation 단계로 설정
      if (recommendationData.value && step.value === "input") {
        step.value = "recommendation";
      }

      // 4번 - 데이터 검증, 데이터가 없으면 목록 페이지로 이동
      if (
        (!recommendationData.value ||
          !recommendationData.value.days ||
          recommendationData.value.days.length === 0) &&
        step.value === "recommendation"
      ) {
        console.warn("추천 데이터가 없습니다. 목록 페이지로 이동합니다.");
        alert(
          "여행 데이터를 불러올 수 없습니다. 여행 목록 페이지로 이동합니다."
        );
        router.push("/plans");
      }
    });

    // 백엔드 응답 데이터 검증 및 정리 함수 (간소화됨)
    const normalizeRecommendationData = (data) => {
      if (!data || !Array.isArray(data.days)) {
        console.warn("데이터가 유효하지 않습니다:", data);
        return { days: [] };
      }

      // 기본 검증 및 정렬만 수행
      const normalizedData = {
        days: [...data.days]
          .sort((a, b) => a.day - b.day)
          .map((day) => {
            // 필요한 속성이 있는지 확인하고 기본값 제공
            return {
              day: day.day,
              places: Array.isArray(day.places) ? day.places : [],
              transports: Array.isArray(day.transports) ? day.transports : [],
            };
          }),
      };

      console.log("정규화된 데이터:", normalizedData);
      return normalizedData;
    };

    // 편집 가능한 여행 계획 데이터 (PlanDetailPage에서 가져온 구조)
    const planData = ref({
      id: null,
      title: "",
      startDate: "",
      endDate: "",
      totalDays: 3,
      details: [],
    });

    // 현재 선택된 일자 (편집 단계에서 사용)
    const activeDay = ref(1);

    // 현재 일자에 해당하는 장소들 (편집 단계에서 사용)
    const filteredPlaces = computed({
      get: () => {
        return planData.value.details
          .filter((detail) => detail.day === activeDay.value)
          .sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime));
      },
      set: (newPlaces) => {
        const otherDayPlaces = planData.value.details.filter(
          (detail) => detail.day !== activeDay.value
        );
        planData.value.details = [...otherDayPlaces, ...newPlaces];
      },
    });

    // 장소 추가 모달 관련 상태
    const showAddPlaceModal = ref(false);
    const newPlace = ref({
      planDetailName: "",
      arrivalTime: "12:00",
      departureTime: "13:00",
      memo: "",
      transportName: "자가용",
      latitude: 33.38,
      longitude: 126.54,
    });

    // 페이지 제목 계산
    const getHeaderTitle = () => {
      switch (step.value) {
        case "input":
          return "새 여행 계획 만들기";
        case "recommendation":
          return "추천 여행 계획";
        case "edit":
          return planData.value.title;
        default:
          return "여행 계획";
      }
    };

    // 페이지 부제목 계산
    const getHeaderSubtitle = () => {
      if (step.value === "edit") {
        return formatDateRange(
          planData.value.startDate,
          planData.value.endDate
        );
      }
      return "";
    };

    const convertToEditablePlan = async () => {
      // 추천 데이터가 없는 경우 처리
      if (!recommendationData.value || !recommendationData.value.days) {
        alert("추천 데이터가 없습니다.");
        return;
      }

      // 날짜 포맷팅 함수
      const formatDateForTitle = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      };

      // 날짜 미리 계산
      const startDate = calculateStartDate();
      const endDate = calculateEndDate();

      const actualTotalDays =
        Math.floor(
          (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
        ) + 1;

      // 계획 기본 정보 설정
      planData.value = {
        id: null, // 새 계획이므로 ID는 null
        title: `${travelInfo.value.region} ${
          travelInfo.value.duration
        }일 여행 (${formatDateForTitle(startDate)}~${formatDateForTitle(
          endDate
        )})`,
        startDate: startDate, // 미리 계산한 값 사용
        endDate: endDate, // 미리 계산한 값 사용
        totalDays: actualTotalDays,
        details: [],
      };

      // 로딩 상태 설정
      loading.value = true;

      try {
        if (!window.kakao || !window.kakao.maps) {
          console.log("카카오맵 API 로딩 중...");

          // 카카오맵 API 동적 로드
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=68e8b97d381d75363cc6b9be98056de8&libraries=services&autoload=false`;
            script.onload = () => {
              // API 로드 후 초기화
              window.kakao.maps.load(() => {
                console.log("카카오맵 API 로드 완료");
                resolve();
              });
            };
            script.onerror = (e) => {
              console.error("카카오맵 API 로드 실패", e);
              reject(new Error("카카오맵 API 로드 실패"));
            };
            document.head.appendChild(script);
          });
        }
        // 추천 데이터를 상세 계획으로 변환
        let detailId = 1;

        // 카카오 장소 검색 서비스 초기화
        const places = new window.kakao.maps.services.Places();

        // 키워드 검색 함수 (Promise 기반)
        const searchPlaceByKeyword = (keyword) => {
          return new Promise((resolve) => {
            // 검색 키워드에 지역명 추가하여 정확도 향상
            const searchKeyword = `${travelInfo.value.region} ${keyword}`;

            places.keywordSearch(searchKeyword, (result, status) => {
              if (
                status === window.kakao.maps.services.Status.OK &&
                result.length > 0
              ) {
                // 첫 번째 결과 사용
                resolve({
                  latitude: parseFloat(result[0].y),
                  longitude: parseFloat(result[0].x),
                  address: result[0].address_name,
                });
              } else {
                console.warn(`'${keyword}' 위치 검색 실패:`, status);
                // 검색 실패 시 기본 위치 반환 (지역의 중심 좌표로 설정)
                resolve({
                  latitude: 33.38 + Math.random() * 0.3, // 랜덤 오프셋으로 마커가 겹치지 않게 함
                  longitude: 126.5 + Math.random() * 0.5,
                  address: `${travelInfo.value.region}`,
                });
              }
            });
          });
        };

        // 모든 장소에 대해 순차적으로 위치 검색 처리
        for (const day of recommendationData.value.days) {
          for (let i = 0; i < day.places.length; i++) {
            const place = day.places[i];

            // 카카오 로컬 API로 위치 검색
            const locationInfo = await searchPlaceByKeyword(place.name);

            // 장소 정보 생성
            const placeDetail = {
              id: detailId++,
              planDetailName: place.name,
              day: day.day,
              arrivalTime: place.arrival + ":00", // HH:MM -> HH:MM:SS 형식으로 맞춤
              departureTime: place.departure + ":00",
              memo: place.activity || "",
              // 첫 번째 장소가 아닌 경우 이전 장소에서의 이동수단 정보 추가
              transportFromPrevious:
                i > 0 && day.transports && i - 1 < day.transports.length
                  ? { name: day.transports[i - 1].type }
                  : { name: "시작점" },
              // 검색된 위도, 경도 설정
              latitude: locationInfo.latitude,
              longitude: locationInfo.longitude,
              address: locationInfo.address,
            };

            planData.value.details.push(placeDetail);
          }
        }

        // 편집 단계로 이동
        step.value = "edit";
        activeDay.value = 1; // 첫 번째 날짜 활성화
      } catch (error) {
        console.error("장소 정보 변환 오류:", error);
        alert("장소 정보를 변환하는 중 오류가 발생했습니다.");

        createBasicPlanWithDefaultCoordinates();
      } finally {
        loading.value = false;
      }
    };

    // API 로드 실패 시 기본 좌표로 계획 생성하는 함수
    const createBasicPlanWithDefaultCoordinates = () => {
      let detailId = 1;

      for (const day of recommendationData.value.days) {
        for (let i = 0; i < day.places.length; i++) {
          const place = day.places[i];

          // 기본 좌표 사용 (제주도 중심 좌표 + 약간의 랜덤 오프셋)
          const placeDetail = {
            id: detailId++,
            planDetailName: place.name,
            day: day.day,
            arrivalTime: place.arrival + ":00",
            departureTime: place.departure + ":00",
            memo: place.activity || "",
            transportFromPrevious:
              i > 0 && day.transports && i - 1 < day.transports.length
                ? { name: day.transports[i - 1].type }
                : { name: "시작점" },
            // 기본 좌표 설정
            latitude: 33.38 + i * 0.05,
            longitude: 126.5 + day.day * 0.05 + i * 0.02,
            address: `${travelInfo.value.region}`,
          };

          planData.value.details.push(placeDetail);
        }
      }

      // 편집 단계로 이동
      step.value = "edit";
      activeDay.value = 1;
    };

    // 시작일 계산 (기본: 오늘로부터 1주일 후)
    const calculateStartDate = () => {
      if (travelInfo.value.startDate) {
        return travelInfo.value.startDate;
      }
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);
      return startDate.toISOString().split("T")[0];
    };

    // 종료일 계산 (시작일로부터 duration-1일 후)
    const calculateEndDate = () => {
      if (travelInfo.value.endDate) {
        return travelInfo.value.endDate;
      }
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7); 

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + travelInfo.value.duration - 1);
      return endDate.toISOString().split("T")[0];
    };

    // 날짜 범위 포맷팅
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

    // 이동수단 이모지 반환
    const getTransportEmoji = (transportType) => {
      const emojiMap = {
        자가용: "🚗",
        택시: "🚕",
        자전거: "🚲",
        도보: "🚶",
        항공: "✈️",
        버스: "🚌",
        지하철: "🚃",
        기차: "🚊",
      };

      return emojiMap[transportType] || "🚗";
    };

    // 장소 삭제 메서드 (편집 단계에서 사용)
    const deletePlaceById = (id) => {
      planData.value.details = planData.value.details.filter(
        (detail) => detail.id !== id
      );
    };

    // 장소 추가 메서드 (편집 단계에서 사용
    const addNewPlace = () => {
      // 유효성 검사
      if (!newPlace.value.planDetailName.trim()) {
        alert("장소명을 입력해주세요.");
        return;
      }
      const newId =
        Math.max(...planData.value.details.map((d) => d.id || 0), 0) + 1;

      planData.value.details.push({
        id: newId,
        planDetailName: newPlace.value.planDetailName,
        day: activeDay.value,
        arrivalTime: newPlace.value.arrivalTime,
        departureTime: newPlace.value.departureTime,
        memo: newPlace.value.memo,
        transportFromPrevious: { name: newPlace.value.transportName },
        latitude: newPlace.value.latitude,
        longitude: newPlace.value.longitude,
        address: newPlace.value.address || "",
      });

      // 모달 닫기 및 폼 초기화
      showAddPlaceModal.value = false;
      newPlace.value = {
        planDetailName: "",
        arrivalTime: "12:00",
        departureTime: "13:00",
        memo: "",
        transportName: "자가용",
        latitude: 33.38,
        longitude: 126.54,
        address: "",
      };
    };

    // handleSelectPlace 메서드 (PlanCreatePage.vue)
    const handleSelectPlace = (place) => {
      // 마지막 장소의 출발 시간을 기본 도착 시간으로 설정
      let defaultArrivalTime = "10:00";
      let defaultDepartureTime = "11:00";

      // 현재 활성화된 날짜의 장소들 가져와서 시간순 정렬
      const dayPlaces = planData.value.details
        .filter((detail) => detail.day === activeDay.value)
        .sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime));

      if (dayPlaces.length > 0) {
        const lastPlace = dayPlaces[dayPlaces.length - 1];
        // 마지막 장소의 출발시간 + 30분을 도착 시간으로 설정
        const [hours, minutes] = lastPlace.departureTime
          .substring(0, 5)
          .split(":");
        let arrivalHour = parseInt(hours);
        let arrivalMinute = parseInt(minutes) + 30;

        if (arrivalMinute >= 60) {
          arrivalHour += 1;
          arrivalMinute -= 60;
        }

        if (arrivalHour >= 24) {
          arrivalHour -= 24;
        }

        defaultArrivalTime = `${arrivalHour
          .toString()
          .padStart(2, "0")}:${arrivalMinute.toString().padStart(2, "0")}`;

        // 도착 후 1시간 체류 가정
        let departureHour = arrivalHour;
        let departureMinute = arrivalMinute + 60;

        if (departureMinute >= 60) {
          departureHour += 1;
          departureMinute -= 60;
        }

        if (departureHour >= 24) {
          departureHour -= 24;
        }

        defaultDepartureTime = `${departureHour
          .toString()
          .padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`;
      }

      // 새 장소 정보 설정
      newPlace.value = {
        planDetailName: place.planDetailName,
        arrivalTime: defaultArrivalTime,
        departureTime: defaultDepartureTime,
        memo: "",
        // 이전 장소가 있으면 '자가용', 없으면 '시작점'
        transportName: dayPlaces.length > 0 ? "자가용" : "시작점",
        // 위치 정보 설정
        latitude: place.latitude,
        longitude: place.longitude,
        address: place.address || "",
      };

      // 장소 추가 모달 표시
      showAddPlaceModal.value = true;
    };

    const savePlan = async () => {
      isSaving.value = true;

      try {
        const isAuthenticated = await requireAuth();
        if (!isAuthenticated) {
          isSaving.value = false;
          return;
        }

        let token =
          localStorage.getItem("JWT-TOKEN") ||
          sessionStorage.getItem("JWT-TOKEN") ||
          getCookie("JWT-TOKEN");

        if (!token) {
          alert("로그인이 필요합니다.");
          router.push("/login");
          return;
        }

        // 백엔드 PlanDTO 구조에 맞게 수정
        const planPayload = {
          title: planData.value.title,
          startDate: planData.value.startDate,
          endDate: planData.value.endDate,
          memberCount: travelInfo.value.people || 2,
          isPublic: false,
          thumbnail: null,
          region: travelInfo.value.region,
          // 필드명을 details로 변경
          details: planData.value.details.map((detail) => ({
            planDetailName: detail.planDetailName,
            day: detail.day,
            arrivalTime: detail.arrivalTime,
            departureTime: detail.departureTime,
            memo: detail.memo,
            transportFromPrevious: {
              id: getTransportId(detail.transportFromPrevious?.name),
            },
            latitude: detail.latitude,
            longitude: detail.longitude,
            address: detail.address,
          })),
        };

        console.log("전송할 데이터:", JSON.stringify(planPayload, null, 2));

        const response = await fetch("http://localhost:8080/api/v1/plans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(planPayload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("서버 응답 오류:", errorText);

          if (response.status === 401) {
            alert("인증이 만료되었습니다. 다시 로그인해주세요.");
            localStorage.removeItem("JWT-TOKEN");
            sessionStorage.removeItem("JWT-TOKEN");
            Cookies.remove("JWT-TOKEN");
            router.push("/login");
            return;
          }
          throw new Error(
            `여행 계획 저장에 실패했습니다. (${response.status})`
          );
        }

        const result = await response.json();
        console.log("저장 성공:", result);
        alert("여행 계획이 성공적으로 저장되었습니다.");
        router.push("/plans");
      } catch (error) {
        console.error("여행 계획 저장 오류:", error);
        alert(`여행 계획을 저장하는 중 오류가 발생했습니다: ${error.message}`);
      } finally {
        isSaving.value = false;
      }
    };

    // Transport 이름을 ID로 변환하는 헬퍼 함수
    const getTransportId = (transportName) => {
      const transportMap = {
        자가용: 1,
        지하철: 2,
        버스: 3,
        도보: 4,
        자전거: 5,
        택시: 6,
        기차: 7,
        항공: 8,
      };

      // 시작점이나 매핑되지 않은 교통수단은 자가용(1)으로 기본 설정
      if (transportName === "시작점" || !transportMap[transportName]) {
        return 1; // 자가용
      }

      return transportMap[transportName];
    };

    return {
      step,
      loading,
      isSaving,
      travelInfo,
      recommendationData,
      planData,
      activeDay,
      filteredPlaces,
      showAddPlaceModal,
      newPlace,
      getHeaderTitle,
      getHeaderSubtitle,
      convertToEditablePlan,
      formatDateRange,
      getTransportEmoji,
      deletePlaceById,
      addNewPlace,
      handleSelectPlace,
      savePlan,
      getCookie,
    };
  },
};
</script>

<style scoped>
.plan-detail-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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
}

/* 모달 스타일 */
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
  z-index: 50;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  font-family: "Marines", "Pretendard", sans-serif;
}

.modal-close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close-button:hover {
  background-color: #f3f4f6;
  color: #6b7280;
}

.modal-body {
  padding: 1.5rem;
}

/* 폼 스타일 */
.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #8e6ad9;
  box-shadow: 0 0 0 3px rgba(142, 106, 217, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background-color: #e5e7eb;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #a78bda;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover {
  background-color: #9979d5;
}

/* PlanDetailPage.vue - 지도 위 검색바 관련 CSS 추가 */
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

/* TripMap 컴포넌트는 이제 flex-grow: 1로 설정하여 남은 공간을 차지하도록 수정 */
:deep(.trip-map-container) {
  flex: 1;
}

/* 반응형 스타일 */
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
}
</style>
