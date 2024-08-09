<template>
  <NavbarThree />
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-4 mb-4" v-for="(section, index) in sections" :key="index">
        <div class="card" @click="viewBooks(section.name, section.id)">
          <div class="card-body">
            <div class="card-title d-flex justify-content-between align-items-center">
              <h5>{{ section.name }}</h5>
              <img 
                  :src="`/logos/${section.logo}`" 
                  alt="Section Logo" 
                  class="section-logo" 
                  @error="handleImageError($event)">
            </div>
            <p class="card-text">{{ section.description }}</p>
            <p class="card-text"><small class="text-muted">{{ section.date }}</small></p>
            <button class="btn btn-primary" @click.stop="addBook(section.name, section.id)">Add Book</button>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card add-section-card" @click="goToAddSectionPage">
          <div class="card-body d-flex justify-content-center align-items-center">
            <i class="fas fa-plus fa-3x"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import NavbarThree from './NavbarThree.vue';

export default {
  name: 'LibDashbrd',
  data() {
    return {
      sections: []
    };
  },
  components: {
    NavbarThree
  },
  methods: {
    async fetchSections() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/section');
        this.sections = response.data.map(section => ({
          ...section,
          logo: `${section.name.replace(/\s+/g, '')}.png` // Create logo name dynamically
        }));
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    },
    viewBooks(sectionName, sectionId) {
      this.$router.push({ name: 'SectionBooks', params: { sectionName, sectionId } });
    },
    handleImageError(event) {
      event.target.src = '/logos/default.png';
    },
    addBook(sectionName, sectionId) {
      this.$router.push({ name: 'AddBook', params: { sectionName, sectionId } });
    },
    goToAddSectionPage() {
      this.$router.push({ name: 'AddSection' });
    }
  },
  mounted() {
    this.fetchSections();
  }
};
</script>

<style scoped>
.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}
.section-logo {
  width: 50px;
  height: 50px;
}
.add-section-card {
  cursor: pointer;
  background-color: #f8f9fa;
  border: 2px dashed #6c757d;
}
</style>
