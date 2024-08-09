<template>
  <NavbarThree />
  <div class="container mt-5">
    <h2>Add Book to {{ sectionName }}</h2>
    <form @submit.prevent="addBook">
      <div class="mb-3">
        <label for="bookTitle" class="form-label">Book Title</label>
        <input type="text" class="form-control" id="bookTitle" v-model="book.title" required>
      </div>
      <div class="mb-3">
        <label for="bookAuthor" class="form-label">Author</label>
        <input type="text" class="form-control" id="bookAuthor" v-model="book.author" required>
      </div>
      <div class="mb-3">
        <label for="bookContent" class="form-label">Content Link</label>
        <input type="url" class="form-control" id="bookContent" v-model="book.content" required>
      </div>
      <div class="mb-3">
        <label for="bookPrologue" class="form-label">Prologue</label>
        <input type="text" class="form-control" id="bookPrologue" v-model="book.prologue" required>
      </div>
      <div class="mb-3">
        <label for="bookPrice" class="form-label">Price</label>
        <input type="number" class="form-control" id="bookPrice" v-model="book.price" required>
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
  props: {
    sectionName: String,
    sectionId: String
  },
  data() {
    return {
      book: {
        title: '',
        author: '',
        content: '',
        prologue : '',
        price : 0,
        sectionId: this.sectionId 
      }
    };
  },
  components: {
    NavbarThree
  },
  methods: {
    addBook() {
      try {
      const token = localStorage.getItem('token'); 
      axios.post('http://127.0.0.1:5000/api/ebook/', {
        name: this.book.title,
        content: this.book.content,
        author: this.book.author,
        prologue: this.book.prologue,
        price: this.book.price,
        sectionId: this.book.sectionId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        alert('New book added successfully');
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
  margin-bottom: 20px;
}
</style>
