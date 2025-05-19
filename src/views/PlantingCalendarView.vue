<template>
  <div class="planting-calendar-view">
    <div v-if="loading" class="loading-message">Loading plant calendar...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="currentPlantData" class="calendar-content">
      <h1 class="view-title">Planting Planner</h1>
      <div class="view-subtitle-container">
        <p class="view-subtitle">Plan your garden with ease!</p>
        <p class="view-subtitle">Get personalised tips to grow a thriving, eco-friendly garden.</p>
      </div>

      <div class="main-layout-container">
        <div class="plant-info-column">
          <!-- Plant Selector Dropdown -->
          <div class="plant-selector-dropdown-container" v-if="availablePlantsForSelection.length > 1">
            <label for="plant-select-calendar">Recommended Plants</label>
            <select id="plant-select-calendar" v-model="selectedPlantNameForCalendar" class="plant-select-dropdown">
              <option v-for="plantNameOption in availablePlantsForSelection" :key="plantNameOption" :value="plantNameOption">
                {{ plantNameOption }}
              </option>
            </select>
          </div>
          <h2 class="plant-name-header">{{ currentPlantData.plantName }}</h2>
          <div class="plant-image-wrapper">
            <div class="plant-image-container" v-if="plantImageUrl">
              <img :src="plantImageUrl" :alt="currentPlantData.plantName" class="plant-image" @error="handleImageError" />
            </div>
          </div>
          <p class="plant-description" v-if="currentPlantData.description">
            {{ currentPlantData.description }}
          </p>
        </div>

        <div class="dynamic-content-column">
          <div class="view-selector">
            <button @click="setActiveView('calendar')" :class="{ active: activeView === 'calendar' }" class="selector-button">Planting Calendar</button>
            <button @click="setActiveView('timeline')" :class="{ active: activeView === 'timeline' }" class="selector-button">Set Planting & See Timeline</button>
          </div>

          <div class="content-area">
            <!-- Optimal Planting Times (Annual Calendar) -->
            <section v-if="activeView === 'calendar' && plantingCalendarData" class="section-container optimal-planting-section">
               <h2 class="section-title">Optimal Planting Times</h2>
              <p class="section-subtitle"> Annual overview. Optimal planting months are highlighted. Seasons are based on {{ userHemisphere === 'northern' ? 'Northern' : 'Southern' }} Hemisphere. </p>
              <div class="calendar-display">
                <div class="calendar-header">
                  <p v-if="plantingCalendarData.bestSeasonsToPlant?.length" class="best-seasons-text"> <strong>Best Overall Seasons to Plant:</strong> {{ plantingCalendarData.bestSeasonsToPlant.join(', ') }} </p>
                </div>
                <div class="months-calendar-grid no-interaction">
                  <div v-for="(month, index) in monthsWithSeasons" :key="month.name" class="month-cell-container" :class="[ getMonthCellClasses(month, index), { 'current-month-highlight': isCurrentSystemMonth(month.monthIndex) } ]">
                    <div class="month-name">{{ month.name }}</div>
                    <div class="month-season-indicator"> <span class="season-emoji">{{ month.season_emoji }}</span> {{ month.season_full }} </div>
                    <div v-if="isCurrentSystemMonth(month.monthIndex)" class="current-day-marker"> Current Month </div>
                    <div v-if="isBestPlantingMonth(month.name)" class="optimal-indicator"> ✓ Prime </div>
                    <div v-else-if=" isSeasonOptimalForMonth(month.season_full) && !isBestPlantingMonth(month.name) " class="secondary-indicator"> Consider </div>
                  </div>
                </div>
                <div class="legend">
                   <div class="legend-item"><span class="legend-color-box prime-range"></span> Prime Planting Month(s)</div>
                   <div class="legend-item"><span class="legend-color-box secondary-optimal-month"></span> Favorable Season</div>
                   <div class="legend-item"><span class="legend-color-box current-month-highlight-legend"></span> Current Month</div>
                </div>
              </div>
              <p v-if="plantingCalendarData.notes" class="calendar-notes"> <strong>Notes:</strong> {{ plantingCalendarData.notes }} </p>
            </section>
            <div v-else-if="activeView === 'calendar' && !plantingCalendarData" class="info-message small-info">
                Planting season data not available for this plant.
            </div>


            <!-- Personalized Growing Timeline (Now with internal two-column layout) -->
            <section v-if="activeView === 'timeline' && plantingCalendarData" class="section-container growing-timeline-section">
              <h2 class="section-title">Personalized Growing Timeline</h2>
              <div class="start-date-selector">
                <label for="planting-start-date" class="form-label">Select Planting Date:</label>
                <input type="date" id="planting-start-date" v-model="selectedStartDateString" class="form-input"/>
              </div>

              <div class="timeline-content-split">
                <div class="timeline-calendar-panel">
                  <div v-if="selectedStartDateOrDefault" class="timeline-monthly-calendar">
                    <div class="timeline-calendar-header">
                      <button @click="goToPreviousTimelineMonth" class="nav-button">< Prev</button>
                      <span class="month-year-display">{{ currentTimelineCalendarMonthName }} {{ timelineCalendarYear }}</span>
                      <button @click="goToNextTimelineMonth" class="nav-button">Next ></button>
                    </div>
                    <div class="days-of-week">
                      <div v-for="dayOfWeek in daysOfWeek" :key="dayOfWeek" class="dow-header">{{ dayOfWeek }}</div>
                    </div>
                    <div class="timeline-days-grid">
                      <div
                        v-for="(day, index) in daysForTimelineCalendarGrid"
                        :key="index"
                        class="timeline-day-cell"
                        :class="[{
                            'other-month': !day.isCurrentMonth,
                            'planting-date': day.isPlantingDate,
                            'waiting-for-growth': day.isWaitingForGrowth,
                            'drop-target-active': draggingPlantDate && day.isCurrentMonth && !day.isPlantingDate
                          }, ...day.eventClasses ]"
                          :style="{
                            backgroundColor: day.isWaitingForGrowth || day.isPlantingDate ? 'transparent' :
                                             (day.eventsOnDay.length > 0 ?
                                                hexToRgba(getEventLook(day.eventsOnDay[0].name).color, getEventLook(day.eventsOnDay[0].name).bgColorAlpha || 0.15) :
                                                'transparent')
                          }"
                        @dragover.prevent="handleDragOver($event, day)"
                        @dragleave="handleDragLeave($event, day)"
                        @drop="handleDrop($event, day)"
                      >
                        <span class="day-number">{{ day.dayNumber }}</span>
                        <div
                          v-if="day.isPlantingDate && day.isCurrentMonth"
                          class="draggable-planting-marker"
                          draggable="true"
                          @dragstart="handleDragStart($event, day.date)"
                          @dragend="handleDragEnd()"
                          title="Drag to change planting date"
                        >🌱</div>
                        <div class="event-emojis-calendar">
                            <span v-if="day.isWaitingForGrowth && !day.isPlantingDate" class="calendar-event-emoji waiting-emoji-on-line" :title="'Waiting for Growth (Observe, Care and Water if Dry)'">
                                  {{ getEventLook('waiting').emoji }}
                            </span>
                            <template v-else-if="day.eventsOnDay.length > 0 && !day.isPlantingDate && !day.isWaitingForGrowth">
                                <span v-for="event in day.eventsOnDay.slice(0,1)" :key="event.name" class="calendar-event-emoji" :title="event.name">
                                      {{ getEventLook(event.name).emoji }}
                                </span>
                                <span v-if="day.eventsOnDay.length > 1 && day.eventsOnDay.slice(0,1).some(e => e.name !== day.eventsOnDay[0].name)" class="calendar-event-emoji more-events-emoji" title="Multiple events this day">
                                      +
                                </span>
                            </template>
                        </div>
                      </div>
                    </div>
                     <div class="timeline-calendar-legend">
                        <span v-for="look in uniqueEventLooksInTimeline" :key="look.name" class="legend-item"> <span class="event-emoji-legend">{{ look.emoji }}</span> <span class="event-color-indicator-legend" :style="{ backgroundColor: look.color }"></span> {{ look.name }} </span>
                        <span class="legend-item waiting-legend" v-if="timelineHasWaitingPeriod"> <span class="event-emoji-legend">{{ getEventLook('waiting').emoji }}</span> <span class="waiting-line-legend-indicator"></span> Waiting for Growth (Observe, Care and Water if Dry)</span>
                        <span class="legend-item planting-date-legend"> 🌱 Planting Date (Draggable) </span>
                    </div>
                  </div>
                   <div v-else class="info-message small-info"> Please select a planting date to view the timeline calendar. </div>
                </div>

                <div class="timeline-list-panel">
                  <div v-if="timeline && timeline.length > 0 && selectedStartDateOrDefault" class="timeline-visual">
                    <h3 class="subsection-title">Timeline Events:</h3>
                    <ul class="timeline-list">
                      <li v-for="event in timeline" :key="event.name" class="timeline-event">
                        <div class="event-date-badge"> <span class="date-primary">{{ formatDate(event.calculatedDate) }}</span> <span v-if="event.calculatedEndDate" class="date-secondary">to {{ formatDate(event.calculatedEndDate) }}</span> <span v-if="event.durationDays" class="duration-chip">({{ event.durationDays }} days)</span> </div>
                        <div class="event-info"> <h4 class="event-name" :style="{ color: getEventLook(event.name).color }"> <span class="event-emoji-list">{{ getEventLook(event.name).emoji }}</span> <span class="event-color-indicator" :style="{ backgroundColor: getEventLook(event.name).color }"></span> {{ event.name }} </h4> <p class="event-description">{{ event.description }}</p> </div>
                      </li>
                    </ul>
                  </div>
                  <div v-else-if="selectedStartDateOrDefault" class="no-timeline-message"> <p>No timeline events defined for this plant.</p> </div>
                  <div v-else class="info-message small-info"> Select a planting date to see the event list. </div>
                </div>
              </div>
            </section>
             <div v-else-if="activeView === 'timeline' && !plantingCalendarData" class="info-message small-info"> Growth timeline data not available for this plant. </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!loading && !error" class="info-message"> <p> Plant data or calendar information not available for "{{ initialPlantNameFromRoute }}". Please ensure it has been added to the plant database or try another selection. </p> </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import allPlantsRaw from '@/assets/data/allPlants.json' // Local comprehensive plant data

