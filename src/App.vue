<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
#app {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}

@media (min-width: 1024px) {
  body {
    display: block;
  }

  #app {
    display: block;
    grid-template-columns: unset;
    padding: 0;
  }
}
</style>