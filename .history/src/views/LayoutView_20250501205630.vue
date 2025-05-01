<template>
  <div class="layout-page-container">
    <!-- Banner Section -->
    <section class="layout-banner">
      <div class="banner-overlay">
        <h1 class="layout-title">DESIGN YOUR WELCOMING BACKYARD</h1>
        <p class="layout-subtitle">"Australia is home to over 800 native bird species, but nearly 1 in 6 are now threatened. Even a small backyard with native plants can support up to 30 local species – helping native ecosystems one garden at a time."</p>
        
        <!-- Info buttons -->
        <div class="info-buttons">
          <button class="info-button">Know more for birds</button>
          <button class="info-button">know more about plantings</button>
        </div>
      </div>
    </section>
    
    <!-- State Selector Section -->
    <section class="state-selector-section">
      <div class="state-selector">
        <span class="state-label">Currently designing for: </span>
        <select v-model="selectedState" @change="updateState" class="state-dropdown">
          <option value="Victoria">Victoria</option>
          <option value="Queensland">Queensland</option>
          <option value="South Australia">South Australia</option>
        </select>
      </div>
      <div class="state-info">
        <h3>{{ selectedState }} Climate & Soil Information</h3>
        <p>{{ stateInfo[selectedState].description }}</p>
      </div>
    </section>
    
    <!-- Layout Options Section -->
    <section class="layout-options">
      <div class="layout-info">
        <h2>Garden Layouts for {{ selectedState }}</h2>
        <p>Select a layout that works best for your backyard and local birds</p>
        
        <div v-for="(bird, index) in layout.birds" :key="index" class="bird-icon">
                  <img :src="getBirdImagePath(bird)" :alt="bird" class="bird-img">
                  <span class="bird-name">{{ bird }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination Controls -->
        <div class="pagination-controls">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1" 
            class="pagination-btn"
          >
            Previous
          </button>
          <span class="page-indicator">Page {{ currentPage }} of {{ totalPages }}</span>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages" 
            class="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </section>
    
    <!-- Layout Details Modal (shown when See More is clicked) -->
    <div v-if="showModal" class="layout-modal">
      <div class="modal-content">
        <span class="close-modal" @click="closeModal">&times;</span>
        <div class="modal-header">
          <h2>{{ selectedLayout.title }}</h2>
          
          <!-- Image Carousel -->
          <div class="image-carousel">
            <button @click="prevImage" class="carousel-btn prev-btn">&lt;</button>
            <img :src="currentModalImage" :alt="selectedLayout.title" class="modal-image">
            <button @click="nextImage" class="carousel-btn next-btn">&gt;</button>
            <div class="image-indicators">
              <span 
                v-for="(_, index) in selectedLayout.images" 
                :key="index" 
                :class="['indicator', { active: currentImageIndex === index }]"
                @click="setModalImage(index)"
              ></span>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <h3>Concept</h3>
          <p>{{ selectedLayout.concept }}</p>
          
          <h3>How to Build</h3>
          <ul>
            <li v-for="(step, index) in selectedLayout.howToBuild" :key="index">
              <strong>{{ step.title }}:</strong> {{ step.description }}
            </li>
          </ul>
          
          <h3>Birds Attracted</h3>
          <div class="modal-birds">
            <div v-for="(bird, index) in selectedLayout.birds" :key="index" class="modal-bird">
              <img :src="getBirdImagePath(bird.image)" :alt="bird.name" class="modal-img">
              <span>{{ bird.name }}</span>
            </div>
          </div>
        </div>
      </div>
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
      currentPage: 1,
      itemsPerPage: 3,
      currentImageIndex: 0,
      stateInfo: {
        Victoria: {
          description: "Victoria has a temperate climate with cool, wet winters and warm summers. Soil types vary from sandy coastal soils to clay loams in urban areas. Native plants in Victoria are adapted to lower rainfall and periodic drought."
        },
        Queensland: {
          description: "Queensland features subtropical to tropical climates with warm, humid conditions year-round in the north. Soils range from rich volcanic to sandy coastal. Plants here thrive in higher humidity and need good drainage."
        },
        "South Australia": {
          description: "South Australia has a Mediterranean climate with hot, dry summers and mild winters. Soils tend to be alkaline and sometimes saline. Native plants are drought-tolerant and adapted to low rainfall conditions."
        }
      },
      layouts: [
        // Victoria layouts
        {
          id: 1,
          title: "Berry Bird Bonanza",
          state: "Victoria",
          folder: "Berry Bird Bonanza",
          shortDescription: "Cultivate a native fruit stand in your garden. Planting species like Lilly Pillies and Native Figs offers delicious, natural berries and fruits, inviting birds such as Silvereyes, Figbirds, and Currawongs to feast.",
          concept: "Grow native plants that provide edible berries, fruits, or seeds for birds.",
          howToBuild: [
            { title: "Select Plants", description: "Choose native fruiting species like Lilly Pillies (Syzygium), Dianella (Flax Lilies), Native Figs (Ficus), Saltbush (Atriplex/Rhagodia), Native Raspberries (Rubus). Check fruiting times." },
            { title: "Consider Size", description: "Ensure plants fit your space when mature." },
            { title: "Location", description: "Plant where fruit drop is acceptable. Good sun needed for fruiting." },
            { title: "Soil", description: "Add compost if needed for specific plants." },
            { title: "Natural Food", description: "Allow some fruit to ripen and fall. Avoid harmful netting." }
          ],
          images: ["Berry image_fx (24).jpg", "Berry image_fx (25).jpg", "Berry image_fx (26).jpg", "Berry image_fx (27).jpg"],
          birds: [
            { name: "Lord Howe Silvereye", image: "Lord_Howe_Silvereye.jpg" },
            { name: "Green Figbird", image: "Green_Figbird_samcem.jpeg" },
            { name: "Painted Honeyeater", image: "Painted Honeyeater.jpg" }
          ]
        },
        {
          id: 2,
          title: "Meadow Melody Patch",
          state: "Victoria",
          folder: "Meadow Melody Patch",
          shortDescription: "Establish a sunny, open meadow filled with native grasses and wildflowers. This simple, natural space is perfect for attracting ground-feeding birds like Magpies, Pigeons, Finches, and Pipits that forage amongst the stems.",
          concept: "Create an open area dominated by native grasses and wildflowers for ground-feeding birds.",
          howToBuild: [
            { title: "Location", description: "Choose a sunny, open spot. Remove lawn/weeds." },
            { title: "Plant Grasses", description: "Use native clumping grasses (Kangaroo Grass, Wallaby Grasses, Poa, Lomandra). Plant in drifts." },
            { title: "Add Wildflowers", description: "Intersperse native daisies, everlastings, etc." },
            { title: "Leave Standing", description: "Let grasses/flowers seed naturally and stand through winter." },
            { title: "Keep Open", description: "Avoid cluttering with too many shrubs or trees. A single rock or log is okay." }
          ],
          images: ["image_fx (19).jpg", "The Meadow & Grassland Gardenv1.jpg"],
          birds: [
            { name: "Plains-wanderer", image: "Plains-wanderer.jpeg" },
            { name: "Australian Magpie", image: "Cracticus_tibicen_hypoleuca_male_domain.jpg" },
            { name: "Australian Finch", image: "Australian-Finch-Bicheno.jpg" },
            { name: "White-throated Needletail", image: "450px-White-throated_NeedletailM&Ca.jpg" }
          ]
        },
        {
          id: 3,
          title: "Parrot Playland Aviary",
          state: "Victoria",
          folder: "Parrot Playland Aviary",
          shortDescription: "Attract with Caution! Design a robust space specifically for wild cockatoos and parrots using sturdy native food trees (large nuts/seeds) and strong perches. (Warning: High potential for garden damage; requires careful management).",
          concept: "Attract wild cockatoos by providing food sources (large seeds/nuts) and sturdy structures they favour. (Warning: High potential for garden damage!)",
          howToBuild: [
            { title: "Plant Food Trees", description: "Establish sturdy natives with large seeds/nuts/cones (Banksias, Allocasuarinas, specific Eucalypts, Hakeas - research local diet). Long-term approach." },
            { title: "Provide Strong Perches", description: "Use large, mature tree limbs or safe, sturdy dead trees (snags)." },
            { title: "Install Robust Water Source", description: "Use a large, heavy bird bath or ground-level dish. Keep clean." },
            { title: "Maintain Open Space", description: "Ensure clear flight paths near favoured spots." },
            { title: "Durable Landscape", description: "Use tough materials; expect chewing. Protect vulnerable items." }
          ],
          images: ["image_fx (21).jpg", "image_fx (22).jpg", "image_fx (20).jpg", "The Parrot Paradise Aviary Gardenv1.jpg"],
          birds: [
            { name: "Sulphur-crested Cockatoo", image: "cockatoo.81ff5dc.jpg" },
            { name: "Swift Parrot", image: "swift_parrot.jpg" },
            { name: "Galah", image: "galah-fact-sheet-2.jpg" }
          ]
        },
        
        // Queensland layouts
        {
          id: 4,
          title: "The Aqua Oasis",
          state: "Queensland",
          folder: "The Aqua Oasis",
          shortDescription: "Make clean, reliable water the star attraction. A well-placed, safe bird bath is irresistible, drawing in nearly all local bird species for a vital drink or refreshing dip, especially crucial during dry spells.",
          concept: "Make a clean, safe, and reliable water source the main attraction.",
          howToBuild: [
            { title: "Choose Bath", description: "Shallow (max 5-7cm), sloping sides, rough texture. Stable base." },
            { title: "Position Safely", description: "Place with open views nearby, but escape cover (shrubs) 1-2 metres away." },
            { title: "Add Landing Spots", description: "Place a rock in the water for smaller birds." },
            { title: "Consider Motion", description: "Drippers or fountains attract attention (optional)." },
            { title: "Clean Regularly", description: "Essential! Change water daily/every other day. Scrub bath frequently." }
          ],
          images: ["image_fx (28).jpg", "image_fx (29).jpg", "image_fx (30).jpg", "The Water Oasis Garden(4).jpg"],
          birds: [
            { name: "Australasian Bittern", image: "Australasian Bittern.jpg" },
            { name: "Australian Painted Snipe", image: "Australian Painted-Snipe.jpg" },
            { name: "Pilotbird", image: "pilotbird.jpeg" }
          ]
        },
        {
          id: 5,
          title: "Woodland Edge Wonder",
          state: "Queensland",
          folder: "Woodland Edge Wonder",
          shortDescription: "Mimic the rich, layered structure of a woodland edge. Designing with groundcovers, shrubs, and small trees provides diverse foraging opportunities and attracts birds like Robins, Whistlers, and Scrubwrens that explore different heights.",
          concept: "Mimic a woodland edge with multiple vertical layers (groundcover to small trees).",
          howToBuild: [
            { title: "Plan Layers", description: "Design from back (tallest) to front (shortest): small trees -> tall shrubs -> smaller shrubs -> groundcovers/grasses." },
            { title: "Connect Layers", description: "Overlap planting zones slightly for easy movement." },
            { title: "Light", description: "Match plants to available sun/shade." },
            { title: "Ground Habitat", description: "Include logs, rocks, and leaf litter within the layers." }
          ],
          images: ["image_fx (7).jpg", "The Layered Woodland Edge Garden (4).jpg", "image_fx (6).jpg", "image_fx (12).jpg"],
          birds: [
            { name: "Eastern Yellow Robin", image: "Robin.jpg" },
            { name: "White-throated Needletail", image: "450px-White-throated_NeedletailM&Ca.webp" },
            { name: "Southern Whiteface", image: "Southern Whiteface.jpg" }
          ]
        },
        {
          id: 6,
          title: "Seed & Safety Sanctuary",
          state: "Queensland",
          folder: "Seed and Safety Sanctuary",
          shortDescription: "Offer a safe haven combining food and protection. Native grasses and wattles provide nutritious seeds, while dense, prickly thickets offer crucial shelter and escape routes for smaller birds like finches and wrens.",
          concept: "Offer seeds from native grasses and shrubs, plus dense, protective thickets for safety.",
          howToBuild: [
            { title: "Plant Grasses", description: "Use clumps of native grasses like Kangaroo Grass (Themeda), Wallaby Grasses (Rytidosperma), Tussock Grasses (Poa)." },
            { title: "Add Seed Shrubs", description: "Include Wattles (Acacia), Hop Bush (Dodonaea)." },
            { title: "Create Thickets", description: "Plant groups of dense/prickly shrubs like Bursaria, Hakea, Kunzea." },
            { title: "Position Shelter", description: "Place thickets near bird baths or open areas for quick escape." },
            { title: "Leave Seeds", description: "Do not cut off seed heads from grasses or shrubs prematurely." }
          ],
          images: ["image_fx (31).jpg", "image_fx (32).jpg"],
          birds: [
            { name: "Superb Fairy-wren", image: "blue-wren.jpg" },
            { name: "Diamond Firetail", image: "Australian-Finch-Bicheno.jpg" },
            { name: "Crested Pigeon", image: "crested_pigeon.jpg" }
          ]
        },
        
        // South Australia layouts
        {
          id: 7,
          title: "Winter Welcome Garden",
          state: "South Australia",
          folder: "Winter Welcome Garden",
          shortDescription: "Create a vital refuge for birds during the colder months. Offer essential evergreen shelter, late-season food sources like persistent berries or seeds, and a reliable water supply to support resident birds when resources are scarce.",
          concept: "Provide vital food, water, and shelter during the harshest time of year (cold winter).",
          howToBuild: [
            { title: "Evergreen Shelter", description: "Plant dense native shrubs (Callistemons, Leptospermum, Westringia) for protection." },
            { title: "Persistent Food", description: "Include plants holding seeds late (grasses), persistent berries (Saltbush), or winter/dry season flowers." },
            { title: "Reliable Water", description: "Ensure a bird bath is always available (consider heating if frost occurs)." },
            { title: "Natural Cover", description: "Leave leaf litter; don't prune heavily before the tough season." },
            { title: "Supplement Food (Optional)", description: "Use quality seed/nectar only sparingly if natural sources fail. Clean feeders." }
          ],
          images: ["image_fx (18).jpg", "The Winter Refuge Gardenv1.jpg"],
          birds: [
            { name: "Lord Howe Silvereye", image: "Lord_Howe_Silvereye.jpg" },
            { name: "Magpie-lark", image: "magpie-larks.jpeg" },
            { name: "Australian Finch", image: "Australian-Finch-Bicheno.jpg" }
          ]
        },
        {
          id: 8,
          title: "Nectar Nook",
          state: "South Australia",
          folder: "Nectar Nook",
          shortDescription: "Design a vibrant floral café for birds! Focus on planting native, nectar-rich flowers like Grevilleas and Banksias to attract energetic honeyeaters and colourful lorikeets with a year-round, sweet energy boost.",
          concept: "Focus on native plants producing lots of nectar to attract honeyeaters and lorikeets.",
          howToBuild: [
            { title: "Select Plants", description: "Choose high-nectar natives like Grevilleas, Banksias, Callistemons (Bottlebrushes), Eremophilas, Correas, Kangaroo Paws, and flowering Eucalypts. Aim for year-round flowers." },
            { title: "Sunlight", description: "Plant in sunny positions for best flowering." },
            { title: "Group Flowers", description: "Plant multiples together for a stronger signal." },
            { title: "Add Perches", description: "Include shrubs or branches near flowers for birds to rest." },
            { title: "Water Source", description: "Provide a clean bird bath for drinking and cleaning beaks." }
          ],
          images: ["The Hummingbird & Pollinator Garden v1.jpg", "image_fx (15).jpg", "image_fx (16).jpg", "image_fx (17).jpg"],
          birds: [
            { name: "Red Wattlebird", image: "red_wattlebird.jpg" },
            { name: "Lorikeets", image: "Lorikeets.jpg" },
            { name: "Painted Honeyeater", image: "Painted Honeyeater.jpg" }
          ]
        },
        {
          id: 9,
          title: "Homegrown Habitat Haven",
          state: "South Australia",
          folder: "Homegrown Habitat Haven",
          shortDescription: "Create an authentic slice of local bushland in your backyard. By using plants native to your specific area, you'll provide the most natural food, shelter, and nesting sites, attracting the widest variety of local birdlife.",
          concept: "Recreate local bushland using plants native specifically to your area. Provides the most natural food, shelter, and nesting sites.",
          howToBuild: [
            { title: "Research", description: "Identify plants native to your specific suburb/region (council guides, native nurseries). Prioritize \"local provenance\"." },
            { title: "Layer", description: "Plan for groundcovers, shrubs (small & large), and small trees. Arrange naturally." },
            { title: "Soil", description: "Minimal improvement needed; focus on good drainage. Avoid excessive fertilizer." },
            { title: "Planting", description: "Group plants with similar needs. Water well initially." },
            { title: "Mulch", description: "Use 5-7cm of natural mulch (e.g., eucalyptus, leaf litter)." },
            { title: "Water", description: "Add a bird bath near cover, but with open views." },
            { title: "Maintain Lightly", description: "Water until established, then minimally. Let leaf litter build up. No pesticides!" }
          ],
          images: ["Native Habitat Garden 1.jpg", "Native Habitat Garden 1 (14).jpg", "image_fx (13).jpg"],
          birds: [
            { name: "Lord Howe Silvereye", image: "Lord_Howe_Silvereye.jpg" },
            { name: "Green Figbird", image: "Green_Figbird_samcem.jpeg" },
            { name: "Painted Honeyeater", image: "Painted Honeyeater.jpg" }
          ]
        }
      ]
    };
  },
  computed: {
    filteredLayouts() {
      return this.layouts.filter(layout => layout.state === this.selectedState);
    },
    totalPages() {
      return Math.ceil(this.filteredLayouts.length / this.itemsPerPage);
    },
    paginatedLayouts() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredLayouts.slice(startIndex, endIndex);
    },
    currentStateLayouts() {
      // Group layouts by state for the carousel view
      const groupedLayouts = {};
      this.layouts.forEach(layout => {
        if (!groupedLayouts[layout.state]) {
          groupedLayouts[layout.state] = [];
        }
        groupedLayouts[layout.state].push(layout);
      });
      return groupedLayouts;
    },
    currentModalImage() {
      if (this.selectedLayout && this.selectedLayout.images && this.selectedLayout.images.length > 0) {
        return this.getLayoutImagePath(this.selectedLayout.folder, this.selectedLayout.images[this.currentImageIndex]);
      }
      return ''; // Fallback empty string if no images available
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
      // Reset to first page when state changes
      this.currentPage = 1;
    },
    showDetails(layout) {
      this.selectedLayout = layout;
      this.currentImageIndex = 0; // Reset image index when opening modal
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    nextImage() {
      if (this.selectedLayout && this.selectedLayout.images) {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.selectedLayout.images.length;
      }
    },
    prevImage() {
      if (this.selectedLayout && this.selectedLayout.images) {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.selectedLayout.images.length) % this.selectedLayout.images.length;
      }
    },
    setModalImage(index) {
      this.currentImageIndex = index;
    },
    goToGardenGuide() {
      this.$router.push('/gardenguide');
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    getLayoutImagePath(folder, image) {
      // Use the actual image path from the provided image paths
      return `../assets/images/layout/${folder}/${image}`;
    },
    getBirdImagePath(imageName) {
      // Use the exact image filename provided in the data
      return `../assets/images/birds/${imageName}`;
    },
    // Method to handle image slider for layouts
    showNextImage(layout) {
      if (!layout.currentImageIndex) {
        layout.currentImageIndex = 0;
      }
      layout.currentImageIndex = (layout.currentImageIndex + 1) % layout.images.length;
      return this.getLayoutImagePath(layout.folder, layout.images[layout.currentImageIndex]);
    },
    showPrevImage(layout) {
      if (!layout.currentImageIndex) {
        layout.currentImageIndex = 0;
      }
      layout.currentImageIndex = (layout.currentImageIndex - 1 + layout.images.length) % layout.images.length;
      return this.getLayoutImagePath(layout.folder, layout.images[layout.currentImageIndex]);
    }
  }
};
</script>

