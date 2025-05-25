<template>
  <div class="trip-map-container">
    <div ref="mapContainer" id="trip-map" class="trip-map"></div>
    
    <!-- 지도 로딩 -->
    <div v-if="!mapLoaded" class="map-loading">
      <div class="loading-spinner"></div>
      <p>지도를 불러오는 중...</p>
    </div>
    
    <!-- 경로 로딩 -->
    <div v-if="isLoadingRoutes" class="route-loading">
      <div class="loading-spinner small"></div>
      <p>실제 경로를 계산하는 중...</p>
    </div>
    
    <div class="map-controls">
      <!-- 기존 컨트롤들 -->
      <button @click="resetMapBounds" class="map-control-button" title="모든 장소 보기">
        <!-- 기존 SVG -->
      </button>
      <button @click="togglePolyline" class="map-control-button" title="경로 표시/숨기기">
        <!-- 기존 SVG -->
      </button>
      
      <!-- 경로 타입 선택 버튼들 추가 -->
      <div class="route-type-controls">
        <button 
          @click="changeRouteType('car')" 
          class="route-type-button"
          :class="{ active: routeType === 'car' }"
          title="자동차"
        >🚗</button>
        <button 
          @click="changeRouteType('walk')" 
          class="route-type-button"
          :class="{ active: routeType === 'walk' }"  
          title="도보"
        >🚶</button>
        <button 
          @click="changeRouteType('transit')" 
          class="route-type-button"
          :class="{ active: routeType === 'transit' }"
          title="대중교통"
        >🚌</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from "vue";

