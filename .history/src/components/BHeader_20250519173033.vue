<template>
  <header class="header">
    <div class="container">
      <div v-if="showBackButton" class="back-button" @click="goBack">
        <img src="@/assets/back.png" alt="Back" class="back-icon" />
      </div>

      <div class="logo">
        <router-link to="/home">
          <img src="@/assets/images/logo.png" alt="Bird-Yard Logo" />
          <span class="logo-text">BirdYard</span>
        </router-link>
      </div>

      <nav class="nav-menu">
        <ul>
          <li><router-link to="/home">HOME</router-link></li>
          <!-- Garden Menu -->
          <li class="dropdown">
            <a href="#">GARDEN</a>
            <ul class="dropdown-menu">
              <li><router-link to="/plantadvice">Plants Advice</router-link></li>
              <li><router-link to="/layout">Garden Layout</router-link></li>
              <li><router-link to="/gardenguide">Garden Guide</router-link></li>
              <!-- New Link for Planting Planner -->
              <li v-if="allPlantNamesForPlanner.length > 0">
                <router-link
                  :to="{
                    name: 'PlantingCalendar',
                    params: { plantName: defaultPlannerPlantName },
                    query: {
                      recommendedPlantNames: allPlantNamesForPlanner.join(','),
                      hemisphere: 'southern', // Assuming a default, or make this dynamic if needed
                    },
                  }"
                >
                  Planting Planner
                </router-link>
              </li>
            </ul>
          </li>

          <li class="dropdown">
            <a href="#">BIRD</a>
            <ul class="dropdown-menu">
              <li><router-link to="/gardenguide">Garden Guide</router-link></li>
              <!-- Duplicate? -->
              <li><router-link to="/nesting">Nesting Guide</router-link></li>
              <li><router-link to="/bird">Bird Detection</router-link></li>
              <li><router-link to="/bio">Bird Migration</router-link></li>
            </ul>
          </li>

          <li><router-link to="/learninghub">LEARNING HUB</router-link></li>
          <li><router-link to="/contact">CONTACT US</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import allPlantsRaw from '@/assets/data/allPlants.json' // Import all plant data

export default {
  name: 'BHeader',
  data() {
    return {
      allPlantDataForPlanner: allPlantsRaw, // Store it in data for reactivity if needed, or directly in computed
    }
  },
  computed: {
    showBackButton() {
      return this.$route.path !== '/home' && this.$route.path !== '/'
    },
    allPlantNamesForPlanner() {
      if (this.allPlantDataForPlanner && this.allPlantDataForPlanner.length > 0) {
        return this.allPlantDataForPlanner.map((plant) => plant.plantName)
      }
      return []
    },
    defaultPlannerPlantName() {
      if (this.allPlantNamesForPlanner.length > 0) {
        return this.allPlantNamesForPlanner[0] // Default to the first plant in the list
      }
      return 'DefaultPlant' // Fallback, though ideally allPlantNamesForPlanner shouldn't be empty
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap');

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 0;
  z-index: 1000;
  background-color: rgba(10, 50, 0, 0.25);
  backdrop-filter: blur(5px);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  width: 90%;
  margin: 0 auto;
  padding: 0 20px;
}

.logo a {
  display: flex;
  align-items: center;
  color: #ffffff;
  text-decoration: none;
}

.logo img {
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 26px;
  letter-spacing: 0.5px;
  color: #ffffff;
}

.nav-menu ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-menu li {
  margin-left: 30px;
  position: relative;
}

.nav-menu a {
  color: #ffffff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-menu a:hover {
  color: #c2e59c;
}

.dropdown-menu {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: rgba(10, 50, 0, 0.95);
  padding: 10px 0;
  min-width: 200px;
  border-radius: 5px;
  z-index: 1001;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;

  display: flex;
  flex-direction: column;
}

.dropdown-menu li {
  margin: 0;
  white-space: nowrap;
}

.dropdown-menu a {
  display: block;
  padding: 12px 20px;
  color: #ffffff;
  font-size: 15px;
  text-decoration: none;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.dropdown-menu a:hover {
  background-color: #c2e59c;
  color: #0a3200;
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
}

.back-button {
  position: absolute;
  left: 30px;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: #c2e59c;
}

.back-icon {
  height: 26px;
  margin-right: 5px;
  font-size: 18px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: center;
  }

  .nav-menu ul {
    flex-direction: column;
    align-items: center;
  }

  .nav-menu li {
    margin: 10px 0;
    margin-left: 0;
  }

  .dropdown-menu {
    position: static;
    background-color: transparent;
    padding: 0;
    min-width: auto;
    border-radius: 0;
    opacity: 1;
    visibility: visible;
    transition: none;
  }

  .dropdown-menu a {
    padding: 8px 0;
  }

  .dropdown:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
  }

  .back-button {
    position: static;
    margin-bottom: 10px;
    align-self: flex-start;
    width: 100%;
  }
}
</style>
