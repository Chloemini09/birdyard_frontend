<template>
  <div class="contact-page-container">
    <!-- Banner Section -->
    <section class="contact-banner">
      <div class="banner-overlay">
        <h1 class="contact-title">LAYOUT</h1>
        <p class="contact-subtitle">We'd love to hear from you about birds in your backyard</p>
      </div>
    </section>

    <!-- Contact Info Section -->
    <section class="contact-info-section">
      <div class="contact-grid">
        <!-- Contact Card - Email -->
        <div class="contact-card">
          <div class="contact-icon">
            <img src="../assets/images/email-icon.png" alt="Email" class="icon-image" />
          </div>
          <h3 class="contact-card-title">Email Us</h3>
          <p class="contact-text">For general inquiries and support:</p>
          <a href="mailto:hello@birdyard.com" class="contact-link">hello@birdyard.com</a>
          <p class="contact-text">For partnership opportunities:</p>
          <a href="mailto:partners@birdyard.com" class="contact-link">partners@birdyard.com</a>
        </div>

        <!-- Contact Card - Phone -->
        <div class="contact-card">
          <div class="contact-icon">
            <img src="../assets/images/phone-icon.png" alt="Phone" class="icon-image" />
          </div>
          <h3 class="contact-card-title">Call Us</h3>
          <p class="contact-text">Customer Support:</p>
          <a href="tel:+61234567890" class="contact-link">+61 2 3456 7890</a>
          <p class="contact-text">Hours: Monday - Friday, 9am - 5pm AEST</p>
        </div>

        <!-- Contact Card - Social Media -->
        <div class="contact-card">
          <div class="contact-icon">
            <img src="../assets/images/social-icon.png" alt="Social Media" class="icon-image" />
          </div>
          <h3 class="contact-card-title">Follow Us</h3>
          <div class="social-links">
            <a href="https://instagram.com/" target="_blank" class="social-link">
              <img src="../assets/images/Inslogo.webp" alt="Instagram" class="social-icon" />
            </a>
            <a href="https://facebook.com/" target="_blank" class="social-link">
              <img src="../assets/images/facebook-icon.webp" alt="Facebook" class="social-icon" />
            </a>
            <a href="https://twitter.com/" target="_blank" class="social-link">
              <img src="../assets/images/twitter-icon.png" alt="Twitter" class="social-icon" />
            </a>
          </div>
          <p class="contact-text">Join our community of bird enthusiasts!</p>
        </div>

        <!-- Contact Card - Location -->
        <div class="contact-card">
          <div class="contact-icon">
            <img src="../assets/images/location-icon.png" alt="Location" class="icon-image" />
          </div>
          <h3 class="contact-card-title">Visit Us</h3>
          <p class="contact-text">BirdYard Headquarters</p>
          <p class="contact-text">123 Nature Street</p>
          <p class="contact-text">Sydney, NSW 2000</p>
          <p class="contact-text">Australia</p>
        </div>
      </div>
    </section>

    <!-- Conservation Partners Section -->
    <section class="partners-section">
      <h2 class="section-title">Our Conservation Partners</h2>
      <div class="partners-grid">
        <div class="partner-item">
          <img src="../assets/images/partner1.png" alt="BirdLife Australia" class="partner-logo" />
        </div>
        <div class="partner-item">
          <img src="../assets/images/partner2.png" alt="World Wildlife Fund" class="partner-logo" />
        </div>
        <div class="partner-item">
          <img
            src="../assets/images/partner3.png"
            alt="Conservation Australia"
            class="partner-logo"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ContactPage',
}
</script>

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
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../assets/images/homepage.jpeg');
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

/* Contact Info Section */
.contact-info-section {
  padding: 80px 5%;
  background-color: #f8f9fa;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.contact-icon {
  margin-bottom: 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-image {
  height: 50px;
  width: 50px;
}

.contact-card-title {
  font-size: 1.5rem;
  color: #1a2d00;
  margin-bottom: 15px;
}

.contact-text {
  margin: 8px 0;
  color: #555;
}

.contact-link {
  display: block;
  color: #1a2d00;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 15px;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #92ab6e;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: #f3f9c0;
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: #1a2d00;
}

.social-icon {
  height: 20px;
  width: 20px;
}

/* Partners Section */
.partners-section {
  padding: 60px 5%;
  background-color: #fff;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  color: #1a2d00;
  margin-bottom: 40px;
}

.partners-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
}

.partner-item {
  flex-basis: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.partner-logo {
  max-width: 100%;
  height: auto;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.partner-logo:hover {
  opacity: 1;
}
/* Responsive Design */
@media (max-width: 768px) {
  .contact-title {
    font-size: 2.5rem;
  }

  .contact-info-section {
    padding: 50px 5%;
  }

  .partners-grid {
    gap: 20px;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-input,
  .newsletter-button {
    width: 100%;
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
