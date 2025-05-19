<template>
  <div class="biodiversity-dashboard">
    <header class="dashboard-header">
      <h1>澳大利亚后院生物多样性</h1>
      <p>探索最适合吸引本地鸟类的植物</p>
    </header>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载数据...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <h2>加载数据时出错</h2>
      <p>{{ error }}</p>
      <button @click="loadData" class="retry-button">重试</button>
    </div>

    <div v-else-if="biodiversityData.length === 0" class="no-data-container">
      <h2>没有数据可显示</h2>
      <p>请确保您的CSV文件已正确上传并格式正确。</p>
    </div>

    <div v-else class="charts-container">
      <div class="data-info">
        <strong>数据状态:</strong> 已加载 {{ biodiversityData.length }} 条记录
        <button @click="refreshCharts" class="refresh-button">刷新图表</button>
      </div>

      <div class="chart-row">
        <BirdPlantPreferenceChart :birdsData="biodiversityData" ref="birdPlantChart" />
        <MonthlyBirdActivityChart :birdsData="biodiversityData" ref="monthlyBirdChart" />
      </div>

      <div class="chart-row">
        <PlantRegionSuitabilityMap :plantsData="biodiversityData" ref="regionMapChart" />
        <PlantRequirementsChart :plantsData="biodiversityData" ref="requirementsChart" />
      </div>
    </div>
  </div>
</template>

<script>
// 方法1: 直接导入CSV文件 (推荐)
import csvPath from '@/assets/data/australia_birds_plants.csv?url'
// 或者如果您使用Vite 2.0+，可以用这种方式:
// import csvPath from '@/assets/data/australia_birds_plants.csv?raw';

import { ref, onMounted, nextTick } from 'vue'
import Papa from 'papaparse'
import BirdPlantPreferenceChart from '@/components/BirdPlantPreferenceChart.vue'
import MonthlyBirdActivityChart from '@/components/MonthlyBirdActivityChart.vue'
import PlantRegionSuitabilityMap from '@/components/PlantRegionSuitabilityMap.vue'
import PlantRequirementsChart from '@/components/PlantRequirementsChart.vue'

export default {
  name: 'BiodiversityDashboard',
  components: {
    BirdPlantPreferenceChart,
    MonthlyBirdActivityChart,
    PlantRegionSuitabilityMap,
    PlantRequirementsChart,
  },
  setup() {
    const biodiversityData = ref([])
    const loading = ref(true)
    const error = ref(null)
    const birdPlantChart = ref(null)
    const monthlyBirdChart = ref(null)
    const regionMapChart = ref(null)
    const requirementsChart = ref(null)

    const loadData = async () => {
      console.log('开始加载数据...')
      loading.value = true
      error.value = null

      try {
        // 方法1: 使用导入的CSV文件路径 (推荐)
        console.log('从导入的路径加载CSV:', csvPath)
        const response = await fetch(csvPath)

        if (!response.ok) {
          throw new Error(`HTTP错误！状态码: ${response.status}`)
        }

        const text = await response.text()
        console.log('CSV内容前100个字符:', text.substring(0, 100))

        // 确保返回的不是HTML
        if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
          throw new Error('返回的内容是HTML，不是CSV。请检查文件路径。')
        }

        // 解析CSV
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors && results.errors.length > 0) {
              console.warn('CSV解析警告:', results.errors)
            }

            if (results.data && results.data.length > 0) {
              biodiversityData.value = results.data
              console.log('CSV数据加载成功，记录数:', results.data.length)
              console.log('数据示例:', results.data[0])
            } else {
              throw new Error('CSV解析结果为空')
            }

            loading.value = false
          },
          error: (parseError) => {
            console.error('CSV解析错误:', parseError)
            error.value = `CSV解析错误: ${parseError.message}`
            loading.value = false
          },
        })
      } catch (fetchError) {
        console.error('加载生物多样性数据时出错:', fetchError)
        error.value = `加载数据错误: ${fetchError.message}`
        loading.value = false
      }
    }

    // 手动刷新所有图表
    const refreshCharts = async () => {
      console.log('手动刷新图表')
      await nextTick()

      // 依次手动触发每个图表的更新
      if (birdPlantChart.value && birdPlantChart.value.updateChart) {
        birdPlantChart.value.updateChart()
      }

      if (monthlyBirdChart.value && monthlyBirdChart.value.updateChart) {
        monthlyBirdChart.value.updateChart()
      }

      if (regionMapChart.value && regionMapChart.value.updateChart) {
        regionMapChart.value.updateChart()
      }

      if (requirementsChart.value && requirementsChart.value.updateChart) {
        requirementsChart.value.updateChart()
      }
    }

    // 在组件挂载时加载数据
    onMounted(() => {
      loadData()
    })

    return {
      biodiversityData,
      loading,
      error,
      loadData,
      refreshCharts,
      birdPlantChart,
      monthlyBirdChart,
      regionMapChart,
      requirementsChart,
    }
  },
}
</script>

<!-- 样式部分保持不变 -->
<style scoped>
.biodiversity-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}

.dashboard-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.dashboard-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.data-info {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f0f8ff;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.refresh-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.refresh-button:hover {
  background-color: #3d8b40;
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.loading-container,
.error-container,
.no-data-container {
  text-align: center;
  padding: 50px;
  background: #f9f9f9;
  border-radius: 8px;
  margin: 30px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  margin: 0 auto 20px;
}

.retry-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .chart-row {
    grid-template-columns: 1fr;
  }
}
</style>
