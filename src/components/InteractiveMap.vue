<!-- npm install mapbox-gl -->
<template>

    <div class="interactive-map-layout">
        <!-- mapbox-gl.js?v=462659a1:443 The map container element should be empty, 
         otherwise the map's interactivity will be negatively impacted. 
         If you want to display a message when WebGL is not supported, 
         use the Mapbox GL Supported plugin instead. -->
        <!-- <div v-if="!isAnimating" class="month-dropdown">
            <label for="monthSelect">Jump to Month:</label>
            <select id="monthSelect" v-model="selectedMonth" @change="handleMonthJump">
                <option disabled value="">Select Month</option>
                <option v-for="(name, idx) in monthNames" :key="idx" :value="idx + 1">{{ name }}</option>
            </select>
        </div> -->
        <div class="top-image-bar">
            <div class="image-item">
                <img src="/images/guide/guide1.png" alt="Image 1" />
                <p class="image-caption">Migrates between two loccations
                </p>
            </div>
            <div class="image-item">
                <img src="/images/guide/guide2.png" alt="Image 2" />
                <p class="image-caption">Stays at this location for one month
                </p>
            </div>
            <div class="image-item">
                <img src="/images/guide/guide3.png" alt="Image 3" />
                <p class="image-caption">Hover to view bird's status
                </p>
            </div>
            <div class="image-item">
                <img src="/images/guide/guide4.png" alt="Image 4" />
                <p class="image-caption">Click image to view bird's information
                </p>
            </div>
            <div class="image-item">
                <img src="/images/guide/guide5.png" alt="Image 5" />
                <p class="image-caption">Grey means animation playing please wait blue</p>
            </div>
            <div class="image-item">
                <img src="/images/guide/guide6.png" alt="Image 6" />
                <p class="image-caption">Grey means animation is playing please wait </p>
            </div>
        </div>
        <div class="map-main">
            <div ref="mapContainer" class="map-section">
                <div class="map-top-right-control">
                    <button class="toggle-animation-button" :disabled="isAnimating" @click="toggleAnimationSetting">
                        {{ animationEnabled ? 'Animation: ON' : 'Animation: OFF' }}
                    </button>
                    <button class="toggle-path-button" :disabled="!selectedSpecies || isAnimating"
                        @click="toggleYearPath">
                        {{ isYearPathVisible ? 'Hide Year Path' : 'Show Year Path' }}
                    </button>

                </div>
                <div class="map-control-top-left month-dropdown">
                    <label for="monthSelect"> See where the bird is during</label>
                    <select id="monthSelect" v-model="selectedMonth" @change="handleMonthJump" :disabled="isAnimating">
                        <option disabled value="">Select Month</option>
                        <option v-for="(name, idx) in monthNames" :key="idx" :value="idx + 1">
                            {{ name }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="sidebar">
                <div class="container">
                    <h2 class="sidebar-title">Select Bird Species</h2>
                    <h2 class="sidebar-title">Explore Its Migration</h2>
                    <!-- <h2 class="sidebar-title">Choose a bird to explore its migration</h2> -->
                    <p class="sidebar-graph">From year beginning to currrent month</p>
                </div>
                <div class="species-scroll">
                    <label v-for="bird in filteredBirdList" :key="bird.name" class="bird-card"
                        :class="{ selected: selectedSpecies === bird.name }">

                        <img :src="getBirdImagePath(bird.image)" :alt="bird.name" class="bird-image" />
                        <div class="bird-info">
                            <input type="radio" name="bird-selection" :value="bird.name" v-model="selectedSpecies"
                                :disabled="isAnimating" />
                            <strong>{{ bird.name }}</strong>
                            <p>{{ bird.description }}</p>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    </div>
    <div v-if="showBirdPopup" class="bird-modal-overlay" @click="closeBirdPopup">
        <div class="bird-modal" @click.stop>
            <button class="modal-close-button" @click="closeBirdPopup">&times;</button>

            <div class="bird-modal-header">
                <div class="bird-modal-image-container">
                    <img :src="getBirdImagePath(selectedBirdInfo.image)" :alt="selectedBirdInfo.name"
                        class="bird-modal-image" />
                </div>

                <div class="bird-modal-title-container">
                    <h2 class="bird-modal-title">{{ selectedBirdInfo.name }}</h2>
                    <p class="bird-modal-scientific-name">{{ selectedBirdInfo.scientificName }}</p>
                    <p class="bird-modal-family">Family: {{ selectedBirdInfo.family }}</p>
                </div>
            </div>

            <!-- Content -->
            <div class="bird-modal-content">
                <div class="bird-info-section">
                    <h3 class="bird-info-title">Overview</h3>
                    <p>{{ selectedBirdInfo.overview }}</p>
                </div>

                <div class="bird-info-grid">
                    <div class="bird-info-column">
                        <div class="bird-info-section">
                            <h3 class="bird-info-title">Physical Characteristics</h3>
                            <div class="bird-info-list">
                                <div class="bird-info-item">
                                    <span class="bird-info-label">Size:</span>
                                    <span class="bird-info-value">{{ selectedBirdInfo.size }}</span>
                                </div>
                                <div class="bird-info-item">
                                    <span class="bird-info-label">Weight:</span>
                                    <span class="bird-info-value">{{ selectedBirdInfo.weight }}</span>
                                </div>
                                <div class="bird-info-item">
                                    <span class="bird-info-label">Identification:</span>
                                    <span class="bird-info-value">{{ selectedBirdInfo.identification }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="bird-info-section">
                            <h3 class="bird-info-title">Habitat</h3>
                            <div class="bird-info-list">
                                <div class="bird-info-item">
                                    <span class="bird-info-label">Habitat:</span>
                                    <span class="bird-info-value">{{ selectedBirdInfo.habitat.join(', ') }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bird-info-column">
                        <div class="bird-info-section">
                            <h3 class="bird-info-title">Behaviour & Feeding</h3>
                            <div class="bird-info-list">
                                <div class="bird-info-item">
                                    <span class="bird-info-label">Behaviour:</span>
                                    <span class="bird-info-value">{{ selectedBirdInfo.behaviour }}</span>
                                </div>
                                <div class="bird-info-item">
                                    <span class="bird-info-label">Feeding:</span>
                                    <span class="bird-info-value">{{ selectedBirdInfo.feeding }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="bird-info-section">
                            <h3 class="bird-info-title">Risks</h3>
                            <ul class="risks-list">
                                <li v-for="risks in selectedBirdInfo.risks" :key="risks">{{ risks }}</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
let lastSpecies = ''

import { ref, onMounted, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import birdListData from '@/assets/data/migration_birds.json'
import observationData from '@/assets/data/bird_map.json'
import { computed } from 'vue'

const plantAddress = localStorage.getItem('plantAddress') || ''

const fullToAbbrev = {
    'New South Wales': 'NSW',
    'Victoria': 'VIC',
    'Queensland': 'QLD',
    'Western Australia': 'WA',
    'South Australia': 'SA',
    'Tasmania': 'TAS',
    'Australian Capital Territory': 'ACT',
    'Northern Territory': 'NT'
}

let plantStateAbbrev = null
const addressParts = plantAddress.split(',').map(part => part.trim())
for (const [fullName, abbrev] of Object.entries(fullToAbbrev)) {
    if (addressParts.includes(fullName)) {
        plantStateAbbrev = abbrev
        break
    }
}

const filteredBirdList = computed(() => {
    if (!plantStateAbbrev) return birdList.value

    return birdList.value.filter(bird => {
        for (let m = 1; m <= 12; m++) {
            const dominantCoord = getDominantStateForSpeciesMonth(bird.name, m)
            if (!dominantCoord) continue

            const dominantState = getStateNameFromCoord(dominantCoord)
            if (dominantState === plantStateAbbrev) {
                return true
            }
        }
        return false
    })
})

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]
const mapContainer = ref(null)
const birdList = ref(birdListData)
const selectedSpecies = ref('')
const animatedMarkers = ref([])
const selectedBirdInfo = ref(null)
const showBirdPopup = ref(false)
const map = ref(null)
const lastMonthIndex = ref(new Date().getMonth() + 1)
const isYearPathVisible = ref(false)
const animationEnabled = ref(true)

let markers = []
let popup // Mapbox Popup, used to display information when hovering the mouse
let animationController = { cancelled: false }
const isAnimating = ref(false)


const stateCapitals = {
    'NSW': [151.2093, -33.8688],
    'VIC': [144.9631, -37.8136],
    'QLD': [153.0251, -27.4698],
    'WA': [115.8575, -31.9505],
    'SA': [138.6007, -34.9285],
    'TAS': [147.3257, -42.8821],
    'ACT': [149.1300, -35.2809],
    'NT': [130.8456, -12.4634]
}

// Function to get the color for a species
const getBirdImagePath = (filename) => {
    return new URL(`../assets/images/${filename}`, import.meta.url).href
}

const selectedMonth = ref('')


// Function to add a layer for month labels
function addMonthLabelLayer(species, geojson) {
    const sourceId = `${species}-month-label-source`
    const layerId = `${species}-month-label-layer`

    if (map.value.getLayer(layerId)) {
        map.value.removeLayer(layerId)
        map.value.removeSource(sourceId)
    }

    map.value.addSource(sourceId, {
        type: 'geojson',
        data: geojson
    })

    map.value.addLayer({
        id: layerId,
        type: 'symbol',
        source: sourceId,
        layout: {
            'text-field': ['get', 'months'],
            'text-size': 20,
            'text-offset': [0, 1],
            'text-anchor': 'top',
            'text-allow-overlap': true,
            'text-ignore-placement': true,
        },
        paint: {
            'text-color': '#013e05',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1.5,
        }
    })
}


// function addDashedPathLayer(species, geojson)// Function to add a dashed path layer {
//     const sourceId = `${species}-dashed-source`
//     const layerId = `${species}-dashed-layer`

//     if (map.value.getLayer(layerId)) {
//         map.value.removeLayer(layerId)
//         map.value.removeSource(sourceId)
//     }

//     map.value.addSource(sourceId, { type: 'geojson', data: geojson })

//     map.value.addLayer({
//         id: layerId,
//         type: 'line',
//         source: sourceId,
//         layout: {
//             'line-cap': 'round',
//             'line-join': 'round'
//         },
//         paint: {
//             'line-color': '#a9cf7a',
//             'line-width': 3,
//             'line-dasharray': [2, 2]
//         }
//     })
// }

// Function to animate circular motion
function animateCircularMotion(marker, center, onComplete, radius = 1.5, rounds = 1, steps = 100) {
    let step = 0
    function rotate() {
        if (step > rounds * steps) {
            if (onComplete) onComplete()
            return
        }
        const angle = 2 * Math.PI * (step % steps) / steps
        const dx = radius * Math.cos(angle)
        const dy = radius * Math.sin(angle)
        marker.setLngLat([center[0] + dx, center[1] + dy])
        step++
        requestAnimationFrame(rotate)
    }
    rotate()
}

// Function to animate a path segment
function animatePathSegment(species, start, end, segmentIndex, onComplete) {
    const id = `${species}-segment-${segmentIndex}`
    const samePoint = start[0] === end[0] && start[1] === end[1]

    const el = createBirdElement(species, birdList.value)
    const movingMarker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(start)
        .addTo(map.value)

    animatedMarkers.value.forEach(marker => marker.remove())
    animatedMarkers.value = [movingMarker]

    if (samePoint) {
        //console.log('🔁')
        animateCircularMotion(movingMarker, start, () => {
            //console.log('✅')
            if (onComplete) onComplete()
        })
        return
    }

    const totalFrames = 35
    let frame = 0
    const curvedLine = createCurvedLine(start, end, 1, totalFrames)
    const geojson = createEmptyGeoJSON()

    if (map.value.getSource(id)) {
        map.value.removeLayer(id)
        map.value.removeSource(id)
    }

    map.value.addSource(id, { type: 'geojson', data: geojson })
    map.value.addLayer({
        id,
        type: 'line',
        source: id,
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        },
        paint: {
            'line-color': '#01cd0e',
            'line-width': 3,
            'line-opacity': 0.9,
            'line-dasharray': [2, 2]
        }
    })

    function animate() {
        if (frame >= curvedLine.length) {
            startFadeOutLine(id)
            if (onComplete) onComplete()
            return
        }

        const currentCoord = curvedLine[frame]
        geojson.features[0].geometry.coordinates.push(currentCoord)
        map.value.getSource(id).setData(geojson)
        movingMarker.setLngLat(currentCoord)

        frame++
        requestAnimationFrame(animate)
    }

    animate()
}

// Function to build a dashed path GeoJSON for a species
function buildDashedPathGeoJSON(species) {
    const rawPoints = []

    for (let m = 1; m <= 12; m++) {
        const coord = getDominantStateForSpeciesMonth(species, m)
        if (!coord) continue

        const prev = rawPoints[rawPoints.length - 1]
        const isSame = prev && coord[0] === prev[0] && coord[1] === prev[1]
        if (!isSame) {
            rawPoints.push(coord)
        }
    }

    const curvedPoints = []
    for (let i = 0; i < rawPoints.length - 1; i++) {
        const segment = createCurvedLine(rawPoints[i], rawPoints[i + 1], 1)
        curvedPoints.push(...segment)
    }

    return {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: curvedPoints
            },
            properties: { species }
        }]
    }
}

