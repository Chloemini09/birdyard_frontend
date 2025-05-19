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
    <!-- Using canvas tag instead of div -->
    <canvas ref="chartContainer" class="chart"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch, nextTick, onUnmounted } from 'vue'
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

    // 添加组件卸载时的清理
    onUnmounted(() => {
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
      if (props.plantsData && props.plantsData.length > 0) {
        // 不直接调用updateChart，让watch监听器处理
      } else {
        console.log('Plant data not yet loaded')
      }
    })

    const updateChart = async () => {
      console.log(
        'Attempting to update plant requirements chart, data status:',
        props.plantsData?.length || 0,
      )

      // 首先确保销毁旧图表
      if (chart.value) {
        chart.value.destroy()
        chart.value = null // 重要：设置为null
      }

      // 等待DOM更新
      await nextTick()

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
        // 等待DOM更新
        await nextTick()

        // Create new chart - ensure element is ready
        const ctx = chartContainer.value.getContext('2d')
        if (!ctx) {
          console.error('Could not get canvas context')
          return
        }

        if (currentView.value === 'sunwater') {
          renderSunlightWaterChart(ctx)
        } else {
          renderGrowthDurationChart(ctx)
        }
      } catch (error) {
        console.error('Error creating chart:', error)
      }
    }

    const renderSunlightWaterChart = (ctx) => {
      // Process plant data
      const plantCharacteristics = {}

      // Collect valid plant data
      props.plantsData.forEach((row) => {
        if (row && row.plant_common_name && row.sunlight_requirement && row.water_requirement) {
          const plant = row.plant_common_name
          if (!plantCharacteristics[plant]) {
            plantCharacteristics[plant] = {
              name: plant,
              sunlight: row.sunlight_requirement,
              water: row.water_requirement,
            }
          }
        }
      })

      // Check if there is enough valid data
      const plantsList = Object.values(plantCharacteristics)
      if (plantsList.length === 0) {
        console.error('Not enough plant characteristic data')
        return
      }

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

      // Create scatter plot data
      const scatterData = plantsList
        .map((plant) => ({
          x: waterValues[plant.water] || 0,
          y: sunlightValues[plant.sunlight] || 0,
          label: plant.name,
        }))
        .filter((item) => item.x > 0 && item.y > 0) // Filter invalid values

      if (scatterData.length === 0) {
        console.error('No valid scatter plot data')
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
                  return `${plant.name}: Water Requirement-${plant.water}, Sunlight Requirement-${plant.sunlight}`
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
                  return ['', 'Low', 'Medium', 'High'][value] || ''
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

    const renderGrowthDurationChart = (ctx) => {
      // Get unique plants and their growth times
      const plantGrowth = {}

      // Collect valid plant growth data
      props.plantsData.forEach((row) => {
        if (row && row.plant_common_name && row.growth_duration_weeks) {
          const plant = row.plant_common_name
          if (!plantGrowth[plant]) {
            plantGrowth[plant] = Number(row.growth_duration_weeks) || 0
          }
        }
      })

      // Sort plants by growth time
      const sortedPlants = Object.entries(plantGrowth)
        .filter(([_, duration]) => duration > 0) // Filter invalid values
        .sort((a, b) => a[1] - b[1])
        .map(([name, duration]) => ({ name, duration }))

      // Check if there is enough valid data
      if (sortedPlants.length === 0) {
        console.error('Not enough plant growth data')
        return
      }

      // Limit number of data points to avoid overcrowding
      const displayPlants = sortedPlants.slice(0, 8)

      chart.value = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: displayPlants.map((p) => p.name),
          datasets: [
            {
              label: 'Growth Cycle (weeks)',
              data: displayPlants.map((p) => p.duration),
              backgroundColor: [
                '#8dd3c7',
                '#ffffb3',
                '#bebada',
                '#fb8072',
                '#80b1d3',
                '#fdb462',
                '#b3de69',
                '#fccde5',
              ],
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

    // Watch for data changes
    watch(
      () => props.plantsData,
      async (newValue) => {
        console.log('Plant data updated, data amount:', newValue?.length || 0)
        if (newValue && newValue.length > 0) {
          // 确保先销毁旧图表
          if (chart.value) {
            chart.value.destroy()
            chart.value = null
          }

          await nextTick()
          updateChart()
        }
      },
      { deep: true },
    )

    // Watch for view type changes
    watch(
      () => currentView.value,
      async () => {
        // 确保先销毁旧图表
        if (chart.value) {
          chart.value.destroy()
          chart.value = null
        }

        await nextTick()
        updateChart()
      },
    )

    return {
      chartContainer,
      viewOptions,
      currentView,
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
  height: 200px;
  width: 100%;
}
</style>
