<template>
  <div class="chart-container">
    <h2>Plant Suitability by Region</h2>
    <div class="plant-selector">
      <label for="plant-view">View Type:</label>
      <select id="plant-view" v-model="viewType" @change="updateHeatmap">
        <option value="all">All Plants</option>
        <option value="individual">Individual Plant</option>
      </select>

      <div v-if="viewType === 'individual'" class="plant-dropdown">
        <label for="plant-select">Select Plant:</label>
        <select id="plant-select" v-model="selectedPlant" @change="updateHeatmap">
          <option v-for="plant in plantsList" :key="plant" :value="plant">
            {{ plant }}
          </option>
        </select>
      </div>
    </div>
    <div ref="chartContainer" class="heatmap-chart"></div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
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
    const viewType = ref('all')
    const selectedPlant = ref('')
    const plantsList = ref([])
    const states = ['NSW', 'QLD', 'SA', 'VIC', 'WA']

    onMounted(() => {
      // Extract unique plants
      plantsList.value = [...new Set(props.plantsData.map((item) => item.plant_common_name))]
      selectedPlant.value = plantsList.value[0]

      updateHeatmap()
    })

    const updateHeatmap = () => {
      // Prepare data based on view type
      let datasets = []

      if (viewType.value === 'individual') {
        // Get plant suitability data
        const plantData = {}

        // Initialize with zeros
        states.forEach((state) => {
          plantData[state] = 0
        })

        // Count observations of this plant in each state
        props.plantsData
          .filter((item) => item.plant_common_name === selectedPlant.value)
          .forEach((item) => {
            if (plantData[item.state] !== undefined) {
              plantData[item.state]++
            }
          })

        // Get regions where this plant is suitable
        const suitableRegions =
          props.plantsData.find((item) => item.plant_common_name === selectedPlant.value)
            ?.suitable_regions || ''

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
        // Create datasets for all plants
        datasets = plantsList.value.map((plant, index) => {
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

      // Create or update chart
      if (chart.value) {
        chart.value.destroy()
      }

      if (viewType.value === 'individual') {
        // For individual plant - use bar chart
        chart.value = new Chart(chartContainer.value, {
          type: 'bar',
          data: {
            labels: states,
            datasets: datasets,
          },
          options: {
            plugins: {
              title: {
                display: true,
                text: `Suitability of ${selectedPlant.value} by Region`,
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
        // For all plants - use heatmap style
        chart.value = new Chart(chartContainer.value, {
          type: 'matrix',
          data: {
            datasets: [
              {
                label: 'Plant Suitability',
                data: createHeatmapData(),
                backgroundColor(context) {
                  const value = context.dataset.data[context.dataIndex].v
                  return value ? 'rgba(76, 175, 80, ' + value + ')' : 'rgba(200, 200, 200, 0.3)'
                },
                borderColor: '#ffffff',
                borderWidth: 1,
                width: ({ chart }) => (chart.chartArea || {}).width / states.length - 1,
                height: ({ chart }) => (chart.chartArea || {}).height / plantsList.value.length - 1,
              },
            ],
          },
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  title() {
                    return ''
                  },
                  label(context) {
                    const v = context.dataset.data[context.dataIndex]
                    return [v.y + ' in ' + v.x, v.v ? 'Suitable' : 'Not suitable']
                  },
                },
              },
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                type: 'category',
                labels: states,
                offset: true,
                ticks: {
                  display: true,
                },
                grid: {
                  display: false,
                },
                title: {
                  display: true,
                  text: 'Australian States',
                },
              },
              y: {
                type: 'category',
                labels: plantsList.value,
                offset: true,
                ticks: {
                  display: true,
                },
                grid: {
                  display: false,
                },
                title: {
                  display: true,
                  text: 'Plants',
                },
              },
            },
          },
        })
      }
    }

    const createHeatmapData = () => {
      // Create data for heatmap visualization
      const data = []

      plantsList.value.forEach((plant, i) => {
        // Get suitable regions for this plant
        const plantInfo = props.plantsData.find((item) => item.plant_common_name === plant)
        const suitableRegions = plantInfo?.suitable_regions || ''
        const suitableStates = suitableRegions.split(',').map((s) => s.trim())

        states.forEach((state, j) => {
          data.push({
            x: state,
            y: plant,
            v: suitableStates.includes(state) ? 1 : 0,
          })
        })
      })

      return data
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

    watch([() => viewType.value, () => selectedPlant.value], updateHeatmap)

    return {
      chartContainer,
      viewType,
      selectedPlant,
      plantsList,
      updateHeatmap,
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
  height: 400px;
}
select {
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;
}
</style>
