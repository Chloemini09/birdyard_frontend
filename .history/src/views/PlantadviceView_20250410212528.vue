// Load default plant recommendations when component mounts onMounted(() => {
fetchRecommendedPlants(); });
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

        <div v-if="loading" class="loading-indicator">Loading plant recommendations...</div>

        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-else class="plants-grid">
          <router-link
            v-for="(plant, index) in recommendedPlants"
            :key="index"
            :to="{ name: 'PlantDetail', params: { plantName: plant.plantName } }"
            class="plant-card"
          >
            <div class="plant-image">
              <img :src="getPlantImage(plant)" :alt="plant.plantName" @error="handleImageError" />
            </div>
            <div class="plant-info">
              <h3>{{ plant.plantName }}</h3>
              <p>{{ plant.description }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <section class="cta-section">
      <p class="cta-section-info">Is there any birds in your garden?</p>
      <router-link to="/bird" class="btn btn-large">Know more about Birds!</router-link>
    </section>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
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
    // State variables
    // Get current season based on month
    const getCurrentSeason = () => {
      const month = new Date().getMonth()
      // Australia seasons are opposite to Northern Hemisphere
      // Dec-Feb: Summer, Mar-May: Autumn, Jun-Aug: Winter, Sep-Nov: Spring
      if (month >= 2 && month <= 4) return 'Autumn'
      if (month >= 5 && month <= 7) return 'Winter'
      if (month >= 8 && month <= 10) return 'Spring'
      return 'Summer' // Nov, Dec, Jan, Feb
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

    // Predefined state information
    const stateInfo = reactive({
      Queensland: {
        climate: 'Tropical to subtropical climate, humid in the north, mild in the south',
        ecosystem: 'Includes rainforests, mangroves, and Great Barrier Reef coastal ecosystems',
        birdSpecies: 'Rainbow Lorikeet, Laughing Kookaburra, Black-necked Stork',
        soilTypes: 'Diverse soils, sandy in coastal areas, fertile inland',
        rainfall: 'Annual rainfall varies from 2000mm in the north to 200mm inland',
        plantingTips:
          'Focus on heat and moisture tolerant plants, salt-tolerant species near coast',
      },
      Victoria: {
        climate: 'Temperate oceanic climate with four distinct seasons',
        ecosystem: 'Temperate forests, grasslands, and wetlands',
        birdSpecies: 'Superb Fairy-wren, Rosella, Emu',
        soilTypes: 'Ranges from fertile volcanic soils to poor sandy soils',
        rainfall: 'Annual rainfall from 1500mm in eastern mountains to 450mm in western plains',
        plantingTips:
          'Choose plants that adapt to temperature variations, ensure good drainage in eastern regions',
      },
      'South Australia': {
        climate: 'Mediterranean climate with hot dry summers and mild winters',
        ecosystem: 'Diverse ecosystems including mallee woodlands, coastal heath, and arid lands',
        birdSpecies: 'Adelaide Rosella, Mallee Emu-wren, Australian Magpie',
        soilTypes: 'Calcareous soils, red-brown earth, and sodic soils',
        rainfall: 'Annual rainfall from 800mm in Mount Lofty to 150mm in northern regions',
        plantingTips: 'Choose drought-tolerant plants and consider water-wise gardening techniques',
      },
    })

    // Season information
    const seasonInfo = reactive({
      Spring: {
        description:
          'Spring is the perfect time for planting most native species as they have time to establish before summer heat.',
        plantingTips:
          'Focus on flowering natives that attract pollinators and provide nectar for birds.',
      },
      Summer: {
        description:
          'Summer planting requires careful attention to watering and sun protection for new plants.',
        plantingTips:
          'Choose drought-tolerant natives and water deeply but infrequently to encourage deep root growth.',
      },
      Autumn: {
        description:
          "Autumn's cooler temperatures and increased rainfall make it ideal for establishing root systems.",
        plantingTips: 'Plant trees and shrubs now to give them time to settle before winter.',
      },
      Winter: {
        description:
          'Winter is excellent for planting dormant deciduous species and hardy natives.',
        plantingTips: 'Focus on structural plants and prepare soil for spring planting.',
      },
    })

    // Methods
    const fetchSuggestions = async () => {
      // Remove spaces and force uppercase for search terms
      const searchTerm = address.value.trim().toUpperCase().replace(/\s+/g, '')

      if (searchTerm.length < 2) {
        suggestions.value = []
        return
      }

      try {
        // First try Mapbox API
        const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?access_token=${mapboxToken}&country=au&limit=5`
        const response = await fetch(mapboxUrl)
        const data = await response.json()

        if (data.features && data.features.length > 0) {
          suggestions.value = data.features.map((feature) => ({
            display_name: feature.place_name,
            center: feature.center,
          }))
        } else {
          // Fallback to Nominatim
          try {
            const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=5&countrycodes=au`
            const nominatimResponse = await fetch(nominatimUrl)
            const nominatimData = await nominatimResponse.json()

            suggestions.value = nominatimData.map((item) => ({
              display_name: item.display_name,
              center: [parseFloat(item.lon), parseFloat(item.lat)],
            }))
          } catch (err) {
            console.error('Fallback API request failed:', err)
            error.value = 'Address search failed. Please try again.'
          }
        }
      } catch (err) {
        console.error('Address autocomplete request failed:', err)
        error.value = 'Address search failed. Please try again.'
      }
    }

    // These are the two functions that need to be modified:

    const selectSuggestion = (index) => {
      if (suggestions.value.length <= index) return

      const selected = suggestions.value[index]
      address.value = selected.display_name

      // Update location coordinates
      if (selected.center) {
        selectedLocation.value = {
          lng: selected.center[0],
          lat: selected.center[1],
        }
      }

      suggestions.value = [] // Clear suggestions only
      // We no longer determine the state or fetch plants here
    }

    const searchLocation = async () => {
      if (address.value.trim() === '') {
        locationError.value = 'Please enter a location'
        return
      }

      locationError.value = '' // Clear any previous errors

      // Check if we already have location coordinates (from a selected suggestion)
      if (!selectedLocation.value && suggestions.value.length > 0) {
        // If we have suggestions but no selection, use the first suggestion
        await selectSuggestion(0)
      } else if (!selectedLocation.value) {
        // If we don't have coordinates or suggestions, try to fetch them
        await fetchSuggestions()
        if (suggestions.value.length > 0) {
          await selectSuggestion(0)
        } else {
          locationError.value = 'Location not found. Please try a more specific address.'
          return
        }
      }

      // Now determine the state from the selected address
      const addressLower = address.value.toLowerCase()

      if (addressLower.includes('queensland') || addressLower.includes('qld')) {
        selectedState.value = 'Queensland'
        localStorage.setItem('selectedState', selectedState.value)
      } else if (addressLower.includes('victoria') || addressLower.includes('vic')) {
        selectedState.value = 'Victoria'
        localStorage.setItem('selectedState', selectedState.value)
      } else if (addressLower.includes('south australia') || addressLower.includes('sa')) {
        selectedState.value = 'South Australia'
        localStorage.setItem('selectedState', selectedState.value)
      } else {
        // Try to determine the state using reverse geocoding if not found in address
        try {
          const reverseUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${selectedLocation.value.lng},${selectedLocation.value.lat}.json?access_token=${mapboxToken}&types=region&limit=1`
          const response = await fetch(reverseUrl)
          const data = await response.json()

          if (data.features && data.features.length > 0) {
            const stateName = data.features[0].text

            if (
              stateName === 'Queensland' ||
              stateName === 'Victoria' ||
              stateName === 'South Australia'
            ) {
              selectedState.value = stateName
              localStorage.setItem('selectedState', selectedState.value)
            } else {
              locationError.value =
                'We currently only service Queensland, Victoria, and South Australia. Please select a location in these states.'
              selectedState.value = ''
              return
            }
          } else {
            locationError.value =
              'Could not determine the state. Please ensure your address is in Australia.'
            selectedState.value = ''
            return
          }
        } catch (err) {
          console.error('Reverse geocoding failed:', err)
          locationError.value = 'Could not determine your state. Please try a different address.'
          selectedState.value = ''
          return
        }
      }

      // Now that we have the state, fetch plant recommendations
      fetchRecommendedPlants()
    }

    const selectSeason = (season) => {
      selectedSeason.value = season
      fetchRecommendedPlants()
    }

    const fetchRecommendedPlants = async () => {
      if (!selectedState.value || !selectedSeason.value) return

      loading.value = true
      error.value = ''

      try {
        const plantData = await getRecommendedPlants(selectedState.value, selectedSeason.value)
        console.log('API return plants array:', plantData)
        recommendedPlants.value = plantData
      } catch (err) {
        console.error('Failed to get plant recommendations:', err)
        error.value = 'Could not load plant recommendations. Please try again later.'
        recommendedPlants.value = []
      } finally {
        loading.value = false
      }
    }

    const getPlantImage = (plant) => {
      if (!plant || !plant.plantName) {
        console.log('Can not find plants')
        return '/images/plants/default-plant.jpg'
      }
      const encodedPlantName = encodeURIComponent(plant.plantName)
      const imagePath = `/images/plants/${encodedPlantName}.jpg`
      return imagePath
    }

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
      stateInfo,
      seasonInfo,
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
/* Global styles matching your existing site */
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

/* Banner styles */
.banner {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/images/garden.jpeg');
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

/* Search section styles */
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

/* Content section styles */
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

/* State info card styles */
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

/* Season selector styles */
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

/* Recommendations section styles */
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
}

.plant-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.plant-card:hover {
  transform: translateY(-5px);
}

.plant-image {
  height: 200px;
  overflow: hidden;
}

.plant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.plant-info {
  padding: 20px;
}

.plant-info h3 {
  color: #0a3200;
  margin-bottom: 10px;
}

.plant-info p {
  color: #555;
  line-height: 1.6;
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

  .plants-grid {
    grid-template-columns: 1fr;
  }
}
</style>
