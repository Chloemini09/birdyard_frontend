<template>
  <div class="about-us">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>About Bird-Yard</h1>
        <p class="subtitle">Creating bird-friendly backyards since 2015</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="content">
      <div class="container">
        <div class="about-grid">
          <div class="about-text">
            <h2>Our Mission</h2>
            <p>
              At Bird-Yard, we're dedicated to guiding you in cultivating gardens that are not only
              beautiful, but safe, sustainable sanctuaries for local wildlife. From native plant
              recommendations to habitat-friendly landscaping tips, Bird-Yard is your partner in
              preserving biodiversity—one backyard at a time.
            </p>

            <h2>Our Story</h2>
            <p>
              Established with a love for nature and a mission to protect what sings in our skies,
              Bird-Yard helps people transform everyday backyards into thriving bird habitats. Our
              journey began when our founder noticed the decline of local bird populations and
              decided to make a difference, starting with creating bird-friendly spaces in
              residential areas.
            </p>

            <h2>Our Approach</h2>
            <p>
              We believe in a holistic, science-based approach to backyard ecosystem design. Our
              4-step process guides homeowners through planning, preparation, planting, and
              maintenance—creating sustainable habitats that support local bird species through
              every season.
            </p>
          </div>

          <div class="about-image">
            <img src="@/assets/images/aboutus.png" alt="Bird-Yard Team" class="main-image" />
            <div class="value-blocks">
              <div class="value-block">
                <h3>Sustainability</h3>
                <p>We promote eco-friendly practices that benefit both wildlife and people.</p>
              </div>
              <div class="value-block">
                <h3>Education</h3>
                <p>We empower homeowners with knowledge about local ecosystems.</p>
              </div>
              <div class="value-block">
                <h3>Community</h3>
                <p>We build networks of bird-friendly neighborhoods across the country.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Call to Action -->
    <section class="cta">
      <div class="container">
        <h2>Ready to Create Your Bird Paradise?</h2>
        <p>
          Join thousands of homeowners who have transformed their yards into thriving bird habitats.
        </p>
        <router-link to="/home" class="cta-button">Get Started Today</router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AboutUs',
}
</script>

<style scoped>
.about-us {
  padding-top: 0; /* Space for fixed header */
}

.hero {
  background-color: var(--color-primary);
  color: white;
  padding: 80px 0;
  text-align: center;
  background-image: url('@/assets/images/aboutbanner.png');
  background-size: 100% auto;
  min-height: 400px;
  background-position: center 15%;
}

.hero h1 {
  font-size: 3rem;
  margin-top: 80px;
  margin-bottom: 4rem;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 300;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.content {
  padding: 80px 0;
  background-color: var(--color-bg-light);
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: start;
}

.about-text h2 {
  color: var(--color-primary);
  font-size: 1.8rem;
  margin-bottom: 1rem;
  margin-top: 2rem;
}

.about-text h2:first-child {
  margin-top: 0;
}

.about-text p {
  margin-bottom: 1.5rem;
  line-height: 1.8;
}

.about-image {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.value-blocks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.value-block {
  background-color: #eaf4e5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.value-block h3 {
  color: var(--color-primary);
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.value-block p {
  font-size: 0.9rem;
  line-height: 1.6;
}

.team {
  padding: 80px 0;
  background-color: white;
  text-align: center;
}

.team h2 {
  font-size: 2.2rem;
  color: var(--color-primary);
  margin-bottom: 50px;
}

.team-members {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin: 0 auto;
}

.team-member {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.member-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-member:hover .member-photo {
  transform: scale(1.05);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.member-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.team-member h3 {
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: var(--color-primary);
}

.team-member p {
  color: #666;
  font-size: 0.9rem;
}

.cta {
  background-color: var(--color-secondary);
  color: var(--color-primary);
  text-align: center;
  padding: 80px 0;
}

.cta h2 {
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.cta p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  display: inline-block;
  background-color: var(--color-primary);
  color: white;
  padding: 15px 30px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background-color: #072500;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

@media (max-width: 992px) {
  .about-grid {
    grid-template-columns: 1fr;
  }

  .value-blocks {
    grid-template-columns: repeat(3, 1fr);
  }

  .team-members {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .value-blocks {
    grid-template-columns: 1fr;
  }

  .team-members {
    grid-template-columns: 1fr;
    max-width: 350px;
    margin: 0 auto;
  }

  .cta h2 {
    font-size: 1.8rem;
  }

  .cta p {
    font-size: 1rem;
  }
}
</style>
