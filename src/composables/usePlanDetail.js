// composables/usePlanDetail.js - 계획 상세 조회
import { ref } from 'vue'
import { useAuth } from '@/composables/userAuth'
import Cookies from 'js-cookie'

export function usePlanDetail() {
  const { requireAuth } = useAuth()
  
  const planData = ref({
    id: null,
    title: '',
    startDate: '',
    endDate: '',
    totalDays: 0,
    memberCount: 0,
    isPublic: false,
    thumbnail: null,
    region: '',
    details: []
  })

  // 계획 상세 정보 로드
  const loadPlanDetail = async (planId) => {
    // 인증 확인
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      throw new Error('인증이 필요합니다.')
    }

    // 토큰 가져오기
    let token = localStorage.getItem('JWT-TOKEN') || 
                sessionStorage.getItem('JWT-TOKEN') || 
                Cookies.get('JWT-TOKEN')

    if (!token) {
      throw new Error('토큰이 없습니다.')
    }

    console.log(`계획 상세 정보 로드 시작: ${planId}`)

    try {
      const response = await fetch(`http://localhost:8080/api/v1/plans/${planId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })

      console.log('API 응답 상태:', response.status)

      if (!response.ok) {
        if (response.status === 401) {
          // 토큰 정리
          localStorage.removeItem('JWT-TOKEN')
          sessionStorage.removeItem('JWT-TOKEN')
          Cookies.remove('JWT-TOKEN')
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
        }
        
        if (response.status === 404) {
          throw new Error('존재하지 않는 여행 계획입니다.')
        }
        
        if (response.status === 403) {
          throw new Error('이 여행 계획에 접근할 권한이 없습니다.')
        }
        
        throw new Error(`계획을 불러오는데 실패했습니다. (${response.status})`)
      }

      const result = await response.json()
      console.log('로드된 계획 데이터:', result)
      
      // 데이터 정규화 및 설정
      planData.value = normalizePlanData(result)
      
      return planData.value
    } catch (error) {
      console.error('계획 로드 오류:', error)
      throw error
    }
  }

  // 계획 데이터 정규화
  const normalizePlanData = (rawData) => {
    // 기본 구조 검증
    if (!rawData || typeof rawData !== 'object') {
      throw new Error('잘못된 데이터 형식입니다.')
    }

    // 날짜 총 일수 계산
    const totalDays = calculateTotalDays(rawData.startDate, rawData.endDate)

    // 상세 일정 정규화
    const normalizedDetails = (rawData.details || []).map((detail, index) => {
      // 기본 필드 검증 및 기본값 설정
      return {
        id: detail.id || index + 1,
        planDetailName: detail.planDetailName || '장소명 없음',
        day: detail.day || 1,
        arrivalTime: formatTime(detail.arrivalTime) || '09:00:00',
        departureTime: formatTime(detail.departureTime) || '10:00:00',
        memo: detail.memo || '',
        transportFromPrevious: normalizeTransport(detail.transportFromPrevious),
        latitude: parseFloat(detail.latitude) || 33.38,
        longitude: parseFloat(detail.longitude) || 126.54,
        address: detail.address || ''
      }
    })

    // 일자별로 정렬
    normalizedDetails.sort((a, b) => {
      if (a.day !== b.day) {
        return a.day - b.day
      }
      return a.arrivalTime.localeCompare(b.arrivalTime)
    })

    return {
      id: rawData.id,
      title: rawData.title || '제목 없는 여행',
      startDate: rawData.startDate || '',
      endDate: rawData.endDate || '',
      totalDays: totalDays,
      memberCount: rawData.memberCount || 1,
      isPublic: Boolean(rawData.isPublic),
      thumbnail: rawData.thumbnail || null,
      region: rawData.region || '',
      details: normalizedDetails
    }
  }

  // 교통수단 정보 정규화
  const normalizeTransport = (transport) => {
    if (!transport) {
      return { name: '시작점' }
    }

    // transport가 객체인 경우
    if (typeof transport === 'object') {
      if (transport.name) {
        return { name: transport.name }
      }
      
      // ID로 교통수단명 매핑
      if (transport.id) {
        const transportName = getTransportNameById(transport.id)
        return { name: transportName }
      }
    }

    // transport가 문자열인 경우
    if (typeof transport === 'string') {
      return { name: transport }
    }

    // 기본값
    return { name: '시작점' }
  }

  // 교통수단 ID를 이름으로 변환
  const getTransportNameById = (id) => {
    const transportMap = {
      1: '자가용',
      2: '지하철',
      3: '버스',
      4: '도보',
      5: '자전거',
      6: '택시',
      7: '기차',
      8: '항공'
    }
    
    return transportMap[id] || '자가용'
  }

  // 시간 형식 정규화
  const formatTime = (timeStr) => {
    if (!timeStr) return null
    
    // 이미 HH:MM:SS 형식인 경우
    if (timeStr.includes(':') && timeStr.split(':').length === 3) {
      return timeStr
    }
    
    // HH:MM 형식인 경우 :00 추가
    if (timeStr.includes(':') && timeStr.split(':').length === 2) {
      return timeStr + ':00'
    }
    
    // 다른 형식인 경우 기본값 반환
    return null
  }

  // 총 일수 계산
  const calculateTotalDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0
    
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      // 날짜가 유효한지 확인
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 0
      }
      
      // 일수 계산 (당일 포함)
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
      
      return Math.max(diffDays, 1) // 최소 1일
    } catch (error) {
      console.error('날짜 계산 오류:', error)
      return 0
    }
  }

  // 계획 데이터 초기화
  const resetPlanData = () => {
    planData.value = {
      id: null,
      title: '',
      startDate: '',
      endDate: '',
      totalDays: 0,
      memberCount: 0,
      isPublic: false,
      thumbnail: null,
      region: '',
      details: []
    }
  }

  // 특정 일자의 장소들 가져오기
  const getPlacesByDay = (day) => {
    return planData.value.details
      .filter(detail => detail.day === day)
      .sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime))
  }

  // 계획 유효성 검사
  const validatePlan = () => {
    const errors = []
    
    if (!planData.value.title?.trim()) {
      errors.push('여행 제목이 필요합니다.')
    }
    
    if (!planData.value.startDate) {
      errors.push('시작 날짜가 필요합니다.')
    }
    
    if (!planData.value.endDate) {
      errors.push('종료 날짜가 필요합니다.')
    }
    
    if (planData.value.startDate && planData.value.endDate) {
      const start = new Date(planData.value.startDate)
      const end = new Date(planData.value.endDate)
      
      if (start > end) {
        errors.push('시작 날짜는 종료 날짜보다 이전이어야 합니다.')
      }
    }
    
    if (planData.value.details.length === 0) {
      errors.push('최소 하나의 장소가 필요합니다.')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  return {
    planData,
    loadPlanDetail,
    resetPlanData,
    getPlacesByDay,
    validatePlan
  }
}