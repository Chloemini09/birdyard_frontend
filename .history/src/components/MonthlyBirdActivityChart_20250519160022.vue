<template>
  <div class="chart-container">
    <h2>Monthly Bird Activity</h2>
    <div class="bird-toggles">
      <div v-for="bird in birdsList" :key="bird" class="toggle-item">
        <input
          type="checkbox"
          :id="bird"
          :value="bird"
          v-model="selectedBirds"
          @change="updateChart"
        />
        <label :for="bird" :style="{ color: getBirdColor(bird) }">{{ bird }}</label>
      </div>
    </div>
    <div ref="chartContainer" class="chart"></div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'MonthlyBirdActivityChart',
  props: {
    birdsData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const chartContainer = ref(null)
    const chart = ref(null)
    const birdsList = ref([])
    const selectedBirds = ref([])
    const birdColors = {
      'Australian Magpie': '#000000',
      'Sulphur-crested Cockatoo': '#ffed66',
      'Rainbow Lorikeet': '#ff9e1f',
      'Eastern Rosella': '#e63946',
      'Superb Fairywren': '#457b9d',
    }

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    onMounted(() => {
      // Extract unique birds
      birdsList.value = [...new Set(props.birdsData.map((item) => item.species_common_name))]
      selectedBirds.value = [birdsList.value[0], birdsList.value[1]] // Default select first 2 birds

      updateChart()
    })

    const getBirdColor = (bird) => {
      return birdColors[bird] || '#666666'
    }

    const updateChart = () => {
      // Prepare data for all selected birds by month
      const monthlyData = {}

      selectedBirds.value.forEach((bird) => {
        monthlyData[bird] = Array(12).fill(0)

        props.birdsData
          .filter((item) => item.species_common_name === bird)
          .forEach((item) => {
            const monthIndex = months.indexOf(item.month)
            if (monthIndex >= 0) {
              monthlyData[bird][monthIndex] += item.observation_count
            }
          })
      })

      // Create datasets
      const datasets = selectedBirds.value.map((bird) => ({
        label: bird,
        data: monthlyData[bird],
        borderColor: getBirdColor(bird),
        backgroundColor: `${getBirdColor(bird)}33`,
        tension: 0.3,
        fill: false,
      }))

      // Create or update chart
      if (chart.value) {
        chart.value.destroy()
      }

      chart.value = new Chart(chartContainer.value, {
        type: 'line',
        data: {
          labels: months,
          datasets,
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Bird Activity Throughout the Year',
              font: {
                size: 16,
              },
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Number of Observations',
              },
            },
          },
        },
      })
    }

    watch(() => selectedBirds.value, updateChart, { deep: true })

    return {
      chartContainer,
      birdsList,
      selectedBirds,
      getBirdColor,
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
.bird-toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}
.toggle-item {
  display: flex;
  align-items: center;
  gap: 5px;
}
.chart {
  height: 300px;
}
</style>
