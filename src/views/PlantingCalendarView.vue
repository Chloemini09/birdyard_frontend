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
          <!-- ... Plant Info Column content (dropdown, name, image, description) ... -->
          <div class="plant-selector-dropdown-container" v-if="availablePlantsForSelection.length > 1">
            <label for="plant-select-calendar">Select Recommended Plant:</label>
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
            <!-- ... Selector Buttons ... -->
            <button @click="setActiveView('calendar')" :class="{ active: activeView === 'calendar' }" class="selector-button">Planting Calendar</button>
            <button @click="setActiveView('timeline')" :class="{ active: activeView === 'timeline' }" class="selector-button">Set Planting & See Timeline</button>
          </div>

          <div class="content-area">
            <!-- Optimal Planting Times (Annual Calendar) -->
            <section v-if="activeView === 'calendar' && plantingCalendarData" class="section-container optimal-planting-section">
              <!-- ... Optimal Planting Times content ... -->
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

              <!-- NEW: Two-column layout for timeline calendar and event list -->
              <div class="timeline-content-split">
                <!-- Left: Timeline Monthly Calendar -->
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

                <!-- Right: Timeline Event List -->
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
const router = useRouter(); // For potential URL updates (e.g., on dropdown change)

// --- UI State ---
const activeView = ref('calendar'); // Tracks active tab: 'calendar' (Optimal Planting Times) or 'timeline' (Growth Timeline)
const setActiveView = (viewName) => { activeView.value = viewName; }; // Method to switch tabs

// --- Data State ---
const allPlantsData = ref(allPlantsRaw); // Holds all plant data from JSON
const loading = ref(true); // Loading indicator state
const error = ref(''); // Error message display state

// --- Plant Selection State ---
const availablePlantsForSelection = ref([]); // Populated from recommendedPlantNamesString for the dropdown
const selectedPlantNameForCalendar = ref(props.plantName); // Currently selected plant, initialized from route
const initialPlantNameFromRoute = ref(props.plantName); // Stores the first plant name from route for context/error messages

// --- System Date Information ---
const systemCurrentDate = new Date();
const systemCurrentMonthIndex = systemCurrentDate.getMonth(); // 0-indexed current month (for highlighting in annual calendar)

// --- Personalized Timeline Start Date ---
const getTodayDateString = () => { // Formats date as YYYY-MM-DD for date input
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};
const selectedStartDateString = ref(getTodayDateString()); // User-selected planting start date, defaults to today

// --- Core Computed Properties for Displaying Plant Data ---
// Retrieves full data object for the currently selected plant
const currentPlantData = computed(() => {
  if (!selectedPlantNameForCalendar.value || !allPlantsData.value) return null;
  return allPlantsData.value.find((p) => p.plantName === selectedPlantNameForCalendar.value);
});
// Extracts the 'plantingCalendar' object from the current plant's data
const plantingCalendarData = computed(() => currentPlantData.value?.plantingCalendar || null);
// Generates the image URL for the current plant
const plantImageUrl = computed(() => {
  if (!currentPlantData.value?.plantName) return '/images/plants/default-plant.jpg'; // Fallback image
  return `/images/plants/${encodeURIComponent(currentPlantData.value.plantName)}.jpg`;
});
// Handles errors if a plant image fails to load
const handleImageError = (event) => {
  event.target.src = '/images/plants/default-plant.jpg';
  event.target.onerror = null; // Prevent infinite loop on fallback error
};

