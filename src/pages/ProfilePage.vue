<!-- src/pages/ProfilePage.vue -->
<template>
  <div class="profile-page">
    <AppHeader :is-shrunk="isScrolled" />
    <main class="container main-content">
      <!-- 사용자 환영 메시지 -->
      <div class="welcome-section">
        <h1 class="profile-title">내 정보 관리</h1>
        <p class="profile-subtitle">개인 정보를 확인하고 수정할 수 있습니다</p>
      </div>
      
      <!-- 프로필 정보 폼 -->
      <div class="profile-section">
        <!-- 프로필 이미지 -->
        <div class="profile-image-container">
          <img src="../assets/images/logo.png" alt="프로필 이미지" class="profile-image">
          <div class="image-upload-overlay" @click="triggerFileInput">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15.5V8.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.5 12L12 8.5L15.5 12" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="white" stroke-width="1.5"/>
            </svg>
            <span class="upload-text">변경</span>
          </div>
          <input 
            type="file" 
            ref="fileInput" 
            accept="image/*" 
            class="file-input" 
            @change="handleImageUpload"
          >
        </div>
        
        <!-- 프로필 정보 폼 -->
        <form class="profile-form" @submit.prevent="saveProfile">
          <!-- 수정 불가능 필드 -->
          <div class="form-group">
            <label for="userId">아이디</label>
            <input 
              type="text" 
              id="userId" 
              v-model="userId" 
              disabled 
              class="form-control disabled"
            >
          </div>
          
          <div class="form-group">
            <label for="userName">이름</label>
            <input 
              type="text" 
              id="userName" 
              v-model="userName" 
              disabled 
              class="form-control disabled"
            >
          </div>
          
          <!-- 성별 선택 -->
          <div class="form-group">
            <label class="label-block">성별</label>
            <div class="radio-group">
              <label class="radio-label">
                <input 
                  type="radio" 
                  name="gender" 
                  value="male" 
                  v-model="gender"
                >
                <span>남성</span>
              </label>
              <label class="radio-label">
                <input 
                  type="radio" 
                  name="gender" 
                  value="female" 
                  v-model="gender"
                >
                <span>여성</span>
              </label>
            </div>
          </div>
          
          <!-- 나이 -->
          <div class="form-group">
            <label for="age">나이</label>
            <input 
              type="number" 
              id="age" 
              v-model="age" 
              min="1" 
              max="120" 
              class="form-control"
              placeholder="나이를 입력하세요"
            >
          </div>
          
          <!-- 별명 -->
          <div class="form-group">
            <label for="nickname">별명</label>
            <input 
              type="text" 
              id="nickname" 
              v-model="nickname" 
              class="form-control"
              placeholder="별명을 입력하세요"
            >
          </div>
          
          <!-- 저장 버튼 -->
          <div class="form-actions">
            <button type="button" class="btn btn-cancel" @click="cancel">취소</button>
            <button type="submit" class="btn btn-save">저장</button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import { useAuth } from '@/composables/userAuth';
import Cookies from 'js-cookie';

// 인증 관련 컴포저블
const { userName, requireAuth } = useAuth();

// 라우터 설정
const router = useRouter();

// 상태 정의
const isScrolled = ref(false);
const userId = ref('');
const gender = ref('');
const age = ref('');
const nickname = ref('');
const profileImage = ref(null);
const fileInput = ref(null);

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

// 사용자 정보 불러오기
const fetchUserProfile = async () => {
  try {
    // 실제 API 연동 시에는 아래 주석을 해제하고 사용
    // const response = await fetch('http://localhost:8080/api/users/profile', {
    //   credentials: 'include'
    // });
    // if (response.ok) {
    //   const userData = await response.json();
    //   userId.value = userData.userId;
    //   gender.value = userData.gender || '';
    //   age.value = userData.age || '';
    //   nickname.value = userData.nickname || '';
    //   profileImage.value = userData.profileImage || null;
    // }

    // 임시로 쿠키에서 userId 가져오기 (실제 API 연동 전까지)
    const userIdFromCookie = Cookies.get('USER_ID');
    userId.value = userIdFromCookie || '사용자';
    
    // 테스트 데이터
    gender.value = 'male';
    age.value = 25;
    nickname.value = '여행러';
  } catch (error) {
    console.error('프로필 정보 로드 오류:', error);
  }
};

