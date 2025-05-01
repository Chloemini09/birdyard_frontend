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

      <select v-model="selectedState" @change="onStateChange">
        <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
      </select>
    </section>

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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gardenData from '@/assets/data/garden_layouts_data_full.json'
import GardenCard from '@/assets/components/GardenCard.vue'
import GardenPopup from '@/components/GardenPopup.vue'

const states = ['Victoria', 'Queensland', 'South Australia']
const selectedState = ref(localStorage.getItem('selectedState') || 'Victoria')
const gardens = ref([])
const popupGarden = ref(null)

// Static info for each state
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

function onStateChange() {
  localStorage.setItem('selectedState', selectedState.value)
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
.state-info select {
  margin-top: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
}

/* Garden Cards Grid */
.garden-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
}

/* Responsive Design */
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