<style scoped>
.layout-page-container {
  font-family: 'Arial', sans-serif;
  color: #333;
}

/* Banner Section */
.layout-banner {
  height: 40vh;
  min-height: 400px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../assets/images/Layout.jpg');
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

.layout-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #f3f9c0;
}

.layout-subtitle {
  font-size: 1.2rem;
  color: #fff;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.info-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.info-button {
  background-color: #4c7d3a;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.info-button:hover {
  background-color: #3a6130;
}

/* State Selector Section */
.state-selector-section {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
}

.state-selector {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.state-label {
  margin-right: 10px;
  font-weight: 600;
}

.state-dropdown {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.state-info {
  background-color: #f5f9eb;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

/* Layout Options Section */
.layout-options {
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 20px;
}

.layout-info h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #4c7d3a;
}

.layout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.layout-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: transform 0.3s;
}

.layout-card:hover {
  transform: translateY(-5px);
}

.card-image-container {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.layout-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.layout-card:hover .layout-image {
  transform: scale(1.05);
}

.see-more-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #4c7d3a;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.see-more-btn:hover {
  background-color: #3a6130;
}

.download-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.download-img {
  width: 20px;
  height: 20px;
}

.card-content {
  padding: 1.5rem;
}

.layout-title {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #4c7d3a;
}

.layout-description {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.bird-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 1rem;
}

.bird-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70px;
  margin-bottom: 10px;
}

