<template>
  <div class="bird-detection-container">
    <!-- Modern Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="floating-elements">
          <div class="element element-1"></div>
          <div class="element element-2"></div>
          <div class="element element-3"></div>
        </div>
      </div>

      <div class="hero-content">
        <div class="hero-text">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            AI Bird Recognition
          </div>

          <h1 class="hero-title">
            Protect Endangered Birds
            <span class="highlight">With AI Precision</span>
          </h1>

          <p class="hero-description">
            Upload any bird photo and discover if it's an endangered species. Our advanced AI helps
            you contribute to wildlife conservation efforts.
          </p>

          <div class="hero-stats">
            <div class="stat">
              <div class="stat-number">99%</div>
              <div class="stat-label">Accuracy</div>
            </div>
            <div class="stat">
              <div class="stat-number">150+</div>
              <div class="stat-label">Species</div>
            </div>
            <div class="stat">
              <div class="stat-number">Real-time</div>
              <div class="stat-label">Detection</div>
            </div>
          </div>
        </div>

        <div class="hero-upload">
          <div class="upload-area">
            <div class="upload-icon">📸</div>
            <h3>Upload Bird Photo</h3>
            <p>Drag & drop or click to select</p>

            <label for="upload" class="upload-btn">
              <span v-if="!isLoading">Choose Photo</span>
              <span v-else class="loading-text">
                <div class="spinner"></div>
                Analyzing...
              </span>
              <input
                type="file"
                id="upload"
                accept="image/*"
                @change="handleFileUpload"
                :disabled="isLoading"
              />
            </label>

            <div class="upload-note">Supports: JPG, PNG, WEBP (Max 10MB)</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Results Modal -->
    <div v-if="previewUrl" class="modal-overlay" @click="closeDetectionModal">
      <div class="results-modal" @click.stop>
        <button class="close-btn" @click="closeDetectionModal">
          <span>×</span>
        </button>

        <div class="modal-content">
          <div class="image-section">
            <div class="image-container">
              <img
                :src="previewUrl"
                alt="Uploaded bird"
                class="uploaded-image"
                ref="previewImage"
              />
              <div v-if="result" class="detection-overlay" :style="getBoundingBoxStyle()">
                <div class="species-tag">{{ result.class_name }}</div>
              </div>
            </div>
          </div>

          <div class="results-section">
            <div v-if="result" class="success-results">
              <div class="result-icon">✅</div>
              <h2>Species Identified!</h2>

              <div class="species-info">
                <h3 class="species-name">{{ result.class_name }}</h3>
                <div class="confidence-section">
                  <div class="confidence-label">Confidence</div>
                  <div class="confidence-bar">
                    <div
                      class="confidence-fill"
                      :style="{ width: result.confidence * 100 + '%' }"
                    ></div>
                  </div>
                  <div class="confidence-value">{{ (result.confidence * 100).toFixed(1) }}%</div>
                </div>
              </div>

              <div class="action-buttons">
                <button class="btn btn-primary" @click="learnMore">Learn More</button>
                <button class="btn btn-secondary" @click="resetAndUpload">Try Another</button>
              </div>
            </div>

            <div v-else-if="isLoading" class="loading-results">
              <div class="ai-loader">
                <div class="loader-circle"></div>
                <div class="loader-pulse"></div>
              </div>
              <h3>AI Analysis in Progress</h3>
              <p>Examining your photo for bird species...</p>
            </div>

            <div v-else-if="error" class="error-results">
              <div class="error-icon">⚠️</div>
              <h3>Analysis Failed</h3>
              <p>{{ error }}</p>
              <button class="btn btn-retry" @click="resetAndUpload">Try Again</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Endangered Species Section -->
    <section class="species-section">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">Conservation</div>
          <h2 class="section-title">Endangered Australian Birds</h2>
          <p class="section-subtitle">
            These beautiful species need our protection. Learn about them and help with conservation
            efforts.
          </p>
        </div>

        <!-- Location Filter -->
        <div class="filter-section">
          <div class="filter-label">Filter by location:</div>
          <div class="filter-pills">
            <button
              v-for="state in ['Victoria', 'Queensland', 'South Australia', 'Other']"
              :key="state"
              class="filter-pill"
              :class="{ active: selectedState === state }"
              @click="setStateFilter(state)"
            >
              {{ state }}
              <span class="count">({{ getRegionCount(state) }})</span>
            </button>
          </div>
        </div>

        <!-- Species Grid -->
        <div class="species-grid">
          <div
            v-for="bird in filteredBirds"
            :key="bird.id"
            class="species-card"
            @click="selectBird(bird)"
          >
            <div class="card-image">
              <img :src="getBirdImagePath(bird.image)" :alt="bird.name" />
              <div class="status-badge" :class="getStatusClass(bird.status)">
                {{ getStatusShort(bird.status) }}
              </div>
              <div class="card-overlay">
                <button class="view-btn">View Details</button>
              </div>
            </div>

            <div class="card-content">
              <h3 class="bird-name">{{ bird.name }}</h3>
              <p class="scientific-name">{{ bird.scientificName }}</p>
              <p class="description">{{ truncateText(bird.overview, 100) }}</p>

              <div class="card-meta">
                <span class="location">📍 {{ getMainLocation(bird.location) }}</span>
                <span class="urgency" :class="getUrgencyClass(bird.status)">
                  {{ getUrgencyText(bird.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Species Detail Modal -->
    <div v-if="selectedBird" class="modal-overlay" @click="closeModal">
      <div class="detail-modal" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>

        <div class="modal-header">
          <div class="bird-image">
            <img :src="getBirdImagePath(selectedBird.image)" :alt="selectedBird.name" />
            <div class="status-overlay">
              <span class="status" :class="getStatusClass(selectedBird.status)">
                {{ selectedBird.status }}
              </span>
            </div>
          </div>

          <div class="bird-info">
            <h1>{{ selectedBird.name }}</h1>
            <p class="scientific">{{ selectedBird.scientificName }}</p>
            <p class="family">{{ selectedBird.family }}</p>

            <div class="quick-facts">
              <div class="fact">
                <span class="label">Size:</span>
                <span class="value">{{ selectedBird.size || 'Varies' }}</span>
              </div>
              <div class="fact">
                <span class="label">Weight:</span>
                <span class="value">{{ selectedBird.weight || 'Varies' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-body">
          <div class="content-grid">
            <div class="info-card">
              <h3>🏠 Habitat</h3>
              <p><strong>Environment:</strong> {{ selectedBird.habitat.join(', ') }}</p>
              <p><strong>Location:</strong> {{ selectedBird.location }}</p>
            </div>

            <div class="info-card">
              <h3>🎯 Behavior</h3>
              <p><strong>Behavior:</strong> {{ selectedBird.behaviour }}</p>
              <p><strong>Diet:</strong> {{ selectedBird.feeding }}</p>
            </div>

            <div class="info-card full-width">
              <h3>📝 Overview</h3>
              <p>{{ selectedBird.overview }}</p>
            </div>

            <div class="info-card">
              <h3>🔍 Identification</h3>
              <p>{{ selectedBird.identification }}</p>
            </div>

            <div class="info-card">
              <h3>⚠️ Threats</h3>
              <ul class="threats-list">
                <li v-for="risk in selectedBird.risks" :key="risk">{{ risk }}</li>
              </ul>
            </div>
          </div>

          <div class="conservation-cta">
            <h3>Help Protect This Species</h3>
            <div class="cta-buttons">
              <a
                href="https://birdlife.org.au/campaign/nature-laws/"
                target="_blank"
                class="btn btn-conservation"
              >
                Support Conservation
              </a>
              <button class="btn btn-share" @click="shareSpecies">Share</button>
              <button class="btn btn-report" @click="reportSighting">Report Sighting</button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      const storedState = localStorage.getItem('selectedState')
      if (
        storedState &&
        ['Victoria', 'South Australia', 'Queensland', 'Other'].includes(storedState)
      ) {
        selectedState.value = storedState
      } else {
        selectedState.value = 'Victoria'
        localStorage.setItem('selectedState', 'Victoria')
      }
    })

    const filteredBirds = computed(() => {
      return endangeredBirds.value.filter((bird) => {
        const locations = bird.location.split(',').map((loc) => loc.trim())
        return locations.includes(selectedState.value)
      })
    })

    const setStateFilter = (state) => {
      selectedState.value = state
      localStorage.setItem('selectedState', state)
    }

    const getRegionCount = (region) => {
      return endangeredBirds.value.filter((bird) => {
        const locations = bird.location.split(',').map((loc) => loc.trim())
        return locations.includes(region)
      }).length
    }

    const detectBirdFromImage = async (imageFile) => {
      if (!imageFile || !(imageFile instanceof File)) {
        throw new Error('Invalid image file provided. Please select a valid image.')
      }

      try {
        const formData = new FormData()
        formData.append('file', imageFile)
        const apiUrl =
          'https://e5df629i4k.execute-api.us-east-1.amazonaws.com/birdDetection/predict'
        const response = await axios.post(apiUrl, formData, { withCredentials: false })

        if (response.data && response.data.detections && response.data.detections.length > 0) {
          return response.data.detections[0]
        } else {
          throw new Error('No birds detected in the image. Please try with a clearer photo.')
        }
      } catch (error) {
        console.error('Error calling bird detection API:', error)
        throw error
      }
    }

    const handleFileUpload = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      result.value = null
      error.value = ''
      previewUrl.value = URL.createObjectURL(file)

      const img = new Image()
      img.onload = async () => {
        try {
          isLoading.value = true
          const detectionResult = await detectBirdFromImage(file)
          result.value = detectionResult
        } catch (err) {
          error.value = err.message || 'Detection failed. Please try again with a different image.'
        } finally {
          isLoading.value = false
        }
      }
      img.src = previewUrl.value
      document.body.style.overflow = 'hidden'
    }

    const closeDetectionModal = () => {
      previewUrl.value = ''
      result.value = null
      error.value = ''
      document.body.style.overflow = ''
    }

    const getBoundingBoxStyle = () => {
      if (!result.value || !result.value.bounding_box) return {}
      const [x, y, width, height] = result.value.bounding_box
      const imgElement = previewImage.value
      if (!imgElement) return {}

      return {
        left: `${(x / imgElement.naturalWidth) * 100}%`,
        top: `${(y / imgElement.naturalHeight) * 100}%`,
        width: `${(width / imgElement.naturalWidth) * 100}%`,
        height: `${(height / imgElement.naturalHeight) * 100}%`,
      }
    }

    const getBirdImagePath = (filename) => {
      return new URL(`../assets/images/${filename}`, import.meta.url).href
    }

    const truncateText = (text, maxLength) => {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.slice(0, maxLength) + '...'
    }

    const getStatusClass = (status) => {
      if (status.includes('Critically')) return 'critical'
      if (status.includes('Endangered')) return 'endangered'
      if (status.includes('Vulnerable')) return 'vulnerable'
      return 'default'
    }

    const getStatusShort = (status) => {
      if (status.includes('Critically')) return 'CR'
      if (status.includes('Endangered')) return 'EN'
      if (status.includes('Vulnerable')) return 'VU'
      return status
    }

    const getMainLocation = (location) => {
      return location.split(',')[0].trim()
    }

    const getUrgencyClass = (status) => {
      if (status.includes('Critically')) return 'urgent'
      if (status.includes('Endangered')) return 'high'
      return 'medium'
    }

    const getUrgencyText = (status) => {
      if (status.includes('Critically')) return 'Critical'
      if (status.includes('Endangered')) return 'Urgent'
      return 'Watch'
    }

    const selectBird = (bird) => {
      selectedBird.value = bird
      document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
      selectedBird.value = null
      document.body.style.overflow = ''
    }

    const resetAndUpload = () => {
      error.value = ''
      result.value = null
      closeDetectionModal()
      document.getElementById('upload').click()
    }

    const learnMore = () => {
      console.log('Learn more about:', result.value.class_name)
    }

    const shareSpecies = () => {
      console.log('Share species:', selectedBird.value.name)
    }

    const reportSighting = () => {
      console.log('Report sighting:', selectedBird.value.name)
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
      getMainLocation,
      getUrgencyClass,
      getUrgencyText,
      getRegionCount,
      selectBird,
      closeModal,
      closeDetectionModal,
      setStateFilter,
      resetAndUpload,
      learnMore,
      shareSpecies,
      reportSighting,
    }
  },
}
</script>

