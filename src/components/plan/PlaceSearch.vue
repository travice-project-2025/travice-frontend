<template>
  <div class="place-search">
    <div class="search-container">
      <input
        type="text"
        v-model="searchKeyword"
        @keyup.enter="searchPlace"
        placeholder="장소명을 입력하여 검색하세요"
        class="search-input"
      />
      <button @click="searchPlace" class="search-button">검색</button>
    </div>
    
    <div v-if="isSearching" class="search-loading">
      <div class="loading-spinner"></div>
      <span>검색 중...</span>
    </div>
    
    <div v-if="searchResults.length > 0" class="search-results">
      <div
        v-for="(result, index) in searchResults"
        :key="index"
        @click="selectPlace(result)"
        class="search-result-item"
      >
        <div class="place-name">{{ result.place_name }}</div>
        <div class="place-address">{{ result.address_name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'PlaceSearch',
  emits: ['select-place'],
  setup(props, { emit }) {
    const searchKeyword = ref('');
    const searchResults = ref([]);
    const isSearching = ref(false);
    
    // 장소 검색 함수
    const searchPlace = () => {
      const keyword = searchKeyword.value.trim();
      if (!keyword) return;
      
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
        console.error('카카오맵 API가 로드되지 않았습니다.');
        alert('지도 API를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      
      isSearching.value = true;
      
      // 카카오 로컬 API 검색 서비스 초기화
      const places = new window.kakao.maps.services.Places();
      
      // 키워드로 장소 검색
      places.keywordSearch(keyword, (result, status) => {
        isSearching.value = false;
        
        if (status === window.kakao.maps.services.Status.OK) {
          console.log('검색 결과:', result);
          searchResults.value = result;
        } else {
          console.error('검색 실패:', status);
          searchResults.value = [];
          alert('검색 결과가 없습니다.');
        }
      });
    };
    
    // 장소 선택 함수
    const selectPlace = (place) => {
      // 선택한 장소 정보를 부모 컴포넌트로 전달
      emit('select-place', {
        planDetailName: place.place_name,
        latitude: parseFloat(place.y),
        longitude: parseFloat(place.x),
        address: place.address_name
      });
      
      // 검색 결과 초기화
      searchResults.value = [];
      searchKeyword.value = '';
    };
    
    return {
      searchKeyword,
      searchResults,
      isSearching,
      searchPlace,
      selectPlace
    };
  }
};
</script>

<style scoped>
.place-search {
  position: relative;
  width: 100%;
}

.search-container {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.search-button {
  padding: 0.75rem 1.5rem;
  background-color: #a78bda;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Marines', 'Pretendard', sans-serif;
}

.search-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #a78bda;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
}

.search-result-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
}

.search-result-item:hover {
  background-color: #f9fafb;
}

.place-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.place-address {
  font-size: 0.75rem;
  color: #6b7280;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>