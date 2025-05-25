<template>
  <div class="partner-board-page">
    <AppHeader :is-shrunk="isScrolled" />
    <main class="container main-content">
      <!-- 게시판 타이틀 영역 -->
      <div class="board-header">
        <h1 class="board-title">여행 <span class="highlight">파트너</span> 찾기</h1>
        <p class="board-description">함께 여행할 동행을 찾아보세요</p>
      </div>
      
      <!-- 필터링 영역 -->
      <div class="filter-section">
        <div class="filter-container">
          <div class="filter-group">
            <label for="gender-filter">성별</label>
            <select id="gender-filter" v-model="filters.gender" class="filter-select">
              <option value="">전체</option>
              <option value="M">남성</option>
              <option value="W">여성</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="age-filter">나이</label>
            <select id="age-filter" v-model="filters.ageRange" class="filter-select">
              <option value="">전체</option>
              <option value="10s">10대</option>
              <option value="20s">20대</option>
              <option value="30s">30대</option>
              <option value="40s">40대</option>
              <option value="50s">50대 이상</option>
            </select>
          </div>
          
          <div class="filter-group">
          <label for="destination-filter">여행지</label>
          <select id="destination-filter" v-model="filters.destination" class="filter-select">
            <option value="">전체</option>
            <option value="capital">수도권 (서울, 인천, 경기)</option>
            <option value="gangwon">강원도</option>
            <option value="chungcheong">충청권 (대전, 세종, 충청)</option>
            <option value="gyeongsang">경상권 (대구, 부산, 울산, 경상)</option>
            <option value="jeolla">전라권 (광주, 전라)</option>
            <option value="jeju">제주도</option>
          </select>
          </div>
          
          <div class="filter-group">
            <label for="status-filter">모집 상태</label>
            <select id="status-filter" v-model="filters.boardType" class="filter-select">
              <option value="">전체</option>
              <option value="OPEN">모집중</option>
              <option value="MATCHED">매칭중</option>
              <option value="CLOSED">마감됨</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="date-filter">여행 예정일</label>
            <select id="date-filter" v-model="filters.dateRange" class="filter-select">
              <option value="">전체</option>
              <option value="1month">1개월 이내</option>
              <option value="3months">3개월 이내</option>
              <option value="6months">6개월 이내</option>
              <option value="future">6개월 이후</option>
            </select>
          </div>
        </div>
        
        <button class="filter-apply-btn" @click="applyFilters">필터 적용</button>
      </div>
      
      <!-- 게시글 목록 -->
      <div class="posts-container">
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>게시글을 불러오는 중입니다...</p>
        </div>
        
        <div v-else-if="filteredPosts.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 8H17M7 12H17M7 16H13" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z" stroke="#999" stroke-width="2"/>
            </svg>
          </div>
          <p>검색 조건에 맞는 게시글이 없습니다</p>
          <button class="reset-filter-btn" @click="resetFilters">필터 초기화</button>
        </div>
        
        <div v-else class="posts-list">
          <div v-for="post in currentPagePosts" :key="post.id" class="post-card" @click="viewPostDetail(post.id)">
            <div class="post-header">
              <div class="post-meta">
                <span class="post-date">{{ formatDate(post.createdAt) }}</span>
                <span class="post-views">조회 {{ post.views }}</span>
              </div>
              <div class="post-title-wrapper">
                <h3 class="post-title">{{ post.title }}</h3>
                <span class="board-type-badge" :class="getBoardTypeClass(post.boardType)">
                  {{ getBoardTypeText(post.boardType) }}
                </span>
              </div>
            </div>
            
            <div class="post-content">
              <p class="post-excerpt">{{ post.content }}</p>
              
              <div class="post-info">
                <div class="post-travel-info">
                  <div class="info-item">
                    <span class="info-label">여행지</span>
                    <span class="info-value">{{ post.destination }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">여행 기간</span>
                    <span class="info-value">{{ post.travelStartDate }} ~ {{ post.travelEndDate }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">모집 인원</span>
                    <span class="info-value">{{ post.memberCount }}명</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">선호 조건</span>
                    <span class="info-value">
                      {{ post.preferenceMinAge }}~{{ post.preferenceMaxAge }}세
                      <span v-if="post.preferenceGender"> / {{ getGenderText(post.preferenceGender) }}</span>
                    </span>
                  </div>
                </div>
                
                <div class="post-author">
                  <div class="author-avatar" :style="{ backgroundColor: getAvatarColor(post.author) }">
                    {{ getAvatarInitial(post.author) }}
                  </div>
                  <div class="author-info">
                    <div class="author-name">{{ post.author }}</div>
                    <div class="author-details">
                      <span>{{ getGenderText(post.authorGender) }}</span>
                      <span class="dot-divider">•</span>
                      <span>{{ post.authorAge }}세</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="post-footer">
              <div class="interest-btn" :class="{ active: post.isInterested }" @click.stop="toggleInterest(post)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.31802 6.31802C2.56066 8.07538 2.56066 10.9246 4.31802 12.682L12.0001 20.364L19.682 12.682C21.4393 10.9246 21.4393 8.07538 19.682 6.31802C17.9246 4.56066 15.0754 4.56066 13.318 6.31802L12.0001 7.63609L10.682 6.31802C8.92462 4.56066 6.07538 4.56066 4.31802 6.31802Z" 
                    :stroke="post.isInterested ? '#FF6B6B' : '#666'"
                    :fill="post.isInterested ? '#FF6B6B' : 'none'"
                    stroke-width="2"/>
                </svg>
                <span>{{ post.interestCount }}</span>
              </div>
              
              <div class="comments-count">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ post.commentCount }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 페이지네이션 -->
        <div class="pagination">
          <button 
            class="page-btn prev" 
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            이전
          </button>
          
          <div class="page-numbers">
            <button 
              v-for="page in totalPages" 
              :key="page" 
              class="page-number"
              :class="{ active: page === currentPage }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            class="page-btn next" 
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            다음
          </button>
        </div>
      </div>
      
      <!-- 게시글 작성 버튼 -->
      <button class="write-post-btn" @click="goToWritePost">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>게시글 작성</span>
      </button>
    </main>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import { useAuth } from '@/composables/userAuth';

// 인증 관련 컴포저블
const { requireAuth } = useAuth();

// 라우터 설정
const router = useRouter();

// 상태 정의
const isScrolled = ref(false);
const isLoading = ref(true);
const currentPage = ref(1);
const postsPerPage = 5;
const posts = ref([]);

// 필터 상태
const filters = ref({
  gender: '',
  ageRange: '',
  destination: '',
  dateRange: '',
  boardType: ''
});

// API 응답 데이터를 내부 게시글 형식으로 변환하는 함수
const transformApiData = (apiData) => {
  return {
    id: apiData.id,
    title: apiData.title,
    content: apiData.detail,
    author: apiData.writer,
    authorGender: apiData.gender,
    authorAge: apiData.age,
    destination: apiData.location,
    travelStartDate: apiData.startDate,
    travelEndDate: apiData.endDate,
    createdAt: apiData.CreatedAt || apiData.createdAt || new Date().toISOString(),
    views: apiData.viewCount || 0,
    interestCount: apiData.interestCount || 0,
    commentCount: apiData.commentCount || 0,
    isInterested: apiData.isInterested || false,
    memberCount: apiData.memberCount || 1,
    preferenceGender: apiData.preferenceGender,
    preferenceMinAge: apiData.preferenceMinAge,
    preferenceMaxAge: apiData.preferenceMaxAge,
    boardType: apiData.boardType || 'OPEN',
    isDeleted: apiData.isDeleted
  };
};

// 게시글 데이터 가져오기
const fetchBoardData = async () => {
  

  isLoading.value = true;
  try {
    const response = await fetch('http://localhost:8080/api/v1/boards', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API 응답 데이터:', data);
    
    // API 응답 데이터 형식에 따라 변환
    posts.value = Array.isArray(data) ? data.map(post => transformApiData(post)) : [];
    
  } catch (error) {
    console.error('게시글 데이터 로드 실패:', error);
    posts.value = []; // 오류 시 빈 배열로 초기화
  } finally {
    isLoading.value = false;
  }
};

// 필터링된 게시글
const filteredPosts = computed(() => {
  

let result = posts.value.filter(post => post.isDeleted === false || post.isDeleted === 'false');
  
  // 성별 필터
  if (filters.value.gender) {
    result = result.filter(post => post.authorGender === filters.value.gender);
  }
  
  // 나이 필터
  if (filters.value.ageRange) {
    const ageRangeMap = {
      '10s': { min: 10, max: 19 },
      '20s': { min: 20, max: 29 },
      '30s': { min: 30, max: 39 },
      '40s': { min: 40, max: 49 },
      '50s': { min: 50, max: 100 }
    };
    
    const ageRange = ageRangeMap[filters.value.ageRange];
    result = result.filter(post => 
      post.authorAge >= ageRange.min && 
      post.authorAge <= ageRange.max
    );
  }
  
// 여행지 필터
  if (filters.value.destination) {
  // 국내 지역을 권역별로 분류한 여행지 맵
  const destinationMap = {
    'capital': ['서울', '인천', '경기도'], // 수도권
    'gangwon': ['강원도'], // 강원권
    'chungcheong': ['대전', '세종', '충청북도', '충청남도'], // 충청권
    'gyeongsang': ['대구', '부산', '울산', '경상북도', '경상남도'], // 경상권
    'jeolla': ['광주', '전라북도', '전라남도'], // 전라권
    'jeju': ['제주도'] // 제주
  };
    
  // 선택한 지역의 여행지 목록 가져오기
  const destinationList = destinationMap[filters.value.destination];
  
  // 일치하는 여행지 필터링
  if (destinationList) {
    result = result.filter(post => 
      destinationList.some(dest => post.destination.includes(dest))
    );
  }
}
  
  // 여행 예정일 필터
  if (filters.value.dateRange) {
    const today = new Date();
    const monthInMs = 30 * 24 * 60 * 60 * 1000;
    
    const dateRangeMap = {
      '1month': today.getTime() + monthInMs,
      '3months': today.getTime() + (3 * monthInMs),
      '6months': today.getTime() + (6 * monthInMs),
      'future': today.getTime() + (6 * monthInMs)
    };
    
    const targetDate = dateRangeMap[filters.value.dateRange];
    const futureFilter = filters.value.dateRange === 'future';
    
    result = result.filter(post => {
      const travelDate = new Date(post.travelStartDate).getTime();
      return futureFilter ? travelDate > targetDate : travelDate <= targetDate;
    });
  }
  
  // 모집 상태 필터
  if (filters.value.boardType) {
    result = result.filter(post => post.boardType === filters.value.boardType);
  }
  
  return result;
});

// 현재 페이지에 표시할 게시글
const currentPagePosts = computed(() => {
  const startIdx = (currentPage.value - 1) * postsPerPage;
  const endIdx = startIdx + postsPerPage;
  return filteredPosts.value.slice(startIdx, endIdx);
});

// 총 페이지 수
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredPosts.value.length / postsPerPage));
});

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const inputDate = new Date(dateString);
  const today = new Date();
  
  // 시간을 00:00:00으로 설정하여 날짜만 비교
  const inputDateOnly = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // 날짜 차이 계산 (일 단위)
  const diffTime = todayOnly.getTime() - inputDateOnly.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return '오늘';
  } else if (diffDays === 1) {
    return '어제';
  } else if (diffDays > 1 && diffDays <= 30) {
    return `${diffDays}일 전`;
  } else {
    // 30일 이상 지난 경우 날짜 형식으로 표시
    return `${inputDate.getFullYear()}.${String(inputDate.getMonth() + 1).padStart(2, '0')}.${String(inputDate.getDate()).padStart(2, '0')}`;
  }
};

