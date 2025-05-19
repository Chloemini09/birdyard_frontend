<template>
  <div class="chart-container">
    <h2>Bird-Plant Preferences</h2>
    <div class="bird-selector">
      <label for="bird-select">Select Bird:</label>
      <select id="bird-select" v-model="selectedBird" @change="updateChart">
        <option v-for="bird in birdsList" :key="bird" :value="bird">
          {{ bird }}
        </option>
      </select>
    </div>
    <!-- 确保每次只创建一个canvas实例 -->
    <div class="chart-wrapper">
      <canvas ref="chartContainer" class="chart"></canvas>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, nextTick, onBeforeUnmount } from 'vue'
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

    // 在组件卸载前确保销毁图表实例
    onBeforeUnmount(() => {
      if (chart.value) {
        chart.value.destroy()
        chart.value = null
      }
    })

    onMounted(async () => {
      console.log(
        'BirdPlantPreferenceChart component mounted, data status:',
        props.birdsData?.length || 0,
      )

      // 确保数据已加载
      if (props.birdsData && props.birdsData.length > 0) {
        // 提取唯一的鸟类名称
        const birds = [...new Set(props.birdsData.map((item) => item.species_common_name))].filter(
          Boolean,
        )
        birdsList.value = birds
        selectedBird.value = birds[0] || ''

        // 等待DOM更新
        await nextTick()
        // 延迟一点时间确保DOM完全渲染
        setTimeout(() => {
          updateChart()
        }, 100)
      } else {
        console.log('Bird data not yet loaded')
      }
    })

    const updateChart = async () => {
      console.log(
        'Attempting to update bird-plant preference chart, data status:',
        props.birdsData?.length || 0,
      )

      // 确保chartContainer已挂载
      if (!chartContainer.value) {
        console.error('Chart container element does not exist or is not mounted')
        return
      }

      // 验证数据
      if (!props.birdsData || !Array.isArray(props.birdsData) || props.birdsData.length === 0) {
        console.error('Bird data is invalid or empty')
        return
      }

      if (!selectedBird.value) {
        console.error('No bird selected')
        return
      }

      try {
        // 进一步验证数据结构
        const validBirdData = props.birdsData.filter(
          (item) =>
            item && item.species_common_name === selectedBird.value && item.plant_common_name,
        )

        if (validBirdData.length === 0) {
          console.error('No valid data found for selected bird')
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

        // 按观察计数对植物进行排序
        const sortedPlants = Object.entries(plantCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)

        console.log('Data prepared for chart:', sortedPlants)

        // 确保有数据可绘制
        if (sortedPlants.length === 0) {
          console.error('Not enough data to create chart')
          return
        }

        // 先销毁旧图表（如果存在）
        if (chart.value) {
          chart.value.destroy()
          chart.value = null
        }

        // 强制等待DOM更新
        await nextTick()

        // 创建新图表 - 确保元素已就绪
        const ctx = chartContainer.value.getContext('2d')
        if (!ctx) {
          console.error('Could not get canvas context')
          return
        }

        // 确保在此处创建图表前canvas上下文是干净的
        chart.value = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: sortedPlants.map((item) => item[0]),
            datasets: [
              {
                label: `${selectedBird.value} Preferred Plants`,
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
            scales: {
              y: {
                ticks: {
                  padding: 5,
                },
              },
              x: {
                display: true,
                position: 'bottom',
              },
            },
            barPercentage: 0.8,
            barThickness: 20,
            categoryPercentage: 0.2,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: `${selectedBird.value}'s Preferred Plants`,
                font: {
                  size: 16,
                },
              },
            },
          },
        })
      } catch (error) {
        console.error('Error creating chart:', error)
      }
    }

    // 监视数据变化
    watch(
      () => props.birdsData,
      async (newValue) => {
        console.log('Bird data updated, data amount:', newValue?.length || 0)
        if (newValue && newValue.length > 0) {
          // 提取唯一的鸟类
          const birds = [...new Set(newValue.map((item) => item.species_common_name))].filter(
            Boolean,
          )
          birdsList.value = birds

          if (!selectedBird.value && birds.length > 0) {
            selectedBird.value = birds[0]
          }

          // 等待DOM更新
          await nextTick()
          // 延迟图表更新确保DOM已更新
          setTimeout(() => {
            updateChart()
          }, 100)
        }
      },
      { deep: true },
    )

    // 监视所选鸟类变化
    watch(
      () => selectedBird.value,
      () => {
        // 延迟图表更新以确保DOM已更新
        setTimeout(() => {
          updateChart()
        }, 100)
      },
    )

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
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}
.bird-selector {
  margin-bottom: 15px;
}
.chart-wrapper {
  height: 200px;
  width: 100%;
  position: relative;
}
.chart {
  height: 100%;
  width: 100%;
}
select {
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;
}
</style>
