<template>
  <div class="chart-container">
    <h2>Monthly Bird Activity</h2>
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
    <!-- Using canvas tag instead of div -->
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
      'Australian Magpie': '#bcdb40',
      'Sulphur-crested Cockatoo': '#2a5736',
      'Rainbow Lorikeet': '#5ab3c4',
      'Eastern Rosella': '#4456db',
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
      console.log(
        'MonthlyBirdActivityChart component mounted, data status:',
        props.birdsData?.length || 0,
      )
      if (props.birdsData && props.birdsData.length > 0) {
        // Extract unique birds
        const birds = [...new Set(props.birdsData.map((item) => item.species_common_name))].filter(
          Boolean,
        )
        birdsList.value = birds
        // Default select first two birds (if available)
        selectedBirds.value = birds.slice(0, Math.min(2, birds.length))

        await nextTick()
        updateChart()
      } else {
        console.log('Bird data not yet loaded')
      }
    })

    const getBirdColor = (bird) => {
      return birdColors[bird] || '#666666'
    }

    const updateChart = async () => {
      console.log(
        'Attempting to update monthly bird activity chart, data status:',
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

      if (!selectedBirds.value || selectedBirds.value.length === 0) {
        console.error('No birds selected')
        return
      }

      try {
        // Prepare monthly data for all selected birds
        const monthlyData = {}
        const validSelectedBirds = []

        for (const bird of selectedBirds.value) {
          // Validate if each bird has enough data
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

        // Ensure at least one bird has data
        if (validSelectedBirds.length === 0) {
          console.error('Selected birds do not have sufficient monthly data')
          return
        }

        // Create datasets
        const datasets = validSelectedBirds.map((bird) => ({
          label: bird,
          data: monthlyData[bird],
          borderColor: getBirdColor(bird),
          backgroundColor: `${getBirdColor(bird)}33`,
          tension: 0.3,
          fill: false,
        }))

        console.log('Datasets prepared for monthly chart:', datasets)

        // Destroy old chart (if exists)
        if (chart.value) {
          chart.value.destroy()
        }

        // Force wait for DOM update
        await nextTick()

        // Create new chart - ensure element is ready
        const ctx = chartContainer.value.getContext('2d')
        if (!ctx) {
          console.error('Could not get canvas context')
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
                text: 'Year-round Bird Activity',
                font: {
                  size: 16,
                },
              },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Observation Count',
                },
              },
            },
          },
        })
      } catch (error) {
        console.error('Error creating chart:', error)
      }
    }

    // Watch for data changes
    watch(
      () => props.birdsData,
      async (newValue) => {
        console.log('Bird data updated, data amount:', newValue?.length || 0)
        if (newValue && newValue.length > 0) {
          // Extract unique birds
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

    // Watch for selected birds changes
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
  height: 600px; /* 保持容器高度 */
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: flex;
  flex-direction: column; /* 设置为纵向弹性布局 */
}

.bird-toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  flex-shrink: 0; /* 防止选择器部分被压缩 */
}

.toggle-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.chart {
  flex-grow: 1; /* 让图表占据剩余所有空间 */
  width: 100%;
  min-height: 400px; /* 确保图表有最小高度 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .chart-container {
    height: 500px; /* 在移动设备上略微降低高度 */
  }

  .chart {
    min-height: 300px;
  }
}
</style>