export default {
  name: "TripMap",
  props: {
    places: {
      type: Array,
      required: true,
    },
    showRealRoutes: {
      type: Boolean,
      default: true, // 실제 경로 표시 여부
    },
    routeType: {
      type: String,
      default: 'car', // 'car', 'walk', 'transit'
    }
  },
  setup(props) {
    const mapContainer = ref(null);
    const mapLoaded = ref(false);
    const showPolyline = ref(true);
    const isLoadingRoutes = ref(false); // 경로 로딩 상태

    let map = null;
    let markers = [];
    let overlays = [];
    let polyline = null;
    let routePolylines = []; // T map 경로용 폴리라인들

    // T map API 설정
    const TMAP_API_KEY = 'qsI32FHZYl6EcWCdt3Pa26bLC74LlTQO1tcYMS00'; // 실제 API 키로 교체
    const TMAP_BASE_URL = 'https://apis.openapi.sk.com/tmap';

    // ... (기존 initMap, createMap, createCustomMarker 함수들 유지)

// TripMap.vue의 script 부분에 추가할 함수들

// 지도 초기화
const initMap = async () => {
  if (!window.kakao || !window.kakao.maps) {
    console.log("카카오맵 API 로딩 중...");

    try {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=68e8b97d381d75363cc6b9be98056de8&libraries=services&autoload=false`;
        script.onload = () => {
          window.kakao.maps.load(() => {
            console.log("카카오맵 API 로드 완료");
            createMap();
            resolve();
          });
        };
        script.onerror = (e) => {
          console.error("카카오맵 API 로드 실패", e);
          reject(new Error("카카오맵 API 로드 실패"));
        };
        document.head.appendChild(script);
      });
    } catch (error) {
      console.error("카카오맵 API 로드 오류:", error);
      mapContainer.value.innerHTML =
        '<div class="map-placeholder">카카오맵 API를 불러오는 중 오류가 발생했습니다</div>';
      return;
    }
  } else {
    createMap();
  }
};

// 지도 생성 함수
const createMap = () => {
  try {
    const mapOptions = {
      center: new window.kakao.maps.LatLng(33.4, 126.5),
      level: 9,
    };

    map = new window.kakao.maps.Map(mapContainer.value, mapOptions);
    mapLoaded.value = true;
    updateMapMarkers();
  } catch (error) {
    console.error("지도 초기화 오류:", error);
    mapContainer.value.innerHTML =
      '<div class="map-placeholder">지도를 불러오는 중 오류가 발생했습니다</div>';
  }
};

// 커스텀 마커 HTML 생성
const createCustomMarker = (number, isActive = false) => {
  return `
    <div class="custom-marker ${isActive ? 'active' : ''}">
      <div class="marker-pin">
        <div class="marker-number">${number}</div>
        <div class="marker-point"></div>
      </div>
    </div>
  `;
};

// 모든 인포윈도우 닫기
const closeAllInfoWindows = () => {
  // 기존에 열린 인포윈도우들을 추적하여 닫을 수 있도록 개선 필요
};

// 지도 경계 초기화
const resetMapBounds = () => {
  if (!map || props.places.length === 0) return;

  const bounds = new window.kakao.maps.LatLngBounds();
  props.places.forEach(place => {
    if (place.latitude && place.longitude) {
      bounds.extend(new window.kakao.maps.LatLng(place.latitude, place.longitude));
    }
  });

  map.setBounds(bounds);
  
  if (props.places.length === 1) {
    map.setLevel(3);
  }
};

// 경로 표시/숨기기 토글
const togglePolyline = () => {
  showPolyline.value = !showPolyline.value;
  updateMapMarkers();
};

// 시간 포맷팅
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  return timeStr.substring(0, 5);
};


    // T map 경로 탐색 함수들
    const getCarRoute = async (startLat, startLon, endLat, endLon) => {
      try {
        const response = await fetch(`${TMAP_BASE_URL}/routes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'appKey': TMAP_API_KEY
          },
          body: JSON.stringify({
            startX: startLon,
            startY: startLat,
            endX: endLon,
            endY: endLat,
            reqCoordType: 'WGS84GEO',
            resCoordType: 'WGS84GEO',
            searchOption: '0', // 0:최적, 1:최단거리, 2:고속도로우선
            trafficInfo: 'Y' // 실시간 교통정보 반영
          })
        });

        if (!response.ok) {
          throw new Error(`T map API 오류: ${response.status}`);
        }

        const data = await response.json();
        return data.features;
      } catch (error) {
        console.error('자동차 경로 탐색 오류:', error);
        return null;
      }
    };

    const getWalkRoute = async (startLat, startLon, endLat, endLon) => {
      try {
        const response = await fetch(`${TMAP_BASE_URL}/routes/pedestrian`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'appKey': TMAP_API_KEY
          },
          body: JSON.stringify({
            startX: startLon,
            startY: startLat,
            endX: endLon,
            endY: endLat,
            reqCoordType: 'WGS84GEO',
            resCoordType: 'WGS84GEO',
            startName: '출발지',
            endName: '도착지'
          })
        });

        const data = await response.json();
        return data.features;
      } catch (error) {
        console.error('보행자 경로 탐색 오류:', error);
        return null;
      }
    };

    const getTransitRoute = async (startLat, startLon, endLat, endLon) => {
      try {
        const response = await fetch(`${TMAP_BASE_URL}/routes/transit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'appKey': TMAP_API_KEY
          },
          body: JSON.stringify({
            startX: startLon,
            startY: startLat,
            endX: endLon,
            endY: endLat,
            reqCoordType: 'WGS84GEO',
            resCoordType: 'WGS84GEO',
            searchType: '0', // 0:최적, 1:최소환승, 2:최소도보
            lang: 'ko'
          })
        });

        const data = await response.json();
        return data.features;
      } catch (error) {
        console.error('대중교통 경로 탐색 오류:', error);
        return null;
      }
    };

    // 경로 데이터를 카카오맵 좌표로 변환
    const convertRouteToKakaoCoords = (routeFeatures) => {
      const coords = [];
      
      if (!routeFeatures) return coords;

      routeFeatures.forEach(feature => {
        if (feature.geometry && feature.geometry.type === 'LineString') {
          feature.geometry.coordinates.forEach(coord => {
            // T map: [경도, 위도], 카카오맵: LatLng(위도, 경도)
            coords.push(new window.kakao.maps.LatLng(coord[1], coord[0]));
          });
        }
      });

      return coords;
    };

    // 경로 타입별 스타일 설정
    const getRouteStyle = (routeType) => {
      const styles = {
        car: {
          strokeColor: '#FF6B6B',
          strokeWeight: 5,
          strokeOpacity: 0.8
        },
        walk: {
          strokeColor: '#4ECDC4',
          strokeWeight: 3,
          strokeOpacity: 0.7,
          strokeStyle: 'shortdot'
        },
        transit: {
          strokeColor: '#45B7D1',
          strokeWeight: 4,
          strokeOpacity: 0.8,
          strokeStyle: 'shortdash'
        }
      };

      return styles[routeType] || styles.car;
    };

    // 실제 경로로 폴리라인 그리기
    const drawRealRoutes = async () => {
      if (!props.showRealRoutes || !props.places || props.places.length < 2) {
        return;
      }

      isLoadingRoutes.value = true;

      // 기존 경로 폴리라인 제거
      routePolylines.forEach(polyline => polyline.setMap(null));
      routePolylines = [];

      try {
        // 연속된 장소들 사이의 경로 탐색
        for (let i = 0; i < props.places.length - 1; i++) {
          const start = props.places[i];
          const end = props.places[i + 1];

          if (!start.latitude || !start.longitude || !end.latitude || !end.longitude) {
            continue;
          }

          let routeFeatures = null;

          // 경로 타입에 따라 다른 API 호출
          switch (props.routeType) {
            case 'car':
              routeFeatures = await getCarRoute(
                start.latitude, start.longitude,
                end.latitude, end.longitude
              );
              break;
            case 'walk':
              routeFeatures = await getWalkRoute(
                start.latitude, start.longitude,
                end.latitude, end.longitude
              );
              break;
            case 'transit':
              routeFeatures = await getTransitRoute(
                start.latitude, start.longitude,
                end.latitude, end.longitude
              );
              break;
          }

          if (routeFeatures) {
            const routeCoords = convertRouteToKakaoCoords(routeFeatures);
            
            if (routeCoords.length > 0) {
              const style = getRouteStyle(props.routeType);
              
              const routePolyline = new window.kakao.maps.Polyline({
                path: routeCoords,
                ...style
              });

              routePolyline.setMap(map);
              routePolylines.push(routePolyline);
            }
          }

          // API 호출 간격 조절 (rate limiting 방지)
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        console.error('경로 그리기 오류:', error);
      } finally {
        isLoadingRoutes.value = false;
      }
    };

    // 수정된 updateMapMarkers 함수
    const updateMapMarkers = async () => {
      if (!map || !mapLoaded.value) return;

      // 기존 마커 및 경로 제거
      markers.forEach((marker) => marker.setMap(null));
      overlays.forEach((overlay) => overlay.setMap(null));
      routePolylines.forEach((polyline) => polyline.setMap(null));
      markers = [];
      overlays = [];
      routePolylines = [];

      if (polyline) {
        polyline.setMap(null);
        polyline = null;
      }

      // 장소가 없는 경우 처리
      if (!props.places || props.places.length === 0) return;

      // 지도 경계 설정용 객체
      const bounds = new window.kakao.maps.LatLngBounds();

      // 마커 생성 (기존 코드와 동일)
      props.places.forEach((place, index) => {
        if (!place.latitude || !place.longitude) return;

        const position = new window.kakao.maps.LatLng(
          place.latitude,
          place.longitude
        );

        // 커스텀 오버레이로 번호가 있는 마커 생성
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: position,
          content: createCustomMarker(index + 1),
          yAnchor: 1,
          zIndex: 10
        });

        customOverlay.setMap(map);
        overlays.push(customOverlay);

        // 인포윈도우 생성 (기존 코드와 동일)
        const infoContent = `
          <div class="map-info-window">
            <div class="info-header">
              <div class="info-number">${index + 1}</div>
              <div class="info-title">${place.planDetailName}</div>
            </div>
            <div class="info-body">
              <div class="info-time">
                <span class="time-icon">🕐</span>
                ${formatTime(place.arrivalTime)} - ${formatTime(place.departureTime)}
              </div>
              ${place.memo ? `<div class="info-memo"><span class="memo-icon">📝</span>${place.memo}</div>` : ''}
              ${place.address ? `<div class="info-address"><span class="address-icon">📍</span>${place.address}</div>` : ''}
            </div>
          </div>
        `;

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: infoContent,
          removable: true,
        });

        // DOM 요소에 안전하게 이벤트 추가
        setTimeout(() => {
          const markerElement = customOverlay.getContent();
          
          if (markerElement && markerElement.nodeType === Node.ELEMENT_NODE) {
            markerElement.addEventListener('click', () => {
              closeAllInfoWindows();
              infoWindow.open(map, {
                getPosition: () => position
              });
              map.setCenter(position);
            });

            markerElement.addEventListener('mouseenter', () => {
              const marker = markerElement.querySelector('.custom-marker');
              if (marker) marker.classList.add('hover');
            });

            markerElement.addEventListener('mouseleave', () => {
              const marker = markerElement.querySelector('.custom-marker');
              if (marker) marker.classList.remove('hover');
            });
          }
        }, 100);

        bounds.extend(position);
      });

      // 실제 경로 그리기 또는 직선 경로 그리기
      if (props.showRealRoutes && showPolyline.value) {
        await drawRealRoutes();
      } else if (showPolyline.value) {
        // 기존 직선 경로 그리기
        const linePath = props.places
          .filter(place => place.latitude && place.longitude)
          .map(place => new window.kakao.maps.LatLng(place.latitude, place.longitude));

        if (linePath.length > 1) {
          polyline = new window.kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 3,
            strokeColor: "#8e6ad9",
            strokeOpacity: 0.8,
            strokeStyle: "solid",
          });

          polyline.setMap(map);
        }
      }

      // 지도 경계 설정
      if (props.places.length > 0) {
        map.setBounds(bounds);
        
        if (props.places.length === 1) {
          map.setLevel(3);
        }
      }
    };

    // 경로 타입 전환 함수
    const changeRouteType = async (newType) => {
      if (props.routeType !== newType) {
        // 부모 컴포넌트에서 prop을 변경해야 함
        // 또는 emit으로 이벤트 전달
        await updateMapMarkers();
      }
    };

    // ... (기존 함수들 유지: closeAllInfoWindows, resetMapBounds, togglePolyline, formatTime)

    // places prop 또는 관련 설정 변경 시 지도 업데이트
    watch(
      [() => props.places, () => props.showRealRoutes, () => props.routeType],
      () => {
        updateMapMarkers();
      },
      { deep: true }
    );

    onMounted(() => {
      initMap();
    });

    return {
      mapContainer,
      mapLoaded,
      isLoadingRoutes,
      resetMapBounds,
      togglePolyline,
      changeRouteType,
    };
  },
};
</script>



<style scoped>
.trip-map-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.trip-map {
  width: 100%;
  height: 100%;
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 2;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f5f0ff;
  border-top: 3px solid #8e6ad9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
}

.map-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.map-control-button {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: white;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.map-control-button:hover {
  background-color: #f9f7ff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.control-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #4b5563;
}

/* 커스텀 마커 스타일 */
:global(.custom-marker) {
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

:global(.custom-marker:hover),
:global(.custom-marker.hover) {
  transform: scale(1.1);
  z-index: 20;
}

:global(.custom-marker.active) {
  z-index: 15;
}

:global(.marker-pin) {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

:global(.marker-number) {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #8e6ad9 0%, #a78bda 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(142, 106, 217, 0.3);
  font-family: 'Marines', 'Pretendard', sans-serif;
}

:global(.marker-point) {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 12px solid #8e6ad9;
  margin-top: -2px;
  filter: drop-shadow(0 2px 4px rgba(142, 106, 217, 0.2));
}

:global(.custom-marker:hover .marker-number),
:global(.custom-marker.hover .marker-number) {
  background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.4);
}

:global(.custom-marker:hover .marker-point),
:global(.custom-marker.hover .marker-point) {
  border-top-color: #7c3aed;
}

/* 카카오맵 인포윈도우 스타일링 */
:global(.map-info-window) {
  padding: 0;
  width: 280px;
  font-family: 'Pretendard', sans-serif;
}

:global(.info-header) {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #8e6ad9 0%, #a78bda 100%);
  color: white;
  border-radius: 8px 8px 0 0;
}

:global(.info-number) {
  width: 1.75rem;
  height: 1.75rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
}

:global(.info-title) {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
}

:global(.info-body) {
  padding: 1rem;
  background: white;
  border-radius: 0 0 8px 8px;
}

:global(.info-time) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background-color: #f8fafc;
  border-radius: 6px;
}

:global(.info-memo) {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

:global(.info-address) {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #9ca3af;
  line-height: 1.3;
}

:global(.time-icon),
:global(.memo-icon),
:global(.address-icon) {
  flex-shrink: 0;
  font-size: 1rem;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .map-controls {
    top: 0.5rem;
    right: 0.5rem;
  }

  .map-control-button {
    width: 2rem;
    height: 2rem;
  }

  .control-icon {
    width: 1rem;
    height: 1rem;
  }

  :global(.marker-number) {
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  }

  :global(.map-info-window) {
    width: 240px;
  }

  :global(.info-header) {
    padding: 0.75rem;
  }

  :global(.info-body) {
    padding: 0.75rem;
  }
}
</style>