// --- Component Props ---
const props = defineProps({
  plantName: { type: String, required: true }, // Initial plant name from route param
  userHemisphere: { type: String, default: 'southern', validator: (v) => ['southern', 'northern'].includes(v) }, // User's hemisphere for season calculation
  recommendedPlantNamesString: { type: String, default: '' } // Comma-separated string of plant names for dropdown
});

// --- Vue Router instances ---
const route = useRoute();
const router = useRouter();

// --- UI State ---
const activeView = ref('calendar');
const setActiveView = (viewName) => { activeView.value = viewName; };

// --- Data State ---
const allPlantsData = ref(allPlantsRaw);
const loading = ref(true);
const error = ref('');

// --- Plant Selection State ---
const availablePlantsForSelection = ref([]);
const selectedPlantNameForCalendar = ref(props.plantName);
const initialPlantNameFromRoute = ref(props.plantName);

// --- System Date Information ---
const systemCurrentDate = new Date();
const systemCurrentMonthIndex = systemCurrentDate.getMonth();

// --- Personalized Timeline Start Date ---
const getTodayDateString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};
const selectedStartDateString = ref(getTodayDateString());

// --- Core Computed Properties for Displaying Plant Data ---
const currentPlantData = computed(() => {
  if (!selectedPlantNameForCalendar.value || !allPlantsData.value) return null;
  return allPlantsData.value.find((p) => p.plantName.toLowerCase() === selectedPlantNameForCalendar.value.toLowerCase());
});
const plantingCalendarData = computed(() => currentPlantData.value?.plantingCalendar || null);
const plantImageUrl = computed(() => {
  if (!currentPlantData.value?.plantName) return '/images/plants/default-plant.jpg';
  const imageName = currentPlantData.value.plantName; // Use original case for file name
  return `/images/plants/${encodeURIComponent(imageName)}.jpg`;
});
const handleImageError = (event) => {
  const currentSrc = event.target.src;
  if (currentSrc.endsWith('.jpg')) {
    event.target.src = currentSrc.replace('.jpg', '.png');
    // If .png also fails, this new onerror will trigger.
    event.target.onerror = () => { event.target.src = '/images/plants/default-plant.jpg'; event.target.onerror = null; };
  } else {
    event.target.src = '/images/plants/default-plant.jpg';
    event.target.onerror = null; // Prevent infinite loop if default also somehow fails
  }
};