<style scoped>
/* Reset and Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.bird-detection-container {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  color: #1e293b;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a3200 0%, #1a5a0d 50%, #0a3200 100%);
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.floating-elements {
  position: absolute;
  inset: 0;
}

.element {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite linear;
}

.element-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.element-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 7s;
}

.element-3 {
  width: 80px;
  height: 80px;
  bottom: 30%;
  left: 60%;
  animation-delay: 14s;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  33% {
    transform: translateY(-30px) rotate(120deg);
    opacity: 0.6;
  }
  66% {
    transform: translateY(20px) rotate(240deg);
    opacity: 0.3;
  }
  100% {
    transform: translateY(0px) rotate(360deg);
    opacity: 0.3;
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  width: 100%;
}

.hero-text {
  color: white;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 2rem;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.highlight {
  display: block;
  color: #a3d977;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 3rem;
}

.hero-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  text-align: center;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #a3d977;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero-upload {
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-area {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px dashed #cbd5e1;
  border-radius: 2rem;
  padding: 3rem 2rem;
  text-align: center;
  width: 100%;
  max-width: 400px;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #0a3200;
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.upload-area h3 {
  color: #1e293b;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.upload-area p {
  color: #64748b;
  margin-bottom: 2rem;
}

.upload-btn {
  background: linear-gradient(135deg, #0a3200, #1a5a0d);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(10, 50, 0, 0.3);
}

.upload-btn input {
  display: none;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.upload-note {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #64748b;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.results-modal,
.detail-modal {
  background: white;
  border-radius: 2rem;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  color: #64748b;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  transform: scale(1.1);
}

.modal-content {
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.image-section {
  text-align: center;
}

.image-container {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: inline-block;
}

.uploaded-image {
  width: 100%;
  height: auto;
  display: block;
}

.detection-overlay {
  position: absolute;
  border: 3px solid #22c55e;
  border-radius: 8px;
  background: rgba(34, 197, 94, 0.1);
}

.species-tag {
  position: absolute;
  top: -2rem;
  left: 0;
  background: #22c55e;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.results-section {
  padding: 1rem;
}

.success-results {
  text-align: center;
}

.result-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.success-results h2 {
  color: #0a3200;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.species-info {
  margin-bottom: 2rem;
}

.species-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.confidence-section {
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1.5rem;
}

.confidence-label {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.confidence-bar {
  background: #e2e8f0;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.confidence-fill {
  background: linear-gradient(90deg, #22c55e, #16a34a);
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
}

.confidence-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #22c55e;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.loading-results {
  text-align: center;
  padding: 2rem;
}

.ai-loader {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
}

.loader-circle {
  width: 80px;
  height: 80px;
  border: 4px solid #e2e8f0;
  border-top-color: #0a3200;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loader-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: #0a3200;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

.loading-results h3 {
  color: #0a3200;
  margin-bottom: 0.5rem;
}

.error-results {
  text-align: center;
  padding: 2rem;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-results h3 {
  color: #ef4444;
  margin-bottom: 1rem;
}

/* Button Styles */
.btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #0a3200, #1a5a0d);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(10, 50, 0, 0.3);
}

