<!-- State Info Section -->
<section class="state-info">
  <h2>{{ selectedState }}</h2>
  <p><strong>Climate:</strong> {{ stateData[selectedState].climate }}</p>
  <p><strong>Soil Type:</strong> {{ stateData[selectedState].soil }}</p>
  <p><strong>Birdlife:</strong> {{ stateData[selectedState].birds }}</p>
  
  <!-- State Switch -->
  <select v-model="selectedState" @change="onStateChange">
    <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
  </select>
</section>
