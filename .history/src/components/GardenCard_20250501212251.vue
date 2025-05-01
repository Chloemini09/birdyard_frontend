<template>
  <div class="garden-card" @click="openPopup">
    <div class="image-container">
      <img :src="mainImage" :alt="garden.name" />
    </div>
    <h3 class="garden-title">{{ garden.name }}</h3>
    <p class="garden-summary">{{ garden.summary }}</p>
    <div class="bird-preview">
      <div v-for="(bird, index) in garden.birds_attracted" :key="index" class="bird">
        <img :src="getBirdImage(bird.image)" :alt="bird.name" />
        <span>{{ bird.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GardenCard',
  props: {
    garden: {
      type: Object,
      required: true
    },
    onCardClick: {
      type: Function,
      required: true
    }
  },
  computed: {
    mainImage() {
      const imageName = this.garden.layout_images[0];
      return `/src/assets/images/layout/${this.garden.path}/${imageName}`;
    }
  },
  methods: {
    openPopup() {
      this.onCardClick(this.garden);
    },
    getBirdImage(filename) {
      // Updated: use same folder as layout image
      return `/src/assets/images/layout/${this.garden.path}/${filename}`;
    }
  }
};
</script>

<style scoped>
.garden-card {
  background: #fefefe;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: transform 0.3s;
  cursor: pointer;
  max-width: 340px;
}

.garden-card:hover {
  transform: translateY(-5px);
}

.image-container img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  height: 200px;
}

.garden-title {
  font-size: 1.5rem;
  margin: 12px 0 8px;
  color: #2c5530;
}

.garden-summary {
  font-size: 1rem;
  color: