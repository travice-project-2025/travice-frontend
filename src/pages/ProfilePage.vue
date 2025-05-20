<!-- src/pages/ProfilePage.vue -->
<template>
  <div class="profile-page">
    <AppHeader :is-shrunk="true" />
    <main class="container">
      <div class="page-header">
        <h1 class="page-title">내 프로필</h1>
        <p class="page-subtitle">개인정보와 여행 통계를 확인하고 관리할 수 있습니다</p>
      </div>

      <div class="profile-content">
        <!-- 왼쪽: 프로필 정보 카드 -->
        <div class="profile-card">
          <div class="profile-avatar">
            <div class="avatar-wrapper">
              <div class="avatar-image" @click="triggerImageUpload">
                <img v-if="previewImage" :src="previewImage" alt="프로필 이미지" />
                <span v-else>{{ avatarText }}</span>
                <div class="avatar-overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 16L8 11L13 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13 19H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 5L18 7L21 4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13 11L21 11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <input 
                type="file" 
                ref="fileInput" 
                accept="image/*" 
                style="display: none" 
                @change="handleImageChange" 
              />
            </div>
            <p class="avatar-hint">이미지를 클릭하여 프로필 사진 변경</p>
          </div>
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="profile-form-group">
              <label>이메일</label>
              <div class="form-control disabled">
                {{ userInfo.email }}
                <span class="badge">소셜 로그인</span>
              </div>
            </div>
            <div class="profile-form-group">
              <label>이름</label>
              <div class="form-control disabled">
                {{ userInfo.name }}
                <span class="badge">소셜 로그인</span>
              </div>
            </div>
            <div class="profile-form-group">
              <label for="nickname">닉네임</label>
              <input
                id="nickname"
                v-model="userInfo.nickname"
                type="text"
                class="form-control"
                placeholder="닉네임을 입력하세요"
              />
            </div>
            <div class="profile-form-row">
              <div class="profile-form-group">
                <label for="gender">성별</label>
                <div class="gender-selector">
                  <div 
                    class="gender-option" 
                    :class="{ 'selected': userInfo.gender === 'male' }"
                    @click="userInfo.gender = 'male'"
                  >
                    <div class="gender-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="7" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 15V22" stroke="currentColor" stroke-width="2"/>
                        <path d="M9 19H15" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </div>
                    <span>남성</span>
                  </div>
                  <div 
                    class="gender-option" 
                    :class="{ 'selected': userInfo.gender === 'female' }"
                    @click="userInfo.gender = 'female'"
                  >
                    <div class="gender-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="7" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 15V22" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </div>
                    <span>여성</span>
                  </div>

                </div>
              </div>
              <div class="profile-form-group">
                <label for="age">나이</label>
                <div class="age-input-wrapper">
                  <input
                    id="age"
                    v-model.number="userInfo.age"
                    type="number"
                    min="1"
                    max="120"
                    class="form-control age-input"
                    placeholder="나이 입력"
                    @input="validateAge"
                  />
                  <span class="age-suffix">세</span>
                </div>
                <span v-if="ageError" class="error-message">{{ ageError }}</span>
              </div>
            </div>
            <button type="submit" class="save-button" :disabled="isLoading || !!ageError">
              <span v-if="isLoading" class="button-spinner"></span>
              <span v-else>저장하기</span>
            </button>
          </form>
        </div>

        <!-- 오른쪽: 여행 통계 카드 -->
        <div class="stats-section">
          <!-- 통계 카드 -->
          <div class="stats-card">
            <h3 class="stats-title">여행 통계</h3>
            <div class="stats-grid">
              <div class="stats-item">
                <div class="stats-number">{{ userInfo.tripCount }}</div>
                <div class="stats-label">총 여행 횟수</div>
              </div>
              <div class="stats-item">
                <div class="stats-number">{{ userInfo.companionCount }}</div>
                <div class="stats-label">동행 횟수</div>
              </div>
              <div class="stats-item">
                <div class="stats-number">{{ userInfo.regionCount }}</div>
                <div class="stats-label">방문 지역 수</div>
              </div>
            </div>
          </div>

          <!-- 여행 여권 스탬프 -->
          <div class="passport-card">
            <h3 class="passport-title">내 여행 스탬프</h3>
            <div class="passport-description">
              지금까지 {{ userStats.regionCount }}곳의 지역을 방문했어요!
            </div>
            <div class="passport-stamps">
              <div 
                v-for="stamp in userStats.visitedRegions" 
                :key="stamp.code"
                class="stamp"
                :class="{ 'has-visited': stamp.visited }"
              >
                <div class="stamp-inner">
                  <div class="stamp-icon">
                    <svg v-if="stamp.visited" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 11L12 14L22 4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="stamp-name">{{ stamp.name }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 최근 여행 목록 -->
          <div class="recent-trips-card">
            <h3 class="recent-trips-title">최근 여행</h3>
            <div v-if="userStats.recentTrips.length > 0" class="recent-trips-list">
              <div 
                v-for="trip in userStats.recentTrips" 
                :key="trip.id"
                class="trip-item"
                @click="viewTripDetails(trip.id)"
              >
                <div class="trip-item-image">
                  <img :src="trip.imageUrl || '/placeholder-image.jpg'" alt="여행 이미지">
                </div>
                <div class="trip-item-info">
                  <div class="trip-item-title">{{ trip.title }}</div>
                  <div class="trip-item-date">{{ trip.date }}</div>
                </div>
                <div class="trip-item-arrow">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18L15 12L9 6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            <div v-else class="empty-trips">
              <div class="empty-trips-message">아직 여행 기록이 없습니다</div>
              <button @click="goToCreate" class="create-trip-button">
                새 여행 만들기
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';

const router = useRouter();
const isLoading = ref(false);
const previewImage = ref(null);
const fileInput = ref(null);
const ageError = ref('');

// 사용자 정보
const userInfo = ref({
  email: '',  
  name: '',              
  nickname: '',                // 닉네임은 사용자가 수정 가능
  gender: '',                  // 성별은 사용자가 선택 가능
  age: null,                   // 나이는 사용자가 입력 가능
  profileImage: null,          // 프로필 이미지
  tripCount: '',               // 총 여행 횟수
  companionCount: '',           // 동행 횟수
  regionCount: '',              // 방문 지역 수
});

// 아바타 텍스트 - 이름의 첫 글자
const avatarText = computed(() => {
  return userInfo.value.name ? userInfo.value.name.charAt(0).toUpperCase() : '?';
});

// 사용자 여행 통계 (실제로는 API에서 가져옴)
const userStats = ref({
  
  // 방문한 지역들 - 스탬프 표시용
  visitedRegions: [
    { code: 'seoul', name: '서울', visited: true },
    { code: 'busan', name: '부산', visited: true },
    { code: 'jeju', name: '제주', visited: true },
    { code: 'gangneung', name: '강릉', visited: true },
    { code: 'gyeongju', name: '경주', visited: true },
    { code: 'jeonju', name: '전주', visited: true },
    { code: 'sokcho', name: '속초', visited: true },
    { code: 'yeosu', name: '여수', visited: true },
    { code: 'suwon', name: '수원', visited: false },
    { code: 'incheon', name: '인천', visited: false },
    { code: 'daegu', name: '대구', visited: false },
    { code: 'daejeon', name: '대전', visited: false },
    { code: 'gwangju', name: '광주', visited: false },
    { code: 'ulsan', name: '울산', visited: false },
    { code: 'andong', name: '안동', visited: false },
  ],
  
  // 최근 여행 목록 초기화
  recentTrips: []
});

// 이미지 업로드 트리거
const triggerImageUpload = () => {
  fileInput.value.click();
};

// 이미지 변경 핸들러
const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // 이미지 파일인지 확인
  if (!file.type.match('image.*')) {
    alert('이미지 파일만 업로드 가능합니다.');
    return;
  }
  
  // 파일 크기 제한 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('이미지 크기는 5MB 이하여야 합니다.');
    return;
  }
  
  // 이미지 미리보기 생성
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
    userInfo.value.profileImage = file; // 실제 파일 저장
  };
  reader.readAsDataURL(file);
};