// --- Data & Logic for "Optimal Planting Times" (Annual Calendar) ---
const baseMonths = [ /* Defines month names and their 0-indexed numbers */
  { name: 'January', monthIndex: 0 }, { name: 'February', monthIndex: 1 }, { name: 'March', monthIndex: 2 }, { name: 'April', monthIndex: 3 },
  { name: 'May', monthIndex: 4 }, { name: 'June', monthIndex: 5 }, { name: 'July', monthIndex: 6 }, { name: 'August', monthIndex: 7 },
  { name: 'September', monthIndex: 8 }, { name: 'October', monthIndex: 9 }, { name: 'November', monthIndex: 10 }, { name: 'December', monthIndex: 11 },
];
const seasonsConfig = { /* Maps months to seasons and emojis for Southern/Northern hemispheres */
  southern: [
    { name: 'Summer', emoji: '☀️' }, { name: 'Summer', emoji: '☀️' }, { name: 'Autumn', emoji: '🍁' }, { name: 'Autumn', emoji: '🍁' }, { name: 'Autumn', emoji: '🍁' },
    { name: 'Winter', emoji: '❄️' }, { name: 'Winter', emoji: '❄️' }, { name: 'Winter', emoji: '❄️' }, { name: 'Spring', emoji: '🌸' }, { name: 'Spring', emoji: '🌸' },
    { name: 'Spring', emoji: '🌸' }, { name: 'Summer', emoji: '☀️' }
  ],
  northern: [ /* ... config for northern hemisphere ... */
    { name: 'Winter', emoji: '❄️' }, { name: 'Winter', emoji: '❄️' }, { name: 'Spring', emoji: '🌸' }, { name: 'Spring', emoji: '🌸' }, { name: 'Spring', emoji: '🌸' },
    { name: 'Summer', emoji: '☀️' }, { name: 'Summer', emoji: '☀️' }, { name: 'Summer', emoji: '☀️' }, { name: 'Autumn', emoji: '🍁' }, { name: 'Autumn', emoji: '🍁' },
    { name: 'Autumn', emoji: '🍁' }, { name: 'Winter', emoji: '❄️' }
  ]
};
// Dynamically generates month data including seasons based on user's hemisphere
const monthsWithSeasons = computed(() => {
  const currentHemisphereSeasons = seasonsConfig[props.userHemisphere];
  return baseMonths.map((month, index) => ({ ...month, season_full: currentHemisphereSeasons[index].name, season_emoji: currentHemisphereSeasons[index].emoji, }));
});
// Checks if a given month name is listed as a specific best planting month for the current plant
const isBestPlantingMonth = (monthName) => plantingCalendarData.value?.specificMonthsToPlant?.includes(monthName) || false;
// Checks if a given season name is listed as a best planting season for the current plant
const isSeasonOptimalForMonth = (fullSeasonName) => plantingCalendarData.value?.bestSeasonsToPlant?.includes(fullSeasonName) || false;
// Determines if a month index matches the current system month (for highlighting)
const isCurrentSystemMonth = (monthIdx) => monthIdx === systemCurrentMonthIndex;
// Identifies contiguous ranges of prime planting months for connected styling in the annual calendar
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
// Generates CSS classes for styling month cells in the annual "Optimal Planting Times" calendar
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
// Converts the string `selectedStartDateString` to a Date object (or null if invalid)
const selectedStartDateOrDefault = computed(() => {
  return selectedStartDateString.value ? new Date(selectedStartDateString.value + 'T00:00:00') : null;
});
// Formats a Date object to "Mon DD" string (e.g., "Jan 01")
const formatDate = (dateObj) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return 'N/A'
  return dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
};
// Adds a specified number of days to a given date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result
};
// Calculates all timeline events with their specific start/end dates based on `selectedStartDateOrDefault`
const timeline = computed(() => {
  if (!plantingCalendarData.value?.timelineEvents || !selectedStartDateOrDefault.value) return []
  return plantingCalendarData.value.timelineEvents.map((event) => {
    const calculatedDate = addDays(selectedStartDateOrDefault.value, event.offsetDays)
    let calculatedEndDate = null
    if (event.durationDays && event.durationDays > 1) calculatedEndDate = addDays(calculatedDate, event.durationDays - 1) // Duration includes start day
    return { ...event, calculatedDate, calculatedEndDate }
  })
});

// --- State for Timeline Monthly Calendar Navigation ---
const timelineCalendarYear = ref(new Date().getFullYear()); // Year displayed in the timeline calendar
const timelineCalendarMonth = ref(new Date().getMonth()); // Month (0-indexed) displayed in timeline calendar

// Updates the timeline calendar's displayed month/year when the selected planting start date changes
watch(selectedStartDateOrDefault, (newDate) => {
  if (newDate) {
    timelineCalendarYear.value = newDate.getFullYear();
    timelineCalendarMonth.value = newDate.getMonth();
  }
}, { immediate: true }); // Run immediately on component mount

// Full name of the month currently displayed in the timeline calendar (e.g., "January")
const currentTimelineCalendarMonthName = computed(() => new Date(timelineCalendarYear.value, timelineCalendarMonth.value).toLocaleString('default', { month: 'long' }));
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // For timeline calendar day headers

