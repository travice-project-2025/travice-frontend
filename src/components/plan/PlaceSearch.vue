<!-- components/plan/PlaceSearch.vue -->
<template>
  <div class="place-search">
    <div class="search-input-container">
      <input 
        type="text" 
        v-model="searchQuery"
        placeholder="장소 검색하기 (예: 카페, 식당, 관광지)" 
        class="search-input"
        @input="onSearchInput"
      />
      <button class="search-button" @click="search">
        <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    
    <div v-if="searchResults.length > 0" class="search-results">
      <div 
        v-for="(result, index) in searchResults" 
        :key="index"
        class="search-result-item"
        @click="selectPlace(result)"
      >
        <div class="result-name">{{ result.name }}</div>
        <div class="result-address">{{ result.address }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'PlaceSearch',
  emits: ['select-place'],
  setup(props, { emit }) {
    const searchQuery = ref('');
    const searchResults = ref([]);
    const searchTimeout = ref(null);

    // 검색어 입력 시 디바운스 처리
    const onSearchInput = () => {
      clearTimeout(searchTimeout.value);
      if (searchQuery.value.trim() === '') {
        searchResults.value = [];
        return;
      }

      searchTimeout.value = setTimeout(() => {
        search();
      }, 300);
    };

    // 검색 실행 (API 호출)
    const search = () => {
      if (searchQuery.value.trim() === '') {
        searchResults.value = [];
        return;
      }

      // 실제 구현에서는 백엔드 API 호출
      // 예시 데이터로 대체
      const mockResults = [
        {
          id: 1,
          name: `${searchQuery.value} 관광지`,
          address: '제주시 관광로 123',
          latitude: 33.4805,
          longitude: 126.5478
        },
        {
          id: 2,
          name: `${searchQuery.value} 카페`,
          address: '서귀포시 카페로 456',
          latitude: 33.2458,
          longitude: 126.5628
        },
        {
          id: 3,
          name: `${searchQuery.value} 맛집`,
          address: '제주시 맛집길 789',
          latitude: 33.5066,
          longitude: 126.4935
        }
      ];

      searchResults.value = mockResults;
    };

    // 장소 선택 이벤트
    const selectPlace = (place) => {
      emit('select-place', {
        planDetailName: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
        address: place.address
      });
      
      // 선택 후 검색 결과 초기화
      searchQuery.value = '';
      searchResults.value = [];
    };

    // 컴포넌트 정리 시 타이머 정리
    watch(() => searchQuery.value, (newVal) => {
      if (newVal === '') {
        searchResults.value = [];
      }
    });

    return {
      searchQuery,
      searchResults,
      onSearchInput,
      search,
      selectPlace
    };
  }
}
</script>

<style scoped>
.place-search {
  position: relative;
  margin-bottom: 1rem;
  width: 100%;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background-color: white;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #8e6ad9;
  box-shadow: 0 0 0 3px rgba(142, 106, 217, 0.1);
}

.search-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover {
  color: #8e6ad9;
}

.search-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 0.25rem;
  max-height: 300px;
  overflow-y: auto;
}

.search-result-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f3f4f6;
}

.search-result-item:hover {
  background-color: #f9f7ff;
}

.search-result-item:last-child {
  border-bottom: none;
}

.result-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.result-address {
  font-size: 0.75rem;
  color: #6b7280;
}
</style>