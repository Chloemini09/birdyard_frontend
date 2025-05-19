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
    const chartContainer = ref(null)
    const chart = ref(null)
    const selectedBird = ref('')
    const birdsList = ref([])

    const canvasId = ref(`chart-canvas-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)
    const canvasKey = ref(Date.now())
    const canvasVisible = ref(true)

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

      canvasVisible.value = false
      canvasKey.value = Date.now()
      await nextTick()
      canvasVisible.value = true
      await nextTick()
    }

    onBeforeUnmount(() => {
      destroyChart()
    })

    const handleBirdChange = async () => {
      await destroyChart()
      await nextTick()
      createChart()
    }

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
        const validBirdData = props.birdsData.filter(
          (item) =>
            item && item.species_common_name === selectedBird.value && item.plant_common_name,
        )

        if (validBirdData.length === 0) {
          console.error('No valid data found for selected bird')
          return
        }

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

        const ctx = chartContainer.value.getContext('2d')
        if (!ctx) {
          console.error('Canvas context not available')
          return
        }

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
  height: 600px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #1a2d00;
  font-size: 1.5rem;
  font-weight: 700;
}

.bird-selector {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.chart-wrapper {
  flex-grow: 1;
  position: relative;
}

.chart {
  min-height: 400px;
  width: 100%;
}

/* 美化下拉菜单 */
label {
  font-weight: 600;
  color: #1a2d00;
  font-size: 1rem;
}

select {
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  background-color: white;
  color: #1a2d00;
  cursor: pointer;
  font-weight: 500;
  width: 220px;
  appearance: none; /* 移除默认箭头 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231a2d00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

select:hover {
  border-color: #1a2d00;
  background-color: #f9fafb;
}

select:focus {
  outline: none;
  border-color: #1a2d00;
  box-shadow: 0 0 0 3px rgba(26, 45, 0, 0.2);
}

/* 在下拉菜单打开时增加背景色变化 */
select:active {
  background-color: #f3f9c0;
}

/* 下拉菜单选项样式 - 注意这只影响某些浏览器 */
select option {
  padding: 10px;
  background-color: white;
  color: #374151;
}

select option:checked {
  background-color: #1a2d00;
  color: white;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .bird-selector {
    flex-direction: column;
    align-items: flex-start;
  }

  select {
    width: 100%;
  }
}
</style>
