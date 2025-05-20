<!-- components/plan/PlaceList.vue -->
<template>
  <div class="place-list">
    <div v-if="places.length === 0" class="empty-state">
      <p>이 날짜에 일정이 없습니다. 새 장소를 추가해보세요.</p>
    </div>
    
    <draggable 
      v-model="innerPlaces" 
      item-key="id"
      ghost-class="ghost"
      chosen-class="chosen"
      drag-class="dragging"
      @change="emitChange"
      handle=".drag-handle"
    >
      <template #item="{ element, index }">
        <div>
          <!-- 첫 번째 아이템이 아닌 경우 이동 수단 표시 -->
          <div v-if="index > 0" class="transport-between">
            <div class="transport-line"></div>
            <div class="transport-icon-container">
              <div class="transport-icon">
                <svg v-if="element.transportFromPrevious && element.transportFromPrevious.name === '자가용'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="transport-svg">
                  <path d="M8 7h8a2 2 0 012 2v5a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2zm8-2h-8a4 4 0 00-4 4v5a4 4 0 004 4h8a4 4 0 004-4V9a4 4 0 00-4-4z" />
                  <path d="M5 17h14M5 12h14M9 8v8M15 8v8" />
                </svg>
                <svg v-else-if="element.transportFromPrevious && element.transportFromPrevious.name === '도보'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="transport-svg">
                  <path d="M13 4.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm-.5 5v4.5a1 1 0 01-1 1H9a1 1 0 01-1-1V10l-3 3v5h2v-3.17L8.83 20H11v-4.17L12.83 20H15v-8.83L17.92 18H21l-7-7-.5-1.5z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="transport-svg">
                  <path d="M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H7V5h10v14z" />
                  <path d="M12 7a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
              </div>
              <div class="transport-name">{{ element.transportFromPrevious ? element.transportFromPrevious.name : '이동' }}</div>
              <div class="transport-duration">{{ calculateDuration(index) }}</div>
            </div>
            <div class="transport-line"></div>
          </div>
          
          <div class="place-item-wrapper">
            <div class="drag-handle">
              <svg xmlns="http://www.w3.org/2000/svg" class="drag-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 2a1 1 0 011 1v1h3V3a1 1 0 112 0v1h3V3a1 1 0 012 0v1h1a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1h3zm0 2H2v12h16V4h-5v1a1 1 0 11-2 0V4H7V3a1 1 0 00-1-1 1 1 0 00-1 1v1zM2 2a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2h-1v1a1 1 0 01-2 0V2h-3v1a1 1 0 01-2 0V2H7v1a1 1 0 01-2 0V2H2z" />
              </svg>
              <div class="place-order">{{ index + 1 }}</div>
            </div>
            <PlaceItem 
              :place="element" 
              @delete="$emit('delete-place', element.id)"
            />
          </div>
        </div>
      </template>
    </draggable>
    
    <div class="add-place-section">
      <button @click="$emit('add-place')" class="add-place-button">
        <svg xmlns="http://www.w3.org/2000/svg" class="add-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        새 장소 추가
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import draggable from 'vuedraggable';
import PlaceItem from './PlaceItem.vue';

export default {
  name: 'PlaceList',
  components: {
    draggable,
    PlaceItem
  },
  props: {
    places: {
      type: Array,
      required: true
    }
  },
  emits: ['update:places', 'delete-place', 'add-place'],
  setup(props, { emit }) {
    const innerPlaces = ref([...props.places]);

    // 부모로부터 전달받은 places가 변경되면 내부 상태 업데이트
    watch(() => props.places, (newPlaces) => {
      innerPlaces.value = [...newPlaces];
    }, { deep: true });

    // 순서 변경 이벤트 발생
    const emitChange = () => {
      emit('update:places', innerPlaces.value);
    };

    // 소요시간 계산 메서드 추가
  const calculateDuration = (currentIndex) => {
    if (currentIndex <= 0 || !innerPlaces.value[currentIndex] || !innerPlaces.value[currentIndex-1]) {
      return '정보 없음';
    }
    
    const prevPlace = innerPlaces.value[currentIndex-1];
    const currentPlace = innerPlaces.value[currentIndex];
    
    if (!prevPlace.departureTime || !currentPlace.arrivalTime) {
      return '정보 없음';
    }
    
    // 시간 포맷 변환 (HH:MM:SS -> 분 단위)
    const convertTimeToMinutes = (timeStr) => {
      const parts = timeStr.split(':');
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
      return `${hours}시간 ${minutes > 0 ? minutes + '분' : ''}`;
    }
    return `${minutes}분`;
  };

    return {
      innerPlaces,
      emitChange,
      calculateDuration
    };
  }
}
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
}

.chosen {
  background: #f0e7fd;
}

.dragging {
  cursor: grabbing;
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
  font-family: 'Marines', 'Pretendard', sans-serif;
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

.transport-svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
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