// --- Data & Logic for "Optimal Planting Times" (Annual Calendar) ---
const baseMonths = [
  { name: 'January', monthIndex: 0 }, { name: 'February', monthIndex: 1 }, { name: 'March', monthIndex: 2 }, { name: 'April', monthIndex: 3 },
  { name: 'May', monthIndex: 4 }, { name: 'June', monthIndex: 5 }, { name: 'July', monthIndex: 6 }, { name: 'August', monthIndex: 7 },
  { name: 'September', monthIndex: 8 }, { name: 'October', monthIndex: 9 }, { name: 'November', monthIndex: 10 }, { name: 'December', monthIndex: 11 },
];
const seasonsConfig = {
  southern: [
    { name: 'Summer', emoji: '☀️' }, { name: 'Summer', emoji: '☀️' }, { name: 'Autumn', emoji: '🍁' }, { name: 'Autumn', emoji: '🍁' }, { name: 'Autumn', emoji: '🍁' },
    { name: 'Winter', emoji: '❄️' }, { name: 'Winter', emoji: '❄️' }, { name: 'Winter', emoji: '❄️' }, { name: 'Spring', emoji: '🌸' }, { name: 'Spring', emoji: '🌸' },
    { name: 'Spring', emoji: '🌸' }, { name: 'Summer', emoji: '☀️' }
  ],
  northern: [
    { name: 'Winter', emoji: '❄️' }, { name: 'Winter', emoji: '❄️' }, { name: 'Spring', emoji: '🌸' }, { name: 'Spring', emoji: '🌸' }, { name: 'Spring', emoji: '🌸' },
    { name: 'Summer', emoji: '☀️' }, { name: 'Summer', emoji: '☀️' }, { name: 'Summer', emoji: '☀️' }, { name: 'Autumn', emoji: '🍁' }, { name: 'Autumn', emoji: '🍁' },
    { name: 'Autumn', emoji: '🍁' }, { name: 'Winter', emoji: '❄️' }
  ]
};
const monthsWithSeasons = computed(() => {
  const currentHemisphereSeasons = seasonsConfig[props.userHemisphere];
  return baseMonths.map((month, index) => ({ ...month, season_full: currentHemisphereSeasons[index].name, season_emoji: currentHemisphereSeasons[index].emoji, }));
});
const isBestPlantingMonth = (monthName) => plantingCalendarData.value?.specificMonthsToPlant?.includes(monthName) || false;
const isSeasonOptimalForMonth = (fullSeasonName) => plantingCalendarData.value?.bestSeasonsToPlant?.includes(fullSeasonName) || false;
const isCurrentSystemMonth = (monthIdx) => monthIdx === systemCurrentMonthIndex;
const primePlantingRanges = computed(() => {
  if (!plantingCalendarData.value?.specificMonthsToPlant) return [];
  const primeMonthsIndices = monthsWithSeasons.value.map((m, index) => (isBestPlantingMonth(m.name) ? index : -1)).filter(index => index !== -1);
  if (!primeMonthsIndices.length) return [];
  const ranges = [];
  let currentRange = [];
  primeMonthsIndices.sort((a,b) => a-b).forEach((monthIndex, i) => {
    if (i === 0 || monthIndex === primeMonthsIndices[i-1] + 1) currentRange.push(monthIndex);
    else { ranges.push([...currentRange]); currentRange = [monthIndex]; }
  });
  if (currentRange.length) ranges.push(currentRange);
  return ranges;
});
const getMonthCellClasses = (monthObject, monthArrayIndex) => {
  const classes = [];
  const isPrime = isBestPlantingMonth(monthObject.name);
  const isSecondary = isSeasonOptimalForMonth(monthObject.season_full) && !isPrime;
  if (isPrime) {
    classes.push('prime-range');
    for (const range of primePlantingRanges.value) {
      if (range.includes(monthArrayIndex)) {
        if (range.length === 1) classes.push('prime-range-single');
        else {
          if (monthArrayIndex === range[0]) classes.push('prime-range-start');
          if (monthArrayIndex === range[range.length - 1]) classes.push('prime-range-end');
          if (monthArrayIndex !== range[0] && monthArrayIndex !== range[range.length - 1]) classes.push('prime-range-middle');
        }
        break;
      }
    }
  } else if (isSecondary) classes.push('secondary-optimal-month');
  return classes;
};