// 성별 텍스트 변환
const getGenderText = (gender) => {
  return gender === 'M' ? '남성' : gender === 'W' ? '여성' : '무관';
};

// 게시글 상태 텍스트 변환
const getBoardTypeText = (boardType) => {
  switch (boardType) {
    case 'OPEN': return '모집중';
    case 'MATCHED': return '매칭중';
    case 'CLOSED': return '마감됨';
    default: return '모집중';
  }
};

// 게시글 상태에 따른 CSS 클래스
const getBoardTypeClass = (boardType) => {
  switch (boardType) {
    case 'OPEN': return 'type-open';
    case 'MATCHED': return 'type-matched';
    case 'CLOSED': return 'type-closed';
    default: return 'type-open';
  }
};

// 사용자 아바타 이니셜 생성
const getAvatarInitial = (name) => {
  if (!name) return '?';
  return name.charAt(0);
};

// 사용자 아바타 색상 생성
const getAvatarColor = (name) => {
  if (!name) return '#cccccc';
  const colors = ['#8e6ad9', '#a78bfa', '#A5C893', '#F28585', '#F2D06B'];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// 필터 적용
const applyFilters = () => {
  currentPage.value = 1; // 필터 적용 시 첫 페이지로 이동
};

// 필터 초기화
const resetFilters = () => {
  filters.value = {
    gender: '',
    ageRange: '',
    destination: '',
    dateRange: '',
    boardType: ''
  };
  currentPage.value = 1;
};

// 관심 표시 토글
const toggleInterest = async (post) => {
  try {
    // API 호출을 통한 관심 표시 업데이트 (실제 구현 필요)
    // const response = await fetch(`http://localhost:8080/api/v1/boards/${post.id}/interest`, {
    //   method: 'POST',
    //   credentials: 'include',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    //   }
    // });
    
    // if (!response.ok) {
    //   throw new Error(`관심 표시 업데이트 실패: ${response.status}`);
    // }
    
    // 임시로 클라이언트에서만 업데이트
    post.isInterested = !post.isInterested;
    post.interestCount += post.isInterested ? 1 : -1;
    
  } catch (error) {
    console.error('관심 표시 업데이트 실패:', error);
  }
};

// 게시글 상세 보기
const viewPostDetail = (postId) => {
  router.push(`/board/${postId}`);
};

// 게시글 작성 페이지로 이동
const goToWritePost = () => {
  router.push('/createboard');
};

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

// 컴포넌트 마운트 시
onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  
  // 인증 확인
  const isAuthenticated = await requireAuth();
  if (!isAuthenticated) return;
  
  // 데이터 로드
  await fetchBoardData();
});

