<template>
  <div class="chart-container">
    <h2>Bird-Plant Preferences</h2>
    <div class="bird-selector">
      <label for="bird-select">Select Bird:</label>
      <select id="bird-select" v-model="selectedBird" @change="updateChart">
        <option v-for="bird in birdsList" :key="bird" :value="bird">
          {{ bird }}
        </option>
      </select>
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

      // Check if the container exists
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
        // Filter bird data
        const validBirdData = props.birdsData.filter(
          (item) =>
            item && item.species_common_name === selectedBird.value && item.plant_common_name,
        )

        if (validBirdData.length === 0) {
          console.error('No valid data found for selected bird')
          return
        }

        // Process data
        const plantCounts = {}
        validBirdData.forEach((item) => {
          const plantName = item.plant_common_name
          if (!plantCounts[plantName]) {
            plantCounts[plantName] = 0
          }
          plantCounts[plantName] += Number(item.observation_count) || 1
        })

        // Sort plants
        const sortedPlants = Object.entries(plantCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)

        console.log('Data prepared for chart:', sortedPlants)

        // Ensure previous chart is destroyed
        if (chart.value) {
          chart.value.destroy()
        }

        // Wait for DOM update to ensure clean rendering
        await nextTick()

        // Get fresh context
        const ctx = chartContainer.value.getContext('2d')
        if (!ctx) {
          console.error('Could not get canvas context')
          return
        }

        // Create new chart with optimized options
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
            barThickness: 20, // Fixed bar height
            barPercentage: 0.7, // Reduced bar height percentage
            categoryPercentage: 0.7, // Increased spacing between bars
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
            scales: {
              y: {
                ticks: {
                  padding: 5,
                  autoSkip: false, // Prevent label skipping to avoid duplicates
                },
                grid: {
                  display: true,
                  drawOnChartArea: true,
                },
              },
              x: {
                beginAtZero: true,
                grid: {
                  display: true,
                  drawOnChartArea: true,
                },
              },
            },
            animation: {
              duration: 500, // Shorter animation for quicker rendering
              easing: 'easeOutQuad',
              onComplete: function () {
                // Ensure chart is fully rendered before allowing interactions
                isChartReady = true
              },
            },
          },
        })
      } catch (error) {
        console.error('Error creating chart:', error)
      }
    }

    // Improved component lifecycle management
    onMounted(async () => {
      // Add a small delay to ensure DOM is fully ready before first render
      setTimeout(async () => {
        console.log('BirdPlantPreferenceChart component mounted with delayed initialization')
        if (props.birdsData && props.birdsData.length > 0) {
          // Extract unique birds
          const birds = [
            ...new Set(props.birdsData.map((item) => item.species_common_name)),
          ].filter(Boolean)
          birdsList.value = birds
          selectedBird.value = birds[0] || ''

          // Wait for DOM update
          await nextTick()
          // Then update chart
          updateChart()
        }
      }, 100)
    })

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
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}
.bird-selector {
  margin-bottom: 15px;
}
.chart {
  height: 150px;
  width: 100%;
}
select {
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;
}
</style>
