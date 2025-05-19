<template>
  <div class="plant-advice-container">
    <!-- Header Banner -->
    <div class="banner">
      <h1 class="banner-title">NATIVE PLANT SUGGESTIONS</h1>
      <p class="banner-subtitle">UNDERSTAND YOUR PLANT BASED ON YOUR CLIMATE</p>
      <p class="banner-subtitle">INPUT YOUR LOCATION AND SEASON TO FIND PLANTS FOR YOU</p>
      <p class="banner-subtitle">WE CAN HELP YOU IN VICTORIA, SOUTH AUSTRALIA AND QUEENSLAND</p>
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
          <h2>{{ selectedState || 'Select Location' }}</h2>
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

        <div
          v-if="recommendedPlants.length > 0 && !loading && !error"
          class="planner-button-container"
        >
          <router-link
            :to="{
              name: 'PlantingCalendar',
              params: { plantName: recommendedPlants[0].plantName },
              query: {
                hemisphere: userHemisphere,
                recommendedPlantNames: recommendedPlants.map((p) => p.plantName).join(','),
              },
            }"
            class="btn btn-planner"
          >
            View Planting Planner
          </router-link>
        </div>

        <div v-if="loading" class="loading-indicator">Loading plant recommendations...</div>

        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-else-if="recommendedPlants.length === 0 && !loading" class="no-plants-message">
          No plants recommended for your current selection. Try a different location or season.
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
              <p>
                {{
                  plant.description && plant.description.length > 100
                    ? plant.description.substring(0, 100) + '...'
                    : plant.description
                }}
              </p>
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
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const getRecommendedPlants = async (state, season) => {
  try {
    const response = await axios.get(
      'https://rm3hr3vrfh.execute-api.us-east-1.amazonaws.com/birdyardplants/',
      { params: { state: state, season: season } },
    )
    return response.data // Expecting an array of plant objects
  } catch (error) {
    console.error('Get plant data failed:', error)
    throw error
  }
}

