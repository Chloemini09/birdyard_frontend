<template>
  <div class="chart-container">
    <h2>鸟类-植物偏好</h2>
    <div class="bird-selector">
      <label for="bird-select">选择鸟类：</label>
      <select id="bird-select" v-model="selectedBird" @change="updateChart">
        <option v-for="bird in birdsList" :key="bird" :value="bird">
          {{ bird }}
        </option>
      </select>
    </div>
    <!-- 使用canvas标签，而不是div -->
    <canvas ref="chartContainer" class="chart"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'BirdPlantPreferenceChart',
  props: {
    birdsData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const chartContainer = ref(null)
    const chart = ref(null)
    const selectedBird = ref('')
    const birdsList = ref([])

    onMounted(async () => {
      console.log('BirdPlantPreferenceChart 组件已挂载，数据状态:', props.birdsData?.length || 0)
      // 等待数据加载完成且DOM已挂载
      if (props.birdsData && props.birdsData.length > 0) {
        // 提取唯一鸟类
        const birds = [...new Set(props.birdsData.map((item) => item.species_common_name))].filter(
          Boolean,
        )
        birdsList.value = birds
        selectedBird.value = birds[0] || ''

        // 等待DOM更新
        await nextTick()
        updateChart()
      } else {
        console.log('鸟类数据尚未加载')
      }
    })

    const updateChart = async () => {
      console.log('尝试更新鸟类-植物偏好图表，数据状态:', props.birdsData?.length || 0)

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

      if (!selectedBird.value) {
        console.error('没有选择鸟类')
        return
      }

      try {
        // 进一步验证数据结构
        const validBirdData = props.birdsData.filter(
          (item) =>
            item && item.species_common_name === selectedBird.value && item.plant_common_name,
        )

        if (validBirdData.length === 0) {
          console.error('没有找到所选鸟类的有效数据')
          return
        }

        // 准备所选鸟类的数据
        const plantCounts = {}
        validBirdData.forEach((item) => {
          if (!plantCounts[item.plant_common_name]) {
            plantCounts[item.plant_common_name] = 0
          }
          plantCounts[item.plant_common_name] += Number(item.observation_count) || 1
        })

        // 按观察次数排序植物
        const sortedPlants = Object.entries(plantCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)

        console.log('为图表准备的数据:', sortedPlants)

        // 确保有数据可绘制
        if (sortedPlants.length === 0) {
          console.error('没有足够的数据来创建图表')
          return
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

        chart.value = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: sortedPlants.map((item) => item[0]),
            datasets: [
              {
                label: `${selectedBird.value} 偏好的植物`,
                data: sortedPlants.map((item) => item[1]),
                backgroundColor: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3'],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: `${selectedBird.value} 的首选植物`,
                font: {
                  size: 16,
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

          if (!selectedBird.value && birds.length > 0) {
            selectedBird.value = birds[0]
          }

          // 等待DOM更新
          await nextTick()
          updateChart()
        }
      },
      { deep: true },
    )

    // 监听所选鸟类变化
    watch(() => selectedBird.value, updateChart)

    return {
      chartContainer,
      selectedBird,
      birdsList,
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
.bird-selector {
  margin-bottom: 15px;
}
.chart {
  height: 300px;
  width: 100%;
}
select {
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;
}
</style>