// Generates the grid of day objects for the timeline monthly calendar.
// Each day object contains info about its number, if it's in the current month,
// if it's the planting date, any events occurring on it, and if it's a "waiting" period.
const daysForTimelineCalendarGrid = computed(() => {
  if (!selectedStartDateOrDefault.value || !timeline.value || timeline.value.length === 0) return []; // Guard clause
  const daysArray = [];
  const year = timelineCalendarYear.value;
  const month = timelineCalendarMonth.value;
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // Day of the week for the 1st (0=Sun, 1=Mon...)
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the current calendar month

  const normalizeDate = (d) => d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null; // Helper to compare dates without time

  // Pre-calculate normalized start/end dates for all timeline events for efficiency
  const normalizedTimelineEvents = timeline.value.map(event => ({
      ...event,
      normStart: normalizeDate(event.calculatedDate),
      normEnd: normalizeDate(event.calculatedEndDate || event.calculatedDate) // Use start date if no end date (single day event)
  })).sort((a, b) => a.normStart - b.normStart); // Sort events chronologically

  // Add padding days from the previous month to fill the start of the grid
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push({ dayNumber: '', isCurrentMonth: false, eventsOnDay: [], eventClasses: [], isWaitingForGrowth: false });
  }

  // Populate days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const normCurrentDate = normalizeDate(currentDate);
    let eventsOnDay = [];
    let eventClasses = [];
    let isWaitingForGrowth = false;
    let isPartOfAnEvent = false; // Flag to track if the day is covered by any specific milestone

    // Check if current day falls within any specific milestone's duration
    normalizedTimelineEvents.forEach(event => {
      if (normCurrentDate >= event.normStart && normCurrentDate <= event.normEnd) {
        eventsOnDay.push(event);
        isPartOfAnEvent = true;
        eventClasses.push('event-day'); // General class for any event day
        if (normCurrentDate.getTime() === event.normStart.getTime()) eventClasses.push('event-start-day'); // Mark start of event
        if (normCurrentDate.getTime() === event.normEnd.getTime()) eventClasses.push('event-end-day'); // Mark end of event
      }
    });

    // If not part of any specific event, check if it's a "waiting" period between events
    if (!isPartOfAnEvent) {
      const normPlantingDate = normalizeDate(selectedStartDateOrDefault.value);
      // Check gap between planting date and the very first timeline event
      if (normalizedTimelineEvents.length > 0 && normCurrentDate < normalizedTimelineEvents[0].normStart && normCurrentDate > normPlantingDate) {
         isWaitingForGrowth = true;
      }
      // Check gaps between consecutive scheduled events
      for (let i = 0; i < normalizedTimelineEvents.length - 1; i++) {
        const event1_end = normalizedTimelineEvents[i].normEnd;
        const event2_start = normalizedTimelineEvents[i+1].normStart;
        if (normCurrentDate > event1_end && normCurrentDate < event2_start) { // Strictly between
          isWaitingForGrowth = true;
          break;
        }
      }
    }

    // If it's determined to be a waiting day, clear any event markers for that day to prioritize the waiting indicator
    if (isWaitingForGrowth) {
        eventsOnDay = [];
        eventClasses = [];
    }

    daysArray.push({
        date: currentDate,
        dayNumber: day,
        isCurrentMonth: true,
        // Check if this day is the selected planting date
        isPlantingDate: selectedStartDateOrDefault.value && normCurrentDate.getTime() === normalizeDate(selectedStartDateOrDefault.value).getTime(),
        eventsOnDay,
        eventClasses,
        isWaitingForGrowth
    });
  }
  // Pad the end of the grid with days from the next month if needed
  while (daysArray.length % 7 !== 0) {
    daysArray.push({ dayNumber: '', isCurrentMonth: false, eventsOnDay: [], eventClasses: [], isWaitingForGrowth: false });
  }
  return daysArray;
});

// Determines if the current timeline has any "waiting for growth" periods to show in the legend
const timelineHasWaitingPeriod = computed(() => {
    if (!timeline.value || timeline.value.length === 0) return false;
    // Create a sorted list of normalized event start/end dates
    const normalizedTimelineEvents = timeline.value.map(event => ({
        normStart: new Date(event.calculatedDate.getFullYear(), event.calculatedDate.getMonth(), event.calculatedDate.getDate()),
        normEnd: event.calculatedEndDate ? new Date(event.calculatedEndDate.getFullYear(), event.calculatedEndDate.getMonth(), event.calculatedEndDate.getDate()) : new Date(event.calculatedDate.getFullYear(), event.calculatedDate.getMonth(), event.calculatedDate.getDate())
    })).sort((a,b) => a.normStart - b.normStart);

    // Check for gap between planting date and the first event
    const plantingDate = selectedStartDateOrDefault.value ? new Date(selectedStartDateOrDefault.value.getFullYear(), selectedStartDateOrDefault.value.getMonth(), selectedStartDateOrDefault.value.getDate()) : null;
    if (plantingDate && normalizedTimelineEvents.length > 0 && normalizedTimelineEvents[0].normStart > addDays(plantingDate,0) && timeline.value[0].offsetDays > 0) {
      // Check if there's at least a one full day gap (first event starts 2+ days after planting)
      if (normalizedTimelineEvents[0].normStart.getTime() > addDays(plantingDate, 1).getTime()){
         return true;
      }
    }

    // Check for gaps between consecutive events
    for (let i = 0; i < normalizedTimelineEvents.length - 1; i++) {
        const event1_end = normalizedTimelineEvents[i].normEnd;
        const event2_start = normalizedTimelineEvents[i+1].normStart;
        // Check if there's at least a one full day gap
        if (event2_start.getTime() > addDays(event1_end, 1).getTime()) {
            return true;
        }
    }
    return false; // No significant waiting periods found
});

