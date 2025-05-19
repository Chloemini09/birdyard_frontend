<template>
  <div class="chart-container">
    <h2>Plant Growing Requirements</h2>
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
    <div ref="chartContainer" class="chart"></div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
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
      { label: 'Sunlight & Water', value: 'sunwater' },
      { label: 'Growth Duration', value: 'growth' },
    ]
    const currentView = ref('sunwater')

    onMounted(() => {
      updateChart()
    })

    const updateChart = () => {
      if (chart.value) {
        chart.value.destroy()
      }

      if (currentView.value === 'sunwater') {
        renderSunlightWaterChart()
      } else {
        renderGrowthDurationChart()
      }
    }

    const renderSunlightWaterChart = () => {
      // Process plant data
      const plantCharacteristics = {}
      props.plantsData.forEach((row) => {
        const plant = row.plant_common_name
        if (!plantCharacteristics[plant]) {
          plantCharacteristics[plant] = {
            name: plant,
            sunlight: row.sunlight_requirement,
            water: row.water_requirement,
          }
        }
      })

      // Convert to numerical values for scatter plot
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

      // Create datasets
      const plantsList = Object.values(plantCharacteristics)
      const scatterData = plantsList.map((plant) => ({
        x: waterValues[plant.water] || 0,
        y: sunlightValues[plant.sunlight] || 0,
        label: plant.name,
      }))

      chart.value = new Chart(chartContainer.value, {
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
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const plant = plantsList.find((p) => p.name === context.raw.label)
                  return `${plant.name}: ${plant.water} water, ${plant.sunlight} sunlight`
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Water Requirement',
              },
              ticks: {
                callback: (value) => {
                  return ['', 'Low', 'Moderate', 'High'][value] || ''
                },
              },
              min: 0.5,
              max: 3.5,
            },
            y: {
              title: {
                display: true,
                text: 'Sunlight Requirement',
              },
              ticks: {
                callback: (value) => {
                  return ['', 'Shade', 'Part Sun', 'Full Sun'][value] || ''
                },
              },
              min: 0.5,
              max: 3.5,
            },
          },
        },
      })
    }

    const renderGrowthDurationChart = () => {
      // Get unique plants and their growth durations
      const plantGrowth = {}
      props.plantsData.forEach((row) => {
        const plant = row.plant_common_name
        if (!plantGrowth[plant]) {
          plantGrowth[plant] = row.growth_duration_weeks
        }
      })

      // Sort plants by growth duration
      const sortedPlants = Object.entries(plantGrowth)
        .sort((a, b) => a[1] - b[1])
        .map(([name, duration]) => ({ name, duration }))

      chart.value = new Chart(chartContainer.value, {
        type: 'bar',
        data: {
          labels: sortedPlants.map((p) => p.name),
          datasets: [
            {
              label: 'Growth Duration (weeks)',
              data: sortedPlants.map((p) => p.duration),
              backgroundColor: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Plant Growth Duration (Weeks to Maturity)',
              font: {
                size: 16,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Weeks',
              },
            },
          },
        },
      })
    }

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
.chart {
  height: 350px;
}
</style>