// 나이 유효성 검사
const validateAge = () => {
  const age = userInfo.value.age;
  
  if (age === null || age === '') {
    ageError.value = '';
    return;
  }
  
  if (isNaN(age) || age < 1) {
    ageError.value = '유효한 나이를 입력해주세요.';
    return;
  }
  
  if (age > 120) {
    ageError.value = '나이는 120세 이하여야 합니다.';
    return;
  }
  
  ageError.value = '';
};


// 프로필 업데이트 함수 (PATCH 사용)
const updateProfile = async () => {
  if (ageError.value) return;
  
  isLoading.value = true;
  
  try {
    // 변경할 필드만 포함하는 객체 생성
    const updateData = {
      nickname: userInfo.value.nickname,
      gender: userInfo.value.gender === 'male' ? 'M' : 'W',
      age: userInfo.value.age
    };
    
    console.log('프로필 업데이트 시작:', updateData);
    
    // PATCH 메서드로 데이터 전송
    const response = await fetch('http://localhost:8080/api/v1/users/me', {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `서버 오류: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('응답:', result);
    
    if (result.success) {
      // 성공 메시지 표시
      alert(result.message || '프로필이 성공적으로 업데이트되었습니다.');
      
      // 최신 정보로 프로필 다시 불러오기
      await fetchUserProfile();
    } else {
      throw new Error(result.message || '업데이트에 실패했습니다.');
    }
  } catch (error) {
    console.error('프로필 업데이트 실패:', error);
    alert('프로필 업데이트에 실패했습니다: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

// 여행 상세 페이지로 이동
const viewTripDetails = (tripId) => {
  router.push(`/plan/${tripId}`);
};

// 새 여행 생성 페이지로 이동
const goToCreate = () => {
  router.push('/create-plan');
};

// 사용자 프로필 정보 가져오기 함수 추가 (재사용 가능)
const fetchUserProfile = async () => {

  try {
    const response = await fetch('http://localhost:8080/api/v1/users/me', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });
    const data = await response.json();

    userInfo.value = {
        email: data.email,
        name: data.name,
        nickname: data.nickname,
        gender: data.gender === 'M' ? 'male' : 'female',
        age: data.age,
        profileImageUrl: data.profileImageUrl,
        tripCount: data.tripCount,
        companionCount: data.companionCount,
        regionCount: data.regionCount,
    };

    if(data.profileImageUrl){
      previewImage.value = data.profileImageUrl;
    }
  } catch (error) {
    console.error('프로필 데이터 로드 실패:', error);
  }
  
};
 
// 날짜 형식 변환 함수
const formatDate = (dateString) => {
  if (!dateString) return '날짜 미정';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '날짜 형식 오류';
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit'
    });
  } catch (error) {
    console.error('날짜 변환 오류:', error);
    return '날짜 형식 오류';
  }
};

// 수정됨: 최근 여행 목록 가져오기 함수 추가
const fetchRecentTrips = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/plans', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    const data = await response.json();
    console.log('여행 계획 데이터:', data);

    // 여행 계획 데이터를 최신순으로 정렬
    const sortedTrips = [...data].sort((a, b) => {
      return new Date(b.startDate) - new Date(a.startDate);
    });

    // 최대 3개의 최근 여행만 가져오기
    const recentTrips = sortedTrips.slice(0, 3).map(trip => ({
      id: trip.id,
      title: trip.planTitle,
      date: `${formatDate(trip.startDate)} ~ ${formatDate(trip.endDate)}`,
      imageUrl: trip.thumbnail
    }));

    userStats.value.recentTrips = recentTrips;

    console.log('최근 여행 목록:', userStats.value.recentTrips);
    
  } catch (error) {
    console.error('여행 목록을 불러오는 중 오류 발생:', error);
    userStats.value.recentTrips = [];
  }
};


// 사용자 데이터 가져오기 - 컴포넌트 마운트 시
onMounted(async () => {
 await fetchUserProfile(); 
 await fetchRecentTrips();
});
</script>

<style scoped>

.profile-page {
  min-height: 100vh;
  background-color: #fbfaff;
  font-family: "Marines", "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", sans-serif;
  padding-bottom: 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 30px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 16px;
  color: #667080;
}

.profile-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 30px;
}

/* 프로필 카드 */
.profile-card {
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(142, 106, 217, 0.04);
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 10px;
}

.avatar-image {
  width: 120px;
  height: 120px;
  background-color: #8e6ad9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: 700;
  box-shadow: 0 8px 16px rgba(142, 106, 217, 0.2);
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.avatar-image:hover .avatar-overlay {
  opacity: 1;
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.avatar-hint {
  font-size: 13px;
  color: #667080;
  margin-top: 8px;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-form-group {
  display: flex;
  flex-direction: column;
}

.profile-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.profile-form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 8px;
}

.form-control {
  padding: 14px;
  border: 1px solid #efe6ff;
  border-radius: 12px;
  font-size: 16px;
  color: #2c3e50;
  transition: all 0.2s;
  background-color: white;
}

.form-control:focus {
  outline: none;
  border-color: #8e6ad9;
  box-shadow: 0 0 0 3px rgba(142, 106, 217, 0.15);
}

.form-control.disabled {
  background-color: #f7f2ff;
  cursor: not-allowed;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 성별 선택기 스타일 */
.gender-selector {
  display: flex;
  gap: 8px;
}

.gender-option {
  flex: 1;
  background-color: #f7f2ff;
  border-radius: 12px;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.gender-option:hover {
  background-color: #f0e7fd;
}

.gender-option.selected {
  background-color: #f0e7fd;
  border-color: #8e6ad9;
}

.gender-icon {
  color: #8e6ad9;
  margin-bottom: 6px;
}

.gender-option.selected .gender-icon {
  color: #8e6ad9;
}

.gender-option span {
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
}

/* 나이 입력 스타일 */
.age-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.age-input {
  padding-right: 40px;
}

.age-suffix {
  position: absolute;
  right: 15px;
  font-size: 16px;
  color: #667080;
  pointer-events: none;
}

.error-message {
  font-size: 12px;
  color: #e53e3e;
  margin-top: 5px;
}

.badge {
  background-color: #efe6ff;
  color: #8e6ad9;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.save-button {
  background-color: #8e6ad9;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 10px;
  position: relative;
}

.save-button:hover {
  background-color: #7c59c5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.2);
}

.save-button:disabled {
  background-color: #d0c5e6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -10px;
  margin-left: -10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 통계 섹션 */
.stats-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.stats-card, .passport-card, .recent-trips-card {
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(142, 106, 217, 0.04);
}

.stats-title, .passport-title, .recent-trips-title {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stats-item {
  background-color: #f7f2ff;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.2s ease;
}

.stats-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(142, 106, 217, 0.1);
}

.stats-number {
  font-size: 32px;
  font-weight: 700;
  color: #8e6ad9;
  margin-bottom: 5px;
}

.stats-label {
  font-size: 14px;
  color: #667080;
}

.passport-description {
  font-size: 15px;
  color: #667080;
  margin-bottom: 20px;
}

.passport-stamps {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
}

.stamp {
  background-color: #f7f2ff;
  border-radius: 12px;
  aspect-ratio: 1;
  transition: all 0.25s ease;
  cursor: default;
  opacity: 0.5;
}

.stamp.has-visited {
  background-color: #f0e7fd;
  opacity: 1;
  box-shadow: 0 4px 8px rgba(142, 106, 217, 0.1);
}

.stamp-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.stamp-icon {
  color: #8e6ad9;
  margin-bottom: 5px;
  height: 20px;
}

.stamp-name {
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  text-align: center;
}

.recent-trips-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.trip-item {
  display: flex;
  align-items: center;
  background-color: #f7f2ff;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.trip-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.1);
}

.trip-item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 15px;
}

.trip-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.trip-item-info {
  flex: 1;
}

.trip-item-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.trip-item-date {
  font-size: 13px;
  color: #667080;
}

.trip-item-arrow {
  color: #8e6ad9;
}

.empty-trips {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
}

.empty-trips-message {
  font-size: 16px;
  color: #667080;
  margin-bottom: 20px;
}

.create-trip-button {
  background-color: #8e6ad9;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.create-trip-button:hover {
  background-color: #7c59c5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.2);
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
  
  .passport-stamps {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .passport-stamps {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-item:last-child {
    grid-column: span 2;
  }
  
  .gender-selector {
    flex-wrap: wrap;
  }
  
  .gender-option {
    flex-basis: calc(50% - 4px);
  }
}

@media (max-width: 600px) {
  .container {
    padding: 80px 16px 20px;
  }
  
  .profile-card,
  .stats-card,
  .passport-card,
  .recent-trips-card {
    padding: 20px;
  }
  
  .profile-form-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .passport-stamps {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-item {
    grid-column: span 1 !important;
  }

  .gender-selector {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .avatar-image {
    width: 100px;
    height: 100px;
    font-size: 38px;
  }
}

/* Chrome, Safari, Edge, Opera */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

/* 트랜지션 및 애니메이션 효과 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>