// 파일 입력 트리거
const triggerFileInput = () => {
  fileInput.value.click();
};

// 이미지 업로드 처리
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // 이미지 파일인지 확인
  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 업로드 가능합니다.');
    return;
  }
  
  // 파일 크기 확인 (5MB 제한)
  if (file.size > 5 * 1024 * 1024) {
    alert('파일 크기는 5MB 이하여야 합니다.');
    return;
  }
  
  // 이미지 미리보기
  const reader = new FileReader();
  reader.onload = (e) => {
    profileImage.value = e.target.result;
  };
  reader.readAsDataURL(file);
  
  // 실제 구현 시 이미지 업로드 API 호출
  // uploadProfileImage(file);
};

// 프로필 정보 저장
const saveProfile = async () => {
  try {
    // 입력 검증
    if (age.value && (age.value < 1 || age.value > 120)) {
      alert('나이는 1-120 사이의 값이어야 합니다.');
      return;
    }
    
    // API 호출 구현 (실제 연동 시 주석 해제)
    // const response = await fetch('http://localhost:8080/api/users/profile', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   credentials: 'include',
    //   body: JSON.stringify({
    //     gender: gender.value,
    //     age: age.value,
    //     nickname: nickname.value
    //   })
    // });
    
    // if (response.ok) {
    //   alert('프로필이 성공적으로 업데이트되었습니다.');
    //   router.push('/plans');
    // } else {
    //   alert('프로필 업데이트에 실패했습니다.');
    // }
    
    // 임시 코드 (API 연동 전)
    alert('프로필이 성공적으로 업데이트되었습니다.');
    router.push('/plans');
  } catch (error) {
    console.error('프로필 저장 오류:', error);
    alert('프로필 저장 중 오류가 발생했습니다.');
  }
};

// 취소 버튼 클릭 시
const cancel = () => {
  router.push('/plans');
};

// 컴포넌트 마운트 시 처리
onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  
  // 인증 확인
  const isAuthenticated = await requireAuth();
  if (!isAuthenticated) return; // 인증 실패 시 리다이렉트
  
  // 사용자 프로필 정보 가져오기
  fetchUserProfile();
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.profile-page {
  padding-top: 60px;
  min-height: 100vh;
  background-color: #f9fafc;
}

.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

.welcome-section {
  margin-bottom: 40px;
  text-align: center;
}

.profile-title {
  font-size: 28px;
  margin-bottom: 8px;
}

.profile-subtitle {
  font-size: 16px;
  color: #666;
}

.profile-section {
  background-color: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 프로필 이미지 */
.profile-image-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 30px;
}

.profile-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0ff;
}

.image-upload-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background-color: #4a6ee0;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid white;
}

.upload-text {
  font-size: 10px;
  color: white;
  display: none;
}

.image-upload-overlay:hover .upload-text {
  display: block;
}

.file-input {
  display: none;
}

/* 폼 스타일 */
.profile-form {
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.label-block {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #4a6ee0;
}

.form-control.disabled {
  background-color: #f5f5f5;
  color: #666;
}

/* 라디오 버튼 스타일 */
.radio-group {
  display: flex;
  gap: 24px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-label input {
  margin-right: 8px;
}

/* 버튼 스타일 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s, transform 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #666;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.btn-save {
  background-color: #4a6ee0;
  color: white;
}

.btn-save:hover {
  background-color: #3a5ecc;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .profile-section {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn {
    width: 100%;
  }
}
</style>