// Function to build a GeoJSON for month points
function buildMonthPointsGeoJSON(species) {
    const labelMap = {} // key: "lng,lat" → { coord, months: [] }

    for (let m = 1; m <= 12; m++) {
        const coord = getDominantStateForSpeciesMonth(species, m)
        if (!coord) continue
        const key = coord.map(x => x.toFixed(4)).join(',')
        if (!labelMap[key]) {
            labelMap[key] = {
                coord,
                months: [monthNames[m - 1].slice(0, 3)]
            }
        } else {
            labelMap[key].months.push(monthNames[m - 1].slice(0, 3))
        }
    }

    return {
        type: 'FeatureCollection',
        features: Object.values(labelMap).map(item => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: item.coord
            },
            properties: {
                months: item.months.join(', '),
                species
            }
        }))
    }
}

// Function to animate a path segment
function createEmptyGeoJSON() {
    return {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: []
            }
        }]
    }
}

// Function to create a bird element
function createBirdElement(species, birdList) {
    const el = document.createElement('div')
    el.className = 'bird-marker'
    el.title = species
    el.style.backgroundImage = `url(${getBirdImagePath(birdList.find(b => b.name === species)?.image)})`
    el.style.borderColor = getColorForSpecies(species)
    el.style.width = '80px'
    el.style.height = '80px'
    el.style.backgroundSize = 'contain'
    el.style.backgroundRepeat = 'no-repeat'
    el.style.backgroundPosition = 'center'

    const bird = birdList.find(b => b.name === species)
    if (bird) {
        el.addEventListener('click', () => {
            selectedBirdInfo.value = bird
            showBirdPopup.value = true
        })
    }

    return el
}

