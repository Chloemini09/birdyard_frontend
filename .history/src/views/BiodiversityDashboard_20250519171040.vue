<template>
  <div class="biodiversity-dashboard">
    <section class="contact-banner">
      <div class="banner-overlay">
        <h1 class="contact-title">Australia Diversity</h1>
        <p class="contact-subtitle">Discover the best plants for attracting native birds</p>
      </div>
    </section>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <h2>Loading Error</h2>
      <p>{{ error }}</p>
      <button @click="loadData" class="retry-button">Try Again</button>
    </div>

    <div v-else-if="biodiversityData.length === 0" class="no-data-container">
      <h2>No data</h2>
      <p>Right CSV Need</p>
    </div>

    <div v-else class="charts-container">
      <div class="data-info">
        <button @click="refreshCharts" class="refresh-button">Refresh</button>
      </div>

      <div class="chart-row">
        <BirdPlantPreferenceChart :birdsData="biodiversityData" ref="birdPlantChart" />
        <MonthlyBirdActivityChart :birdsData="biodiversityData" ref="monthlyBirdChart" />
      </div>

      <div class="chart-row">
        <PlantRegionSuitabilityMap :plantsData="biodiversityData" ref="regionMapChart" />
        <PlantRequirementsChart :plantsData="biodiversityData" ref="requirementsChart" />
      </div>
    </div>
  </div>
</template>

<script>
import csvPath from '@/assets/data/australia_birds_plants.csv?url'

import { ref, onMounted, nextTick } from 'vue'
import Papa from 'papaparse'
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
    const loading = ref(true)
    const error = ref(null)
    const birdPlantChart = ref(null)
    const monthlyBirdChart = ref(null)
    const regionMapChart = ref(null)
    const requirementsChart = ref(null)

    const loadData = async () => {
      console.log('Loading...')
      loading.value = true
      error.value = null

      try {
        console.log('Loading CSV:', csvPath)
        const response = await fetch(csvPath)

        if (!response.ok) {
          throw new Error(`HTTP ERRPR: ${response.status}`)
        }

        const text = await response.text()
        console.log('CSV content:', text.substring(0, 100))

        if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
          throw new Error('Please give right CSV path.')
        }

        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors && results.errors.length > 0) {
              console.warn('CSV Error:', results.errors)
            }

            if (results.data && results.data.length > 0) {
              biodiversityData.value = results.data
              console.log('CSV loaded right!', results.data.length)
              console.log('Sample:', results.data[0])
            } else {
              throw new Error('CSV empty')
            }

            loading.value = false
          },
          error: (parseError) => {
            console.error('CSVError:', parseError)
            error.value = `CSVError: ${parseError.message}`
            loading.value = false
          },
        })
      } catch (fetchError) {
        console.error('Loading error:', fetchError)
        error.value = `Data error: ${fetchError.message}`
        loading.value = false
      }
    }

    const refreshCharts = async () => {
      console.log('Refresh Charts')
      await nextTick()

      if (birdPlantChart.value && birdPlantChart.value.updateChart) {
        birdPlantChart.value.updateChart()
      }

      if (monthlyBirdChart.value && monthlyBirdChart.value.updateChart) {
        monthlyBirdChart.value.updateChart()
      }

      if (regionMapChart.value && regionMapChart.value.updateChart) {
        regionMapChart.value.updateChart()
      }

      if (requirementsChart.value && requirementsChart.value.updateChart) {
        requirementsChart.value.updateChart()
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      biodiversityData,
      loading,
      error,
      loadData,
      refreshCharts,
      birdPlantChart,
      monthlyBirdChart,
      regionMapChart,
      requirementsChart,
    }
  },
}
</script>

<style scoped>
.biodiversity-dashboard {
  max-width: auto 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}
.layout-page-container {
  font-family: 'Arial', sans-serif;
  color: #333;
}

/* Banner Section */
.contact-banner {
  height: 40vh;
  min-height: 400px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/layout/Layout.jpg');
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

.data-info {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f0f8ff;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.refresh-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.refresh-button:hover {
  background-color: #3d8b40;
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

.loading-container,
.error-container,
.no-data-container {
  text-align: center;
  padding: 50px;
  background: #f9f9f9;
  border-radius: 8px;
  margin: 30px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  margin: 0 auto 20px;
}

.retry-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .chart-row {
    grid-template-columns: 1fr;
  }
}
</style>
