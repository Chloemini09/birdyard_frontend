<template>
  <div class="biodiversity-dashboard">
    <!-- Hero Banner Section -->
    <section class="hero-banner">
      <div class="hero-overlay">
        <div class="hero-content">
          <h1 class="hero-title">Birds on the Move</h1>
          <div class="hero-subtitle-group">
            <p class="hero-subtitle primary">Discover, Track, and Support Native Species</p>
            <p class="hero-subtitle secondary">Live Bird Migration Tracking & Data Insights</p>
            <p class="hero-subtitle accent">Follow the Flight Path - Real-Time Migration Data</p>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">{{ biodiversityData.length || 0 }}</span>
              <span class="stat-label">Species Tracked</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">Real-time</span>
              <span class="stat-label">Data Updates</span>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-scroll-indicator">
        <a href="#interactive-migration-map" class="scroll-link">
          <div class="scroll-arrow"></div>
        </a>
      </div>
    </section>

    <!-- Interactive Map Section -->
    <section id="interactive-migration-map" class="map-section">
      <div class="section-container">
        <div class="section-header">
          <div class="header-content">
            <h2 class="section-title">Interactive Migration Map</h2>
            <p class="section-description">
              Explore live bird migration patterns across Australia. Select a species to track their
              journey and discover their seasonal movements.
            </p>
          </div>
          <div class="header-decoration"></div>
        </div>

        <div class="map-wrapper">
          <div class="map-container">
            <InteractiveMap />
          </div>
        </div>
      </div>
    </section>

    <!-- Loading States -->
    <div v-if="loading" class="state-container loading-state">
      <div class="loading-content">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <h3 class="state-title">Loading Migration Data</h3>
        <p class="state-message">Gathering the latest bird movement information...</p>
      </div>
    </div>

    <div v-else-if="error" class="state-container error-state">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <h3 class="state-title">Loading Error</h3>
        <p class="state-message">{{ error }}</p>
        <button @click="loadData" class="retry-button">
          <span class="button-icon">🔄</span>
          Try Again
        </button>
      </div>
    </div>

    <div v-else-if="biodiversityData.length === 0" class="state-container no-data-state">
      <div class="no-data-content">
        <div class="no-data-icon">📊</div>
        <h3 class="state-title">No Data Available</h3>
        <p class="state-message">Please ensure the correct CSV data is available.</p>
      </div>
    </div>

    <!-- Analysis Section -->
    <section v-else class="analysis-section">
      <div class="section-container">
        <div class="section-header">
          <div class="header-content">
            <h2 class="section-title">Biodiversity Analysis</h2>
            <p class="section-description">
              Comprehensive data insights and visualizations of bird migration patterns and
              biodiversity trends.
            </p>
          </div>
          <div class="header-decoration"></div>
        </div>

        <!-- Data Tables -->
        <div class="tables-grid">
          <div class="table-card">
            <div class="card-header">
              <h3 class="card-title">Species Overview</h3>
              <p class="card-subtitle">Detailed species information and statistics</p>
            </div>
            <div class="table-wrapper">
              <TableAuView />
            </div>
          </div>

          <div class="table-card">
            <div class="card-header">
              <h3 class="card-title">Migration Patterns</h3>
              <p class="card-subtitle">Regional movement and seasonal data</p>
            </div>
            <div class="table-wrapper">
              <TableTwo />
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <div class="chart-card full-width">
            <div class="card-header">
              <h3 class="card-title">Monthly Bird Activity Patterns</h3>
              <p class="card-subtitle">
                Seasonal activity trends showing when different bird species are most active
                throughout the year. Use this data to plan garden resources and optimize
                bird-watching opportunities.
              </p>
            </div>
            <div class="chart-wrapper">
              <MonthlyBirdActivityChart
                :birdsData="biodiversityData"
                ref="monthlyBirdChart"
                class="activity-chart"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section">
      <div class="cta-container">
        <div class="cta-content">
          <div class="cta-icon">🔍</div>
          <h2 class="cta-title">Discover Birds in Your Area</h2>
          <p class="cta-description">
            Want to know if the birds visiting your garden are endangered species? Use our
            AI-powered bird identification tool to learn more about your local wildlife.
          </p>
          <router-link to="/bird" class="cta-button">
            <span class="button-text">Identify Birds Now</span>
            <span class="button-arrow">→</span>
          </router-link>
        </div>
        <div class="cta-visual">
          <div class="visual-circle"></div>
          <div class="visual-dots"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import csvPath from '@/assets/data/australia_birds_plants.csv?url'

