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
    <!-- 使用 :key 动态刷新 canvas，避免重复绑定旧 context -->
    <canvas :key="canvasKey" ref="chartContainer" class="chart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Chart } from 'chart.js/auto'
import gardenData from '@/assets/data.json'

const chart = ref(null)
const chartContainer = ref(null)
const canvasKey = ref(Date.now()) // 用于强制刷新 canvas
const selectedBird = ref('')
const birdsList = ref([])

const updateChart = async () => {
  // 销毁旧图表
  if (chart.value) {
    chart.value.destroy()
    chart.value = null
  }

  // 强制刷新 canvas
  canvasKey.value = Date.now()
  await nextTick()

  // 获取选中鸟类数据
  const birdData = gardenData[selectedBird.value]
  if (!birdData || Object.keys(birdData).length === 0) return

  const sortedPlants = Object.entries(birdData).sort((a, b) => b[1] - a[1])

  // 获取新的 canvas context
  const ctx = chartContainer.value?.getContext('2d')
  if (!ctx) {
    console.error('Canvas context is null.')
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
        legend: { display: false },
        title: {
          display: true,
          text: `${selectedBird.value}'s Preferred Plants`,
          font: { size: 16 },
        },
      },
    },
  })
}

onMounted(() => {
  birdsList.value = Object.keys(gardenData)
  selectedBird.value = birdsList.value[0]
  updateChart()
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
.chart {
  width: 100%;
  height: 400px;
}
.bird-selector {
  margin-bottom: 20px;
}
</style>
