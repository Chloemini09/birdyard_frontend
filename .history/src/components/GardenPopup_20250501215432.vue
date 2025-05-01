<template>
  <div v-if="garden" class="popup-overlay" @click.self="close">
    <div class="popup-content">
      <button class="close-btn" @click="close">&times;</button>
      <h2>{{ garden.name }}</h2>
      <p class="concept">{{ garden.concept }}</p>

      <section class="how-to">
        <h3>How to Build</h3>
        <ul>
          <li v-for="(step, index) in garden.how_to_build" :key="index">{{ step }}</li>
        </ul>
      </section>

      <section class="gallery">
        <h3>Garden Layout</h3>
        <div class="gallery-images">
          <img
            v-for="(img, idx) in garden.layout_images"
            :key="idx"
            :src="`/src/assets/images/layout/${garden.path}/${img}`"
            :alt="garden.name + ' image ' + idx"
          />
        </div>
      </section>

      <section class="birds">
        <h3>Birds Attracted</h3>
        <div class="bird-list">
          <div v-for="(bird, index) in garden.birds_attracted" :key="index" class="bird-entry">
            <img :src="`/src/assets/images/layout/${garden.path}/${bird.image}`" :alt="bird.name" />
            <span>{{ bird.name }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GardenPopup',
  props: {
    garden: {
      type: Object,
      required: false,
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-content {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
}

.concept {
  font-style: italic;
  margin-bottom: 16px;
}

.how-to ul {
  padding-left: 1.2rem;
  list-style-type: disc;
  margin-bottom: 24px;
}

.gallery-images {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.gallery-images img {
  width: 45%;
  border-radius: 12px;
  object-fit: cover;
}

.bird-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.bird-entry {
  text-align: center;
  width: 80px;
}

.bird-entry img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 6px;
  border: 2px solid #ccc;
}
</style>
