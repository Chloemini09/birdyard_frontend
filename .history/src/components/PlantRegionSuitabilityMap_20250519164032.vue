<template>
  <div class="chart-container">
    <h2>植物区域适应性</h2>
    <div class="plant-selector">
      <label for="plant-view">查看方式：</label>
      <select id="plant-view" v-model="viewType" @change="updateChart">
        <option value="all">所有植物</option>
        <option value="individual">单个植物</option>
      </select>

      <div v-if="viewType === 'individual'" class="plant-dropdown">
        <label for="plant-select">选择植物：</label>
        <select id="plant-select" v-model="selectedPlant" @change="updateChart">
          <option v-for="plant in plantsList" :key="plant" :value="plant">
            {{ plant }}
          </option>
        </select>
      </div>
    </div>
    <!-- 使用canvas标签，而不是div -->
    <canvas ref="chartContainer" class="heatmap-chart"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch, nextTick } from 'vue'
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
    const viewType = ref('individual') // 默认查看单个植物
    const selectedPlant = ref('')
    const plantsList = ref([])
    const states = ['NSW', 'QLD', 'SA', 'VIC', 'WA']

    onMounted(async () => {
      console.log('PlantRegionSuitabilityMap 组件已挂载，数据状态:', props.plantsData?.length || 0)
      if (props.plantsData && props.plantsData.length > 0) {
        // 提取唯一植物
        const plants = [...new Set(props.plantsData.map((item) => item.plant_common_name))].filter(
          Boolean,
        )
        plantsList.value = plants
        selectedPlant.value = plants[0] || ''

        await nextTick()
        updateChart()
      } else {
        console.log('植物数据尚未加载')
      }
    })

    const updateChart = async () => {
      console.log('尝试更新植物区域适应性图表，数据状态:', props.plantsData?.length || 0)

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
        // 准备数据
        let datasets = []

        if (viewType.value === 'individual') {
          if (!selectedPlant.value) {
            console.error('没有选择植物')
            return
          }

          // 验证所选植物数据
          const validPlantData = props.plantsData.filter(
            (item) => item && item.plant_common_name === selectedPlant.value && item.state,
          )

          if (validPlantData.length === 0) {
            console.error('没有找到所选植物的有效数据')
            return
          }

          // 获取植物适应性数据
          const plantData = {}

          // 初始化为零
          states.forEach((state) => {
            plantData[state] = 0
          })

          // 计算每个州中该植物的观察次数
          validPlantData.forEach((item) => {
            if (plantData[item.state] !== undefined) {
              plantData[item.state]++
            }
          })

          // 获取该植物适宜的区域
          const plantInfo = validPlantData.find((item) => true)
          const suitableRegions = plantInfo?.suitable_regions || ''

          // 处理适宜区域文本
          const suitableStates = suitableRegions.split(',').map((s) => s.trim())

          datasets = [
            {
              label: selectedPlant.value,
              data: states.map((state) => {
                // 如果官方适宜，则值更高
                const isSuitable = suitableStates.includes(state) ? 1 : 0
                // 加上观察次数因子
                return isSuitable + plantData[state] / 100
              }),
              backgroundColor: '#4caf50',
            },
          ]
        } else {
          // 为所有植物创建简化的数据集
          const uniquePlants = [
            ...new Set(props.plantsData.map((item) => item.plant_common_name)),
          ].filter(Boolean)

          // 限制植物数量以避免过多数据
          const displayPlants = uniquePlants.slice(0, 5)

          datasets = displayPlants.map((plant, index) => {
            // 获取该植物的适宜区域
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

        if (viewType.value === 'individual') {
          // 对于单个植物 - 使用条形图
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
                  text: `${selectedPlant.value} 在各区域的适应性`,
                  font: { size: 16 },
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      return context.raw > 1 ? '高度适宜' : context.raw > 0 ? '适宜' : '不适宜'
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
                      return value > 1 ? '高度适宜' : value > 0 ? '适宜' : '不适宜'
                    },
                  },
                },
              },
            },
          })
        } else {
          // 简化热图：使用分组条形图代替
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
                  text: '植物区域适应性',
                  font: { size: 16 },
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const plant = context.dataset.label
                      const state = context.label
                      return context.raw > 0
                        ? `${plant} 适宜在 ${state} 种植`
                        : `${plant} 不适宜在 ${state} 种植`
                    },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 1,
                  ticks: {
                    callback: (value) => {
                      return value > 0 ? '适宜' : '不适宜'
                    },
                  },
                },
              },
            },
          })
        }
      } catch (error) {
        console.error('创建图表时出错:', error)
      }
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

    // 监听数据变化
    watch(
      () => props.plantsData,
      async (newValue) => {
        console.log('植物数据已更新，数据量:', newValue?.length || 0)
        if (newValue && newValue.length > 0) {
          // 提取唯一植物
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

    // 监听视图类型和所选植物变化
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
  width: 100%;
}
select {
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;
}
</style>
