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
    <canvas :key="canvasKey" ref="chartContainer" class="chart"></canvas>
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
  const canvasKey = ref(Date.now()) // 每次强制刷新canvas
  const selectedBird = ref('')
  const birdsList = ref([])

  const updateChart = async () => {
    // 销毁旧图表
    if (chart.value) {
      chart.value.destroy()
      chart.value = null
    }

    // 强制重新渲染 canvas（可选，但推荐）
    canvasKey.value = Date.now()

    await nextTick()

    const ctx = chartContainer.value?.getContext('2d')
    if (!ctx) {
      console.error('Could not get canvas context')
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
.chart {
  height: 200px;
  width: 100%;
}
select {
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;
}
</style>
