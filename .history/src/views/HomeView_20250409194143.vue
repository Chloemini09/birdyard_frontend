<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">WHERE PLANTS TAKE ROOTS,<br />BIRDS FIND HOME.</h1>
        <p class="hero-subtitle">
          "Bird Yard helps you build a safe, healthy, bird-friendly backyard — a true home for
          birds."
        </p>
        <div class="hero-buttons">
          <router-link to="/contact" class="btn btn-primary">Get In Touch</router-link>
          <router-link to="/about" class="btn btn-secondary">Who We Are</router-link>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2>Welcome to Bird-Yard,<br />Where Birds Feel at Home, Right in Your Backyard.</h2>
            <router-link to="/about" class="about-link">
              About Us
              <span class="arrow">→</span>
            </router-link>
          </div>
          <div class="about-description">
            <p>
              Established with a love for nature and a mission to protect what sings in our skies,
              Bird-Yard helps people transform everyday backyards into thriving bird habitats. We're
              dedicated to guiding you in cultivating gardens that are not only beautiful, but safe,
              sustainable sanctuaries for local wildlife. From native plant recommendations to
              habitat-friendly landscaping tips, Bird-Yard is your partner in preserving
              biodiversity—one backyard at a time.
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- Information Section with Modal Popups -->
    <!-- Information Section with Modal Popups -->
    <section class="info-section">
      <div class="container">
        <h2 class="info-title">Discover Garden Wisdom</h2>

        <!-- Plant Information Card -->
        <div class="info-card-container">
          <div class="info-card">
            <div class="card-image" @click="showPlantInfo = !showPlantInfo">
              <img src="@/assets/images/plant-importance.jpg" alt="Plant importance" />
              <div class="card-overlay">
                <h3>Plants: The Garden Foundation</h3>
                <span class="learn-more">Learn More</span>
              </div>
            </div>
          </div>

          <transition name="fade">
            <div class="info-panel" v-if="showPlantInfo">
              <h3>Building a Thriving Ecosystem</h3>
              <p>Plants are the foundation of every healthy garden ecosystem. They provide:</p>
              <ul>
                <li>
                  <strong>Oxygen production:</strong> Plants release oxygen and absorb carbon
                  dioxide, improving air quality.
                </li>
                <li>
                  <strong>Soil health:</strong> Root systems prevent erosion and add organic matter
                  to soil.
                </li>
                <li>
                  <strong>Water filtration:</strong> Plants help filter rainwater, reducing runoff
                  and pollution.
                </li>
                <li>
                  <strong>Biodiversity:</strong> Native plants support local insects, which are
                  essential food for birds.
                </li>
                <li>
                  <strong>Climate regulation:</strong> Gardens help cool urban areas and reduce the
                  heat island effect.
                </li>
              </ul>

              <h3>Choosing the Right Plants</h3>
              <p>
                Native plants are always the best choice for a bird-friendly garden. They've evolved
                alongside local wildlife for thousands of years, providing the perfect food sources,
                shelter, and nesting materials.
              </p>

              <router-link to="/plantadvice" class="info-link"
                >Get Plant Recommendations →</router-link
              >
            </div>
          </transition>
        </div>

        <!-- Birds Information Card -->
        <div class="info-card-container birds-container">
          <div class="info-card">
            <div class="card-image" @click="showBirdInfo = !showBirdInfo">
              <img src="@/assets/images/attracting-birds.jpg" alt="Attracting birds" />
              <div class="card-overlay">
                <h3>Attracting Birds with Plants</h3>
                <span class="learn-more">Learn More</span>
              </div>
            </div>
          </div>

          <transition name="fade">
            <div class="info-panel" v-if="showBirdInfo">
              <h3>Creating a Bird Haven</h3>
              <p>
                Birds need four essential things from your garden: food, water, shelter, and nesting
                sites. The right plants can provide most of these needs!
              </p>

              <h3>Food Sources</h3>
              <ul>
                <li>
                  <strong>Berry-producing shrubs:</strong> Elderberry, serviceberry, and dogwood
                  provide seasonal fruits.
                </li>
                <li>
                  <strong>Seed-bearing flowers:</strong> Coneflowers, sunflowers, and black-eyed
                  Susans offer winter food.
                </li>
                <li>
                  <strong>Host plants for insects:</strong> Oak, willow, and native perennials
                  support caterpillars and bugs that birds feed to their young.
                </li>
              </ul>

              <h3>Shelter & Nesting</h3>
              <ul>
                <li>
                  <strong>Evergreen trees and shrubs:</strong> Provide year-round protection from
                  predators and weather.
                </li>
                <li>
                  <strong>Dense thickets:</strong> Create safe spaces for small birds to hide and
                  nest.
                </li>
                <li>
                  <strong>Varying heights:</strong> Different bird species prefer nesting at
                  different levels.
                </li>
              </ul>

              <router-link to="/bird" class="info-link">Explore Bird Species →</router-link>
            </div>
          </transition>
        </div>
      </div>
    </section>
    <!-- Call to Action -->
    <section class="cta-section">
      <router-link to="/plantadvice" class="btn btn-large">Let's Build Your Backyard</router-link>
    </section>
    <!-- Grow in 4 Steps Section -->
    <section class="steps-section">
      <div class="container">
        <h2 class="steps-title">"Grow in 4 Steps:"</h2>
        <div class="steps-container">
          <!-- Step 1 -->
          <div class="step">
            <h3>01. Plan with Purpose:</h3>
            <ul>
              <li>Observe sunlight, shade, and wind direction.</li>
              <li>Choose native plants suited to your climate and soil.</li>
              <li>Design layers: trees, shrubs, ground-covers.</li>
            </ul>
          </div>

          <!-- Step 2 -->
          <div class="step">
            <h3>02. Prepare the Ground:</h3>
            <ul>
              <li>Clear weeds and debris (ditch those invasives).</li>
              <li>Improve soil with compost or organic matter.</li>
              <li>Lay mulch to retain moisture and suppress weeds.</li>
            </ul>
          </div>

          <!-- Step 3 -->
          <div class="step">
            <h3>03. Plant & Position:</h3>
            <ul>
              <li>Group plants with similar water/light needs.</li>
              <li>Space properly—plants grow more than you think!</li>
              <li>Add habitat boosters: rocks, logs, bird baths, and nesting boxes.</li>
            </ul>
          </div>

          <!-- Step 4 -->
          <div class="step">
            <h3>04. Maintain with Care:</h3>
            <ul>
              <li>Water consistently, especially in the early weeks.</li>
              <li>Prune gently and seasonally.</li>
              <li>Re-mulch every few months.</li>
              <li>Avoid chemicals—let nature handle pests.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomePage',
  data() {
    return {
      showPlantInfo: false,
      showBirdInfo: false,
    }
  },
})
</script>

