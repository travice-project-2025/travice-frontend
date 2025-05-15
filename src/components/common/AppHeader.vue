<!-- src/components/common/AppHeader.vue -->
<template>
  <header :class="['header', { shrink: isShrunk }]">
    <div class="container header-container">
      <div class="logo">Travice</div>
      <router-link to="/login" class="login-btn">
        로그인
      </router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    isShrunk: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  z-index: 100;
  background-color: #F9FAFC;
  transition: box-shadow 0.3s ease;
}

.header.shrink {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.login-btn {
  background-color: #F0F0FF;
  color: #333;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}
</style>