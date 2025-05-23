<!-- src/pages/PartnerPostDetailPage.vue -->
<template>
  <div class="post-detail-page">
    <AppHeader :is-shrunk="isScrolled" />
    
    <main class="main-content">
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
              
              <!-- 작성자인 경우 동행 마감 버튼, 아닌 경우 동행 신청 버튼 -->
              <button 
                class="apply-btn"
                :class="{ 
                  applied: isApplied,
                  'close-btn': isAuthor,
                  'closed': post.boardType === 'CLOSED'
                }"
                @click="isAuthor ? togglePostStatus() : toggleApply()"
                :disabled="post.boardType === 'CLOSED'"
              >
                <svg v-if="!isAuthor" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M17 11L19 13L23 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ getApplyButtonText() }}</span>
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
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#8e6ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="#8e6ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#8e6ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#8e6ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#8e6ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#8e6ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#8e6ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#8e6ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
                    <path d="M12 1V23" stroke="#8e6ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#8e6ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
          <!-- 게시글 컨테이너 -->
          <div class="post-container">
            
            
            <div class="post-title-wrapper">
              <div class="title-and-badge">
                <h1 class="post-title">{{ post.title }}</h1>
                <span class="board-type-badge" :class="getBoardTypeClass(post.boardType)">
                  {{ getBoardTypeText(post.boardType) }}
                </span>
              </div>
              <div v-if="isAuthor" class="post-actions">
                <button class="delete-post-btn" @click="confirmDeletePost">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  게시글 삭제하기
                </button>
              </div>
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
                {{ getAvatarInitial(userNickname) }}
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
                
                <!-- 일반 모드: 댓글 내용 표시 -->
                <div v-if="editingCommentId !== comment.id" class="comment-content">
                  {{ comment.content }}
                </div>
                
                <!-- 편집 모드: 댓글 수정 폼 -->
                <div v-else class="comment-edit-form">
                  <textarea 
                    v-model="editContent" 
                    class="comment-edit-input"
                    rows="3"
                    placeholder="댓글을 수정해주세요"
                  ></textarea>
                  <div class="edit-actions">
                    <button class="edit-cancel-btn" @click="cancelEdit">취소</button>
                    <button 
                      class="edit-submit-btn" 
                      @click="submitEdit(comment.id)"
                      :disabled="!editContent.trim()"
                    >
                      수정하기
                    </button>
                  </div>
                </div>
                
                <!-- 댓글 액션 버튼들 (수정 모드가 아닐 때만 표시) -->
                <div v-if="editingCommentId !== comment.id" class="comment-actions">
                  <!-- 수정 버튼 -->
                  <button 
                    v-if="comment.author === userNickname"
                    class="edit-comment-btn"
                    @click="editComment(comment.id)"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    수정
                  </button>
                  
                  <!-- 삭제 버튼 -->
                  <button 
                    v-if="comment.author === userNickname || post.author === userNickname"
                    class="delete-comment-btn"
                    @click="deleteComment(comment.id)"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
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
const { userName, userNickname, requireAuth } = useAuth();

// 라우터 및 라우트 설정
const router = useRouter();
const route = useRoute();

// 상태 정의
const isScrolled = ref(false);
const isLoading = ref(true);
const isApplied = ref(false);
const isAuthor = ref(false); // 사용자가 게시글 작성자인지 여부
const newComment = ref('');

// 편집 모드 상태 관리를 위한 변수들
const editingCommentId = ref(null); // 현재 편집 중인 댓글 ID
const editContent = ref(''); // 편집 중인 내용

// 게시글 데이터
const post = ref({
  id: 0,
  title: '',
  content: '',
  author: '',
  authorGender: '',
  authorAge: 0,
  authorTravelCount: 0,
  authorPartnerCount: 0,
  destination: '',
  travelStartDate: '',
  travelEndDate: '',
  recruitCount: 0,
  estimatedCost: 0,
  createdAt: '',
  views: 0,
  interestCount: 0,
  commentCount: 0,
  isInterested: false,
  boardType: 'OPEN'
});

// 댓글 데이터
const comments = ref([]);

// 뒤로 가기
const goBack = () => {
  router.push('/board');
};

