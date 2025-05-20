<template>
  <div class="tableau-viz-container">
    <h2 v-if="title">{{ title }}</h2>
    <p v-if="description">{{ description }}</p>

    <div :id="vizId" ref="vizContainerRef" class="tableauPlaceholder" :aria-label="ariaLabel">
      <noscript>
        <a :href="tableauWorkbookUrl || '#'">
          <img :alt="noscriptAltText" :src="staticImageUrl" style="border: none" />
        </a>
      </noscript>
      <object ref="vizObjectRef" class="tableauViz" style="display: none">
        <param name="host_url" :value="tableauHostUrl" />
        <param name="embed_code_version" value="3" />
        <param name="site_root" :value="tableauSiteRoot" />
        <param name="name" :value="tableauVizName" />
        <param name="tabs" :value="showTabs ? 'yes' : 'no'" />
        <param name="toolbar" :value="showToolbar ? 'yes' : 'no'" />
        <param name="static_image" :value="staticImageUrl" />
        <param name="animate_transition" value="yes" />
        <param name="display_static_image" value="yes" />
        <param name="display_spinner" value="yes" />
        <param name="display_overlay" value="yes" />
        <param name="display_count" value="yes" />
        <param name="language" :value="language" />
      </object>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// --- Props for reusability ---
const props = defineProps({
  // Component display props
  title: {
    type: String,
    default: 'Bird-Plant Interaction Heatmap',
  },
  description: {
    type: String,
    default:
      'This heatmap shows the percentage of bird–plant interactions, with each cell representing how often a specific bird was observed visiting a specific plant.',
  },
  ariaLabel: {
    type: String,
    default:
      'Bird-plant interaction heatmap showing visit frequency of different birds to various plants',
  },
  // Tableau specific props
  vizId: {
    type: String,
    default: 'viz1747699307769', // Using the ID from your provided code
  },
  tableauHostUrl: {
    type: String,
    default: 'https%3A%2F%2Fpublic.tableau.com%2F',
  },
  tableauSiteRoot: {
    type: String,
    default: '',
  },
  tableauVizName: {
    type: String,
    default: 'Visualizations_PlantBird/Heatmap',
  },
  tableauWorkbookUrl: {
    type: String,
    default: '#',
  },
  showTabs: {
    type: Boolean,
    default: false,
  },
  showToolbar: {
    type: Boolean,
    default: true,
  },
  staticImageUrl: {
    type: String,
    default: 'https://public.tableau.com/static/images/Vi/Visualizations_PlantBird/Heatmap/1.png',
  },
  noscriptAltText: {
    type: String,
    default:
      'This heatmap shows the percentage of bird–plant interactions, with each cell representing how often a specific bird was observed visiting a specific plant.',
  },
  language: {
    type: String,
    default: 'en-GB',
  },
  widthPercentage: {
    type: Number,
    default: 100,
  },
  aspectRatio: {
    type: Number,
    default: 0.75,
  },
})

// Emits for event handling
const emit = defineEmits([
  'visualization-loaded',
  'visualization-error',
  'filter-applied',
  'filter-error',
])

// --- Reactive Refs for DOM Elements ---
const vizContainerRef = ref(null)
const vizObjectRef = ref(null)
const vizInstance = ref(null)

// --- Sizing Logic ---
const setVizSize = () => {
  if (vizContainerRef.value) {
    const container = vizContainerRef.value
    const vizElement = container.querySelector('iframe') || vizObjectRef.value

    if (vizElement) {
      vizElement.style.width = '100%'

      if (container.offsetWidth > 0) {
        vizElement.style.height = container.offsetWidth * props.aspectRatio + 'px'
      } else {
        vizElement.style.height = '500px'
      }
    }
  }
}

// --- Public Methods for API ---
// We define these to be exposed via template refs
const reloadViz = () => {
  if (vizInstance.value) {
    vizInstance.value.dispose()
    vizInstance.value = null
  }
  initViz()
}

