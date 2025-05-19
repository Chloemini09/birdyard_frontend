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
    <div ref="chartContainer" class="chart"></div>
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
      console.log('PlantRequirementsChart 组件已挂载，数据状态:', props.plantsData)
      if (props.plantsData && props.plantsData.length > 0) {
        await nextTick()
        updateChart()
      }
    })

    const updateChart = async () => {
      if (!chartContainer.value) {
        console.error('图表容器元素不存在')
        return
      }

      if (!props.plantsData || props.plantsData.length === 0) {
        console.error('更新图表时缺少必要数据')
        return
      }

      try {
        // 销毁旧图表（如果存在）
        if (chart.value) {
          chart.value.destroy()
        }

        // 等待 DOM 更新
        await nextTick()

        if (currentView.value === 'sunwater') {
          renderSunlightWaterChart()
        } else {
          renderGrowthDurationChart()
        }
      } catch (error) {
        console.error('创建图表时出错:', error)
      }
    }

    const renderSunlightWaterChart = () => {
      // 处理植物数据
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

      // 创建数据集
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

    const renderGrowthDurationChart = () => {
      // 获取唯一植物及其生长时间
      const plantGrowth = {}
      props.plantsData.forEach((row) => {
        const plant = row.plant_common_name
        if (!plantGrowth[plant]) {
          plantGrowth[plant] = row.growth_duration_weeks
        }
      })

      // 按生长时间排序植物
      const sortedPlants = Object.entries(plantGrowth)
        .sort((a, b) => a[1] - b[1])
        .map(([name, duration]) => ({ name, duration }))

      chart.value = new Chart(chartContainer.value, {
        type: 'bar',
        data: {
          labels: sortedPlants.map((p) => p.name),
          datasets: [
            {
              label: '生长周期（周）',
              data: sortedPlants.map((p) => p.duration),
              backgroundColor: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3'],
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
