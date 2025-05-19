<template>
  <div class="biodiversity-dashboard">
    <header class="dashboard-header">
      <h1>Australian Backyard Biodiversity</h1>
      <p>Discover the perfect plants to attract native birds to your garden</p>
    </header>

    <div class="charts-container">
      <div class="chart-row">
        <BirdPlantPreferenceChart :birdsData="biodiversityData" />
        <MonthlyBirdActivityChart :birdsData="biodiversityData" />
      </div>

      <div class="chart-row">
        <PlantRegionSuitabilityMap :plantsData="biodiversityData" />
        <PlantRequirementsChart :plantsData="biodiversityData" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import BirdPlantPreferenceChart from '@/components/BirdPlantPreferenceChart.vue'
import MonthlyBirdActivityChart from '@/components/MonthlyBirdActivityChart.vue'
import PlantRegionSuitabilityMap from '@/components/PlantRegionSuitabilityMap.vue'
import PlantRequirementsChart from '@/components/PlantRequirementsChart.vue'

export default {
  name: 'BiodiversityDashboard',
  components: {
    BirdPlantPreferenceChart,
    MonthlyBirdActivityChart,
    PlantRegionSuitabilityMap,
    PlantRequirementsChart,
  },
  setup() {
    const biodiversityData = ref([])

    onMounted(async () => {
      try {
        // Load the JSON data
        const response = await fetch('/assets/data/australia_birds_plants.json')
        biodiversityData.value = await response.json()
      } catch (error) {
        console.error('Error loading biodiversity data:', error)
      }
    })

    return {
      biodiversityData,
    }
  },
}
</script>

<style scoped>
.biodiversity-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}

.dashboard-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.dashboard-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .chart-row {
    grid-template-columns: 1fr;
  }
}
</style>
