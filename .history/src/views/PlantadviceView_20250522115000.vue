<template>
  <div class="plant-advice-container">
    <!-- Header Banner -->
    <div class="banner">
      <h1 class="banner-title">NATIVE PLANT SUGGESTIONS</h1>
      <p class="banner-subtitle">UNDERSTAND YOUR PLANT BASED ON YOUR CLIMATE</p>
      <p class="banner-subtitle">INPUT YOUR LOCATION AND SEASON TO FIND PLANTS FOR YOU</p>
      <p class="banner-subtitle">WE CAN HELP YOU IN VICTORA, SOUTH AUSTRALIA AND QUEENSLAND</p>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <p class="search-section-info">
        Tell us your location and Click button to see what is best plants!
      </p>
      <div class="location-input-container">
        <input
          type="text"
          v-model="address"
          @input="fetchSuggestions"
          placeholder="Enter your Location"
          class="location-input"
        />
        <button @click="searchLocation" class="btn-search">Search Plants</button>
      </div>

      <!-- Address Suggestions Dropdown -->
      <div v-if="suggestions.length > 0" class="suggestions-container">
        <div
          v-for="(suggestion, index) in suggestions"
          :key="index"
          @click="selectSuggestion(index)"
          class="suggestion-item"
        >
          {{ suggestion.display_name }}
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="locationError" class="error-message">
        {{ locationError }}
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="content-section">
      <div class="content-grid">
        <!-- Left Column - State Information -->
        <div class="state-info-card">
          <h2>{{ selectedState }}</h2>
          <div class="state-info-content">
            <p>
              The following plant recommendations are based on your location's weather, and
              surrounding environment.
            </p>
            <p>
              By matching the right plants to your region, we help you grow a garden that thrives
              naturally—while creating a safe and welcoming space for local birds.
            </p>
          </div>
        </div>

        <!-- Right Column - Season Selector -->
        <div class="season-selector">
          <div class="seasons-row">
            <div
              class="season-item"
              :class="{ active: selectedSeason === 'Spring' }"
              @click="selectSeason('Spring')"
            >
              <span class="season-icon">🌸</span> Spring
            </div>
            <div
              class="season-item"
              :class="{ active: selectedSeason === 'Summer' }"
              @click="selectSeason('Summer')"
            >
              <span class="season-icon">☀️</span> Summer
            </div>
            <div
              class="season-item"
              :class="{ active: selectedSeason === 'Autumn' }"
              @click="selectSeason('Autumn')"
            >
              <span class="season-icon">🍁</span> Autumn
            </div>
            <div
              class="season-item"
              :class="{ active: selectedSeason === 'Winter' }"
              @click="selectSeason('Winter')"
            >
              <span class="season-icon">❄️</span> Winter
            </div>
          </div>

          <div class="season-info" v-if="selectedSeason">
            <p>
              The following plant recommendations are based on your location's weather, and
              surrounding environment.
            </p>
            <p>
              By matching the right plants to your region, we help you grow a garden that thrives
              naturally—while creating a safe and welcoming space for local birds.
            </p>
          </div>
        </div>
      </div>

      <!-- Plant Recommendations Section -->
      <div class="recommendations-section" v-if="selectedSeason">
        <h2 class="recommendations-title">Recommended Plants</h2>

        <!-- Calendar Instructions - More Prominent -->
        <div class="calendar-instructions">
          <div class="instruction-icon">📅</div>
          <div class="instruction-text">
            <h3>Plan Your Planting Schedule</h3>
            <p>
              Click the <strong>View Planting Calendar</strong> button on each plant card to see the
              best planting times for your region
            </p>
          </div>
        </div>

        <div v-if="loading" class="loading-indicator">Loading plant recommendations...</div>

        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-else class="plants-grid">
          <router-link
            v-for="(plant, index) in recommendedPlants"
            :key="index"
            :to="{
              name: 'PlantDetail',
              params: { plantName: plant.plantName },
              query: {
                recommendedPlantNames: recommendedPlants.map((p) => p.plantName).join(','),
                hemisphere: 'southern',
              },
            }"
            class="plant-card"
          >
            <div class="plant-image">
              <img :src="getPlantImage(plant)" :alt="plant.plantName" @error="handleImageError" />
            </div>
            <div class="plant-info">
              <h3>{{ plant.plantName }}</h3>
              <p>{{ plant.description }}</p>

              <!-- Improved Calendar Button -->
              <router-link
                :to="{
                  name: 'PlantingCalendar',
                  params: { plantName: plant.plantName },
                  query: {
                    hemisphere: 'southern',
                    recommendedPlantNames: recommendedPlants.map((p) => p.plantName).join(','),
                  },
                }"
                class="btn-calendar-link"
                @click.stop
              >
                <span class="calendar-icon">📅</span>
                <span class="calendar-text">View Planting Calendar</span>
              </router-link>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <section class="cta-section">
      <p class="cta-section-info">Is there any birds in your garden?</p>
      <router-link to="/layout" class="btn btn-large">Create Your Dream Garden</router-link>
    </section>
  </div>