// Function to close the bird info popup
function closeBirdPopup() {
    showBirdPopup.value = false
    selectedBirdInfo.value = null
}

// Function to clear paths for a species
function clearPaths(speciesToClear) {
    if (!speciesToClear) return
    const idsToRemove = [
        `${speciesToClear}-path`,
        `${speciesToClear}-dashed-layer`,
        `${speciesToClear}-dashed-source`,
        `${speciesToClear}-month-label-layer`,
        `${speciesToClear}-month-label-source`
    ]
    // Clear all segments
    for (let i = 0; i < 12; i++) {
        idsToRemove.push(`${speciesToClear}-segment-${i}`)
    }

    idsToRemove.forEach(id => {
        if (map.value.getLayer(id)) map.value.removeLayer(id)
        if (map.value.getSource(id)) map.value.removeSource(id)
    })
}

// Function to clear all paths
function clearMarkers() {
    markers.forEach(m => m.remove())
    markers = []
}

// Function to clear all animation segments
function clearAnimationSegments(species) {
    for (let i = 0; i < 12; i++) {
        const id = `${species}-segment-${i}`
        if (map.value.getLayer(id)) map.value.removeLayer(id)
        if (map.value.getSource(id)) map.value.removeSource(id)
    }

    animatedMarkers.value.forEach(m => m.remove())
    animatedMarkers.value = []
}