// 컴포넌트 언마운트 시
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>


<style scoped>

.post-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.post-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #333;
}

.board-type-badge {
  font-size: 12px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

.type-open {
  background-color: #4CAF50;
  color: white;
}

.type-matched {
  background-color: #2196F3;
  color: white;
}

.type-closed {
  background-color: #9E9E9E;
  color: white;
}

.partner-board-page {
  padding-top: 60px;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

/* 헤더 영역 */
.board-header {
  text-align: center;
  margin-bottom: 30px;
}

.board-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
}

.highlight {
  color: #8e6ad9;
}

.board-description {
  font-size: 16px;
  color: #666;
}

/* 필터 섹션 */
.filter-section {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.filter-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f9f9f9;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #8e6ad9;
  box-shadow: 0 0 0 2px rgba(142, 106, 217, 0.1);
}

.filter-apply-btn {
  align-self: flex-end;
  padding: 12px 24px;
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.3);
}

.filter-apply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(142, 106, 217, 0.4);
}

/* 게시글 영역 */
.posts-container {
  margin-bottom: 30px;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #8e6ad9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  margin-bottom: 20px;
}

.reset-filter-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reset-filter-btn:hover {
  background-color: rgba(142, 106, 217, 0.1);
  color: #8e6ad9;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(142, 106, 217, 0.15);
}

