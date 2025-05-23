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

      <!-- Mobile menu toggle button -->
      <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
        <span class="hamburger-line" :class="{ active: isMobileMenuOpen }"></span>
        <span class="hamburger-line" :class="{ active: isMobileMenuOpen }"></span>
        <span class="hamburger-line" :class="{ active: isMobileMenuOpen }"></span>
      </button>

      <nav class="nav-menu" :class="{ 'mobile-open': isMobileMenuOpen }">
        <ul>
          <li><router-link to="/home" @click="closeMobileMenu">HOME</router-link></li>

          <!-- Garden Menu -->
          <li class="dropdown" :class="{ 'mobile-dropdown-open': openDropdown === 'garden' }">
            <a href="#" @click.prevent="toggleDropdown('garden')">GARDEN</a>
            <ul class="dropdown-menu">
              <li>
                <router-link to="/plantadvice" @click="closeMobileMenu">Plants Advice</router-link>
              </li>
              <li>
                <router-link to="/layout" @click="closeMobileMenu">Garden Layout</router-link>
              </li>
              <li>
                <router-link to="/gardenguide" @click="closeMobileMenu">Garden Guide</router-link>
              </li>
              <!-- New Link for Planting Planner -->
              <li v-if="allPlantNamesForPlanner.length > 0">
                <router-link
                  :to="{
                    name: 'PlantingCalendar',
                    params: { plantName: defaultPlannerPlantName },
                    query: {
                      recommendedPlantNames: allPlantNamesForPlanner.join(','),
                      hemisphere: 'southern',
                    },
                  }"
                  @click="closeMobileMenu"
                >
                  Planting Planner
                </router-link>
              </li>
            </ul>
          </li>

          <li class="dropdown" :class="{ 'mobile-dropdown-open': openDropdown === 'bird' }">
            <a href="#" @click.prevent="toggleDropdown('bird')">BIRD</a>
            <ul class="dropdown-menu">
              <li>
                <router-link to="/gardenguide" @click="closeMobileMenu">Garden Guide</router-link>
              </li>
              <li>
                <router-link to="/nesting" @click="closeMobileMenu">Nesting Guide</router-link>
              </li>
              <li><router-link to="/bio" @click="closeMobileMenu">Bird Migration</router-link></li>
              <li><router-link to="/bird" @click="closeMobileMenu">Bird Detection</router-link></li>
            </ul>
          </li>

          <li>
            <router-link to="/learninghub" @click="closeMobileMenu">LEARNING HUB</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import allPlantsRaw from '@/assets/data/allPlants.json'

export default {
  name: 'BHeader',
  data() {
    return {
      allPlantDataForPlanner: allPlantsRaw,
      isMobileMenuOpen: false,
      openDropdown: null,
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
        return this.allPlantNamesForPlanner[0]
      }
      return 'DefaultPlant'
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
      if (!this.isMobileMenuOpen) {
        this.openDropdown = null
      }
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
      this.openDropdown = null
    },
    toggleDropdown(dropdownName) {
      this.openDropdown = this.openDropdown === dropdownName ? null : dropdownName
    },
  },
  mounted() {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.isMobileMenuOpen = false
        this.openDropdown = null
      }
    })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
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
  padding: 15px 0;
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
  position: relative;
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

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1002;
}

.hamburger-line {
  width: 25px;
  height: 3px;
  background-color: #ffffff;
  margin: 3px 0;
  transition: 0.3s;
  transform-origin: center;
}

.hamburger-line.active:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-line.active:nth-child(2) {
  opacity: 0;
}

.hamburger-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
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
  display: flex;
  align-items: center;
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
  left: 0px;
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
  .header {
    padding: 10px 0;
  }

  .container {
    padding: 0 15px;
  }

  .logo-text {
    font-size: 22px;
  }

  .logo img {
    height: 35px;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .nav-menu {
    position: fixed;
    top: 100%;
    left: 0;
    width: 100%;
    height: calc(100vh - 80px);
    background-color: rgba(10, 50, 0, 0.98);
    backdrop-filter: blur(10px);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    overflow-y: auto;
    z-index: 1000;
  }

  .nav-menu.mobile-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-menu ul {
    flex-direction: column;
    padding: 30px 20px;
    height: 100%;
    align-items: stretch;
  }

  .nav-menu li {
    margin: 0 0 20px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 20px;
  }

  .nav-menu li:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .nav-menu > ul > li > a {
    font-size: 18px;
    padding: 15px 0;
    justify-content: space-between;
  }

  .dropdown-menu {
    position: static;
    opacity: 0;
    visibility: hidden;
    background-color: rgba(255, 255, 255, 0.1);
    margin-top: 15px;
    border-radius: 8px;
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .mobile-dropdown-open .dropdown-menu {
    opacity: 1;
    visibility: visible;
    max-height: 300px;
    padding: 15px 0;
  }

  .dropdown-menu a {
    padding: 12px 20px;
    font-size: 16px;
    border-left: 3px solid transparent;
  }

  .dropdown-menu a:hover {
    border-left-color: #c2e59c;
    background-color: rgba(194, 229, 156, 0.1);
  }

  .dropdown:hover .dropdown-menu {
    opacity: 0;
    visibility: hidden;
  }

  .mobile-dropdown-open .dropdown-menu {
    opacity: 1 !important;
    visibility: visible !important;
    max-height: 500px;
    padding: 15px 0;
  }

  .back-button {
    position: static;
    order: -1;
    left: auto;
    margin-right: auto;
  }

  .back-icon {
    height: 24px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }

  .logo-text {
    font-size: 20px;
  }

  .logo img {
    height: 30px;
  }

  .nav-menu ul {
    padding: 20px 15px;
  }

  .nav-menu > ul > li > a {
    font-size: 16px;
  }
}
</style>
