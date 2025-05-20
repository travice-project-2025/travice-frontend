<!-- pages/PlanDetailPage.vue -->
<template>
  <div class="plan-detail-page">
    <AppHeader
      :title="planData.title"
      :subtitle="formatDateRange(planData.startDate, planData.endDate)"
    />

    <div class="plan-content">
      <!-- 왼쪽: 지도 영역 -->
      <div class="map-section">
        <!-- 검색 바를 지도 위로 이동 -->
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

    <!-- 장소 추가 모달 -->
    <div
      v-if="showAddPlaceModal"
      class="modal-overlay"
      @click.self="showAddPlaceModal = false"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2>새 장소 추가</h2>
          <button @click="showAddPlaceModal = false" class="modal-close-button">
            ×
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="addNewPlace">
            <div class="form-group">
              <label for="placeName">장소 이름</label>
              <input
                type="text"
                id="placeName"
                v-model="newPlace.planDetailName"
                required
                class="form-input"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="departureTime">출발 시간</label>
                <input
                  type="time"
                  id="departureTime"
                  v-model="newPlace.departureTime"
                  required
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="arrivalTime">도착 시간</label>
                <input
                  type="time"
                  id="arrivalTime"
                  v-model="newPlace.arrivalTime"
                  required
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="transport">이동 수단</label>
              <select
                id="transport"
                v-model="newPlace.transportName"
                class="form-select"
              >
                <option value="자가용">자가용</option>
                <option value="대중교통">대중교통</option>
                <option value="도보">도보</option>
                <option value="택시">택시</option>
                <option value="자전거">자전거</option>
                <option value="항공">항공</option>
                <option value="기차">기차</option>
              </select>
            </div>

            <div class="form-group">
              <label for="memo">메모 (선택)</label>
              <textarea
                id="memo"
                v-model="newPlace.memo"
                rows="3"
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-actions">
              <button
                type="button"
                @click="showAddPlaceModal = false"
                class="cancel-button"
              >
                취소
              </button>
              <button type="submit" class="submit-button">추가</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import AppHeader from "@/components/common/AppHeader.vue";
import DayTab from "@/components/plan/DayTab.vue";
import PlaceList from "@/components/plan/PlaceList.vue";
import PlaceSearch from "@/components/plan/PlaceSearch.vue";
import TripMap from "@/components/plan/TripMap.vue";

export default {
  name: "PlanDetailPage",
  components: {
    AppHeader,
    DayTab,
    PlaceList,
    PlaceSearch,
    TripMap,
  },
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    // 여행 계획 데이터 (실제로는 API에서 가져와야 함)
    const planData = ref({
      id: Number(props.id),
      title: "제주도 3일 여행",
      startDate: "2025-06-01",
      endDate: "2025-06-03",
      totalDays: 3,
      details: [
        {
          id: 1,
          planDetailName: "제주국제공항",
          day: 1,
          arrivalTime: "10:00:00",
          departureTime: "11:00:00",
          memo: "렌터카 픽업",
          transportFromPrevious: { name: "항공" },
          latitude: 33.5067,
          longitude: 126.493,
        },
        {
          id: 2,
          planDetailName: "성산일출봉",
          day: 1,
          arrivalTime: "13:00:00",
          departureTime: "15:00:00",
          memo: "세계자연유산, 정상까지 20-30분 소요",
          transportFromPrevious: { name: "자가용" },
          latitude: 33.4588,
          longitude: 126.9427,
        },
        {
          id: 3,
          planDetailName: "제주 함덕 해수욕장",
          day: 2,
          arrivalTime: "09:00:00",
          departureTime: "12:00:00",
          memo: "에메랄드빛 바다, 산책하기 좋음",
          transportFromPrevious: { name: "자가용" },
          latitude: 33.543,
          longitude: 126.6699,
        },
        {
          id: 4,
          planDetailName: "만장굴",
          day: 2,
          arrivalTime: "14:00:00",
          departureTime: "16:00:00",
          memo: "세계자연유산, 시원한 용암동굴",
          transportFromPrevious: { name: "자가용" },
          latitude: 33.5282,
          longitude: 126.7714,
        },
        {
          id: 5,
          planDetailName: "한라산 국립공원",
          day: 3,
          arrivalTime: "08:00:00",
          departureTime: "15:00:00",
          memo: "제주의 상징, 아름다운 자연경관",
          transportFromPrevious: { name: "자가용" },
          latitude: 33.3616,
          longitude: 126.5292,
        },
        {
          id: 6,
          planDetailName: "제주국제공항",
          day: 3,
          arrivalTime: "18:00:00",
          departureTime: "20:00:00",
          memo: "렌터카 반납",
          transportFromPrevious: { name: "자가용" },
          latitude: 33.5067,
          longitude: 126.493,
        },
      ],
    });

    // 현재 선택된 일자
    const activeDay = ref(1);

    // 현재 일자에 해당하는 장소들
    const filteredPlaces = computed({
      get: () => {
        return planData.value.details
          .filter((detail) => detail.day === activeDay.value)
          .sort((a, b) => {
            // 도착 시간 기준 정렬
            return a.arrivalTime.localeCompare(b.arrivalTime);
          });
      },
      set: (newPlaces) => {
        // 다른 일자 장소들은 유지
        const otherDayPlaces = planData.value.details.filter(
          (detail) => detail.day !== activeDay.value
        );

        // 전체 데이터 업데이트
        planData.value.details = [...otherDayPlaces, ...newPlaces];
      },
    });

    // 장소 추가 모달 상태
    const showAddPlaceModal = ref(false);

    // 새 장소 데이터
    const newPlace = ref({
      planDetailName: "",
      arrivalTime: "12:00",
      departureTime: "13:00",
      memo: "",
      transportName: "자가용",
      latitude: 33.38,
      longitude: 126.54,
    });

    // 장소 삭제 메서드
    const deletePlaceById = (id) => {
      planData.value.details = planData.value.details.filter(
        (detail) => detail.id !== id
      );
    };

    // 새 장소 추가 메서드
    const addNewPlace = () => {
      const newId = Math.max(...planData.value.details.map((d) => d.id), 0) + 1;

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
      };
    };

    // 검색에서 장소 선택 처리
    const handleSelectPlace = (place) => {
      newPlace.value = {
        ...newPlace.value,
        planDetailName: place.planDetailName,
        latitude: place.latitude,
        longitude: place.longitude,
      };

      showAddPlaceModal.value = true;
    };

    // 날짜 범위 포맷팅
    const formatDateRange = (startDate, endDate) => {
      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}년 ${
          date.getMonth() + 1
        }월 ${date.getDate()}일`;
      };

      return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
    };

    // 실제 구현에서는 데이터 저장 API 호출이 필요
    watch(
      () => planData.value.details,
      (newDetails) => {
        console.log("여행 계획이 업데이트되었습니다:", newDetails);
        // API 호출 구현: savePlanToServer(planData.value);
      },
      { deep: true }
    );

    return {
      planData,
      activeDay,
      filteredPlaces,
      showAddPlaceModal,
      newPlace,
      deletePlaceById,
      addNewPlace,
      handleSelectPlace,
      formatDateRange,
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
