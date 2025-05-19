<template>
  <div class="chart-container">
    <h2>Plant Growth Requirements</h2>
    <div class="filter-options">
      <div class="toggle-buttons">
        <button
          v-for="view in viewOptions"
          :key="view.value"
          @click="currentView = view.value"
          :class="{ active: currentView === view.value }"
        >
          {{ view.label }}
        </button>
      </div>
    </div>
    <div class="chart-wrapper">
      <canvas ref="chartContainer" class="chart"></canvas>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, nextTick, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'PlantRequirementsChart',
  props: {
    plantsData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const chartContainer = ref(null)
    const chart = ref(null)
    const viewOptions = [
      { label: 'Sunlight and Water Requirements', value: 'sunwater' },
      { label: 'Growth Cycle', value: 'growth' },
    ]
    const currentView = ref('sunwater')
    const chartInitialized = ref(false)

    // Ensure chart is destroyed on component unmount
    onBeforeUnmount(() => {
      if (chart.value) {
        chart.value.destroy()
        chart.value = null
      }
    })

    onMounted(async () => {
      console.log(
        'PlantRequirementsChart component mounted, data status:',
        props.plantsData?.length || 0,
      )

      // Wait for next DOM update cycle
      await nextTick()

      // Only initialize if we have data
      if (props.plantsData && props.plantsData.length > 0) {
        initializeChart()
      }
    })

    // Initialize chart only once
    const initializeChart = async () => {
      if (chartInitialized.value) return

      // Wait a moment for DOM to be fully ready
      await new Promise((resolve) => setTimeout(resolve, 50))

      if (chartContainer.value) {
        updateChart()
        chartInitialized.value = true
      }
    }

    const updateChart = async () => {
      console.log('Updating plant requirements chart, data status:', props.plantsData?.length || 0)

      // Destroy previous chart instance if it exists
      if (chart.value) {
        chart.value.destroy()
        chart.value = null
      }

      // Exit if container or data is missing
      if (!chartContainer.value || !props.plantsData || props.plantsData.length === 0) {
        console.error('Missing chart container or data')
        return
      }

      try {
        // Ensure DOM is ready
        await nextTick()

        // Get fresh canvas context
        const ctx = chartContainer.value.getContext('2d')
        if (!ctx) {
          console.error('Could not get canvas context')
          return
        }

        // Process and deduplicate data before rendering
        const processedData = preprocessData()
        if (
          !processedData ||
          (currentView.value === 'sunwater' &&
            (!processedData.plantsList || processedData.plantsList.length === 0)) ||
          (currentView.value === 'growth' &&
            (!processedData.sortedPlants || processedData.sortedPlants.length === 0))
        ) {
          console.error('Insufficient processed data for chart')
          return
        }

        // Render appropriate chart based on current view
        if (currentView.value === 'sunwater') {
          renderSunlightWaterChart(ctx, processedData.plantsList)
        } else {
          renderGrowthDurationChart(ctx, processedData.sortedPlants)
        }
      } catch (error) {
        console.error('Error creating chart:', error)
      }
    }

    // Process and deduplicate data
    const preprocessData = () => {
      if (!props.plantsData || !Array.isArray(props.plantsData)) return null

      // Deduplicate plants and collect their data
      const plantCharacteristics = {}
      const plantGrowth = {}

      // Process each data row
      props.plantsData.forEach((row) => {
        if (!row || !row.plant_common_name) return

        const plantName = row.plant_common_name.trim()
        if (!plantName) return

        // Store plant characteristics for sunlight/water chart
        if (row.sunlight_requirement && row.water_requirement) {
          if (!plantCharacteristics[plantName]) {
            plantCharacteristics[plantName] = {
              name: plantName,
              sunlight: row.sunlight_requirement,
              water: row.water_requirement,
            }
          }
        }

        // Store plant growth data
        if (row.growth_duration_weeks) {
          const growth = Number(row.growth_duration_weeks)
          if (growth > 0 && (!plantGrowth[plantName] || growth > plantGrowth[plantName])) {
            plantGrowth[plantName] = growth
          }
        }
      })

      // Convert to arrays and sort
      const plantsList = Object.values(plantCharacteristics)

      const sortedPlants = Object.entries(plantGrowth)
        .filter(([_, duration]) => duration > 0)
        .sort((a, b) => a[1] - b[1])
        .map(([name, duration]) => ({ name, duration }))

      return { plantsList, sortedPlants }
    }

    const renderSunlightWaterChart = (ctx, plantsList) => {
      if (!plantsList || plantsList.length === 0) return

      // Convert to scatter plot numerical values
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

      // Create scatter plot data with proper filtering
      const scatterData = plantsList
        .map((plant) => ({
          x: waterValues[plant.water] || 0,
          y: sunlightValues[plant.sunlight] || 0,
          label: plant.name,
        }))
        .filter((item) => item.x > 0 && item.y > 0)

      if (scatterData.length === 0) {
        console.error('No valid scatter plot data after processing')
        return
      }

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
                  const plant = plantsList.find((p) => p.name === context.raw.label)
                  if (!plant) return context.raw.label
                  return `${plant.name}: Water-${plant.water}, Sunlight-${plant.sunlight}`
                },
              },
            },
            legend: {
              display: false, // Hide legend for cleaner appearance
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Water Requirement',
                font: {
                  weight: 'bold',
                },
              },
              ticks: {
                callback: (value) => {
                  return ['', 'Low', 'Medium', 'High'][value] || ''
                },
              },
              min: 0.5,
              max: 3.5,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Sunlight Requirement',
                font: {
                  weight: 'bold',
                },
              },
              ticks: {
                callback: (value) => {
                  return ['', 'Shade', 'Part Sun', 'Full Sun'][value] || ''
                },
              },
              min: 0.5,
              max: 3.5,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
          },
        },
      })
    }

    const renderGrowthDurationChart = (ctx, sortedPlants) => {
      if (!sortedPlants || sortedPlants.length === 0) return

      // Ensure unique entries by name
      const uniquePlants = []
      const seenPlants = new Set()

      sortedPlants.forEach((plant) => {
        if (!seenPlants.has(plant.name)) {
          uniquePlants.push(plant)
          seenPlants.add(plant.name)
        }
      })

      // Limit number of data points to avoid overcrowding
      const displayPlants = uniquePlants.slice(0, 10)

      // Create color array of appropriate length
      const colorPalette = [
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

      const colors = displayPlants.map((_, i) => colorPalette[i % colorPalette.length])

      chart.value = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: displayPlants.map((p) => p.name),
          datasets: [
            {
              label: 'Growth Cycle (weeks)',
              data: displayPlants.map((p) => p.duration),
              backgroundColor: colors,
              borderColor: colors.map((color) =>
                color.replace(')', ', 0.8)').replace('rgb', 'rgba'),
              ),
              borderWidth: 1,
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
              font: {
                size: 16,
                weight: 'bold',
              },
              padding: {
                bottom: 20,
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `${context.label}: ${context.raw} weeks`
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Weeks',
                font: {
                  weight: 'bold',
                },
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
          animation: {
            duration: 500,
          },
        },
      })
    }

    // Watch for data changes with debounce
    let dataChangeTimeout = null
    watch(
      () => props.plantsData,
      async (newValue) => {
        console.log('Plant data updated, data amount:', newValue?.length || 0)

        // Clear previous timeout
        if (dataChangeTimeout) clearTimeout(dataChangeTimeout)

        // Debounce updates
        dataChangeTimeout = setTimeout(async () => {
          if (newValue && newValue.length > 0) {
            if (!chartInitialized.value) {
              await initializeChart()
            } else {
              await updateChart()
            }
          }
        }, 100)
      },
      { deep: true },
    )

    // Watch for view type changes
    watch(() => currentView.value, updateChart)

    return {
      chartContainer,
      viewOptions,
      currentView,
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
  height: 400px; /* Increased height for better visualization */
  width: 100%;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
