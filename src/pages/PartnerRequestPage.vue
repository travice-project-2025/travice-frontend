<!-- src/pages/PartnerRequestsPage.vue -->
<template>
  <div class="partner-requests-page">
    <AppHeader :is-shrunk="isScrolled" />
    <main class="main-content">
      <div class="content-wrapper">
        <!-- 왼쪽 사이드바 -->
        <div class="sidebar">
          <div class="stats-card">
            <h3 class="card-title">동행 신청 현황</h3>
            <div class="stats-content">
              <div class="stat-item">
                <div class="stat-value">{{ pendingRequests.length }}</div>
                <div class="stat-label">대기 중</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ acceptedRequests.length }}</div>
                <div class="stat-label">수락됨</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ rejectedRequests.length }}</div>
                <div class="stat-label">거절됨</div>
              </div>
            </div>
          </div>
          
          <div class="filter-card">
            <h3 class="card-title">필터</h3>
            <div class="filter-content">
              <div class="filter-item">
                <label>상태</label>
                <select v-model="statusFilter" class="filter-select">
                  <option value="all">전체</option>
                  <option value="pending">대기 중</option>
                  <option value="accepted">수락됨</option>
                  <option value="rejected">거절됨</option>
                </select>
              </div>
              
              <div class="filter-item">
                <label>여행</label>
                <select v-model="tripFilter" class="filter-select">
                  <option value="all">전체 여행</option>
                  <option v-for="trip in myTrips" :key="trip.id" :value="trip.id">
                    {{ trip.title }}
                  </option>
                </select>
              </div>
              
              <div class="filter-item">
                <label>성별</label>
                <select v-model="genderFilter" class="filter-select">
                  <option value="all">전체</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </div>
              
              <div class="filter-item">
                <label>정렬</label>
                <select v-model="sortOption" class="filter-select">
                  <option value="newest">최신순</option>
                  <option value="oldest">오래된순</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="help-card">
            <h3 class="card-title">안내사항</h3>
            <div class="help-content">
              <p>• 동행 신청자와 충분한 소통 후 수락 여부를 결정하세요.</p>
              <p>• 메시지를 통해 여행 계획을 구체적으로 논의해보세요.</p>
              <p>• 거절한 신청은 30일 후 자동으로 목록에서 삭제됩니다.</p>
              <p>• 수락 후에도 문제가 있다면 언제든 취소할 수 있습니다.</p>
            </div>
          </div>
        </div>
        
        <!-- 오른쪽 메인 컬럼 -->
        <div class="main-column">
          <div class="page-header">
            <h1 class="page-title">동행 신청 관리</h1>
            <p class="page-description">여러분에게 온 동행 신청을 확인하고 관리하세요</p>
          </div>
          
          <!-- 동행 신청 목록 -->
          <div class="requests-section">
            <div v-if="filteredRequests.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <p class="empty-text">현재 조건에 맞는 동행 신청이 없습니다</p>
              <button class="reset-filter-btn" @click="resetFilters">필터 초기화</button>
            </div>
            
            <div v-else class="requests-list">
              <div 
                v-for="request in filteredRequests" 
                :key="request.id" 
                class="request-card"
                :class="{ 'status-accepted': request.status === 'accepted', 'status-rejected': request.status === 'rejected' }"
              >
                <div class="request-header">
                  <div class="trip-info">
                    <div class="trip-badge">{{ request.tripTitle }}</div>
                    <div class="request-date">{{ formatDate(request.requestDate) }}</div>
                  </div>
                  <div class="status-badge" :class="`status-${request.status}`">
                    {{ getStatusText(request.status) }}
                  </div>
                </div>
                
                <div class="request-body">
                  <div class="requester-info">
                    <div class="requester-avatar" :style="{ backgroundColor: getAvatarColor(request.requesterName) }">
                      {{ getAvatarInitial(request.requesterName) }}
                    </div>
                    <div class="requester-details">
                      <div class="requester-name-row">
                        <span class="requester-name">{{ request.requesterName }}</span>
                        <div class="requester-badges">
                          <span class="badge gender">{{ getGenderText(request.requesterGender) }}</span>
                          <span class="badge age">{{ request.requesterAge }}세</span>
                        </div>
                      </div>
                      <div class="requester-stats">
                        <span>여행 {{ request.requesterTravelCount }}회</span>
                        <span class="dot-divider">•</span>
                        <span>동행 {{ request.requesterPartnerCount }}회</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="request-message">
                    <p>{{ request.message }}</p>
                  </div>
                </div>
                
                <div class="request-actions">
                  <div v-if="request.status === 'pending'" class="action-buttons">
                    <button class="accept-btn" @click="handleRequestAction(request.id, 'accepted')">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>수락</span>
                    </button>
                    <button class="reject-btn" @click="handleRequestAction(request.id, 'rejected')">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>거절</span>
                    </button>
                  </div>
                  
                  <button class="message-btn" @click="openMessageDialog(request)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>메시지</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- 메시지 모달 -->
    <div v-if="showMessageModal" class="message-modal-overlay" @click="closeMessageDialog">
      <div class="message-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedRequest.requesterName }}님에게 메시지 보내기</h3>
          <button class="close-btn" @click="closeMessageDialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="trip-context">
            <div class="context-label">관련 여행:</div>
            <div class="context-value">{{ selectedRequest.tripTitle }}</div>
          </div>
          <textarea 
            v-model="messageText" 
            placeholder="메시지를 입력하세요..."
            class="message-textarea"
            rows="5"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeMessageDialog">취소</button>
          <button 
            class="send-btn" 
            :disabled="!messageText.trim()"
            @click="sendMessage"
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import { useAuth } from '@/composables/userAuth';