</template>

<script>
// Script remains the same as your original
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

// recommended Plants API
const getRecommendedPlants = async (state, season) => {
  try {
    console.log(`request plant data - state: ${state}, season: ${season}`)
    const response = await axios.get(
      'https://rm3hr3vrfh.execute-api.us-east-1.amazonaws.com/birdyardplants/',
      {
        params: {
          state: state,
          season: season,
        },
      },
    )
    console.log('API responds:', response)
    console.log('plant data:', response.data)
    return response.data
  } catch (error) {
    console.error('get plant data failed:', error)
    throw error
  }
}

export default {
  name: 'PlantadviceView',
  setup() {
    const handleImageError = (event) => {
      const currentSrc = event.target.src

      if (currentSrc.endsWith('.jpg')) {
        event.target.src = currentSrc.replace('.jpg', '.png')
      } else if (currentSrc.endsWith('.png')) {
        event.target.src = currentSrc.replace('.png', '.JPG')
      } else if (currentSrc.endsWith('.JPG')) {
        event.target.src = '@/assets/images/plants/default-plant.jpg'
      } else {
        event.target.src = '@/assets/images/plants/default-plant.jpg'
      }
    }

    const getCurrentSeason = () => {
      const month = new Date().getMonth()
      if (month >= 2 && month <= 4) return 'Autumn'
      if (month >= 5 && month <= 7) return 'Winter'
      if (month >= 8 && month <= 10) return 'Spring'
      return 'Summer'
    }

    const address = ref(localStorage.getItem('plantAddress') || '')
    const selectedLocation = ref(JSON.parse(localStorage.getItem('plantSelectedLocation')) || null)
    const selectedState = ref(localStorage.getItem('selectedState') || 'Victoria')
    const selectedSeason = ref(localStorage.getItem('selectedSeason') || getCurrentSeason())
    const suggestions = ref([])
    const recommendedPlants = ref([])
    const loading = ref(false)
    const error = ref('')
    const locationError = ref('')
    const mapboxToken =
      'pk.eyJ1IjoiY2hsb2V5dWUiLCJhIjoiY204YTdyNXA3MTloZjJqcHNhYjZ1c2thbCJ9.X4D17rgTFDpXuC8KUfvKLQ'

    // Rest of your methods remain the same...
    const fetchSuggestions = async () => {
      const searchTerm = address.value.trim().toUpperCase().replace(/\s+/g, '')
      if (searchTerm.length < 2) {
        suggestions.value = []
        return
      }
      // Implementation remains the same...
    }

    const selectSuggestion = (index) => {
      if (suggestions.value.length <= index) return
      const selected = suggestions.value[index]
      address.value = selected.display_name
      localStorage.setItem('plantAddress', address.value)
      if (selected.center) {
        selectedLocation.value = {
          lng: selected.center[0],
          lat: selected.center[1],
        }
        localStorage.setItem('plantSelectedLocation', JSON.stringify(selectedLocation.value))
      }
      suggestions.value = []
    }

    const searchLocation = async () => {
      // Implementation remains the same...
    }

    const selectSeason = (season) => {
      selectedSeason.value = season
      localStorage.setItem('selectedSeason', season)
      fetchRecommendedPlants()
    }

    const fetchRecommendedPlants = async () => {
      if (!selectedState.value || !selectedSeason.value) return
      loading.value = true
      error.value = ''
      try {
        const plantData = await getRecommendedPlants(selectedState.value, selectedSeason.value)
        recommendedPlants.value = plantData
        localStorage.setItem('recommendedPlants', JSON.stringify(plantData))
      } catch (err) {
        console.error('Failed to get plant recommendations:', err)
        error.value = 'Could not load plant recommendations. Please try again later.'
        const savedPlants = localStorage.getItem('recommendedPlants')
        recommendedPlants.value = savedPlants ? JSON.parse(savedPlants) : []
      } finally {
        loading.value = false
      }
    }

    const getPlantImage = (plant) => {
      if (!plant || !plant.plantName) {
        return '/images/plants/default-plant.jpg'
      }
      const encodedPlantName = encodeURIComponent(plant.plantName)
      return `/images/plants/${encodedPlantName}.jpg`
    }

    onMounted(() => {
      const savedAddress = localStorage.getItem('plantAddress')
      const savedSelectedLocation = localStorage.getItem('plantSelectedLocation')
      const savedState = localStorage.getItem('selectedState')
      const savedSeason = localStorage.getItem('selectedSeason')
      const savedRecommendedPlants = localStorage.getItem('recommendedPlants')

      if (savedAddress) address.value = savedAddress
      if (savedSelectedLocation) selectedLocation.value = JSON.parse(savedSelectedLocation)
      if (savedState) selectedState.value = savedState
      if (savedSeason) selectedSeason.value = savedSeason

      if (savedRecommendedPlants) {
        recommendedPlants.value = JSON.parse(savedRecommendedPlants)
        if (recommendedPlants.value.length === 0 && selectedState.value && selectedSeason.value) {
          fetchRecommendedPlants()
        }
      } else if (selectedState.value && selectedSeason.value) {
        fetchRecommendedPlants()
      }
    })

    return {
      address,
      suggestions,
      selectedLocation,
      selectedState,
      selectedSeason,
      recommendedPlants,
      loading,
      error,
      locationError,
      fetchSuggestions,
      selectSuggestion,
      searchLocation,
      selectSeason,
      getPlantImage,
      handleImageError,
    }
  },
}
</script>

