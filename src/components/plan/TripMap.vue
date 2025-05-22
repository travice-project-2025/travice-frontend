<!-- components/plan/TripMap.vue -->
<template>
  <div class="trip-map-container">
    <div ref="mapContainer" id="trip-map" class="trip-map"></div>
    <div v-if="!mapLoaded" class="map-loading">
      <div class="loading-spinner"></div>
      <p>지도를 불러오는 중...</p>
    </div>
    <div class="map-controls">
      <button @click="resetMapBounds" class="map-control-button">
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
    let map = null;
    let markers = [];
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

    // 지도 마커 및 경로 업데이트 (이전 코드와 동일)
    const updateMapMarkers = () => {
      if (!map || !mapLoaded.value) return;

      // 기존 마커 및 경로 제거
      markers.forEach((marker) => marker.setMap(null));
      markers = [];

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

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: position,
          map: map,
        });

        // 인포윈도우 생성
        const infoContent = `
          <div class="map-info-window">
            <div class="info-number">${index + 1}</div>
            <div class="info-content">
              <div class="info-title">${place.planDetailName}</div>
              <div class="info-time">${formatTime(
                place.arrivalTime
              )} - ${formatTime(place.departureTime)}</div>
            </div>
          </div>
        `;

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: infoContent,
          removable: true,
        });

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, "click", () => {
          infoWindow.open(map, marker);
        });

        markers.push(marker);
        linePath.push(position);
        bounds.extend(position);
      });

      // 경로 그리기
      if (linePath.length > 1) {
        polyline = new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 3,
          strokeColor: "#8e6ad9",
          strokeOpacity: 0.7,
          strokeStyle: "solid",
        });

        polyline.setMap(map);
      }

      // 모든 마커가 보이도록 지도 경계 재설정
      if (linePath.length > 0) {
        map.setBounds(bounds);
      }
    };

    // 지도 경계 초기화 (모든 마커가 보이도록)
    const resetMapBounds = () => {
      if (!map || markers.length === 0) return;

      const bounds = new window.kakao.maps.LatLngBounds();
      markers.forEach((marker) => bounds.extend(marker.getPosition()));

      map.setBounds(bounds);
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
}

.control-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #4b5563;
}

/* 카카오맵 인포윈도우 스타일링 (외부 스타일) */
:global(.map-info-window) {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  gap: 0.5rem;
}

:global(.info-number) {
  width: 1.5rem;
  height: 1.5rem;
  background-color: #8e6ad9;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

:global(.info-content) {
  display: flex;
  flex-direction: column;
}

:global(.info-title) {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

:global(.info-time) {
  font-size: 0.75rem;
  color: #6b7280;
}
</style>
