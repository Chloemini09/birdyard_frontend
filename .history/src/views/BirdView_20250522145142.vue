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
                <button class="try-again-button" @click="resetAndUpload">Try Again</button>
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
          <p class="state-filter-info">
            <span class="status-label en">EN</span>: ENDANGERED
            <span class="status-label vu">VU</span>: VULNERABLE
            <span class="status-label cr">CR</span>: CRITICALLY ENDANGERED
          </p>
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
      <router-link to="/learninghub" class="btn btn-large">To see more resources!</router-link>
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

    const resetAndUpload = () => {
      // Clear error and results
      error.value = ''
      result.value = null

      // Close the current modal
      closeDetectionModal()

      // Trigger the file input click
      document.getElementById('upload').click()
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
      resetAndUpload,
    }
  },
}
</script>

<style scoped>
.bird-detection-container {
  font-family: 'Arial', sans-serif;
  color: #333;
}

/* Hero Section Styles */
.hero-section {
  position: relative;
  height: 100vh;
  max-height: 700px;
  background-image:
    linear-gradient(135deg, rgba(26, 45, 0, 0.7), rgba(0, 0, 0, 0.4)),
    url('@/assets/images/birds-bg.jpeg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 8%;
  margin-top: 35px;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(243, 249, 192, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(194, 229, 156, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  max-width: 650px;
  color: #f0f0f0;
  position: relative;
  z-index: 2;
  backdrop-filter: blur(1px);
  background: rgba(255, 255, 255, 0.05);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.hero-title {
  font-size: 3.2rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #f3f9c0;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.3rem;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.features-list {
  margin-bottom: 2.5rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 25px;
  border-radius: 15px;
  border-left: 4px solid #f3f9c0;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.95);
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateX(5px);
}

.feature-item:last-child {
  margin-bottom: 0;
}

.feature-icon {
  color: #f3f9c0;
  margin-right: 15px;
  font-weight: bold;
  font-size: 1.2rem;
  background: rgba(243, 249, 192, 0.2);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tip {
  font-size: 1.05rem;
  margin-bottom: 25px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  font-style: italic;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px dashed rgba(243, 249, 192, 0.3);
}

.upload-button {
  display: inline-block;
  background: linear-gradient(135deg, #f3f9c0 0%, #e8f5a3 100%);
  color: #1a2d00;
  font-weight: 700;
  padding: 18px 40px;
  border-radius: 50px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.4s ease;
  border: none;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.upload-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.upload-button:hover::before {
  left: 100%;
}

.upload-button:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f3f9c0 100%);
  transform: translateY(-3px) scale(1.02);
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.upload-button:active {
  transform: translateY(-1px) scale(1.01);
}

/* Enhanced Detection Modal Styles */
.detection-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(26, 45, 0, 0.85) 0%, rgba(0, 0, 0, 0.9) 100%);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: overlayFadeIn 0.4s ease;
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
}

.detection-modal {
  background: linear-gradient(145deg, #ffffff 0%, #f8fdf0 100%);
  border-radius: 20px;
  width: 90%;
  max-width: 1300px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(243, 249, 192, 0.2);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.detection-modal-content {
  padding: 40px;
  background:
    radial-gradient(circle at top right, rgba(243, 249, 192, 0.05) 0%, transparent 50%),
    radial-gradient(circle at bottom left, rgba(194, 229, 156, 0.03) 0%, transparent 50%);
}

.detection-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: center;
}

.detection-image-column {
  position: relative;
}

.detection-preview-wrapper {
  position: relative;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(243, 249, 192, 0.2);
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(145deg, #ffffff, #f8fdf0);
  transform: perspective(1000px) rotateY(-2deg);
  transition: transform 0.3s ease;
}

.detection-preview-wrapper:hover {
  transform: perspective(1000px) rotateY(0deg);
}

.detection-preview-image {
  width: 100%;
  display: block;
  transition: transform 0.3s ease;
}

.detection-box {
  position: absolute;
  border: 3px solid #f3f9c0;
  background: rgba(243, 249, 192, 0.1);
  box-shadow:
    0 0 0 2px rgba(26, 45, 0, 0.8),
    inset 0 0 20px rgba(243, 249, 192, 0.2);
  border-radius: 8px;
  animation: detectionPulse 2s infinite;
}

@keyframes detectionPulse {
  0%,
  100% {
    box-shadow:
      0 0 0 2px rgba(26, 45, 0, 0.8),
      inset 0 0 20px rgba(243, 249, 192, 0.2);
  }
  50% {
    box-shadow:
      0 0 0 4px rgba(26, 45, 0, 1),
      inset 0 0 30px rgba(243, 249, 192, 0.4);
  }
}

.detection-details-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.detection-results-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8fdf0 100%);
  border-radius: 20px;
  padding: 40px;
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(243, 249, 192, 0.3);
  position: relative;
  overflow: hidden;
}

.detection-results-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f3f9c0, #c2e59c, #f3f9c0);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.detection-heading {
  color: #1a2d00;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  border-bottom: 3px solid #f3f9c0;
  padding-bottom: 0.8rem;
  position: relative;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.detection-result-item {
  margin-bottom: 2.5rem;
  font-size: 1.2rem;
  padding: 15px;
  background: rgba(243, 249, 192, 0.1);
  border-radius: 12px;
  border-left: 4px solid #c2e59c;
  transition: transform 0.2s ease;
}

.detection-result-item:hover {
  transform: translateX(5px);
  background: rgba(243, 249, 192, 0.15);
}

.detection-result-label {
  font-weight: 700;
  color: #555;
  display: block;
  margin-bottom: 5px;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.detection-result-value {
  font-weight: 600;
  color: #1a2d00;
  font-size: 1.3rem;
}

.detection-description {
  margin: 2rem 0;
  color: #666;
  line-height: 1.8;
  font-size: 1.1rem;
  padding: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  border: 1px dashed rgba(194, 229, 156, 0.4);
}

.detection-processing-message {
  text-align: center;
  padding: 50px;
  background: linear-gradient(145deg, #ffffff 0%, #f8fdf0 100%);
  border-radius: 20px;
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(243, 249, 192, 0.3);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(243, 249, 192, 0.3);
  border-top: 4px solid #f3f9c0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.detection-processing-message p {
  font-size: 1.2rem;
  color: #1a2d00;
  margin-bottom: 10px;
  font-weight: 600;
}

.processing-subtext {
  font-size: 1rem !important;
  color: #666 !important;
  font-weight: 400 !important;
}

.detection-upload-success-message {
  text-align: center;
  padding: 50px;
  background: linear-gradient(145deg, #ffffff 0%, #f8fdf0 100%);
  border-radius: 20px;
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(243, 249, 192, 0.3);
}

.detection-upload-success-message h3 {
  color: #1a2d00;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: 700;
}

.detection-error-message {
  margin-top: 25px;
  color: #fff;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  padding: 20px 35px;
  border-radius: 15px;
  font-weight: 600;
  text-align: center;
  box-shadow:
    0 10px 25px rgba(255, 107, 107, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-close-button {
  position: absolute;
  top: 20px;
  right: 25px;
  background: linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%);
  border: 2px solid rgba(0, 0, 0, 0.1);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  font-size: 1.8rem;
  color: #666;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modal-close-button:hover {
  background: linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 100%);
  color: #333;
  transform: scale(1.1);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

.try-again-button {
  display: inline-block;
  background: linear-gradient(135deg, #fff 0%, #f8f8f8 100%);
  color: #ff6b6b;
  font-weight: 700;
  padding: 12px 25px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
  margin-top: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.try-again-button:hover {
  background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Responsive Enhancements */
@media (max-width: 992px) {
  .hero-content {
    padding: 30px;
    max-width: 100%;
  }

  .hero-title {
    font-size: 2.8rem;
  }

  .detection-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .detection-preview-wrapper {
    transform: none;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 0 4%;
    text-align: center;
    justify-content: center;
    background-attachment: scroll;
  }

  .hero-content {
    padding: 25px;
    border-radius: 15px;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .upload-button {
    padding: 15px 30px;
    font-size: 1.1rem;
  }

  .detection-modal {
    width: 95%;
    border-radius: 15px;
  }

  .detection-modal-content {
    padding: 25px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }

  .hero-content {
    padding: 20px;
  }

  .detection-modal-content {
    padding: 20px;
  }
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
.state-filter-info {
  font-size: 1rem;
  color: #1a2d00;
  text-align: center;
  margin-top: 1rem;
}

.status-label {
  display: inline-block;
  padding: 0.3em 0.8em;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  margin-right: 0.3em;
}

.status-label.en {
  background-color: #f4a940;
}

.status-label.vu {
  background-color: #56c6e9;
}

.status-label.cr {
  background-color: #e84c4c;
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
.try-again-button {
  display: inline-block;
  background-color: #fff;
  color: #ff6b6b;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  margin-top: 15px;
}

.try-again-button:hover {
  background-color: #f3f3f3;
  transform: translateY(-2px);
}
.btn {
  display: block;
  margin: 0 auto;
  width: fit-content;
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
