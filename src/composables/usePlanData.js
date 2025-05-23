// composables/usePlanData.js - 계획 데이터 관리
import { ref } from 'vue'

export function usePlanData() {
  const recommendationData = ref(null)
  const travelInfo = ref({
    duration: 3,
    people: 2,
    purpose: '휴식',
    region: '제주도',
    transports: ['자가용', '도보'],
    concept: '힐링',
    mbti: 'INFP'
  })
  
  const planData = ref({
    id: null,
    title: '',
    startDate: '',
    endDate: '',
    totalDays: 3,
    details: []
  })

  // 추천 데이터 로드
  const loadRecommendationData = async () => {
    let hasData = false

    // 1. 라우터 상태에서 데이터 가져오기
    try {
      const routerState = history.state?.state || {}
      
      if (routerState.recommendationData) {
        recommendationData.value = normalizeRecommendationData(routerState.recommendationData)
        console.log('라우터에서 추천 데이터 받음:', recommendationData.value)
        hasData = true
      }
      
      if (routerState.travelInfo) {
        travelInfo.value = routerState.travelInfo
        console.log('라우터에서 여행 정보 받음:', travelInfo.value)
      }
    } catch (err) {
      console.error('라우터 상태 읽기 실패:', err)
    }

    // 2. localStorage에서 데이터 가져오기
    if (!hasData) {
      const storedRecommendation = localStorage.getItem('recommendationData')
      const storedTravelInfo = localStorage.getItem('travelInfo')

      if (storedRecommendation) {
        try {
          const parsedData = JSON.parse(storedRecommendation)
          recommendationData.value = normalizeRecommendationData(parsedData)
          console.log('로컬 스토리지에서 추천 데이터 로드:', recommendationData.value)
          hasData = true
          localStorage.removeItem('recommendationData')
        } catch (e) {
          console.error('추천 데이터 파싱 오류:', e)
        }
      }

      if (storedTravelInfo) {
        try {
          travelInfo.value = JSON.parse(storedTravelInfo)
          console.log('로컬 스토리지에서 여행 정보 로드:', travelInfo.value)
          localStorage.removeItem('travelInfo')
        } catch (e) {
          console.error('여행 정보 파싱 오류:', e)
        }
      }
    }
  }

  // 추천 데이터를 편집 가능한 계획으로 변환
  const convertToEditablePlan = async (recommendation, travel) => {
    if (!recommendation?.days) {
      throw new Error('추천 데이터가 없습니다.')
    }

    // 날짜 계산
    const startDate = calculateStartDate(travel)
    const endDate = calculateEndDate(travel)
    const actualTotalDays = Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1

    // 계획 기본 정보 설정
    const formatDateForTitle = (dateStr) => {
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}/${date.getDate()}`
    }

    planData.value = {
      id: null,
      title: `${travel.region} ${actualTotalDays}일 여행 (${formatDateForTitle(startDate)}~${formatDateForTitle(endDate)})`,
      startDate,
      endDate,
      totalDays: actualTotalDays,
      details: []
    }

    // 카카오맵 API 로드 확인
    await ensureKakaoMapLoaded()

    // 장소 변환
    let detailId = 1
    const places = new window.kakao.maps.services.Places()

    for (const day of recommendation.days) {
      for (let i = 0; i < day.places.length; i++) {
        const place = day.places[i]
        
        // 위치 정보 검색
        const locationInfo = await searchPlaceLocation(places, place.name, travel.region)
        
        const placeDetail = {
          id: detailId++,
          planDetailName: place.name,
          day: day.day,
          arrivalTime: place.arrival + ':00',
          departureTime: place.departure + ':00',
          memo: place.activity || '',
          transportFromPrevious: i > 0 && day.transports && i - 1 < day.transports.length
            ? { name: day.transports[i - 1].type }
            : { name: '시작점' },
          latitude: locationInfo.latitude,
          longitude: locationInfo.longitude,
          address: locationInfo.address
        }

        planData.value.details.push(placeDetail)
      }
    }
  }

  // 데이터 정규화
  const normalizeRecommendationData = (data) => {
    if (!data || !Array.isArray(data.days)) {
      console.warn('데이터가 유효하지 않습니다:', data)
      return { days: [] }
    }

    return {
      days: [...data.days]
        .sort((a, b) => a.day - b.day)
        .map(day => ({
          day: day.day,
          places: Array.isArray(day.places) ? day.places : [],
          transports: Array.isArray(day.transports) ? day.transports : []
        }))
    }
  }

  // 카카오맵 API 로드
  const ensureKakaoMapLoaded = async () => {
    if (!window.kakao || !window.kakao.maps) {
      console.log('카카오맵 API 로딩 중...')
      
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=68e8b97d381d75363cc6b9be98056de8&libraries=services&autoload=false`
        script.onload = () => {
          window.kakao.maps.load(() => {
            console.log('카카오맵 API 로드 완료')
            resolve()
          })
        }
        script.onerror = (e) => {
          console.error('카카오맵 API 로드 실패', e)
          reject(new Error('카카오맵 API 로드 실패'))
        }
        document.head.appendChild(script)
      })
    }
  }

  // 장소 위치 검색
  const searchPlaceLocation = (places, placeName, region) => {
    return new Promise((resolve) => {
      const searchKeyword = `${region} ${placeName}`
      
      places.keywordSearch(searchKeyword, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
          resolve({
            latitude: parseFloat(result[0].y),
            longitude: parseFloat(result[0].x),
            address: result[0].address_name
          })
        } else {
          console.warn(`'${placeName}' 위치 검색 실패:`, status)
          // 검색 실패 시 기본 위치 반환 (지역의 중심 좌표로 설정)
          resolve({
            latitude: 33.38 + Math.random() * 0.3,
            longitude: 126.5 + Math.random() * 0.5,
            address: region
          })
        }
      })
    })
  }

  // 시작일 계산
  const calculateStartDate = (travel) => {
    if (travel.startDate) {
      return travel.startDate
    }
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + 7)
    return startDate.toISOString().split('T')[0]
  }

  // 종료일 계산
  const calculateEndDate = (travel) => {
    if (travel.endDate) {
      return travel.endDate
    }
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + 7)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + travel.duration - 1)
    return endDate.toISOString().split('T')[0]
  }

  return {
    recommendationData,
    travelInfo,
    planData,
    loadRecommendationData,
    convertToEditablePlan
  }
}