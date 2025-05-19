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
      <button @click="useTestData" class="test-data-button">使用测试数据</button>
    </div>

    <div v-else-if="biodiversityData.length === 0" class="no-data-container">
      <h2>没有数据可显示</h2>
      <p>请确保您的CSV文件已正确上传并格式正确。</p>
      <button @click="useTestData" class="test-data-button">使用测试数据</button>
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
import { ref, onMounted, nextTick } from 'vue'
import Papa from 'papaparse'
import BirdPlantPreferenceChart from '@/components/BirdPlantPreferenceChart.vue'
import MonthlyBirdActivityChart from '@/components//MonthlyBirdActivityChart.vue'
import PlantRegionSuitabilityMap from '@/components//PlantRegionSuitabilityMap.vue'
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

    // 测试数据 - 用于CSV加载失败时
    const testData = [
      {
        species_common_name: 'Australian Magpie',
        species_scientific_name: 'Gymnorhina tibicen',
        month: 'July',
        state: 'QLD',
        observation_count: 6,
        plant_common_name: 'Bottlebrush',
        plant_scientific_name: 'Callistemon spp.',
        optimal_planting_months: 'Sep-Nov',
        growth_duration_weeks: 10,
        flowering_period: 'Sep-Nov',
        sunlight_requirement: 'Full Sun',
        water_requirement: 'Moderate',
        suitable_regions: 'VIC, NSW, QLD',
      },
      {
        species_common_name: 'Australian Magpie',
        species_scientific_name: 'Gymnorhina tibicen',
        month: 'February',
        state: 'WA',
        observation_count: 12,
        plant_common_name: 'Kangaroo Paw',
        plant_scientific_name: 'Anigozanthos spp.',
        optimal_planting_months: 'Aug-Dec',
        growth_duration_weeks: 12,
        flowering_period: 'Aug-Dec',
        sunlight_requirement: 'Full Sun',
        water_requirement: 'Low',
        suitable_regions: 'WA',
      },
      {
        species_common_name: 'Sulphur-crested Cockatoo',
        species_scientific_name: 'Cacatua galerita',
        month: 'August',
        state: 'NSW',
        observation_count: 2,
        plant_common_name: 'Kangaroo Paw',
        plant_scientific_name: 'Anigozanthos spp.',
        optimal_planting_months: 'Aug-Dec',
        growth_duration_weeks: 12,
        flowering_period: 'Aug-Dec',
        sunlight_requirement: 'Full Sun',
        water_requirement: 'Low',
        suitable_regions: 'WA',
      },
      {
        species_common_name: 'Rainbow Lorikeet',
        species_scientific_name: 'Trichoglossus moluccanus',
        month: 'October',
        state: 'QLD',
        observation_count: 3,
        plant_common_name: 'Kangaroo Paw',
        plant_scientific_name: 'Anigozanthos spp.',
        optimal_planting_months: 'Aug-Dec',
        growth_duration_weeks: 12,
        flowering_period: 'Aug-Dec',
        sunlight_requirement: 'Full Sun',
        water_requirement: 'Low',
        suitable_regions: 'WA',
      },
      {
        species_common_name: 'Eastern Rosella',
        species_scientific_name: 'Platycercus eximius',
        month: 'September',
        state: 'VIC',
        observation_count: 4,
        plant_common_name: 'Grevillea',
        plant_scientific_name: 'Grevillea spp.',
        optimal_planting_months: 'Jul-Oct',
        growth_duration_weeks: 14,
        flowering_period: 'Jul-Oct',
        sunlight_requirement: 'Full Sun',
        water_requirement: 'Low',
        suitable_regions: 'NSW, QLD',
      },
      {
        species_common_name: 'Superb Fairywren',
        species_scientific_name: 'Malurus cyaneus',
        month: 'April',
        state: 'SA',
        observation_count: 8,
        plant_common_name: 'Bottlebrush',
        plant_scientific_name: 'Callistemon spp.',
        optimal_planting_months: 'Sep-Nov',
        growth_duration_weeks: 10,
        flowering_period: 'Sep-Nov',
        sunlight_requirement: 'Full Sun',
        water_requirement: 'Moderate',
        suitable_regions: 'VIC, NSW, QLD',
      },
      {
        species_common_name: 'Rainbow Lorikeet',
        species_scientific_name: 'Trichoglossus moluccanus',
        month: 'December',
        state: 'NSW',
        observation_count: 5,
        plant_common_name: 'Lilly Pilly',
        plant_scientific_name: 'Syzygium smithii',
        optimal_planting_months: 'Oct-Feb',
        growth_duration_weeks: 16,
        flowering_period: 'Oct-Dec',
        sunlight_requirement: 'Part Sun',
        water_requirement: 'Moderate',
        suitable_regions: 'NSW, QLD, VIC',
      },
      {
        species_common_name: 'Australian Magpie',
        species_scientific_name: 'Gymnorhina tibicen',
        month: 'June',
        state: 'SA',
        observation_count: 7,
        plant_common_name: 'Wattle',
        plant_scientific_name: 'Acacia spp.',
        optimal_planting_months: 'Aug-Oct',
        growth_duration_weeks: 20,
        flowering_period: 'Jul-Sep',
        sunlight_requirement: 'Full Sun',
        water_requirement: 'Low',
        suitable_regions: 'All States',
      },
    ]

    const loadData = async () => {
      console.log('开始加载数据...')
      loading.value = true
      error.value = null

      try {
        // 加载CSV数据
        // 注意：根据您的项目结构调整路径
        const response = await fetch('@/assets/data/australia_birds_plants.csv')

        if (!response.ok) {
          throw new Error(`HTTP错误！状态码: ${response.status}`)
        }

        const contentType = response.headers.get('content-type')
        console.log('返回的内容类型:', contentType)

        // 获取原始文本并打印前100个字符来调试
        const text = await response.text()
        console.log('返回的内容预览:', text.substring(0, 100))

        if (!text || text.trim() === '') {
          throw new Error('返回的CSV数据为空')
        }

        if (text.includes('<!DOCTYPE html>')) {
          throw new Error('服务器返回了HTML而不是CSV数据，请检查文件路径')
        }

        // 解析CSV
        Papa.parse(text, {
          header: true, // 使用第一行作为标题
          dynamicTyping: true, // 将数字字符串转换为数字
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors && results.errors.length > 0) {
              console.warn('CSV解析警告:', results.errors)
            }

            if (results.data && results.data.length > 0) {
              biodiversityData.value = results.data
              console.log('CSV数据加载成功，记录数:', results.data.length)
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

    // 使用测试数据
    const useTestData = () => {
      console.log('使用测试数据')
      biodiversityData.value = testData
      error.value = null
      loading.value = false

      // 给DOM时间更新，然后手动刷新图表
      setTimeout(refreshCharts, 100)
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
      useTestData,
      refreshCharts,
      birdPlantChart,
      monthlyBirdChart,
      regionMapChart,
      requirementsChart,
    }
  },
}
</script>

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

.refresh-button,
.test-data-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.refresh-button:hover,
.test-data-button:hover {
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
  margin-right: 10px;
}

.test-data-button {
  background-color: #2196f3;
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
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
