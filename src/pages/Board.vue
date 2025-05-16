<!-- src/pages/PartnerBoardPage.vue -->
<template>
  <div class="partner-board-page">
    <AppHeader :is-shrunk="isScrolled" />
    <main class="container main-content">
      <!-- 게시판 타이틀 영역 -->
      <div class="board-header">
        <h1 class="board-title">여행 파트너 찾기</h1>
        <p class="board-description">함께 여행할 동행을 찾아보세요</p>
      </div>
      
      <!-- 필터링 영역 -->
      <div class="filter-section">
        <div class="filter-container">
          <div class="filter-group">
            <label for="gender-filter">성별</label>
            <select id="gender-filter" v-model="filters.gender" class="filter-select">
              <option value="">전체</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
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
              <option value="domestic">국내</option>
              <option value="asia">아시아</option>
              <option value="europe">유럽</option>
              <option value="america">미주</option>
              <option value="oceania">오세아니아</option>
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
          <div v-for="post in filteredPosts" :key="post.id" class="post-card" @click="viewPostDetail(post.id)">
            <div class="post-header">
              <div class="post-meta">
                <span class="post-date">{{ formatDate(post.createdAt) }}</span>
                <span class="post-views">조회 {{ post.views }}</span>
              </div>
              <h3 class="post-title">{{ post.title }}</h3>
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

// 필터 상태
const filters = ref({
  gender: '',
  ageRange: '',
  destination: '',
  dateRange: ''
});

// 샘플 게시글 데이터 (실제로는 API에서 가져옴)
const posts = ref([
  {
    id: 1,
    title: '제주도 2박 3일 여행 동행 구합니다',
    content: '6월 초에 제주도로 2박 3일 여행 계획 중인데 함께 갈 동행을 찾습니다. 렌트카로 제주도 일주 예정이에요. 맛집 탐방과 경치 구경이 주 목적입니다.',
    author: '여행조아',
    authorGender: 'female',
    authorAge: 27,
    destination: '제주도',
    travelStartDate: '2025-06-05',
    travelEndDate: '2025-06-07',
    createdAt: '2025-05-01T09:30:00',
    views: 145,
    interestCount: 23,
    commentCount: 12,
    isInterested: false
  },
  {
    id: 2,
    title: '유럽 백패킹 파트너 구함 (영어 가능자)',
    content: '7월부터 한 달간 유럽 배낭여행 계획 중입니다. 영어 소통이 가능하고 자유여행을 좋아하는 분과 함께하고 싶어요. 프랑스-이탈리아-스위스-독일 루트 예정입니다.',
    author: '세계여행가',
    authorGender: 'male',
    authorAge: 32,
    destination: '유럽',
    travelStartDate: '2025-07-01',
    travelEndDate: '2025-07-28',
    createdAt: '2025-04-28T15:45:00',
    views: 208,
    interestCount: 31,
    commentCount: 18,
    isInterested: true
  },
  {
    id: 3,
    title: '부산 주말 당일치기 메이트 구합니다',
    content: '다음 주 토요일 부산 당일치기 여행 계획 있습니다. 해운대-광안리-서면 코스로 생각 중이에요. 맛집 탐방과 야경 촬영이 목적입니다.',
    author: '사진작가',
    authorGender: 'male',
    authorAge: 25,
    destination: '부산',
    travelStartDate: '2025-05-17',
    travelEndDate: '2025-05-17',
    createdAt: '2025-05-10T11:20:00',
    views: 87,
    interestCount: 9,
    commentCount: 4,
    isInterested: false
  },
  {
    id: 4,
    title: '일본 오사카-교토 4박 5일 여자 동행 찾아요',
    content: '6월 중순 일본 오사카-교토 여행 갑니다. 여자분들만 받습니다. USJ 방문, 맛집 탐방, 쇼핑이 주 목적이에요. 일본어 가능하면 더 좋지만 필수는 아닙니다.',
    author: '벚꽃소녀',
    authorGender: 'female',
    authorAge: 29,
    destination: '일본',
    travelStartDate: '2025-06-15',
    travelEndDate: '2025-06-19',
    createdAt: '2025-05-05T14:10:00',
    views: 176,
    interestCount: 27,
    commentCount: 15,
    isInterested: false
  },
  {
    id: 5,
    title: '베트남 하노이-하롱베이 5박 6일 동행자 모집',
    content: '6월 말에 베트남 하노이-하롱베이 여행 예정입니다. 현지 맛집 탐방과 문화 체험이 목적이에요. 여행 경비는 각자 부담입니다. 성별 무관, 20-30대 환영합니다.',
    author: '아시아노마드',
    authorGender: 'male',
    authorAge: 35,
    destination: '베트남',
    travelStartDate: '2025-06-25',
    travelEndDate: '2025-06-30',
    createdAt: '2025-05-08T17:35:00',
    views: 124,
    interestCount: 18,
    commentCount: 8,
    isInterested: false
  },
  {
    id: 6,
    title: '태국 방콕-파타야 7박 8일 남자 동행 구합니다',
    content: '8월 초 태국 방콕-파타야 여행 계획 중입니다. 남자분들만 받습니다. 현지 맛집 탐방과 해변 액티비티가 목적이에요. 영어 소통 가능하면 좋습니다.',
    author: '태국마니아',
    authorGender: 'male',
    authorAge: 31,
    destination: '태국',
    travelStartDate: '2025-08-01',
    travelEndDate: '2025-08-08',
    createdAt: '2025-05-03T10:25:00',
    views: 152,
    interestCount: 21,
    commentCount: 10,
    isInterested: true
  },
  {
    id: 7,
    title: '속초 주말 2박 3일 동행 모집합니다',
    content: '이번 주말 속초로 2박 3일 여행 갑니다. 설악산 등산, 속초 해변, 맛집 탐방이 목적이에요. 자차로 이동 예정이며 경비는 1/n로 나눠요.',
    author: '산과바다',
    authorGender: 'female',
    authorAge: 33,
    destination: '속초',
    travelStartDate: '2025-05-23',
    travelEndDate: '2025-05-25',
    createdAt: '2025-05-15T09:15:00',
    views: 67,
    interestCount: 12,
    commentCount: 5,
    isInterested: false
  },
  {
    id: 8,
    title: '호주 시드니-멜버른 10일 여행 동행자 찾아요',
    content: '9월 초 호주 동부해안 여행 예정입니다. 시드니와 멜버른을 중심으로 대자연과 도시 문화를 모두 체험하고 싶어요. 영어 소통 가능하면 더 좋을 것 같습니다.',
    author: '코알라팬',
    authorGender: 'female',
    authorAge: 28,
    destination: '호주',
    travelStartDate: '2025-09-05',
    travelEndDate: '2025-09-15',
    createdAt: '2025-05-12T16:50:00',
    views: 94,
    interestCount: 15,
    commentCount: 7,
    isInterested: false
  }
]);

