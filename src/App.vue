<!-- src/App.vue -->
<template>
  <div id="app">
    <AppHeader v-if="!$route.meta?.hideHeader" :is-shrunk="isHeaderShrunk" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from './components/common/AppHeader.vue';

const route = useRoute();
const isHeaderShrunk = ref(false);

const handleScroll = () => {
  if (window.scrollY > 20) {
    isHeaderShrunk.value = true;
  } else {
    isHeaderShrunk.value = false;
  }
};

onMounted(() => {
  console.log("웹이 마운트되었습니다.");
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style>
@font-face {
  font-family: 'Marines';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2502-1@1.0/MarinesBold.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Marines';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2502-1@1.0/MarinesBold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
}

#app {
  font-family: 'Marines', 'Pretendard', 'Noto Sans KR', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  min-height: 100vh;
  position: relative;
}

main {
  padding-top: 60px; /* Header 높이에 맞춤 */
}
</style>