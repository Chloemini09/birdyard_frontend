<template>
  <div class="layout-view">
    <section class="contact-banner">
      <div class="banner-overlay">
        <h1 class="contact-title">LAYOUT</h1>
        <p class="contact-subtitle">We'd love to hear from you about birds in your backyard</p>
      </div>
    </section>

    <div class="garden-list">
      <GardenCard
        v-for="(garden, index) in gardens"
        :key="index"
        :garden="garden"
        :onCardClick="showPopup"
      />
    </div>

    <GardenPopup :garden="selectedGarden" :onClose="closePopup" />
  </div>
</template>

<script>
import gardenData from '@/assets/data/garden_layouts_data_full.json'
import GardenCard from '@/assets/components/GardenCard.vue'
import GardenPopup from '@/assets/components/GardenPopup.vue'

export default {
  name: 'LayoutView',
  components: {
    GardenCard,
    GardenPopup,
  },
  data() {
    return {
      gardens: [],
      selectedGarden: null,
    }
  },
  mounted() {
    const selectedState = localStorage.getItem('selectedState')
    if (selectedState && gardenData[selectedState]) {
      this.gardens = gardenData[selectedState]
    }
  },
  methods: {
    showPopup(garden) {
      this.selectedGarden = garden
    },
    closePopup() {
      this.selectedGarden = null
    },
  },
}
</script>

<style scoped>
.layout-view {
  font-family: 'Arial', sans-serif;
  color: #333;
  padding-bottom: 40px;
}

.contact-banner {
  height: 40vh;
  min-height: 400px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('../assets/images/layout/Layout.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.banner-overlay {
  max-width: 800px;
  padding: 0 20px;
}

.contact-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #f3f9c0;
}

.contact-subtitle {
  font-size: 1.2rem;
  color: #fff;
  line-height: 1.6;
}

.garden-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  padding: 40px 20px;
}

@media (max-width: 768px) {
  .contact-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .contact-title {
    font-size: 2rem;
  }

  .contact-subtitle {
    font-size: 1rem;
  }

  .contact-banner {
    min-height: 250px;
  }
}
</style>
