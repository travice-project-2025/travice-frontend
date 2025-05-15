<!-- src/App.vue -->
<template>
  <div id="app">
    <AppHeader v-if="!$route.meta?.hideHeader" :is-shrunk="isHeaderShrunk" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AppHeader from './components/common/AppHeader.vue';

export default {
  name: 'App',
  components: {
    AppHeader
  },
  setup() {
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

    return {
      isHeaderShrunk
    };
  }
}
</script>

<style>
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