// 인증 관련 컴포저블
const { userName, requireAuth } = useAuth();

// 라우터 설정
const router = useRouter();

// 상태 정의
const isScrolled = ref(false);
const statusFilter = ref('all');
const tripFilter = ref('all');
const genderFilter = ref('all');
const sortOption = ref('newest');
const showMessageModal = ref(false);
const selectedRequest = ref({});
const messageText = ref('');

// 내 여행 목록 (실제로는 API에서 가져옴)
const myTrips = ref([
  {
    id: 1,
    title: '제주도 여행'
  },
  {
    id: 2,
    title: '유럽 백패킹'
  },
  {
    id: 3,
    title: '부산 당일치기'
  }
]);

// 동행 신청 데이터 (실제로는 API에서 가져옴)
const partnerRequests = ref([
  {
    id: 1,
    tripId: 1,
    tripTitle: '제주도 여행',
    requesterName: '바다여행',
    requesterGender: 'female',
    requesterAge: 26,
    requesterTravelCount: 5,
    requesterPartnerCount: 2,
    message: '안녕하세요! 제주도 여행에 같이 가고 싶어서 신청합니다. 저도 자연경관 구경과 맛집 탐방을 좋아해요. 사진 찍는 것도 좋아합니다. 함께 즐거운 여행 만들어보아요!',
    requestDate: '2025-05-10T14:22:00',
    status: 'pending'
  },
  {
    id: 2,
    tripId: 1,
    tripTitle: '제주도 여행',
    requesterName: '산책러',
    requesterGender: 'male',
    requesterAge: 30,
    requesterTravelCount: 8,
    requesterPartnerCount: 3,
    message: '제주도 여행 계획 보고 동행 신청합니다. 한라산 등반 경험도 있고, 렌트카 운전도 가능합니다. 일정 맞춰서 즐겁게 여행했으면 좋겠습니다.',
    requestDate: '2025-05-11T10:15:00',
    status: 'accepted'
  },
  {
    id: 3,
    tripId: 2,
    tripTitle: '유럽 백패킹',
    requesterName: '유럽여행러',
    requesterGender: 'female',
    requesterAge: 28,
    requesterTravelCount: 6,
    requesterPartnerCount: 2,
    message: '저도 7월에 유럽 여행 계획 중이에요! 영어 소통 가능하고 자유여행 좋아합니다. 특히 현지 문화 체험과 미술관 관람에 관심 많아요. 메시지 주시면 더 자세히 이야기 나눠봐요.',
    requestDate: '2025-05-05T09:45:00',
    status: 'pending'
  },
  {
    id: 4,
    tripId: 2,
    tripTitle: '유럽 백패킹',
    requesterName: '배낭족',
    requesterGender: 'male',
    requesterAge: 27,
    requesterTravelCount: 10,
    requesterPartnerCount: 4,
    message: '유럽 배낭여행은 벌써 3번째입니다. 경험 많고 여행 계획도 잘 세우는 편이에요. 영어/스페인어 가능하고 유럽 현지 친구들도 있어 더 로컬한 경험도 가능합니다. 함께 가면 도움이 될 것 같아 신청합니다.',
    requestDate: '2025-05-02T16:30:00',
    status: 'rejected'
  },
  {
    id: 5,
    tripId: 3,
    tripTitle: '부산 당일치기',
    requesterName: '해변산책',
    requesterGender: 'female',
    requesterAge: 24,
    requesterTravelCount: 3,
    requesterPartnerCount: 1,
    message: '부산 여행에 관심 있어서 신청합니다. 해운대, 광안리 쪽 맛집 정보가 많아요. 사진 찍는 것도 좋아해서 인생샷 많이 찍어드릴게요! 메시지 주세요!',
    requestDate: '2025-05-12T11:30:00',
    status: 'pending'
  }
]);

