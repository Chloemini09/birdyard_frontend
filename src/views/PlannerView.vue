<template>
  <div class="planner-container">
    <div v-for="(plant, index) in displayedPlants" :key="index" class="plant-item">
      
      <div class="plant-image">
        <img :src="plant.image" alt="Plant Image" @error="handleImageError" />
      </div>

      <div class="plant-details">
        <div class="plant-text">
          <h3 class="plant-category">{{ plant.category }}</h3>
          <h1 class="plant-title">{{ plant.title }}</h1>
          <p class="plant-description">{{ plant.description }}</p>
        </div>

        <div class="plant-meta">
          <p><strong>Year:</strong> {{ plant.year }}</p>
          <p><strong>City:</strong> {{ plant.city }}</p>
          <p><strong>Designer:</strong> {{ plant.designer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import nectarImage from '@/assets/images/nectar.jpg'
import dryMeadowImage from '@/assets/images/dry-meadow.jpg'
import woodlandImage from '@/assets/images/woodland.jpg'
import defaultPlantImage from '@/assets/images/default-plant.jpg'

const displayedPlants = [
  {
    category: 'NECTAR CORRIDOR',
    title: 'Nectar Corridor Garden',
    description: 'A corridor garden designed to attract pollinators like birds and bees with nectar-rich native plants.',
    year: 2024,
    city: 'Melbourne',
    designer: 'Birdyard Team',
    image: nectarImage,
  },
  {
    category: 'DRY NATIVE MEADOW',
    title: 'Dry Native Meadow',
    description: 'A resilient garden featuring drought-tolerant native grasses and flowering plants for a natural meadow look.',
    year: 2023,
    city: 'Adelaide',
    designer: 'Birdyard Team',
    image: dryMeadowImage,
  },
  {
    category: 'WOODLAND RETREAT',
    title: 'Woodland Retreat',
    description: 'A peaceful woodland garden using native trees and understory plants to mimic natural forest ecosystems.',
    year: 2023,
    city: 'Brisbane',
    designer: 'Birdyard Team',
    image: woodlandImage,
  },
]

const handleImageError = (event) => {
  event.target.src = defaultPlantImage
}
</script>

<style scoped>
.planner-container {
  background-color: white;
  padding: 100px 40px 40px; 
  display: flex;
  flex-direction: column;
  gap: 40px;
}


.plant-item {
  display: flex;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  align-items: center;
  gap: 30px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}


.plant-image {
  flex: 0 0 300px;
  overflow: hidden;
  border-radius: 8px;
}

.plant-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.4s ease; 
}

.plant-image img:hover {
  transform: scale(1.05);
}

.plant-details {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.plant-text {
  flex: 3;
}

.plant-category {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.plant-title {
  font-size: 2rem;
  margin-bottom: 15px;
}

.plant-description {
  font-size: 1rem;
  color: #555;
}

.plant-meta {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  flex: 1;
  min-width: 160px;
  font-size: 0.9rem;
}

.plant-meta p {
  margin-bottom: 10px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .planner-container {
    padding: 80px 20px 20px;
  }

  .plant-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .plant-details {
    flex-direction: column;
    align-items: flex-start;
  }

  .plant-meta {
    width: 100%;
  }
}
</style>
