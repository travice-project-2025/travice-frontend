<template>
  <div class="travel-partner-page">
    <div class="page-container">
      
      
      <div class="page-title-area">
        <h1 class="page-title">여행 <span class="highlight">파트너</span> 모집하기</h1>
        <p class="page-description">함께 여행할 동행을 찾아보세요</p>
      </div>
      
      <div class="main-content">
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <div class="step-indicators">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              class="step" 
              :class="{ 
                'active': currentStep >= index,
                'current': currentStep === index
              }"
              @click="jumpToStep(index)"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-label">{{ step.label }}</div>
            </div>
          </div>
        </div>
        
        <div class="step-content">
          <transition name="fade" mode="out-in">
            <!-- 스텝 1: 여행 계획 선택 및 기본 정보 -->
            <div v-if="currentStep === 0" class="step-form basics-form">
              <div class="form-section">
                <h2 class="section-title">내 여행 계획 선택</h2>
                <p class="section-description">
                  어떤 여행에 동행을 찾고 싶으신가요? 등록된 여행 계획을 선택해주세요.
                </p>
                
                <div v-if="isLoadingPlans" class="loading-plans">
                  <div class="loading-spinner"></div>
                  <p>여행 계획을 불러오는 중입니다...</p>
                </div>
                
                <div v-else-if="myPlans.length === 0" class="empty-plans">
                  <div class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 21L12 17L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <p>등록된 여행 계획이 없습니다.</p>
                  <p>동행을 찾기 전에 여행 계획을 먼저 작성해주세요.</p>
                  <button type="button" class="create-plan-btn" @click="goToPlanCreation">
                    <span>새 여행 계획 만들기</span>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <div v-else class="plan-list">
                  <div 
                    v-for="plan in myPlans" 
                    :key="plan.id" 
                    class="plan-card"
                    :class="{ selected: postData.planId === plan.id }"
                    @click="selectPlan(plan)"
                  >
                    <div class="plan-header">
                      <div class="plan-title-wrapper">
                        <h3 class="plan-title">{{ plan.title }}</h3>
                        <span class="plan-badge" v-if="postData.planId === plan.id">
                          선택됨
                        </span>
                      </div>
                    </div>
                    
                    <div class="plan-content">
                      <div class="plan-thumbnail" v-if="plan.thumbnail">
                        <img :src="plan.thumbnail" alt="여행 이미지" class="thumbnail-img">
                      </div>
                      
                      <div class="plan-info">
                        <div class="info-item">
                          <span class="info-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </span>
                          <span class="info-label">여행지:</span>
                          <span class="info-value">{{ plan.location }}</span>
                        </div>
                        
                        <div class="info-item">
                          <span class="info-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </span>
                          <span class="info-label">여행 기간:</span>
                          <span class="info-value">{{ formatDate(plan.startDate) }} ~ {{ formatDate(plan.endDate) }}</span>
                        </div>
                        
                        
                        
                        <div class="info-item" v-if="plan.memberCount">
                          <span class="info-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </span>
                          <span class="info-label">인원 수:</span>
                          <span class="info-value">{{ plan.memberCount }}명</span>
                        </div>
                      </div>
                    </div>
                    
                    
                  </div>
                </div>
              </div>
              
              <div v-if="postData.planId" class="form-section">
                <h2 class="section-title">여행 기본 정보</h2>
                
                <div class="form-group">
                  <label for="post-title" class="form-label">제목</label>
                  <input 
                    id="post-title" 
                    type="text" 
                    v-model="postData.title"
                    class="form-input"
                    placeholder="동행을 구하는 제목을 입력해주세요"
                  >
                </div>
                
                <div class="form-group">
                  <label for="location" class="form-label">여행지</label>
                  <div class="location-input-wrapper">
                    <input 
                      id="location" 
                      type="text" 
                      v-model="postData.location"
                      class="form-input location-input"
                      placeholder="여행 목적지를 입력해주세요"
                      readonly
                    >
                    <div class="location-icon">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group half">
                    <label for="start-date" class="form-label">출발일</label>
                    <div class="calendar-input-wrapper">
                      <input 
                        id="start-date" 
                        type="date" 
                        v-model="postData.startDate"
                        class="form-input date-input"
                        readonly
                      >
                      <div class="calendar-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-group half">
                    <label for="end-date" class="form-label">도착일</label>
                    <div class="calendar-input-wrapper">
                      <input 
                        id="end-date" 
                        type="date" 
                        v-model="postData.endDate"
                        class="form-input date-input"
                        readonly
                      >
                      <div class="calendar-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-if="tripDuration > 0" class="trip-duration-display">
                  <span class="duration-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span class="duration-text">총 {{ tripDuration }}일간의 여행</span>
                </div>
              </div>
            </div>
          
            <!-- 스텝 2: 동행 조건 -->
            <div v-else-if="currentStep === 1" class="step-form companion-form form-section">
              <h2 class="section-title">동행 조건 설정</h2>
              
              <div class="form-group">
                <label class="form-label">모집 인원</label>
                <div class="member-count-selector">
                  <button type="button" class="count-btn" @click="decrementCount" :disabled="postData.memberCount <= 1">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <div class="count-value">{{ postData.memberCount }}명</div>
                  <button type="button" class="count-btn" @click="incrementCount">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">선호하는 성별</label>
                <div class="preference-buttons">
                  <button 
                    type="button"
                    class="preference-btn" 
                    :class="{ active: postData.preferenceGender === 'M' }"
                    @click="postData.preferenceGender = 'M'"
                  >
                    <div class="gender-icon male">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="9" cy="15" r="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M21 3L15 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M21 9V3H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <span>남성</span>
                  </button>
                  
                  <button 
                    type="button"
                    class="preference-btn" 
                    :class="{ active: postData.preferenceGender === 'W' }"
                    @click="postData.preferenceGender = 'W'"
                  >
                    <div class="gender-icon female">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="9" r="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 16V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 19H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <span>여성</span>
                  </button>
                  
                  <button 
                    type="button"
                    class="preference-btn" 
                    :class="{ active: postData.preferenceGender === 'ANY' }"
                    @click="postData.preferenceGender = 'ANY'"
                  >
                    <div class="gender-icon any">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 3C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5C19 5.53043 18.7893 6.03914 18.4142 6.41421C18.0391 6.78929 17.5304 7 17 7C16.4696 7 15.9609 6.78929 15.5858 6.41421C15.2107 6.03914 15 5.53043 15 5C15 4.46957 15.2107 3.96086 15.5858 3.58579C15.9609 3.21071 16.4696 3 17 3ZM17 11C18.654 11 20.234 11.652 21.4047 12.8147C22.5754 13.9774 23.2302 15.5582 23.232 17.212C23.232 17.644 22.876 18 22.444 18H11.556C11.124 18 10.768 17.644 10.768 17.212C10.7699 15.5582 11.4247 13.9774 12.5953 12.8147C13.766 11.652 15.346 11 17 11ZM7 8C8.06087 8 9.07828 8.42143 9.82843 9.17157C10.5786 9.92172 11 10.9391 11 12C11 13.0609 10.5786 14.0783 9.82843 14.8284C9.07828 15.5786 8.06087 16 7 16C5.93913 16 4.92172 15.5786 4.17157 14.8284C3.42143 14.0783 3 13.0609 3 12C3 10.9391 3.42143 9.92172 4.17157 9.17157C4.92172 8.42143 5.93913 8 7 8ZM7 18C8.992 18 10.926 18.8 12.362 20.188C13.792 21.576 14.624 23.47 14.63 25.444C14.63 25.752 14.356 26 14.02 26H-0.02C-0.356 26 -0.63 25.752 -0.63 25.444C-0.624 23.47 0.208 21.576 1.638 20.188C3.074 18.8 5.008 18 7 18Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <span>무관</span>
                  </button>
                </div>
              </div>
              
              <!-- 슬라이더를 숫자 입력으로 변경한 부분 -->
              <div class="form-group">
                <label class="form-label">선호하는 연령대</label>
                <div class="age-input-container">
                  <div class="age-inputs">
                    <div class="age-input-wrapper">
                      <input 
                        type="number" 
                        v-model.number="postData.preferenceMinAge" 
                        min="15" 
                        max="70" 
                        class="form-input age-input"
                        @change="validateAgeInputs"
                      >
                      <span class="age-unit">세</span>
                    </div>
                    <span class="age-separator">~</span>
                    <div class="age-input-wrapper">
                      <input 
                        type="number" 
                        v-model.number="postData.preferenceMaxAge" 
                        min="15" 
                        max="70" 
                        class="form-input age-input"
                        @change="validateAgeInputs"
                      >
                      <span class="age-unit">세</span>
                    </div>
                  </div>
                  
                 <div class="age-graph-container">
                  <div class="age-graph">
                    <div class="age-graph-bar">
                      <div 
                        class="age-graph-fill"
                        :style="{
                          left: ((postData.preferenceMinAge - 15) / 55 * 100) + '%',
                          width: ((postData.preferenceMaxAge - postData.preferenceMinAge) / 55 * 100) + '%'
                        }"
                      ></div>
                      <!-- 왼쪽 드래그 핸들 추가 -->
                      <div 
                        class="drag-handle left-handle"
                        :style="{ left: ((postData.preferenceMinAge - 15) / 55 * 100) + '%' }"
                        @mousedown="startDragMin"
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" fill="url(#gradient)" />
                          <path d="M10 8L6 12L10 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <defs>
                            <linearGradient id="age-slider-gradient-min" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                              <stop offset="0" stop-color="#8e6ad9" />
                              <stop offset="1" stop-color="#a78bfa" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <!-- 오른쪽 드래그 핸들 추가 -->
                      <div 
                        class="drag-handle right-handle"
                        :style="{ left: ((postData.preferenceMaxAge - 15) / 55 * 100) + '%' }"
                        @mousedown="startDragMax"
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" fill="url(#gradient2)" />
                          <path d="M14 8L18 12L14 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <defs>
                            <linearGradient id="age-slider-gradient-max" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                              <stop offset="0" stop-color="#8e6ad9" />
                              <stop offset="1" stop-color="#a78bfa" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <div class="age-labels">
                      <span>15세</span>
                      <span>70세</span>
                    </div>
                  </div>
                </div>
                  
                  <div class="age-presets">
                    <button type="button" class="age-preset-btn" @click="setAgePreset(20, 29)">20대</button>
                    <button type="button" class="age-preset-btn" @click="setAgePreset(30, 39)">30대</button>
                    <button type="button" class="age-preset-btn" @click="setAgePreset(20, 39)">20~30대</button>
                    <button type="button" class="age-preset-btn" @click="setAgePreset(15, 70)">전체</button>
                  </div>
                </div>
              </div>
              
              <!-- 예상 비용 입력 필드 -->
              <div class="form-group">
                <label for="estimated-cost" class="form-label">예상 비용</label>
                <div class="cost-input-wrapper">
                  <input 
                    id="estimated-cost" 
                    type="text" 
                    v-model="formattedCost"
                    class="form-input cost-input"
                    placeholder="1인당 예상 비용"
                  >
                  <div class="cost-suffix">
                    원
                  </div>
                </div>
              </div>
            </div>
          
            <!-- 스텝 3: 여행 상세 설명 -->
            <div v-else-if="currentStep === 2" class="step-form detail-form form-section">
              <h2 class="section-title">여행 상세 내용</h2>
              
              <div class="form-group">
                <label for="post-detail" class="form-label">상세 설명</label>
                <div class="detail-input-container">
                  <textarea 
                    id="post-detail" 
                    v-model="postData.detail" 
                    class="form-textarea"
                    placeholder="여행 일정, 활동 계획, 동행에게 바라는 점 등을 자유롭게 작성해주세요."
                    rows="8"
                  ></textarea>
                  <div class="textarea-tools">
                    <div class="character-count" :class="{ 'warning': postData.detail.length > 1000 }">
                      {{ postData.detail.length }}/1200
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
          
          <div class="step-actions">
            <button 
              v-if="currentStep > 0" 
              type="button"
              class="back-btn"
              @click="prevStep"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>이전</span>
            </button>
            
            <button 
              v-if="currentStep < steps.length - 1" 
              type="button"
              class="next-btn"
              @click="nextStep"
              :disabled="!canProceed"
            >
              <span>다음</span>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            
            <button 
              v-if="currentStep === steps.length - 1" 
              type="button"
              class="submit-btn"
              @click="submitPost"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '게시 중...' : '동행 모집하기' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

// 라우터 설정
const router = useRouter();

// 상태 정의
const isSubmitting = ref(false);
const isLoadingPlans = ref(true);
const currentStep = ref(0);
const myPlans = ref([]);

// 게시글 데이터 (memberCount 기본값 변경됨)
const postData = ref({
  title: '',
  detail: '',
  location: '',
  startDate: '',
  endDate: '',
  memberCount: 1, // 기본값 1명으로 변경
  preferenceGender: 'ANY',
  preferenceMinAge: 20,
  preferenceMaxAge: 35,
  estimatedCost: 0,
  planId: null
});

// 단계 정의
const steps = [
  { label: '여행 선택' },
  { label: '동행 조건' },
  { label: '상세 내용' }
];

// 선택된 계획
const selectedPlan = computed(() => {
  if (!postData.value.planId) return null;
  return myPlans.value.find(plan => plan.id === postData.value.planId);
});

// 진행률 계산
const progressPercentage = computed(() => {
  return (currentStep.value / (steps.length - 1)) * 100;
});

// 여행 일수 계산
const tripDuration = computed(() => {
  if (!postData.value.startDate || !postData.value.endDate) return 0;
  
  const startDate = new Date(postData.value.startDate);
  const endDate = new Date(postData.value.endDate);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
  
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
});

// 날짜로부터 일수 계산 함수
const calculateDuration = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return 0;
  
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
  
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// 다음 버튼 활성화 조건 (수정됨)
const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return postData.value.planId !== null && postData.value.title.trim() !== '';
  } else if (currentStep.value === 1) {
    return true; // 모든 필드에 기본값이 있음
  } else if (currentStep.value === 2) {
    return postData.value.detail.trim() !== ''; // 글자 하나 이상이면 통과
  }
  return true;
});