// The curvature parameter controls how "curvy" the line is
function createCurvedLine(start, end, curvature = 0.3, segments = 20) {
    const [x1, y1] = start
    const [x2, y2] = end

    const cx = (x1 + x2) / 2
    const cy = (y1 + y2) / 2

    const dx = x2 - x1
    const dy = y2 - y1
    const normal = [-dy, dx]
    const length = Math.sqrt(normal[0] ** 2 + normal[1] ** 2)
    const offset = [normal[0] / length * curvature, normal[1] / length * curvature]

    const cp = [cx + offset[0], cy + offset[1]]

    const curvePoints = []
    for (let t = 0; t <= 1; t += 1 / segments) {
        const x = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cp[0] + t ** 2 * x2
        const y = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cp[1] + t ** 2 * y2
        curvePoints.push([x, y])
    }

    return curvePoints
}

// Function to get the dominant state for a species in a given month
function getDominantStateForSpeciesMonth(species, monthNumber) {
    const monthStr = monthNames[monthNumber - 1]
    const filtered = observationData.filter(entry =>
        entry.species_common_name === species &&
        entry.month === monthStr
    )
    const counts = {}
    filtered.forEach(entry => {
        counts[entry.state] = (counts[entry.state] || 0) + entry.observation_count
    })
    const topState = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
    return topState && stateCapitals[topState] ? stateCapitals[topState] : null
}

// Function to get the state name from coordinates
function getStateNameFromCoord(coord) {
    const entry = Object.entries(stateCapitals).find(([, c]) =>
        c[0] === coord[0] && c[1] === coord[1]
    )
    return entry ? entry[0] : null
}

// Function to get the color for a species
function getColorForSpecies(species) {
    const palette = ['#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4', '#46f0f0']
    const index = birdList.value.findIndex(b => b.name === species)
    return palette[index % palette.length]
}

// function initLineLayer(map, id, geojson, color = '#ff0000') // Function to initialize a line layer{
//     if (map.getSource(id)) {
//         map.removeLayer(id)
//         map.removeSource(id)
//     }

//     map.addSource(id, { type: 'geojson', data: geojson })
//     map.addLayer({
//         id,
//         type: 'line',
//         source: id,
//         layout: {
//             'line-cap': 'round',
//             'line-join': 'round'
//         },
//         paint: {
//             'line-color': '#01cd0e',
//             'line-width': 3,
//             'line-opacity': 0.9
//         }
//     })
// }

function getLoopingMonthSequence(from, to) {
    const result = []
    let m = from
    while (true) {
        result.push(m)
        if (m === to) break
        m = (m % 12) + 1
    }
    return result
}

// Function to handle month jump
function handleMonthJump() {
    const monthNum = parseInt(selectedMonth.value)
    if (!selectedSpecies.value || isAnimating.value || !map.value?.isStyleLoaded()) return

    const startMonth = lastMonthIndex.value
    const monthSequence = getLoopingMonthSequence(startMonth, monthNum)
    const species = selectedSpecies.value

    clearAnimationSegments(species)

    const pathCoords = []
    for (const m of monthSequence) {
        const coord = getDominantStateForSpeciesMonth(species, m)
        if (coord) pathCoords.push(coord)
    }

    if (!animationEnabled.value) {
        isAnimating.value = false
        if (pathCoords.length > 0) {
            const lastCoord = pathCoords[pathCoords.length - 1]
            animatedMarkers.value.forEach(m => m.remove())
            animatedMarkers.value = []
            placeAnimatedBirdMarker(species, lastCoord)

            placeInteractivePointMarkers(species)

            const labelGeojson = buildMonthPointsGeoJSON(species)
            addMonthLabelLayer(species, labelGeojson)

            lastMonthIndex.value = monthNum
        }
        return
    }

    if (pathCoords.length < 2) {
        isAnimating.value = false
        if (pathCoords.length === 1) {
            const coord = pathCoords[0]
            animatedMarkers.value.forEach(m => m.remove())
            animatedMarkers.value = []
            placeAnimatedBirdMarker(species, coord)
        }
        return
    }

    isAnimating.value = true
    animatedMarkers.value.forEach(m => m.remove())
    animatedMarkers.value = []

    let index = 1
    function nextStep() {
        if (index >= pathCoords.length) {
            isAnimating.value = false
            lastMonthIndex.value = monthNum
            placeInteractivePointMarkers(species)
            const labelGeojson = buildMonthPointsGeoJSON(species)
            addMonthLabelLayer(species, labelGeojson)
            return
        }

        const start = pathCoords[index - 1]
        const end = pathCoords[index]
        animatePathSegment(species, start, end, index - 1, () => {
            index++
            nextStep()
        })
    }

    nextStep()
}

