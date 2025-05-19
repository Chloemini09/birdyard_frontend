<template>
  <section class="hero">
    <div class="container">
      <h1>Bird Nesting & Shelter Guide</h1>
      <p class="subtitle">Create safe and inviting nesting spaces for your local bird species</p>
    </div>
  </section>

  <div class="guide-container">
    <div class="selector-section">
      <label for="birdType">Choose a Bird Type:</label>
      <select id="birdType" v-model="selectedBird">
        <option disabled value="">-- Select --</option>
        <option v-for="type in birdTypes" :key="type">{{ type }}</option>
      </select>
    </div>

    <div class="recommendation-card" v-if="selectedBird">
      <img :src="getImageForBird(selectedBird)" :alt="selectedBird" />
      <div class="info">
        <h2>{{ selectedBird }} Shelter Tips</h2>
        <ul>
          <li v-for="(tip, index) in getTipsForBird(selectedBird)" :key="index">🐦 {{ tip }}</li>
        </ul>
      </div>
    </div>
  </div>

  <section class="bird-gallery">
    <h2>Explore Common Backyard Birds</h2>
    <p>
      Get to know the species you're helping! These birds are frequently found nesting in Australian
      gardens.
    </p>
    <div class="bird-grid">
      <div class="bird-card" v-for="(bird, i) in galleryBirds" :key="i">
        <img :src="bird.img" :alt="bird.name" />
        <h3>{{ bird.name }}</h3>
        <p>{{ bird.desc }}</p>
      </div>
    </div>
  </section>

  <section class="cta-section">
    <p class="cta-section-info">Is there any birds in your garden?</p>
    <router-link to="/bio" class="btn btn-large">To see where is your bird!</router-link>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const selectedBird = ref('Small Garden Birds')

const birdTypes = ['Small Garden Birds', 'Parrots & Lorikeets', 'Hollow Nesters', 'Ground Nesters']

const birdTips = {
  'Small Garden Birds': [
    'Use small birdhouses with entry holes around 2.5–3 cm to match the body size of species like wrens and finches.',
    'Install birdhouses at least 2 meters off the ground to prevent disturbance from pets and predators.',
    'Avoid direct sun and face the entrance away from prevailing winds (e.g., southeast in Australia) to maintain a stable internal temperature.',
    'Add soft bedding like untreated straw or dry grass inside the shelter to encourage nesting behavior.',
    'Position birdhouses near native shrubs to provide a natural food source and quick cover from threats.',
  ],
  'Parrots & Lorikeets': [
    'Provide larger nest boxes (30–40 cm tall) with reinforced lids, as parrots may chew soft timber.',
    'Mount nest boxes in tall trees 3–5 meters high with firm anchoring to avoid swaying in wind.',
    'Line the box with wood shavings and ensure nearby food like nectar-producing plants is abundant.',
    'Offer shallow water dishes or misting spots during summer to meet hydration needs.',
    'Avoid overcrowding multiple nest boxes in one tree to reduce territorial aggression.',
  ],
  'Hollow Nesters': [
    'Install artificial hollows made of hardwood or PVC pipe lined with sawdust to mimic natural tree hollows.',
    'Avoid trimming large, mature trees with existing hollows—they are critical for nesting owls, rosellas, and possums.',
    'Keep these hollows shaded throughout the day, ideally on the southern or eastern sides.',
    'Place hollows away from high foot traffic or playgrounds to prevent disturbance.',
    'Ensure the hollow has a small drainage hole and is cleaned once a year post-breeding season.',
  ],
  'Ground Nesters': [
    'Leave undisturbed ground zones with mulch, leaf litter, or native grasses for birds like lapwings or quail.',
    'Avoid mowing open areas during spring/summer breeding months; flag known nesting zones.',
    'Create perimeter cover using lomandra, tea trees, or hakea shrubs to offer camouflage from predators.',
    'Place shallow dishes of clean water near ground-level nesting zones with pebbles inside for safe perching.',
    'Educate family or community members to avoid stepping on or disturbing camouflaged nests.',
  ],
}

const getTipsForBird = (bird) => birdTips[bird] || []

const getImageForBird = (bird) => {
  const map = {
    'Small Garden Birds': '/images/Nesting/SmallGardenBirdswebp.webp',
    'Parrots & Lorikeets': '/images/Nesting/Parrots&Lorikeets.webp',
    'Hollow Nesters': '/images/Nesting/HollowNesters.jpg',
    'Ground Nesters': '/images/Nesting/GroundNesters.jpg',
  }
  return map[bird] || '/images/Nesting/woodland.jpg'
}

const galleryBirds = [
  {
    name: 'Superb Fairywren',
    img: '/images/Nesting/SuperbFairywren.jpg',
    desc: 'A small, active bird often seen flitting through shrubs. Prefers low, dense vegetation for nesting.',
  },
  {
    name: 'Rainbow Lorikeet',
    img: '/images/Nesting/RainbowLorikeet.jpg',
    desc: 'Colourful and loud, these nectar-loving birds nest in tree hollows and feed on flowering gums.',
  },
  {
    name: 'Eastern Rosella',
    img: '/images/Nesting/EasternRosella.jpg',
    desc: 'Brightly feathered ground-forager. Uses large tree hollows or elevated nest boxes.',
  },
]
</script>

<style scoped>
:global(body) {
  background-color: #f9f7f0;
}

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

.guide-container {
  background-color: #f9f7f0;
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.selector-section {
  margin-bottom: 30px;
  font-size: 1rem;
}

.selector-section label {
  font-weight: bold;
}

.selector-section select {
  padding: 8px 12px;
  border-radius: 6px;
  margin-left: 10px;
  font-size: 1rem;
}

.recommendation-card {
  display: flex;
  align-items: stretch;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  padding: 20px;
  gap: 20px;
}

.recommendation-card img {
  width: 240px;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.recommendation-card .info {
  flex: 1;
}

.recommendation-card ul {
  padding-left: 20px;
  list-style: none;
  line-height: 1.6;
}
.bird-gallery {
  padding: 60px 20px;
  text-align: center;
  max-width: 1000px;
  margin: 0 auto;
  background-color: transparent;
}

.bird-gallery h2 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #0a3200;
}

.bird-gallery p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 30px;
}

.bird-grid {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 16px;
  margin-top: 30px;
}
.bird-card {
  flex: 0 0 300px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}
.bird-card img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 12px;
}
.cta-section {
  padding: 40px 0;
  text-align: center;
  background-color: #f9f7f0;
}
.cta-section-info {
  font-size: 1.2rem;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 20px;
}
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
}
.btn-large {
  padding: 15px 30px;
  font-size: 18px;
  background-color: rgba(194, 229, 156, 0.9);
  color: #0a3200;
  border: 2px solid #c2e59c;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
</style>
