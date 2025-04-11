<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">WHERE PLANTS TAKE ROOTS,<br />BIRDS FIND HOME.</h1>
        <p class="hero-subtitle">
          We help you fight habitat loss due to climate change.<br />
          Together, we'll transform your garden into a vibrant sanctuary<br />
          where birds thrive and nature flourishes.
        </p>
        <div class="hero-buttons">
          <p class="hero-subtitle"></p>
          <p class="hero-cta">Wanna Start your journey?</p>
          <a href="#info-title" class="btn hero-cta-btn">Let's build your garden</a>
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
    <section class="info-section">
      <div class="container">
        <h2 id="info-title" class="info-title">Discover Garden Wisdom</h2>
        <p class="info-subtitle">Click "learn more" on picture to see details.</p>

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
              <button class="info-panel-close" @click="closePlantInfo">&times;</button>
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
              <button class="info-panel-close" @click="closeBirdInfo">&times;</button>
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
    <section class="process-section">
      <div class="process-header">
        <h2 class="process-title">Simple and Effective Journey</h2>
        <a href="/how-it-works" class="process-link">How It Works</a>
      </div>

      <div class="process-steps">
        <div class="process-step">
          <div class="step-image">
            <!-- SVG or image for finding plants -->
            <img src="@/assets/images/find-plants-icon.webp" alt="Find plants illustration" />
          </div>
          <div class="step-number">01</div>
          <h3 class="step-title">Find Native Plants</h3>
          <p class="step-description">
            Discover plants native to your region that support local bird species and thrive in your
            climate.
          </p>
        </div>

        <div class="process-step">
          <div class="step-image">
            <!-- SVG or image for garden design -->
            <img src="@/assets/images/design-garden-icon.png" alt="Design garden illustration" />
          </div>
          <div class="step-number">02</div>
          <h3 class="step-title">Design Your Garden</h3>
          <p class="step-description">
            Create a beautiful, functional garden plan that incorporates bird-friendly elements and
            native plants.
          </p>
        </div>

        <div class="process-step">
          <div class="step-image">
            <!-- SVG or image for attracting birds -->
            <img src="@/assets/images/attract-birds-icon.webp" alt="Birds in garden illustration" />
          </div>
          <div class="step-number">03</div>
          <h3 class="step-title">Attract Local Birds</h3>
          <p class="step-description">
            Watch as your garden becomes a haven for local birds, providing food, shelter, and
            nesting sites.
          </p>
        </div>

        <div class="process-step">
          <div class="step-image">
            <!-- SVG or image for identifying birds -->
            <img
              src="@/assets/images/identify-birds-icon.webp"
              alt="Bird identification illustration"
            />
          </div>
          <div class="step-number">04</div>
          <h3 class="step-title">Identify & Protect Birds</h3>
          <p class="step-description">
            Learn to identify visiting birds and contribute to conservation efforts, especially for
            endangered species.
          </p>
        </div>
      </div>

      <div class="next-steps">
        <h3 class="next-steps-title">Ready to begin your journey?</h3>
        <div class="next-steps-content">
          <router-link to="/plantadvice" class="btn btn-large"
            >Let's Find Plants for your Garden
          </router-link>
        </div>
      </div>
    </section>
    <!-- stats -->
    <section class="stats-section">
      <p class="stats-section-intro">Our Website Scope</p>
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-number">27</div>
          <div class="stat-label">Endangered Bird Species</div>
        </div>

        <div class="stat-item">
          <div class="stat-number">312</div>
          <div class="stat-label">Native Plants</div>
        </div>

        <div class="stat-item">
          <div class="stat-number">33</div>
          <div class="stat-label">Cities</div>
        </div>

        <div class="stat-item">
          <div class="stat-number">89%</div>
          <div class="stat-label">Habitat Growth</div>
        </div>
      </div>
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
  methods: {
    closePlantInfo() {
      this.showPlantInfo = false
    },
    closeBirdInfo() {
      this.showBirdInfo = false
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    },
  },
  mounted() {
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1)
      this.$nextTick(() => {
        const element = document.getElementById(targetId)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' })
          }, 500)
        }
      })
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
  padding: 0 20px;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 800;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-primary {
  background-color: rgba(194, 229, 156, 0.8);
  color: #0a3200;
  border: 2px solid #c2e59c;
}
.hero-cta-btn {
  background-color: rgba(194, 229, 156, 0.8);
  color: #0a3200;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border: 2px solid #c2e59c;
  transition: all 0.3s ease;
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
  height: 80vh;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/images/homepage.jpeg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 10px;
}
.hero-cta {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #ffffff;
  text-align: center;
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
  margin-top: 50px;
}

