<template>
  <div class="Bird-learning-container">
    <!-- Header Banner -->
    <div class="banner">
      <h1 class="banner-title">GARDEN-LEARNING HUB</h1>
      <p class="banner-subtitle">READ ARTICLES AND WATCH VEDIOS</p>
      <p class="banner-subtitle">LEARN ABOUT BIRD FRIENDLY GARDEN</p>
      <p class="banner-subtitle">ENJOY YOUR LEARNING JOURNEY!</p>
    </div>
    <!-- Information Section with Modal Popups About Garden Article -->
    <section class="info-section">
      <div class="container">
        <h2 id="info-title" class="info-title">GARDEN-LEARNING ARTICLE</h2>
        <p class="info-subtitle">Click "learn more" or picture to see details.</p>

        <!-- article 1 -->
        <div class="info-card-container">
          <div class="info-card">
            <div class="card-image" @click="openExternalLink1">
              <img src="@/assets/images/garden-article1.png" alt="garden article 1" />
              <div class="card-overlay">
                <h3>Attracting Birds to your Garden</h3>
                <span class="learn-more">Learn More</span>
              </div>
            </div>
          </div>

          <transition name="fade">
            <div class="info-panel">
              <h1>Attracting Birds to your Garden</h1>
              <h3>Abstract</h3>
              <p>
                The article “Attracting Birds to Your Garden” from the Sustainable Gardening
                Australia (SGA) website offers practical advice on how to create a bird-friendly
                garden using sustainable methods. It encourages planting native flowering shrubs,
                fruiting trees, grasses, and insect-attracting plants to provide natural food
                sources for birds. The article also highlights the importance of supplying clean
                water through shallow dishes or birdbaths, and creating safe shelter and nesting
                opportunities with a variety of plant heights and structures. It advises against
                using pesticides and fertilizers to protect both birds and their insect food
                sources. Additional tips include deterring cats, providing branch piles for cover,
                and minimizing window strikes. Overall, the guide emphasizes that supporting
                birdlife in gardens not only enhances biodiversity but also brings joy and
                ecological value to the gardening experience.
              </p>
              <h3>Reference</h3>
              <cite>
                Sustainable Gardening Australia. (n.d.). Attracting birds to your garden. Retrieved
                May 1, 2025, from https://www.sgaonline.org.au/attracting-birds-to-your-garden/
              </cite>
            </div>
          </transition>
        </div>

        <!-- article 2 -->
        <div class="info-card-container birds-container">
          <div class="info-card">
            <div class="card-image" @click="openExternalLink2">
              <img src="@/assets/images/garden-article2.png" alt="garden article 2" />
              <div class="card-overlay">
                <h3>Bird Friendly Garden: Design Ideas & Plants</h3>
                <span class="learn-more">Learn More</span>
              </div>
            </div>
          </div>

          <transition name="fade">
            <div class="info-panel">
              <h1>Bird Friendly Garden: Design Ideas & Plants</h1>
              <h3>Abstract</h3>
              <p>
                The article from Fryd Garden Magazine provides a concise guide on creating a
                bird-friendly garden by focusing on biodiversity, natural food sources, and safe
                habitats. It recommends planting native trees, shrubs, and flowers that produce
                berries, seeds, and nectar to attract various bird species. The piece also
                emphasizes the importance of providing water, nesting spaces, and avoiding
                pesticides to ensure a healthy, balanced environment. Overall, it promotes a
                holistic, nature-based approach to gardening that supports both bird populations and
                ecological sustainability.
              </p>
              <h3>Reference</h3>
              <cite>
                Fryd Garden. (n.d.). Bird-friendly garden: Tips for attracting birds to your garden.
                Fryd Garden Magazine. Retrieved May 1, 2025, from
                https://fryd.app/en/magazine/bird-friendly-garden
              </cite>
            </div>
          </transition>
        </div>
        <!-- article 3 -->
        <div class="info-card-container">
          <div class="info-card">
            <div class="card-image" @click="openExternalLink3">
              <img src="@/assets/images/garden-article3.png" alt="garden article 3" />
              <div class="card-overlay">
                <h3>Best Australian Native Habitat Plants for Birds</h3>
                <span class="learn-more">Learn More</span>
              </div>
            </div>
          </div>

          <transition name="fade">
            <div class="info-panel">
              <h1>Best Australian Native Habitat Plants for Birds</h1>
              <h3>Abstract</h3>
              <p>
                The article from Best Plants Australia highlights the top Australian native plants
                for attracting birds to your garden. It emphasizes that selecting region-appropriate
                native species helps provide essential food, shelter, and nesting opportunities
                while supporting ecological balance. Recommended plants include flowering shrubs
                like bottlebrush and acacia, fruit-bearing species such as dianella and native
                pepper, and taller trees that offer canopy habitat. The article also encourages
                gardeners to avoid herbicides and pesticides and to use natural structures to create
                safe, bird-friendly environments tailored to local ecosystems.
              </p>
              <h3>Reference</h3>
              <cite>
                Best Plants Australia. (n.d.). Best Australian native habitat plants for birds.
                BestPlants.com.au. Retrieved May 1, 2025, from
                https://bestplants.com.au/best-australian-native-habitat-plants-for-birds/
              </cite>
            </div>
          </transition>
        </div>
      </div>
    </section>
    <!-- Information Section with Modal Popups About Garden Vedio -->
    <section class="info-section">
      <div class="container">
        <h2 id="info-title" class="info-title">GARDEN-LEARNING VEDIO</h2>
        <p class="info-subtitle">Click "learn more" or picture to see details.</p>

        <!-- vedio 1 -->
        <div class="info-card-container">
          <div class="info-card">
            <div class="card-image" @click="openExternalLinkV1">
              <img src="@/assets/images/garden-vedio1.png" alt="garden vedio 1" />
              <div class="card-overlay">
                <h3>
                  Attract birds to your garden by feeding responsibly | Beneficial Animals |
                  Gardening Australia
                </h3>
                <span class="learn-more">Learn More</span>
              </div>
            </div>
          </div>

          <transition name="fade">
            <div class="info-panel">
              <h1>
                Attract birds to your garden by feeding responsibly | Beneficial Animals | Gardening
                Australia
              </h1>
              <h3>Abstract</h3>
              <p>
                Attracting birds to your garden involves responsible feeding practices. Urban
                ecologist Darryl Jones emphasizes the importance of providing a variety of foods,
                such as seeds and fruits, while ensuring cleanliness to prevent disease.
                Additionally, planting insect-attracting plants can enhance bird visits, creating a
                connection with nature in your garden.
              </p>
              <h3>Uploader</h3>
              <cite> Gardening Australia </cite>
              <h3>Platform</h3>
              <cite> YouTube </cite>
              <h3>Upload Time</h3>
              <cite> 17 May 2020 </cite>
            </div>
          </transition>
        </div>

        <!-- vedio 2 -->
        <div class="info-card-container birds-container">
          <div class="info-card">
            <div class="card-image" @click="openExternalLinkV2">
              <img src="@/assets/images/garden-vedio2.png" alt="garden vedio 2" />
              <div class="card-overlay">
                <h3>
                  HOW TO ATTRACT & FEED GARDEN BIRDS - Bird feeders, baths, hygiene & creating
                  wildlife habitats
                </h3>
                <span class="learn-more">Learn More</span>
              </div>
            </div>
          </div>

          <transition name="fade">
            <div class="info-panel">
              <h1>
                HOW TO ATTRACT & FEED GARDEN BIRDS - Bird feeders, baths, hygiene & creating
                wildlife habitats
              </h1>
              <h3>Abstract</h3>
              <p>
                Welcome to Adam's Gardening Guide. In this video, Adam—an avid year-round bird
                feeder—shows viewers the types of feeders and food he uses, including a
                window-mounted feeder that allows birds to come very close. Water is also essential,
                and Adam demonstrates his birdbath and how a simple tray can be turned into one. He
                also discusses how he enhances the wildlife value of his garden, the plants he uses
                to create habitats, and the berry-producing shrubs that provide food for birds
                during autumn and winter.
              </p>
              <h3>Uploader</h3>
              <cite> Adam's Gardening Guides </cite>
              <h3>Platform</h3>
              <cite> YouTube </cite>
              <h3>Upload Time</h3>
              <cite> 26 Oct 2023 </cite>
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
    openExternalLink1() {
      window.open('https://www.sgaonline.org.au/attracting-birds-to-your-garden/', '_blank')
    },
    openExternalLink2() {
      window.open('https://fryd.app/en/magazine/bird-friendly-garden', '_blank')
    },
    openExternalLink3() {
      window.open(
        'https://bestplants.com.au/best-australian-native-habitat-plants-for-birds/',
        '_blank',
      )
    },
    openExternalLinkV1() {
      window.open('https://www.youtube.com/watch?v=7jYuJENnQik&t=2s', '_blank')
    },
    openExternalLinkV2() {
      window.open('https://www.youtube.com/watch?v=F3zvKKvT6aA', '_blank')
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
.Bird-learning-container {
  width: 100%;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  background-color: #f9f7f0;
}

/* Banner styles */
.banner {
  background-image:
    linear-gradient(rgba(0, 50, 0, 0.8), rgba(0, 50, 0, 0.6)), url('/images/garden.jpeg');
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

/* Info Section Styles */
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

.info-card-container {
  display: flex;
  max-height: 500px;
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
  background-color: #f0f0f0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  border-left: 4px solid #c2e59c;
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
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
  font-size: 1.1rem;
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
