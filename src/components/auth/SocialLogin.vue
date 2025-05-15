<template>
  <div class="social-login">
    <button class="social-btn google" @click="googleLogin">
      <img :src="icons.google" alt="Google" />
      <span>Google로 계속하기</span>
    </button>

    <button class="social-btn naver" @click="naverLogin">
      <img :src="icons.naver" alt="Naver" />
      <span>Naver로 계속하기</span>
    </button>

    <button class="social-btn kakao" @click="kakaoLogin">
      <img :src="icons.kakao" alt="Kakao" />
      <span>Kakao로 계속하기</span>
    </button>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import googleIcon from '@/assets/icons/google.svg'
import naverIcon  from '@/assets/icons/naver.svg'
import kakaoIcon  from '@/assets/icons/kakao.svg'

const icons = {
  google: googleIcon,
  naver:  naverIcon,
  kakao:  kakaoIcon,
}

const emit = defineEmits(['login'])
function login(provider) {
  emit('login', provider)
}

const googleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
}
const naverLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/naver'
}
const kakaoLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/kakao'
}
</script>

<style scoped>
.social-login {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}
.social-btn {
  width: 100%;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}
.social-btn:hover { opacity: 0.9; }
.social-btn img {
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
}
.social-btn.google {
  background: #fff;
}
.social-btn.naver {
  background: #03c75a;
  color: #fff;
  border: none;
}
.social-btn.kakao {
  background: #fee500;
  color: #3c1e1e;
  border: none;
}
</style>