/* Reset and Base */ * { margin: 0; padding: 0; box-sizing: border-box; } .bird-detection-container
{ font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #1e293b; overflow-x:
hidden; } /* Hero Section */ .hero-section { position: relative; min-height: 100vh; background:
linear-gradient(135deg, #0a3200 0%, #1a5a0d 50%, #0a3200 100%); display: flex; align-items: center;
overflow: hidden; } .hero-background { position: absolute; inset: 0; overflow: hidden; }
.floating-elements { position: absolute; inset: 0; } .element { position: absolute; border-radius:
50%; background: rgba(255, 255, 255, 0.1); animation: float 20s infinite linear; } .element-1 {
width: 100px; height: 100px; top: 20%; left: 10%; animation-delay: 0s; } .element-2 { width: 150px;
height: 150px; top: 60%; right: 15%; animation-delay: 7s; } .element-3 { width: 80px; height: 80px;
bottom: 30%; left: 60%; animation-delay: 14s; } @keyframes float { 0% { transform: translateY(0px)
rotate(0deg); opacity: 0.3; } 33% { transform: translateY(-30px) rotate(120deg); opacity: 0.6; } 66%
{ transform: translateY(20px) rotate(240deg); opacity: 0.3; } 100% { transform: translateY(0px)
rotate(360deg); opacity: 0.3; } } .hero-content { position: relative; z-index: 2; max-width: 1200px;
margin: 0 auto; padding: 0 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem;
align-items: center; width: 100%; } .hero-text { color: white; } .hero-badge { display: inline-flex;
align-items: center; gap: 0.5rem; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2); padding: 0.5rem 1rem; border-radius: 2rem; font-size:
0.9rem; font-weight: 500; margin-bottom: 2rem; } .badge-dot { width: 8px; height: 8px; background:
#22c55e; border-radius: 50%; animation: pulse 2s infinite; } @keyframes pulse { 0%, 100% { opacity:
1; } 50% { opacity: 0.5; } } .hero-title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800;
line-height: 1.1; margin-bottom: 1.5rem; } .highlight { display: block; color: #a3d977; }
.hero-description { font-size: 1.2rem; line-height: 1.6; opacity: 0.9; margin-bottom: 3rem; }
.hero-stats { display: flex; gap: 2rem; } .stat { text-align: center; } .stat-number { font-size:
1.8rem; font-weight: 700; color: #a3d977; } .stat-label { font-size: 0.9rem; opacity: 0.8;
text-transform: uppercase; letter-spacing: 0.05em; } .hero-upload { display: flex; justify-content:
center; align-items: center; } .upload-area { background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(20px); border: 2px dashed #cbd5e1; border-radius: 2rem; padding: 3rem 2rem;
text-align: center; width: 100%; max-width: 400px; transition: all 0.3s ease; } .upload-area:hover {
border-color: #0a3200; transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
.upload-icon { font-size: 3rem; margin-bottom: 1rem; } .upload-area h3 { color: #1e293b; font-size:
1.5rem; margin-bottom: 0.5rem; } .upload-area p { color: #64748b; margin-bottom: 2rem; } .upload-btn
{ background: linear-gradient(135deg, #0a3200, #1a5a0d); color: white; border: none; padding: 1rem
2rem; border-radius: 1rem; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all
0.3s ease; display: inline-flex; align-items: center; gap: 0.5rem; position: relative; overflow:
hidden; } .upload-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(10, 50, 0,
0.3); } .upload-btn input { display: none; } .loading-text { display: flex; align-items: center;
gap: 0.5rem; } .spinner { width: 16px; height: 16px; border: 2px solid transparent;
border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin {
to { transform: rotate(360deg); } } .upload-note { margin-top: 1rem; font-size: 0.85rem; color:
#64748b; } /* Modal Styles */ .modal-overlay { position: fixed; inset: 0
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

    <!-- Endangered Birds Section (keeping original) -->
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
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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
  0%, 100% {
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

.results-modal {
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

/* Original Endangered Birds Section Styles */
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

.bird-cards-scrollable-container {
  overflow-x: auto;
  padding: 20px 10px;
  margin: 0 -10px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
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

.bird-info-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

  .modal-overlay {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .section-container {
    padding: 0 1rem;
  }

  .modal-close-button {
    top: 10px;
    right: 15px;
  }

  .bird-modal-header,
  .bird-modal-content {
    padding: 20px;
  }
}
}

.results-modal, .detail-modal {
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
