<template>
  <div class="container">
    <h1>🔍 관광지 검색 테스트</h1>
    
    <!-- 검색창 -->
    <div class="search-box">
      <input 
        v-model="searchKeyword" 
        class="search-input" 
        placeholder="관광지명이나 주소를 입력하세요 (예: 경복궁, 부산, 제주)"
        @keyup.enter="search"
      >
      <button 
        class="search-btn" 
        @click="search" 
        :disabled="loading"
      >
        {{ loading ? '검색중...' : '검색' }}
      </button>
    </div>

    <!-- 상태 메시지 -->
    <div 
      v-if="message" 
      class="status" 
      :class="{ error: isError, loading: loading }"
    >
      {{ message }}
    </div>

    <!-- 검색 결과 -->
    <div v-if="results.length > 0" class="results">
      <h3>검색 결과 ({{ results.length }}개)</h3>
      <div 
        v-for="item in results" 
        :key="item.id" 
        class="result-item"
      >
        <div class="result-title">{{ item.title }}</div>
        <div class="result-info">
          📍 {{ item.cityName }} | 🏷️ {{ item.contentTypeName }}
        </div>
        <div class="result-address">
          {{ item.address1 }} {{ item.address2 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 반응형 데이터
const searchKeyword = ref('')
const results = ref([])
const loading = ref(false)
const message = ref('')
const isError = ref(false)
const apiUrl = 'http://localhost:8080/api/v1/attractions/search'

// 메서드들
const search = async () => {
  if (!searchKeyword.value.trim()) {
    showMessage('검색어를 입력하세요', true)
    return
  }

  loading.value = true
  isError.value = false
  message.value = '검색 중...'
  results.value = []

  try {
    const url = `${apiUrl}?keyword=${encodeURIComponent(searchKeyword.value.trim())}`
    console.log('검색 URL:', url)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    results.value = data
    
    if (data.length === 0) {
      showMessage('검색 결과가 없습니다', false)
    } else {
      showMessage(`${data.length}개의 결과를 찾았습니다`, false)
    }
    
  } catch (error) {
    console.error('검색 오류:', error)
    showMessage(`검색 실패: ${error.message}`, true)
    results.value = []
  } finally {
    loading.value = false
  }
}

const testConnection = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/attractions/stats')
    if (response.ok) {
      const stats = await response.json()
      showMessage(`서버 연결 성공! MySQL: ${stats.mysql_count}개, ES: ${stats.elasticsearch_count}개`, false)
    } else {
      throw new Error('서버 응답 오류')
    }
  } catch (error) {
    showMessage('서버 연결 실패 - Spring Boot 서버가 실행 중인지 확인하세요', true)
  }
}

const showMessage = (msg, isErrorMsg = false) => {
  message.value = msg
  isError.value = isErrorMsg
}

// 컴포넌트 마운트 시 실행
onMounted(() => {
  testConnection()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-family: 'Arial', sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.search-btn {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.search-btn:hover {
  background: #0056b3;
}

.search-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.status {
  margin: 20px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
}

.status.error {
  background: #f8d7da;
  color: #721c24;
}

.status.loading {
  background: #d1ecf1;
  color: #0c5460;
}

.results {
  margin-top: 20px;
}

.result-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 10px;
  background: #fafafa;
}

.result-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.result-info {
  font-size: 14px;
  color: #666;
}

.result-address {
  font-size: 13px;
  color: #888;
  margin-top: 5px;
}
</style>