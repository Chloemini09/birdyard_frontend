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
    <div ref="chartContainer" class="chart"></div>
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
      console.log('BirdPlantPreferenceChart 组件已挂载，数据状态:', props.birdsData)
      // 确保我们有数据才初始化图表
      if (props.birdsData && props.birdsData.length > 0) {
        // 提取唯一鸟类
        const birds = [...new Set(props.birdsData.map((item) => item.species_common_name))]
        birdsList.value = birds
        selectedBird.value = birds[0] || ''

        // 等待 DOM 更新
        await nextTick()
        updateChart()
      }
    })

    const updateChart = async () => {
      if (!chartContainer.value) {
        console.error('图表容器元素不存在')
        return
      }

      if (!props.birdsData || props.birdsData.length === 0 || !selectedBird.value) {
        console.error('更新图表时缺少必要数据')
        return
      }

      try {
        // 准备所选鸟类的数据
        const plantCounts = {}
        props.birdsData
          .filter((item) => item.species_common_name === selectedBird.value)
          .forEach((item) => {
            if (!plantCounts[item.plant_common_name]) {
              plantCounts[item.plant_common_name] = 0
            }
            plantCounts[item.plant_common_name] += item.observation_count || 1
          })

        // 按观察次数排序植物
        const sortedPlants = Object.entries(plantCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)

        console.log('为图表准备的数据:', sortedPlants)

        // 销毁旧图表（如果存在）
        if (chart.value) {
          chart.value.destroy()
        }

        // 创建新图表
        await nextTick()
        chart.value = new Chart(chartContainer.value, {
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
        if (newValue && newValue.length > 0) {
          // 提取唯一鸟类
          const birds = [...new Set(newValue.map((item) => item.species_common_name))]
          birdsList.value = birds

          if (!selectedBird.value && birds.length > 0) {
            selectedBird.value = birds[0]
          }

          // 等待 DOM 更新
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
}
select {
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;
}
</style>
