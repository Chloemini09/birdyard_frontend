<template>
  <div class="tableau-container">
    <div class="tableauPlaceholder" :id="containerId" style="position: relative">
      <noscript>
        <a href="#">
          <img
            alt="This chart shows which birds are most observed in your region and how well the available plants suit them. Larger boxes mean more bird–plant interactions, and darker colors show better plant matches for that bird."
            src="https://public.tableau.com/static/images/Pl/Plant_BirdInteraction_SuitabilityScore/Plant_Bird_Interaction/1_rss.png"
            style="border: none"
          />
        </a>
      </noscript>
      <!-- Tableau visualization will be loaded here -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'BirdPlantInteractionViz',
  props: {
    // 允许自定义容器ID
    containerId: {
      type: String,
      default: 'viz1747696053653',
    },
    // 可视化的URL
    vizUrl: {
      type: String,
      default:
        'https://public.tableau.com/views/Plant_BirdInteraction_SuitabilityScore/Plant_Bird_Interaction',
    },
    // 可视化选项
    vizOptions: {
      type: Object,
      default: () => ({
        hideTabs: true,
        hideToolbar: false,
        showStaticImage: true,
        animate: true,
        showSpinner: true,
        showOverlay: true,
        showCount: true,
        language: 'en-GB',
      }),
    },
    // 自定义高宽比
    aspectRatio: {
      type: Number,
      default: 0.75,
    },
  },
  data() {
    return {
      viz: null,
      scriptLoaded: false,
      resizeObserver: null,
    }
  },
  computed: {
    containerSelector() {
      return `#${this.containerId}`
    },
  },
  mounted() {
    this.loadTableauScript()
    // 添加响应式调整大小的功能
    this.setupResizeObserver()
    // 添加窗口调整大小监听器
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    // 清理Tableau实例
    if (this.viz) {
      this.viz.dispose()
    }

    // 移除大小调整监听器
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }

    // 移除窗口大小监听器
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    loadTableauScript() {
      // 检查是否已加载Tableau脚本
      if (window.tableau && window.tableau.Viz) {
        this.scriptLoaded = true
        this.initViz()
        return
      }

      // 加载Tableau JavaScript API
      const scriptElement = document.createElement('script')
      scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js'
      scriptElement.onload = () => {
        this.scriptLoaded = true
        this.initViz()
      }
      document.head.appendChild(scriptElement)
    },

    setupResizeObserver() {
      // 使用ResizeObserver监控容器大小变化
      if (window.ResizeObserver) {
        const containerDiv = document.querySelector(this.containerSelector)
        if (containerDiv) {
          this.resizeObserver = new ResizeObserver(() => {
            this.adjustVizSize()
          })
          this.resizeObserver.observe(containerDiv)
        }
      }
    },

    handleResize() {
      this.adjustVizSize()
    },

    adjustVizSize() {
      const containerDiv = document.querySelector(this.containerSelector)
      if (!containerDiv) return

      // 获取iframe元素
      const vizElement = containerDiv.querySelector('iframe')
      if (vizElement) {
        const containerWidth = containerDiv.offsetWidth
        const containerHeight = containerWidth * this.aspectRatio

        vizElement.style.width = '100%'
        vizElement.style.height = `${containerHeight}px`
      }
    },

    initViz() {
      if (!this.scriptLoaded) return

      // 创建容器元素
      const containerDiv = document.querySelector(this.containerSelector)
      if (!containerDiv) return

      // 设置容器尺寸 - 响应式宽度
      const containerWidth = containerDiv.offsetWidth
      const containerHeight = containerWidth * this.aspectRatio

      // 配置可视化参数
      const options = {
        hideTabs: this.vizOptions.hideTabs,
        hideToolbar: !this.vizOptions.hideToolbar,
        onFirstInteractive: () => {
          this.$emit('visualization-loaded')
          this.adjustVizSize()
        },
      }

      // 初始化Tableau可视化
      try {
        this.viz = new window.tableau.Viz(containerDiv, this.vizUrl, options)

        // 设置尺寸
        this.$nextTick(() => {
          const vizElement = containerDiv.getElementsByTagName('iframe')[0]
          if (vizElement) {
            vizElement.style.width = '100%'
            vizElement.style.height = `${containerHeight}px`
          }
        })
      } catch (error) {
        console.error('Failed to initialize Tableau visualization:', error)
        this.$emit('visualization-error', error)
      }
    },

    // 可选方法：过滤数据
    applyFilter(fieldName, values) {
      if (this.viz && fieldName) {
        const sheet = this.viz.getWorkbook().getActiveSheet()
        sheet
          .applyFilterAsync(fieldName, values, tableau.FilterUpdateType.REPLACE)
          .then(() => {
            this.$emit('filter-applied', { field: fieldName, values })
          })
          .catch((error) => {
            console.error('Filter application failed:', error)
            this.$emit('filter-error', { field: fieldName, error })
          })
      }
    },

    // 可选方法：重新加载可视化
    reloadViz() {
      if (this.viz) {
        this.viz.dispose()
        this.viz = null
      }
      this.initViz()
    },

    // 可选方法：导出为图片
    exportImage() {
      if (this.viz) {
        this.viz.showExportImageDialog()
      }
    },

    // 可选方法：导出为PDF
    exportPDF() {
      if (this.viz) {
        this.viz.showExportPDFDialog()
      }
    },

    // 可选方法：导出为数据
    exportData() {
      if (this.viz) {
        this.viz.showExportDataDialog()
      }
    },
  },
}
</script>

<style scoped>
.tableau-container {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  margin: 0 auto;
}
</style>
