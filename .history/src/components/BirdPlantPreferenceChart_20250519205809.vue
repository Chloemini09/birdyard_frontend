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
    <!-- Using canvas tag instead of div -->
    <canvas ref="chartContainer" class="chart"></canvas>
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
    const chartId = ref(Date.now().toString()) // 为图表创建唯一ID

    // 确保组件卸载时销毁图表
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
      // Wait for data to load and DOM to be mounted
      if (props.birdsData && props.birdsData.length > 0) {
        // Extract unique birds
        const birds = [...new Set(props.birdsData.map((item) => item.species_common_name))].filter(
          Boolean,
        )
        birdsList.value = birds
        selectedBird.value = birds[0] || ''
        // Wait for DOM update
        await nextTick()
        updateChart()
      } else {
        console.log('Bird data not yet loaded')
      }
    })

    const updateChart = async () => {
      console.log(
        'Attempting to update bird-plant preference chart, data status:',
        props.birdsData?.length || 0,
      )
      // Strictly check data and DOM elements
      if (!chartContainer.value) {
        console.error('Chart container element does not exist or is not mounted')
        return
      }
      // Check if data is valid
      if (!props.birdsData || !Array.isArray(props.birdsData) || props.birdsData.length === 0) {
        console.error('Bird data is invalid or empty')
        return
      }
      if (!selectedBird.value) {
        console.error('No bird selected')
        return
      }

      try {
        // 确保旧图表被销毁
        if (chart.value) {
          chart.value.destroy()
          chart.value = null
        }

        // 后续代码中先执行数据处理，确保所有数据都是有效的
        // Further validate data structure
        const validBirdData = props.birdsData.filter(
          (item) =>
            item && item.species_common_name === selectedBird.value && item.plant_common_name,
        )
        if (validBirdData.length === 0) {
          console.error('No valid data found for selected bird')
          return
        }
        // Prepare data for selected bird
        const plantCounts = {}
        validBirdData.forEach((item) => {
          if (!plantCounts[item.plant_common_name]) {
            plantCounts[item.plant_common_name] = 0
          }
          plantCounts[item.plant_common_name] += Number(item.observation_count) || 1
        })
        // Sort plants by observation count
        const sortedPlants = Object.entries(plantCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
        console.log('Data prepared for chart:', sortedPlants)
        // Ensure there is data to draw
        if (sortedPlants.length === 0) {
          console.error('Not enough data to create chart')
          return
        }

        // 等待DOM更新完成
        await nextTick()

        // 确保canvas元素已重置
        if (!chartContainer.value) {
          console.error('Chart container no longer exists')
          return
        }

        // 创建图表前再次检查canvas上下文
        const ctx = chartContainer.value.getContext('2d')
        if (!ctx) {
          console.error('Could not get canvas context')
          return
        }

        // 创建具有唯一ID的新图表
        chart.value = new Chart(ctx, {
          type: 'bar',
          id: chartId.value, // 使用唯一ID
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
          },
        })
      } catch (error) {
        console.error('Error creating chart:', error)
      }
    }

    // Watch for data changes - 减少不必要的更新
    watch(
      () => props.birdsData,
      async (newValue, oldValue) => {
        // 只有当数据真正变化时才更新
        if (
          newValue &&
          newValue.length > 0 &&
          (!oldValue || oldValue.length === 0 || newValue.length !== oldValue.length)
        ) {
          console.log('Bird data updated, data amount:', newValue?.length || 0)
          // Extract unique birds
          const birds = [...new Set(newValue.map((item) => item.species_common_name))].filter(
            Boolean,
          )
          birdsList.value = birds
          if (!selectedBird.value && birds.length > 0) {
            selectedBird.value = birds[0]
          } else {
            // 确保数据改变时更新图表
            await nextTick()
            updateChart()
          }
        }
      },
      { deep: true },
    )

    // Watch for selected bird changes
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