.bird-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4c7d3a;
  background-color: #f5f5f5; /* Fallback color if image fails to load */
}

.bird-name {
  font-size: 0.75rem;
  text-align: center;
  margin-top: 5px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Pagination Controls */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.5rem;
  gap: 1rem;
}

.pagination-btn {
  background-color: #4c7d3a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #3a6130;
}

.pagination-btn:disabled {
  background-color: #a0b598;
  cursor: not-allowed;
}

.page-indicator {
  font-weight: 600;
}

/* Modal Styles */
.layout-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  border-radius: 8px;
  overflow-y: auto;
  position: relative;
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  z-index: 10;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eaeaea;
}

.modal-header h2 {
  margin-bottom: 1rem;
  color: #4c7d3a;
}

.modal-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 4px;
}

.image-carousel {
  position: relative;
  margin-bottom: 1.5rem;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
}

.carousel-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}

.image-indicators {
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 15px;
  width: 100%;
}

.indicator {
  width: 12px;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
}

.indicator.active {
  background-color: #4c7d3a;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body h3 {
  margin: 1.5rem 0 0.75rem;
  color: #4c7d3a;
}

.modal-body p, .modal-body li {
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.modal-body ul {
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.modal-birds {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.modal-bird {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  margin: 0 10px 15px;
}

.modal-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4c7d3a;
  background-color: #f5f5f5; /* Fallback color if image fails to load */
  margin-bottom: 5px;
}

/* Next Step Button */
.next-step {
  text-align: center;
  margin-bottom: 3rem;
}

.guide-button {
  background-color: #4c7d3a;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.guide-button:hover {
  background-color: #3a6130;
}

/* Responsive Design */
@media (max-width: 768px) {
  .layout-title {
    font-size: 2.5rem;
  }
  
  .layout-grid {
    grid-template-columns: 1fr;
  }
  
  .bird-icons {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .layout-title {
    font-size: 2rem;
  }

  .layout-subtitle {
    font-size: 1rem;
  }

  .layout-banner {
    min-height: 300px;
  }
  
  .info-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .state-selector {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .state-label {
    margin-bottom: 0.5rem;
  }
}
</style>