<style scoped>
/* Global styles */
.container {
  max-width: 1200px;
  top: 0;
  margin: 0 auto;
  padding: 0 auto;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-primary {
  background-color: rgba(194, 229, 156, 0.8);
  color: #0a3200;
  border: 2px solid #c2e59c;
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.6);
  margin-left: 15px;
}

.btn-large {
  padding: 15px 30px;
  font-size: 18px;
  background-color: rgba(194, 229, 156, 0.9);
  color: #0a3200;
  border: 2px solid #c2e59c;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Hero Section */
.hero {
  height: 100vh;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/images/homepage.jpeg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;
}

.hero-content {
  max-width: 900px;
}

.hero-title {
  font-size: 3.5rem;
  color: #ffffff;
  margin-bottom: 20px;
  line-height: 1.2;
  font-weight: bold;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: #ffffff;
  margin-bottom: 40px;
  line-height: 1.5;
}

.hero-buttons {
  margin-top: 30px;
}

/* CTA Section */
.cta-section {
  padding: 40px 0;
  text-align: center;
  background-color: #f9f9f9;
}

/* About Section */
.about-section {
  padding: 80px 0;
  background-color: #ffffff;
}

.about-content {
  display: flex;
  gap: 60px;
}

.about-text {
  flex: 1;
}

.about-text h2 {
  font-size: 2.2rem;
  color: #0a3200;
  line-height: 1.3;
  margin-bottom: 30px;
}

.about-description {
  flex: 1;
}

.about-description p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
}

.about-link {
  display: inline-flex;
  align-items: center;
  color: #0a3200;
  font-weight: 600;
  text-decoration: none;
  font-size: 1.1rem;
}

