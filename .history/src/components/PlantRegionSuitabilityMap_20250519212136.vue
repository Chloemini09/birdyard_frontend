<template>
  <div class="chart-container">
    <h2>Plant Region Suitability</h2>

    <div class="plant-selector">
      <!-- 绿色主题视图模式选择器 -->
      <div class="select-group">
        <label for="plant-view">View Mode:</label>
        <div class="custom-select-wrapper">
          <select id="plant-view" v-model="viewType" @change="updateChart" class="custom-select">
            <option value="all">All Plants</option>
            <option value="individual">Individual Plant</option>
          </select>
          <div class="select-icon"></div>
        </div>
      </div>

      <!-- 个别植物选择器（仅在个别视图模式下显示） -->
      <div v-if="viewType === 'individual'" class="select-group plant-dropdown">
        <label for="plant-select">Select Plant:</label>
        <div class="custom-select-wrapper">
          <select
            id="plant-select"
            v-model="selectedPlant"
            @change="updateChart"
            class="custom-select"
          >
            <option value="" disabled>Choose a plant</option>
            <option v-for="plant in plantsList" :key="plant" :value="plant">
              {{ plant }}
            </option>
          </select>
          <div class="select-icon"></div>
        </div>
        <div class="select-hint" v-if="selectedPlant">
          <span
            >Showing <strong>{{ selectedPlant }}</strong> suitability across regions</span
          >
        </div>
      </div>
    </div>

    <!-- 使用 canvas 标签 -->
    <div class="chart-wrapper">
      <canvas ref="chartContainer" class="heatmap-chart"></canvas>
    </div>

    <!-- 图例说明 -->
    <div class="legend-info" v-if="viewType === 'individual'">
      <div class="legend-item highly-suitable">Highly Suitable</div>
      <div class="legend-item suitable">Suitable</div>
      <div class="legend-item not-suitable">Not Suitable</div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, nextTick, onBeforeUnmount } from 'vue'
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

    // 清理函数，确保组件卸载时销毁图表
    onBeforeUnmount(() => {
      if (chart.value) {
        chart.value.destroy()
      }
    })

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

          // 为不同适应性级别创建不同颜色
          const barColors = states.map((state) => {
            // 获取适应性级别
            const isSuitable = suitableStates.includes(state) ? 1 : 0
            const observationFactor = plantData[state] / 100
            const suitabilityLevel = isSuitable + observationFactor

            // 基于适应性级别返回不同颜色
            if (suitabilityLevel > 1) return '#1a2d00' // 深绿色 - 高度适宜
            if (suitabilityLevel > 0) return '#4c7c0c' // 中绿色 - 适宜
            return '#d3d3d3' // 浅灰色 - 不适宜
          })

          datasets = [
            {
              label: selectedPlant.value,
              data: states.map((state) => {
                // Higher value if officially suitable
                const isSuitable = suitableStates.includes(state) ? 1 : 0
                // Add observation count factor
                return isSuitable + plantData[state] / 100
              }),
              backgroundColor: barColors,
              borderColor: '#1a2d00',
              borderWidth: 1,
            },
          ]
        } else {
          // Create simplified dataset for all plants
          const uniquePlants = [
            ...new Set(props.plantsData.map((item) => item.plant_common_name)),
          ].filter(Boolean)

          // Limit number of plants to avoid too much data
          const displayPlants = uniquePlants.slice(0, 5)

          // 为多个植物使用绿色调色板
          const greenPalette = [
            '#1a2d00', // 深绿色
            '#2d4e00', // 暗绿色
            '#4c7c0c', // 中绿色
            '#72aa1d', // 亮绿色
            '#8cb82a', // 黄绿色
          ]

          datasets = displayPlants.map((plant, index) => {
            // Get suitable regions for this plant
            const plantInfo = props.plantsData.find((item) => item.plant_common_name === plant)
            const suitableRegions = plantInfo?.suitable_regions || ''
            const suitableStates = suitableRegions.split(',').map((s) => s.trim())

            return {
              label: plant,
              data: states.map((state) => (suitableStates.includes(state) ? 1 : 0)),
              backgroundColor: greenPalette[index % greenPalette.length],
            }
          })
        }

        // Destroy old chart (if exists)
        if (chart.value) {
          chart.value.destroy()
          chart.value = null
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
                  font: {
                    size: 16,
                    weight: 'bold',
                  },
                  color: '#1a2d00',
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
                  backgroundColor: 'rgba(26, 45, 0, 0.8)',
                  titleColor: '#f3f9c0',
                  bodyColor: '#ffffff',
                  borderColor: '#f3f9c0',
                  borderWidth: 1,
                  padding: 10,
                },
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 2,
                  ticks: {
                    color: '#1a2d00',
                    callback: (value) => {
                      return value > 1 ? 'Highly Suitable' : value > 0 ? 'Suitable' : 'Not Suitable'
                    },
                  },
                  grid: {
                    color: 'rgba(26, 45, 0, 0.1)',
                  },
                },
                x: {
                  ticks: {
                    color: '#1a2d00',
                    font: {
                      weight: 'bold',
                    },
                  },
                  grid: {
                    color: 'rgba(26, 45, 0, 0.1)',
                  },
                },
              },
              animation: {
                duration: 500,
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
                  font: {
                    size: 16,
                    weight: 'bold',
                  },
                  color: '#1a2d00',
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
                  backgroundColor: 'rgba(26, 45, 0, 0.8)',
                  titleColor: '#f3f9c0',
                  bodyColor: '#ffffff',
                  borderColor: '#f3f9c0',
                  borderWidth: 1,
                  padding: 10,
                },
                legend: {
                  labels: {
                    color: '#1a2d00',
                    font: {
                      weight: '500',
                    },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 1,
                  ticks: {
                    color: '#1a2d00',
                    callback: (value) => {
                      return value > 0 ? 'Suitable' : 'Not Suitable'
                    },
                  },
                  grid: {
                    color: 'rgba(26, 45, 0, 0.1)',
                  },
                },
                x: {
                  ticks: {
                    color: '#1a2d00',
                    font: {
                      weight: 'bold',
                    },
                  },
                  grid: {
                    color: 'rgba(26, 45, 0, 0.1)',
                  },
                },
              },
              animation: {
                duration: 500,
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
        '#1a2d00', // 深绿色
        '#4c7c0c', // 中绿色
        '#8cb82a', // 亮绿色
        '#bcdb40', // 黄绿色
        '#f3f9c0', // 淡黄绿色
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
  height: 800px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  flex-shrink: 0;
  color: #1a2d00;
  font-weight: 700;
  font-size: 1.5rem;
}

.plant-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.select-group {
  display: flex;
  flex-direction: column;
  min-width: 200px;
}

.plant-dropdown {
  flex-grow: 1;
}

label {
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

.heatmap-chart {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 图例样式 */
.legend-info {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
  flex-shrink: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 500;
}

.legend-item::before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border-radius: 3px;
}

.highly-suitable::before {
  background-color: #1a2d00;
}

.suitable::before {
  background-color: #4c7c0c;
}

.not-suitable::before {
  background-color: #d3d3d3;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .chart-container {
    height: 600px;
  }

  .plant-selector {
    flex-direction: column;
    gap: 15px;
  }

  .select-group {
    width: 100%;
    min-width: unset;
  }
}

@media (max-width: 768px) {
  .chart-container {
    height: 500px;
  }

  .legend-info {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
}
</style>
