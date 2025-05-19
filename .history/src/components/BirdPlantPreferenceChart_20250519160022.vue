<template>
  <div class="chart-container">
    <h2>Bird-Plant Preferences</h2>
    <div class="bird-selector">
      <label for="bird-select">Select Bird Species:</label>
      <select id="bird-select" v-model="selectedBird" @change="updateChart">
        <option v-for="bird in birdsList" :key="bird" :value="bird">
          {{ bird }}
        </option>
      </select>
    </div>
    <div ref="chartContainer" class="chart"></div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
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

    onMounted(() => {
      // Extract unique birds
      const birds = [...new Set(props.birdsData.map((item) => item.species_common_name))]
      birdsList.value = birds
      selectedBird.value = birds[0]

      updateChart()
    })

    const updateChart = () => {
      // Prepare data for selected bird
      const plantCounts = {}
      props.birdsData
        .filter((item) => item.species_common_name === selectedBird.value)
        .forEach((item) => {
          if (!plantCounts[item.plant_common_name]) {
            plantCounts[item.plant_common_name] = 0
          }
          plantCounts[item.plant_common_name] += item.observation_count
        })

      // Sort plants by observation count
      const sortedPlants = Object.entries(plantCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

      // Create or update chart
      if (chart.value) {
        chart.value.destroy()
      }

      chart.value = new Chart(chartContainer.value, {
        type: 'bar',
        data: {
          labels: sortedPlants.map((item) => item[0]),
          datasets: [
            {
              label: `Plants preferred by ${selectedBird.value}`,
              data: sortedPlants.map((item) => item[1]),
              backgroundColor: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: `Top Plants for ${selectedBird.value}`,
              font: {
                size: 16,
              },
            },
          },
        },
      })
    }

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
.bird-selector {
  margin-bottom: 15px;
}
.chart {
  height: 300px;
}
select {
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;
}
</style>
