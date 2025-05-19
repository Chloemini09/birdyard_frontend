<template>
  <div class="interactive-map-container">
    <div class="controls">
      <select v-model="selectedState" @change="updateVisualizations">
        <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
      </select>
      <select v-model="selectedMonth" @change="updateVisualizations">
        <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
      </select>
      <select v-model="selectedViz" @change="updateVisualizations">
        <option value="birdPlant">Birds & Plants</option>
        <option value="sankeyDiagram">Sankey Diagram</option>
        <option value="sunburst">Sunburst</option>
        <option value="chordDiagram">Chord Diagram</option>
      </select>
    </div>

    <div class="visualization-container">
      <!-- Map component -->
      <div ref="mapContainer" class="map-view"></div>

      <!-- Visualizations that will be shown/hidden based on selection -->
      <div v-show="selectedViz === 'birdPlant'" class="viz-panel">
        <div ref="birdChart" class="chart"></div>
        <div ref="plantChart" class="chart"></div>
      </div>

      <div v-show="selectedViz === 'sankeyDiagram'" class="viz-panel">
        <div ref="sankeyChart" class="chart"></div>
      </div>

      <div v-show="selectedViz === 'sunburst'" class="viz-panel">
        <div ref="sunburstChart" class="chart"></div>
      </div>

      <div v-show="selectedViz === 'chordDiagram'" class="viz-panel">
        <div ref="chordChart" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
// Import necessary visualization libraries
import * as d3 from 'd3'
import * as echarts from 'echarts'
import { sankeyLinkHorizontal } from 'd3-sankey'