.about-link .arrow {
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.about-link:hover .arrow {
  transform: translateX(5px);
}

/* Steps Section */
.steps-section {
  padding: 80px 0;
  background-color: #0a3200;
  color: #ffffff;
}

.steps-title {
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 60px;
  color: #c2e59c;
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
}

.step h3 {
  color: #c2e59c;
  font-size: 1.4rem;
  margin-bottom: 20px;
}

.step ul {
  list-style-type: disc;
  padding-left: 20px;
}

.step li {
  margin-bottom: 10px;
  line-height: 1.6;
}
/* Info Section Styles */
/* Info Section Styles */
.info-section {
  padding: 80px 0;
  background-color: #f9f9f9;
}

.info-title {
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 50px;
  color: #0a3200;
}

.info-card-container {
  display: flex;
  margin-bottom: 80px;
  align-items: flex-start;
  gap: 40px;
  width: 1580px;
}

.birds-container {
  flex-direction: row-reverse;
}

.info-card {
  flex: 0 0 50%;
  max-width: 550px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 580px;
  width: 580px;
  cursor: pointer;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(10, 50, 0, 0.8));
  padding: 20px;
  color: white;
  transition: background 0.3s ease;
}

.card-overlay h3 {
  margin-bottom: 8px;
  font-size: 1.4rem;
}

.learn-more {
  display: inline-block;
  font-weight: 600;
  border-bottom: 2px solid #c2e59c;
  padding-bottom: 2px;
  transition: transform 0.3s ease;
}

.card-image:hover .card-overlay {
  background: linear-gradient(transparent, rgba(10, 50, 0, 0.9));
}

.card-image:hover .learn-more {
  transform: translateX(5px);
}

/* Info Panel Styles */
.info-panel {
  flex: 1;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.info-panel h3 {
  color: #0a3200;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.info-panel h3:not(:first-child) {
  margin-top: 25px;
}

.info-panel p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.info-panel ul {
  margin-bottom: 20px;
}

.info-panel li {
  margin-bottom: 10px;
  line-height: 1.6;
}

.info-link {
  display: inline-block;
  margin-top: 10px;
  color: #0a3200;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 2px solid #c2e59c;
  transition: all 0.3s ease;
}

.info-link:hover {
  color: #4a7d32;
  transform: translateX(5px);
}

/* Transition Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 101;
}

.modal-container {
  position: relative;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  background-color: white;
  border-radius: 8px;
  overflow-y: auto;
  z-index: 102;
}

.modal-side-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 30%;
  height: 100vh;
  background-color: white;
  overflow-y: auto;
  z-index: 102;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  position: relative;
}

.modal-header h2 {
  color: #0a3200;
  margin: 0;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 30px;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
}

.modal-content {
  padding: 0;
}

.modal-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.modal-text {
  padding: 30px;
}

.modal-text h3 {
  color: #0a3200;
  margin-top: 25px;
  margin-bottom: 15px;
}

.modal-text ul {
  margin-bottom: 25px;
}

.modal-text li {
  margin-bottom: 10px;
  line-height: 1.6;
}

.modal-link {
  display: inline-block;
  margin-top: 20px;
  color: #0a3200;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 2px solid #c2e59c;
  transition: all 0.3s ease;
}

.modal-link:hover {
  color: #4a7d32;
  transform: translateX(5px);
}

/* Transition Animation */
.slide-right-enter-active {
  transition: all 0.3s ease;
}

.slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.5, 0, 0.7, 1);
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .info-card-container {
    flex-direction: column;
    align-items: center;
  }

  .birds-container {
    flex-direction: column;
  }

  .info-card {
    flex: none;
    width: 100%;
    max-width: 500px;
  }

  .info-panel {
    width: 100%;
    max-width: 500px;
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .info-card {
    width: 90%;
  }

  .info-panel {
    width: 90%;
    padding: 20px;
  }
}
/* Responsive Design */
@media (max-width: 992px) {
  .about-content {
    flex-direction: column;
    gap: 30px;
  }

  .steps-container {
    grid-template-columns: 1fr;
  }

  .footer-columns {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .btn-secondary {
    margin-left: 0;
    margin-top: 15px;
  }

  .hero-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .about-text h2 {
    font-size: 1.8rem;
  }

  .footer-columns {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 768px) {
  .info-cards {
    flex-direction: column;
    align-items: center;
  }

  .info-card {
    width: 100%;
  }

  .modal-content {
    flex-direction: column;
  }

  .modal-image {
    height: 200px;
  }
}
</style>