// 인원 수 증가
const incrementCount = () => {
  postData.value.memberCount++;
};

// 인원 수 감소
const decrementCount = () => {
  if (postData.value.memberCount > 1) {
    postData.value.memberCount--;
  }
};

// 천 단위 구분 쉼표 포맷팅을 위한 computed 속성
const formattedCost = computed({
  get() {
    // 0원이면 빈 문자열 반환
    if (postData.value.estimatedCost === 0) return '';
    
    // 숫자를 문자열로 변환 후 천 단위로 쉼표 추가
    return postData.value.estimatedCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  set(value) {
    // 입력값에서 쉼표 제거 후 숫자로 변환
    const numericValue = value.replace(/,/g, '');
    
    // 빈 문자열이면 0으로 설정
    if (numericValue === '') {
      postData.value.estimatedCost = 0;
      return;
    }
    
    // 숫자가 아닌 문자가 포함되어 있으면 이전 값 유지
    if (!/^\d+$/.test(numericValue)) {
      return;
    }
    
    // 숫자로 변환하여 저장
    postData.value.estimatedCost = parseInt(numericValue, 10);
  }
});
const displayMinAge = computed(() => {
  // 최소 연령이 범위를 벗어나면 15세로 제한
  const minAge = Math.max(15, Math.min(postData.value.preferenceMinAge, 70));
  // 0~100% 사이의 위치로 변환
  return ((minAge - 15) / 55) * 100;
});

const displayAgeWidth = computed(() => {
  // 최소/최대 연령을 모두 범위 내로 제한
  const minAge = Math.max(15, Math.min(postData.value.preferenceMinAge, 70));
  const maxAge = Math.max(15, Math.min(postData.value.preferenceMaxAge, 70));
  
  // 최대가 최소보다 작으면 최소값으로 조정
  const adjustedMaxAge = Math.max(minAge, maxAge);
  
  // 0~100% 사이의 너비로 변환
  return ((adjustedMaxAge - minAge) / 55) * 100;
});

// 나이 프리셋 함수
const setAgePreset = (min, max) => {
  postData.value.preferenceMinAge = min;
  postData.value.preferenceMaxAge = max;
};

// 성별 텍스트 변환
const getGenderText = (gender) => {
  return gender === 'M' ? '남성' : gender === 'W' ? '여성' : '무관';
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  } catch (error) {
    console.error('날짜 변환 오류:', error);
    return '';
  }
};