.post-header {
  padding: 16px 20px 0;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  color: #888;
  font-size: 13px;
  margin-bottom: 8px;
}

.post-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #333;
}

.post-content {
  padding: 0 20px 16px;
}

.post-excerpt {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  max-height: 42px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-travel-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.info-label {
  color: #888;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.author-details {
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
}

.dot-divider {
  margin: 0 5px;
}

.post-footer {
  padding: 12px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.interest-btn, .comments-count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
}

.interest-btn {
  cursor: pointer;
  transition: color 0.2s;
}

.interest-btn:hover {
  color: #8e6ad9;
}

.interest-btn.active {
  color: #FF6B6B;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 8px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: #8e6ad9;
  color: #8e6ad9;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-number:hover {
  border-color: #8e6ad9;
  color: #8e6ad9;
}

.page-number.active {
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
  color: white;
  border-color: #8e6ad9;
}

/* 게시글 작성 버튼 */
.write-post-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(142, 106, 217, 0.4);
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.write-post-btn span {
  position: absolute;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s;
}

.write-post-btn:hover {
  width: 140px;
  border-radius: 30px;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(142, 106, 217, 0.5);
}

.write-post-btn:hover svg {
  transform: translateX(-30px);
}

.write-post-btn:hover span {
  opacity: 1;
  transform: translateX(10px);
}

/* 반응형 */
@media (max-width: 768px) {
  .filter-container {
    flex-direction: column;
  }
  
  .post-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .post-author {
    width: 100%;
  }
  
  .write-post-btn {
    bottom: 20px;
    right: 20px;
  }
}
</style>