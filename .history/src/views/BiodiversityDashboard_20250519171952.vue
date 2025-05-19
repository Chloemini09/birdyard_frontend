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
          throw new Error(`HTTP ERROR: ${response.status}`)
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
            console.error('CSV Error:', parseError)
            error.value = `CSV Error: ${parseError.message}`
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
  max-width: 1500px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Montserrat', 'Arial', sans-serif;
  background-color: #f9fafb;
  color: #374151;
}

.layout-page-container {
  font-family: 'Montserrat', 'Arial', sans-serif;
  color: #374151;
}

/* Banner Section */
.contact-banner {
  height: 50vh;
  min-height: 450px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/layout/Layout.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 40px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: all 0.3s ease;
}

.contact-banner:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.banner-overlay {
  max-width: 800px;
  padding: 0 30px;
  animation: fadeIn 1.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.contact-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #f3f9c0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
}

.contact-subtitle {
  font-size: 1.4rem;
  color: #ffffff;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
  font-weight: 300;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 25px;
  border-bottom: 2px solid #e5e7eb;
}

.dashboard-header h1 {
  color: #1f2937;
  margin-bottom: 15px;
  font-weight: 700;
}

.dashboard-header p {
  color: #6b7280;
  font-size: 1.2rem;
  line-height: 1.6;
}

.data-info {
  margin-bottom: 25px;
  padding: 15px;
  background-color: #f0f9ff;
  border-radius: 8px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0f2fe;
}

.refresh-button {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.refresh-button:hover {
  background-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.refresh-button:active {
  transform: translateY(0);
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.loading-container,
.error-container,
.no-data-container {
  text-align: center;
  padding: 70px;
  background: #ffffff;
  border-radius: 12px;
  margin: 40px 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #f3f4f6;
}

.loading-spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #10b981;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1.5s linear infinite;
  margin: 0 auto 25px;
}

.retry-button {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-top: 25px;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 1024px) {
  .contact-title {
    font-size: 3rem;
  }
  .contact-subtitle {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .chart-row {
    grid-template-columns: 1fr;
  }
  .contact-banner {
    min-height: 350px;
  }
  .contact-title {
    font-size: 2.5rem;
  }
  .loading-container,
  .error-container,
  .no-data-container {
    padding: 40px;
  }
}
</style>