// 필터링된 게시글
const filteredPosts = computed(() => {
  let result = [...posts.value];
  
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
    // 실제 구현 시 API 필터링 사용
    // 임시 로직
    const destinationMap = {
      'domestic': ['제주도', '부산', '속초'],
      'asia': ['일본', '베트남', '태국'],
      'europe': ['유럽'],
      'america': ['미국', '캐나다'],
      'oceania': ['호주', '뉴질랜드']
    };
    
    const destinationList = destinationMap[filters.value.destination];
    result = result.filter(post => 
      destinationList.some(dest => post.destination.includes(dest))
    );
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
  return Math.ceil(filteredPosts.value.length / postsPerPage);
});

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) {
    return '오늘';
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  }
};

// 성별 텍스트 변환
const getGenderText = (gender) => {
  return gender === 'male' ? '남성' : '여성';
};

// 사용자 아바타 이니셜 생성
const getAvatarInitial = (name) => {
  return name.charAt(0);
};

// 사용자 아바타 색상 생성
const getAvatarColor = (name) => {
  const colors = ['#F2D06B', '#95BCE5', '#A5C893', '#F28585', '#8C7AE6'];
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
    dateRange: ''
  };
  currentPage.value = 1;
};

// 관심 표시 토글
const toggleInterest = (post) => {
  post.isInterested = !post.isInterested;
  post.interestCount += post.isInterested ? 1 : -1;
};

// 게시글 상세 보기
const viewPostDetail = (postId) => {
  router.push(`/partner-post/${postId}`);
};

// 게시글 작성 페이지로 이동
const goToWritePost = () => {
  router.push('/write-partner-post');
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
  
  // 데이터 로드 시뮬레이션
  setTimeout(() => {
    isLoading.value = false;
  }, 800);
});

// 컴포넌트 언마운트 시
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.partner-board-page {
  padding-top: 60px;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
}

/* 헤더 영역 */
.board-header {
  text-align: center;
  margin-bottom: 30px;
}

.board-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
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
}

.filter-apply-btn {
  align-self: flex-end;
  padding: 10px 20px;
  background-color: #4a6ee0;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-apply-btn:hover {
  background-color: #3a5ecc;
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
  border-top: 4px solid #4a6ee0;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.page-number.active {
  background-color: #4a6ee0;
  color: white;
  border-color: #4a6ee0;
}

/* 게시글 작성 버튼 */
.write-post-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #4a6ee0;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(74, 110, 224, 0.3);
  cursor: pointer;
  transition: all 0.2s;
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