// Navigation functions for the monthly timeline calendar
const goToPreviousTimelineMonth = () => { if (timelineCalendarMonth.value === 0) { timelineCalendarMonth.value = 11; timelineCalendarYear.value--; } else timelineCalendarMonth.value--; };
const goToNextTimelineMonth = () => { if (timelineCalendarMonth.value === 11) { timelineCalendarMonth.value = 0; timelineCalendarYear.value++; } else timelineCalendarMonth.value++; };

// Helper function to convert HEX color to RGBA for applying opacity
const hexToRgba = (hex, alpha = 1) => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return hex; // Return original if not a valid hex
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return hex; // Handle cases where hex might be invalid after slicing
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Defines standard emojis and colors for various timeline milestones
const milestoneLooks = {
  default: { emoji: '🗓️', color: '#757575', bgColorAlpha: 0.15 }, // Default look
  plant:   { emoji: '🌱', color: '#4CAF50', bgColorAlpha: 0.15 }, // For "Plant", "Plant seeds", "Plant seedlings"
  seeds:   { emoji: '🌱', color: '#4CAF50', bgColorAlpha: 0.15 },
  seedlings: { emoji: '🌱', color: '#66BB6A', bgColorAlpha: 0.15 },
  germination: { emoji: '✨', color: '#AED581', bgColorAlpha: 0.15 }, // For "Germination"
  'seedling care': { emoji: '💧', color: '#2196F3', bgColorAlpha: 0.15 }, // For "Seedling Care"
  establishment: {emoji: '🌳', color: '#8BC34A', bgColorAlpha: 0.15 }, // For "Establishment"
  fertilize: { emoji: '🌿', color: '#388E3C', bgColorAlpha: 0.15 }, // For "Fertilize"
  'Regular Fertilizing': {emoji: '🪴', color: '#BDBDBD', bgColorAlpha: 0.1}, // For "Regular Fertilizing"
  'active growth': { emoji: '📈', color: '#009688', bgColorAlpha: 0.15 }, // For "Active Growth"
  flowering: { emoji: '🌸', color: '#E91E63', bgColorAlpha: 0.15 }, // For "Flowering"
  fruit:     { emoji: '🍓', color: '#FF9800', bgColorAlpha: 0.15 }, // For "Fruit Development", "Fruit Set"
  harvest:   { emoji: '🧺', color: '#F57C00', bgColorAlpha: 0.15 }, // For "Harvest"
  prune:     { emoji: '✂️', color: '#A1887F', bgColorAlpha: 0.15 }, // For "Prune" (will be prioritized)
  Pruning:     { emoji: '✂️', color: '#A1887F', bgColorAlpha: 0.15 }, // Handles capitalization
  dormancy:  { emoji: '🍂', color: '#BDBDBD', bgColorAlpha: 0.1 }, // For "Dormancy"
  waiting:   { emoji: '⏳', color: '#ADD8E6' }, // Special key for "waiting for growth" periods
  'Deadhead Spent Flowers': {emoji: '✂️', color: '#BDBDBD', bgColorAlpha: 0.1}, // For "Regular Fertilizing"
};

// Retrieves the emoji and color for a given event name based on keywords
const getEventLook = (eventNameOrKey) => {
  if (!eventNameOrKey) return milestoneLooks.default;
  // Check for direct key match first (e.g. for 'waiting')
  if (milestoneLooks[eventNameOrKey]) return milestoneLooks[eventNameOrKey];

  const nameLower = eventNameOrKey.toLowerCase();
  // Prioritize 'prune' or 'pruning' to ensure it gets the scissors emoji
  if (nameLower.includes('prune') || nameLower.includes('pruning')) return milestoneLooks.prune;

  // Iterate through other keywords defined in milestoneLooks
  for (const key in milestoneLooks) {
    // Skip generic/special keys already handled or not meant for general keyword matching
    if (key === 'default' || key === 'prune' || key === 'waiting' || key === 'Pruning') continue;
    if (nameLower.includes(key.toLowerCase())) return milestoneLooks[key]; // Match if keyword is in event name
  }
  return milestoneLooks.default; // Fallback to default if no specific keyword matches
};

