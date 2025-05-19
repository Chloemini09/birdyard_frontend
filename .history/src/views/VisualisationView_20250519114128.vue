<template>
  <div class="visualization-view">
    <header class="view-header">
      <h1>Bird Migration & Plant Association Visualization</h1>
      <p class="description">
        Explore Australian bird species, their migration patterns, and plant associations across
        different states and seasons.
      </p>
    </header>

    <div class="tabs">
      <button :class="['tab-button', { active: activeTab === 'map' }]" @click="activeTab = 'map'">
        Migration Map
      </button>
      <button
        :class="['tab-button', { active: activeTab === 'charts' }]"
        @click="activeTab = 'charts'"
      >
        Data Analysis
      </button>
      <button
        :class="['tab-button', { active: activeTab === 'combined' }]"
        @click="activeTab = 'combined'"
      >
        Combined View
      </button>
    </div>

    <div class="view-content">
      <!-- Map Only View -->
      <div v-if="activeTab === 'map'" class="map-container full-view">
        <InteractiveMap
          @species-selected="handleSpeciesSelection"
          @state-changed="handleStateChange"
        />
      </div>

      <!-- Charts Only View -->
      <div v-else-if="activeTab === 'charts'" class="charts-container full-view">
        <DataVisualization
          ref="dataVisualization"
          :selected-species="selectedSpecies"
          :selected-state="selectedState"
          :selected-month="selectedMonth"
          @state-changed="handleStateChange"
          @month-changed="handleMonthChange"
        />
      </div>

      <!-- Combined View -->
      <div v-else-if="activeTab === 'combined'" class="combined-container">
        <div class="map-section">
          <InteractiveMap
            @species-selected="handleSpeciesSelection"
            @state-changed="handleStateChange"
          />
        </div>
        <div class="data-section">
          <DataVisualization
            ref="dataVisualization"
            :selected-species="selectedSpecies"
            :selected-state="selectedState"
            :selected-month="selectedMonth"
            @state-changed="handleStateChange"
            @month-changed="handleMonthChange"
          />
        </div>
      </div>
    </div>

    <!-- Information Panel -->
    <div v-if="selectedSpecies" class="info-panel">
      <button class="close-btn" @click="selectedSpecies = null">&times;</button>
      <h3>{{ selectedSpecies }}</h3>
      <p>
        Currently viewing data for {{ selectedSpecies }} in {{ selectedState }},
        {{ selectedMonth }}.
      </p>
      <p v-if="speciesInfo" class="species-details">
        {{ speciesInfo.description }}
      </p>
    </div>
  </div>
</template>

<script>
import InteractiveMap from '@/components/InteractiveMap/InteractiveMap.vue'
import DataVisualization from '@/components/DataVisualization.vue'

export default {
  name: 'VisualizationView',

  components: {
    InteractiveMap,
    DataVisualization,
  },

  data() {
    return {
      activeTab: 'combined', // Default to combined view
      selectedSpecies: null,
      selectedState: 'QLD', // Default state
      selectedMonth: 'February', // Default month

      // Sample species info - using double quotes to avoid issues with apostrophes
      speciesData: {
        'Australian Magpie': {
          description:
            'The Australian Magpie is a medium-sized black and white passerine bird native to Australia and southern New Guinea. It is known for its melodic warbling call and territorial behavior during breeding season.',
        },
        'Sulphur-Crested Cockatoo': {
          description:
            'The Sulphur-crested Cockatoo is a large white cockatoo with a distinctive yellow crest. It is known for its loud calls and is commonly found in wooded habitats across Australia.',
        },
        'Rainbow Lorikeet': {
          description:
            "The Rainbow Lorikeet is a species of parrot found in Australia. With its vibrant coloration including blue, green, yellow and orange feathers, it is one of the country's most iconic birds.",
        },
        'Eastern Rosella': {
          description:
            'The Eastern Rosella is a colorful parrot native to southeast Australia. Its distinctive plumage includes a red head, white cheeks, and yellow-to-green body.',
        },
        'Superb Fairywren': {
          description:
            "The Superb Fairywren is a small Australian bird known for the male's bright blue and black plumage during breeding season. They are highly social birds that live in small groups.",
        },
      },
    }
  },

  computed: {
    speciesInfo() {
      return this.selectedSpecies ? this.speciesData[this.selectedSpecies] : null
    },
  },

  methods: {
    handleSpeciesSelection(species) {
      this.selectedSpecies = species

      // Update visualization if in combined view
      if (this.activeTab === 'combined' && this.$refs.dataVisualization) {
        this.$refs.dataVisualization.updateSelectedSpecies(species)
      }
    },

    handleStateChange(state) {
      this.selectedState = state

      // Sync state between components
      if (this.$refs.dataVisualization) {
        this.$refs.dataVisualization.updateSelectedState(state)
      }
    },

    handleMonthChange(month) {
      this.selectedMonth = month
    },

    handleResize() {
      if (this.$refs.dataVisualization) {
        this.$refs.dataVisualization.resizeCharts()
      }
    },
  },

  watch: {
    activeTab(newTab) {
      // Give the DOM time to update before resizing charts
      this.$nextTick(() => {
        if ((newTab === 'charts' || newTab === 'combined') && this.$refs.dataVisualization) {
          this.$refs.dataVisualization.resizeCharts()
        }
      })
    },
  },

  mounted() {
    // Resize charts when window is resized
    window.addEventListener('resize', this.handleResize)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style scoped>
.visualization-view {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
}

.view-header {
  text-align: center;
  margin-bottom: 30px;
}

.view-header h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.description {
  font-size: 16px;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.tab-button {
  padding: 12px 24px;
  margin: 0 5px;
  border: none;
  background: none;
  font-size: 16px;
  cursor: pointer;
  color: #666;
  position: relative;
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: #42b983;
}

.tab-button.active {
  color: #42b983;
  font-weight: 600;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 3px;
  background-color: #42b983;
}

.view-content {
  min-height: 600px;
}

.full-view {
  width: 100%;
  height: 700px;
}

.combined-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
}

.map-section {
  height: 500px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.data-section {
  width: 100%;
}

.info-panel {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 300px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.info-panel h3 {
  margin-top: 0;
  color: #2c3e50;
}

.species-details {
  font-size: 14px;
  line-height: 1.5;
  color: #555;
}

/* Responsive design */
@media (min-width: 1024px) {
  .combined-container {
    flex-direction: row;
  }

  .map-section {
    width: 50%;
    height: 700px;
  }

  .data-section {
    width: 50%;
    height: 700px;
    overflow-y: auto;
  }
}

@media (max-width: 768px) {
  .tab-button {
    padding: 10px 15px;
    font-size: 14px;
  }

  .full-view {
    height: 500px;
  }

  .info-panel {
    width: 250px;
  }
}
</style>
