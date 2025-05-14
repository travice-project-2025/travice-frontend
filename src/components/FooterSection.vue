<script setup>
// 푸터 컴포넌트는 특별한 스크립트 로직이 필요 없습니다
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-logo">
        <img src="/src/assets/logo.png" alt="TRAVICE" class="logo-image-small" />
        <span class="logo-text">TRAVICE</span>
      </div>
      <div class="footer-links">
        <div class="footer-column">
          <h4>서비스</h4>
          <a href="#">이용방법</a>
          <a href="#">앱 다운로드</a>
          <a href="#">멤버십</a>
        </div>
        <div class="footer-column">
          <h4>회사</h4>
          <a href="#">소개</a>
          <a href="#">채용</a>
          <a href="#">문의</a>
        </div>
        <div class="footer-column">
          <h4>고객지원</h4>
          <a href="#">자주 묻는 질문</a>
          <a href="#">고객센터</a>
          <a href="#">건의하기</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="copyright">© 2025 TRAVICE. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
/* 푸터 스타일 */
.footer {
  background-color: #fff;
  padding: 4rem 4rem 2rem;
  border-top: 1px solid #eee;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.logo-image-small {
  width: 24px;
  height: 24px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.footer-links {
  display: flex;
  gap: 4rem;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.footer-column h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.footer-column a {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.footer-column a:hover {
  color: #6231cb;
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.copyright {
  color: #999;
  font-size: 0.9rem;
}

/* 반응형 스타일 */
@media (max-width: 1024px) {
  .footer {
    padding: 3rem 2rem 1.5rem;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 2rem;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 2rem;
  }
}
</style>