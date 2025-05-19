<template>
  <div class="chart-container">
    <h2>月度鸟类活动</h2>
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
import { onMounted, ref, watch, nextTick } from 'vue'
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

    onMounted(async () => {
      console.log('MonthlyBirdActivityChart 组件已挂载，数据状态:', props.birdsData)
      if (props.birdsData && props.birdsData.length > 0) {
        // 提取唯一鸟类
        birdsList.value = [...new Set(props.birdsData.map((item) => item.species_common_name))]
        // 默认选择前两种鸟类（如果有）
        selectedBirds.value = birdsList.value.slice(0, 2)

        await nextTick()
        updateChart()
      }
    })

    const getBirdColor = (bird) => {
      return birdColors[bird] || '#666666'
    }

    const updateChart = async () => {
      if (!chartContainer.value) {
        console.error('图表容器元素不存在')
        return
      }

      if (!props.birdsData || props.birdsData.length === 0 || selectedBirds.value.length === 0) {
        console.error('更新图表时缺少必要数据')
        return
      }

      try {
        // 准备所有选定鸟类的月度数据
        const monthlyData = {}

        selectedBirds.value.forEach((bird) => {
          monthlyData[bird] = Array(12).fill(0)

          props.birdsData
            .filter((item) => item.species_common_name === bird)
            .forEach((item) => {
              const monthIndex = months.indexOf(item.month)
              if (monthIndex >= 0) {
                monthlyData[bird][monthIndex] += item.observation_count || 1
              }
            })
        })

        // 创建数据集
        const datasets = selectedBirds.value.map((bird) => ({
          label: bird,
          data: monthlyData[bird],
          borderColor: getBirdColor(bird),
          backgroundColor: `${getBirdColor(bird)}33`,
          tension: 0.3,
          fill: false,
        }))

        console.log('为月度图表准备的数据集:', datasets)

        // 销毁旧图表（如果存在）
        if (chart.value) {
          chart.value.destroy()
        }

        // 创建新图表
        await nextTick()
        chart.value = new Chart(chartContainer.value, {
          type: 'line',
          data: {
            labels: months,
            datasets,
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: '全年鸟类活动',
                font: {
                  size: 16,
                },
              },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: '观察次数',
                },
              },
            },
          },
        })
      } catch (error) {
        console.error('创建图表时出错:', error)
      }
    }

    // 监听数据变化
    watch(
      () => props.birdsData,
      async (newValue) => {
        if (newValue && newValue.length > 0) {
          // 提取唯一鸟类
          birdsList.value = [...new Set(newValue.map((item) => item.species_common_name))]

          if (selectedBirds.value.length === 0 && birdsList.value.length > 0) {
            selectedBirds.value = birdsList.value.slice(0, 2)
          }

          await nextTick()
          updateChart()
        }
      },
      { deep: true },
    )

    // 监听所选鸟类变化
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