// 여행 계획 선택 (제목 자동 생성 제거)
const selectPlan = (plan) => {
  postData.value.planId = plan.id;
  postData.value.location = plan.location;
  postData.value.startDate = plan.startDate;
  postData.value.endDate = plan.endDate;
  postData.value.title = ''; // 제목 필드 비우기
};

// 여행 계획 생성 페이지로 이동
const goToPlanCreation = () => {
  router.push('/create-plan');
};

// 메인 페이지로 이동
const goToMainPage = () => {
  router.push('/');
};

// 다음 단계로 이동
const nextStep = () => {
  if (currentStep.value === 0 && myPlans.value.length === 0) {
    // 여행 계획이 없는 경우
    alert('동행을 찾기 전에 여행 계획을 먼저 작성해주세요.');
    goToPlanCreation();
    return;
  }
  
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
    window.scrollTo(0, 0);
  }
};

// 이전 단계로 이동
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    window.scrollTo(0, 0);
  }
};

// 특정 단계로 점프
const jumpToStep = (stepIndex) => {
  // 이전 단계로만 점프 가능
  if (stepIndex < currentStep.value) {
    currentStep.value = stepIndex;
    window.scrollTo(0, 0);
  }
};

// 내 여행 계획 가져오기
const fetchMyPlans = async () => {
  isLoadingPlans.value = true;
  try {
    // API 호출하여 계획 데이터 가져오기
    const response = await fetch('http://localhost:8080/api/v1/plans', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('여행 계획 데이터:', data);
    
    // API 응답 데이터 매핑
    myPlans.value = data.map(plan => ({
      id: plan.id,
      title: plan.planTitle, // planTitle을 title로 매핑
      location: getCityName(plan.cityName), // cityName ID를 실제 도시 이름으로 변환
      startDate: plan.startDate,
      endDate: plan.endDate,
      thumbnail: plan.thumbnail, // 썸네일 이미지 URL
      memberCount: plan.memberCount // 인원 수
    }));
    
    isLoadingPlans.value = false;
    
    // 여행 계획이 없는 경우 메인 페이지로 이동
    if (myPlans.value.length === 0) {
      alert('동행을 찾기 전에 여행 계획을 먼저 작성해주세요.');
      goToPlanCreation();
    }
  } catch (error) {
    console.error('여행 계획 데이터 로드 실패:', error);
    myPlans.value = [];
    isLoadingPlans.value = false;
    
    // 여행 계획이 없는 경우 메인 페이지로 이동
    alert('동행을 찾기 전에 여행 계획을 먼저 작성해주세요.');
    goToPlanCreation();
  }
};

// cityName ID를 실제 도시 이름으로 변환하는 함수
const getCityName = (cityId) => {
  // 실제 구현에서는 도시 ID에 따른 도시 이름 매핑 테이블 필요
  const cityMap = {
    1: '제주도',
    2: '서울',
    3: '부산',
    4: '강원도',
    5: '울산'
    // 필요에 따라 더 많은 도시 추가
  };
  
  return cityMap[cityId] || '알 수 없는 지역';
};

// 게시글 제출
const submitPost = async () => {
  if (isSubmitting.value) return;
  
  isSubmitting.value = true;
  
  try {
    // BoardCreateDTO 형식에 맞게 데이터 구성
    const boardData = {
      title: postData.value.title,
      detail: postData.value.detail,
      memberCount: postData.value.memberCount,
      preferenceGender: postData.value.preferenceGender,
      preferenceMinAge: postData.value.preferenceMinAge,
      preferenceMaxAge: postData.value.preferenceMaxAge,
      cost: postData.value.estimatedCost,
      planId: postData.value.planId
    };
    
    console.log(boardData);

    // Spring 백엔드로 POST 요청 전송
    const response = await fetch('http://localhost:8080/api/v1/boards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('JWT-TOKEN')
      },
      credentials: 'include', // 쿠키/세션 정보 포함
      body: JSON.stringify(boardData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || '게시글 등록에 실패했습니다.');
    }
    
    const result = await response.json();
    console.log('등록 성공:', result);
    
    alert('동행 모집 게시글이 성공적으로 등록되었습니다!');
    router.push('/board');
  } catch (error) {
    console.error('게시글 등록 실패:', error);
    alert('게시글을 등록하는 중 오류가 발생했습니다.');
  } finally {
    isSubmitting.value = false;
  }
};

