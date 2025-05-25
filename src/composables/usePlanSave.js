// composables/usePlanSave.js - 계획 저장/수정 로직
import { useAuth } from '@/composables/userAuth'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

export function usePlanSave() {
  const { requireAuth } = useAuth()
  const router = useRouter()

  // 새 계획 저장
  const savePlan = async (planData, travelInfo) => {
    console.log('새 계획 저장 시작:', { planData, travelInfo })
    
    // 인증 확인
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      throw new Error('인증이 필요합니다.')
    }

    // 토큰 가져오기
    const token = getAuthToken()
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.')
    }

    // 요청 데이터 구성
    const planPayload = {
      title: planData.title || '새 여행 계획',
      startDate: planData.startDate,
      endDate: planData.endDate,
      memberCount: travelInfo?.people || planData.memberCount || 2,
      isPublic: planData.isPublic || false,
      thumbnail: planData.thumbnail || null,
      region: travelInfo?.region || planData.region || '',
      details: (planData.details || []).map(detail => ({
        planDetailName: detail.planDetailName,
        day: detail.day,
        arrivalTime: detail.arrivalTime,
        departureTime: detail.departureTime,
        memo: detail.memo || '',
        transportFromPrevious: {
          id: getTransportId(detail.transportFromPrevious?.name)
        },
        latitude: detail.latitude,
        longitude: detail.longitude,
        address: detail.address || ''
      }))
    }

    console.log('전송할 데이터:', JSON.stringify(planPayload, null, 2))

    try {
      const response = await fetch('http://localhost:8080/api/v1/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(planPayload)
      })

      console.log('API 응답 상태:', response.status)

      if (!response.ok) {
        await handleApiError(response, '계획 저장')
      }

      const result = await response.json()
      console.log('저장 성공:', result)
      return result
    } catch (error) {
      console.error('계획 저장 오류:', error)
      throw error
    }
  }

  // 기존 계획 수정
  const updatePlan = async (planData) => {
    console.log('계획 수정 시작:', planData)
    
    if (!planData.id) {
      throw new Error('수정할 계획의 ID가 없습니다.')
    }

    // 인증 확인
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      throw new Error('인증이 필요합니다.')
    }

    // 토큰 가져오기
    const token = getAuthToken()
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.')
    }

    // 요청 데이터 구성
    const planPayload = {
      title: planData.title,
      startDate: planData.startDate,
      endDate: planData.endDate,
      memberCount: planData.memberCount || 2,
      isPublic: planData.isPublic || false,
      thumbnail: planData.thumbnail || null,
      region: planData.region || '',
      details: (planData.details || []).map((detail) => ({
        // 새로운 detail의 경우 id를 제거하거나 null로 설정
        id: detail.id > 1000 ? null : detail.id, // 임시 ID는 null로
        planDetailName: detail.planDetailName,
        day: detail.day,
        arrivalTime: detail.arrivalTime,
        departureTime: detail.departureTime,
        memo: detail.memo || '',
        transportFromPrevious: {
          id: getTransportId(detail.transportFromPrevious?.name)
        },
        latitude: detail.latitude,
        longitude: detail.longitude,
        address: detail.address || ''
      }))
    }

    console.log('수정할 데이터:', JSON.stringify(planPayload, null, 2))

    try {
      const response = await fetch(`http://localhost:8080/api/v1/plans/${planData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(planPayload)
      })

      console.log('API 응답 상태:', response.status)

      if (!response.ok) {
        await handleApiError(response, '계획 수정')
      }

      const result = await response.json()
      console.log('수정 성공:', result)
      return result
    } catch (error) {
      console.error('계획 수정 오류:', error)
      throw error
    }
  }

  // 계획 삭제
  const deletePlan = async (planId) => {
    console.log('계획 삭제 시작:', planId)
    
    if (!planId) {
      throw new Error('삭제할 계획의 ID가 없습니다.')
    }

    // 인증 확인
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      throw new Error('인증이 필요합니다.')
    }

    // 토큰 가져오기
    const token = getAuthToken()
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.')
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })

      console.log('API 응답 상태:', response.status)

      if (!response.ok) {
        await handleApiError(response, '계획 삭제')
      }

      console.log('삭제 성공')
      return true
    } catch (error) {
      console.error('계획 삭제 오류:', error)
      throw error
    }
  }

  // 인증 토큰 가져오기
  const getAuthToken = () => {
    return localStorage.getItem('JWT-TOKEN') || 
           sessionStorage.getItem('JWT-TOKEN') || 
           Cookies.get('JWT-TOKEN')
  }

  // API 에러 처리
  const handleApiError = async (response, operation) => {
    const status = response.status
    
    try {
      const errorData = await response.json()
      console.error(`${operation} API 오류:`, errorData)
      
      if (status === 401) {
        // 인증 만료 - 토큰 정리 및 로그인 페이지로 리다이렉트
        clearAuthTokens()
        router.push('/login')
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
      }
      
      if (status === 403) {
        throw new Error('이 작업을 수행할 권한이 없습니다.')
      }
      
      if (status === 404) {
        throw new Error('요청한 여행 계획을 찾을 수 없습니다.')
      }
      
      if (status === 400) {
        const message = errorData.error || errorData.message || '잘못된 요청입니다.'
        throw new Error(message)
      }
      
      if (status === 500) {
        const message = errorData.error || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        throw new Error(message)
      }
      
      // 기타 오류
      const message = errorData.error || errorData.message || `${operation}에 실패했습니다.`
      throw new Error(`${message} (${status})`)
    } catch (jsonError) {
      // JSON 파싱 실패 시
      console.error('응답 파싱 오류:', jsonError)
      
      if (status === 401) {
        clearAuthTokens()
        router.push('/login')
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
      }
      
      throw new Error(`${operation}에 실패했습니다. (${status})`)
    }
  }

  // 인증 토큰 정리
  const clearAuthTokens = () => {
    localStorage.removeItem('JWT-TOKEN')
    sessionStorage.removeItem('JWT-TOKEN')
    Cookies.remove('JWT-TOKEN')
  }

  // 교통수단 이름을 ID로 변환
  const getTransportId = (transportName) => {
    const transportMap = {
      '자가용': 1,
      '지하철': 2,
      '버스': 3,
      '도보': 4,
      '자전거': 5,
      '택시': 6,
      '기차': 7,
      '항공': 8
    }

    // 시작점이나 매핑되지 않은 교통수단은 자가용(1)으로 기본 설정
    if (!transportName || transportName === '시작점' || !transportMap[transportName]) {
      return 1 // 자가용
    }

    return transportMap[transportName]
  }

  // 계획 데이터 유효성 검사
  const validatePlanData = (planData) => {
    const errors = []

    // 필수 필드 검증
    if (!planData.title?.trim()) {
      errors.push('여행 제목을 입력해주세요.')
    }

    if (!planData.startDate) {
      errors.push('시작 날짜를 선택해주세요.')
    }

    if (!planData.endDate) {
      errors.push('종료 날짜를 선택해주세요.')
    }

    // 날짜 유효성 검증
    if (planData.startDate && planData.endDate) {
      const startDate = new Date(planData.startDate)
      const endDate = new Date(planData.endDate)
      
      if (startDate > endDate) {
        errors.push('시작 날짜는 종료 날짜보다 이전이어야 합니다.')
      }
    }

    // 장소 검증
    if (!planData.details || planData.details.length === 0) {
      errors.push('최소 하나의 장소를 추가해주세요.')
    }

    // 각 장소의 필수 정보 검증
    if (planData.details) {
      planData.details.forEach((detail, index) => {
        if (!detail.planDetailName?.trim()) {
          errors.push(`${index + 1}번째 장소의 이름을 입력해주세요.`)
        }
        
        if (!detail.arrivalTime) {
          errors.push(`${index + 1}번째 장소의 도착 시간을 입력해주세요.`)
        }
        
        if (!detail.departureTime) {
          errors.push(`${index + 1}번째 장소의 출발 시간을 입력해주세요.`)
        }

        // 시간 순서 검증
        if (detail.arrivalTime && detail.departureTime) {
          if (detail.arrivalTime >= detail.departureTime) {
            errors.push(`${index + 1}번째 장소의 출발 시간은 도착 시간보다 늦어야 합니다.`)
          }
        }
      })
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  return {
    savePlan,
    updatePlan,
    deletePlan,
    validatePlanData
  }
}