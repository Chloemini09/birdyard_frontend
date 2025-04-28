<template>
  <div class="plant-detail-container">
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
      </div>
    </div>
  </div>
</template>

<script>
import plantData from '@/assets/data/allPlants.json'

export default {
  name: 'PlantDetailView',
  props: ['plantName'],
  data() {
    return {
      plant: {},
    }
  },
  methods: {
    getPlantImage(plant) {
      return `/images/plants/${encodeURIComponent(plant.plantName)}.jpg`
    },
    handleImageError(event) {
      event.target.src = '/images/plants/default-plant.jpg'
    },
  },
  created() {
    const found = plantData.find(
      (item) => item.plantName.toLowerCase() === this.plantName.toLowerCase(),
    )
    this.plant = found || { plantName: this.plantName, description: 'No description available.' }
  },
}
</script>

<style scoped>
.plant-detail-container {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  background-color: #f7f7f7;
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
  background-color: #f0f7e6;
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
}

@media (max-width: 768px) {
  .plant-detail-card {
    flex-direction: column;
  }

  .plant-info-wrapper {
    padding: 20px;
  }
}
</style>
