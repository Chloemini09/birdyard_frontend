<template>
  <div class="layout-page-container">
    <!-- Banner Section -->
    <section class="layout-banner">
      <div class="banner-overlay">
        <h1 class="layout-title">DESIGN YOUR WELCOMING BACKYARD</h1>
        <p class="layout-subtitle">
          "Australia is home to over 800 native bird species, but nearly 1 in 6 are now threatened.
          Even a small backyard with native plants can support up to 30 local species – helping
          native ecosystems one garden at a time."
        </p>

        <!-- State Selector -->
        <div class="state-selector">
          <span>Currently designing for: </span>
          <select v-model="selectedState" @change="updateState">
            <option value="Victoria">Victoria</option>
            <option value="Queensland">Queensland</option>
            <option value="South Australia">South Australia</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Layout Options Section -->
    <section class="layout-options">
      <div class="layout-info">
        <h2>Garden Layouts for {{ selectedState }}</h2>
        <p>Select a layout that works best for your backyard and local birds</p>

        <!-- Layout Cards Grid -->
        <div class="layout-grid">
          <div v-for="layout in filteredLayouts" :key="layout.id" class="layout-card">
            <img
              :src="require(`@/assets/images/layout/${layout.folder}/${layout.image}`)"
              :alt="layout.title"
            />
            <h3>{{ layout.title }}</h3>
            <p>{{ layout.shortDescription }}</p>
            <button @click="showDetails(layout)" class="see-more-btn">SEE MORE</button>

            <!-- Bird Icons -->
            <div class="bird-icons">
              <div v-for="bird in layout.birds" :key="bird.name" class="bird-icon">
                <img :src="require(`@/assets/images/birds/${bird.image}`)" :alt="bird.name" />
                <span>{{ bird.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Layout Details Modal (shown when See More is clicked) -->
    <div v-if="showModal" class="layout-modal">
      <!-- Modal content -->
    </div>

    <!-- Next Step Button -->
    <div class="next-step">
      <button @click="goToGardenGuide" class="guide-button">FIND BIRDS FOR YOUR GARDEN</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedState: 'Victoria',
      showModal: false,
      selectedLayout: null,
      layouts: [
        // Victoria layouts
        {
          id: 1,
          title: 'Berry Bird Bonanza',
          state: 'Victoria',
          folder: 'Berry Bird Bonanza',
          image: 'main.jpg',
          shortDescription: 'Cultivate a native fruit stand in your garden...',
          fullDescription: '...',
          howToBuild: [...],
          birds: [...]
        },
        // ... other layouts
      ]
    };
  },
  computed: {
    filteredLayouts() {
      return this.layouts.filter(layout => layout.state === this.selectedState);
    }
  },
  mounted() {
    // Get state from localStorage if available
    const savedState = localStorage.getItem('selectedState');
    if (savedState) {
      this.selectedState = savedState;
    }
  },
  methods: {
    updateState() {
      localStorage.setItem('selectedState', this.selectedState);
    },
    showDetails(layout) {
      this.selectedLayout = layout;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    goToGardenGuide() {
      this.$router.push('/gardenguide');
    }
  }
};
</script>