// 컴포넌트 마운트 시
onMounted(async () => {
  // 내 여행 계획 가져오기
  await fetchMyPlans();
});

// 여행 계획 변경 감지
watch(() => postData.value.planId, (newPlanId) => {
  if (!newPlanId) {
    postData.value.location = '';
    postData.value.startDate = '';
    postData.value.endDate = '';
    postData.value.title = '';
  }
});



// 드래그 이벤트 처리를 위한 상태 및 메서드
const isDraggingMin = ref(false);
const isDraggingMax = ref(false);

// 최소 연령 드래그 시작
const startDragMin = (event) => {
  isDraggingMin.value = true;
  document.addEventListener('mousemove', handleDragMin);
  document.addEventListener('mouseup', stopDragMin);
  event.preventDefault();
};

// 최대 연령 드래그 시작
const startDragMax = (event) => {
  isDraggingMax.value = true;
  document.addEventListener('mousemove', handleDragMax);
  document.addEventListener('mouseup', stopDragMax);
  event.preventDefault();
};

// 최소 연령 드래그 처리
const handleDragMin = (event) => {
  if (!isDraggingMin.value) return;
  
  const graphBar = document.querySelector('.age-graph-bar');
  if (!graphBar) return;
  
  const rect = graphBar.getBoundingClientRect();
  
  // 마우스가 바의 왼쪽 끝보다 작으면 15로 고정
  if (event.clientX <= rect.left) {
    postData.value.preferenceMinAge = 15;
    return;
  }
  
  // 마우스가 바의 오른쪽 끝을 넘어가면 최대값 - 1로 설정
  if (event.clientX >= rect.right) {
    postData.value.preferenceMinAge = postData.value.preferenceMaxAge - 1;
    return;
  }
  
  const percentage = (event.clientX - rect.left) / rect.width;
  // 백분율이 0~1 사이인지 확인
  const clampedPercentage = Math.max(0, Math.min(percentage, 1));
  const newMinAge = Math.round(15 + clampedPercentage * 55);
  
  // 범위 및 최대 연령과의 관계 확인
  postData.value.preferenceMinAge = Math.max(
    15, 
    Math.min(newMinAge, postData.value.preferenceMaxAge - 1)
  );
};

