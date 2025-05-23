<!-- components/plan/AddPlaceModal.vue -->
<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>장소 추가</h2>
        <button @click="closeModal" class="modal-close-button">
          &times;
        </button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label for="place-name">장소명</label>
          <input
            type="text"
            id="place-name"
            v-model="localPlace.planDetailName"
            class="form-input"
            placeholder="장소명을 입력하세요"
            @keyup.enter="handleAdd"
          />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="arrival-time">도착시간</label>
            <input
              type="time"
              id="arrival-time"
              v-model="localPlace.arrivalTime"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="departure-time">출발 시간</label>
            <input
              type="time"
              id="departure-time"
              v-model="localPlace.departureTime"
              class="form-input"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="transport">이전 장소에서의 이동수단</label>
          <select
            id="transport"
            v-model="localPlace.transportName"
            class="form-select"
          >
            <option value="자가용">🚗 자가용</option>
            <option value="택시">🚕 택시</option>
            <option value="도보">🚶 도보</option>
            <option value="버스">🚌 버스</option>
            <option value="지하철">🚃 지하철</option>
            <option value="기차">🚊 기차</option>
            <option value="항공">✈️ 항공</option>
            <option value="자전거">🚲 자전거</option>
            <option value="시작점">📍 시작점 (첫 번째 장소)</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="memo">메모</label>
          <textarea
            id="memo"
            v-model="localPlace.memo"
            class="form-textarea"
            placeholder="활동 내용, 방문 목적, 예약 정보 등"
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-group" v-if="localPlace.address">
          <label>주소</label>
          <div class="address-display">
            <span class="address-icon">📍</span>
            {{ localPlace.address }}
          </div>
        </div>

        <div class="form-actions">
          <button @click="closeModal" class="cancel-button">
            취소
          </button>
          <button 
            @click="handleAdd" 
            class="submit-button"
            :disabled="!localPlace.planDetailName.trim()"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  place: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:show', 'update:place', 'add'])

// 로컬 상태로 place 데이터 복사
const localPlace = ref({ ...props.place })

// props.place가 변경될 때 로컬 상태 업데이트
watch(() => props.place, (newPlace) => {
  localPlace.value = { ...newPlace }
}, { deep: true })

// 로컬 상태가 변경될 때 부모에게 전달
watch(localPlace, (newLocalPlace) => {
  emit('update:place', { ...newLocalPlace })
}, { deep: true })

const closeModal = () => {
  emit('update:show', false)
}

const handleAdd = () => {
  if (!localPlace.value.planDetailName.trim()) {
    alert('장소명을 입력해주세요.')
    return
  }
  
  // 시간 유효성 검사
  if (localPlace.value.arrivalTime && localPlace.value.departureTime) {
    if (localPlace.value.arrivalTime >= localPlace.value.departureTime) {
      alert('출발 시간은 도착 시간보다 늦어야 합니다.')
      return
    }
  }
  
  emit('add')
}

// 키보드 이벤트 처리
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

// 컴포넌트 마운트 시 키보드 이벤트 리스너 추가
if (typeof window !== 'undefined') {
  document.addEventListener('keydown', handleKeydown)
}

// 컴포넌트 언마운트 시 이벤트 리스너 제거
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
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
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Marines', 'Pretendard', sans-serif;
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
  transform: scale(1.1);
}

.modal-body {
  padding: 1.5rem;
  max-height: calc(90vh - 100px);
  overflow-y: auto;
}

/* 폼 스타일 */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  font-family: 'Pretendard', sans-serif;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #8e6ad9;
  box-shadow: 0 0 0 3px rgba(142, 106, 217, 0.1);
}

.form-select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg width='14' height='8' viewBox='0 0 14 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L7 7L13 1' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
  appearance: none;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.address-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #4b5563;
}

.address-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.cancel-button,
.submit-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.cancel-button {
  background-color: #f3f4f6;
  color: #4b5563;
}

.cancel-button:hover {
  background-color: #e5e7eb;
  transform: translateY(-1px);
}

.submit-button {
  background-color: #a78bda;
  color: white;
}

.submit-button:hover:not(:disabled) {
  background-color: #9979d5;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(167, 139, 218, 0.2);
}

.submit-button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

/* 반응형 */
@media (max-width: 640px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-row .form-group {
    margin-bottom: 1.25rem;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .cancel-button,
  .submit-button {
    width: 100%;
  }
}

/* 스크롤바 스타일링 */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>