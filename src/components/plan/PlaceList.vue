<!-- components/plan/PlaceList.vue -->
<template>
  <div class="place-list">
    <div v-if="places.length === 0" class="empty-state">
      <p>이 날짜에 일정이 없습니다. 새 장소를 추가해보세요.</p>
    </div>

    <draggable
      v-model="innerPlaces"
      :item-key="(item) => item.id"
      ghost-class="ghost"
      chosen-class="chosen"
      drag-class="dragging"
      @end="emitChange"
      handle=".drag-handle"
      :force-fallback="true"
    >
      <template #item="{ element, index }">
        <div>
          <!-- 첫 번째 아이템이 아닌 경우 이동 수단 표시 -->
          <div v-if="index > 0" class="transport-between">
            <div class="transport-line"></div>
            <div class="transport-icon-container">
              <div class="transport-icon">
                <span class="transport-emoji">
                  {{
                    getTransportEmoji(
                      element.transportFromPrevious
                        ? element.transportFromPrevious.name
                        : "이동"
                    )
                  }}
                </span>
              </div>
              <div class="transport-name">
                {{
                  element.transportFromPrevious
                    ? element.transportFromPrevious.name
                    : "이동"
                }}
              </div>
              <div class="transport-duration">
                {{ calculateDuration(index) }}
              </div>
            </div>
            <div class="transport-line"></div>
          </div>

          <div class="place-item-wrapper">
            <div class="drag-handle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="drag-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M7 2a2 2 0 00-2 2v1a1 1 0 000 2v1a1 1 0 000 2v1a1 1 0 000 2v1a1 1 0 000 2v1a2 2 0 002 2h1a1 1 0 002 0h1a1 1 0 002 0h1a1 1 0 002 0h1a2 2 0 002-2v-1a1 1 0 000-2v-1a1 1 0 000-2v-1a1 1 0 000-2v-1a1 1 0 000-2V4a2 2 0 00-2-2h-1a1 1 0 00-2 0h-1a1 1 0 00-2 0h-1a1 1 0 00-2 0H7z"
                />
              </svg>
              <div class="place-order">{{ index + 1 }}</div>
            </div>
            <PlaceItem
              :place="element"
              @delete="$emit('delete-place', element.id)"
              @click="$emit('place-click', element)"
            />
          </div>
        </div>
      </template>
    </draggable>

    <div class="add-place-section">
      <button @click="$emit('add-place')" class="add-place-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="add-icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        새 장소 추가
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import draggable from "vuedraggable";
import PlaceItem from "./PlaceItem.vue";