// Generates a list of unique event types and their looks for the timeline calendar legend
const uniqueEventLooksInTimeline = computed(() => {
    if (!timeline.value || timeline.value.length === 0) return [];
    const distinctLooks = [];
    const addedKeywords = new Set(); // Tracks keywords for which a legend item has been added

    // Iterate through actual timeline events to build legend based on what's present
    timeline.value.forEach(event => {
        const eventNameLower = event.name.toLowerCase();
        let keywordFound = null;

        // Check if this event matches a predefined keyword (excluding default/waiting)
        for (const key in milestoneLooks) {
            if (key === 'default' || key === 'waiting') continue;
            if (eventNameLower.includes(key.toLowerCase())) {
                keywordFound = key;
                break;
            }
        }

        if (keywordFound) {
            // If it's the initial planting event (offset 0 and a "plant" type keyword), skip it for this generic legend,
            // as it's covered by the "Planting Date (draggable)" legend item.
            const isPlantingTypeEvent = ['plant', 'seeds', 'seedlings'].includes(keywordFound.toLowerCase());
            if (isPlantingTypeEvent && event.offsetDays === 0) {
                // This event is essentially the planting date, already has a dedicated legend item
            } else if (!addedKeywords.has(keywordFound)) { // Add only if this keyword type hasn't been added yet
                distinctLooks.push({ name: event.name, ...milestoneLooks[keywordFound] }); // Use full event name for better context in legend
                addedKeywords.add(keywordFound);
            }
        } else { // For events not matching any specific keyword
            // Avoid adding the initial planting event to the default list if it didn't match specific keywords
            const isPlantingEvent = (eventNameLower.includes('plant') || eventNameLower.includes('seed')) && event.offsetDays === 0;
            if (!isPlantingEvent) {
                const firstWord = eventNameLower.split(' ')[0]; // Group by first word for unknown types
                if (!addedKeywords.has(firstWord)) {
                    distinctLooks.push({ name: event.name, ...milestoneLooks.default });
                    addedKeywords.add(firstWord);
                }
            }
        }
    });
    return distinctLooks.slice(0, 5); // Limit the number of legend items for space
});

// --- Drag and Drop Logic for Planting Date on Timeline Calendar ---
const draggingPlantDate = ref(false); // Flag to indicate if planting date marker is being dragged
// Handles the start of a drag operation
const handleDragStart = (event, date) => {
  if (!date) return;
  event.dataTransfer.setData('text/plain', date.toISOString()); // Store date being dragged
  event.dataTransfer.effectAllowed = 'move'; // Indicate a move operation
  draggingPlantDate.value = true;
};
// Handles the end of a drag operation (whether successful drop or not)
const handleDragEnd = () => {
  draggingPlantDate.value = false;
  // Clean up any lingering highlight styles on drop targets
  document.querySelectorAll('.drop-target-highlight').forEach(el => el.classList.remove('drop-target-highlight'));
};
// Handles when a dragged item is over a potential drop target cell
const handleDragOver = (event, day) => {
  // Allow drop only on valid days (current month, not already the planting date)
  if (day.isCurrentMonth && !day.isPlantingDate) {
    event.preventDefault(); // Necessary to allow the drop event to fire
    if (event.currentTarget instanceof HTMLElement) event.currentTarget.classList.add('drop-target-highlight'); // Visual feedback
  }
};
// Handles when a dragged item leaves a potential drop target cell
const handleDragLeave = (event, day) => {
  if (event.currentTarget instanceof HTMLElement) event.currentTarget.classList.remove('drop-target-highlight');
};
// Handles the drop action on a target cell
const handleDrop = (event, day) => {
  if (day.isCurrentMonth && day.date) { // Ensure it's a valid day with a date object
    event.preventDefault();
    const targetDate = day.date;
    // Update the selectedStartDateString with the new date in YYYY-MM-DD format
    selectedStartDateString.value = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
  }
  if (event.currentTarget instanceof HTMLElement) event.currentTarget.classList.remove('drop-target-highlight');
  draggingPlantDate.value = false; // Clear dragging flag
};

// --- Lifecycle Hooks & Watchers ---
// Component mounted: Initialize data
onMounted(() => {
  loading.value = true;
  initialPlantNameFromRoute.value = props.plantName; // Store initial plant from route
  selectedPlantNameForCalendar.value = props.plantName; // Set dropdown to initial plant
  // Populate dropdown options from query param or default to initial plant
  if (props.recommendedPlantNamesString) {
    availablePlantsForSelection.value = props.recommendedPlantNamesString.split(',');
  } else {
    availablePlantsForSelection.value = [props.plantName];
  }
  // Check if data for the initial plant is available
  if (!currentPlantData.value) {
    error.value = `Details for plant "${props.plantName}" not found.`;
  }
  loading.value = false;
});