.btn-secondary {
  background: #f1f5f9;
  color: #0a3200;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.btn-retry {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

/* Species Section */
.species-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-tag {
  display: inline-block;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  color: #ef4444;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border: 1px solid #fecaca;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  color: #0a3200;
  font-weight: 800;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.filter-section {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

.filter-label {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.filter-pill {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 2rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #64748b;
}

.filter-pill:hover {
  border-color: #a3d977;
  transform: translateY(-2px);
}

.filter-pill.active {
  background: linear-gradient(135deg, #0a3200, #1a5a0d);
  color: white;
  border-color: #0a3200;
}

.count {
  font-size: 0.85rem;
  opacity: 0.8;
}

.species-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.species-card {
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #f1f5f9;
}

.species-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #a3d977;
}

.card-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.species-card:hover .card-image img {
  transform: scale(1.1);
}

.status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: white;
  backdrop-filter: blur(10px);
}

.status-badge.critical {
  background: rgba(239, 68, 68, 0.9);
}

.status-badge.endangered {
  background: rgba(245, 158, 11, 0.9);
}

.status-badge.vulnerable {
  background: rgba(59, 130, 246, 0.9);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.species-card:hover .card-overlay {
  opacity: 1;
}

.view-btn {
  background: white;
  color: #0a3200;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.species-card:hover .view-btn {
  transform: translateY(0);
}

.card-content {
  padding: 1.5rem;
}

.bird-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0a3200;
  margin-bottom: 0.3rem;
}

.scientific-name {
  font-style: italic;
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.description {
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.location {
  font-size: 0.85rem;
  color: #64748b;
}

.urgency {
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.urgency.urgent {
  background: #fef2f2;
  color: #ef4444;
}

.urgency.high {
  background: #fefbeb;
  color: #f59e0b;
}

.urgency.medium {
  background: #eff6ff;
  color: #3b82f6;
}

/* Detail Modal */
.detail-modal {
  max-width: 1000px;
}

.modal-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 2rem 2rem 0 0;
}

.bird-image {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  height: 250px;
}

.bird-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.status {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  backdrop-filter: blur(10px);
}

.bird-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.bird-info h1 {
  font-size: 2.2rem;
  font-weight: 800;
  color: #0a3200;
  margin-bottom: 0.5rem;
}

.scientific {
  font-style: italic;
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.family {
  color: #64748b;
  margin-bottom: 2rem;
}

.quick-facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.fact {
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
}

.fact .label {
  display: block;
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.3rem;
}

.fact .value {
  font-weight: 600;
  color: #0a3200;
}

.modal-body {
  padding: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.info-card {
  background: #f8fafc;
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.info-card.full-width {
  grid-column: 1 / -1;
}

.info-card h3 {
  color: #0a3200;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-card p {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 0.8rem;
}

.info-card strong {
  color: #1e293b;
}

.threats-list {
  list-style: none;
  padding: 0;
}

.threats-list li {
  padding: 0.3rem 0;
  color: #4b5563;
  border-bottom: 1px solid #e2e8f0;
}

.threats-list li:last-child {
  border-bottom: none;
}

.conservation-cta {
  background: linear-gradient(135deg, #f0f9e8, #e8f5e0);
  border-radius: 2rem;
  padding: 2.5rem;
  text-align: center;
}

.conservation-cta h3 {
  color: #0a3200;
  font-size: 1.8rem;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.btn-conservation {
  background: linear-gradient(135deg, #0a3200, #1a5a0d);
  color: white;
}

.btn-share {
  background: #3b82f6;
  color: white;
}

.btn-report {
  background: #f59e0b;
  color: white;
}

.btn-conservation:hover,
.btn-share:hover,
.btn-report:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }

  .hero-stats {
    justify-content: center;
  }

  .modal-content {
    grid-template-columns: 1fr;
  }

  .modal-header {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .bird-image {
    max-width: 300px;
    margin: 0 auto;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 80vh;
  }

  .hero-content {
    padding: 0 1rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .upload-area {
    padding: 2rem 1rem;
  }

  .species-grid {
    grid-template-columns: 1fr;
  }

  .filter-pills {
    flex-direction: column;
  }

  .filter-pill {
    text-align: center;
  }

  .quick-facts {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .modal-overlay {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .filter-section {
    padding: 1.5rem;
  }

  .modal-header,
  .modal-body {
    padding: 1.5rem;
  }

  .conservation-cta {
    padding: 2rem;
  }
}
</style>
