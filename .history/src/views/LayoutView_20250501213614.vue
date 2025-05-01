<template>
  <div class="layout-page-container">
    <!-- Banner Section -->
    <section class="contact-banner">
      <div class="banner-overlay">
        <h1 class="contact-title">LAYOUT</h1>
        <p class="contact-subtitle">We'd love to hear from you about birds in your backyard</p>
      </div>
    </section>

    <!-- State Info Section -->
    <section class="state-info">
      <h2>{{ selectedState }}</h2>
      <p><strong>Climate:</strong> {{ stateData[selectedState].climate }}</p>
      <p><strong>Soil Type:</strong> {{ stateData[selectedState].soil }}</p>
      <p><strong>Birdlife:</strong> {{ stateData[selectedState].birds }}</p>
    </section>

    <!-- State Filter Buttons -->
    <div class="state-filter-container">
      <div class="state-filter-label">Bird Garden Region:</div>
      <div class="state-filter-buttons">
        <button
          class="state-filter-button"
          :class="{ active: selectedState === 'South Australia' }"
          @click="setStateFilter('South Australia')"
        >
          South Australia
        </button>
        <button
          class="state-filter-button"
          :class="{ active: selectedState === 'Victoria' }"
          @click="setStateFilter('Victoria')"
        >
          Victoria
        </button>
        <button
          class="state-filter-button"
          :class="{ active: selectedState === 'Queensland' }"
          @click="setStateFilter('Queensland')"
        >
          Queensland
        </button>
      </div>
    </div>

    <!-- Garden Cards Section -->
    <section class="garden-cards">
      <GardenCard
        v-for="garden in gardens"
        :key="garden.slug"
        :garden="garden"
        @seeMore="popupGarden = garden"
      />
    </section>

    <!-- Popup Section -->
    <GardenPopup v-if="popupGarden" :garden="popupGarden" @close="popupGarden = null" />

    <!-- CTA Section -->
    <section class="cta-nesting">
      <p>Would you like to help birds find a home?</p>
      <router-link to="/nesting" class="cta-button">Go to Nesting Guide →</router-link>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gardenData from '@/assets/data/garden_layouts_data_full.json'
import GardenCard from '@/assets/components/GardenCard.vue'
import GardenPopup from '@/assets/components/GardenPopup.vue'

const states = ['Victoria', 'Queensland', 'South Australia']
const selectedState = ref(localStorage.getItem('selectedState') || 'Victoria')
const gardens = ref([])
const popupGarden = ref(null)

const stateData = {
  Victoria: {
    climate: 'Temperate with cool winters and warm summers. Rainfall evenly distributed.',
    soil: 'Varied: sandy loams, clay loams. Often fertile but can be acidic.',
    birds: 'Robins, Silvereyes, Honeyeaters, Currawongs, Cockatoos',
  },
  Queensland: {
    climate: 'Subtropical to tropical. Hot summers, mild winters, summer rains.',
    soil: 'Often sandy or clay-based. Coastal areas more acidic.',
    birds: 'Lorikeets, Figbirds, Orioles, Finches, Bitterns',
  },
  'South Australia': {
    climate: 'Mediterranean in south, arid inland. Hot dry summers, cool wet winters.',
    soil: 'Calcareous loams, clay, saline soils in some inland areas.',
    birds: 'Wattlebirds, Magpies, Finches, Pardalotes, Silvereyes',
  },
}

onMounted(() => {
  loadGardens()
})

function loadGardens() {
  gardens.value = gardenData[selectedState.value] || []
}

function setStateFilter(state) {
  selectedState.value = state
  localStorage.setItem('selectedState', state)
  loadGardens()
}
</script>

<style scoped>
.layout-page-container {
  font-family: 'Arial', sans-serif;
  color: #333;
}

/* Banner Section */
.contact-banner {
  height: 40vh;
  min-height: 400px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('../assets/images/layout/Layout.jpg');
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

/* State Info Section */
.state-info {
  background-color: #f4f7f0;
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

/* State Filter Styles */
.state-filter-container {
  margin-bottom: 30px;
  text-align: center;
}
.state-filter-label {
  font-size: 1.1rem;
  color: #1a2d00;
  margin-bottom: 15px;
  font-weight: 600;
}
.state-filter-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
.state-filter-button {
  padding: 8px 16px;
  background-color: #f2f2f2;
  border: 2px solid transparent;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #555;
  transition: all 0.3s ease;
}
.state-filter-button:hover {
  background-color: #e6e6e6;
  color: #333;
}
.state-filter-button.active {
  background-color: #1a2d00;
  color: #f3f9c0;
  border-color: #1a2d00;
}

/* Garden Cards Grid */
.garden-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
}

/* CTA Bottom */
.cta-nesting {
  background-color: #f0f8ea;
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}
.cta-button {
  margin-top: 1rem;
  display: inline-block;
  background-color: #5c9c3e;
  color: #fff;
  padding: 0.8rem 1.4rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
}
.cta-button:hover {
  background-color: #487b2e;
}

/* Responsive */
@media (max-width: 768px) {
  .contact-title {
    font-size: 2.5rem;
  }
  .garden-cards {
    flex-direction: column;
    align-items: center;
  }
}
</style>
