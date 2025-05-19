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
    <!-- 使用canvas标签，而不是div -->
    <canvas ref="chartContainer" class="chart"></canvas>
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
      console.log('MonthlyBirdActivityChart 组件已挂载，数据状态:', props.birdsData?.length || 0)
      if (props.birdsData && props.birdsData.length > 0) {
        // 提取唯一鸟类
        const birds = [...new Set(props.birdsData.map((item) => item.species_common_name))].filter(
          Boolean,
        )
        birdsList.value = birds
        // 默认选择前两种鸟类（如果有）
        selectedBirds.value = birds.slice(0, Math.min(2, birds.length))

        await nextTick()
        updateChart()
      } else {
        console.log('鸟类数据尚未加载')
      }
    })

    const getBirdColor = (bird) => {
      return birdColors[bird] || '#666666'
    }

    const updateChart = async () => {
      console.log('尝试更新月度鸟类活动图表，数据状态:', props.birdsData?.length || 0)

      // 严格检查数据和DOM元素
      if (!chartContainer.value) {
        console.error('图表容器元素不存在或未挂载')
        return
      }

      // 检查数据是否有效
      if (!props.birdsData || !Array.isArray(props.birdsData) || props.birdsData.length === 0) {
        console.error('鸟类数据无效或为空')
        return
      }

      if (!selectedBirds.value || selectedBirds.value.length === 0) {
        console.error('没有选择鸟类')
        return
      }

      try {
        // 准备所有选定鸟类的月度数据
        const monthlyData = {}
        const validSelectedBirds = []

        for (const bird of selectedBirds.value) {
          // 验证每种鸟类是否有足够的数据
          const birdMonthData = Array(12).fill(0)
          let hasData = false

          props.birdsData
            .filter((item) => item && item.species_common_name === bird)
            .forEach((item) => {
              if (item.month) {
                const monthIndex = months.indexOf(item.month)
                if (monthIndex >= 0) {
                  birdMonthData[monthIndex] += Number(item.observation_count) || 1
                  hasData = true
                }
              }
            })

          if (hasData) {
            monthlyData[bird] = birdMonthData
            validSelectedBirds.push(bird)
          }
        }

        // 确保至少有一种鸟类有数据
        if (validSelectedBirds.length === 0) {
          console.error('所选鸟类没有足够的月度数据')
          return
        }

        // 创建数据集
        const datasets = validSelectedBirds.map((bird) => ({
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

        // 强制等待DOM更新
        await nextTick()

        // 创建新图表 - 确保元素已经准备好
        const ctx = chartContainer.value.getContext('2d')
        if (!ctx) {
          console.error('无法获取画布上下文')
          return
        }

        chart.value = new Chart(ctx, {
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
        console.log('鸟类数据已更新，数据量:', newValue?.length || 0)
        if (newValue && newValue.length > 0) {
          // 提取唯一鸟类
          const birds = [...new Set(newValue.map((item) => item.species_common_name))].filter(
            Boolean,
          )
          birdsList.value = birds

          if (selectedBirds.value.length === 0 && birds.length > 0) {
            selectedBirds.value = birds.slice(0, Math.min(2, birds.length))
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
  width: 100%;
}
</style>