// --- Data and Logic for "Personalized Growing Timeline" (Monthly Calendar + List) ---
const selectedStartDateOrDefault = computed(() => {
  return selectedStartDateString.value ? new Date(selectedStartDateString.value + 'T00:00:00') : null;
});
const formatDate = (dateObj) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return 'N/A'
  return dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
};
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result
};
const timeline = computed(() => {
  if (!plantingCalendarData.value?.timelineEvents || !selectedStartDateOrDefault.value) return []
  return plantingCalendarData.value.timelineEvents.map((event) => {
    const calculatedDate = addDays(selectedStartDateOrDefault.value, event.offsetDays)
    let calculatedEndDate = null
    if (event.durationDays && event.durationDays > 1) calculatedEndDate = addDays(calculatedDate, event.durationDays - 1)
    return { ...event, calculatedDate, calculatedEndDate }
  })
});

// --- State for Timeline Monthly Calendar Navigation ---
const timelineCalendarYear = ref(new Date().getFullYear());
const timelineCalendarMonth = ref(new Date().getMonth());

watch(selectedStartDateOrDefault, (newDate) => {
  if (newDate) {
    timelineCalendarYear.value = newDate.getFullYear();
    timelineCalendarMonth.value = newDate.getMonth();
  }
}, { immediate: true });

