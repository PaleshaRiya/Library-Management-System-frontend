<template>
  <div>
    <NavbarOne />
    <header class="hero-section">
      <div class="hero-image"></div>
      <div class="hero-content">
        <h1>Welcome to Our E-Library</h1>
        <p>Explore a vast collection of books and resources at your fingertips.</p>
      </div>
    </header>
    
    </div>
</template>

<script>
import NavbarOne from './NavbarOne.vue';

export default {
  name: 'HomePage',
  components: {
    NavbarOne
  },
  data() {
    return {
      currentIndex: 0
    };
  }
}
</script>

<style scoped>
.hero-section {
  display: flex;
  align-items: center;
  padding: 19px;
  background-color: white;
}

.hero-image {
  flex: 1;
  background-image: url('../../public/Library.png');
  background-size: cover;
  background-position: center;
  height: 400px; 
  border-radius: 8px; 
}

.hero-content {
  flex: 0.9;
  text-align: center;
  padding: 20px;
  color: #00008B;
}

.hero-content h1 {
  font-size: 2.6rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
}

</style>