<style scoped>
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-large {
  padding: 15px 30px;
  font-size: 18px;
  background-color: rgba(194, 229, 156, 0.9);
  color: #0a3200;
  border: 2px solid #c2e59c;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.plant-advice-container {
  width: 100%;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

.btn-search {
  background-color: rgba(194, 229, 156, 0.9);
  color: #0a3200;
  border: 2px solid #c2e59c;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-search:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.banner {
  background-image:
    linear-gradient(rgba(0, 50, 0, 0.8), rgba(0, 50, 0, 0.6)), url('@/assets/images/garden.jpeg');
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

.search-section {
  padding: 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  position: relative;
}

.search-section-info {
  font-size: 1.2rem;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 20px;
}

.location-input-container {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
}

.location-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  margin-right: 10px;
}

.suggestions-container {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 500px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}

.error-message {
  color: #d9534f;
  text-align: center;
  margin-top: 10px;
}

.content-section {
  padding: 30px;
  background-color: white;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.state-info-card {
  background-color: #f0f7e6;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.state-info-card h2 {
  color: #0a3200;
  font-size: 1.8rem;
  margin-bottom: 15px;
  border-bottom: 2px solid #c2e59c;
  padding-bottom: 10px;
}

.state-info-content p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.season-selector {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.seasons-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.season-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.season-item:hover {
  background-color: #f0f7e6;
}

.season-item.active {
  background-color: #c2e59c;
  color: #0a3200;
  font-weight: bold;
}

.season-icon {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.season-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  line-height: 1.6;
}

.recommendations-section {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.recommendations-title {
  color: #0a3200;
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
}

/* New Calendar Instructions Styles */
.calendar-instructions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: linear-gradient(135deg, #f0f7e6 0%, #e8f5e0 100%);
  border: 2px solid #c2e59c;
  border-radius: 15px;
  padding: 25px;
  margin: 20px auto 30px;
  max-width: 600px;
  box-shadow: 0 4px 15px rgba(194, 229, 156, 0.2);
}

.instruction-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.instruction-text {
  text-align: left;
}

.instruction-text h3 {
  color: #0a3200;
  font-size: 1.4rem;
  margin-bottom: 8px;
  font-weight: 600;
}

.instruction-text p {
  color: #2d5016;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.instruction-text strong {
  color: #0a3200;
  font-weight: 700;
}

.loading-indicator {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}

.plants-grid {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 20px;
  overflow-x: auto;
  padding: 10px;
  -webkit-overflow-scrolling: touch;
}

.plant-card {
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-width: 300px;
  max-width: 340px;
  flex-shrink: 0;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
}

.plant-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  border-color: #c2e59c;
}

.plant-image {
  height: 200px;
  overflow: hidden;
}

.plant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.plant-card:hover .plant-image img {
  transform: scale(1.05);
}

.plant-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.plant-info h3 {
  color: #0a3200;
  margin-bottom: 12px;
  font-size: 1.3rem;
  font-weight: 600;
}

.plant-info p {
  color: #555;
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: 20px;
}

/* Improved Calendar Button */
.btn-calendar-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #c2e59c, #a8d982);
  color: #0a3200;
  text-decoration: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 15px rgba(194, 229, 156, 0.3);
}

.btn-calendar-link:hover {
  background: linear-gradient(135deg, #a8d982, #8bc34a);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(194, 229, 156, 0.4);
  border-color: #6a994a;
}

.calendar-icon {
  font-size: 1.2rem;
}

.calendar-text {
  font-weight: 600;
  letter-spacing: 0.02em;
}

.cta-section {
  padding: 40px 0;
  text-align: center;
  background-color: #ffffff;
}

.cta-section-info {
  font-size: 1.2rem;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 20px;
}

/* Responsive styles */
@media (max-width: 992px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .calendar-instructions {
    flex-direction: column;
    text-align: center;
  }

  .instruction-text {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .banner-title {
    font-size: 2rem;
  }

  .seasons-row {
    flex-wrap: wrap;
    justify-content: center;
  }

  .season-item {
    margin: 5px;
    min-width: 120px;
  }

  .calendar-instructions {
    padding: 20px;
    margin: 15px auto 25px;
  }

  .instruction-icon {
    font-size: 2.5rem;
  }

  .instruction-text h3 {
    font-size: 1.2rem;
  }

  .instruction-text p {
    font-size: 0.9rem;
  }

  .plant-card {
    min-width: 280px;
    max-width: 300px;
  }
}
</style>