// 동행 신청/마감 버튼 텍스트
const getApplyButtonText = () => {
  if (isAuthor.value) {
    return post.value.boardType === 'CLOSED' ? '마감 완료' : '동행 마감';
  }
  return isApplied.value ? '신청 완료' : '동행 신청';
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  
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

// 여행 기간 포맷팅
const formatTravelPeriod = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
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
  return gender === 'M' ? '남성' : gender === 'W' ? '여성' : '무관';
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

// 관심 표시 토글
const toggleInterest = async () => {
  try {
    const postId = route.params.id;
    const response = await fetch(`http://localhost:8080/api/v1/boards/${postId}/interest`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`관심 표시 업데이트 실패: ${response.status}`);
    }
    
    // 성공 시 UI 업데이트
    post.value.isInterested = !post.value.isInterested;
    post.value.interestCount += post.value.isInterested ? 1 : -1;
    
  } catch (error) {
    console.error('관심 표시 업데이트 실패:', error);
  }
};

// 동행 신청 토글 (비작성자용)
const toggleApply = () => {
  if (post.value.boardType === 'CLOSED') {
    alert('이미 마감된 게시글입니다.');
    return;
  }
  
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

// 게시글 상태 변경 (작성자용) - 수정된 부분
const togglePostStatus = async () => {
  // 이미 마감된 상태라면 아무 동작 없음
  if (post.value.boardType === 'CLOSED') {
    return;
  }
  
  // 마감 확인
  if (confirm('게시글을 마감 상태로 변경하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    try {
      const postId = route.params.id;
      
      // 실제 API 호출
      const response = await fetch(`http://localhost:8080/api/v1/boards/updateType/${postId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('JWT-TOKEN')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`게시글 상태 변경 실패: ${response.status}`);
      }
      
      // 응답 확인
      const responseData = await response.json();
      console.log('게시글 상태 변경 성공:', responseData);
      
      // 성공 시 UI 업데이트
      post.value.boardType = 'CLOSED';
      
      // 알림 메시지
      alert('동행 모집이 마감되었습니다.');
      
    } catch (error) {
      console.error('게시글 상태 변경 실패:', error);
      alert('게시글 상태 변경에 실패했습니다.');
    }
  }
};

// 댓글 등록
const submitComment = async () => {
  if (!newComment.value.trim()) return;
  
  try {
    const postId = route.params.id;
    
    // 백엔드에 전송할 데이터 구성
    const commentData = {
      boardID : parseInt(postId),
      content: newComment.value
    };
    
    const response = await fetch(`http://localhost:8080/api/v1/boards/${postId}/comments`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(commentData)
    });
    
    if (!response.ok) {
      throw new Error(`댓글 등록 실패: ${response.status}`);
    }
    
    // 백엔드에서 반환한 데이터로 새 댓글 객체 생성
    const responseData = await response.json();
    
    // 새 댓글 객체 생성 - 백엔드에서 받은 데이터 사용
    const newCommentObj = {
      id: responseData.id,
      author: responseData.author,
      content: responseData.content,
      createdAt: responseData.createdAt,
      isAuthor: responseData.isAuthor,
      isNew: true // 애니메이션 효과를 위한 플래그
    };
    
    // 댓글 목록 맨 앞에 새 댓글 추가 (최신순으로 표시)
    comments.value.unshift(newCommentObj);
    
    // 댓글 입력창 초기화
    newComment.value = '';
    
    // 댓글 카운트 증가
    post.value.commentCount = (post.value.commentCount || 0) + 1;
    
  } catch (error) {
    console.error('댓글 등록 실패:', error);
    alert(`댓글 등록에 실패했습니다: ${error.message}`);
  }
};

// 댓글 수정 모드 진입
const editComment = (commentId) => {
  const comment = comments.value.find(c => c.id === commentId);
  if (comment) {
    editingCommentId.value = commentId;
    editContent.value = comment.content;
  }
};

// 댓글 수정 취소
const cancelEdit = () => {
  editingCommentId.value = null;
  editContent.value = '';
};


// 댓글 수정 완료
const submitEdit = async (commentId) => {
  if (!editContent.value.trim()) return;
  
  try {
    // CommentDTO 객체 생성
    const commentDTO = {
      id: commentId,
      content: editContent.value,
      writer: comments.value.find(c => c.id === commentId).author
    };
    
    // 백엔드 API 호출
    const response = await fetch(`http://localhost:8080/api/v1/boards/comment/${commentId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('JWT-TOKEN')
      },
      body: JSON.stringify(commentDTO)
    });
    
    // 응답 확인 (상태 코드만 확인)
    if (!response.ok) {
      throw new Error(`댓글 수정 실패: ${response.status}`);
    }
    
    // 서버 응답 파싱 대신 제출한 내용으로 UI 직접 업데이트
    const commentIndex = comments.value.findIndex(c => c.id === commentId);
    if (commentIndex !== -1) {
      // 업데이트된 내용으로 댓글 객체 업데이트
      comments.value[commentIndex].content = editContent.value;
    }
    
    // 성공 메시지
    alert('댓글이 성공적으로 수정되었습니다.');
    
    // 편집 모드 종료
    cancelEdit();
    
  } catch (error) {
    console.error('댓글 수정 실패:', error);
    alert(`댓글 수정에 실패했습니다: ${error.message}`);
  }
};



// 댓글 삭제
const deleteComment = async (commentId) => {
  if (confirm('정말 댓글을 삭제하시겠습니까?')) {
    try {
      // 백엔드 API 호출 - 수정된 엔드포인트 사용
      const response = await fetch(`http://localhost:8080/api/v1/boards/comment/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('token') // JWT 토큰 추가
        }
      });
      
      // 응답 상태 확인
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`댓글 삭제 실패: ${response.status} ${errorText}`);
      }
      
      // 성공 시 UI에서 댓글 제거 (새로고침 없이)
      comments.value = comments.value.filter(comment => comment.id !== commentId);
      
      // 댓글 카운트 감소
      post.value.commentCount = Math.max(0, (post.value.commentCount || 1) - 1);
      
      // 성공 메시지
      alert('댓글이 성공적으로 삭제되었습니다.');
      
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert(`댓글 삭제에 실패했습니다: ${error.message}`);
    }
  }
};