/* stats Section */
.stats-section {
  text-align: center;
  background-color: #f9f7f0;
}
.stats-section-intro {
  font-size: 2.3rem;
  padding: 1rem 4rem;
  width: 100%;
}
.stats-section {
  gap: 2rem;
  padding: 4rem 2rem;
}

.stats-container {
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  padding: 0 1rem;
  flex: 1;
  min-width: 200px;
}

.stat-number {
  font-size: 4.5rem;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.stat-label {
  font-size: 1.25rem;
  color: #2c5530;
  font-weight: 500;
}

@media (max-width: 768px) {
  .stats-container {
    flex-direction: column;
    gap: 2.5rem;
  }

  .stat-item {
    min-width: unset;
  }
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
  max-width: 1000px;
  margin: 0 auto;
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

/* Info Section Styles - IMPROVED VERSION */
.info-section {
  padding: 50px 0;
  background-color: #f9f9f9;
}

.info-title {
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 20px;
  color: #0a3200;
}
.info-subtitle {
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 20px;
  color: #0a3200;
}

.info-card-container {
  display: flex;
  margin-bottom: 80px;
  align-items: flex-start;
  gap: 40px;
}

.birds-container {
  flex-direction: row-reverse;
}

.info-card {
  flex: 0 0 50%;
  max-width: 580px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 580px;
  cursor: pointer;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.info-card:hover .card-image img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(10, 50, 0, 0.8));
  padding: 25px;
  color: white;
  transition: background 0.3s ease;
}

.card-overlay h3 {
  margin-bottom: 10px;
  font-size: 1.5rem;
  font-weight: 600;
}

.learn-more {
  display: inline-flex;
  align-items: center;
  font-weight: 700;
  color: white;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.learn-more::after {
  content: '+';
  display: inline-block;
  margin-left: 8px;
  font-size: 16px;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.card-image:hover .learn-more {
  background-color: white;
  color: #0a3200;
}

.card-image:hover .learn-more::after {
  transform: translateX(3px);
}

.card-image:hover .card-overlay {
  background: linear-gradient(transparent, rgba(10, 50, 0, 0.9));
}

.card-image:hover .learn-more {
  transform: translateX(5px);
}

.card-image:hover .learn-more::after {
  transform: rotate(90deg);
}

/* Info Panel Styles */
.info-panel {
  flex: 1;
  background-color: #f0f0f0;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  border-left: 4px solid #c2e59c;
}

.info-panel-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 32px;
  height: 32px;
  background: rgba(10, 50, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  color: #0a3200;
  font-size: 22px;
}

.info-panel-close:hover {
  background: rgba(10, 50, 0, 0.2);
  transform: rotate(90deg);
}

.info-panel h3 {
  color: #0a3200;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.4rem;
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
  padding-left: 20px;
}

.info-panel li {
  margin-bottom: 12px;
  line-height: 1.6;
}

.info-link {
  display: inline-block;
  margin-top: 15px;
  color: #0a3200;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 2px solid #c2e59c;
  padding-bottom: 2px;
  transition: all 0.3s ease;
}

.info-link:hover {
  color: #4a7d32;
  transform: translateX(5px);
}

/* Transition Animation */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.process-section {
  background-color: #0a2601;
  color: #f5f5dc;
  padding: 5rem 2rem;
}

.process-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
}

.process-title {
  font-size: 3rem;
  color: #f5f5dc;
  font-weight: 600;
}

.process-link {
  border: 1px solid #f5f5dc;
  padding: 0.75rem 1.5rem;
  color: #f5f5dc;
  text-decoration: none;
  transition: all 0.3s ease;
}

.process-link:hover {
  background-color: #f5f5dc;
  color: #0a2601;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
}

@media (max-width: 992px) {
  .process-steps {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .process-steps {
    grid-template-columns: 1fr;
  }
}

.process-step {
  display: flex;
  flex-direction: column;
}

.step-image {
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}

.step-image img {
  max-width: 100%;
  max-height: 100%;
}

.step-number {
  font-size: 2rem;
  font-weight: 700;
  color: #f5f5dc;
  margin-bottom: 0.5rem;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #f5f5dc;
}

.step-description {
  font-size: 1rem;
  line-height: 1.6;
}

.next-steps {
  margin-top: 4rem;
  text-align: center;
}

.next-steps-title {
  font-size: 1.75rem;
  margin-bottom: 2rem;
  color: #f5f5dc;
}

.next-steps-content {
  min-height: 100px;
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

  .info-card {
    width: 90%;
    height: auto;
  }

  .card-image {
    height: 350px;
  }

  .info-panel {
    width: 90%;
    padding: 25px 20px;
  }
}
html {
  scroll-padding-top: 80px;
  scroll-behavior: smooth;
}
</style>
