<template>
  <div class="word-cloud-container">
    <h3 v-if="title" class="chart-title">{{ title }}</h3>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-wordcloud'

export default {
  name: 'WordCloudComponent',
  props: {
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      required: true,
      // Expects array of objects: [{ name: 'word', value: frequency }]
    },
    colorScheme: {
      type: String,
      default: 'default', // 'default', 'birds', 'plants'
    },
    shape: {
      type: String,
      default: 'circle', // 'circle', 'cardioid', 'diamond', 'triangle', 'star'
    },
    minFontSize: {
      type: Number,
      default: 12,
    },
    maxFontSize: {
      type: Number,
      default: 60,
    },
  },
  data() {
    return {
      chart: null,
      colorSchemes: {
        default: [
          '#5470c6',
          '#91cc75',
          '#fac858',
          '#ee6666',
          '#73c0de',
          '#3ba272',
          '#fc8452',
          '#9a60b4',
          '#ea7ccc',
        ],
        birds: [
          '#67b7dc',
          '#6794dc',
          '#6771dc',
          '#8067dc',
          '#a367dc',
          '#c767dc',
          '#dc67ce',
          '#dc67ab',
          '#dc6788',
          '#dc6967',
          '#dc8c67',
          '#dcaf67',
        ],
        plants: [
          '#4caf50',
          '#8bc34a',
          '#cddc39',
          '#ffeb3b',
          '#ffc107',
          '#ff9800',
          '#ff5722',
          '#4db6ac',
          '#a5d6a7',
          '#c5e1a5',
          '#e6ee9c',
          '#c6d8a6',
        ],
      },
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      // Make sure echarts-wordcloud is properly loaded
      if (!echarts.getMap) {
        console.error('echarts-wordcloud is not properly loaded')
        return
      }

      this.chart = echarts.init(this.$refs.chartContainer)
      this.updateChart()

      // Make chart responsive
      window.addEventListener('resize', this.resizeChart)
    },

    resizeChart() {
      if (this.chart) {
        this.chart.resize()
      }
    },

    updateChart() {
      if (!this.chart || !this.data || this.data.length === 0) return

      // Get color scheme
      const colors = this.colorSchemes[this.colorScheme] || this.colorSchemes.default

      // Configure chart options
      const option = {
        series: [
          {
            type: 'wordCloud',
            shape: this.shape,
            left: 'center',
            top: 'center',
            right: null,
            bottom: null,
            width: '90%',
            height: '90%',
            sizeRange: [this.minFontSize, this.maxFontSize],
            rotationRange: [-45, 45],
            rotationStep: 15,
            gridSize: 8,
            drawOutOfBound: false,
            textStyle: {
              fontFamily: 'sans-serif',
              fontWeight: 'bold',
              color: function () {
                return colors[Math.floor(Math.random() * colors.length)]
              },
            },
            emphasis: {
              textStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
              },
            },
            data: this.data,
          },
        ],
      }

      this.chart.setOption(option)

      // Add click event handler
      this.chart.on('click', (params) => {
        this.$emit('word-click', {
          name: params.name,
          value: params.value,
          dataIndex: params.dataIndex,
        })
      })
    },
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.updateChart()
      },
    },
    colorScheme() {
      this.updateChart()
    },
    shape() {
      this.updateChart()
    },
    minFontSize() {
      this.updateChart()
    },
    maxFontSize() {
      this.updateChart()
    },
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose()
      window.removeEventListener('resize', this.resizeChart)
    }
  },
}
</script>

<style scoped>
.word-cloud-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.chart-title {
  text-align: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.chart-container {
  flex: 1;
  min-height: 300px;
}
</style>
