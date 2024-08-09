<template>
  <div>
    <NavbarThree />
    <div class="container mt-5">
      <h2>Edit Section Details of {{ sectionName }}</h2>
      <form @submit.prevent="updateSection">
        <div class="mb-3">
          <label for="sectionName" class="form-label">Section Name</label>
          <input type="text" class="form-control" id="sectionName" v-model="section.name" required>
        </div>
        <div class="mb-3">
          <label for="sectionDescription" class="form-label">Description</label>
          <textarea class="form-control" id="sectionDescription" v-model="section.description" required></textarea>
        </div>
        <div class="d-flex justify-content-between end-buttons">
          <button type="submit" class="btn btn-primary">Update</button>
          <button type="button" class="btn btn-danger" @click="deleteSection">Delete</button>
          <button type="button" class="btn btn-secondary" @click="cancel">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import NavbarThree from './NavbarThree.vue';
import axios from 'axios';

export default {
  name: 'UpdateSection',
  props: {
    sectionId: String,
    sectionName: String
  },
  data() {
    return {
      section: {
        name: '',
        description: ''
      }
    };
  },
  components: {
    NavbarThree
  },
  created() {
    this.fetchSectionDetails();
  },
  methods: {
    fetchSectionDetails() {
      axios.get(`http://127.0.0.1:5000/api/section/`, {
        params: {
          name: this.sectionName
        }
      }).then(response => {
          if (response.data.length > 0) {
            this.section = response.data[0];
          }
          else
          {
            this.section = response.data;
          }
          console.log(this.section);
        })
        .catch(error => {
          console.error("There was an error fetching the section details!", error);
        });
    },
    updateSection() {
      const token = localStorage.getItem('token'); 
      axios.put(`http://127.0.0.1:5000/api/section/${this.sectionId}`, {
        name: this.section.name,
        description: this.section.description
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Section updated successfully', response);
        alert('Section updated successfully');
        this.$router.push({ name: 'LibDashbrd' });
      })
      .catch(error => {
        console.error('There was an error updating the section!', error);
        alert('Failed to update the section');
      });
    },
    deleteSection() {
      const token = localStorage.getItem('token'); 

      axios.delete(`http://127.0.0.1:5000/api/section/${this.sectionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Section deleted successfully', response);
        alert('Section deleted successfully');
        this.$router.push({ name: 'LibDashbrd' });
      })
      .catch(error => {
        console.error('There was an error deleting the section!', error);
        alert('Failed to delete the section');
      });
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
  margin-bottom: 20px;
}
</style>
