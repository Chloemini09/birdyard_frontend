<template>
  <div class="page-wrapper">
    <section class="hero">
      <div class="container">
        <h1>Build A Garden That Birds Call Home</h1>
        <p class="subtitle">Step-by-step guide, seasonal tips, and bird-safe gardening ideas</p>
      </div>
    </section>

    <div class="guide-container">
      <!-- US3.2 – Seasonal Bird Support Tips -->
      <div class="seasonal-section">
        <div class="seasonal-left">
          <h3>Seasonal Bird Support Tips</h3>
          <div class="season-selector">
            <label for="seasonSelect">Select Season or Event:</label>
            <select id="seasonSelect" v-model="selectedSeason">
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Autumn">Autumn</option>
              <option value="Winter">Winter</option>
              <option value="Drought">Drought</option>
              <option value="Bushfire">After Bushfire</option>
            </select>
          </div>
          <div class="tips-list">
            <div v-for="(tip, index) in tips" :key="index" class="tip-item">• {{ tip }}</div>
          </div>
        </div>
        <div class="seasonal-right">
          <img src="/images/Nesting/seasonaltips.png" alt="Bird Seasonal Tip Image" />
        </div>
      </div>
      <!-- US3.3 – Garden Health Troubleshooter (merged into one card) -->
      <div class="guide-card layout-left clickable">
        <img src="/images/Nesting/woodland.jpg" alt="Garden Troubleshooting" />
        <div class="card-content">
          <h3>Garden Trouble Shooting</h3>
          <p>Click a topic below to view detailed advice:</p>
          <div class="troubleshoot-buttons">
            <button
              v-for="(tipsArray, issue) in troubleTips"
              :key="issue"
              class="troubleshoot-btn"
              @click="openModal(issue)"
              :title="'Click to see tips for ' + issue"
            >
              🔧 {{ issue }}
            </button>
          </div>
        </div>
      </div>
      <!-- US3.1 – Nesting Guide -->
      <div class="guide-card layout-left">
        <img src="/images/Nesting/diy.jpg" alt="Nesting Guide" />
        <div class="card-content">
          <h3>Bird Nesting & Shelter Guide</h3>
          <p>
            Learn how to provide safe nesting areas, build DIY shelters, and support native species
            throughout the year.
          </p>
          <router-link
            to="/nesting"
            class="nesting-btn nesting-btn-large"
            title="Click to view the Bird Nesting & Shelter Guide"
          >
            🪺 Go to Bird Nesting & Shelter Guide
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal-overlay" v-if="showModal" @click="handleOverlayClick">
      <div class="modal" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>
        <h3>{{ selectedIssue }}</h3>
        <ul>
          <li v-for="(tip, i) in troubleTips[selectedIssue]" :key="i">{{ tip }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const selectedSeason = ref('Spring')
const tips = ref([])
const showModal = ref(false)
const selectedIssue = ref('')

const troubleTips = {
  'Drought Stress': [
    '💧 Water early in the morning or late evening to minimize water loss due to evaporation. Morning watering is ideal as it allows moisture to reach the roots before the heat of the day. For deep-rooted plants, consider slow-drip irrigation to ensure penetration beyond surface level, which helps build drought resilience over time.',

    '🌿 Apply a 5-10 cm layer of organic mulch such as sugarcane, straw, pine bark, or composted leaf litter. Mulch acts as an insulating blanket, keeping soil temperature stable and reducing evaporation. It also suppresses weeds that compete for limited moisture and breaks down over time to enrich the soil.',

    '🌵 Choose and group plants according to their drought tolerance. Native plants like grevillea, banksia, and saltbush are adapted to local dry conditions and often require less care once established. Avoid placing thirsty plants like ferns or hydrangeas in exposed areas—use zoning principles to match water needs by location.',
  ],

  'Insect Infestations': [
    '🐞 Attract natural predators such as ladybugs, hoverflies, and praying mantises by planting companion plants like dill, marigold, alyssum, or yarrow. These “insectary” species offer nectar and shelter for beneficial insects. Avoid broad-spectrum pesticides which kill both pests and helpful organisms, disrupting the ecosystem balance.',

    '🌱 Neem oil, made from the neem tree, is an effective organic pesticide with systemic and contact properties. Mix according to label (typically 5-10 ml per litre), apply in the early evening to avoid burning leaves, and repeat every 5–7 days. It interrupts pest breeding cycles and deters feeding, while remaining safe for bees if applied properly.',

    '✂️ Regular inspection and manual removal are vital. Check the undersides of leaves where pests often hide. Prune affected foliage using clean, sterilized shears to avoid spreading disease. For severe infestations, isolate the plant from others until the problem is under control.',
  ],

  Overwatering: [
    '🧪 Test your soil by feeling or using a moisture meter. Soil that stays wet for more than 2 days may be retaining too much water. Over time, this creates anaerobic conditions, promoting root rot and fungal diseases. Use raised planters or mix sand and perlite into your garden beds to increase drainage and oxygen flow.',

    '📉 Adjust watering frequency based on season, plant type, and recent rainfall. For example, succulents may need water only every 2–3 weeks, while vegetables may need it more often during fruiting. Install drip systems with moisture sensors or use self-watering pots with overflow holes to reduce the chance of saturation.',

    '🌾 Ensure containers have sufficient and unobstructed drainage holes. Elevate pots on risers or bricks to prevent water from pooling underneath. For garden beds in heavy clay soil, build raised beds with layers of gravel, compost, and loamy topsoil to maintain proper air and water balance for root health.',
  ],

  'Poor Soil Conditions': [
    '🪱 Improve soil structure and fertility by mixing in composted kitchen scraps, worm castings, and decomposed manure. These organic materials increase microbial activity, water-holding capacity, and long-term nutrient availability, especially in sandy or depleted soils. Apply at the beginning and end of growing seasons for best results.',

    '📊 Conduct a full soil test that includes pH, macronutrients (NPK), and micronutrients like magnesium or boron. Use testing results to guide amendments—for example, acidic soil (pH < 6) can be corrected with dolomite lime, while alkaline soil (pH > 7.5) may benefit from sulfur or peat moss to support plant uptake of iron and manganese.',

    '🌿 Use raised garden beds, no-dig beds, or lasagna-style layering techniques for long-term soil building. Raised beds provide control over composition, reduce compaction from foot traffic, and allow better drainage. You can also practice crop rotation and green manure cover cropping to naturally replenish nutrients and break pest cycles.',
  ],
}

function openModal(issue) {
  selectedIssue.value = issue
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}

function handleOverlayClick() {
  closeModal()
}

const tipsData = {
  Spring: [
    'Plant nectar-rich flowers to attract hummingbirds.',
    'Provide fresh water for nesting birds.',
    'Install new birdhouses before breeding season.',
  ],
  Summer: [
    'Provide shade and water during hot days.',
    'Plant fruit-bearing shrubs.',
    'Monitor for bird diseases around feeders.',
  ],
  Autumn: [
    'Plant late-blooming natives for migrating birds.',
    'Clean birdhouses after breeding season.',
    'Leave seed heads for winter foraging.',
  ],
  Winter: [
    'Provide extra food (seeds, suet) during cold months.',
    'Keep water unfrozen if possible.',
    'Provide shelter with evergreen plants.',
  ],
  Drought: [
    'Add extra water sources in your garden.',
    'Mulch heavily to retain soil moisture.',
    'Select drought-tolerant native plants.',
  ],
  Bushfire: [
    'Plant quick-recovery native species.',
    'Provide temporary feeders for displaced birds.',
    'Avoid disturbing regrowing areas.',
  ],
}

watch(
  selectedSeason,
  () => {
    tips.value = tipsData[selectedSeason.value] || []
  },
  { immediate: true },
)
</script>

<style scoped>
.page-wrapper {
  background-color: #f9f7f0;
}

/* === Hero Section === */
.hero {
  background-image:
    linear-gradient(rgba(0, 50, 0, 0.3), rgba(0, 50, 0, 0.6)),
    url('/images/Nesting/backyardbird.jpg');
  background-size: cover;
  background-position: 50% 70%;
  background-repeat: no-repeat;
  min-height: 400px;
  color: white;
  padding: 80px 0;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  margin-top: 80px;
  margin-bottom: 1rem;
}

.hero .subtitle {
  font-size: 1.2rem;
  color: #e0e0e0;
}

/* === Container === */
.guide-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f7f0;
  padding: 40px 20px;
  gap: 50px;
}