// Function to place an animated bird marker
function placeAnimatedBirdMarker(species, point) {
    if (!map.value) return null
    const bird = birdList.value.find(b => b.name === species)
    if (!bird || !point || point.length !== 2) return null

    const el = document.createElement('div')
    el.className = 'bird-marker'
    el.style.backgroundImage = `url(${getBirdImagePath(bird.image)})`
    el.style.width = '80px'
    el.style.height = '80px'
    el.style.backgroundSize = 'contain'
    el.style.backgroundRepeat = 'no-repeat'
    el.style.backgroundPosition = 'center'
    el.addEventListener('click', () => {
        selectedBirdInfo.value = bird
        showBirdPopup.value = true
    })

    const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
        offset: [0, -10]
    })
        .setLngLat(point)
        .addTo(map.value)

    animatedMarkers.value.push(marker)
    return marker
}

// Function to place interactive point markers with one status
function placeInteractivePointMarkers(species) {
    const pointMap = {} // key: "lng,lat" → { coord, entries: [] }

    for (let m = 1; m <= 12; m++) {
        const monthStr = monthNames[m - 1]
        const filtered = observationData.filter(entry =>
            entry.species_common_name === species &&
            entry.month === monthStr
        )

        const stateCounts = {}
        filtered.forEach(entry => {
            stateCounts[entry.state] = (stateCounts[entry.state] || 0) + entry.observation_count
        })

        const topState = Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
        if (!topState) continue

        const coord = stateCapitals[topState]
        const key = coord.map(x => x.toFixed(4)).join(',')

        const topEntries = filtered.filter(e => e.state === topState)
        if (!topEntries.length) continue

        if (!pointMap[key]) {
            pointMap[key] = {
                coord,
                entries: []
            }
        }

        topEntries.forEach(entry => {
            pointMap[key].entries.push({
                month: monthStr,
                status: entry.status,
                state: topState,
                species_common_name: entry.species_common_name,
                observation_count: entry.observation_count
            })
        })
    }

    Object.values(pointMap).forEach(({ coord, entries }) => {
        const el = document.createElement('div')
        el.className = 'info-point'
        el.style.width = '18px'
        el.style.height = '18px'
        el.style.borderRadius = '50%'
        el.style.backgroundColor = 'orange'
        el.style.border = '2px solid white'
        el.style.cursor = 'pointer'

        const marker = new mapboxgl.Marker(el)
            .setLngLat(coord)
            .addTo(map.value)

        el.addEventListener('mouseenter', () => {
            const grouped = {}

            entries.forEach(entry => {
                const key = `${entry.species_common_name}|${entry.state}|${entry.month}`

                if (!grouped[key]) {
                    grouped[key] = {
                        species: entry.species_common_name,
                        state: entry.state,
                        month: entry.month,
                        statusCounts: {}
                    }
                }

                const status = entry.status
                const count = entry.observation_count || 0

                if (!grouped[key].statusCounts[status]) {
                    grouped[key].statusCounts[status] = 0
                }

                grouped[key].statusCounts[status] += count
            })

            const content = Object.values(grouped).map(group => {
                const statusCounts = group.statusCounts
                const mostCommonStatus = Object.entries(statusCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
                return `${group.species} is ${mostCommonStatus} at ${group.state} in ${group.month}`
            }).join('<br><br>')

            popup.setLngLat(coord)
            popup.setHTML(`
              <div style="
                font-size:14px;
                padding:12px;
                background-color:#ffffff;
                border-radius: 6px;
                width: 100%;
                box-sizing: border-box;
              ">
                ${content}
              </div>
            `).addTo(map.value)
        })

        el.addEventListener('mouseleave', () => {
            popup.remove()
        })

        markers.push(marker)
    })
}

// Function to place interactive point markers with all statuses

// function placeInteractivePointMarkers(species) {
//     const pointMap = {} // key: "lng,lat" → { coord, entries: [] }

//     for (let m = 1; m <= 12; m++) {
//         const monthStr = monthNames[m - 1]
//         const filtered = observationData.filter(entry =>
//             entry.species_common_name === species &&
//             entry.month === monthStr
//         )

//         const stateCounts = {}
//         filtered.forEach(entry => {
//             stateCounts[entry.state] = (stateCounts[entry.state] || 0) + entry.observation_count
//         })

//         const topState = Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
//         if (!topState) continue

//         const coord = stateCapitals[topState]
//         const key = coord.map(x => x.toFixed(4)).join(',')

//         const topEntries = filtered.filter(e => e.state === topState)
//         if (!topEntries.length) continue

//         if (!pointMap[key]) {
//             pointMap[key] = {
//                 coord,
//                 entries: []
//             }
//         }

//         topEntries.forEach(entry => {
//             pointMap[key].entries.push({
//                 month: monthStr,
//                 status: entry.status,
//                 state: topState,
//                 species_common_name: entry.species_common_name
//             })
//         })

//     }

//     Object.values(pointMap).forEach(({ coord, entries }) => {
//         const el = document.createElement('div')
//         el.className = 'info-point'
//         el.style.width = '18px'
//         el.style.height = '18px'
//         el.style.borderRadius = '50%'
//         el.style.backgroundColor = 'orange'
//         el.style.border = '2px solid white'
//         el.style.cursor = 'pointer'

//         const marker = new mapboxgl.Marker(el)
//             .setLngLat(coord)
//             .addTo(map.value)

//         el.addEventListener('mouseenter', () => {
//             const grouped = {}

//             entries.forEach(entry => {
//                 const key = `${entry.species_common_name}|${entry.state}|${entry.month}`
//                 if (!grouped[key]) {
//                     grouped[key] = {
//                         species: entry.species_common_name,
//                         state: entry.state,
//                         month: entry.month,
//                         statuses: new Set()
//                     }
//                 }
//                 grouped[key].statuses.add(entry.status)
//             })

//             const content = Object.values(grouped).map(group => {
//                 const statusList = Array.from(group.statuses).join(', ')
//                 return `${group.species} is ${statusList} at ${group.state} in ${group.month}`
//             }).join('<br><br>')

//             popup.setLngLat(coord)
//             popup.setHTML(`
//   <div style="
//     font-size:14px;
//     padding:12px;
//     background-color:#ffffff;
//     border-radius: 6px;
//     width: 100%;
//     box-sizing: border-box;
//   ">
//     ${content}
//   </div>
// `)
//                 .addTo(map.value)
//         })

//         el.addEventListener('mouseleave', () => {
//             popup.remove()
//         })

//         markers.push(marker)
//     })
// }


// Function to start the fade-out animation
function startFadeOutLine(layerId, step = 0.05, interval = 100) {
    let opacity = 0.9

    const fadeInterval = setInterval(() => {
        if (!map.value.getLayer(layerId)) {
            clearInterval(fadeInterval)
            return
        }

        opacity -= step
        if (opacity <= 0) {
            map.value.removeLayer(layerId)
            map.value.removeSource(layerId)
            clearInterval(fadeInterval)
            return
        }

        map.value.setPaintProperty(layerId, 'line-opacity', opacity)
    }, interval)
}


// Function to start the autoplay animation
function startAutoPlayAnimation() {
    animationController.cancelled = true
    animationController = { cancelled: false }

    isAnimating.value = true

    clearMarkers()
    clearPaths()

    const species = selectedSpecies.value
    if (!species) {
        isAnimating.value = false
        return
    }

    const currentMonthNumber = new Date().getMonth() + 1
    const rawPoints = []
    for (let m = 1; m <= currentMonthNumber; m++) {
        const pt = getDominantStateForSpeciesMonth(species, m)
        rawPoints.push(pt || null)
    }

    let index = 1
    function nextSegment() {
        if (animationController.cancelled) {
            isAnimating.value = false
            return
        }

        if (index >= rawPoints.length) {
            const lastValid = rawPoints.slice().reverse().find(p => p !== null)
            if (lastValid) {
                animatedMarkers.value.forEach(marker => marker.remove())
                animatedMarkers.value = []
                placeAnimatedBirdMarker(species, lastValid, getColorForSpecies(species))
            }
            isAnimating.value = false
            return
        }

        const prev = rawPoints[index - 1]
        const current = rawPoints[index]

        if (prev && current) {
            animatedMarkers.value.forEach(marker => marker.remove())
            animatedMarkers.value = []
            animatePathSegment(species, prev, current, index - 1, () => {
                index++
                nextSegment()
            })
        } else {
            index++
            nextSegment()
        }
    }

    nextSegment()
}

function toggleYearPath() {
    const species = selectedSpecies.value
    if (!map.value?.isStyleLoaded() || !species) return

    const dashedLayerId = `${species}-dashed-layer`
    const dashedSourceId = `${species}-dashed-source`

    if (isYearPathVisible.value) {
        if (map.value.getLayer(dashedLayerId)) map.value.removeLayer(dashedLayerId)
        if (map.value.getSource(dashedSourceId)) map.value.removeSource(dashedSourceId)
        isYearPathVisible.value = false
    } else {
        const geojson = buildDashedPathGeoJSON(species)
        map.value.addSource(dashedSourceId, { type: 'geojson', data: geojson })
        map.value.addLayer({
            id: dashedLayerId,
            type: 'line',
            source: dashedSourceId,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
                'line-color': '#a9cf7a',
                'line-width': 3,
                'line-dasharray': [2, 2]
            }
        })
        isYearPathVisible.value = true
    }
}


