<template>
<NavbarThree />
  <div class="container mt-5">
    <h3>Add New Section</h3>
    <form @submit.prevent="addSection">
      <div class="mb-3">
        <label for="sectionName" class="form-label">Section Name</label>
        <input type="text" class="form-control" id="sectionName" v-model="section.name" required>
      </div>
      <div class="mb-3">
        <label for="sectionDate" class="form-label">Creation Date</label>
        <input type="date" class="form-control" id="sectionDate" v-model="section.date" readonly>
      </div>
      <div class="mb-3">
        <label for="sectionDescription" class="form-label">Description</label>
        <textarea class="form-control" id="sectionDescription" v-model="section.description" rows="3" required></textarea>
      </div>
      <div class="mb-3">
        <label for="sectionLogo" class="form-label">Logo (Optional)</label>
        <input type="file" class="form-control" id="sectionLogo" @change="onFileChange">
      </div>
      <div class="d-flex justify-content-between end-buttons">
        <button type="submit" class="btn btn-primary">Add</button>
        <button type="button" class="btn btn-secondary" @click="cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import NavbarThree from './NavbarThree.vue';
import axios from 'axios';

export default {
  data() {
    return {
      section: {
        name: '',
        date: this.getCurrentDate(),
        description: '',
        logo: null
      }
    };
  },
  components: {
    NavbarThree
  },
  methods: {
    getCurrentDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.section.logo = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.section.logo = null;
      }
    },
    async addSection() {
      try {
        const data = {
          name: this.section.name,
          description: this.section.description
        };
        const token = localStorage.getItem('token');
        await axios.post('http://127.0.0.1:5000/api/section/', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        maxRedirects: 0 
        });
        alert('New section added successfully');
        this.$router.push({ name: 'LibDashbrd' });
      } catch (error) {
        console.error('There was an error!', error);
        alert('Failed to add new section');
      }
    },
    cancel() {
      this.$router.push({ name: 'LibDashbrd' });
    }
  }
};
</script>


<style scoped>
.form-label {
  font-weight: bold;
}
.end-buttons {
    margin-bottom : 20px;
}
</style>
