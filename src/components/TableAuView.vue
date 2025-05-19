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
  // New prop for width control
  widthPercentage: {
    type: Number,
    default: 90, // Default to 90% of the parent container width
  },
  // New prop for aspect ratio control
  aspectRatio: {
    type: Number,
    default: 0.6, // Default to 5:3 aspect ratio (height = width * 0.6)
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
      viz.style.height = container.offsetWidth * props.aspectRatio + 'px'
    } else {
      // Fallback or default height if offsetWidth is 0 (e.g., hidden initially)
      viz.style.height = '500px' // Increased default height
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
  width: v-bind('`${props.widthPercentage}%`');
  margin: 0 auto 30px auto; /* Center the container with auto margins */
  max-width: 1200px; /* Add a max-width to prevent it from getting too wide on large screens */
}

.tableau-viz-container h2 {
  text-align: center;
  color: #333;
  margin-bottom: 15px;
  font-size: 1.6em;
}

.tableau-viz-container p {
  text-align: center; /* Center the description text */
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  color: #555;
  max-width: 900px; /* Increased from 800px */
  font-size: 1.1em;
}

.tableauPlaceholder {
  position: relative;
  margin: 0 auto; /* Center the visualization */
  min-height: 400px; /* Increased minimum height */
  width: 100%; /* Take full width of the container */
}

/* Ensure the visualization is properly displayed */
.tableauViz {
  margin: 0 auto; /* Center the visualization */
}
</style>
