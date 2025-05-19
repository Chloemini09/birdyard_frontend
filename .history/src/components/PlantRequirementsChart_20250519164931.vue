<template>
  <div class="chart-container">
    <h2>植物生长需求</h2>
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
    <!-- 使用canvas标签，而不是div -->
    <canvas ref="chartContainer" class="chart"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch, nextTick } from 'vue'
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
      { label: '阳光和水分需求', value: 'sunwater' },
      { label: '生长周期', value: 'growth' },
    ]
    const currentView = ref('sunwater')

    onMounted(async () => {
      console.log('PlantRequirementsChart 组件已挂载，数据状态:', props.plantsData?.length || 0)
      if (props.plantsData && props.plantsData.length > 0) {
        await nextTick()
        updateChart()
      } else {
        console.log('植物数据尚未加载')
      }
    })

    const updateChart = async () => {
      console.log('尝试更新植物需求图表，数据状态:', props.plantsData?.length || 0)

      // 严格检查数据和DOM元素
      if (!chartContainer.value) {
        console.error('图表容器元素不存在或未挂载')
        return
      }

      // 检查数据是否有效
      if (!props.plantsData || !Array.isArray(props.plantsData) || props.plantsData.length === 0) {
        console.error('植物数据无效或为空')
        return
      }

      try {
        // 销毁旧图表（如果存在）
        if (chart.value) {
          chart.value.destroy()
        }

        // 强制等待DOM更新
        await nextTick()

        // 创建新图表 - 确保元素已经准备好
        const ctx = chartContainer.value.getContext('2d')
        if (!ctx) {
          console.error('无法获取画布上下文')
          return
        }

        if (currentView.value === 'sunwater') {
          renderSunlightWaterChart(ctx)
        } else {
          renderGrowthDurationChart(ctx)
        }
      } catch (error) {
        console.error('创建图表时出错:', error)
      }
    }

    const renderSunlightWaterChart = (ctx) => {
      // 处理植物数据
      const plantCharacteristics = {}

      // 收集有效的植物数据
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

      // 检查是否有足够的有效数据
      const plantsList = Object.values(plantCharacteristics)
      if (plantsList.length === 0) {
        console.error('没有足够的植物特性数据')
        return
      }

      // 转换为散点图的数值
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

      // 创建散点图数据
      const scatterData = plantsList
        .map((plant) => ({
          x: waterValues[plant.water] || 0,
          y: sunlightValues[plant.sunlight] || 0,
          label: plant.name,
        }))
        .filter((item) => item.x > 0 && item.y > 0) // 过滤无效值

      if (scatterData.length === 0) {
        console.error('没有有效的散点图数据')
        return
      }

      chart.value = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: '植物',
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
                  return `${plant.name}: 水分需求-${plant.water}, 阳光需求-${plant.sunlight}`
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: '水分需求',
              },
              ticks: {
                callback: (value) => {
                  return ['', '低', '中', '高'][value] || ''
                },
              },
              min: 0.5,
              max: 3.5,
            },
            y: {
              title: {
                display: true,
                text: '阳光需求',
              },
              ticks: {
                callback: (value) => {
                  return ['', '荫蔽', '半阳', '全日照'][value] || ''
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
      // 获取唯一植物及其生长时间
      const plantGrowth = {}

      // 收集有效的植物生长数据
      props.plantsData.forEach((row) => {
        if (row && row.plant_common_name && row.growth_duration_weeks) {
          const plant = row.plant_common_name
          if (!plantGrowth[plant]) {
            plantGrowth[plant] = Number(row.growth_duration_weeks) || 0
          }
        }
      })

      // 按生长时间排序植物
      const sortedPlants = Object.entries(plantGrowth)
        .filter(([_, duration]) => duration > 0) // 过滤无效值
        .sort((a, b) => a[1] - b[1])
        .map(([name, duration]) => ({ name, duration }))

      // 检查是否有足够的有效数据
      if (sortedPlants.length === 0) {
        console.error('没有足够的植物生长数据')
        return
      }

      // 限制数据点数量以避免过度拥挤
      const displayPlants = sortedPlants.slice(0, 8)

      chart.value = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: displayPlants.map((p) => p.name),
          datasets: [
            {
              label: '生长周期（周）',
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
              text: '植物生长周期（到成熟所需周数）',
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
                text: '周数',
              },
            },
          },
        },
      })
    }

    // 监听数据变化
    watch(
      () => props.plantsData,
      async (newValue) => {
        console.log('植物数据已更新，数据量:', newValue?.length || 0)
        if (newValue && newValue.length > 0) {
          await nextTick()
          updateChart()
        }
      },
      { deep: true },
    )

    // 监听视图类型变化
    watch(() => currentView.value, updateChart)

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
  height: 350px;
  width: 100%;
}
</style>