// 스크롤 이벤트 핸들러
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

// 페이지 로드 시 게시글 정보 가져오기
const fetchPostDetail = async () => {
  isLoading.value = true;
  try {
    const postId = route.params.id;
    console.log('게시글 ID:', postId);
    
    const response = await fetch(`http://localhost:8080/api/v1/boards/${postId}`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('token') // JWT 토큰 추가
      }
    });
    
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('게시글 상세 데이터:', data);
    
    // API 응답 데이터를 내부 포맷으로 변환
    post.value = {
        id: postId,
        title: data.title,
        content: data.detail,
        author: data.nickname,
        authorGender: data.gender,
        authorAge: data.age,
        authorTravelCount: data.travelCount || 0,
        authorPartnerCount: data.companiesCount || 0,
        destination: data.location,
        travelStartDate: data.startDate,
        travelEndDate: data.endDate,
        recruitCount: data.memberCount || 1,
        estimatedCost: data.cost,
        createdAt: data.createdAt,
        views: data.viewCount || 0,
        interestCount: 0, // API에서 제공하지 않는 경우
        commentCount: data.comments?.length || 0,
        isInterested: false, // API에서 제공하지 않는 경우
        boardType: data.boardType || 'OPEN' // 게시글 상태 추가
    };
    
    // 사용자가 작성자인지 확인
    isAuthor.value = post.value.author === userNickname.value;
    
    // 댓글 데이터 설정
    if (data.comments && Array.isArray(data.comments)) {
      comments.value = data.comments.map(comment => ({
        id: comment.id || Math.random().toString(36).substr(2, 9), // ID가 없으면 임의 생성
        author: comment.writer,
        content: comment.content,
        createdAt: comment.createdAt,
        isAuthor: comment.writer === data.nickname, // 게시글 작성자와 댓글 작성자가 같은지
        profileImage: comment.wiriterProfileImage
      }));
    } else {
      comments.value = [];
    }
    
  } catch (error) {
    console.error('게시글 상세 정보 로드 실패:', error);
  } finally {
    isLoading.value = false;
  }
};

// 게시글 삭제 확인
const confirmDeletePost = () => {
  if (confirm('정말 이 게시글을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.')) {
    deletePost();
  }
};

