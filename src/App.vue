<!-- src/App.vue -->
<template>
  <router-view />
</template>

<script>
import { onMounted } from 'vue';
export default {
  name: 'App',
  setup() {
    onMounted(() => {
      console.log("웹이 마운트되었습니다.")
    })
  }
}
</script>

<style>
#app {
  font-family: 'Marines', 'Pretendard', 'Noto Sans KR', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}
</style>