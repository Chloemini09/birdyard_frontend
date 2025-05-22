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
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2>Welcome to Bird-Yard,<br />Where Birds Feel at Home, Right in Your Backyard.</h2>
            <router-link to="/about" class="about-link">
              Know More About Us
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

    <section class="process-section">
      <div class="process-header">
        <h2 class="process-title">Simple and Effective Journey</h2>
        <!-- <router-link to="/learninghub" class="process-link">How It Works</router-link> -->
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
            >Let's Find Plants For Your Garden
          </router-link>
        </div>
      </div>
    </section>

    <!-- Information Section (Vertical layout) -->
    <section class="info-section">
      <div class="container">
        <h2 id="info-title" class="info-title">START BUILDING YOUR GARDEN FOR BIRDS</h2>
        <p class="info-subtitle">Follow these steps to create your perfect bird garden</p>

        <div class="vertical-card-container">
          <!-- Step 1: Plant Information Card -->
          <div class="step-number-indicator">STEP 01</div>
          <div class="info-card">
            <router-link to="/plantadvice" class="card-image">
              <img src="@/assets/images/plant-importance.jpg" alt="Plant importance" />
              <div class="card-overlay">
                <h3>Plants: The Garden Foundation</h3>
                <p class="overlay-description">
                  Native plants form the backbone of your bird garden, providing food, shelter, and
                  nesting materials.
                </p>
                <div class="btn-container">
                  <span class="find-plants-btn">Pick Your Perfect Plants</span>
                </div>
              </div>
              <div class="hover-overlay"></div>
            </router-link>
          </div>

          <!-- Arrow indicator -->
          <div class="step-arrow">
            <div class="step-arrow">
              <img
                src="/arrow.png"
                alt="Arrow"
                width="40"
                height="40"
                class="green-arrow"
              />
            </div>
          </div>
          <!-- Step 2: Birds Information Card -->
          <div class="step-number-indicator">STEP 02</div>
          <div class="info-card">
            <router-link to="/gardenguide" class="card-image">
              <img src="@/assets/images/attracting-birds.jpg" alt="Attracting birds" />
              <div class="card-overlay">
                <h3>Attracting Birds with Plants</h3>
                <p class="overlay-description">
                  The right plant choices create a welcoming habitat for local birds while
                  supporting biodiversity.
                </p>
                <div class="btn-container">
                  <span class="find-plants-btn">Invite Birds To Your Garden</span>
                </div>
              </div>
              <div class="hover-overlay"></div>
            </router-link>
          </div>
        </div>
      </div>
    </section>
    <!-- stats -->
    <section class="stats-section">
      <p class="stats-section-intro" style="font-weight: bold; color: #2c5530;">Our Website Scope</p>
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
      <div class="next-steps">
        <div class="next-steps-content">
          <router-link to="/learninghub" class="btn btn-large"
            >Click For More Resources
          </router-link>
        </div>
      </div>
    </section>

    <!-- Grow in 4 Steps Section -->
    <section class="steps-section">
      <div class="container">
        <h2 class="steps-title">Grow in 4 Steps</h2>
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
  methods: {
    scrollToInfoSection(event) {
      event.preventDefault()
      const element = document.getElementById('info-title')
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - 150

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
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
  color: #0a3200;
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
  height: 500px;
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
  margin-bottom: 80px;
  margin-top: 20%;
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
  color: #5da56d;
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

/* Info Section Styles - MODIFIED VERSION */
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
  max-width: 800px;
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
  height: 500px;
  cursor: pointer;
  overflow: hidden;
  display: block; /* Added to make the router-link take full height */
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

/* Hover overlay for enhanced visual effect */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(10, 50, 0, 0);
  transition: background-color 0.4s ease;
  z-index: 1;
}

.card-image:hover .hover-overlay {
  background-color: rgba(10, 50, 0, 0.4);
}

.info-card:hover .card-image img {
  transform: scale(1.05);
}

/* Info Section Styles - VERTICAL LAYOUT */
.info-section {
  padding: 80px 0;
  background-color: #f9f9f9;
}

.info-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
  color: #0a3200;
}

.info-subtitle {
  font-size: 1.3rem;
  text-align: center;
  margin-bottom: 40px;
  color: #0a3200;
}

.vertical-card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px; /* Larger cards */
  margin: 0 auto;
}

.step-number-indicator {
  background-color: #0a3200;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 8px 20px;
  border-radius: 20px;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.info-card {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  margin-bottom: 20px;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.step-arrow {
  margin: 30px 0;
  display: flex;
  justify-content: center;
  opacity: 0.7;
}

.card-image {
  position: relative;
  height: 500px;
  cursor: pointer;
  overflow: hidden;
  display: block;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

/* Hover overlay for enhanced visual effect */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(10, 50, 0, 0);
  transition: background-color 0.4s ease;
  z-index: 1;
}

.card-image:hover .hover-overlay {
  background-color: rgba(10, 50, 0, 0.4);
}

.info-card:hover .card-image img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent 40%, rgba(10, 50, 0, 0.8));
  padding: 40px; /* More padding */
  color: white;
  transition: all 0.4s ease;
  z-index: 2;
  transform: translateY(0);
}

.card-overlay h3 {
  margin-bottom: 20px;
  font-size: 1.8rem; /* Larger title */
  font-weight: 600;
  transition: transform 0.4s ease;
}

.overlay-description {
  margin-bottom: 25px;
  font-size: 1.2rem; /* Larger text */
  line-height: 1.6;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.4s ease;
  max-width: 90%;
}

/* Container for centering the button */
.btn-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* New style for find plants button */
.find-plants-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #0a3200;
  background-color: rgba(194, 229, 156, 0.95);
  border-radius: 30px;
  padding: 15px 30px; /* Larger padding */
  font-size: 1.5rem; /* Larger font */
  transition: all 0.4s ease;
  cursor: pointer;
  opacity: 0;
  transform: translateY(50px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  width: 60%;
  text-align: center;
}

/* Hover effects for overlay content */
.card-image:hover .card-overlay {
  background: linear-gradient(transparent 30%, rgba(10, 50, 0, 0.95));
}

.card-image:hover .find-plants-btn {
  opacity: 1;
  transform: translateY(0);
}

.find-plants-btn:hover {
  background-color: white !important;
  transform: translateY(-5px) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4) !important;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .vertical-card-container {
    max-width: 90%;
  }
}

@media (max-width: 768px) {
  .card-image {
    height: 400px;
  }

  .card-overlay h3 {
    font-size: 1.6rem;
  }

  .overlay-description {
    font-size: 1.1rem;
  }

  .find-plants-btn {
    font-size: 1.3rem;
    padding: 12px 25px;
  }
}

.process-section {
  background-color: #184215;
  color: #f5f5dc;
  padding: 5rem 2rem;
  max-height: 820px;
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
  padding: 0.75rem 2rem;
  color: #0a3200;
  background-color: #c2e59c;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 2rem;
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
  text-decoration: underline;
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
  .green-arrow {
  filter: brightness(0) saturate(100%) invert(21%) sepia(82%) saturate(436%) hue-rotate(74deg) brightness(93%) contrast(108%);
  }
}

html {
  scroll-padding-top: 60px;
  scroll-behavior: smooth;
}
</style>