const currentTimelineCalendarMonthName = computed(() => new Date(timelineCalendarYear.value, timelineCalendarMonth.value).toLocaleString('default', { month: 'long' }));
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const daysForTimelineCalendarGrid = computed(() => {
  if (!selectedStartDateOrDefault.value || !timeline.value || timeline.value.length === 0) return [];
  const daysArray = [];
  const year = timelineCalendarYear.value;
  const month = timelineCalendarMonth.value;
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const normalizeDate = (d) => d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null;

  const normalizedTimelineEvents = timeline.value.map(event => ({
      ...event,
      normStart: normalizeDate(event.calculatedDate),
      normEnd: normalizeDate(event.calculatedEndDate || event.calculatedDate)
  })).sort((a, b) => a.normStart - b.normStart);

  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push({ dayNumber: '', isCurrentMonth: false, eventsOnDay: [], eventClasses: [], isWaitingForGrowth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const normCurrentDate = normalizeDate(currentDate);
    let eventsOnDay = [];
    let eventClasses = [];
    let isWaitingForGrowth = false;
    let isPartOfAnEvent = false;

    normalizedTimelineEvents.forEach(event => {
      if (normCurrentDate >= event.normStart && normCurrentDate <= event.normEnd) {
        eventsOnDay.push(event);
        isPartOfAnEvent = true;
        eventClasses.push('event-day');
        if (normCurrentDate.getTime() === event.normStart.getTime()) eventClasses.push('event-start-day');
        if (normCurrentDate.getTime() === event.normEnd.getTime()) eventClasses.push('event-end-day');
      }
    });

    if (!isPartOfAnEvent) {
      const normPlantingDate = normalizeDate(selectedStartDateOrDefault.value);
      if (normalizedTimelineEvents.length > 0 && normCurrentDate < normalizedTimelineEvents[0].normStart && normCurrentDate > normPlantingDate) {
         isWaitingForGrowth = true;
      }
      for (let i = 0; i < normalizedTimelineEvents.length - 1; i++) {
        const event1_end = normalizedTimelineEvents[i].normEnd;
        const event2_start = normalizedTimelineEvents[i+1].normStart;
        if (normCurrentDate > event1_end && normCurrentDate < event2_start) {
          isWaitingForGrowth = true;
          break;
        }
      }
    }

    if (isWaitingForGrowth) {
        eventsOnDay = [];
        eventClasses = [];
    }

    daysArray.push({
        date: currentDate,
        dayNumber: day,
        isCurrentMonth: true,
        isPlantingDate: selectedStartDateOrDefault.value && normCurrentDate.getTime() === normalizeDate(selectedStartDateOrDefault.value).getTime(),
        eventsOnDay,
        eventClasses,
        isWaitingForGrowth
    });
  }
  while (daysArray.length % 7 !== 0) {
    daysArray.push({ dayNumber: '', isCurrentMonth: false, eventsOnDay: [], eventClasses: [], isWaitingForGrowth: false });
  }
  return daysArray;
});

const timelineHasWaitingPeriod = computed(() => {
    if (!timeline.value || timeline.value.length === 0) return false;
    const normalizedTimelineEvents = timeline.value.map(event => ({
        normStart: new Date(event.calculatedDate.getFullYear(), event.calculatedDate.getMonth(), event.calculatedDate.getDate()),
        normEnd: event.calculatedEndDate ? new Date(event.calculatedEndDate.getFullYear(), event.calculatedEndDate.getMonth(), event.calculatedEndDate.getDate()) : new Date(event.calculatedDate.getFullYear(), event.calculatedDate.getMonth(), event.calculatedDate.getDate())
    })).sort((a,b) => a.normStart - b.normStart);

    const plantingDate = selectedStartDateOrDefault.value ? new Date(selectedStartDateOrDefault.value.getFullYear(), selectedStartDateOrDefault.value.getMonth(), selectedStartDateOrDefault.value.getDate()) : null;
    if (plantingDate && normalizedTimelineEvents.length > 0 && normalizedTimelineEvents[0].normStart > addDays(plantingDate,0) && timeline.value[0].offsetDays > 0) {
      if (normalizedTimelineEvents[0].normStart.getTime() > addDays(plantingDate, 1).getTime()){
         return true;
      }
    }
    for (let i = 0; i < normalizedTimelineEvents.length - 1; i++) {
        const event1_end = normalizedTimelineEvents[i].normEnd;
        const event2_start = normalizedTimelineEvents[i+1].normStart;
        if (event2_start.getTime() > addDays(event1_end, 1).getTime()) {
            return true;
        }
    }
    return false;
});

const goToPreviousTimelineMonth = () => { if (timelineCalendarMonth.value === 0) { timelineCalendarMonth.value = 11; timelineCalendarYear.value--; } else timelineCalendarMonth.value--; };
const goToNextTimelineMonth = () => { if (timelineCalendarMonth.value === 11) { timelineCalendarMonth.value = 0; timelineCalendarYear.value++; } else timelineCalendarMonth.value++; };

const hexToRgba = (hex, alpha = 1) => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return hex;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const milestoneLooks = {
  default: { emoji: '🗓️', color: '#757575', bgColorAlpha: 0.15 },
  plant:   { emoji: '🌱', color: '#4CAF50', bgColorAlpha: 0.15 },
  seeds:   { emoji: '🌱', color: '#4CAF50', bgColorAlpha: 0.15 },
  seedlings: { emoji: '🌱', color: '#66BB6A', bgColorAlpha: 0.15 },
  germination: { emoji: '✨', color: '#AED581', bgColorAlpha: 0.15 },
  'seedling care': { emoji: '💧', color: '#2196F3', bgColorAlpha: 0.15 },
  establishment: {emoji: '🌳', color: '#8BC34A', bgColorAlpha: 0.15 },
  fertilize: { emoji: '🌿', color: '#388E3C', bgColorAlpha: 0.15 },
  'Regular Fertilizing': {emoji: '🪴', color: '#BDBDBD', bgColorAlpha: 0.1},
  'active growth': { emoji: '📈', color: '#009688', bgColorAlpha: 0.15 },
  flowering: { emoji: '🌸', color: '#E91E63', bgColorAlpha: 0.15 },
  fruit:     { emoji: '🍓', color: '#FF9800', bgColorAlpha: 0.15 },
  harvest:   { emoji: '🧺', color: '#F57C00', bgColorAlpha: 0.15 },
  prune:     { emoji: '✂️', color: '#A1887F', bgColorAlpha: 0.15 },
  Pruning:     { emoji: '✂️', color: '#A1887F', bgColorAlpha: 0.15 },
  dormancy:  { emoji: '🍂', color: '#BDBDBD', bgColorAlpha: 0.1 },
  waiting:   { emoji: '⏳', color: '#ADD8E6' },
  'Deadhead Spent Flowers': {emoji: '✂️', color: '#BDBDBD', bgColorAlpha: 0.1},
};

const getEventLook = (eventNameOrKey) => {
  if (!eventNameOrKey) return milestoneLooks.default;
  if (milestoneLooks[eventNameOrKey]) return milestoneLooks[eventNameOrKey];
  const nameLower = eventNameOrKey.toLowerCase();
  if (nameLower.includes('prune') || nameLower.includes('pruning')) return milestoneLooks.prune;
  for (const key in milestoneLooks) {
    if (key === 'default' || key === 'prune' || key === 'waiting' || key === 'Pruning') continue;
    if (nameLower.includes(key.toLowerCase())) return milestoneLooks[key];
  }
  return milestoneLooks.default;
};

const uniqueEventLooksInTimeline = computed(() => {
    if (!timeline.value || timeline.value.length === 0) return [];
    const distinctLooks = [];
    const addedKeywords = new Set();
    timeline.value.forEach(event => {
        const eventNameLower = event.name.toLowerCase();
        let keywordFound = null;
        for (const key in milestoneLooks) {
            if (key === 'default' || key === 'waiting') continue;
            if (eventNameLower.includes(key.toLowerCase())) {
                keywordFound = key;
                break;
            }
        }
        if (keywordFound) {
            const isPlantingTypeEvent = ['plant', 'seeds', 'seedlings'].includes(keywordFound.toLowerCase());
            if (isPlantingTypeEvent && event.offsetDays === 0) {
                // Skip
            } else if (!addedKeywords.has(keywordFound)) {
                distinctLooks.push({ name: event.name, ...milestoneLooks[keywordFound] });
                addedKeywords.add(keywordFound);
            }
        } else {
            const isPlantingEvent = (eventNameLower.includes('plant') || eventNameLower.includes('seed')) && event.offsetDays === 0;
            if (!isPlantingEvent) {
                const firstWord = eventNameLower.split(' ')[0];
                if (!addedKeywords.has(firstWord)) {
                    distinctLooks.push({ name: event.name, ...milestoneLooks.default });
                    addedKeywords.add(firstWord);
                }
            }
        }
    });
    return distinctLooks.slice(0, 5);
});

// --- Drag and Drop Logic for Planting Date on Timeline Calendar ---
const draggingPlantDate = ref(false);
const handleDragStart = (event, date) => {
  if (!date) return;
  event.dataTransfer.setData('text/plain', date.toISOString());
  event.dataTransfer.effectAllowed = 'move';
  draggingPlantDate.value = true;
};
const handleDragEnd = () => {
  draggingPlantDate.value = false;
  document.querySelectorAll('.drop-target-highlight').forEach(el => el.classList.remove('drop-target-highlight'));
};
const handleDragOver = (event, day) => {
  if (day.isCurrentMonth && !day.isPlantingDate) {
    event.preventDefault();
    if (event.currentTarget instanceof HTMLElement) event.currentTarget.classList.add('drop-target-highlight');
  }
};
const handleDragLeave = (event, day) => {
  if (event.currentTarget instanceof HTMLElement) event.currentTarget.classList.remove('drop-target-highlight');
};
const handleDrop = (event, day) => {
  if (day.isCurrentMonth && day.date) {
    event.preventDefault();
    const targetDate = day.date;
    selectedStartDateString.value = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
  }
  if (event.currentTarget instanceof HTMLElement) event.currentTarget.classList.remove('drop-target-highlight');
  draggingPlantDate.value = false;
};

// --- Lifecycle Hooks & Watchers ---
onMounted(() => {
  loading.value = true;
  initialPlantNameFromRoute.value = props.plantName;
  selectedPlantNameForCalendar.value = props.plantName;

  let namesList = [];
  if (props.recommendedPlantNamesString) {
    namesList = props.recommendedPlantNamesString.split(',');
  }
  // Ensure the plant from the URL (props.plantName) is in the dropdown list, and put it first
  if (!namesList.includes(props.plantName)) {
    namesList.unshift(props.plantName);
  } else {
    // Move props.plantName to the front if it exists
    namesList = [props.plantName, ...namesList.filter(name => name !== props.plantName)];
  }
  availablePlantsForSelection.value = [...new Set(namesList)]; // Make unique, props.plantName is first

  if (!currentPlantData.value) {
    error.value = `Details for plant "${props.plantName}" not found.`;
  }
  loading.value = false;
});

watch(selectedPlantNameForCalendar, (newPlantName, oldPlantName) => {
  if (newPlantName && newPlantName !== oldPlantName) {
    error.value = '';
    selectedStartDateString.value = getTodayDateString();
    if(selectedStartDateOrDefault.value) {
      timelineCalendarYear.value = selectedStartDateOrDefault.value.getFullYear();
      timelineCalendarMonth.value = selectedStartDateOrDefault.value.getMonth();
    }
    if (!currentPlantData.value) {
      error.value = `Details for plant "${newPlantName}" not found.`;
    }
     // Optionally, update URL if a different plant is selected from dropdown
    // router.replace({ params: { plantName: newPlantName }, query: route.query });
    // Be cautious with router.replace here as it might re-trigger the props watch if not handled carefully.
    // For now, selecting from dropdown only changes internal state for display.
  }
});

watch(() => [props.plantName, props.recommendedPlantNamesString, props.userHemisphere], ([newInitialPlant, newRecNamesString, newHemisphere]) => {
    loading.value = true;
    initialPlantNameFromRoute.value = newInitialPlant;
    selectedPlantNameForCalendar.value = newInitialPlant; // Reset to current plant from route
    activeView.value = 'calendar';

    let namesList = [];
    if (newRecNamesString) {
      namesList = newRecNamesString.split(',');
    }
    if (!namesList.includes(newInitialPlant)) {
      namesList.unshift(newInitialPlant);
    } else {
      namesList = [newInitialPlant, ...namesList.filter(name => name !== newInitialPlant)];
    }
    availablePlantsForSelection.value = [...new Set(namesList)];

    error.value = '';
    selectedStartDateString.value = getTodayDateString();
    if(selectedStartDateOrDefault.value) {
      timelineCalendarYear.value = selectedStartDateOrDefault.value.getFullYear();
      timelineCalendarMonth.value = selectedStartDateOrDefault.value.getMonth();
    }
    if (!currentPlantData.value) {
      error.value = `Details for plant "${newInitialPlant}" not found.`;
    }
    loading.value = false;
}, { immediate: false });

</script>

<style scoped>

.plant-selector-dropdown-container {
  margin-bottom: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.plant-selector-dropdown-container label {
  font-size: 0.9em;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.plant-select-dropdown {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  font-size: 0.95em;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.075);
}

.timeline-monthly-calendar {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 15px;
  background-color: #fdfdfd;
}

.timeline-calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.month-year-display {
  font-size: 1.3em;
  font-weight: 500;
  color: var(--color-primary, #0a3200);
}

.nav-button {
  padding: 6px 12px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background-color: #e0e0e0;
}

.days-of-week,
.timeline-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.days-of-week {
  margin-bottom: 8px;
  font-weight: bold;
  color: #666;
  font-size: 0.9em;
}

.dow-header {
  font-weight: bold;
  padding: 5px 0;
}

.timeline-day-cell .day-number {
  font-weight: 500;
  margin-bottom: 3px;
  z-index: 1;
  align-self: flex-start;
  padding-left: 2px;
}

.timeline-day-cell.other-month .day-number {
  color: #aaa;
}

.timeline-day-cell.planting-date {
  background-color: var(--color-secondary, #c2e59c) !important;
  font-weight: bold;
}

.timeline-day-cell.planting-date .day-number {
  color: var(--color-primary, #0a3200);
}

.draggable-planting-marker {
  cursor: grab;
  font-size: 1.8em;
  padding: 2px;
  border-radius: 4px;
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.draggable-planting-marker:active {
  cursor: grabbing;
}

.static-legend-marker {
  font-size: 1.1em;
  display: inline-block;
}

.timeline-day-cell.drop-target-highlight {
  background-color: #e6ffe6 !important;
  outline: 2px dashed var(--color-primary);
  outline-offset: -2px;
}

.timeline-day-cell.waiting-for-growth::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 60%;
  background-color: #ADD8E6A0;
  z-index: 0;
}

.waiting-emoji-on-line {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  font-size: 1.2em;
}

.event-emojis-calendar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  width: 100%;
  padding-bottom: 2px;
  z-index: 1;
}

.more-events-emoji {
  font-size: 0.9em;
  background-color: #ccc;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.timeline-calendar-legend {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 15px;
  font-size: 0.8em;
}

.timeline-calendar-legend .legend-item {
  display: flex;
  align-items: center;
}

.event-emoji-legend {
  font-size: 1em;
  margin-right: 4px;
}

.event-color-indicator-legend {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 5px;
  border: 1px solid rgba(0,0,0,0.1);
}

.waiting-line-legend-indicator {
  width: 18px;
  height: 10px;
  background-color: #ADD8E6;
  border: 1px solid #90C3D4;
  margin-right: 5px;
  display: inline-block;
}

.timeline-event .event-name {
  display: flex;
  align-items: center;
}

.event-emoji-list {
  font-size: 1.5em;
  margin-right: 6px;
  line-height: 1;
}

.event-color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  margin-right: 8px;
  display: inline-block;
  flex-shrink: 0;
}

.calendar-column .section-title,
.growing-timeline-section .section-title {
  font-size: 1.4em;
  margin-bottom: 10px;
  border-bottom: 2px solid var(--color-secondary, #c2e59c);
  padding-bottom: 5px;
}

.planting-calendar-view {
  max-width: 3000px;
  margin-top: 80px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.main-layout-container {
  display: flex;
  gap: 30px;
}

.plant-info-column {
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  /* align-items: center; */ /* Commented out to allow label to align left */
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.05);
  align-self: flex-start;
}

.dynamic-content-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.timeline-content-split {
  display: flex;
  gap: 25px;
}

.timeline-calendar-panel {
  flex: 1;
  min-width: 350px;
}

.timeline-list-panel {
  flex: 1;
  min-width: 300px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}

.timeline-list-panel::-webkit-scrollbar {
  width: 8px;
}

.timeline-list-panel::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}

.timeline-list-panel::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}

.months-calendar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border: 1px solid #ccc;
}

.month-cell-container {
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-top: none;
  border-left: none;
  padding: 10px;
  text-align: center;
  background-color: #f8f9fa;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.month-cell-container:nth-child(4n) {
  border-right: none;
}

.month-cell-container:nth-child(n+9) {
  border-bottom: none;
}

.timeline-day-cell {
  min-height: 80px;
  border: 1px solid #eee;
  padding: 5px;
  font-size: 0.9em;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 1200px) {
  .planting-calendar-view {
    max-width: 1140px;
  }

  .plant-info-column {
    flex: 0 0 280px;
  }

  .timeline-list-panel {
    max-height: 550px;
  }
}

@media (max-width: 992px) {
  .planting-calendar-view {
    max-width: 960px;
  }

  .main-layout-container {
    flex-direction: column;
    align-items: stretch;
  }

  .plant-info-column {
    flex-basis: auto;
    width: 100%;
    margin-bottom: 20px;
    /* align-items: center; */ /* Keep default (stretch) or set to flex-start */
  }

  .dynamic-content-column {
    width: 100%;
  }

  .months-calendar-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .month-cell-container {
    min-height: 110px;
  }
  .month-cell-container:nth-child(4n) {
    border-right: 1px solid #ccc;
  }
  .month-cell-container:nth-child(3n) {
    border-right: none;
  }
  .month-cell-container:nth-child(n+9) {
    border-bottom: 1px solid #ccc;
  }
  .month-cell-container:nth-child(n+10) {
    border-bottom: none;
  }

  .timeline-days-grid {
    grid-template-columns: repeat(7, minmax(0,1fr));
  }

  .timeline-day-cell {
    min-height: 60px;
    font-size: 0.8em;
  }

  .timeline-content-split {
    flex-direction: column;
  }

  .timeline-calendar-panel {
    min-width: auto;
  }

  .timeline-list-panel {
    max-height: 300px;
    margin-top: 20px;
    min-width: auto;
  }
}

.loading-message,
.error-message,
.info-message {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}

.info-message.small-info {
  font-size: 0.9em;
  padding: 10px;
  color: #666;
}

.error-message {
  color: #d9534f;
  background-color: #f2dede;
  border: 1px solid #ebccd1;
  border-radius: 4px;
}

.view-title {
  color: var(--color-primary, #0a3200);
  text-align: center;
  margin-bottom: 10px;
  font-size: 2.2em;
  font-weight: 600;
}

.view-subtitle-container {
  text-align: center;
  margin: 0 auto;
  max-width: 800px;
}

.view-subtitle {
  font-size: 1.1rem;
}

.plant-name-header {
  font-size: 1.6em;
  color: var(--color-primary, #0a3200);
  margin-bottom: 10px;
  text-align: center; /* Center header text */
  font-weight: 500;
  width: 100%; /* Ensure it takes full width for centering */
}

.plant-image-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.plant-image-container {
  width: 250px;
  height: 250px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin-bottom: 15px;
}

.plant-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plant-description {
  font-size: 0.9em;
  color: #555;
  line-height: 1.6;
  text-align: left;
  padding: 0 5px;
  max-height: 250px;
  overflow-y: auto;
  width: 100%;
}

.plant-description::-webkit-scrollbar {
  width: 6px;
}

.plant-description::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

.plant-description::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}

.view-selector {
  display: flex;
  margin-bottom: 20px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.selector-button {
  flex: 1;
  padding: 12px 15px;
  background-color: #f0f0f0;
  color: #555;
  border: none;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.selector-button:hover {
  background-color: #e0e0e0;
}

.selector-button.active {
  background-color: var(--color-primary, #0a3200);
  color: white;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
}

.content-area {
  /* Placeholder for content area styles */
}

.section-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
}

.section-subtitle {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 15px;
}

.subsection-title {
  font-size: 1.3em;
  color: #444;
  margin-top: 0;
  margin-bottom: 15px;
}

.calendar-display {
  margin-top: 10px;
}

.calendar-header {
  text-align: center;
  margin-bottom: 15px;
}

.best-seasons-text {
  font-size: 1em;
  color: #000000;
  font-weight: bold;
}

.months-calendar-grid.no-interaction .month-cell-container:hover {
  transform: none;
  z-index: auto;
  box-shadow: none;
}

.month-name {
  font-weight: bold;
  font-size: 1.6em; /* Reduced from 1.6em for better fit */
  color: #333;
}

.month-season-indicator {
  font-size: 1.2em; /* Reduced from 1.2em */
  color: #555;
  padding: 2px 0px;
  border-radius: 3px;
  display: block;
  margin-top: 3px;
}

.season-emoji {
  font-size: 2em; /* Reduced from 2em */
  margin-right: 2px;
}

.optimal-indicator,
.secondary-indicator {
  font-size: 1.2em; /* Reduced from 1.2em */
  margin-top: 4px;
  padding: 2px 0;
  border-radius: 4px;
  font-weight: 500;
}

.prime-range {
  background-color: #d4edda;
}

.prime-range .month-name {
  color: #155724;
}

.prime-range .optimal-indicator {
  color: #155724;
}

.secondary-optimal-month {
  background-color: #fff3cd;
}

.secondary-optimal-month .month-name {
  color: #856404;
}

.secondary-optimal-month .secondary-indicator {
  color: #856404;
}

.current-month-highlight {
  outline: 2px solid var(--color-primary, #0a3200);
  outline-offset: -2px;
}

.current-month-highlight .month-name {
  color: var(--color-primary, #0a3200);
}

.current-day-marker {
  font-size: 1em; /* Reduced from 1em */
  color: var(--color-primary, #0a3200);
  font-style: italic;
  margin-top: 2px;
}

.current-month-highlight-legend {
  outline: 2px solid var(--color-primary, #0a3200);
  background-color: #f0f7e6;
}

.legend {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.8em;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color-box {
  width: 14px;
  height: 14px;
  border-radius: 3px;
}

.legend-color-box.prime-range {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
}

.legend-color-box.secondary-optimal-month {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
}

.calendar-notes {
  margin-top: 15px;
  font-style: italic;
  color: #555;
  background-color: #e9f5e9;
  padding: 10px;
  border-left: 3px solid var(--color-primary, #0a3200);
  border-radius: 4px;
}

.start-date-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-label {
  font-weight: bold;
}

.form-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

.timeline-visual {
  margin-top: 20px;
}

.timeline-list {
  list-style: none;
  padding: 0;
}

.timeline-event {
  background-color: #fdfdfd;
  border: 1px solid #eaeaea;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event-date-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.date-primary {
  font-weight: bold;
  color: var(--color-primary, #0a3200);
  background-color: var(--color-secondary, #c2e59c);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.date-secondary {
  font-size: 0.85em;
  color: #555;
}

.duration-chip {
  font-size: 0.8em;
  color: #777;
  background-color: #e0e0e0;
  padding: 2px 6px;
  border-radius: 10px;
}

.event-name {
  font-size: 1.1em;
  margin: 0 0 5px 0;
}

.event-description {
  font-size: 0.95em;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.no-timeline-message {
  padding: 15px;
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  color: #8a6d3b;
  border-radius: 4px;
  text-align: center;
}

.calendar-event-emoji {
  font-size: 1.8em;
  line-height: 1;
  padding: 1px;
}

@media (max-width: 768px) {
  .months-calendar-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .month-cell-container {
    min-height: 120px;
  }
  .month-cell-container:nth-child(3n) {
    border-right: 1px solid #ccc;
  }
  .month-cell-container:nth-child(2n) {
    border-right: none;
  }
  .month-cell-container:nth-child(n+10) {
    border-bottom: 1px solid #ccc;
  }
  .month-cell-container:nth-child(n+11) {
    border-bottom: none;
  }

  .view-selector {
    flex-direction: column;
  }

  .selector-button {
    border-bottom: 1px solid #ddd;
  }

  .selector-button:last-child {
    border-bottom: none;
  }

  .timeline-day-cell {
    min-height: 50px;
    font-size: 0.75em;
    padding: 3px;
  }

  .calendar-event-emoji {
    font-size: 1em;
  }

  .more-events-emoji {
    font-size: 0.8em;
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 576px) {
  .plant-info-column {
    padding: 15px;
  }

  .plant-image-container {
    width: 200px;
    height: 200px;
  }

  .month-cell-container {
    min-height: 130px; /* Increased min-height slightly for very small screens */
    padding: 6px;
  }

  .month-name {
    font-size: 0.9em;
  }

  .month-season-indicator {
    font-size: 0.7em;
  }

  .season-emoji {
      font-size: 1.5em; /* Slightly smaller emoji for very small screens */
  }

  .optimal-indicator,
  .secondary-indicator {
    font-size: 0.8em; /* Smaller indicator text */
  }

  .current-day-marker {
      font-size: 0.7em;
  }

  .legend {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (min-width: 600px) {
  .timeline-event {
    flex-direction: row;
    align-items: flex-start;
  }

  .event-date-badge {
    min-width: 180px;
    flex-shrink: 0;
  }

  .event-info {
    flex-grow: 1;
  }
}

</style>