// 최대 연령 드래그 처리
const handleDragMax = (event) => {
  if (!isDraggingMax.value) return;
  
  const graphBar = document.querySelector('.age-graph-bar');
  if (!graphBar) return;
  
  const rect = graphBar.getBoundingClientRect();
  
  // 마우스가 바의 오른쪽 끝을 넘어가면 70으로 고정
  if (event.clientX >= rect.right) {
    postData.value.preferenceMaxAge = 70;
    return;
  }
  
  // 마우스가 바의 왼쪽 끝보다 작으면 최소값 + 1로 설정
  if (event.clientX <= rect.left) {
    postData.value.preferenceMaxAge = postData.value.preferenceMinAge + 1;
    return;
  }
  
  const percentage = (event.clientX - rect.left) / rect.width;
  // 백분율이 0~1 사이인지 확인
  const clampedPercentage = Math.max(0, Math.min(percentage, 1));
  const newMaxAge = Math.round(15 + clampedPercentage * 55);
  
  // 범위 및 최소 연령과의 관계 확인
  postData.value.preferenceMaxAge = Math.max(
    postData.value.preferenceMinAge + 1, 
    Math.min(newMaxAge, 70)
  );
};

// 나이 입력값 검증 함수 개선
const validateAgeInputs = () => {
  // 최소값이 15보다 작거나 70보다 크면 조정
  if (postData.value.preferenceMinAge < 15) {
    postData.value.preferenceMinAge = 15;
  } else if (postData.value.preferenceMinAge > 70) {
    postData.value.preferenceMinAge = 70;
  }
  
  // 최대값이 15보다 작거나 70보다 크면 조정
  if (postData.value.preferenceMaxAge < 15) {
    postData.value.preferenceMaxAge = 15;
  } else if (postData.value.preferenceMaxAge > 70) {
    postData.value.preferenceMaxAge = 70;
  }
  
  // 최소값이 최대값보다 크면 최대값-1로 조정
  if (postData.value.preferenceMinAge >= postData.value.preferenceMaxAge) {
    postData.value.preferenceMinAge = postData.value.preferenceMaxAge - 1;
  }
  
  // 최대값이 최소값보다 작으면 최소값+1로 조정
  if (postData.value.preferenceMaxAge <= postData.value.preferenceMinAge) {
    postData.value.preferenceMaxAge = postData.value.preferenceMinAge + 1;
  }
};


