<template>
  <div class="bar-chart-container">
    <h3 v-if="title" class="chart-title">{{ title }}</h3>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'BarChartComponent',
  props: {
    // Chart configuration
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      required: true,
      // Expects data in format: { labels: [], values: [] }
    },
    colorScheme: {
      type: String,
      default: 'default', // 'default', 'birds', 'plants', 'states'
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
    maxItems: {
      type: Number,
      default: 20, // Show top N items
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
        ],
        plants: [
          '#4caf50',
          '#8bc34a',
          '#cddc39',
          '#ffeb3b',
          '#ffc107',
          '#ff9800',
          '#ff5722',
          '#795548',
          '#c6d8a6',
        ],
        states: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
      },
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
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
      if (!this.chart || !this.data.labels || !this.data.values) return

      // Process data to show only top N items if there are more than maxItems
      let { labels, values } = this.data

      if (labels.length > this.maxItems) {
        // Sort values in descending order and take top N
        const sortedData = labels
          .map((label, index) => ({
            label,
            value: values[index],
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, this.maxItems)

        labels = sortedData.map((item) => item.label)
        values = sortedData.map((item) => item.value)
      }

      // Determine axis based on orientation
      const xAxis = this.horizontal
        ? { type: 'value' }
        : { type: 'category', data: labels, axisLabel: { rotate: labels.length > 10 ? 45 : 0 } }

      const yAxis = this.horizontal ? { type: 'category', data: labels } : { type: 'value' }

      // Choose color scheme
      const colors = this.colorSchemes[this.colorScheme] || this.colorSchemes.default

      // Configure chart options
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}',
        },
        grid: {
          containLabel: true,
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '8%',
        },
        xAxis,
        yAxis,
        series: [
          {
            type: 'bar',
            data: this.horizontal
              ? values.map((value, index) => ({
                  value,
                  name: labels[index],
                }))
              : values,
            itemStyle: {
              color: function (params) {
                // Cycle through colors for each bar
                return colors[params.dataIndex % colors.length]
              },
            },
            label: {
              show: values.length <= 5, // Show value labels if few items
              position: this.horizontal ? 'right' : 'top',
              formatter: '{c}',
            },
          },
        ],
      }

      this.chart.setOption(option)

      // Add click event handler
      this.chart.on('click', (params) => {
        this.$emit('bar-click', {
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
    horizontal() {
      this.updateChart()
    },
    maxItems() {
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
.bar-chart-container {
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
