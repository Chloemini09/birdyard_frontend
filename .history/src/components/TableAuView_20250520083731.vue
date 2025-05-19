<template>
  <div class="tableau-viz-container">
    <h2 v-if="title">{{ title }}</h2>
    <p v-if="description">{{ description }}</p>

    <div
      :id="vizId"
      ref="vizContainerRef"
      class="tableauPlaceholder"
      style="position: relative"
      :aria-label="ariaLabel"
    >
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
        <!-- Add any other specific params you might need -->
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
    default: 'Seasonal Trend of Bird–Plant Interactions',
  },
  description: {
    type: String,
    default:
      'This chart shows the seasonal trend of bird–plant interactions across months, helping identify peak activity periods.',
  },
  ariaLabel: {
    type: String,
    default: 'Interactive chart showing seasonal bird-plant interactions by month',
  },
  // Tableau specific props (defaults from your original embed)
  vizId: {
    type: String,
    default: () => `viz${Date.now()}${Math.floor(Math.random() * 1000)}`, // Generate a unique ID
  },
  tableauHostUrl: {
    type: String,
    default: 'https://public.tableau.com/',
  },
  tableauSiteRoot: {
    type: String,
    default: '',
  },
  tableauVizName: {
    type: String,
    default: 'Visualizations_PlantBird/Stackedbar', // Example: 'MyWorkbook/MySheet'
  },
  tableauWorkbookUrl: {
    // For the noscript link
    type: String,
    default: '#', // Or ideally the direct link to the viz on Tableau Public
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
    default:
      'https://public.tableau.com/static/images/Vi/Visualizations_PlantBird/Stackedbar/1.png', // Fallback static image
  },
  noscriptAltText: {
    type: String,
    default:
      'This chart shows the seasonal trend of bird–plant interactions across months, helping identify peak activity periods.',
  },
  language: {
    type: String,
    default: 'en-US',
  },
})

// --- Reactive Refs for DOM Elements ---
const vizContainerRef = ref(null) // Ref for the main div container
const vizObjectRef = ref(null) // Ref for the <object> element

// --- Sizing Logic ---
const setVizSize = () => {
  if (vizContainerRef.value && vizObjectRef.value) {
    const container = vizContainerRef.value
    const viz = vizObjectRef.value
    viz.style.width = '100%'
    // Ensure container has rendered and has a width
    if (container.offsetWidth > 0) {
      viz.style.height = container.offsetWidth * 0.75 + 'px' // 4:3 aspect ratio
    } else {
      // Fallback or default height if offsetWidth is 0 (e.g., hidden initially)
      viz.style.height = '600px' // Adjust as needed
    }
  }
}

// --- Lifecycle Hooks ---
onMounted(async () => {
  // Ensure DOM is fully updated before calculating sizes
  await nextTick()
  setVizSize() // Set initial size

  // Add resize listener for responsiveness
  window.addEventListener('resize', setVizSize)

  // Load Tableau JavaScript API
  // Check if the script is already loaded to avoid duplicates if multiple instances of this component are used
  if (
    !document.querySelector('script[src="https://public.tableau.com/javascripts/api/viz_v1.js"]')
  ) {
    const scriptElement = document.createElement('script')
    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js'
    scriptElement.async = true
    // The original script inserts it *before* the vizElement (object).
    // This is important for Tableau's initialization logic.
    if (vizObjectRef.value && vizObjectRef.value.parentNode) {
      vizObjectRef.value.parentNode.insertBefore(scriptElement, vizObjectRef.value)
    } else {
      // Fallback: append to head if object ref isn't available for some reason
      // though it should be within onMounted after nextTick
      console.warn('TableauViz: vizObjectRef not found for script insertion, appending to head.')
      document.head.appendChild(scriptElement)
    }
  } else {
    // If script already exists, Tableau's API might need a nudge to initialize new vizzes
    // For simple embeds, it often just works. If not, you might need to call
    // a Tableau API function here if available, or ensure the object is visible.
    // For now, assume Tableau's script will pick up the new object.
    console.log('Tableau API script already loaded.')
  }
})

onUnmounted(() => {
  // Clean up event listener
  window.removeEventListener('resize', setVizSize)
  // Note: The Tableau API script tag is generally loaded once per page.
  // We don't remove it here as other components might still need it.
  // Tableau's API itself should handle cleaning up individual viz instances.
})
</script>

<style scoped>
.tableau-viz-container {
  width: 100%;
  margin-bottom: 20px;
}

.tableau-viz-container h2 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}

.tableau-viz-container p {
  text-align: justify;
  max-width: 800px; /* Or 100% if you prefer full width */
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 15px;
  color: #555;
}

.tableauPlaceholder {
  /* Styles from original embed, can be customized */
  min-height: 300px; /* Ensure it has some height even before JS sizing */
}

/* You can add more specific styles if needed */
</style>