// 드래그 중지
const stopDragMin = () => {
  if (!isDraggingMin.value) return;
  isDraggingMin.value = false;
  document.removeEventListener('mousemove', handleDragMin);
  document.removeEventListener('mouseup', stopDragMin);
  
  // 한번 더 값 검증
  validateAgeInputs();
};

const stopDragMax = () => {
  if (!isDraggingMax.value) return;
  isDraggingMax.value = false;
  document.removeEventListener('mousemove', handleDragMax);
  document.removeEventListener('mouseup', stopDragMax);
  
  // 한번 더 값 검증
  validateAgeInputs();
};

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleDragMin);
  document.removeEventListener('mouseup', stopDragMin);
  document.removeEventListener('mousemove', handleDragMax);
  document.removeEventListener('mouseup', stopDragMax);
});



</script>

<style scoped>

/* 폰트 정의 */
@font-face { 
  font-family: 'MarinesBold'; 
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2502-1@1.0/MarinesBold.woff2') format('woff2'); 
  font-weight: 700;
  font-style: normal; 
}


/* 드래그 핸들 스타일 */
.drag-handle {
  position: absolute;
  width: 24px;
  height: 24px;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  z-index: 10;
  filter: drop-shadow(0 2px 6px rgba(142, 106, 217, 0.4));
  transition: transform 0.2s;
}

.drag-handle:active {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.1);
}

.drag-handle:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

.drag-handle svg {
  width: 100%;
  height: 100%;
}

.left-handle {
  left: 0;
}

