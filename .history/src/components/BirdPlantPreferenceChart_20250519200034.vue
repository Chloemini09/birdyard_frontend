<template>
  <div class="chart-container">
    <h2>Bird-Plant Preferences</h2>
    <div class="bird-selector-container">
      <div class="bird-selector-label">Select Bird:</div>
      <div class="bird-selector-buttons">
        <button
          v-for="bird in birdsList"
          :key="bird"
          class="bird-selector-button"
          :class="{ active: selectedBird === bird }"
          @click="
            selectedBird = bird
            updateChart()
          "
        >
          {{ bird }}
        </button>
      </div>
    </div>
    <!-- Using canvas tag instead of div -->
    <canvas ref="chartContainer" class="chart"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'BirdPlantPreferenceChart',
  props: {
    birdsData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const chartContainer = ref(null)
    const chart = ref(null)
    const selectedBird = ref('')
    const birdsList = ref([])

    onMounted(async () => {
      console.log(
        'BirdPlantPreferenceChart component mounted, data status:',
        props.birdsData?.length || 0,
      )
      // Wait for data to load and DOM to be mounted
      if (props.birdsData && props.birdsData.length > 0) {
        // Extract unique birds
        const birds = [...new Set(props.birdsData.map((item) => item.species_common_name))].filter(
          Boolean,
        )
        birdsList.value = birds
        selectedBird.value = birds[0] || ''

        // Wait for DOM update
        await nextTick()
        updateChart()
      } else {
        console.log('Bird data not yet loaded')
      }
    })

    const updateChart = async () => {
      console.log(
        'Attempting to update bird-plant preference chart, data status:',
        props.birdsData?.length || 0,
      )

      // Strictly check data and DOM elements
      if (!chartContainer.value) {
        console.error('Chart container element does not exist or is not mounted')
        return
      }

      // Check if data is valid
      if (!props.birdsData || !Array.isArray(props.birdsData) || props.birdsData.length === 0) {
        console.error('Bird data is invalid or empty')
        return
      }

      if (!selectedBird.value) {
        console.error('No bird selected')
        return
      }

      try {
        // Further validate data structure
        const validBirdData = props.birdsData.filter(
          (item) =>
            item && item.species_common_name === selectedBird.value && item.plant_common_name,
        )

        if (validBirdData.length === 0) {
          console.error('No valid data found for selected bird')
          return
        }

        // Prepare data for selected bird
        const plantCounts = {}
        validBirdData.forEach((item) => {
          if (!plantCounts[item.plant_common_name]) {
            plantCounts[item.plant_common_name] = 0
          }
          plantCounts[item.plant_common_name] += Number(item.observation_count) || 1
        })

        // Sort plants by observation count
        const sortedPlants = Object.entries(plantCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)

        console.log('Data prepared for chart:', sortedPlants)

        // Ensure there is data to draw
        if (sortedPlants.length === 0) {
          console.error('Not enough data to create chart')
          return
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

        chart.value = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: sortedPlants.map((item) => item[0]),
            datasets: [
              {
                label: `${selectedBird.value} Preferred Plants`,
                data: sortedPlants.map((item) => item[1]),
                backgroundColor: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3'],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: `${selectedBird.value}'s Preferred Plants`,
                font: {
                  size: 16,
                },
              },
            },
          },
        })
      } catch (error) {
        console.error('Error creating chart:', error)
      }
    }

    // Watch for data changes
    watch(
      () => props.birdsData,
      async (newValue) => {
        console.log('Bird data updated, data amount:', newValue?.length || 0)
        if (newValue && newValue.length > 0) {
          // Extract unique birds
          const birds = [...new Set(newValue.map((item) => item.species_common_name))].filter(
            Boolean,
          )
          birdsList.value = birds

          if (!selectedBird.value && birds.length > 0) {
            selectedBird.value = birds[0]
          }

          // Wait for DOM update
          await nextTick()
          updateChart()
        }
      },
      { deep: true },
    )

    // Watch for selected bird changes
    watch(() => selectedBird.value, updateChart)

    return {
      chartContainer,
      selectedBird,
      birdsList,
      updateChart,
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

/* Updated styles for bird selector using buttons */
.bird-selector-container {
  margin-bottom: 30px;
  text-align: center;
}

.bird-selector-label {
  font-size: 1.1rem;
  color: #1a2d00;
  margin-bottom: 15px;
  font-weight: 600;
}

.bird-selector-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.bird-selector-button {
  padding: 8px 16px;
  background-color: #f2f2f2;
  border: 2px solid transparent;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #555;
  transition: all 0.3s ease;
}

.bird-selector-button:hover {
  background-color: #e6e6e6;
  color: #333;
}

.bird-selector-button.active {
  background-color: #1a2d00;
  color: #f3f9c0;
  border-color: #1a2d00;
}

.chart {
  height: 300px;
  width: 100%;
}
</style>
