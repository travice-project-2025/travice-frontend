<!-- components/plan/DayTab.vue -->
<template>
  <div class="day-tabs">
    <button 
      v-for="day in totalDays" 
      :key="day"
      @click="$emit('update:modelValue', day)"
      :class="['day-tab', { active: modelValue === day }]"
    >
      DAY{{ day }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'DayTab',
  props: {
    modelValue: {
      type: Number,
      required: true
    },
    totalDays: {
      type: Number,
      required: true
    }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.day-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
}

.day-tab {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.day-tab:hover {
  color: #8e6ad9;
  background-color: #f9f7ff;
}

.day-tab.active {
  color: #8e6ad9;
  border-bottom: 2px solid #8e6ad9;
  background-color: #f5f0ff;
}
</style>