<!-- src/pages/PartnerPostDetailPage.vue -->
<template>
  <div class="post-detail-page">
    <AppHeader :is-shrunk="isScrolled" />
    <main class="main-content">
      <div class="content-wrapper">
        <div class="sidebar">
          <!-- 작성자 정보 -->
          <div class="author-card">
            <div class="author-header">
              <div class="author-avatar" :style="{ backgroundColor: getAvatarColor(post.author) }">
                {{ getAvatarInitial(post.author) }}
              </div>
              <div class="author-name">{{ post.author }}</div>
              <div class="author-badges">
                <span class="badge gender">{{ getGenderText(post.authorGender) }}</span>
                <span class="badge age">{{ post.authorAge }}세</span>
              </div>
            </div>
            <div class="author-stats">
              <div class="stat-item">
                <div class="stat-label">여행 횟수</div>
                <div class="stat-value">{{ post.authorTravelCount || 0 }}회</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">동행 횟수</div>
                <div class="stat-value">{{ post.authorPartnerCount || 0 }}회</div>
              </div>
            </div>
            <div class="action-buttons">
              <button 
                class="interest-btn"
                :class="{ active: post.isInterested }"
                @click="toggleInterest"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.31802 6.31802C2.56066 8.07538 2.56066 10.9246 4.31802 12.682L12.0001 20.364L19.682 12.682C21.4393 10.9246 21.4393 8.07538 19.682 6.31802C17.9246 4.56066 15.0754 4.56066 13.318 6.31802L12.0001 7.63609L10.682 6.31802C8.92462 4.56066 6.07538 4.56066 4.31802 6.31802Z" 
                    :stroke="post.isInterested ? '#FF6B6B' : '#666'"
                    :fill="post.isInterested ? '#FF6B6B' : 'none'"
                    stroke-width="2"/>
                </svg>
                <span>관심 표시</span>
                <span class="count-badge">{{ post.interestCount }}</span>
              </button>
              
              <button 
                class="apply-btn"
                :class="{ applied: isApplied }"
                @click="toggleApply"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M17 11L19 13L23 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ isApplied ? '신청 완료' : '동행 신청' }}</span>
              </button>
            </div>
          </div>
          
          <!-- 여행 정보 카드 -->
          <div class="travel-info-card">
            <h3 class="card-title">여행 정보</h3>
            <div class="info-list">
              <div class="info-item">
                <div class="info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4A6EE0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="#4A6EE0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="info-content">
                  <div class="info-label">여행 기간</div>
                  <div class="info-value">{{ formatTravelPeriod(post.travelStartDate, post.travelEndDate) }}</div>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#4A6EE0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#4A6EE0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="info-content">
                  <div class="info-label">여행지</div>
                  <div class="info-value">{{ post.destination }}</div>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#4A6EE0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#4A6EE0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#4A6EE0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#4A6EE0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="info-content">
                  <div class="info-label">모집 인원</div>
                  <div class="info-value">{{ post.recruitCount || 1 }}명</div>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1V23" stroke="#4A6EE0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#4A6EE0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="info-content">
                  <div class="info-label">예상 비용</div>
                  <div class="info-value">{{ formatCost(post.estimatedCost) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        <div class="main-column">
          <!-- 상단 내비게이션 -->
          <div class="navigation-bar">
            <button @click="goBack" class="back-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>게시판으로 돌아가기</span>
            </button>
            <div class="post-meta">
              <span class="post-date">{{ formatDate(post.createdAt) }}</span>
              <span class="dot-divider">•</span>
              <span class="post-views">조회 {{ post.views }}</span>
            </div>
          </div>
          
          <!-- 게시글 컨테이너 -->
          <div class="post-container">
            <!-- 게시글 헤더 -->
            <div class="post-header">
              <h1 class="post-title">{{ post.title }}</h1>
            </div>
            
            <!-- 게시글 내용 -->
            <div class="post-content">
              <div class="content-text">
                {{ post.content }}
              </div>
            </div>
          </div>
          
          <!-- 댓글 섹션 -->
          <div class="comments-section">
            <h3 class="section-title">
              댓글 
              <span class="comment-count">{{ comments.length }}</span>
            </h3>
            
            <!-- 댓글 작성 -->
            <div class="comment-form">
              <div class="form-avatar" :style="{ backgroundColor: getAvatarColor(userName) }">
                {{ getAvatarInitial(userName) }}
              </div>
              <div class="form-input-area">
                <textarea 
                  v-model="newComment" 
                  placeholder="댓글을 작성해주세요"
                  rows="3"
                  class="comment-input"
                ></textarea>
                <button 
                  class="submit-comment-btn"
                  :disabled="!newComment.trim()"
                  @click="submitComment"
                >
                  등록
                </button>
              </div>
            </div>
            
            <!-- 댓글 목록 -->
            <div class="comments-list">
              <div v-if="comments.length === 0" class="no-comments">
                <p>아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
              </div>
              
              <div v-else v-for="comment in comments" :key="comment.id" class="comment-item">
                <div class="comment-author">
                  <div class="comment-avatar" :style="{ backgroundColor: getAvatarColor(comment.author) }">
                    {{ getAvatarInitial(comment.author) }}
                  </div>
                  <div class="comment-author-info">
                    <div class="author-name-row">
                      <span class="comment-author-name">{{ comment.author }}</span>
                      <div v-if="comment.isAuthor" class="author-badge">작성자</div>
                    </div>
                    <div class="comment-meta">
                      <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                    </div>
                  </div>
                </div>
                <div class="comment-content">
                  {{ comment.content }}
                </div>
                <div class="comment-actions">
                  <button 
                    v-if="comment.author === userName"
                    class="delete-comment-btn"
                    @click="deleteComment(comment.id)"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import { useAuth } from '@/composables/userAuth';

// 인증 관련 컴포저블
const { userName, requireAuth } = useAuth();

// 라우터 및 라우트 설정
const router = useRouter();
const route = useRoute();

// 상태 정의
const isScrolled = ref(false);
const isLoading = ref(true);
const isApplied = ref(false);
const newComment = ref('');

// 게시글 데이터 (실제로는 API에서 가져옴)
const post = ref({
  id: 2,
  title: '유럽 백패킹 파트너 구함 (영어 가능자)',
  content: `7월부터 한 달간 유럽 배낭여행 계획 중입니다. 영어 소통이 가능하고 자유여행을 좋아하는 분과 함께하고 싶어요.\n\n◾ 여행 계획\n1. 도시: 프랑스(파리) → 스위스(인터라켄) → 이탈리아(베네치아, 피렌체, 로마) → 독일(뮌헨, 베를린)\n2. 숙소: 대부분 호스텔 예약 예정이며 비용 절감을 위해 같이 묵을 수 있는 곳 선택할 예정입니다.\n3. 교통: 유레일 글로벌 패스 구매 예정\n\n◾ 원하는 동행자\n- 20대~30대, 성별 무관\n- 영어로 기본적인 의사소통 가능하신 분\n- 여행 계획은 큰 틀만 잡고 세부 일정은 유동적으로 조율할 수 있는 분\n- 사진 찍는 것을 좋아하시는 분 (서로 사진 찍어주기 위해)\n\n◾ 여행 스타일\n- 미술관, 박물관 관람\n- 현지 음식 체험\n- 가끔 로컬 투어 참여\n- 유명 관광지 + 로컬 스팟 방문\n\n관심 있으신 분은 댓글이나 동행 신청 부탁드립니다. 먼저 메시지로 소통한 후 맞는다 싶으면 만나서 여행 계획 디테일하게 같이 짜보면 좋을 것 같아요!`,
  author: '세계여행가',
  authorGender: 'male',
  authorAge: 32,
  authorTravelCount: 8,
  authorPartnerCount: 3,
  destination: '유럽 (프랑스-이탈리아-스위스-독일)',
  travelStartDate: '2025-07-01',
  travelEndDate: '2025-07-28',
  recruitCount: 2,
  estimatedCost: 3500000,
  createdAt: '2025-04-28T15:45:00',
  views: 208,
  interestCount: 31,
  commentCount: 4,
  isInterested: false
});

// 댓글 데이터 (실제로는 API에서 가져옴)
const comments = ref([
  {
    id: 1,
    author: '유럽여행러',
    content: '안녕하세요! 저도 같은 시기에 유럽 여행을 계획하고 있어요. 영어 가능하고 여행 스타일도 비슷한 것 같네요. 어느 정도 예산으로 준비하고 계신가요?',
    createdAt: '2025-04-28T17:30:00',
    isAuthor: false
  },
  {
    id: 2,
    author: '세계여행가',
    content: '안녕하세요! 항공료 포함 총 예산은 약 350만원 정도로 생각하고 있어요. 호스텔 위주로 숙박하고 식비도 적절히 조절할 계획입니다.',
    createdAt: '2025-04-28T18:10:00',
    isAuthor: true
  },
  {
    id: 3,
    author: '배낭족',
    content: '7월은 유럽 성수기라 숙소 예약이 빨리 차는 편이니 미리 예약하시는 게 좋을 것 같아요. 저도 동행 신청 고민해볼게요!',
    createdAt: '2025-04-29T10:25:00',
    isAuthor: false
  },
  {
    id: 4,
    author: '세계여행가',
    content: '조언 감사합니다! 주요 도시는 미리 예약하고 나머지는 유동적으로 가려고요. 동행 신청 기다릴게요 :)',
    createdAt: '2025-04-29T11:40:00',
    isAuthor: true
  }
]);

// 뒤로 가기
const goBack = () => {
  router.push('/partners');
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) {
    // 시간 단위로 표시
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes}분 전`;
    }
    return `${diffHours}시간 전`;
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  }
};

// 여행 기간 포맷팅
const formatTravelPeriod = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // 날짜 형식 포맷팅
  const formatYmd = (date) => {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // 총 일수 계산
  const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  
  return `${formatYmd(start)} ~ ${formatYmd(end)} (${days}일)`;
};

// 비용 포맷팅
const formatCost = (cost) => {
  if (!cost) return '미정';
  return cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
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

// 관심 표시 토글
const toggleInterest = () => {
  post.value.isInterested = !post.value.isInterested;
  post.value.interestCount += post.value.isInterested ? 1 : -1;
};

// 동행 신청 토글
const toggleApply = () => {
  if (isApplied.value) {
    // 신청 취소 확인
    if (confirm('동행 신청을 취소하시겠습니까?')) {
      isApplied.value = false;
    }
  } else {
    // 동행 신청 기능
    isApplied.value = true;
  }
};

// 댓글 등록
const submitComment = () => {
  if (!newComment.value.trim()) return;
  
  // 실제 구현 시 API 호출
  const currentDate = new Date().toISOString();
  const newCommentObj = {
    id: comments.value.length + 1,
    author: userName.value,
    content: newComment.value,
    createdAt: currentDate,
    isAuthor: userName.value === post.value.author
  };
  
  comments.value.push(newCommentObj);
  post.value.commentCount += 1;
  newComment.value = '';
  
  // 자동으로 스크롤 최하단으로 이동
  setTimeout(() => {
    const commentsList = document.querySelector('.comments-list');
    if (commentsList) {
      commentsList.scrollTop = commentsList.scrollHeight;
    }
  }, 100);
};

// 댓글 삭제
const deleteComment = (commentId) => {
  if (confirm('정말 댓글을 삭제하시겠습니까?')) {
    const index = comments.value.findIndex(comment => comment.id === commentId);
    if (index !== -1) {
      comments.value.splice(index, 1);
      post.value.commentCount -= 1;
    }
  }
};

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

// 페이지 로드 시 게시글 정보 가져오기
const fetchPostDetail = async () => {
  // 실제 구현 시 API 호출
  // const postId = route.params.id;
  // const response = await fetch(`/api/partner-posts/${postId}`);
  // post.value = await response.json();
  
  // 임시 데이터 (샘플)
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
};

// 컴포넌트 마운트 시
onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  
  // 인증 확인
  const isAuthenticated = await requireAuth();
  if (!isAuthenticated) return;
  
  // 게시글 상세 정보 가져오기
  await fetchPostDetail();
});

// 컴포넌트 언마운트 시
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.post-detail-page {
  padding-top: 60px;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 0;
}

.content-wrapper {
  display: flex;
  gap: 30px;
  padding: 0 20px;
}

/* 사이드바 */
.sidebar {
  width: 300px;
  flex-shrink: 0;
}

.main-column {
  flex: 1;
}

.author-card, .travel-info-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 20px;
}

.author-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.author-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 12px;
}

.author-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.author-badges {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.badge.gender {
  background-color: #E6F0FF;
  color: #4a6ee0;
}

.badge.age {
  background-color: #F0F0FF;
  color: #6c5ce7;
}

.author-stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 15px 0;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 13px;
  color: #888;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.interest-btn, .apply-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ddd;
}

.interest-btn {
  background-color: white;
  color: #666;
}

.interest-btn.active {
  color: #FF6B6B;
  border-color: #FF6B6B;
  background-color: #FFF0F0;
}

.apply-btn {
  background-color: #4a6ee0;
  color: white;
  border-color: #4a6ee0;
}

.apply-btn.applied {
  background-color: #2ECC71;
  border-color: #2ECC71;
}

.count-badge {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
  color: #666;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-icon {
  width: 36px;
  height: 36px;
  background-color: #f0f0ff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 13px;
  color: #888;
  margin-bottom: 2px;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* 내비게이션 바 */
.navigation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 0;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #4a6ee0;
}

.post-meta {
  font-size: 14px;
  color: #888;
}

.dot-divider {
  margin: 0 5px;
}

/* 게시글 컨테이너 */
.post-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 30px;
  margin-bottom: 20px;
}

/* 게시글 헤더 */
.post-header {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.post-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  line-height: 1.4;
}

/* 게시글 내용 */
.post-content {
  margin-bottom: 20px;
}

.content-text {
  font-size: 15px;
  line-height: 1.8;
  color: #444;
  white-space: pre-line;
}

/* 댓글 섹션 */
.comments-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.comment-count {
  font-size: 16px;
  color: #4a6ee0;
  margin-left: 6px;
}

.comment-form {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.form-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.form-input-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-input {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.comment-input:focus {
  outline: none;
  border-color: #4a6ee0;
}

.submit-comment-btn {
  align-self: flex-end;
  padding: 8px 16px;
  background-color: #4a6ee0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-comment-btn:hover {
  background-color: #3a5ecc;
}

.submit-comment-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.comments-list {
  max-height: 600px;
  overflow-y: auto;
}

.no-comments {
  text-align: center;
  padding: 40px 0;
  color: #888;
}

.comment-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 15px;
  font-weight: 600;
  flex-shrink: 0;
}

.comment-author-info {
  flex: 1;
}

.author-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-author-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.author-badge {
  font-size: 11px;
  background-color: #F0F0FF;
  color: #4a6ee0;
  padding: 2px 6px;
  border-radius: 10px;
}

.comment-meta {
  font-size: 12px;
  color: #888;
}

.comment-content {
  font-size: 14px;
  line-height: 1.5;
  color: #444;
  margin-bottom: 10px;
  padding-left: 48px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

.delete-comment-btn {
  background: none;
  border: none;
  font-size: 12px;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}

.delete-comment-btn:hover {
  color: #e74c3c;
}

/* 반응형 */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    order: 2;
  }
  
  .main-column {
    order: 1;
  }
  
  .author-card {
    margin-bottom: 0;
  }
  
  .action-buttons {
    flex-direction: row;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px 0;
  }
  
  .post-container, .comments-section {
    padding: 20px;
  }
  
  .comment-content {
    padding-left: 0;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>