.right-handle {
  left: 100%;
}

/* 슬라이더 바 높이 조정 */
.age-graph-bar {
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  position: relative;
  margin: 25px 0 15px;
}

.age-graph-fill {
  position: absolute;
  height: 100%;
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
  border-radius: 4px;
  transition: all 0.1s;
}




/* 기본 스타일 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.travel-partner-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'MarinesBold', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #333;
  padding-top: 60px;
}

.page-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

/* 헤더 스타일 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: #8e6ad9;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #8e6ad9;
}

.close-btn {
  background: none;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: rgba(142, 106, 217, 0.1);
  color: #8e6ad9;
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

/* 페이지 타이틀 영역 */
.page-title-area {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
  font-family: 'MarinesBold', sans-serif;
}

.page-title .highlight {
  color: #8e6ad9;
}

.page-description {
  font-size: 16px;
  color: #666;
  font-family: 'MarinesBold', sans-serif;
}

/* 메인 콘텐츠 영역 */
.main-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 40px;
}

/* 진행 표시기 */
.progress-indicator {
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: #eee;
  border-radius: 2px;
  margin-bottom: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
  border-radius: 2px;
  transition: width 0.4s ease;
}

.step-indicators {
  display: flex;
  justify-content: space-between;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  cursor: pointer;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 12px;
  left: 50%;
  width: 100%;
  height: 1px;
  background-color: #eee;
  z-index: 0;
}

.step.active:not(:last-child)::after {
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ddd;
  color: white;
  font-weight: 500;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
  transition: all 0.3s;
}

.step.active .step-number {
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
}

.step.current .step-number {
  transform: scale(1.2);
  box-shadow: 0 0 0 4px rgba(142, 106, 217, 0.2);
}

.step-label {
  font-size: 12px;
  color: #888;
  transition: all 0.3s;
}

.step.active .step-label {
  color: #8e6ad9;
  font-weight: 500;
}

.step.current .step-label {
  font-weight: 600;
}

/* 단계별 폼 컨테이너 */
.step-content {
  padding: 30px;
}

.step-form {
  animation: fadeIn 0.4s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 폼 섹션 */
.form-section {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.section-description {
  font-size: 14px;
  color: #666;
  margin: -15px 0 20px;
}

/* 폼 요소 */
.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.form-group.half {
  flex: 1;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #444;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s;
  background-color: #fcfcfc;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #8e6ad9;
  box-shadow: 0 0 0 2px rgba(142, 106, 217, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

/* 읽기 전용 입력 필드 */
.form-input[readonly] {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

/* 여행지 입력 필드 */
.location-input-wrapper {
  position: relative;
}

.location-input {
  padding-right: 48px;
}

.location-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none;
}

.location-icon svg {
  width: 20px;
  height: 20px;
}

/* 날짜 입력 필드 */
.calendar-input-wrapper {
  position: relative;
}

.date-input {
  padding-right: 48px;
}

.calendar-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none;
}

.calendar-icon svg {
  width: 20px;
  height: 20px;
}

/* 여행 기간 표시 */
.trip-duration-display {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  padding: 12px 16px;
  background-color: rgba(142, 106, 217, 0.08);
  border-radius: 8px;
  color: #8e6ad9;
}

.duration-icon {
  display: flex;
}

.duration-icon svg {
  width: 20px;
  height: 20px;
}

.duration-text {
  font-weight: 500;
  font-size: 14px;
}

/* 인원 수 카운터 */
.member-count-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fcfcfc;
}

.count-btn {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background-color: white;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.count-btn:hover {
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
  border-color: #8e6ad9;
  color: white;
}

.count-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.count-btn svg {
  width: 18px;
  height: 18px;
}

.count-value {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  min-width: 40px;
  text-align: center;
}

/* 성별 선택 */
.preference-buttons {
  display: flex;
  gap: 10px;
}

.preference-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.preference-btn:hover {
  background-color: rgba(142, 106, 217, 0.04);
}

.preference-btn.active {
  border-color: #8e6ad9;
  background-color: rgba(142, 106, 217, 0.08);
}

.gender-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.gender-icon.male {
  color: #2196F3;
}

.gender-icon.female {
  color: #E91E63;
}

.gender-icon.any {
  color: #9C27B0;
}

.preference-btn.active .gender-icon {
  color: #8e6ad9;
}

.preference-btn span {
  font-weight: 500;
  color: #555;
}

.preference-btn.active span {
  color: #8e6ad9;
}

.gender-icon svg {
  width: 24px;
  height: 24px;
}

/* 슬라이더를 숫자 입력으로 변경한 스타일 */
.age-input-container {
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: white;
  padding: 20px;
  margin-bottom: 15px;
}

.age-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
}

.age-input-wrapper {
  position: relative;
  width: 100px;
}

.age-input {
  padding-right: 35px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
}

.age-unit {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 14px;
}

.age-separator {
  font-size: 24px;
  color: #888;
  margin: 0 5px;
}

.age-graph-container {
  margin-bottom: 20px;
}

.age-graph {
  position: relative;
  width: 100%;
}

.age-graph-bar {
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  position: relative;
  margin-bottom: 10px;
}

.age-graph-fill {
  position: absolute;
  height: 100%;
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
  border-radius: 4px;
  transition: all 0.3s;
}

.age-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  padding: 0 2px;
}

.age-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.age-preset-btn {
  padding: 8px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.age-preset-btn:hover {
  background-color: rgba(142, 106, 217, 0.04);
  border-color: #8e6ad9;
  color: #8e6ad9;
}

/* 비용 입력 필드 */
.cost-input-wrapper {
  position: relative;
}

.cost-input {
  padding-right: 45px;
  text-align: right;
}

.cost-suffix {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #555;
  font-size: 15px;
  font-weight: 500;
  pointer-events: none;
}

.detail-input-container {
  position: relative;
}

.form-textarea {
  width: 100%;
  height: 220px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.6;
  resize: none;
  background-color: #fcfcfc;
  transition: all 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: #8e6ad9;
  box-shadow: 0 0 0 2px rgba(142, 106, 217, 0.1);
}

.textarea-tools {
  display: flex;
  justify-content: flex-end;
  padding: 8px 2px;
}

.character-count {
  font-size: 13px;
  color: #888;
}

.character-count.warning {
  color: #f44336;
}

/* 여행 계획 연결 영역 - 개선된 카드 디자인 */
.loading-plans, .empty-plans {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(142, 106, 217, 0.2);
  border-top: 4px solid #8e6ad9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  width: 50px;
  height: 50px;
  color: #888;
  margin-bottom: 15px;
}

.empty-plans p {
  color: #666;
  font-size: 15px;
  margin-bottom: 10px;
}

.create-plan-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.3);
}