// Watcher: When a new plant is selected from the dropdown
watch(selectedPlantNameForCalendar, (newPlantName, oldPlantName) => {
  if (newPlantName && newPlantName !== oldPlantName) {
    // activeView.value = 'calendar'; // Removed: Keep current view active
    error.value = '';
    selectedStartDateString.value = getTodayDateString(); // Reset planting date to today for the new plant
    // Update timeline calendar display to the new planting date's month/year
    if(selectedStartDateOrDefault.value) {
      timelineCalendarYear.value = selectedStartDateOrDefault.value.getFullYear();
      timelineCalendarMonth.value = selectedStartDateOrDefault.value.getMonth();
    }
    // Check if data for the newly selected plant is available
    if (!currentPlantData.value) {
      error.value = `Details for plant "${newPlantName}" not found.`;
    }
  }
});

// Watcher: When route props change (e.g., user navigates to this page again with different params)
watch(() => [props.plantName, props.recommendedPlantNamesString], ([newInitialPlant, newRecNamesString]) => {
    loading.value = true;
    initialPlantNameFromRoute.value = newInitialPlant;
    selectedPlantNameForCalendar.value = newInitialPlant; // Reset dropdown and current plant
    activeView.value = 'calendar'; // Reset to default view (Optimal Planting Times)

    if (newRecNamesString) {
      availablePlantsForSelection.value = newRecNamesString.split(',');
    } else {
      availablePlantsForSelection.value = [newInitialPlant];
    }
    error.value = '';
    selectedStartDateString.value = getTodayDateString(); // Reset planting date
    if(selectedStartDateOrDefault.value) {
      timelineCalendarYear.value = selectedStartDateOrDefault.value.getFullYear();
      timelineCalendarMonth.value = selectedStartDateOrDefault.value.getMonth();
    }
    if (!currentPlantData.value) {
      error.value = `Details for plant "${newInitialPlant}" not found.`;
    }
    loading.value = false;
}, { immediate: false }); // `immediate: false` because onMounted handles the initial setup

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

/* .plant-info-column definition moved to its more complete version later */

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
  grid-template-columns: repeat(7, 1fr); /* 7 equal columns for days of the week */
  text-align: center;
}

.days-of-week { /* Specific styles for .days-of-week */
  margin-bottom: 8px;
  font-weight: bold;
  color: #666;
  font-size: 0.9em;
}

.dow-header {
  padding: 5px 0;
}

/* First definition of .timeline-day-cell removed as it was superseded by a later one with min-height: 80px */

.timeline-day-cell .day-number {
  font-weight: 500;
  margin-bottom: 3px;
  z-index: 1; /* Ensure day number is above background elements */
  align-self: flex-start;
  padding-left: 2px;
}

.timeline-day-cell.other-month .day-number {
  color: #aaa; /* Dim numbers for days not in the current month */
}

.timeline-day-cell.planting-date {
  background-color: var(--color-secondary, #c2e59c) !important;
  font-weight: bold;
}

.timeline-day-cell.planting-date .day-number {
  color: var(--color-primary, #0a3200);
}

/* Draggable Marker Style */
.draggable-planting-marker {
  cursor: grab;
  font-size: 1.8em;
  padding: 2px;
  border-radius: 4px;
  display: inline-block;
  position: absolute; /* For centering and drag functionality */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center element */
  z-index: 10; /* Ensure marker is interactive and above other cell content */
}

.draggable-planting-marker:active {
  cursor: grabbing;
}

.static-legend-marker {
  font-size: 1.1em;
  display: inline-block;
}

/* Visual feedback for drop target */
.timeline-day-cell.drop-target-highlight {
  background-color: #e6ffe6 !important;
  outline: 2px dashed var(--color-primary);
  outline-offset: -2px; /* Inset outline */
}

.timeline-day-cell.waiting-for-growth::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%); /* Vertically center the line */
  width: 100%;
  height: 60%; /* Height of the waiting line indicator */
  background-color: #ADD8E6A0; /* Semi-transparent light blue */
  z-index: 0; /* Behind other cell content like day number and emojis */
}

.waiting-emoji-on-line {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center emoji on the line */
  z-index: 1; /* Ensure emoji is above the waiting line */
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
  z-index: 1; /* Ensure emojis are above background elements like waiting line */
}

/* First definition of .calendar-event-emoji removed as it was superseded by a later one with font-size: 1.8em */