const applyFilter = (fieldName, values) => {
  if (vizInstance.value && fieldName) {
    try {
      const sheet = vizInstance.value.getWorkbook().getActiveSheet()
      sheet
        .applyFilterAsync(fieldName, values, window.tableau.FilterUpdateType.REPLACE)
        .then(() => {
          emit('filter-applied', { field: fieldName, values })
        })
        .catch((error) => {
          console.error('Filter application failed:', error)
          emit('filter-error', { field: fieldName, error })
        })
    } catch (error) {
      console.error('Error applying filter:', error)
    }
  }
}

const exportImage = () => {
  if (vizInstance.value) {
    vizInstance.value.showExportImageDialog()
  }
}

const exportPDF = () => {
  if (vizInstance.value) {
    vizInstance.value.showExportPDFDialog()
  }
}

const exportData = () => {
  if (vizInstance.value) {
    vizInstance.value.showExportDataDialog()
  }
}

// --- Init Tableau Viz ---
const initViz = () => {
  if (!window.tableau || !window.tableau.Viz) {
    console.warn('Tableau API not loaded yet')
    return
  }

  if (!vizContainerRef.value) return

  try {
    // Configure visualization options
    const options = {
      hideTabs: !props.showTabs,
      hideToolbar: !props.showToolbar,
      onFirstInteractive: () => {
        emit('visualization-loaded')
        setVizSize() // Adjust size after visualization is loaded
      },
    }

    // Create new visualization
    vizInstance.value = new window.tableau.Viz(
      vizContainerRef.value,
      `https://public.tableau.com/views/${props.tableauVizName}`,
      options,
    )

    // Initial size adjustment
    nextTick(() => {
      setVizSize()
    })
  } catch (error) {
    console.error('Failed to initialize Tableau visualization:', error)
    emit('visualization-error', error)
  }
}

// --- Setup ResizeObserver for responsive sizing ---
let resizeObserver = null

const setupResizeObserver = () => {
  if (window.ResizeObserver && vizContainerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      setVizSize()
    })
    resizeObserver.observe(vizContainerRef.value)
  }
}

// --- Lifecycle Hooks ---
onMounted(async () => {
  // Ensure DOM is fully updated
  await nextTick()

  // Setup resize handling
  setupResizeObserver()
  window.addEventListener('resize', setVizSize)

  // Load Tableau JavaScript API if not already loaded
  if (
    !document.querySelector('script[src="https://public.tableau.com/javascripts/api/viz_v1.js"]')
  ) {
    const scriptElement = document.createElement('script')
    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js'
    scriptElement.async = true
    scriptElement.onload = () => {
      initViz()
    }

    if (vizObjectRef.value && vizObjectRef.value.parentNode) {
      vizObjectRef.value.parentNode.insertBefore(scriptElement, vizObjectRef.value)
    } else {
      document.head.appendChild(scriptElement)
    }
  } else if (window.tableau && window.tableau.Viz) {
    // API already loaded, initialize viz directly
    initViz()
  } else {
    // API script loaded but tableau object not yet available
    const checkTableauInterval = setInterval(() => {
      if (window.tableau && window.tableau.Viz) {
        clearInterval(checkTableauInterval)
        initViz()
      }
    }, 100)

    // Safety timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkTableauInterval)
      if (!window.tableau || !window.tableau.Viz) {
        console.error('Tableau API failed to initialize after timeout')
        emit('visualization-error', new Error('Tableau API initialization timeout'))
      }
    }, 5000)
  }
})

onUnmounted(() => {
  // Clean up
  window.removeEventListener('resize', setVizSize)

  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  if (vizInstance.value) {
    vizInstance.value.dispose()
    vizInstance.value = null
  }
})

// Expose methods for parent component
defineExpose({
  reloadViz,
  applyFilter,
  exportImage,
  exportPDF,
  exportData,
})
</script>

<style scoped>
.tableau-viz-container {
  width: v-bind('`${props.widthPercentage}%`');
  margin: 0 auto 30px auto;
  max-width: 600px;
}

.tableau-viz-container h2 {
  text-align: center;
  color: #333;
  margin-bottom: 15px;
  font-size: 1.6em;
}

.tableau-viz-container p {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  color: #555;
  max-width: 900px;
  font-size: 1.1em;
}

.tableauPlaceholder {
  position: relative;
  margin: 0 auto;
  min-height: 400px;
  width: 100%;
}

.tableauViz {
  margin: 0 auto;
}
</style>
