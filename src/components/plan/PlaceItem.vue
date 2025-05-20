<!-- components/plan/PlaceItem.vue -->
<template>
  <div class="place-item" :class="{ 'is-dragging': isDragging }">
    <div class="place-content">
      <div class="place-time-transport">
        <span class="place-time">
          {{ formatTime(place.arrivalTime) }} - {{ formatTime(place.departureTime) }}
        </span>
        <span v-if="place.transportFromPrevious" class="transport-badge">
          {{ place.transportFromPrevious.name }}
        </span>
      </div>
      <h3 class="place-name">{{ place.planDetailName }}</h3>
      <p v-if="place.memo" class="place-memo">{{ place.memo }}</p>
    </div>
    <button @click="$emit('delete')" class="delete-button">
      <span class="delete-icon">×</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'PlaceItem',
  props: {
    place: {
      type: Object,
      required: true
    },
    isDragging: {
      type: Boolean,
      default: false
    }
  },
  emits: ['delete'],
  methods: {
    formatTime(timeStr) {
      if (!timeStr) return '';
      // HH:MM:SS -> HH:MM
      return timeStr.substring(0, 5);
    }
  }
}
</script>

<style scoped>
.place-item {
  background-color: #f9f7ff;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0e7fd;
  display: flex;
  align-items: flex-start;
  transition: all 0.2s ease;
  cursor: move;
}

.place-item:hover {
  box-shadow: 0 4px 6px rgba(142, 106, 217, 0.1);
  transform: translateY(-2px);
}

.place-item.is-dragging {
  opacity: 0.5;
  transform: scale(1.02);
  box-shadow: 0 8px 16px rgba(142, 106, 217, 0.15);
}

.place-content {
  flex: 1;
}

.place-time-transport {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.place-time {
  background-color: #8e6ad9;
  color: white;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.transport-badge {
  background-color: #e5e7eb;
  color: #4b5563;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.place-name {
  margin: 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.place-memo {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.delete-button {
  background: none;
  border: none;
  color: #9ca3af;
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-button:hover {
  background-color: #fee2e2;
  color: #ef4444;
}

.delete-icon {
  font-size: 1.25rem;
  line-height: 1;
}
</style>