.more-events-emoji {
  font-size: 0.9em;
  background-color: #ccc;
  color: white;
  border-radius: 50%; /* Circular shape */
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

.planting-date-legend {
  /* Styles specific to the planting date item in the legend, if any */
}

.timeline-event .event-name { /* This is distinct from the general .event-name below */
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
  flex-shrink: 0; /* Prevent shrinking if event name is long */
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

.plant-info-column { /* This is the complete definition */
  flex: 0 0 320px; /* Fixed width column, does not grow or shrink */
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.05);
  align-self: flex-start; /* Align to the start of the cross axis (top) */
}

.dynamic-content-column {
  flex: 1; /* Takes remaining available space */
  min-width: 0; /* Prevents content from overflowing flex container */
  display: flex;
  flex-direction: column;
}

.timeline-content-split {
  display: flex;
  gap: 25px;
}

.timeline-calendar-panel {
  flex: 1; /* Takes available space, can be adjusted with proportions */
  min-width: 350px;
}

.timeline-list-panel {
  flex: 1; /* Takes available space, can be adjusted with proportions */
  min-width: 300px;
  max-height: 600px;
  overflow-y: auto; /* Enable vertical scroll if content overflows */
  padding-right: 10px; /* Space for scrollbar */
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

/* Adjustments for month cells in Optimal Planting Times if overall width increases */
.months-calendar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columns for months display */
  gap: 0; /* No gap between cells, borders will define separation */
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
  position: relative; /* For potential absolute positioned elements inside */
}

/* Remove right border from the last cell in each row (4th child) */
.month-cell-container:nth-child(4n) {
  border-right: none;
}

/* Remove bottom border from cells in the last row (children from 9th onwards for a 3x4 grid) */
.month-cell-container:nth-child(n+9) { /* Assuming 12 months, 3 rows of 4 */
  border-bottom: none;
}

/* Adjust timeline calendar day cell min-height if needed */
/* This is the effective definition of .timeline-day-cell after removing the earlier superseded one */
.timeline-day-cell {
  min-height: 80px; /* Effective min-height */
  border: 1px solid #eee;
  padding: 5px;
  font-size: 0.9em;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .planting-calendar-view {
    max-width: 1140px;
  }

  .plant-info-column {
    flex: 0 0 280px; /* Slightly reduce plant info column width */
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
    flex-direction: column; /* Stack columns vertically */
    align-items: stretch; /* Make items take full width */
  }

  .plant-info-column {
    flex-basis: auto; /* Reset flex-basis */
    width: 100%;
    margin-bottom: 20px;
    align-items: center;
  }

  .dynamic-content-column {
    width: 100%;
  }

  .months-calendar-grid {
    grid-template-columns: repeat(3, 1fr); /* Adjust to 3 columns */
  }

  .month-cell-container {
    min-height: 110px;
  }
  /* Re-apply right border for 4n as it's no longer last in row */
  .month-cell-container:nth-child(4n) {
    border-right: 1px solid #ccc;
  }
  /* Remove right border from the new last cell in each row (3rd child) */
  .month-cell-container:nth-child(3n) {
    border-right: none;
  }
  /* Re-apply bottom border for n+9 as it might not be last row */
  .month-cell-container:nth-child(n+9) {
    border-bottom: 1px solid #ccc;
  }
  /* Remove bottom border from cells in the new last row (children from 10th onwards for a 4x3 grid) */
  .month-cell-container:nth-child(n+10) { /* Assuming 12 months, 4 rows of 3 */
    border-bottom: none;
  }

  .timeline-days-grid {
    grid-template-columns: repeat(7, minmax(0,1fr)); /* Ensure columns can shrink */
  }

  .timeline-day-cell { /* This will override the base .timeline-day-cell styles in this media query */
    min-height: 60px;
    font-size: 0.8em;
  }

  .timeline-content-split {
    flex-direction: column; /* Stack timeline calendar and list */
  }

  .timeline-calendar-panel {
    min-width: auto; /* Reset min-width */
  }

  .timeline-list-panel {
    max-height: 300px;
    margin-top: 20px;
    min-width: auto; /* Reset min-width */
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
  margin-bottom: 25px;
  font-size: 2.2em;
  font-weight: 600;
}

.plant-name-header {
  font-size: 1.6em;
  color: var(--color-primary, #0a3200);
  margin-bottom: 10px;
  text-align: center;
  font-weight: 500;
}

.plant-image-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.plant-image-container {
  width: 250px;
  height: 250px;
  overflow: hidden; /* Clip image to container bounds */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin-bottom: 15px;
}

.plant-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Scale image to cover container, cropping if necessary */
}

.plant-description {
  font-size: 0.9em;
  color: #555;
  line-height: 1.6;
  text-align: left;
  padding: 0 5px;
  max-height: 250px;
  overflow-y: auto; /* Enable vertical scroll for long descriptions */
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
  overflow: hidden; /* To make border-radius clip children */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.selector-button {
  flex: 1; /* Distribute space equally among buttons */
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
  transform: none; /* Disable hover effect for non-interactive grid */
  z-index: auto;
  box-shadow: none;
}

.month-name {
  font-weight: bold;
  font-size: 1.6em;
  color: #333;
}

.month-season-indicator {
  font-size: 1.2em;
  color: #555;
  padding: 2px 0px;
  border-radius: 3px;
  display: block;
  margin-top: 3px;
}

.season-emoji {
  font-size: 2em;
  margin-right: 2px;
}

.optimal-indicator,
.secondary-indicator {
  font-size: 1.2em;
  margin-top: 4px;
  padding: 2px 0;
  border-radius: 4px;
  font-weight: 500;
}

.prime-range {
  background-color: #d4edda; /* Light green for prime planting range */
}

.prime-range .month-name {
  color: #155724; /* Darker green for text contrast */
}

.prime-range .optimal-indicator {
  color: #155724;
}

.secondary-optimal-month {
  background-color: #fff3cd; /* Light yellow for secondary range */
}

.secondary-optimal-month .month-name {
  color: #856404; /* Darker yellow/brown for text contrast */
}

.secondary-optimal-month .secondary-indicator {
  color: #856404;
}

.current-month-highlight {
  outline: 2px solid var(--color-primary, #0a3200);
  outline-offset: -2px; /* Inset outline for highlight */
}

.current-month-highlight .month-name {
  color: var(--color-primary, #0a3200);
}

.current-day-marker {
  font-size: 1em;
  color: var(--color-primary, #0a3200);
  font-style: italic;
  margin-top: 2px;
}

.current-month-highlight-legend {
  outline: 2px solid var(--color-primary, #0a3200);
  background-color: #f0f7e6; /* Different background for legend item */
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
  border-radius: 10px; /* Pill shape */
}

.event-name { /* General .event-name styles */
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
  background-color: #fffbe6; /* Light yellow for informational message */
  border: 1px solid #ffe58f;
  color: #8a6d3b;
  border-radius: 4px;
  text-align: center;
}

/* Timeline Monthly Calendar specific styles - many duplicates were removed from here */
/* Styles that were unique or intentionally overridden remain */

/* This is the effective definition of .calendar-event-emoji after removing the earlier superseded one */
.calendar-event-emoji {
  font-size: 1.8em; /* Larger emoji size in this context, now the primary definition */
  line-height: 1;
  padding: 1px;
}

@media (max-width: 768px) {
  .months-calendar-grid {
    grid-template-columns: repeat(2, 1fr); /* Adjust to 2 columns */
  }

  .month-cell-container {
    min-height: 120px;
  }
  /* Re-apply right border for 3n as it's no longer last in row */
  .month-cell-container:nth-child(3n) {
    border-right: 1px solid #ccc;
  }
  /* Remove right border from the new last cell in each row (2nd child) */
  .month-cell-container:nth-child(2n) {
    border-right: none;
  }
  /* Re-apply bottom border for n+10 as it might not be last row */
  .month-cell-container:nth-child(n+10) {
    border-bottom: 1px solid #ccc;
  }
  /* Remove bottom border from cells in the new last row (children from 11th onwards for a 6x2 grid) */
  .month-cell-container:nth-child(n+11) { /* Assuming 12 months, 6 rows of 2 */
    border-bottom: none;
  }

  .view-selector {
    flex-direction: column; /* Stack view selector buttons vertically */
  }

  .selector-button {
    border-bottom: 1px solid #ddd; /* Add separator between stacked buttons */
  }

  .selector-button:last-child {
    border-bottom: none; /* Remove border from last button */
  }

  .timeline-day-cell { /* This will override the base .timeline-day-cell styles in this media query */
    min-height: 50px;
    font-size: 0.75em;
    padding: 3px;
  }

  .calendar-event-emoji { /* This will override the base .calendar-event-emoji styles in this media query */
    font-size: 1em; /* Smaller emojis on smaller screens */
  }

  .more-events-emoji { /* This will override the base .more-events-emoji styles in this media query */
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
    min-height: 130px;
    padding: 6px;
  }

  .month-name {
    font-size: 0.9em;
  }

  .month-season-indicator {
    font-size: 0.7em;
  }

  .optimal-indicator,
  .secondary-indicator {
    font-size: 1em;
  }

  .legend {
    flex-direction: column; /* Stack legend items vertically */
    align-items: flex-start; /* Align items to the start */
    gap: 8px;
  }
}

@media (min-width: 600px) {
  .timeline-event {
    flex-direction: row; /* Layout event parts in a row */
    align-items: flex-start;
  }

  .event-date-badge {
    min-width: 180px; /* Allocate fixed space for date badge */
    flex-shrink: 0; /* Prevent date badge from shrinking */
  }

  .event-info {
    flex-grow: 1; /* Allow event info to take remaining space */
  }
}

</style>