// 상태별 필터링된 요청 수
const pendingRequests = computed(() => {
  return partnerRequests.value.filter(request => request.status === 'pending');
});

const acceptedRequests = computed(() => {
  return partnerRequests.value.filter(request => request.status === 'accepted');
});

const rejectedRequests = computed(() => {
  return partnerRequests.value.filter(request => request.status === 'rejected');
});

// 필터링된 동행 신청 목록
const filteredRequests = computed(() => {
  let result = [...partnerRequests.value];
  
  // 상태 필터
  if (statusFilter.value !== 'all') {
    result = result.filter(request => request.status === statusFilter.value);
  }
  
  // 여행 필터
  if (tripFilter.value !== 'all') {
    const tripId = parseInt(tripFilter.value);
    result = result.filter(request => request.tripId === tripId);
  }
  
  // 성별 필터
  if (genderFilter.value !== 'all') {
    result = result.filter(request => request.requesterGender === genderFilter.value);
  }
  
  // 정렬
  if (sortOption.value === 'newest') {
    result.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
  } else {
    result.sort((a, b) => new Date(a.requestDate) - new Date(b.requestDate));
  }
  
  return result;
});

// 필터 초기화
const resetFilters = () => {
  statusFilter.value = 'all';
  tripFilter.value = 'all';
  genderFilter.value = 'all';
  sortOption.value = 'newest';
};

// 날짜 포맷팅
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

// 상태 텍스트 변환
const getStatusText = (status) => {
  const statusMap = {
    'pending': '대기 중',
    'accepted': '수락됨',
    'rejected': '거절됨'
  };
  
  return statusMap[status] || status;
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

// 동행 신청 처리 (수락/거절)
const handleRequestAction = (requestId, status) => {
  // 실제 구현 시에는 API 호출
  // const response = await fetch(`/api/partner-requests/${requestId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ status })
  // });
  
  // 임시 코드
  const request = partnerRequests.value.find(req => req.id === requestId);
  if (request) {
    request.status = status;
  }
  
  // 상태 변경 후 메시지
  const actionText = status === 'accepted' ? '수락' : '거절';
  alert(`동행 신청을 ${actionText}했습니다.`);
};

// 메시지 모달 열기
const openMessageDialog = (request) => {
  selectedRequest.value = request;
  showMessageModal.value = true;
  messageText.value = '';
};

// 메시지 모달 닫기
const closeMessageDialog = () => {
  showMessageModal.value = false;
};

// 메시지 전송
const sendMessage = () => {
  // 실제 구현 시에는 API 호출
  // const response = await fetch('/api/messages', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     recipientId: selectedRequest.value.requesterId,
  //     tripId: selectedRequest.value.tripId,
  //     message: messageText.value
  //   })
  // });
  
  // 임시 코드
  alert(`${selectedRequest.value.requesterName}님에게 메시지를 전송했습니다.`);
  closeMessageDialog();
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
  
  // 데이터 로드 (API 연동 시 구현)
  // await fetchPartnerRequests();
});

