<template>
  <div>
    <NavbarTwo />
    <div class="container mt-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Book Sections</h2>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search for sections..." 
          class="form-control form-control-sm w-25" 
        />
      </div>
      <div class="row">
        <div 
          class="col-md-4 mb-4" 
          v-for="(section, index) in filteredSections" 
          :key="index"
        >
          <div class="card" @click="viewBooks(section.name, section.id)">
            <div class="card-body">
              <div class="card-title d-flex justify-content-between align-items-center">
                <h5>{{ section.name }}</h5>
                <img 
                  :src="`/logos/${section.logo}`" 
                  alt="Section Logo" 
                  class="section-logo" 
                  @error="handleImageError($event)"
                >
              </div>
              <p class="card-text">{{ section.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarTwo from './NavbarTwo.vue';
import axios from 'axios';

export default {
  name: 'UdbBooks',
  data() {
    return {
      sections: [],
      searchQuery: ''
    };
  },
  components: {
    NavbarTwo
  },
  created() {
    this.fetchSections();
  },
  computed: {
    filteredSections() {
      return this.sections.filter(section =>
        section.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    async fetchSections() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/section');
        this.sections = response.data.map(section => ({
          ...section,
          logo: `${section.name.replace(/\s+/g, '')}.png`
        }));
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    },
    viewBooks(sectionName, sectionId) {
      this.$router.push({ name: 'SectionBooksUser', params: { sectionName, sectionId } });
    },
    handleImageError(event) {
      event.target.src = '/logos/default.png';
    }
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
</style>