function toggleAnimationSetting() {
    animationEnabled.value = !animationEnabled.value
}


onMounted(() => {
    try {
        // Set your Mapbox access token
        mapboxgl.accessToken = 'pk.eyJ1IjoidGxpdTAwNTgiLCJhIjoiY2x1N3B3emZrMDhmaTJ2bnIyeDkzb2lqZyJ9.ILfUF13AATr3Ud-oXgbZeg'

        // Initialize the Mapbox map
        map.value = new mapboxgl.Map({
            container: mapContainer.value, // DOM element reference
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: [135, -25],
            zoom: 3.8
        })

        const navControl = new mapboxgl.NavigationControl({ showCompass: false })
        map.value.addControl(navControl, 'bottom-left')

        // Confirm successful load
        map.value.on('load', () => {
            console.log('Mapbox loaded successfully.')
        })

        // Handle load or rendering errors
        map.value.on('error', (e) => {
            console.error('Mapbox error during loading or rendering:', e)
            alert('Failed to load the map. Please check your internet connection or access token.')
        })

        // Initialize popup object
        popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'wide-popup'
        })


    } catch (err) {
        console.error('Error initializing Mapbox:', err)
        alert('Map initialization failed. Please try again later.')
    }
})


watch(selectedSpecies, () => {
    lastMonthIndex.value = new Date().getMonth() + 1
    selectedMonth.value = new Date().getMonth() + 1
    if (isAnimating.value) return
    if (!map.value?.isStyleLoaded()) return

    const species = selectedSpecies.value
    if (!species) return

    clearMarkers()

    const previousSpecies = lastSpecies
    lastSpecies = species
    clearPaths(previousSpecies)

    map.value.fitBounds([
        [112, -44],
        [154, -10]
    ], {
        padding: 50,
        duration: 1000
    })

    if (isYearPathVisible.value) {
        const geojson = buildDashedPathGeoJSON(species)
        map.value.addSource(`${species}-dashed-source`, {
            type: 'geojson',
            data: geojson
        })
        map.value.addLayer({
            id: `${species}-dashed-layer`,
            type: 'line',
            source: `${species}-dashed-source`,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
                'line-color': '#a9cf7a',
                'line-width': 3,
                'line-dasharray': [2, 2]
            }
        })
    }

    const labelGeojson = buildMonthPointsGeoJSON(species)
    addMonthLabelLayer(species, labelGeojson)

    if (animationEnabled.value) {
        startAutoPlayAnimation()
    } else {
        const currentMonth = new Date().getMonth() + 1
        const lastCoord = getDominantStateForSpeciesMonth(species, currentMonth)
        if (lastCoord) {
            animatedMarkers.value.forEach(m => m.remove())
            animatedMarkers.value = []
            placeAnimatedBirdMarker(species, lastCoord)
        }
    }

    placeInteractivePointMarkers(species)
})
</script>

