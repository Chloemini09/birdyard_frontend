<template>
  <div class="chart-container">
    <h2>Bird-Plant Preferences</h2>
    <div class="bird-selector">
      <label for="bird-select">Select Bird:</label>
      <select id="bird-select" v-model="selectedBird" @change="handleBirdChange">
        <option v-for="bird in birdsList" :key="bird" :value="bird">
          {{ bird }}
        </option>
      </select>
    </div>
    <div class="chart-wrapper">
      <canvas
        v-if="canvasVisible"
        :key="canvasKey"
        :id="canvasId"
        ref="chartContainer"
        class="chart"
      ></canvas>
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
    // 组件状态
    const chartContainer = ref(null)
    const chart = ref(null)
    const selectedBird = ref('')
    const birdsList = ref([])

    // Canvas 控制
    const canvasId = ref(`chart-canvas-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)
    const canvasKey = ref(Date.now())
    const canvasVisible = ref(true)

    // 销毁图表并清理 Canvas
    const destroyChart = async () => {
      console.log('Destroying chart...')
      if (chart.value) {
        try {
          chart.value.destroy()
        } catch (e) {
          console.error('Error destroying chart:', e)
        }
        chart.value = null
      }

      // 重置 canvas
      canvasVisible.value = false
      canvasKey.value = Date.now()
      await nextTick()
      canvasVisible.value = true
      await nextTick()
    }

    // 确保组件卸载时销毁图表
    onBeforeUnmount(() => {
      destroyChart()
    })

    // 鸟类选择变更处理
    const handleBirdChange = async () => {
      await destroyChart()
      await nextTick()
      createChart()
    }

    // 创建新图表
    const createChart = async () => {
      if (!chartContainer.value) {
        console.error('Chart container not found')
        return
      }

      if (!props.birdsData || !props.birdsData.length || !selectedBird.value) {
        console.error('No data or bird selected')
        return
      }

      try {
        // 数据处理部分...
        const validBirdData = props.birdsData.filter(
          (item) =>
            item && item.species_common_name === selectedBird.value && item.plant_common_name,
        )

        if (validBirdData.length === 0) {
          console.error('No valid data found for selected bird')
          return
        }

        // 处理数据
        const plantCounts = {}
        validBirdData.forEach((item) => {
          if (!plantCounts[item.plant_common_name]) {
            plantCounts[item.plant_common_name] = 0
          }
          plantCounts[item.plant_common_name] += Number(item.observation_count) || 1
        })

        const sortedPlants = Object.entries(plantCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)

        if (sortedPlants.length === 0) {
          console.error('Not enough data to create chart')
          return
        }

        // 获取 Canvas 上下文
        const ctx = chartContainer.value.getContext('2d')
        if (!ctx) {
          console.error('Canvas context not available')
          return
        }

        // 创建图表
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
            // 防止ID冲突
            elements: {
              rectangle: {
                borderWidth: 1,
              },
            },
          },
        })

        console.log('Chart created with ID:', chart.value.id)
      } catch (error) {
        console.error('Error creating chart:', error)
      }
    }

    // 数据初始化
    onMounted(async () => {
      if (props.birdsData && props.birdsData.length > 0) {
        const birds = [...new Set(props.birdsData.map((item) => item.species_common_name))].filter(
          Boolean,
        )
        birdsList.value = birds
        selectedBird.value = birds[0] || ''
        await nextTick()
        await createChart()
      }
    })

    // 数据变更监听
    watch(
      () => props.birdsData,
      async (newValue) => {
        if (newValue && newValue.length > 0) {
          const birds = [...new Set(newValue.map((item) => item.species_common_name))].filter(
            Boolean,
          )
          birdsList.value = birds

          if (!selectedBird.value && birds.length > 0) {
            selectedBird.value = birds[0]
          }

          await destroyChart()
          await nextTick()
          await createChart()
        }
      },
      { deep: true },
    )

    return {
      chartContainer,
      selectedBird,
      birdsList,
      canvasId,
      canvasKey,
      canvasVisible,
      handleBirdChange,
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
