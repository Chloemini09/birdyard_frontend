<template>
  <div class="tableau-container">
    <div class="tableauPlaceholder" :id="containerId" style="position: relative">
      <noscript>
        <a href="#">
          <img
            alt="This chart shows the seasonal trend of bird–plant interactions across months, helping identify peak activity periods."
            src="https://public.tableau.com/static/images/Vi/Visualizations_PlantBird/Stackedbar/1_rss.png"
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
  name: 'TableauVisualization',
  props: {
    // 允许自定义容器ID
    containerId: {
      type: String,
      default: 'viz1747693757395',
    },
    // 可视化的URL
    vizUrl: {
      type: String,
      default: 'https://public.tableau.com/views/Visualizations_PlantBird/Stackedbar',
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
        language: 'en-US',
      }),
    },
  },
  data() {
    return {
      viz: null,
      scriptLoaded: false,
    }
  },
  computed: {
    containerSelector() {
      return `#${this.containerId}`
    },
  },
  mounted() {
    this.loadTableauScript()
  },
  beforeUnmount() {
    // 清理Tableau实例
    if (this.viz) {
      this.viz.dispose()
    }
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
    initViz() {
      if (!this.scriptLoaded) return

      // 创建容器元素
      const containerDiv = document.querySelector(this.containerSelector)
      if (!containerDiv) return

      // 设置容器尺寸 - 响应式宽度
      const containerWidth = containerDiv.offsetWidth
      const containerHeight = containerWidth * 0.75

      // 配置可视化参数
      const options = {
        hideTabs: this.vizOptions.hideTabs,
        hideToolbar: !this.vizOptions.hideToolbar,
        onFirstInteractive: () => {
          this.$emit('visualization-loaded')
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
  },
}
</script>

<style scoped>
.tableau-container {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}
</style>