<style scoped>
/* Styles for the interactive map layout */
.interactive-map-layout {
    flex-direction: column;
    /* margin: 100px auto 0 auto; */
    padding: 16px;
    display: flex;
    height: 100%;
    max-width: 100%;
    border-radius: 16px;
    box-sizing: border-box;
    overflow: hidden;
    background-color: #f3f6ef;
    border-radius: 2rem;
    /* border-color: #f3f6ef; */
}

/* Styles for the top image bar */
.top-image-bar {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 5px 50px 5px 50px;
    overflow-x: auto;
    width: 100%;
    height: 20%;
    gap: 16px;
    background-color: #f5f9ef;
}

/* Styles for the main map section */
.map-main {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
    height: 80%;
    border-radius: 2rem;
}

/* Styles for the image item */
.image-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 1 16%;
    min-width: 120px;
    max-width: 150px;
}

/* Styles for the image item */
.image-item img {
    width: 100%;
    height: 80px;
    object-fit: contain;
    border-radius: 8px;
}

/* Styles for the image caption */
.image-caption {
    margin-top: 6px;
    font-size: 0.85rem;
    text-align: center;
}


/* Styles for the map section */
.map-section {
    max-width: 75%;
    max-height: 100%;
    flex: 1;
    position: relative;
    border-radius: 1rem;
}

/* Styles for the select title container */
.container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    background: #c2e59c;
    border: 2px solid #c5d8bd;
    border-radius: 8px;
    margin-bottom: 16px;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 16px;
    padding-bottom: 16px;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
    /* height: 20%; */
}

/* Styles for the sidebar */
.sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 25%;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 0px;
    padding-bottom: 0px;
    /* border-left: 1px solid #ccc; */
    background: #f3f6ef;
    overflow: hidden;
}


/* Styles for the sidebar title */
.sidebar-title {
    font-family: 'Merriweather', serif;
    font-size: 20px;
    margin-bottom: -10px;
    text-align: center;
    color: #000000;
}

.sidebar-graph {
    margin-bottom: 0px;
    text-align: center;
    color: #000000;
}

/* Styles for the species scroll */
.species-scroll {
    flex-grow: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Styles for the bird card */
.bird-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    background: #f3f6ef;
    border: 2px solid #c5d8bd;
    padding: 10px;
    border-radius: 8px;
    width: 100%;
    transition: all 0.3s ease;
    cursor: pointer;
}

/* Styles for the bird card on hover */
.bird-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* Styles for the selected bird card */
.bird-card.selected {
    background-color: #a9cf7a;
}

/* Styles for the bird image */
.bird-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
    flex-shrink: 0;
}

/* Styles for the bird info */
.bird-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
    flex: 1;
}

/* Styles for the bird info */
.bird-info input[type="radio"] {
    align-self: flex-end;
    margin-bottom: 4px;
}

/* Styles for the bird info */
.bird-info strong,
.bird-info p {
    width: 100%;
    text-align: right;
}

/* Styles for the bird marker */
.bird-marker {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;

}

/* faild, can not use style scoped  */
/* .bird-marker {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;

    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.bird-marker:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
    z-index: 999;
} */

/* Styles for the bird image in model */
.bird-modal-image {
    width: 400px;
    height: 400px;
    object-fit: contain;
    border-radius: 8px;
}

/* Styles for the bird modal overlay*/
.bird-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
    overflow-y: auto;
}

/* Styles for the bird modal */
.bird-modal {
    background-color: white;
    border-radius: 10px;
    width: 90%;
    max-width: 1000px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    animation: modalFadeIn 0.3s ease;
}

/* Styles for the bird modal on small screens */
@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Styles for the close button */
.modal-close-button {
    position: absolute;
    top: 15px;
    right: 20px;
    background: none;
    border: none;
    font-size: 2rem;
    color: #555;
    cursor: pointer;
    z-index: 10;
}