.create-plan-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(142, 106, 217, 0.4);
}

.create-plan-btn svg {
  width: 18px;
  height: 18px;
}

/* 여행 계획 카드 개선 */
.plan-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 650px;
  overflow-y: auto;
  padding: 10px 5px;
}

.plan-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: white;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.plan-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(142, 106, 217, 0.15);
}

.plan-card.selected {
  border-color: #8e6ad9;
  background-color: rgba(142, 106, 217, 0.04);
}

.plan-header {
  margin-bottom: 15px;
}

.plan-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  padding-right: 30px;
}

.plan-badge {
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
  color: white;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

.plan-content {
  padding-bottom: 5px;
  display: flex;
  gap: 20px;
}

.plan-thumbnail {
  width: 120px;
  height: 90px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plan-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #555;
}

.info-icon {
  display: flex;
  align-items: center;
  color: #8e6ad9;
  flex-shrink: 0;
}

.info-icon svg {
  width: 16px;
  height: 16px;
}

.info-label {
  font-weight: 500;
  color: #666;
  min-width: 70px;
}

.info-value {
  color: #333;
}

.plan-select-indicator {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 22px;
  height: 22px;
  color: #8e6ad9;
}

/* 단계 액션 버튼 */
.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.back-btn, .next-btn, .submit-btn {
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  color: #555;
}

.back-btn:hover {
  background-color: rgba(142, 106, 217, 0.1);
  color: #8e6ad9;
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.next-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
  border: none;
  color: white;
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.3);
}

.next-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(142, 106, 217, 0.4);
}

.next-btn:disabled {
  background-color: #bbb;
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.next-btn svg {
  width: 18px;
  height: 18px;
}

.submit-btn {
  background: linear-gradient(135deg, #8e6ad9, #a78bfa);
  border: none;
  color: white;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(142, 106, 217, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(142, 106, 217, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 트랜지션 효과 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .page-container {
    padding: 15px;
  }
  
  .progress-indicator {
    padding: 15px;
  }
  
  .step-content {
    padding: 20px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .preference-buttons {
    flex-direction: column;
  }
  
  .step-label {
    display: none;
  }
  
  .age-inputs {
    flex-direction: column;
    gap: 10px;
  }
  
  .age-input-wrapper {
    width: 100%;
  }
  
  .age-separator {
    display: none;
  }
}
</style>