// 게시글 삭제 API 호출
const deletePost = async () => {
  try {
    const postId = route.params.id;
    
    // 백엔드 API 호출
    const response = await fetch(`http://localhost:8080/api/v1/boards/${postId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('JWT-TOKEN')
      }
    });
    
    // 응답 확인
    if (!response.ok) {
      throw new Error(`게시글 삭제 실패: ${response.status}`);
    }
    
    // 성공 메시지
    alert('게시글이 성공적으로 삭제되었습니다.');
    
    // 게시판 목록 페이지로 리디렉션
    router.push('/board');
    
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    alert(`게시글 삭제에 실패했습니다: ${error.message}`);
  }
};

// 컴포넌트 마운트 시
onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  
  // 인증 확인
  await requireAuth();

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
  border-radius: 12px;
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

.title-and-badge {
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge.gender {
  background-color: rgba(142, 106, 217, 0.1);
  color: #8e6ad9;
}

.badge.age {
  background-color: rgba(167, 139, 250, 0.1);
  color: #a78bfa;
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
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid #ddd;
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
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
  color: white;
  border-color: #8e6ad9;
}

.apply-btn.applied {
  background: linear-gradient(135deg, #2ECC71, #27AE60);
  border-color: #2ECC71;
}

.apply-btn.close-btn {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border-color: #e74c3c;
  color: #ffffff;
}

.apply-btn.closed {
  background-color: #bdc3c7;
  border-color: #bdc3c7;
  color: #ffffff;
  cursor: not-allowed;
}

.apply-btn:hover:not(.closed) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.3);
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
  background-color: rgba(142, 106, 217, 0.1);
  border-radius: 8px;
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
  margin-left: 350px;
  margin-right: 27px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #000000;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 0;
  transition: color 0.2s;
  font-size: 1em;
}

.back-btn:hover {
  color: #8e6ad9;
}

.post-meta {
  font-size: 14px;
  color: #000000;
}

.dot-divider {
  margin: 0 5px;
}

/* 게시글 컨테이너 */
.post-container {
  background-color: white;
  border-radius: 12px;
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
  border-radius: 12px;
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
  color: #8e6ad9;
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
  border-color: #8e6ad9;
}

.submit-comment-btn {
  align-self: flex-end;
  padding: 10px 20px;
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-comment-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.3);
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
  background-color: rgba(142, 106, 217, 0.1);
  color: #8e6ad9;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  background-color: transparent;
  border: none;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.delete-comment-btn:hover {
  background-color: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.delete-comment-btn:active {
  transform: scale(0.95);
}

.delete-comment-btn svg {
  margin-right: 4px;
}

.delete-comment-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #e74c3c;
  transition: width 0.2s;
}

.delete-comment-btn:hover::after {
  width: 100%;
}

.edit-comment-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  background-color: transparent;
  border: none;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  margin-right: 8px;
}

.edit-comment-btn:hover {
  background-color: rgba(142, 106, 217, 0.1);
  color: #8e6ad9;
}

.edit-comment-btn:active {
  transform: scale(0.95);
}

.edit-comment-btn svg {
  margin-right: 4px;
}

.edit-comment-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1px;
  background-color: #8e6ad9;
  transition: width 0.2s, left 0.2s;
}

.edit-comment-btn:hover::after {
  width: 100%;
  left: 0;
}

/* 댓글 수정 폼 스타일 */
.comment-edit-form {
  padding-left: 48px;
  margin-bottom: 10px;
}

.comment-edit-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  font-family: inherit;
  transition: border-color 0.2s;
  margin-bottom: 10px;
  background-color: #f9f9f9;
}

.comment-edit-input:focus {
  outline: none;
  border-color: #8e6ad9;
  background-color: white;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.edit-cancel-btn, .edit-submit-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-cancel-btn {
  background-color: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.edit-cancel-btn:hover {
  background-color: #eee;
}

.edit-submit-btn {
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
  color: white;
  border: 1px solid #8e6ad9;
}

.edit-submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(142, 106, 217, 0.3);
}

.edit-submit-btn:disabled {
  background-color: #bdc3c7;
  border-color: #bdc3c7;
  cursor: not-allowed;
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
  
  .comment-edit-form {
    padding-left: 0;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}

.post-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 16px;
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

.post-actions {
  display: flex;
  justify-content: flex-end;
}

.delete-post-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #fff0f0;
  color: #e74c3c;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-post-btn:hover {
  background-color: #ffebee;
  border-color: #e74c3c;
}

.delete-post-btn svg {
  margin-right: 4px;
}
</style>