export default {
  name: "PlaceList",
  components: {
    draggable,
    PlaceItem,
  },
  props: {
    places: {
      type: Array,
      required: true,
    },
  },
  emits: ["update:places", "delete-place", "add-place", "place-click"],
  setup(props, { emit }) {
    const innerPlaces = ref(JSON.parse(JSON.stringify(props.places)));

    const getTransportEmoji = (transportName) => {
      switch (transportName.trim()) {
        case "자가용":
          return "🚗";
        case "택시":
          return "🚕";
        case "자전거":
          return "🚲";
        case "도보":
          return "🚶";
        case "항공":
          return "✈️";
        case "버스":
          return "🚌";
        case "지하철":
          return "🚃";
        case "기차":
          return "🚊";
        default:
          return "🚗";
      }
    };

    // 부모로부터 전달받은 places가 변경되면 내부 상태 업데이트
    watch(
      () => props.places,
      (newPlaces) => {
        if (JSON.stringify(innerPlaces.value) !== JSON.stringify(newPlaces)) {
          innerPlaces.value = JSON.parse(JSON.stringify(newPlaces));
        }
      },
      { deep: true }
    );

    const emitChange = (evt) => {
      console.log("드래그 이벤트:", evt);

      if (evt.type === "end") {
        // 첫 번째 장소의 시간을 기준으로 나머지 시간 재계산
        const updatedPlaces = [...innerPlaces.value];

        // 각 장소의 체류 시간 계산 (출발 - 도착)
        const durations = updatedPlaces.map((place) => {
          const arrival = normalizeTime(place.arrivalTime);
          const departure = normalizeTime(place.departureTime);
          const [aH, aM] = arrival.split(":").map(Number);
          const [dH, dM] = departure.split(":").map(Number);

          let duration = dH * 60 + dM - (aH * 60 + aM);
          if (duration < 0) duration += 24 * 60; // 자정 넘어가는 경우

          return duration;
        });

        // 첫 번째 장소부터 시간 재계산
        for (let i = 1; i < updatedPlaces.length; i++) {
          const prevDeparture = updatedPlaces[i - 1].departureTime;
          const [h, m] = prevDeparture.split(":").map(Number);

          // 이동 시간 30분 가정
          let arrivalMinutes = h * 60 + m + 30;
          if (arrivalMinutes >= 24 * 60) arrivalMinutes -= 24 * 60;

          const arrivalHour = Math.floor(arrivalMinutes / 60);
          const arrivalMin = arrivalMinutes % 60;

          // 체류 시간 적용
          const departureMinutes = arrivalMinutes + durations[i];
          const departureHour = Math.floor(departureMinutes / 60) % 24;
          const departureMin = departureMinutes % 60;

          updatedPlaces[i].arrivalTime = `${arrivalHour
            .toString()
            .padStart(2, "0")}:${arrivalMin.toString().padStart(2, "0")}:00`;
          updatedPlaces[i].departureTime = `${departureHour
            .toString()
            .padStart(2, "0")}:${departureMin.toString().padStart(2, "0")}:00`;
        }

        emit("update:places", updatedPlaces);
      }
    };

    // 소요시간 계산 메서드 추가
    const calculateDuration = (currentIndex) => {
      if (
        currentIndex <= 0 ||
        !innerPlaces.value[currentIndex] ||
        !innerPlaces.value[currentIndex - 1]
      ) {
        return "정보 없음";
      }

      const prevPlace = innerPlaces.value[currentIndex - 1];
      const currentPlace = innerPlaces.value[currentIndex];

      if (!prevPlace.departureTime || !currentPlace.arrivalTime) {
        return "정보 없음";
      }

      // 시간 포맷 변환 (HH:MM:SS -> 분 단위)
      const convertTimeToMinutes = (timeStr) => {
        const parts = timeStr.split(":");
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        return hours * 60 + minutes;
      };

      const departureMinutes = convertTimeToMinutes(prevPlace.departureTime);
      const arrivalMinutes = convertTimeToMinutes(currentPlace.arrivalTime);

      // 소요 시간 계산 (분 단위)
      let durationMinutes = arrivalMinutes - departureMinutes;

      // 날짜를 넘어가는 경우 (음수인 경우 처리)
      if (durationMinutes < 0) {
        durationMinutes += 24 * 60; // 하루를 더함
      }

      // 시간과 분으로 변환
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;

      // 포맷팅
      if (hours > 0) {
        return `${hours}시간 ${minutes > 0 ? minutes + "분" : ""}`;
      }
      return `${minutes}분`;
    };

    return {
      innerPlaces,
      emitChange,
      calculateDuration,
      getTransportEmoji,
    };
  },
};
</script>

<style scoped>
.place-list {
  margin-bottom: 1rem;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  background-color: #f9fafb;
  border-radius: 8px;
  font-size: 0.875rem;
}

.place-item-wrapper {
  display: flex;
  align-items: stretch;
  margin-bottom: 0.75rem;
}

.drag-handle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  background-color: #f3f4f6;
  border-radius: 8px 0 0 8px;
  cursor: move;
  margin-right: 2px;
  transition: all 0.2s ease;
}

.drag-handle:hover {
  background-color: #e5e7eb;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-icon {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
  margin-bottom: 0.25rem;
}

.place-order {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

:deep(.place-item) {
  flex: 1;
  margin-bottom: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.ghost {
  opacity: 0.5;
  background: #f0e7fd;
  transform: scale(0.98);
}

.chosen {
  background: #f0e7fd;
}

.dragging {
  cursor: grabbing;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  transform: scale(1.02);
  z-index: 1000;
}

.add-place-section {
  margin-top: 1rem;
}

.add-place-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
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

.add-place-button:hover {
  background-color: #9979d5;
}

.add-icon {
  width: 1rem;
  height: 1rem;
}

/* PlaceList.vue - 이동 수단 관련 CSS 추가 */
.transport-between {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  margin-left: 2.5rem;
}

.transport-line {
  flex: 1;
  height: 2px;
  background-color: #e5e7eb;
}

.transport-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0.75rem;
}

.transport-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.25rem;
}

.transport-emoji {
  font-size: 1.25rem;
  line-height: 1;
}

.transport-name {
  font-size: 0.75rem;
  color: #6b7280;
}

.transport-duration {
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-top: 0.25rem;
}
</style>