export default {
  name: 'InteractiveMap',
  data() {
    return {
      // Selection state
      selectedState: 'QLD',
      selectedMonth: 'February',
      selectedViz: 'birdPlant',

      // Data
      birdData: [],
      plantData: [],
      sankeyData: {},
      sunburstData: {},
      chordData: {},

      // Chart instances
      birdChart: null,
      plantChart: null,
      sankeyChart: null,
      sunburstChart: null,
      chordChart: null,

      // Options
      states: ['QLD', 'NSW', 'VIC', 'SA', 'WA'],
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    }
  },

  mounted() {
    this.loadData()
    this.initMap()
  },

  methods: {
    // Load data from API or static JSON file
    async loadData() {
      try {
        const response = await fetch('/api/australia-birds-plants')
        const data = await response.json()
        this.processData(data)
        this.updateVisualizations()
      } catch (error) {
        console.error('Error loading data:', error)
      }
    },

    // Process raw data into formats needed for different visualizations
    processData(data) {
      // Process bird data
      this.processBirdData(data)

      // Process plant data
      this.processPlantData(data)

      // Process Sankey data
      this.processSankeyData(data)

      // Process Sunburst data
      this.processSunburstData(data)

      // Process Chord data
      this.processChordData(data)
    },

    processBirdData(data) {
      // Group by bird species and count observations
      const birdCounts = {}

      data.forEach((item) => {
        if (item.state === this.selectedState && item.month === this.selectedMonth) {
          birdCounts[item.species_common_name] =
            (birdCounts[item.species_common_name] || 0) + item.observation_count
        }
      })

      // Convert to array and sort
      this.birdData = Object.entries(birdCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10) // Top 10
    },

    processPlantData(data) {
      // Similar to bird data processing
      const plantCounts = {}

      data.forEach((item) => {
        if (item.state === this.selectedState && item.month === this.selectedMonth) {
          plantCounts[item.plant_common_name] =
            (plantCounts[item.plant_common_name] || 0) + item.observation_count
        }
      })

      this.plantData = Object.entries(plantCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    },

    processSankeyData(data) {
      // Process data for Sankey diagram (birds -> plants)
      const filteredData = data.filter(
        (item) => item.state === this.selectedState && item.month === this.selectedMonth,
      )

      // Group by bird and plant
      const connections = {}
      filteredData.forEach((item) => {
        const key = `${item.species_common_name}-${item.plant_common_name}`
        connections[key] = (connections[key] || 0) + item.observation_count
      })

      // Create nodes and links
      const nodes = []
      const nodeMap = {}
      const links = []

      // Add bird nodes
      const uniqueBirds = [...new Set(filteredData.map((item) => item.species_common_name))]
      uniqueBirds.forEach((name, index) => {
        nodes.push({ name: `Bird: ${name}` })
        nodeMap[name] = index
      })

      // Add plant nodes
      const uniquePlants = [...new Set(filteredData.map((item) => item.plant_common_name))]
      uniquePlants.forEach((name, index) => {
        nodes.push({ name: `Plant: ${name}` })
        nodeMap[name] = index + uniqueBirds.length
      })

      // Create links
      Object.entries(connections).forEach(([key, value]) => {
        const [bird, plant] = key.split('-')
        links.push({
          source: nodeMap[bird],
          target: nodeMap[plant],
          value: value,
        })
      })

      this.sankeyData = { nodes, links }
    },

    processSunburstData(data) {
      // Process data for sunburst diagram (state > bird > plant)
      const filteredData = data.filter((item) => item.state === this.selectedState)

      // Create hierarchical structure
      const root = {
        name: this.selectedState,
        children: [],
      }

      // Group by bird
      const birdGroups = {}
      filteredData.forEach((item) => {
        if (!birdGroups[item.species_common_name]) {
          birdGroups[item.species_common_name] = {
            name: item.species_common_name,
            children: [],
            value: 0,
          }
        }

        // Check if plant already exists for this bird
        let plantNode = birdGroups[item.species_common_name].children.find(
          (child) => child.name === item.plant_common_name,
        )

        if (!plantNode) {
          plantNode = {
            name: item.plant_common_name,
            value: 0,
          }
          birdGroups[item.species_common_name].children.push(plantNode)
        }

        // Add observation count
        plantNode.value += item.observation_count
        birdGroups[item.species_common_name].value += item.observation_count
      })

      // Add bird groups to root
      root.children = Object.values(birdGroups)

      this.sunburstData = root
    },

    processChordData(data) {
      // Process data for chord diagram
      const filteredData = data.filter(
        (item) => item.state === this.selectedState && item.month === this.selectedMonth,
      )

      // Get unique birds and plants
      const birds = [...new Set(filteredData.map((item) => item.species_common_name))]
      const plants = [...new Set(filteredData.map((item) => item.plant_common_name))]

      // Create matrix
      const matrix = []
      const names = [...birds, ...plants]

      // Initialize matrix with zeros
      for (let i = 0; i < names.length; i++) {
        matrix[i] = Array(names.length).fill(0)
      }

      // Fill matrix with connections
      filteredData.forEach((item) => {
        const birdIndex = birds.indexOf(item.species_common_name)
        const plantIndex = plants.indexOf(item.plant_common_name) + birds.length

        // Bidirectional connections for chord diagram
        matrix[birdIndex][plantIndex] += item.observation_count
        matrix[plantIndex][birdIndex] += item.observation_count
      })

      this.chordData = {
        names,
        matrix,
        birds,
        plants,
      }
    },

    // Initialize map view
    initMap() {
      // Implement map view using leaflet, mapbox, or other mapping library
      // This is a placeholder - you would integrate with your mapping solution
      // For example with Leaflet:
      //
      // this.map = L.map(this.mapContainer).setView([-25.2744, 133.7751], 4);
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    },

    // Update all visualizations based on current selections
    updateVisualizations() {
      this.updateBirdChart()
      this.updatePlantChart()
      this.updateSankeyChart()
      this.updateSunburstChart()
      this.updateChordChart()
    },

    updateBirdChart() {
      // Use D3 or other library to create/update bird chart
      const container = this.$refs.birdChart
      if (!container) return

      // Clear previous chart
      d3.select(container).selectAll('*').remove()

      // Set dimensions
      const margin = { top: 20, right: 30, bottom: 40, left: 90 }
      const width = container.clientWidth - margin.left - margin.right
      const height = container.clientHeight - margin.top - margin.bottom

      // Create SVG
      const svg = d3
        .select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      // X axis
      const x = d3
        .scaleLinear()
        .domain([0, d3.max(this.birdData, (d) => d.count)])
        .range([0, width])

      svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))

      // Y axis
      const y = d3
        .scaleBand()
        .domain(this.birdData.map((d) => d.name))
        .range([0, height])
        .padding(0.1)

      svg.append('g').call(d3.axisLeft(y))

      // Bars
      svg
        .selectAll('rect')
        .data(this.birdData)
        .enter()
        .append('rect')
        .attr('y', (d) => y(d.name))
        .attr('height', y.bandwidth())
        .attr('x', 0)
        .attr('width', (d) => x(d.count))
        .attr('fill', '#69b3a2')

      // Title
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', -margin.top / 2)
        .attr('text-anchor', 'middle')
        .text(`Bird Observations - ${this.selectedState}, ${this.selectedMonth}`)
    },

    updatePlantChart() {
      // Similar to bird chart but for plants
      const container = this.$refs.plantChart
      if (!container) return

      // Implementation similar to bird chart
      // ...
    },

    updateSankeyChart() {
      // Implement Sankey diagram using D3's Sankey plugin
      if (this.selectedViz !== 'sankeyDiagram') return

      const container = this.$refs.sankeyChart
      if (!container) return

      // Clear previous chart
      d3.select(container).selectAll('*').remove()

      // Create Sankey diagram
      // ...
    },

    updateSunburstChart() {
      // Implement Sunburst chart using D3 or ECharts
      if (this.selectedViz !== 'sunburst') return

      const container = this.$refs.sunburstChart
      if (!container) return

      // Implementation
      // ...
    },

    updateChordChart() {
      // Implement Chord diagram using D3
      if (this.selectedViz !== 'chordDiagram') return

      const container = this.$refs.chordChart
      if (!container) return

      // Implementation
      // ...
    },
  },
}
</script>

<style scoped>
.interactive-map-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.controls {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.visualization-container {
  display: flex;
  flex: 1;
}

.map-view {
  flex: 1;
  min-width: 50%;
  height: 100%;
}

.viz-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: white;
}

.chart {
  flex: 1;
  min-height: 300px;
  margin-bottom: 1rem;
}
</style>