// 컴포넌트 언마운트 시
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.partner-requests-page {
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

.stats-card, .filter-card, .help-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  color: #333;
}

/* 통계 카드 */
.stats-content {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #888;
}

/* 필터 카드 */
.filter-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-item label {
  font-size: 14px;
  color: #666;
}

.filter-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background-color: #f9f9f9;
}

/* 도움말 카드 */
.help-content p {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.5;
}

/* 페이지 헤더 */
.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.page-description {
  font-size: 16px;
  color: #666;
}

/* 빈 상태 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 16px;
}

.reset-filter-btn {
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

/* 요청 목록 */
.requests-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.request-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s;
}

.request-card:hover {
  transform: translateY(-3px);
}

.request-card.status-accepted {
  border-left: 4px solid #2ECC71;
}

.request-card.status-rejected {
  border-left: 4px solid #E74C3C;
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9fb;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.trip-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trip-badge {
  background-color: #E6F0FF;
  color: #4a6ee0;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.request-date {
  font-size: 13px;
  color: #888;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background-color: #F9F3E5;
  color: #F2D06B;
}

.status-accepted {
  background-color: #E6F9EF;
  color: #2ECC71;
}

.status-rejected {
  background-color: #FCEAE8;
  color: #E74C3C;
}

.request-body {
  padding: 20px;
}

.requester-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.requester-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 600;
  flex-shrink: 0;
}

.requester-details {
  flex: 1;
}

.requester-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.requester-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.requester-badges {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 3px 8px;
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

.requester-stats {
  font-size: 13px;
  color: #888;
}

.dot-divider {
  margin: 0 5px;
}

.request-message {
  background-color: #f9f9fb;
  border-radius: 8px;
  padding: 16px;
}

.request-message p {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.request-actions {
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid #eee;
  gap: 12px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.accept-btn, .reject-btn, .message-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ddd;
}

.accept-btn {
  background-color: #E6F9EF;
  color: #2ECC71;
  border-color: #2ECC71;
}

.reject-btn {
  background-color: #FCEAE8;
  color: #E74C3C;
  border-color: #E74C3C;
}

.message-btn {
  background-color: #4a6ee0;
  color: white;
  border-color: #4a6ee0;
}

.accept-btn:hover {
  background-color: #2ECC71;
  color: white;
}

.reject-btn:hover {
  background-color: #E74C3C;
  color: white;
}

.message-btn:hover {
  background-color: #3a5ecc;
}

/* 메시지 모달 */
.message-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.message-modal {
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
}

.modal-body {
  padding: 20px;
}

.trip-context {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.context-label {
  font-size: 14px;
  color: #888;
}

.context-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.message-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  font-family: inherit;
}

.message-textarea:focus {
  outline: none;
  border-color: #4a6ee0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #eee;
}

.cancel-btn, .send-btn {
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn {
  background-color: #f0f0f0;
  border: none;
  color: #666;
}

.send-btn {
  background-color: #4a6ee0;
  border: none;
  color: white;
}

.send-btn:disabled {
  background-color: #ccc;
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
  
  .stats-content {
    justify-content: space-around;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px 0;
  }
  
  .request-card {
    border-radius: 0;
  }
  
  .request-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .status-badge {
    align-self: flex-start;
  }
  
  .requester-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .requester-name-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .request-actions {
    flex-direction: column;
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .accept-btn, .reject-btn, .message-btn {
    flex: 1;
  }
}
</style>