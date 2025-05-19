<template>
  <div class="chart-container">
    <h2>Plant Growth Requirements</h2>
    <div class="filter-options">
      <div class="toggle-buttons">
        <button
          v-for="view in viewOptions"
          :key="view.value"
          @click="switchView(view.value)"
          :class="{ active: currentView === view.value }"
        >
          {{ view.label }}
        </button>
      </div>
    </div>
    <!-- Canvas with unique ID -->
    <div class="chart-wrapper">
      <canvas v-if="canvasReady" :id="chartCanvasId"></canvas>
      <div v-else class="loading">Loading chart...</div>
    </div>
  </div>
</template>

<script>
// Import Vue functionality
import { onMounted, ref, computed, watch, onBeforeUnmount } from 'vue'

// Create a unique ID for this component instance
const generateUniqueId = () => `plant-chart-${Math.random().toString(36).substring(2, 10)}`

export default {
  name: 'PlantRequirementsChart',
  props: {
    plantsData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    // Generate a unique ID for this component
    const componentId = generateUniqueId()
    const chartCanvasId = `${componentId}-canvas`

    // State
    const currentView = ref('sunwater')
    const canvasReady = ref(false)
    const chart = ref(null)

    // Options
    const viewOptions = [
      { label: 'Sunlight and Water Requirements', value: 'sunwater' },
      { label: 'Growth Cycle', value: 'growth' },
    ]

    // Function to safely destroy chart
    const destroyChart = () => {
      if (chart.value) {
        // First make sure the chart is not updating
        if (chart.value.animating) {
          chart.value.stop()
        }

        // Then destroy it
        chart.value.destroy()
        chart.value = null

        console.log('Chart destroyed successfully')
      }
    }

    // Switch view safely
    const switchView = async (view) => {
      if (currentView.value === view) return

      // Set the new view
      currentView.value = view

      // Hide canvas during transition
      canvasReady.value = false

      // Destroy existing chart
      destroyChart()

      // Wait for DOM to update
      setTimeout(() => {
        // Recreate the chart with the new view
        renderChart()
      }, 100)
    }

    // Process data for charts
    const processChartData = () => {
      if (!props.plantsData || props.plantsData.length === 0) {
        return { sunwaterData: [], growthData: [] }
      }

      // Create Maps to ensure unique entries
      const plantSunWaterMap = new Map()
      const plantGrowthMap = new Map()

      // Process each data item
      props.plantsData.forEach((plant) => {
        if (!plant || !plant.plant_common_name) return

        const name = plant.plant_common_name.trim()
        if (!name) return

        // Process sunlight and water data
        if (plant.sunlight_requirement && plant.water_requirement) {
          plantSunWaterMap.set(name, {
            name,
            sunlight: plant.sunlight_requirement,
            water: plant.water_requirement,
          })
        }

        // Process growth data
        if (plant.growth_duration_weeks) {
          const weeks = Number(plant.growth_duration_weeks)
          if (weeks > 0) {
            plantGrowthMap.set(name, { name, weeks })
          }
        }
      })

      // Convert Maps to arrays
      const sunwaterData = Array.from(plantSunWaterMap.values())
      const growthData = Array.from(plantGrowthMap.values()).sort((a, b) => a.weeks - b.weeks)

      return { sunwaterData, growthData }
    }

    // Render the appropriate chart
    const renderChart = async () => {
      // Ensure Chart.js is available
      if (typeof Chart === 'undefined') {
        console.error('Chart.js is not available')
        return
      }

      try {
        // Make sure any previous chart is destroyed
        destroyChart()

        // Get the canvas element
        const canvas = document.getElementById(chartCanvasId)
        if (!canvas) {
          console.error(`Canvas element with ID ${chartCanvasId} not found`)
          return
        }

        // Get processed data
        const { sunwaterData, growthData } = processChartData()

        // Render appropriate chart
        if (currentView.value === 'sunwater') {
          renderSunWaterChart(canvas, sunwaterData)
        } else {
          renderGrowthChart(canvas, growthData)
        }

        // Show canvas
        canvasReady.value = true
      } catch (error) {
        console.error('Error rendering chart:', error)
      }
    }

    // Render sunlight and water requirements chart
    const renderSunWaterChart = (canvas, data) => {
      if (!data || data.length === 0) {
        console.error('No sunlight/water data available')
        return
      }

      // Conversion maps
      const sunlightValues = {
        'Full Sun': 3,
        'Part Sun': 2,
        Shade: 1,
      }

      const waterValues = {
        High: 3,
        Moderate: 2,
        Low: 1,
      }

      // Create scatter data
      const scatterData = data
        .map((plant) => ({
          x: waterValues[plant.water] || 0,
          y: sunlightValues[plant.sunlight] || 0,
          name: plant.name,
        }))
        .filter((item) => item.x > 0 && item.y > 0)

      if (scatterData.length === 0) {
        console.error('No valid scatter plot data')
        return
      }

      // Create chart with unique ID
      const ctx = canvas.getContext('2d')
      chart.value = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Plants',
              data: scatterData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              pointRadius: 10,
              pointHoverRadius: 12,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const plantName = context.raw.name || ''
                  const plant = data.find((p) => p.name === plantName)
                  if (!plant) return plantName
                  return `${plant.name}: Water-${plant.water}, Sunlight-${plant.sunlight}`
                },
              },
            },
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Water Requirement',
                font: { weight: 'bold' },
              },
              ticks: {
                callback: (value) => ['', 'Low', 'Medium', 'High'][value] || '',
              },
              min: 0.5,
              max: 3.5,
            },
            y: {
              title: {
                display: true,
                text: 'Sunlight Requirement',
                font: { weight: 'bold' },
              },
              ticks: {
                callback: (value) => ['', 'Shade', 'Part Sun', 'Full Sun'][value] || '',
              },
              min: 0.5,
              max: 3.5,
            },
          },
        },
      })
    }

    // Render growth cycle chart
    const renderGrowthChart = (canvas, data) => {
      if (!data || data.length === 0) {
        console.error('No growth data available')
        return
      }

      // Limit number of displayed plants
      const displayPlants = data.slice(0, 10)

      // Colors
      const colors = [
        '#8dd3c7',
        '#ffffb3',
        '#bebada',
        '#fb8072',
        '#80b1d3',
        '#fdb462',
        '#b3de69',
        '#fccde5',
        '#d9d9d9',
        '#bc80bd',
      ]

      // Create chart with unique ID
      const ctx = canvas.getContext('2d')
      chart.value = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: displayPlants.map((p) => p.name),
          datasets: [
            {
              label: 'Growth Cycle (weeks)',
              data: displayPlants.map((p) => p.weeks),
              backgroundColor: displayPlants.map((_, i) => colors[i % colors.length]),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Plant Growth Cycle (Weeks to Maturity)',
              font: { size: 16, weight: 'bold' },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Weeks',
                font: { weight: 'bold' },
              },
            },
          },
        },
      })
    }

    // Handle component lifecycle
    onMounted(() => {
      // Delayed initialization to ensure DOM is ready
      setTimeout(() => {
        canvasReady.value = true
        // Wait for canvas to be rendered
        setTimeout(renderChart, 100)
      }, 100)
    })

    // Watch for data changes
    watch(
      () => props.plantsData,
      (newData) => {
        if (newData && newData.length > 0) {
          // Delay update to ensure reactivity is settled
          setTimeout(renderChart, 100)
        }
      },
      { deep: true },
    )

    // Clean up on unmount
    onBeforeUnmount(() => {
      destroyChart()
    })

    return {
      chartCanvasId,
      currentView,
      viewOptions,
      canvasReady,
      switchView,
    }
  },
}
</script>

<style scoped>
.chart-container {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.filter-options {
  margin-bottom: 20px;
}

.toggle-buttons {
  display: flex;
  gap: 10px;
}

.toggle-buttons button {
  padding: 8px 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-buttons button.active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.chart-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-style: italic;
  color: #666;
}
</style>