/* === Seasonal Tips Card (Same as guide-card) === */
.seasonal-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f3f6ef;
  border-radius: 15px;
  padding: 30px 40px;
  gap: 40px;
  width: 85%;
  max-width: 1200px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.seasonal-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}

.seasonal-left {
  flex: 1.2;
  min-width: 300px;
}

.seasonal-left h3 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #0a3200;
  margin-bottom: 10px;
}

.seasonal-right {
  flex: 0.8;
  min-width: 360px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f6ef;
  padding: 10px;
  border-radius: 12px;
}

.seasonal-right img {
  width: 340px !important;
  max-width: none;
  height: auto;
  object-fit: contain;
  transform: scaleX(-1);
  box-shadow: none;
}

.season-selector label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
}

.season-selector select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  min-width: 200px;
}

.tips-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip-item {
  background-color: white;
  padding: 10px 14px;
  border-radius: 6px;
  color: #333;
  border-left: 4px solid #c2e59c;
  font-size: 0.95rem;
}

.nesting-btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 800;
  transition: all 0.3s ease;
  text-align: center;
}

.nesting-btn-large {
  padding: 15px 30px;
  font-size: 18px;
  background-color: rgba(194, 229, 156, 0.9);
  color: #0a3200;
  border: 2px solid #c2e59c;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
/* === Guide Card Shared Style === */
.guide-card {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 85%;
  max-width: 1200px;
  background-color: #f3f6ef;
  border-radius: 15px;
  padding: 25px;
  gap: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.guide-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}

.layout-left {
  flex-direction: row;
}

.guide-card img {
  width: 300px;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
}

.card-content {
  flex: 1;
  min-width: 260px;
}

.card-content h3 {
  font-size: 1.6rem;
  color: #0a3200;
  margin-bottom: 10px;
}

.card-content p {
  font-size: 1rem;
  color: #444;
  line-height: 1.5;
  margin-bottom: 16px;
}

/* === Unified Button Style === */
.troubleshoot-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.troubleshoot-btn {
  background-color: white;
  border: 2px solid #c2e59c;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  display: inline-block;
  text-decoration: none;
}

.troubleshoot-btn:hover {
  background-color: #eaf5e1;
  border-color: #a9cf7a;
  transform: translateY(-1px);
}

/* === Modal === */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  max-width: 650px;
  width: 95%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  position: relative;
  font-size: 1.05rem;
  line-height: 1.9;
}
.modal h3 {
  margin-bottom: 15px;
  font-size: 1.4rem;
  color: #0a3200;
}

.modal ul {
  list-style: none;
  padding-left: 0;
}

.modal ul li {
  margin-bottom: 14px;
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
/* === Responsive === */
@media (max-width: 768px) {
  .guide-card,
  .seasonal-section {
    flex-direction: column !important;
    text-align: center;
  }

  .guide-card img,
  .seasonal-right img {
    width: 100%;
    height: auto;
  }

  .seasonal-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .seasonal-right img {
    width: 100%;
    max-width: 280px;
    height: auto;
    transform: none;
    margin-top: 20px;
  }
}
</style>
