// services/inviteService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// 쿠키에서 값 가져오기 헬퍼 함수
const getCookieValue = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// JWT 토큰 가져오기 함수
const getAuthToken = () => {
  // JWT-TOKEN 쿠키에서 토큰 가져오기
  const token = getCookieValue('JWT-TOKEN');
  console.log('Retrieved JWT Token:', token); // 디버깅용
  return token;
};

export const inviteService = {
  // 초대 링크 생성
  async createInviteLink(planId, type) {
    try {
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      };
      
      // JWT 토큰이 있으면 Authorization 헤더 추가
      if (token) {
        headers.Authorization = `Bearer ${token}`;
        console.log('Authorization header set:', headers.Authorization); // 디버깅용
      } else {
        console.warn('JWT 토큰이 없습니다!');
      }
      
      const response = await axios.post(`${API_BASE_URL}/invite/create`, null, {
        params: {
          planId,
          type // 'VIEW_ONLY' or 'EDITABLE'
        },
        withCredentials: true,  // 쿠키도 함께 전송
        headers
      });
      
      console.log('초대 링크 생성 성공:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('초대 링크 생성 실패:', error);
      
      // 상세 에러 정보 출력
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        
        // 백엔드에서 반환한 메시지가 있으면 표시
        if (error.response.data?.message) {
          alert(`에러: ${error.response.data.message}`);
        }
      }
      throw error;
    }
  },

  // 초대 링크를 통한 플랜 참여
  async joinPlan(inviteCode) {
    try {
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await axios.post(`${API_BASE_URL}/invite/join`, null, {
        params: {
          code: inviteCode
        },
        withCredentials: true,
        headers
      });
      return response.data.data;
    } catch (error) {
      console.error('플랜 참여 실패:', error);
      if (error.response?.data?.message) {
        alert(`에러: ${error.response.data.message}`);
      }
      throw error;
    }
  },

  // 초대 링크 정보 조회 (로그인 없이 가능)
  async getPlanInfo(inviteCode) {
    try {
      const response = await axios.get(`${API_BASE_URL}/invite/info`, {
        params: {
          code: inviteCode
        },
        withCredentials: true,  // 일관성을 위해 추가
        headers: {
          Accept: 'application/json'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('플랜 정보 조회 실패:', error);
      throw error;
    }
  },

  // 초대 링크 재생성
  async regenerateInviteLink(planId, type) {
    try {
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await axios.post(`${API_BASE_URL}/invite/regenerate`, null, {
        params: {
          planId,
          type
        },
        withCredentials: true,
        headers
      });
      return response.data.data;
    } catch (error) {
      console.error('초대 링크 재생성 실패:', error);
      if (error.response?.data?.message) {
        alert(`에러: ${error.response.data.message}`);
      }
      throw error;
    }
  },

  // 초대 링크 삭제
  async deleteInviteLink(inviteCode) {
    try {
      const token = getAuthToken();
      const headers = {
        Accept: 'application/json'
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await axios.delete(`${API_BASE_URL}/invite/delete`, {
        params: {
          code: inviteCode
        },
        withCredentials: true,
        headers
      });
      return response.data.data;
    } catch (error) {
      console.error('초대 링크 삭제 실패:', error);
      throw error;
    }
  }
};