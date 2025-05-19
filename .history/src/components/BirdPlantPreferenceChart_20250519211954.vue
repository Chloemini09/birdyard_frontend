<template>
  <div class="chart-container">
    <h2>Bird-Plant Preferences</h2>

    <!-- Enhanced bird selector dropdown -->
    <div class="bird-selector">
      <label for="bird-select">Select Bird:</label>
      <div class="custom-select-wrapper">
        <select
          id="bird-select"
          v-model="selectedBird"
          @change="handleBirdChange"
          class="custom-select"
        >
          <option value="" disabled>Choose a bird species</option>
          <option v-for="bird in birdsList" :key="bird" :value="bird">
            {{ bird }}
          </option>
        </select>
        <div class="select-icon"></div>
      </div>
      <div class="select-hint" v-if="selectedBird">
        <span
          >Viewing preferences for <strong>{{ selectedBird }}</strong></span
        >
      </div>
    </div>

    <div class="chart-wrapper">
      <canvas
        v-if="canvasVisible"
        :key="canvasKey"
        :id="canvasId"
        ref="chartContainer"
        class="chart"
      ></canvas>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, nextTick, onBeforeUnmount } from 'vue'
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

    const canvasId = ref(`chart-canvas-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)
    const canvasKey = ref(Date.now())
    const canvasVisible = ref(true)

    const destroyChart = async () => {
      console.log('Destroying chart...')
      if (chart.value) {
        try {
          chart.value.destroy()
        } catch (e) {
          console.error('Error destroying chart:', e)
        }
        chart.value = null
      }

      canvasVisible.value = false
      canvasKey.value = Date.now()
      await nextTick()
      canvasVisible.value = true
      await nextTick()
    }

    onBeforeUnmount(() => {
      destroyChart()
    })

    const handleBirdChange = async () => {
      await destroyChart()
      await nextTick()
      createChart()
    }

    const createChart = async () => {
      if (!chartContainer.value) {
        console.error('Chart container not found')
        return
      }

      if (!props.birdsData || !props.birdsData.length || !selectedBird.value) {
        console.error('No data or bird selected')
        return
      }

      try {
        const validBirdData = props.birdsData.filter(
          (item) =>
            item && item.species_common_name === selectedBird.value && item.plant_common_name,
        )

        if (validBirdData.length === 0) {
          console.error('No valid data found for selected bird')
          return
        }

        const plantCounts = {}
        validBirdData.forEach((item) => {
          if (!plantCounts[item.plant_common_name]) {
            plantCounts[item.plant_common_name] = 0
          }
          plantCounts[item.plant_common_name] += Number(item.observation_count) || 1
        })

        const sortedPlants = Object.entries(plantCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)

        if (sortedPlants.length === 0) {
          console.error('Not enough data to create chart')
          return
        }

        const ctx = chartContainer.value.getContext('2d')
        if (!ctx) {
          console.error('Canvas context not available')
          return
        }

        // Green-themed color palette
        const greenPalette = [
          '#1a2d00', // Dark green
          '#4c7c0c', // Medium green
          '#8cb82a', // Light green
          '#bcdb40', // Lime green
          '#f3f9c0', // Pale yellow-green
        ]

        chart.value = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: sortedPlants.map((item) => item[0]),
            datasets: [
              {
                label: `${selectedBird.value} Preferred Plants`,
                data: sortedPlants.map((item) => item[1]),
                backgroundColor: greenPalette,
                borderWidth: 1,
                borderColor: '#1a2d00',
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
                  weight: 'bold',
                },
                color: '#1a2d00',
              },
              tooltip: {
                backgroundColor: 'rgba(26, 45, 0, 0.8)',
                titleColor: '#f3f9c0',
                bodyColor: '#ffffff',
                borderColor: '#f3f9c0',
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                callbacks: {
                  label: function (context) {
                    return `Observations: ${context.raw}`
                  },
                },
              },
            },
            scales: {
              y: {
                ticks: {
                  color: '#1a2d00',
                  font: {
                    weight: '500',
                  },
                },
                grid: {
                  color: 'rgba(26, 45, 0, 0.1)',
                },
              },
              x: {
                ticks: {
                  color: '#1a2d00',
                },
                grid: {
                  color: 'rgba(26, 45, 0, 0.1)',
                },
                title: {
                  display: true,
                  text: 'Number of Observations',
                  color: '#1a2d00',
                  font: {
                    weight: '500',
                  },
                },
              },
            },
            elements: {
              rectangle: {
                borderWidth: 1,
                borderColor: '#1a2d00',
              },
            },
          },
        })

        console.log('Chart created with ID:', chart.value.id)
      } catch (error) {
        console.error('Error creating chart:', error)
      }
    }

    onMounted(async () => {
      if (props.birdsData && props.birdsData.length > 0) {
        const birds = [...new Set(props.birdsData.map((item) => item.species_common_name))].filter(
          Boolean,
        )
        birdsList.value = birds
        selectedBird.value = birds[0] || ''
        await nextTick()
        await createChart()
      }
    })

    watch(
      () => props.birdsData,
      async (newValue) => {
        if (newValue && newValue.length > 0) {
          const birds = [...new Set(newValue.map((item) => item.species_common_name))].filter(
            Boolean,
          )
          birdsList.value = birds

          if (!selectedBird.value && birds.length > 0) {
            selectedBird.value = birds[0]
          }

          await destroyChart()
          await nextTick()
          await createChart()
        }
      },
      { deep: true },
    )

    return {
      chartContainer,
      selectedBird,
      birdsList,
      canvasId,
      canvasKey,
      canvasVisible,
      handleBirdChange,
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
  display: flex;
  flex-direction: column;
}

h2 {
  color: #1a2d00;
  margin-top: 0;
  margin-bottom: 15px;
  font-weight: 700;
  flex-shrink: 0;
}

.bird-selector {
  margin-bottom: 20px;
  position: relative;
  max-width: 300px;
  flex-shrink: 0;
}

.bird-selector label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1a2d00;
  font-size: 1rem;
}

.custom-select-wrapper {
  position: relative;
  display: block;
}

.custom-select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  padding: 12px 40px 12px 15px;
  border: 2px solid #1a2d00;
  border-radius: 6px;
  background-color: white;
  color: #1a2d00;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(26, 45, 0, 0.1);
}

.custom-select:focus {
  outline: none;
  border-color: #4c7c0c;
  box-shadow: 0 0 0 3px rgba(76, 124, 12, 0.25);
}

.custom-select:hover {
  background-color: #f3f9c0;
}

.select-icon {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border-style: solid;
  border-width: 0 2px 2px 0;
  border-color: #1a2d00;
  transform: translateY(-50%) rotate(45deg);
  pointer-events: none;
  transition: transform 0.3s ease;
}

.custom-select:focus + .select-icon {
  transform: translateY(-30%) rotate(225deg);
}

.select-hint {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #4c7c0c;
}

.select-hint strong {
  color: #1a2d00;
}

.chart-wrapper {
  flex-grow: 1;
  position: relative;
  min-height: 0;
}

.chart {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Custom styling for dropdown options */
.custom-select option {
  padding: 10px;
  background-color: white;
  color: #1a2d00;
}

.custom-select option:checked {
  background-color: #1a2d00;
  color: white;
}

/* Responsive styles */
@media (max-width: 768px) {
  .chart-container {
    height: 500px;
  }

  .bird-selector {
    max-width: 100%;
  }
}
</style>