import { ref, onMounted, nextTick } from 'vue'
import Papa from 'papaparse'
import MonthlyBirdActivityChart from '@/components/MonthlyBirdActivityChart.vue'
import InteractiveMap from '@/components/InteractiveMap.vue'
import TableAuView from '@/components/TableAuView.vue'
import TableTwo from '@/components/TableTwo.vue'

export default {
  name: 'BiodiversityDashboard',
  components: {
    MonthlyBirdActivityChart,
    InteractiveMap,
    TableAuView,
    TableTwo,
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
          throw new Error('Please provide the correct CSV path.')
        }

        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors && results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors)
            }

            if (results.data && results.data.length > 0) {
              biodiversityData.value = results.data
              console.log('CSV loaded successfully!', results.data.length, 'records')
              console.log('Sample data:', results.data[0])
            } else {
              throw new Error('CSV file appears to be empty')
            }

            loading.value = false
          },
          error: (parseError) => {
            console.error('CSV parsing error:', parseError)
            error.value = `CSV parsing error: ${parseError.message}`
            loading.value = false
          },
        })
      } catch (fetchError) {
        console.error('Data loading error:', fetchError)
        error.value = `Data loading error: ${fetchError.message}`
        loading.value = false
      }
    }

    const refreshCharts = async () => {
      console.log('Refreshing charts...')
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
/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Base Styles with Green Theme */
.biodiversity-dashboard {
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  background: linear-gradient(135deg, #f0f9e8 0%, #e8f5e0 100%);
  color: #1a3a0d;
  overflow-x: hidden;
  line-height: 1.6;
}

/* Hero Banner with Green Theme */
.hero-banner {
  position: relative;
  height: 100vh;
  min-height: 600px;
  background:
    linear-gradient(
      135deg,
      rgba(26, 58, 13, 0.85) 0%,
      rgba(46, 125, 27, 0.75) 50%,
      rgba(34, 85, 19, 0.85) 100%
    ),
    url('/images/migration.jpeg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-overlay {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 900px;
  padding: 0 2rem;
}

.hero-content {
  animation: heroFadeIn 1.5s ease-out;
}

@keyframes heroFadeIn {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 2rem;
  text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.hero-subtitle-group {
  margin-bottom: 3rem;
}

.hero-subtitle {
  margin: 0.5rem 0;
  font-weight: 400;
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle.primary {
  font-size: 1.5rem;
  color: #a8d982;
  font-weight: 500;
}

.hero-subtitle.secondary {
  font-size: 1.2rem;
  color: #c7e8b5;
}

.hero-subtitle.accent {
  font-size: 1.1rem;
  color: #d4f0c5;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  padding: 1.5rem 2rem;
  background: rgba(72, 150, 45, 0.15);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(168, 217, 130, 0.3);
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #a8d982;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: #c7e8b5;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 2rem;
  background: rgba(168, 217, 130, 0.4);
}

.hero-scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s infinite;
}

.scroll-link {
  display: block;
  text-decoration: none;
  padding: 1rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.scroll-link:hover {
  background: rgba(168, 217, 130, 0.2);
  transform: scale(1.1);
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

.scroll-arrow {
  width: 24px;
  height: 24px;
  border-right: 2px solid #a8d982;
  border-bottom: 2px solid #a8d982;
  transform: rotate(45deg);
}

/* Section Containers with Green Theme */
.section-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  position: relative;
  text-align: center;
  margin-bottom: 4rem;
  padding: 4rem 0 2rem;
}

.header-content {
  position: relative;
  z-index: 2;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  color: #1a3a0d;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.section-description {
  font-size: 1.2rem;
  color: #4a7c34;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #48962d, #66bb3a);
  border-radius: 2px;
}

/* Map Section with Green Theme */
.map-section {
  background: linear-gradient(135deg, #ffffff 0%, #f6fdf3 100%);
  padding: 2rem 0 4rem;
  position: relative;
}

.map-wrapper {
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(72, 150, 45, 0.15),
    0 8px 25px rgba(72, 150, 45, 0.08);
  border: 2px solid #a8d982;
}

.map-container {
  height: 1000px;
  width: 100%;
  position: relative;
}

/* State Containers with Green Theme */
.state-container {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f6fdf3 100%);
}

.loading-content,
.error-content,
.no-data-content {
  text-align: center;
  max-width: 400px;
}

.loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
}

.spinner-ring {
  position: absolute;
  width: 64px;
  height: 64px;
  border: 8px solid transparent;
  border-top-color: #48962d;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.4s;
  border-top-color: #66bb3a;
}

.spinner-ring:nth-child(3) {
  animation-delay: -0.8s;
  border-top-color: #7acc4a;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-icon,
.no-data-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.state-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a3a0d;
  margin-bottom: 1rem;
}

.state-message {
  font-size: 1.1rem;
  color: #4a7c34;
  margin-bottom: 2rem;
}

.retry-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #48962d, #66bb3a);
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(72, 150, 45, 0.3);
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(72, 150, 45, 0.4);
  background: linear-gradient(135deg, #529935, #73c641);
}

.button-icon {
  font-size: 1.2rem;
}

/* Analysis Section with Green Theme */
.analysis-section {
  background: linear-gradient(135deg, #f0f9e8 0%, #e8f5e0 100%);
  padding: 4rem 0;
}

.tables-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.table-card,
.chart-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafffe 100%);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow:
    0 10px 40px rgba(72, 150, 45, 0.08),
    0 4px 15px rgba(72, 150, 45, 0.05);
  border: 1px solid #c7e8b5;
  transition: all 0.3s ease;
}

.table-card:hover,
.chart-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 20px 60px rgba(72, 150, 45, 0.12),
    0 8px 25px rgba(72, 150, 45, 0.08);
  border-color: #a8d982;
}

.card-header {
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #f6fdf3 0%, #ecf7e5 100%);
  border-bottom: 1px solid #d4f0c5;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a3a0d;
  margin-bottom: 0.5rem;
}

.card-subtitle {
  font-size: 1rem;
  color: #4a7c34;
  line-height: 1.5;
}

.table-wrapper,
.chart-wrapper {
  padding: 2rem;
  min-height: 500px;
}

.charts-section {
  margin-top: 2rem;
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.activity-chart {
  width: 100%;
  min-height: 600px;
}

/* CTA Section with Dark Green Theme */
.cta-section {
  background: linear-gradient(135deg, #1a3a0d 0%, #2e551b 100%);
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
}

.cta-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  align-items: center;
}

.cta-content {
  text-align: left;
}

.cta-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.cta-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.cta-description {
  font-size: 1.2rem;
  color: #c7e8b5;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, #48962d, #66bb3a);
  color: #ffffff;
  text-decoration: none;
  padding: 1.2rem 2.5rem;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 8px 30px rgba(72, 150, 45, 0.3);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(72, 150, 45, 0.4);
  background: linear-gradient(135deg, #529935, #73c641);
}

.button-text {
  font-weight: 600;
}

.button-arrow {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.cta-button:hover .button-arrow {
  transform: translateX(4px);
}

.cta-visual {
  position: relative;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(72, 150, 45, 0.3), rgba(102, 187, 58, 0.2));
  border: 2px solid rgba(168, 217, 130, 0.4);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.visual-dots {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(168, 217, 130, 0.5) 2px, transparent 2px),
    radial-gradient(circle at 70% 60%, rgba(102, 187, 58, 0.4) 2px, transparent 2px),
    radial-gradient(circle at 50% 80%, rgba(122, 204, 74, 0.3) 2px, transparent 2px);
  background-size:
    50px 50px,
    80px 80px,
    60px 60px;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .stat-divider {
    width: 2rem;
    height: 1px;
  }

  .tables-grid {
    grid-template-columns: 1fr;
  }

  .cta-container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .cta-content {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .section-container {
    padding: 0 1rem;
  }

  .hero-banner {
    background-attachment: scroll;
  }

  .map-wrapper {
    border-radius: 1rem;
  }

  .map-container {
    height: 600px;
  }

  .table-wrapper,
  .chart-wrapper {
    padding: 1.5rem;
    min-height: 400px;
  }

  .tables-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    padding: 1.5rem 1.5rem 1rem;
  }

  .table-wrapper,
  .chart-wrapper {
    padding: 1rem 1.5rem 1.5rem;
  }

  .cta-section {
    padding: 4rem 0;
  }

  .visual-circle {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 480px) {
  .hero-stats {
    padding: 1rem;
  }

  .stat-number {
    font-size: 1.4rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .map-container {
    height: 450px;
  }

  .table-wrapper,
  .chart-wrapper {
    padding: 1rem;
    min-height: 350px;
  }
}
</style>