/* Styles for the bird modal header */
.bird-modal-header {
    display: flex;
    background-color: #f2f7e5;
    padding: 30px;
    border-radius: 10px 10px 0 0;
    gap: 30px;
}

/* Styles for the bird modal image container*/
.bird-modal-image-container {
    position: relative;
    flex: 0 0 300px;
    height: 300px;
    border-radius: 8px;
    overflow: hidden;

}

/* Styles for the bird modal image */
.bird-modal-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Styles for the bird modal title container */
.bird-modal-title-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* Styles for the bird modal title */
.bird-modal-title {
    font-size: 2.5rem;
    color: #1a2d00;
    margin-bottom: 10px;
}

/* Styles for the bird modal scientific name */
.bird-modal-scientific-name {
    font-style: italic;
    color: #555;
    font-size: 1.2rem;
    margin-bottom: 15px;
}

/* Styles for the bird modal family */
.bird-modal-family {
    color: #777;
    font-size: 1rem;
}

/* Styles for the bird modal content */
.bird-modal-content {
    padding: 30px;
}

/* Styles for the bird info section */
.bird-info-section {
    margin-bottom: 30px;
}

/* Styles for the bird info title */
.bird-info-title {
    font-size: 1.4rem;
    color: #1a2d00;
    margin-bottom: 15px;
    border-bottom: 2px solid #f3f9c0;
    padding-bottom: 5px;
    display: inline-block;
}

/* Styles for the bird info grid */
.bird-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

/* Styles for the bird info column */
.bird-info-column {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Styles for the bird info list */
.bird-info-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Styles for the bird info item */
.bird-info-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

/* Styles for the bird info label */
.bird-info-label {
    font-weight: 600;
    color: #555;
    font-size: 1rem;
}

/* Styles for the bird info value */
.bird-info-value {
    color: #333;
    line-height: 1.6;
    font-size: 0.95rem;
}

/* Styles for the bird info risks */
.risks-list {
    margin: 5px 0 0 20px;
    padding: 0;
}

/* Styles for the bird info risks list */
.risks-list li {
    margin-bottom: 5px;
    color: #333;
}

/* Styles for the bird conservation CTA */
.bird-conservation-cta {
    text-align: center;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

/* Styles for the bird conservation Button */
.conservation-button {
    display: inline-block;
    background-color: #1a2d00;
    color: #f3f9c0;
    padding: 14px 30px;
    border-radius: 30px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Styles for the bird conservation Button on hover */
.conservation-button:hover {
    background-color: #2c4b00;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Styles for the info point */
.info-point {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: orange;
    border: 2px solid white;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}


/* Styles for the info point on hover */
.info-point:hover {
    transform: scale(1.4);
}

/* Styles for the wide popup */
:global(.wide-popup .mapboxgl-popup-content) {
    max-width: none !important;
    width: 340px !important;
    padding: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
}

/* Styles for month dropdown */
.month-dropdown {
    margin: 20px auto;
    text-align: center;
}

.month-dropdown label {
    margin-right: 8px;
    font-weight: 600;
}

.month-dropdown select {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background-color: #fff;
    font-size: 1rem;
}

.map-control-top-left.month-dropdown {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 10;
    background-color: white;
    border-radius: 6px;
    padding: 6px 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.map-control-top-left select {
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 14px;
}

/* Styles for the toggle path button */
.map-top-right-control {
    position: absolute;
    top: 32px;
    right: 12px;
    z-index: 11;
}

.toggle-path-button {
    padding: 12px 12px;
    font-size: 14px;
    border-radius: 6px;
    border: none;
    background-color: #ffffff;
    color: rgb(0, 0, 0);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.toggle-path-button:hover {
    background-color: #c5d8bd;
}

.toggle-path-button:disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
}

/* Styles for the toggle animation button on hover */
.toggle-animation-button {
    margin-right: 8px;
    padding: 12px 12px;
    font-size: 14px;
    border-radius: 6px;
    border: none;
    background-color: #ffffff;
    color: rgb(0, 0, 0);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.toggle-animation-button:hover {
    background-color: #c5d8bd;
}

.toggle-animation-button:disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
}

@media screen and (max-width: 941px) {
    .map-main {
        flex-direction: column;
    }

    .map-section {
        max-width: 100%;
        min-height: 500px;
    }

    .sidebar {
        width: 100%;
        border-left: none;
        border-top: 1px solid #ccc;
        padding-top: 16px;
    }

    .top-image-bar {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        padding: 5px 50px 5px 50px;
        overflow-x: auto;
        width: 100%;
        height: 12%;
        gap: 16px;
        background-color: #f5f9ef;
    }


}

@media screen and (max-width: 720px) {
    .bird-modal-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
    }


    .bird-modal-header {
        display: flex;
        flex-direction: column;
        background-color: #f2f7e5;
        padding: 30px;
        border-radius: 10px 10px 0 0;
        gap: 30px;
    }

    .map-top-right-control {
        position: absolute;
        top: 100px;
        right: 12px;
        z-index: 11;
    }

    .bird-info-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .top-image-bar {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        padding: 5px 50px 5px 50px;
        overflow-x: auto;
        width: 100%;
        height: 12%;
        gap: 16px;
        background-color: #f5f9ef;
    }
}
</style>
