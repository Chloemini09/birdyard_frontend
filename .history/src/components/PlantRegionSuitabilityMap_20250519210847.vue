<template>
  <div class="chart-container">
    <h2>Plant Region Suitability</h2>
    <div class="plant-selector">
      <label for="plant-view">View Mode:</label>
      <select id="plant-view" v-model="viewType" @change="updateChart">
        <option value="all">All Plants</option>
        <option value="individual">Individual Plant</option>
      </select>

      <div v-if="viewType === 'individual'" class="plant-dropdown">
        <label for="plant-select">Select Plant:</label>
        <select id="plant-select" v-model="selectedPlant" @change="updateChart">
          <option v-for="plant in plantsList" :key="plant" :value="plant">
            {{ plant }}
          </option>
        </select>
      </div>
    </div>
    <!-- Using canvas tag instead of div -->
    <canvas ref="chartContainer" class="heatmap-chart"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'PlantRegionSuitabilityMap',
  props: {
    plantsData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const chartContainer = ref(null)
    const chart = ref(null)
    const viewType = ref('individual') // Default view is individual plant
    const selectedPlant = ref('')
    const plantsList = ref([])
    const states = ['NSW', 'QLD', 'SA', 'VIC', 'WA']

    onMounted(async () => {
      console.log(
        'PlantRegionSuitabilityMap component mounted, data status:',
        props.plantsData?.length || 0,
      )
      if (props.plantsData && props.plantsData.length > 0) {
        // Extract unique plants
        const plants = [...new Set(props.plantsData.map((item) => item.plant_common_name))].filter(
          Boolean,
        )
        plantsList.value = plants
        selectedPlant.value = plants[0] || ''

        await nextTick()
        updateChart()
      } else {
        console.log('Plant data not yet loaded')
      }
    })

    const updateChart = async () => {
      console.log(
        'Attempting to update plant region suitability chart, data status:',
        props.plantsData?.length || 0,
      )

      // Strictly check data and DOM elements
      if (!chartContainer.value) {
        console.error('Chart container element does not exist or is not mounted')
        return
      }

      // Check if data is valid
      if (!props.plantsData || !Array.isArray(props.plantsData) || props.plantsData.length === 0) {
        console.error('Plant data is invalid or empty')
        return
      }

      try {
        // Prepare data
        let datasets = []

        if (viewType.value === 'individual') {
          if (!selectedPlant.value) {
            console.error('No plant selected')
            return
          }

          // Validate selected plant data
          const validPlantData = props.plantsData.filter(
            (item) => item && item.plant_common_name === selectedPlant.value && item.state,
          )

          if (validPlantData.length === 0) {
            console.error('No valid data found for selected plant')
            return
          }

          // Get plant suitability data
          const plantData = {}

          // Initialize to zero
          states.forEach((state) => {
            plantData[state] = 0
          })

          // Calculate observation count for this plant in each state
          validPlantData.forEach((item) => {
            if (plantData[item.state] !== undefined) {
              plantData[item.state]++
            }
          })

          // Get suitable regions for this plant
          const plantInfo = validPlantData.find((item) => true)
          const suitableRegions = plantInfo?.suitable_regions || ''

          // Process suitable regions text
          const suitableStates = suitableRegions.split(',').map((s) => s.trim())

          datasets = [
            {
              label: selectedPlant.value,
              data: states.map((state) => {
                // Higher value if officially suitable
                const isSuitable = suitableStates.includes(state) ? 1 : 0
                // Add observation count factor
                return isSuitable + plantData[state] / 100
              }),
              backgroundColor: '#4caf50',
            },
          ]
        } else {
          // Create simplified dataset for all plants
          const uniquePlants = [
            ...new Set(props.plantsData.map((item) => item.plant_common_name)),
          ].filter(Boolean)

          // Limit number of plants to avoid too much data
          const displayPlants = uniquePlants.slice(0, 5)

          datasets = displayPlants.map((plant, index) => {
            // Get suitable regions for this plant
            const plantInfo = props.plantsData.find((item) => item.plant_common_name === plant)
            const suitableRegions = plantInfo?.suitable_regions || ''
            const suitableStates = suitableRegions.split(',').map((s) => s.trim())

            return {
              label: plant,
              data: states.map((state) => (suitableStates.includes(state) ? 1 : 0)),
              backgroundColor: getPlantColor(index),
            }
          })
        }

        // Destroy old chart (if exists)
        if (chart.value) {
          chart.value.destroy()
        }

        // Force wait for DOM update
        await nextTick()

        // Create new chart - ensure element is ready
        const ctx = chartContainer.value.getContext('2d')
        if (!ctx) {
          console.error('Could not get canvas context')
          return
        }

        if (viewType.value === 'individual') {
          // For individual plant - use bar chart
          chart.value = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: states,
              datasets: datasets,
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: `${selectedPlant.value} Suitability by Region`,
                  font: { size: 16 },
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      return context.raw > 1
                        ? 'Highly Suitable'
                        : context.raw > 0
                          ? 'Suitable'
                          : 'Not Suitable'
                    },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 2,
                  ticks: {
                    callback: (value) => {
                      return value > 1 ? 'Highly Suitable' : value > 0 ? 'Suitable' : 'Not Suitable'
                    },
                  },
                },
              },
            },
          })
        } else {
          // Simplified heatmap: use grouped bar chart instead
          chart.value = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: states,
              datasets: datasets,
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Plant Region Suitability',
                  font: { size: 16 },
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const plant = context.dataset.label
                      const state = context.label
                      return context.raw > 0
                        ? `${plant} is suitable for growing in ${state}`
                        : `${plant} is not suitable for growing in ${state}`
                    },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 1,
                  ticks: {
                    callback: (value) => {
                      return value > 0 ? 'Suitable' : 'Not Suitable'
                    },
                  },
                },
              },
            },
          })
        }
      } catch (error) {
        console.error('Error creating chart:', error)
      }
    }

    const getPlantColor = (index) => {
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
      return colors[index % colors.length]
    }

    // Watch for data changes
    watch(
      () => props.plantsData,
      async (newValue) => {
        console.log('Plant data updated, data amount:', newValue?.length || 0)
        if (newValue && newValue.length > 0) {
          // Extract unique plants
          const plants = [...new Set(newValue.map((item) => item.plant_common_name))].filter(
            Boolean,
          )
          plantsList.value = plants

          if (!selectedPlant.value && plants.length > 0) {
            selectedPlant.value = plants[0]
          }

          await nextTick()
          updateChart()
        }
      },
      { deep: true },
    )

    // Watch for view type and selected plant changes
    watch([() => viewType.value, () => selectedPlant.value], updateChart)

    return {
      chartContainer,
      viewType,
      selectedPlant,
      plantsList,
      updateChart,
    }
  },
}
</script>

<style scoped>
.chart-container {
  height: 600px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}
.plant-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}
.plant-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
}
.heatmap-chart {
  height: 200px;
  width: 100%;
}
select {
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;
}
</style>
