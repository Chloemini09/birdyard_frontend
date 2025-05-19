<template>
  <div class="plant-detail-container" v-if="plant">
    <div class="back-button-wrapper">
      <button @click="goBack" class="back-button"><span class="back-icon">←</span> Back</button>
    </div>
    <div class="plant-detail-card">
      <div class="plant-image-wrapper">
        <img
          :src="getPlantImage(plant)"
          :alt="plant.plantName"
          @error="handleImageError"
          class="plant-image"
        />
      </div>
      <div class="plant-info-wrapper">
        <h1 class="plant-name">{{ plant.plantName }}</h1>
        <p class="plant-description">{{ plant.description }}</p>
        <div class="calendar-link-section" v-if="plant.plantingCalendar">
          <router-link
            :to="{
              name: 'PlantingCalendar',
              params: { plantName: plant.plantName },
              query: {
                hemisphere: this.hemisphere, // Pass received hemisphere
                recommendedPlantNames: this.recommendedPlantNamesString, // Pass received string
              },
            }"
            class="btn btn-primary"
          >
            View Planting Calendar
          </router-link>
        </div>
        <div v-else class="no-calendar-info">
          Planting calendar information is not yet available for this plant.
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="loading">Loading plant details...</div>
  <!-- Added loading state for completeness -->
  <div v-else class="error-message">Plant not found.</div>
</template>

<script>
import plantData from '@/assets/data/allPlants.json'

export default {
  name: 'PlantDetailView',
  props: {
    plantName: String,
    recommendedPlantNamesString: {
      // To receive the comma-separated string
      type: String,
      default: '',
    },
    hemisphere: {
      // To receive the hemisphere
      type: String,
      default: 'southern', // Default if not provided
    },
  },
  data() {
    return {
      plant: null, // Initialize plant as null
      loading: true, // Added loading state
    }
  },
  methods: {
    getPlantImage(plant) {
      if (!plant || !plant.plantName) return '/images/plants/default-plant.jpg'
      return `/images/plants/${encodeURIComponent(plant.plantName)}.jpg`
    },
    handleImageError(event) {
      const currentSrc = event.target.src
      // Attempt to load .png if .jpg fails, then default
      if (currentSrc.endsWith('.jpg')) {
        event.target.src = currentSrc.replace('.jpg', '.png')
      } else {
        event.target.src = '/images/plants/default-plant.jpg'
      }
      event.target.onerror = null // Prevent infinite loop if .png also fails or is the default
    },
    goBack() {
      this.$router.go(-1)
    },
    loadPlantData() {
      this.loading = true
      const found = plantData.find(
        (item) => item.plantName.toLowerCase() === this.plantName.toLowerCase(),
      )
      if (found) {
        this.plant = found
      } else {
        // If not found in allPlants.json, create a basic object to prevent errors
        // Or, you might want to show an error message and not set this.plant
        this.plant = {
          plantName: this.plantName,
          description:
            'No detailed description available. Planting calendar may still be accessible if data exists elsewhere.',
        }
      }
      this.loading = false
    },
  },
  created() {
    this.loadPlantData()
  },
  watch: {
    plantName() {
      // Watch for changes in plantName prop (e.g., if route changes)
      this.loadPlantData()
    },
  },
}
</script>

<style scoped>
.plant-detail-container {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background-color: #f7f7f7;
}

.back-button-wrapper {
  width: 100%;
  max-width: 1000px;
  margin-bottom: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  background-color: #0a3200;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #165a00;
}

.back-icon {
  margin-right: 8px;
  font-size: 1.2rem;
}

.plant-detail-card {
  display: flex;
  flex-direction: row;
  background-color: white;
  max-width: 1000px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.plant-image-wrapper {
  flex: 1;
  background-color: #f0f7e6; /* Light green background for image area */
  min-height: 300px; /* Ensure wrapper has some height */
}

.plant-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plant-info-wrapper {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.plant-name {
  font-size: 2rem;
  color: #0a3200;
  margin-bottom: 20px;
}

.plant-description {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 25px; /* Add margin for spacing */
}

.calendar-link-section {
  margin-top: auto; /* Pushes button to the bottom if content is short */
}

.no-calendar-info {
  font-style: italic;
  color: #666;
  margin-top: 20px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: var(--color-primary, #0a3200);
  color: white;
}

.btn-primary:hover {
  background-color: #072200; /* Darken primary color on hover */
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 20px;
  font-size: 1.2em;
}

@media (max-width: 768px) {
  .plant-detail-card {
    flex-direction: column;
  }

  .plant-image-wrapper {
    min-height: 250px; /* Adjust for smaller screens */
  }

  .plant-info-wrapper {
    padding: 20px;
  }

  .back-button-wrapper {
    padding: 0 10px;
  }
}
</style>
