<!-- components/plan/TripMap.vue -->
<template>
  <div class="trip-map-container">
    <div ref="mapContainer" id="trip-map" class="trip-map"></div>
    <div v-if="!mapLoaded" class="map-loading">
      <div class="loading-spinner"></div>
      <p>지도를 불러오는 중...</p>
    </div>
    <div class="map-controls">
      <button @click="resetMapBounds" class="map-control-button" title="모든 장소 보기">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="control-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      </button>
      <button @click="togglePolyline" class="map-control-button" title="경로 표시/숨기기">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="control-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7l5 5-5 5M6 12h12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
// components/plan/TripMap.vue의 <script> 부분 수정
import { ref, onMounted, watch, nextTick } from "vue";

export default {
  name: "TripMap",
  props: {
    places: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const mapContainer = ref(null);
    const mapLoaded = ref(false);
    const showPolyline = ref(true);

    let map = null;
    let markers = [];
    let overlays = [];
    let polyline = null;

    // 지도 초기화
    const initMap = async () => {
      if (!window.kakao || !window.kakao.maps) {
        console.log("카카오맵 API 로딩 중...");

        try {
          // 카카오맵 API 동적 로드
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=68e8b97d381d75363cc6b9be98056de8&libraries=services&autoload=false`;
            script.onload = () => {
              // API 로드 후 초기화
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
          center: new window.kakao.maps.LatLng(33.4, 126.5), // 제주도 중심 좌표
          level: 9,
        };

        map = new window.kakao.maps.Map(mapContainer.value, mapOptions);
        mapLoaded.value = true;

        // 지도 로드 후 마커 업데이트
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

    // 지도 마커 및 경로 업데이트 (이전 코드와 동일)
    const updateMapMarkers = () => {
      if (!map || !mapLoaded.value) return;

      // 기존 마커 및 경로 제거
      markers.forEach((marker) => marker.setMap(null));
      overlays.forEach((overlay) => overlay.setMap(null));
      markers = [];
      overlays = [];

      if (polyline) {
        polyline.setMap(null);
        polyline = null;
      }

      // 장소가 없는 경우 처리
      if (!props.places || props.places.length === 0) return;

      // 지도 경계 설정용 객체
      const bounds = new window.kakao.maps.LatLngBounds();

      // 경로 좌표 배열
      const linePath = [];

      // 마커 생성 및 추가
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

        // 인포윈도우 생성
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

        const markerElement = customOverlay.getContent();
        markerElement.addEventListener('click', () => {
          // 다른 인포윈도우 모두 닫기
          closeAllInfoWindows();
          
          // 현재 인포윈도우 열기
          infoWindow.open(map, {
            getPosition: () => position
          });
          
          // 지도 중심을 해당 위치로 이동
          map.setCenter(position);
        });

        // 마커 호버 효과
        markerElement.addEventListener('mouseenter', () => {
          markerElement.querySelector('.custom-marker').classList.add('hover');
        });

        markerElement.addEventListener('mouseleave', () => {
          markerElement.querySelector('.custom-marker').classList.remove('hover');
        });

        linePath.push(position);
        bounds.extend(position);
      });

      // 경로 그리기
      if (linePath.length > 1 && showPolyline.value) {
        polyline = new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 3,
          strokeColor: "#8e6ad9",
          strokeOpacity: 0.8,
          strokeStyle: "solid",
        });

        polyline.setMap(map);
      }

      // 모든 마커가 보이도록 지도 경계 재설정
      if (linePath.length > 0) {
        map.setBounds(bounds);
        
        // 마커가 1개인 경우 적절한 줌 레벨 설정
        if (linePath.length === 1) {
          map.setLevel(3);
        }
      }
    };

    // 모든 인포윈도우 닫기
    const closeAllInfoWindows = () => {
      // 기존에 열린 인포윈도우들을 추적하여 닫을 수 있도록 개선 필요
    };

    // 지도 경계 초기화 (모든 마커가 보이도록)
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

    // 시간 포맷팅 (HH:MM:SS -> HH:MM)
    const formatTime = (timeStr) => {
      if (!timeStr) return "";
      return timeStr.substring(0, 5);
    };

    // places prop 변경 시 지도 마커 업데이트
    watch(
      () => props.places,
      () => {
        updateMapMarkers();
      },
      { deep: true }
    );

    // 컴포넌트 마운트 시 지도 초기화
    onMounted(() => {
      initMap();
    });

    return {
      mapContainer,
      mapLoaded,
      resetMapBounds,
      togglePolyline,
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