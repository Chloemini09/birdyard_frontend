<template>
  <div class="contact-page-container">
    <!-- Banner Section -->
    <section class="contact-banner">
      <div class="banner-overlay">
        <h1 class="contact-title">LAYOUT</h1>
        <p class="contact-subtitle">We'd love to hear from you about birds in your backyard</p>
      </div>
    </section>
  </div>
</template>

<script></script>

<style scoped>
.contact-page-container {
  font-family: 'Arial', sans-serif;
  color: #333;
}

/* Banner Section */
.contact-banner {
  height: 40vh;
  min-height: 400px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../assets/images/Layout.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.banner-overlay {
  max-width: 800px;
  padding: 0 20px;
}

.contact-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #f3f9c0;
}

.contact-subtitle {
  font-size: 1.2rem;
  color: #fff;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .contact-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .contact-title {
    font-size: 2rem;
  }

  .contact-subtitle {
    font-size: 1rem;
  }

  .contact-banner {
    min-height: 250px;
  }
}
</style>
