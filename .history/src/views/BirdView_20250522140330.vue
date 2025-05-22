<template>
  <div class="bird-detection-container">
    <!-- Enhanced Hero Section -->
    <section class="hero-section">
      <div class="hero-background-overlay"></div>
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-icon">🔬</span>
          AI-Powered Bird Recognition
        </div>
        
        <h1 class="hero-title">Discover Endangered Birds in Your Backyard</h1>
        <p class="hero-subtitle">
          Transform your garden into a conservation sanctuary. Our advanced AI identifies endangered species 
          and provides personalized recommendations to protect local wildlife.
        </p>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Precision Detection</h3>
            <p>99% accuracy in identifying bird species</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌿</div>
            <h3>Conservation Focus</h3>
            <p>Specialized in endangered species protection</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Instant Results</h3>
            <p>Real-time identification with detailed insights</p>
          </div>
        </div>

        <div class="upload-section">
          <p class="upload-instruction">📸 Upload a clear photo of any bird for instant identification</p>
          <label for="upload" class="upload-button-enhanced">
            <div class="upload-button-content">
              <span class="upload-icon" v-if="!isLoading">📷</span>
              <span class="loading-spinner-small" v-else></span>
              <span class="upload-text">
                {{ isLoading ? 'Analyzing Image...' : 'Start Bird Identification' }}
              </span>
            </div>
            <input
              type="file"
              id="upload"
              accept="image/*"
              @change="handleFileUpload"
              :disabled="isLoading"
            />
          </label>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="floating-birds">
          <div class="bird-silhouette bird-1">🦅</div>
          <div class="bird-silhouette bird-2">🐦</div>
          <div class="bird-silhouette bird-3">🦜</div>
        </div>
      </div>
    </section>

    <!-- Enhanced Detection Results Modal -->
    <div v-if="previewUrl" class="detection-modal-overlay" @click="closeDetectionModal">
      <div class="detection-modal-enhanced" @click.stop>
        <button class="modal-close-button-enhanced" @click="closeDetectionModal">
          <span>✕</span>
        </button>

        <div class="detection-modal-content-enhanced">
          <div class="detection-layout">
            <!-- Image Preview Column -->
            <div class="detection-image-section">
              <div class="image-container">
                <img
                  :src="previewUrl"
                  alt="Bird image preview"
                  class="detection-image"
                  ref="previewImage"
                />
                <div v-if="result" class="detection-box-enhanced" :style="getBoundingBoxStyle()">
                  <div class="detection-label">{{ result.class_name }}</div>
                </div>
              </div>
            </div>

            <!-- Results Column -->
            <div class="detection-results-section">
              <div v-if="result" class="results-content">
                <div class="results-header">
                  <div class="success-icon">✅</div>
                  <h2>Bird Identified!</h2>
                </div>
                
                <div class="species-info">
                  <div class="species-name">{{ result.class_name }}</div>
                  <div class="confidence-meter">
                    <div class="confidence-label">Confidence Level</div>
                    <div class="confidence-bar">
                      <div 
                        class="confidence-fill" 
                        :style="{ width: (result.confidence * 100) + '%' }"
                      ></div>
                    </div>
                    <div class="confidence-percentage">{{ (result.confidence * 100).toFixed(1) }}%</div>
                  </div>
                </div>

                <div class="action-buttons">
                  <button class="action-btn primary" @click="learnMore">
                    <span>📚</span> Learn More About This Species
                  </button>
                  <button class="action-btn secondary" @click="resetAndUpload">
                    <span>📷</span> Identify Another Bird
                  </button>
                </div>
              </div>

              <div v-else-if="isLoading" class="loading-content">
                <div class="ai-animation">
                  <div class="scanning-line"></div>
                  <div class="ai-brain">🧠</div>
                </div>
                <h3>AI Analysis in Progress</h3>
                <p>Our advanced neural network is examining your image...</p>
                <div class="progress-steps">
                  <div class="step active">📸 Image Processing</div>
                  <div class="step active">🔍 Feature Detection</div>
                  <div class="step active">🧠 Species Classification</div>
                </div>
              </div>

              <div v-else-if="error" class="error-content">
                <div class="error-icon">⚠️</div>
                <h3>Detection Failed</h3>
                <p>{{ error }}</p>
                <button class="retry-button-enhanced" @click="resetAndUpload">
                  <span>🔄</span> Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Endangered Birds Section -->
    <section class="endangered-birds-section-enhanced">
      <div class="section-container-enhanced">
        <div class="section-header-enhanced">
          <div class="section-badge">
            <span>🔴</span> Conservation Alert
          </div>
          <h2 class="section-title-enhanced">Protect Australia's Endangered Birds</h2>
          <p class="section-description-enhanced">
            These magnificent species need our immediate attention. Every identification helps build 
            a database for conservation efforts across Australia.
          </p>
        </div>

        <!-- Enhanced State Filter -->
        <div class="state-filter-enhanced">
          <div class="filter-header">
            <h3>📍 Filter by Region</h3>
            <p>Discover endangered species in your area</p>
          </div>
          
          <div class="filter-buttons-grid">
            <button
              class="filter-button-enhanced"
              :class="{ active: selectedState === 'South Australia' }"
              @click="setStateFilter('South Australia')"
            >
              <div class="button-content">
                <span class="region-icon">🏜️</span>
                <span class="region-name">South Australia</span>
                <span class="species-count">{{ getRegionCount('South Australia') }} species</span>
              </div>
            </button>
            
            <button
              class="filter-button-enhanced"
              :class="{ active: selectedState === 'Victoria' }"
              @click="setStateFilter('Victoria')"
            >
              <div class="button-content">
                <span class="region-icon">🌲</span>
                <span class="region-name">Victoria</span>
                <span class="species-count">{{ getRegionCount('Victoria') }} species</span>
              </div>
            </button>
            
            <button
              class="filter-button-enhanced"
              :class="{ active: selectedState === 'Queensland' }"
              @click="setStateFilter('Queensland')"
            >
              <div class="button-content">
                <span class="region-icon">🌴</span>
                <span class="region-name">Queensland</span>
                <span class="species-count">{{ getRegionCount('Queensland') }} species</span>
              </div>
            </button>
            
            <button
              class="filter-button-enhanced"
              :class="{ active: selectedState === 'Other' }"
              @click="setStateFilter('Other')"
            >
              <div class="button-content">
                <span class="region-icon">🗺️</span>
                <span class="region-name">Other Regions</span>
                <span class="species-count">{{ getRegionCount('Other') }} species</span>
              </div>
            </button>
          </div>

          <div class="conservation-legend">
            <div class="legend-item">
              <span class="status-badge cr">CR</span>
              <span>Critically Endangered</span>
            </div>
            <div class="legend-item">
              <span class="status-badge en">EN</span>
              <span>Endangered</span>
            </div>
            <div class="legend-item">
              <span class="status-badge vu">VU</span>
              <span>Vulnerable</span>
            </div>
          </div>
        </div>

        <!-- Enhanced Bird Cards -->
        <div class="birds-showcase">
          <div class="birds-grid">
            <div
              v-for="bird in filteredBirds"
              :key="bird.id"
              class="bird-card-enhanced"
              @click="selectBird(bird)"
            >
              <div class="card-image-container">
                <img :src="getBirdImagePath(bird.image)" :alt="bird.name" class="card-image" />
                <div class="image-overlay">
                  <div class="status-badge-large" :class="getStatusClass(bird.status)">
                    {{ getStatusShort(bird.status) }}
                  </div>
                  <div class="view-details">
                    <span>View Details</span>
                    <div class="arrow">→</div>
                  </div>
                </div>
              </div>
              
              <div class="card-content">
                <h3 class="bird-name">{{ bird.name }}</h3>
                <p class="scientific-name">{{ bird.scientificName }}</p>
                <p class="bird-description">{{ truncateText(bird.overview, 120) }}</p>
                
                <div class="card-footer">
                  <div class="location-tag">
                    <span>📍</span> {{ getMainLocation(bird.location) }}
                  </div>
                  <div class="urgency-indicator" :class="getUrgencyClass(bird.status)">
                    {{ getUrgencyText(bird.status) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Bird Details Modal -->
    <div v-if="selectedBird" class="bird-modal-overlay-enhanced" @click="closeModal">
      <div class="bird-modal-enhanced" @click.stop>
        <button class="modal-close-button-enhanced" @click="closeModal">
          <span>✕</span>
        </button>

        <div class="modal-header-enhanced">
          <div class="modal-image-section">
            <img
              :src="getBirdImagePath(selectedBird.image)"
              :alt="selectedBird.name"
              class="modal-bird-image"
            />
            <div class="status-overlay">
              <div class="status-badge-modal" :class="getStatusClass(selectedBird.status)">
                {{ selectedBird.status }}
              </div>
            </div>
          </div>

          <div class="modal-info-section">
            <h1 class="modal-bird-name">{{ selectedBird.name }}</h1>
            <p class="modal-scientific-name">{{ selectedBird.scientificName }}</p>
            <p class="modal-family">Family: {{ selectedBird.family }}</p>
            
            <div class="quick-stats">
              <div class="stat-item">
                <span class="stat-label">Size</span>
                <span class="stat-value">{{ selectedBird.size || 'Varies' }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Weight</span>
                <span class="stat-value">{{ selectedBird.weight || 'Varies' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-content-enhanced">
          <div class="content-tabs">
            <div class="tab-nav">
              <button class="tab-button active">Overview</button>
              <button class="tab-button">Habitat</button>
              <button class="tab-button">Conservation</button>
            </div>
            
            <div class="tab-content">
              <div class="info-section-enhanced">
                <h3>About This Species</h3>
                <p class="overview-text">{{ selectedBird.overview }}</p>
              </div>

              <div class="details-grid">
                <div class="detail-card">
                  <h4>🏡 Habitat & Location</h4>
                  <div class="detail-list">
                    <div class="detail-item">
                      <strong>Preferred Habitat:</strong>
                      <span>{{ selectedBird.habitat.join(', ') }}</span>
                    </div>
                    <div class="detail-item">
                      <strong>Geographic Range:</strong>
                      <span>{{ selectedBird.location }}</span>
                    </div>
                  </div>
                </div>

                <div class="detail-card">
                  <h4>🎯 Behavior & Diet</h4>
                  <div class="detail-list">
                    <div class="detail-item">
                      <strong>Behavior:</strong>
                      <span>{{ selectedBird.behaviour }}</span>
                    </div>
                    <div class="detail-item">
                      <strong>Feeding:</strong>
                      <span>{{ selectedBird.feeding }}</span>
                    </div>
                  </div>
                </div>

                <div class="detail-card">
                  <h4>🚨 Conservation Threats</h4>
                  <ul class="threats-list-enhanced">
                    <li v-for="(risk, index) in selectedBird.risks" :key="index">
                      <span class="threat-icon">⚠️</span>
                      {{ risk }}
                    </li>
                  </ul>
                </div>

                <div class="detail-card">
                  <h4>🔍 Identification</h4>
                  <p class="identification-text">{{ selectedBird.identification }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="conservation-action">
            <div class="action-header">
              <h3>🛡️ Help Protect This Species</h3>
              <p>Your action can make a difference in conservation efforts</p>
            </div>
            <div class="action-buttons-grid">
              <a
                href="https://birdlife.org.au/campaign/nature-laws/"
                target="_blank"
                class="action-button primary"
              >
                <span>🌿</span> Support Conservation
              </a>
              <button class="action-button secondary" @click="shareSpecies">
                <span>📤</span> Share This Species
              </button>
              <button class="action-button tertiary" @click="reportSighting">
                <span>📍</span> Report a Sighting
              </button>
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
        const apiUrl = 'https://e5df629i4k.execute-api.us-east-1.amazonaws.com/birdDetection/predict'
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
      // Implementation for learning more about the species
      console.log('Learn more about:', result.value.class_name)
    }

    const shareSpecies = () => {
      // Implementation for sharing species
      console.log('Share species:', selectedBird.value.name)
    }

    const reportSighting = () => {
      // Implementation for reporting sighting
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
/* Base Styles */
.bird-detection-container {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  color: #1e293b;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  overflow-x: hidden;
}

/* Enhanced Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(10, 50, 0, 0.9) 0%,
    rgba(34, 85, 19, 0.8) 50%,
    rgba(10, 50, 0, 0.9) 100%
  ),
  url('@/assets/images/birds-bg.jpeg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 2rem 5%;
  gap: 4rem;
  overflow: hidden;
}

.hero-background-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 20%, rgba(168, 217, 130, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(168, 217, 130, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(168, 217, 130, 0.3);
  color: #a8d982;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 2rem;
}

.badge-icon {
  font-size: 1.1rem;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: #d4f0c5;
  line-height: 1.6;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.15);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #d4f0c5;
  font-size: 0.9rem;
}

.upload-section {
  text-align: center;
}

.upload-instruction {
  color: #c7e8b5;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.upload-button-enhanced {
  display: inline-block;
  background: linear-gradient(135deg, #a8d982, #8bc34a);
  color: #0a3200;
  border: none;
  border-radius: 1rem;
  padding: 1.2rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 30px rgba(168, 217, 130, 0.3);
  position: relative;
  overflow: hidden;
}

.upload-button-enhanced:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(168, 217, 130, 0.4);
  background: linear-gradient(135deg, #8bc34a, #7acc4a);
}

.upload-button-enhanced input {
  display: none;
}

.upload-button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.upload-icon {
  font-size: 1.5rem;
}

.loading-spinner-small {
  width: 24px;
  height: 24px;
  border: 3px solid transparent;
  border-top-color: #0a3200;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.hero-visual {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-birds {
  position: relative;
  width: 300px;
  height: 300px;
}

.bird-silhouette {
  position: absolute;
  font-size: 3rem;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.bird-1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.bird-2 {
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.bird-3 {
  bottom: 20%;
  left: 50%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(5deg);
  }
  66% {
    transform: translateY(10px) rotate(-3deg);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Enhanced Detection Modal */
.detection-modal-overlay {
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

.detection-modal-enhanced {
  background: #ffffff;
  border-radius: 2rem;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.4s ease;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-close-button-enhanced {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.modal-close-button-enhanced:hover {
  background: rgba(255, 0, 0, 0.1);
  transform: scale(1.1);
}

.modal-close-button-enhanced span {
  font-size: 1.2rem;
  font-weight: 600;
  color: #64748b;
}

.detection-modal-content-enhanced {
  padding: 2.5rem;
}

.detection-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.detection-image-section {
  position: relative;
}

.image-container {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  background: #f8fafc;
}

.detection-image {
  width: 100%;
  height: auto;
  display: block;
}

.detection-box-enhanced {
  position: absolute;
  border: 3px solid #22c55e;
  border-radius: 8px;
  background: rgba(34, 197, 94, 0.1);
  backdrop-filter: blur(4px);
}

.detection-label {
  position: absolute;
  top: -2.5rem;
  left: 0;
  background: #22c55e;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

.detection-results-section {
  padding: 2rem;
}

.results-content {
  text-align: center;
}

.results-header {
  margin-bottom: 2rem;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.results-header h2 {
  font-size: 2rem;
  color: #0a3200;
  font-weight: 700;
  margin: 0;
}

.species-info {
  margin-bottom: 3rem;
}

.species-name {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2rem;
}

.confidence-meter {
  background: #f1f5f9;
  border-radius: 1rem;
  padding: 1.5rem;
}

.confidence-label {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.confidence-bar {
  background: #e2e8f0;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.confidence-fill {
  background: linear-gradient(90deg, #22c55e, #16a34a);
  height: 100%;
  border-radius: 6px;
  transition: width 0.8s ease;
}

.confidence-percentage {
  font-size: 1.5rem;
  font-weight: 700;
  color: #22c55e;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, #0a3200, #1a5a0d);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(10, 50, 0, 0.3);
}

.action-btn.secondary {
  background: #f1f5f9;
  color: #0a3200;
  border: 2px solid #e2e8f0;
}

.action-btn.secondary:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.loading-content {
  text-align: center;
  padding: 2rem;
}

.ai-animation {
  position: relative;
  margin-bottom: 2rem;
}

.ai-brain {
  font-size: 4rem;
  animation: pulse 2s ease-in-out infinite;
}

.scanning-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #22c55e, transparent);
  animation: scan 2s linear infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes scan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.loading-content h3 {
  font-size: 1.5rem;
  color: #0a3200;
  margin-bottom: 1rem;
}

.loading-content p {
  color: #64748b;
  margin-bottom: 2rem;
}

.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.step {
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border-radius: 0.5rem;
  color: #64748b;
  transition: all 0.3s ease;
}

.step.active {
  background: #dcfce7;
  color: #16a34a;
}

.error-content {
  text-align: center;
  padding: 2rem;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-content h3 {
  color: #dc2626;
  margin-bottom: 1rem;
}

.retry-button-enhanced {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.retry-button-enhanced:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
}

/* Enhanced Endangered Birds Section */
.endangered-birds-section-enhanced {
  padding: 6rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.section-container-enhanced {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header-enhanced {
  text-align: center;
  margin-bottom: 4rem;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  color: #dc2626;
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  border: 1px solid #fecaca;
}

.section-title-enhanced {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  color: #0a3200;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.section-description-enhanced {
  font-size: 1.3rem;
  color: #4a7c34;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.state-filter-enhanced {
  background: white;
  border-radius: 2rem;
  padding: 3rem;
  margin-bottom: 4rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.filter-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.filter-header h3 {
  font-size: 1.8rem;
  color: #0a3200;
  margin-bottom: 0.5rem;
}

.filter-header p {
  color: #64748b;
  font-size: 1.1rem;
}

.filter-buttons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.filter-button-enhanced {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 1.5rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.filter-button-enhanced:hover {
  border-color: #a8d982;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(168, 217, 130, 0.2);
}

.filter-button-enhanced.active {
  background: linear-gradient(135deg, #f0f9e8, #e8f5e0);
  border-color: #48962d;
  box-shadow: 0 8px 25px rgba(72, 150, 45, 0.2);
}

.button-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.region-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.region-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #0a3200;
}

.species-count {
  font-size: 0.9rem;
  color: #64748b;
}

.conservation-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #4a7c34;
}

.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: white;
}

.status-badge.cr {
  background: #dc2626;
}

.status-badge.en {
  background: #f59e0b;
}

.status-badge.vu {
  background: #3b82f6;
}

.birds-showcase {
  margin-top: 3rem;
}

.birds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

.bird-card-enhanced {
  background: white;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #f1f5f9;
}

.bird-card-enhanced:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  border-color: #a8d982;
}

.card-image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.bird-card-enhanced:hover .card-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    transparent 30%,
    transparent 70%,
    rgba(0, 0, 0, 0.8) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
}

.status-badge-large {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
}

.status-critical {
  background: #dc2626;
}

.status-endangered {
  background: #f59e0b;
}

.status-vulnerable {
  background: #3b82f6;
}

.view-details {
  align-self: flex-end;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 600;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.bird-card-enhanced:hover .view-details {
  opacity: 1;
  transform: translateY(0);
}

.arrow {
  transition: transform 0.3s ease;
}

.bird-card-enhanced:hover .arrow {
  transform: translateX(4px);
}

.card-content {
  padding: 2rem;
}

.bird-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0a3200;
  margin-bottom: 0.5rem;
}

.scientific-name {
  font-style: italic;
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.bird-description {
  color: #4a7c34;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location-tag {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: #f1f5f9;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  color: #4a7c34;
}

.urgency-indicator {
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.urgency-indicator.urgent {
  background: #fef2f2;
  color: #dc2626;
}

.urgency-indicator.high {
  background: #fefbeb;
  color: #f59e0b;
}

.urgency-indicator.medium {
  background: #eff6ff;
  color: #3b82f6;
}

/* Enhanced Bird Modal */
.bird-modal-overlay-enhanced {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;
}

.bird-modal-enhanced {
  background: white;
  border-radius: 2rem;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.4s ease;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
}

.modal-header-enhanced {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  background: linear-gradient(135deg, #f0f9e8, #e8f5e0);
  padding: 2.5rem;
  border-radius: 2rem 2rem 0 0;
}

.modal-image-section {
  position: relative;
}

.modal-bird-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 1.5rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.status-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.status-badge-modal {
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  backdrop-filter: blur(10px);
}

.modal-info-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modal-bird-name {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0a3200;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.modal-scientific-name {
  font-style: italic;
  color: #64748b;
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.modal-family {
  color: #4a7c34;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.quick-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-item {
  background: rgba(255, 255, 255, 0.7);
  padding: 1rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.3rem;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0a3200;
}

.modal-content-enhanced {
  padding: 2.5rem;
}

.content-tabs {
  margin-bottom: 2rem;
}

.tab-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.tab-button {
  background: none;
  border: none;
  padding: 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-button.active {
  color: #0a3200;
  border-bottom-color: #48962d;
}

.info-section-enhanced {
  margin-bottom: 2rem;
}

.info-section-enhanced h3 {
  font-size: 1.5rem;
  color: #0a3200;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.overview-text {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #4a7c34;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.detail-card {
  background: #f8fafc;
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px solid #e2e8f0;
}

.detail-card h4 {
  font-size: 1.2rem;
  color: #0a3200;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.detail-item strong {
  color: #4a7c34;
  font-weight: 600;
}

.detail-item span {
  color: #64748b;
  line-height: 1.5;
}

.threats-list-enhanced {
  list-style: none;
  padding: 0;
  margin: 0;
}

.threats-list-enhanced li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  color: #64748b;
  line-height: 1.5;
}

.threat-icon {
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.identification-text {
  color: #64748b;
  line-height: 1.6;
}

.conservation-action {
  background: linear-gradient(135deg, #f0f9e8, #e8f5e0);
  border-radius: 2rem;
  padding: 3rem;
  text-align: center;
  margin-top: 3rem;
}

.action-header h3 {
  font-size: 2rem;
  color: #0a3200;
  margin-bottom: 1rem;
}

.action-header p {
  color: #4a7c34;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
}

.action-buttons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.2rem 2rem;
  border-radius: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.action-button.primary {
  background: linear-gradient(135deg, #0a3200, #1a5a0d);
  color: white;
}

.action-button.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(10, 50, 0, 0.3);
}

.action-button.secondary {
  background: #f8fafc;
  color: #0a3200;
  border: 2px solid #e2e8f0;
}

.action-button.secondary:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.action-button.tertiary {
  background: transparent;
  color: #4a7c34;
  border: 2px solid #c2e59c;
}

.action-button.tertiary:hover {
  background: #f0f9e8;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-section {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 3%;
    text-align: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .detection-layout {
    grid-template-columns: 1fr;
  }

  .modal-header-enhanced {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .filter-buttons-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .birds-grid {
    grid-template-columns: 1fr;
  }

  .filter-buttons-grid {
    grid-template-columns: 1fr;
  }

  .conservation-legend {
    flex-direction: column;
    gap: 1rem;
  }

  .action-buttons-grid {
    grid-template-columns: 1fr;
  }

  .quick-stats {
    grid-template-columns: 1fr;
  }

  .detection-modal-overlay,
  .bird-modal-overlay-enhanced {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 2rem 5%;
  }

  .section-container-enhanced {
    padding: 0 1rem;
  }

  .detection-modal-content-enhanced,
  .modal-content-enhanced {
    padding: 1.5rem;
  }

  .state-filter-enhanced {
    padding: 2rem;
  }
}