export default {
  name: 'PlantadviceView',
  setup() {
    const handleImageError = (event) => {
      event.target.src = '/images/plants/default-plant.jpg'
      event.target.onerror = null
    }

    const getCurrentSeason = () => {
      const month = new Date().getMonth() // 0-11
      // Southern Hemisphere seasons
      if (month >= 8 && month <= 10) return 'Spring' // Sep, Oct, Nov
      if (month === 11 || month <= 1) return 'Summer' // Dec, Jan, Feb
      if (month >= 2 && month <= 4) return 'Autumn' // Mar, Apr, May
      return 'Winter' // Jun, Jul, Aug
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

    const userHemisphere = computed(() => {
      // For Australian states, it's always southern.
      if (['Queensland', 'Victoria', 'South Australia'].includes(selectedState.value)) {
        return 'southern'
      }
      return 'southern' // Default
    })

    const fetchSuggestions = async () => {
      const searchTerm = address.value.trim()
      if (searchTerm.length < 2) {
        suggestions.value = []
        return
      }
      try {
        // Prioritize Mapbox for better structured context
        const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?access_token=${mapboxToken}&country=au&types=place,locality,region,postcode&limit=5`
        const response = await fetch(mapboxUrl)
        const data = await response.json()
        if (data.features && data.features.length > 0) {
          suggestions.value = data.features.map((feature) => ({
            display_name: feature.place_name,
            center: feature.center,
            context: feature.context,
          }))
        } else {
          // Fallback to Nominatim if Mapbox yields no results
          try {
            const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=5&countrycodes=au&addressdetails=1` // addressdetails for state
            const nominatimResponse = await fetch(nominatimUrl)
            const nominatimData = await nominatimResponse.json()
            if (nominatimData && nominatimData.length > 0) {
              suggestions.value = nominatimData.map((item) => ({
                display_name: item.display_name,
                center: [parseFloat(item.lon), parseFloat(item.lat)],
                // Nominatim's context is in item.address.state
                context:
                  item.address && item.address.state
                    ? [{ id: 'region.nominatim', text: item.address.state }]
                    : null,
              }))
            } else {
              suggestions.value = []
            }
          } catch (errNom) {
            console.error('Nominatim API request failed:', errNom)
            suggestions.value = []
          }
        }
      } catch (errMap) {
        console.error('Mapbox API request failed:', errMap)
        locationError.value = 'Address search failed. Please try again.'
        suggestions.value = []
      }
    }

    const extractStateFromContext = (contextArray) => {
      if (!contextArray || !Array.isArray(contextArray)) return null
      for (const context of contextArray) {
        if (context.id && context.id.startsWith('region.')) {
          const stateName = context.text
          if (['Queensland', 'Victoria', 'South Australia'].includes(stateName)) return stateName
          // Add common variations/abbreviations if needed
          if (
            stateName.toLowerCase().includes('queensland') ||
            context.short_code?.toLowerCase().includes('qld')
          )
            return 'Queensland'
          if (
            stateName.toLowerCase().includes('victoria') ||
            context.short_code?.toLowerCase().includes('vic')
          )
            return 'Victoria'
          if (
            stateName.toLowerCase().includes('south australia') ||
            context.short_code?.toLowerCase().includes('sa')
          )
            return 'South Australia'
        }
      }
      return null
    }

    const selectSuggestion = (index) => {
      if (suggestions.value.length <= index) return
      const selected = suggestions.value[index]
      address.value = selected.display_name
      localStorage.setItem('plantAddress', address.value)

      if (selected.center) {
        selectedLocation.value = { lng: selected.center[0], lat: selected.center[1] }
        localStorage.setItem('plantSelectedLocation', JSON.stringify(selectedLocation.value))
      }

      const stateFromSuggestion = extractStateFromContext(selected.context)
      if (stateFromSuggestion) {
        selectedState.value = stateFromSuggestion
        localStorage.setItem('selectedState', selectedState.value)
        locationError.value = ''
        fetchRecommendedPlants() // Fetch plants immediately after state is confirmed
      } else {
        selectedState.value = '' // Clear state if not determinable from suggestion
        locationError.value =
          'We only provide service for Victoria, South Australia and Queensland. Please input location within these states again.'
      }
      suggestions.value = []
    }

    const reverseGeocodeForState = async (lng, lat) => {
      try {
        const reverseUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&types=region&limit=1`
        const response = await fetch(reverseUrl)
        const data = await response.json()
        if (data.features && data.features.length > 0) {
          return extractStateFromContext(data.features[0].context) || data.features[0].text
        }
      } catch (err) {
        console.error('Reverse geocoding for state failed:', err)
      }
      return null
    }

    const searchLocation = async () => {
      locationError.value = ''
      if (address.value.trim() === '') {
        locationError.value = 'Please enter a location'
        return
      }

      let stateFound = false
      if (
        selectedState.value &&
        ['Queensland', 'Victoria', 'South Australia'].includes(selectedState.value)
      ) {
        stateFound = true // State might have been set by selectSuggestion
      }

      // If state not found yet, try to determine it
      if (!stateFound) {
        if (!selectedLocation.value) {
          // No lat/lon from suggestion, geocode address
          try {
            const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address.value)}.json?access_token=${mapboxToken}&country=au&limit=1`
            const geoResponse = await fetch(mapboxUrl)
            const geoData = await geoResponse.json()
            if (geoData.features && geoData.features.length > 0) {
              const feature = geoData.features[0]
              selectedLocation.value = { lng: feature.center[0], lat: feature.center[1] }
              localStorage.setItem('plantSelectedLocation', JSON.stringify(selectedLocation.value))
              const stateFromGeo = extractStateFromContext(feature.context)
              if (
                stateFromGeo &&
                ['Queensland', 'Victoria', 'South Australia'].includes(stateFromGeo)
              ) {
                selectedState.value = stateFromGeo
                localStorage.setItem('selectedState', selectedState.value)
                stateFound = true
              }
            } else {
              locationError.value = 'Location not found.'
              return
            }
          } catch (err) {
            console.error('Geocoding error:', err)
            locationError.value = 'Error finding location details.'
            return
          }
        }
        // If state still not found, but we have lat/lon, reverse geocode
        if (!stateFound && selectedLocation.value) {
          const stateFromReverse = await reverseGeocodeForState(
            selectedLocation.value.lng,
            selectedLocation.value.lat,
          )
          if (
            stateFromReverse &&
            ['Queensland', 'Victoria', 'South Australia'].includes(stateFromReverse)
          ) {
            selectedState.value = stateFromReverse
            localStorage.setItem('selectedState', selectedState.value)
            stateFound = true
          }
        }
      }

      if (!stateFound) {
        locationError.value =
          'Could not determine a valid state (QLD, VIC, SA) for your location. Please be more specific or select from suggestions.'
        return
      }
      fetchRecommendedPlants()
    }

    const selectSeason = (season) => {
      selectedSeason.value = season
      localStorage.setItem('selectedSeason', season)
      fetchRecommendedPlants()
    }

    const fetchRecommendedPlants = async () => {
      if (!selectedState.value || !selectedSeason.value) {
        // error.value = "Please select a valid state and season to see recommendations.";
        return // Do not proceed if state or season is missing
      }
      loading.value = true
      error.value = ''
      recommendedPlants.value = []

      try {
        const plantData = await getRecommendedPlants(selectedState.value, selectedSeason.value)
        if (plantData && Array.isArray(plantData)) {
          // API now returns an array
          recommendedPlants.value = plantData // Directly assign the array
          if (plantData.length === 0) {
            error.value =
              'No specific plant recommendations found for this selection. You can still browse general advice.'
          }
          localStorage.setItem('recommendedPlants', JSON.stringify(plantData))
        } else {
          recommendedPlants.value = []
          error.value = 'Could not fetch plant recommendations in the expected format.'
        }
      } catch (err) {
        console.error('Failed to get plant recommendations:', err)
        error.value = 'Error loading plant recommendations. Please try again later.'
      } finally {
        loading.value = false
      }
    }

    const getPlantImage = (plant) => {
      if (!plant || !plant.plantName) return '/images/plants/default-plant.jpg'
      const encodedPlantName = encodeURIComponent(plant.plantName)
      return `/images/plants/${encodedPlantName}.jpg`
    }

    onMounted(() => {
      // Attempt to load from localStorage first only if state and season are also present
      if (selectedState.value && selectedSeason.value) {
        const savedPlants = localStorage.getItem('recommendedPlants')
        if (savedPlants) {
          try {
            const parsedPlants = JSON.parse(savedPlants)
            if (Array.isArray(parsedPlants)) {
              recommendedPlants.value = parsedPlants
            } else {
              // If format is wrong, fetch fresh
              fetchRecommendedPlants()
            }
          } catch (e) {
            console.error('Error parsing saved plants from localStorage', e)
            localStorage.removeItem('recommendedPlants')
            fetchRecommendedPlants()
          }
        } else {
          // No saved plants, fetch
          fetchRecommendedPlants()
        }
      } else {
        // Guide user to select location if no state/season (e.g. first visit)
        console.log('Initial load: No state or season. User needs to input location.')
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
      userHemisphere,
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

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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

.error-message,
.no-plants-message {
  color: #d9534f;
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 0.25rem;
}

.no-plants-message {
  color: #0c5460;
  background-color: #d1ecf1;
  border-color: #bee5eb;
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

.planner-button-container {
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.btn-planner {
  background-color: var(--color-primary, #0a3200);
  color: white;
  padding: 12px 25px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
  border: 2px solid var(--color-primary, #0a3200);
}

.btn-planner:hover {
  background-color: #074700;
  border-color: #074700;
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
  flex-wrap: wrap;
  gap: 20px;
  padding: 10px;
  /* Removed overflow-x: auto to rely on wrap */
}

.plant-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  width: 280px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
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
}

.plant-info {
  padding: 15px;
  text-align: left;
  flex-grow: 1;
}

.plant-info h3 {
  color: #0a3200;
  margin-bottom: 8px;
  font-size: 1.25rem;
}

.plant-info p {
  color: #555;
  line-height: 1.5;
  font-size: 0.9rem;
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

@media (max-width: 992px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  .plants-grid {
    justify-content: flex-start;
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
}
</style>
