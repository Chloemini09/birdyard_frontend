<template>
  <div class="bird-detection-container">
    <!-- Hero Section with Overlay Text -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Your Backyard Endangered Birds Identified With Precision</h1>
        <p class="hero-subtitle">
          Discover the beauty of your garden visitors - where every identified bird brings you
          closer to nature.
        </p>

        <div class="features-list">
          <div class="feature-item">
            <span class="feature-icon">✓</span> Instant Endangered Bird Species Recognition
          </div>
          <div class="feature-item">
            <span class="feature-icon">✓</span> High Accuracy Detection Technology
          </div>
          <div class="feature-item">
            <span class="feature-icon">✓</span> Personalized Garden Recommendations
          </div>
        </div>
        <p class="tip">Please upload only bird pictures</p>
        <!-- Upload Button as Main CTA -->
        <label for="upload" class="upload-button">
          <span v-if="!isLoading">Upload Image Now!</span>
          <span v-else>Processing...</span>
          <input
            type="file"
            id="upload"
            accept="image/*"
            @change="handleFileUpload"
            :disabled="isLoading"
          />
        </label>
      </div>
    </section>

    <!-- Detection Results Modal (replaces the results section) -->
    <div v-if="previewUrl" class="detection-modal-overlay" @click="closeDetectionModal">
      <div class="detection-modal" @click.stop>
        <button class="modal-close-button" @click="closeDetectionModal">&times;</button>

        <div class="detection-modal-content">
          <div class="detection-grid">
            <!-- Image Preview Column -->
            <div class="detection-image-column">
              <div class="detection-preview-wrapper">
                <img
                  :src="previewUrl"
                  alt="Bird image preview"
                  class="detection-preview-image"
                  ref="previewImage"
                />
                <div v-if="result" class="detection-box" :style="getBoundingBoxStyle()"></div>
              </div>
            </div>

            <!-- Results Column -->
            <div class="detection-details-column">
              <div v-if="result" class="detection-results-card">
                <h2 class="detection-heading">Detection Results</h2>
                <div class="detection-result-item">
                  <span class="detection-result-label">Species:</span>
                  <span class="detection-result-value">{{ result.class_name }}</span>
                </div>
                <div class="detection-result-item">
                  <span class="detection-result-label">Confidence: </span>
                  <span class="detection-result-value"
                    >{{ (result.confidence * 100).toFixed(2) }}%</span
                  >
                </div>
                <p class="detection-description">We've detected this bird species in your image.</p>
              </div>

              <div v-else-if="isLoading" class="detection-processing-message">
                <div class="loading-spinner"></div>
                <p>Analyzing your image...</p>
                <p class="processing-subtext">
                  Our AI is identifying bird species and characteristics
                </p>
              </div>

              <div v-else class="detection-upload-success-message">
                <h3>Image uploaded successfully!</h3>
                <p>We're analyzing your photo to identify the bird species.</p>
              </div>

              <div v-if="error" class="detection-error-message">
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Endangered Birds Section (NEW) -->
    <section class="endangered-birds-section">
      <div class="section-container">
        <h2 class="section-title">Endangered Australian Birds</h2>
        <p class="section-subtitle">
          Discover these rare and threatened species that need our protection. Swipe to learn more
          about each bird.
        </p>

        <!-- State Filter Buttons -->
        <div class="state-filter-container">
          <div class="state-filter-label">Endangered Birds in State:</div>
          <div class="state-filter-buttons">
            <button
              class="state-filter-button"
              :class="{ active: selectedState === 'South Australia' }"
              @click="setStateFilter('South Australia')"
            >
              South Australia
            </button>
            <button
              class="state-filter-button"
              :class="{ active: selectedState === 'Victoria' }"
              @click="setStateFilter('Victoria')"
            >
              Victoria
            </button>
            <button
              class="state-filter-button"
              :class="{ active: selectedState === 'Queensland' }"
              @click="setStateFilter('Queensland')"
            >
              Queensland
            </button>
            <button
              class="state-filter-button"
              :class="{ active: selectedState === 'Other' }"
              @click="setStateFilter('Other')"
            >
              Other Regions
            </button>
          </div>
        </div>

        <!-- Horizontal Scrolling Bird Cards -->
        <div class="bird-cards-scrollable-container">
          <div class="bird-cards-container">
            <div
              v-for="bird in filteredBirds"
              :key="bird.id"
              class="bird-card"
              @click="selectBird(bird)"
            >
              <div class="bird-card-image-container">
                <div class="bird-status-badge" :class="getStatusClass(bird.status)">
                  {{ getStatusShort(bird.status) }}
                </div>
                <img :src="getBirdImagePath(bird.image)" :alt="bird.name" class="bird-card-image" />
              </div>
              <div class="bird-card-content">
                <h3 class="bird-card-title">{{ bird.name }}</h3>
                <p class="bird-card-scientific-name">{{ bird.scientificName }}</p>
                <p class="bird-card-description">{{ truncateText(bird.overview, 100) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bird Details Modal -->
        <div v-if="selectedBird" class="bird-modal-overlay" @click="closeModal">
          <div class="bird-modal" @click.stop>
            <button class="modal-close-button" @click="closeModal">&times;</button>

            <div class="bird-modal-header">
              <div class="bird-modal-image-container">
                <img
                  :src="getBirdImagePath(selectedBird.image)"
                  :alt="selectedBird.name"
                  class="bird-modal-image"
                />
                <div class="bird-status-badge-large" :class="getStatusClass(selectedBird.status)">
                  {{ selectedBird.status }}
                </div>
              </div>

              <div class="bird-modal-title-container">
                <h2 class="bird-modal-title">{{ selectedBird.name }}</h2>
                <p class="bird-modal-scientific-name">{{ selectedBird.scientificName }}</p>
                <p class="bird-modal-family">Family: {{ selectedBird.family }}</p>
              </div>
            </div>

            <div class="bird-modal-content">
              <div class="bird-info-section">
                <h3 class="bird-info-title">Overview</h3>
                <p>{{ selectedBird.overview }}</p>
              </div>

              <div class="bird-info-grid">
                <div class="bird-info-column">
                  <div class="bird-info-section">
                    <h3 class="bird-info-title">Physical Characteristics</h3>
                    <div class="bird-info-list">
                      <div class="bird-info-item">
                        <span class="bird-info-label">Size:</span>
                        <span class="bird-info-value">{{
                          selectedBird.size || 'Not specified'
                        }}</span>
                      </div>
                      <div class="bird-info-item">
                        <span class="bird-info-label">Weight:</span>
                        <span class="bird-info-value">{{
                          selectedBird.weight || 'Not specified'
                        }}</span>
                      </div>
                      <div class="bird-info-item">
                        <span class="bird-info-label">Identification:</span>
                        <span class="bird-info-value">{{ selectedBird.identification }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="bird-info-section">
                    <h3 class="bird-info-title">Habitat & Location</h3>
                    <div class="bird-info-list">
                      <div class="bird-info-item">
                        <span class="bird-info-label">Habitat:</span>
                        <span class="bird-info-value">{{ selectedBird.habitat.join(', ') }}</span>
                      </div>
                      <div class="bird-info-item">
                        <span class="bird-info-label">Location:</span>
                        <span class="bird-info-value">{{ selectedBird.location }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bird-info-column">
                  <div class="bird-info-section">
                    <h3 class="bird-info-title">Behaviour & Diet</h3>
                    <div class="bird-info-list">
                      <div class="bird-info-item">
                        <span class="bird-info-label">Behaviour:</span>
                        <span class="bird-info-value">{{ selectedBird.behaviour }}</span>
                      </div>
                      <div class="bird-info-item">
                        <span class="bird-info-label">Feeding:</span>
                        <span class="bird-info-value">{{ selectedBird.feeding }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="bird-info-section">
                    <h3 class="bird-info-title">Conservation</h3>
                    <div class="bird-info-list">
                      <div class="bird-info-item">
                        <span class="bird-info-label">Threats:</span>
                        <ul class="threats-list">
                          <li v-for="(risk, index) in selectedBird.risks" :key="index">
                            {{ risk }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bird-conservation-cta">
                <a
                  href="https://birdlife.org.au/campaign/nature-laws/"
                  target="_blank"
                  class="conservation-button"
                >
                  Help Protect These Birds
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import endangeredBirdsData from '@/assets/data/endangered-birds.json'

export default {
  name: 'BirdDetection',
  setup() {
    const previewUrl = ref('')
    const result = ref(null)
    const error = ref('')
    const isLoading = ref(false)
    const previewImage = ref(null)
    const endangeredBirds = ref([])
    const selectedBird = ref(null)
    const selectedState = ref('Victoria')

    onMounted(() => {
      endangeredBirds.value = endangeredBirdsData

      // Get default state from localStorage
      const storedState = localStorage.getItem('selectedState')
      if (
        storedState &&
        ['Victoria', 'South Australia', 'Queensland', 'Other'].includes(storedState)
      ) {
        selectedState.value = storedState
      } else {
        // default Victoria
        selectedState.value = 'Victoria'
        localStorage.setItem('selectedState', 'Victoria')
      }
    })

    // Filter birds based on selected state
    const filteredBirds = computed(() => {
      return endangeredBirds.value.filter((bird) => {
        const locations = bird.location.split(',').map((loc) => loc.trim())
        return locations.includes(selectedState.value)
      })
    })

    // Set state filter and save to localStorage
    const setStateFilter = (state) => {
      selectedState.value = state
      localStorage.setItem('selectedState', state)
    }

    /**
     * Upload image for bird species detection
     * @param {File} imageFile - Image file object from input[type=file]
     * @returns {Promise<Object>} Detection result with bird species name, confidence, bounding box, etc.
     */
    const detectBirdFromImage = async (imageFile) => {
      if (!imageFile || !(imageFile instanceof File)) {
        const errorMsg = 'Invalid image file provided. Please select a valid image.'
        console.error(errorMsg)
        throw new Error(errorMsg)
      }

      try {
        const formData = new FormData()
        formData.append('file', imageFile)

        const apiUrl =
          'https://e5df629i4k.execute-api.us-east-1.amazonaws.com/birdDetection/predict'

        // Configure CORS settings
        const response = await axios.post(apiUrl, formData, {
          withCredentials: false,
        })

        console.log('API Response Status:', response.status)
        console.log('API Response Data:', response.data)

        // Return the first detection if available
        if (response.data && response.data.detections && response.data.detections.length > 0) {
          return response.data.detections[0]
        } else {
          throw new Error('No birds detected in the image. Please try with a clearer photo.')
        }
      } catch (error) {
        console.error('Error calling bird detection API:', error)
        if (error.response) {
          console.error('Error Response Data:', error.response.data)
          console.error('Error Response Status:', error.response.status)
        } else if (error.request) {
          console.error(
            'No response received from server. Please check your internet connection and try again.',
          )
        } else {
          console.error('Error Message:', error.message)
        }
        throw error
      }
    }

    const handleFileUpload = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      // Clear previous results
      result.value = null
      error.value = ''

      // Show preview
      previewUrl.value = URL.createObjectURL(file)

      // Start detection process
      const img = new Image()
      img.onload = async () => {
        try {
          isLoading.value = true
          const detectionResult = await detectBirdFromImage(file)
          result.value = detectionResult
        } catch (err) {
          error.value = err.message || 'Detection failed. Please try again with a different image.'
          console.error(err)
        } finally {
          isLoading.value = false
        }
      }
      img.src = previewUrl.value

      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden'
    }

    const closeDetectionModal = () => {
      previewUrl.value = ''
      result.value = null
      error.value = ''
      document.body.style.overflow = '' // Restore scrolling
    }

    const getBoundingBoxStyle = () => {
      if (!result.value || !result.value.bounding_box) return {}

      // Use bounding box coordinates from API response
      const [x, y, width, height] = result.value.bounding_box

      // Get preview image dimensions
      const imgElement = previewImage.value
      if (!imgElement) return {}

      // Calculate relative position (percentage)
      const boxStyle = {
        left: `${(x / imgElement.naturalWidth) * 100}%`,
        top: `${(y / imgElement.naturalHeight) * 100}%`,
        width: `${(width / imgElement.naturalWidth) * 100}%`,
        height: `${(height / imgElement.naturalHeight) * 100}%`,
      }

      return boxStyle
    }

    // Endangered birds section functions
    const getBirdImagePath = (filename) => {
      return new URL(`../assets/images/${filename}`, import.meta.url).href
    }

    const truncateText = (text, maxLength) => {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.slice(0, maxLength) + '...'
    }

    const getStatusClass = (status) => {
      if (status.includes('Critically')) return 'status-critical'
      if (status.includes('Endangered')) return 'status-endangered'
      if (status.includes('Vulnerable')) return 'status-vulnerable'
      return 'status-default'
    }

    const getStatusShort = (status) => {
      if (status.includes('Critically')) return 'CR'
      if (status.includes('Endangered')) return 'EN'
      if (status.includes('Vulnerable')) return 'VU'
      return status
    }

    const selectBird = (bird) => {
      selectedBird.value = bird
      document.body.style.overflow = 'hidden' // Prevent scrolling when modal is open
    }

    const closeModal = () => {
      selectedBird.value = null
      document.body.style.overflow = '' // Restore scrolling
    }

    return {
      previewUrl,
      result,
      error,
      isLoading,
      handleFileUpload,
      getBoundingBoxStyle,
      previewImage,
      endangeredBirds,
      filteredBirds,
      selectedBird,
      selectedState,
      getBirdImagePath,
      truncateText,
      getStatusClass,
      getStatusShort,
      selectBird,
      closeModal,
      closeDetectionModal,
      setStateFilter,
    }
  },
}
</script>

<style scoped>
.bird-detection-container {
  font-family: 'Arial', sans-serif;
  color: #333;
  max-height: 600px;
}

/* Hero Section Styles */
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 500px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/images/birds-bg.jpeg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 10%;
}

.hero-content {
  max-width: 600px;
  color: #f0f0f0;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #f3f9c0;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.features-list {
  margin-bottom: 2.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
}

.feature-icon {
  color: #f3f9c0;
  margin-right: 10px;
  font-weight: bold;
}
.tip {
  font-size: 1rem;
  margin-bottom: 20px;
}
.upload-button {
  display: inline-block;
  background-color: #f3f9c0;
  color: #1a2d00;
  font-weight: 600;
  padding: 15px 30px;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-align: center;
}

.upload-button:hover {
  background-color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.upload-button input {
  display: none;
}

/* Detection Modal Styles */
.detection-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.detection-modal {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalFadeIn 0.3s ease;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.detection-modal-content {
  padding: 30px;
}

.detection-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.detection-image-column {
  position: relative;
}

.detection-preview-wrapper {
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
}

.detection-preview-image {
  width: 100%;
  display: block;
}

.detection-details-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.detection-results-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.detection-heading {
  color: #1a2d00;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f3f9c0;
  padding-bottom: 0.5rem;
}

.detection-result-item {
  margin-bottom: 2rem;
  font-size: 1.1rem;
  min-width: 100px;
}

.detection-result-label {
  font-weight: 600;
  color: #555;
  display: inline-block;
  width: 100px;
}

.detection-result-value {
  font-weight: 500;
  color: #1a2d00;
}

.detection-description {
  margin: 1.5rem 0;
  color: #666;
  line-height: 1.6;
}

.detection-processing-message {
  text-align: center;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.detection-upload-success-message {
  text-align: center;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.detection-upload-success-message h3 {
  color: #1a2d00;
  margin-bottom: 1rem;
}

.detection-error-message {
  margin-top: 20px;
  color: #fff;
  background-color: #ff6b6b;
  padding: 15px 30px;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
}

/* State Filter Styles */
.state-filter-container {
  margin-bottom: 30px;
  text-align: center;
}

.state-filter-label {
  font-size: 1.1rem;
  color: #1a2d00;
  margin-bottom: 15px;
  font-weight: 600;
}

.state-filter-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.state-filter-button {
  padding: 8px 16px;
  background-color: #f2f2f2;
  border: 2px solid transparent;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #555;
  transition: all 0.3s ease;
}

.state-filter-button:hover {
  background-color: #e6e6e6;
  color: #333;
}

.state-filter-button.active {
  background-color: #1a2d00;
  color: #f3f9c0;
  border-color: #1a2d00;
}

/* Endangered Birds Section Styles */
.endangered-birds-section {
  padding: 80px 0 100px;
  background-color: #f2f7e5;
}

.section-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 2.5rem;
  color: #1a2d00;
  text-align: center;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.bird-cards-scrollable-container {
  overflow-x: auto;
  padding: 20px 10px;
  margin: 0 -10px;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  scrollbar-width: thin; /* Firefox */
}

.bird-cards-scrollable-container::-webkit-scrollbar {
  height: 8px;
}

.bird-cards-scrollable-container::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 10px;
}

.bird-cards-scrollable-container::-webkit-scrollbar-thumb {
  background: #c5d6a2;
  border-radius: 10px;
}

.bird-cards-scrollable-container::-webkit-scrollbar-thumb:hover {
  background: #92ab6e;
}

.bird-cards-container {
  display: flex;
  gap: 25px;
  padding: 10px 5px;
  width: max-content;
}

.bird-card {
  width: 300px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.bird-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.bird-card-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.bird-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.bird-card:hover .bird-card-image {
  transform: scale(1.05);
}

.bird-status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  z-index: 1;
}

.status-critical {
  background-color: #d9534f;
}

.status-endangered {
  background-color: #f0ad4e;
}

.status-vulnerable {
  background-color: #5bc0de;
}

.status-default {
  background-color: #5cb85c;
}

.bird-card-content {
  padding: 20px;
}

.bird-card-title {
  font-size: 1.3rem;
  color: #1a2d00;
  margin-bottom: 5px;
}

.bird-card-scientific-name {
  font-style: italic;
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.bird-card-description {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Bird Modal Styles */
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

.bird-modal-header {
  display: flex;
  background-color: #f2f7e5;
  padding: 30px;
  border-radius: 10px 10px 0 0;
  gap: 30px;
}

.bird-modal-image-container {
  position: relative;
  flex: 0 0 300px;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.bird-modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bird-status-badge-large {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
}

.bird-modal-title-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.bird-modal-title {
  font-size: 2.5rem;
  color: #1a2d00;
  margin-bottom: 10px;
}

.bird-modal-scientific-name {
  font-style: italic;
  color: #555;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.bird-modal-family {
  color: #777;
  font-size: 1rem;
}

.bird-modal-content {
  padding: 30px;
}

.bird-info-section {
  margin-bottom: 30px;
}

.bird-info-title {
  font-size: 1.4rem;
  color: #1a2d00;
  margin-bottom: 15px;
  border-bottom: 2px solid #f3f9c0;
  padding-bottom: 5px;
  display: inline-block;
}

.bird-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.bird-info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bird-info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.bird-info-label {
  font-weight: 600;
  color: #555;
  font-size: 1rem;
}

.bird-info-value {
  color: #333;
  line-height: 1.6;
  font-size: 0.95rem;
}

.threats-list {
  margin: 5px 0 0 20px;
  padding: 0;
}

.threats-list li {
  margin-bottom: 5px;
  color: #333;
}

.bird-conservation-cta {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

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

.conservation-button:hover {
  background-color: #2c4b00;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Subscription Section */
.subscription-section {
  padding: 80px 10%;
  background-color: #1a2d00;
  color: #fff;
  text-align: center;
}

.subscription-content {
  max-width: 700px;
  margin: 0 auto;
}

.subscription-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #f3f9c0;
}

.subscription-subtitle {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  color: #f0f0f0;
}

.subscription-form {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .detection-grid {
    grid-template-columns: 1fr;
  }

  .bird-modal-header {
    flex-direction: column;
    align-items: center;
  }

  .bird-modal-image-container {
    flex: 0 0 auto;
    width: 100%;
    max-width: 300px;
  }

  .bird-modal-title-container {
    text-align: center;
  }

  .bird-info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 0 5%;
    text-align: center;
    justify-content: center;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .feature-item {
    justify-content: center;
  }

  .bird-card {
    width: 260px;
  }

  .bird-card-image-container {
    height: 180px;
  }
}

@media (max-width: 480px) {
  .bird-card {
    width: 220px;
  }

  .bird-card-image-container {
    height: 150px;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>
