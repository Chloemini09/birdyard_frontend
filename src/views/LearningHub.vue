<template>
  <div class="eco-learning-container">
    <!-- Header Banner -->
    <div class="banner">
      <h1 class="banner-title">ECO-LEARNING HUB</h1>
      <p class="banner-subtitle">Welcome to the Garden Learning Hub</p>
      <p class="banner-subtitle">
        Our go-to spot for simple, practical tips to grow, care for, and enjoy your garden.
      </p>
      <p class="banner-subtitle">Whether you're just starting or already green-thumbed, dig in and grow with us!</p>
    </div>

    <!-- Information Section with Modal Popups -->
    <section class="info-section">
      <div class="container">
        <h2 id="info-title" class="info-title">START YOUR LEARNING TRIP</h2>
        <p class="info-subtitle">
          Click "<span class="highlight">Start Trip</span>" to see details.
        </p>

        <!-- Plant intro Card -->
        <div id="info-title1" class="info-card-container">
          <div class="info-card">
            <div class="card-image" @click="$router.push('/birdlearning')">
              <img src="@/assets/images/BirdLearningPic.webp" alt="Bird Learning Hub" />
              <div class="card-overlay">
                <h3>Bird Learning Hub</h3>
                <span class="learn-more">Start Trip</span>
              </div>
            </div>
          </div>

          <transition name="fade">
            <div v-if="true" class="info-panel">
              <p class="info-h-size">Bird Learning Hub - Your Gateway to Australia's Avian World</p>
              <p class="info-p-size">
                Clicking the image will take you to a dedicated webpage full of informative articles
                and engaging videos about Australia's unique bird species. This hub is designed to
                help users and bird enthusiasts learn more about bird conservation efforts, Whether
                you're a beginner or a passionate birdwatcher, the Bird Learning Hub is the perfect
                place to build your knowledge
              </p>
            </div>
          </transition>
        </div>

        <!-- Birds intro Card -->
        <div id="info-title2" class="info-card-container birds-container">
          <div class="info-card">
            <div class="card-image" @click="$router.push('/gardenlearning')">
              <img src="@/assets/images/GardenLearningHub.jpg" alt="Garden Learning Hub" />
              <div class="card-overlay">
                <h3>Garden Learning Hub</h3>
                <span class="learn-more">Start Trip</span>
              </div>
            </div>
          </div>

          <transition name="fade">
            <div v-if="true" class="info-panel">
              <p class="info-h-size">
                Garden Learning Hub - Learn Why And How to Built Your Bird-friendly Gardens
              </p>
              <p class="info-p-size">
                Click to access a collection of articles and videos that explore the importance of
                bird-friendly gardens in supporting native bird populations. This hub focuses on
                expanding your knowledge and raising awareness of how thoughtful garden design can
                contribute to bird conservation in Australia.
              </p>
            </div>
          </transition>
        </div>
        <!-- QUIZ intro Card -->
        <div id="info-title3" class="info-card-container">
          <div class="info-card">
            <div class="card-image" @click="$router.push('/quiz')">
              <img src="@/assets/images/quiz1.jpg" alt="QUIZ" />
              <div class="card-overlay">
                <h3>QUIZ Hub</h3>
                <span class="learn-more">Start Trip</span>
              </div>
            </div>
          </div>

          <transition name="fade">
            <div v-if="true" class="info-panel">
              <p class="info-h-size">
                Quiz Hub - Learn Why And How to Built Your Bird-friendly Gardens
              </p>
              <p class="info-p-size">
                Click to access a collection of articles and videos that explore the importance of
                bird-friendly gardens in supporting native bird populations. This hub focuses on
                expanding your knowledge and raising awareness of how thoughtful garden design can
                contribute to bird conservation in Australia.
              </p>
            </div>
          </transition>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  methods: {
    scrollToInfoSection1() {
      const element = document.getElementById('info-title1')
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - 250

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      }
    },
    scrollToInfoSection2() {
      const element = document.getElementById('info-title2')
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - 250

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      }
    },
    scrollToInfoSection3() {
      const element = document.getElementById('info-title3')
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - 250

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      }
    },
  },
}
</script>

<style scoped>
/* Global styles homepage */
.container {
  max-width: 1200px;
  top: 0;
  margin: 0 auto;
  padding: 0 20px;
}

/* Global styles matching your existing site */
.eco-learning-container {
  background-color: #f9f7f0;
  width: 100%;
  min-height: 100vh;
  font-family: Arial, sans-serif;
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

/* Banner styles */
.banner {
  background-image:
    linear-gradient(rgba(0, 50, 0, 0.8), rgba(0, 50, 0, 0.6)), url('@/assets/images/darkgarden.jpg');
  background-size: cover;
  background-position: center;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 40px;
}

.banner-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.banner-subtitle {
  font-size: 1.2rem;
}

/* Simple and Effective Journey */

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

/* Info Section Styles */
.info-h-size {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
}

.info-p-size {
  font-size: 1.5rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.info-section {
  padding: 50px 0;
  background-color: #f9f7f0;
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

.highlight {
  font-weight: bold;
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
  max-width: 500px;
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
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
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
</style>
