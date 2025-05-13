<template>
  <section
    class="hero-section"
    :class="{ scrolled: isShrunk }"
    :style="{ transform: `scale(${scale})` }"
  >
    <div class="container hero-container">
      <div class="hero-text">
        <h1>오늘 나랑 같이 갈래?</h1>
        <p>여행을 함께,</p>
        <p>travice</p>
      </div>
      <div class="mascot-container">
        <img src="@/assets/images/mascot.png" alt="Travice 마스코트" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
  props: {
    isShrunk: { type: Boolean, default: false },
    scale:    { type: Number,  default: 1 }
  }
};
</script>

<style scoped>
.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;

  height: calc(100vh - 60px);
  width: 100%;
  background-color: var(--primary-mint);
  /*overflow: hidden;*/
  padding: 20px 0;

  transform-origin: top center;
  /* 속도를 좀 더 천천히: 1.2s */
  transition: transform 1.2s ease, border-radius 1.2s ease;
}

.hero-section.scrolled {
  border-radius: 20px;
}

.hero-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
}

.hero-text {
  max-width: 600px;
}
.hero-text h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
}
.hero-text p {
  font-size: 24px;
  margin: 4px 0;
}

.mascot-container {
  width: 200px;
  height: 200px;
  position: relative;
}
.mascot-container img {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  object-fit: contain;
}
</style>