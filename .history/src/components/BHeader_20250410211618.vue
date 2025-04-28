<template>
  <header class="header">
    <div class="container">
      <div v-if="showBackButton" class="back-button" @click="goBack">
        <img src="@/assets/back.png" alt="Back" class="back-icon" />
      </div>

      <div class="logo">
        <router-link to="/">
          <img src="@/assets/images/logo.png" alt="Bird-Yard Logo" />
          <span class="logo-text">BirdYard</span>
        </router-link>
      </div>
      <nav class="nav-menu">
        <ul>
          <li><router-link to="/home">HOME</router-link></li>
          <li><router-link to="/about">ABOUT US</router-link></li>
          <li><router-link to="/contact">CONTACT US</router-link></li>
          <li><router-link to="/bird">BIRDS DETECTION</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'BHeader',
  computed: {
    showBackButton() {
      return this.$route.path !== '/home' && this.$route.path !== '/'
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

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: center;
  }

  .nav-menu {
    margin-top: 15px;
  }

  .nav-menu ul {
    flex-direction: column;
    align-items: center;
  }

  .nav-menu li {
    margin: 10px 0;
    margin-left: 0;
  }
}
.back-button {
  position: absolute;
  left: 20px;
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
  height: 16px;
  margin-right: 5px;
  font-size: 18px;
}

@media (max-width: 768px) {
  .back-button {
    position: static;
    margin-bottom: 10px;
    align-self: flex-start;
    width: 100%;
  }
}
</style>
