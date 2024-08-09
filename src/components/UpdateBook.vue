<template>
  <div>
    <NavbarThree />
    <div class="container mt-5">
      <h2>Edit Book Details of {{ bookName }}</h2>
      <form @submit.prevent="updateBook">
        <div class="mb-3">
          <label for="bookTitle" class="form-label">Book Title</label>
          <input type="text" class="form-control" id="bookTitle" v-model="book.name" required>
        </div>
        <div class="mb-3">
          <label for="bookAuthor" class="form-label">Author</label>
          <input type="text" class="form-control" id="bookAuthor" v-model="book.author" required>
        </div>
        <div class="mb-3">
          <label for="bookPrologue" class="form-label">Prologue</label>
          <textarea class="form-control" id="bookPrologue" v-model="book.prologue" required></textarea>
        </div>
        <div class="mb-3">
          <label for="bookPrice" class="form-label">Price</label>
          <input type="number" class="form-control" id="bookPrice" v-model="book.price" required>
        </div>
        <div class="mb-3">
          <label for="bookContent" class="form-label">Content Link</label>
          <input type="url" class="form-control" id="bookContent" v-model="book.content" required>
        </div>
        <div class="d-flex justify-content-between end-buttons">
          <button type="submit" class="btn btn-primary">Update</button>
          <button type="button" class="btn btn-danger" @click="deleteBook">Delete</button>
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
  name: 'UpdateBook',
  props: {
    bookId: String,
    bookName: String
  },
  data() {
    return {
      book: {
        name: '',
        author: '',
        prologue: '',
        price: 0,
        content: ''
      }
    };
  },
  components: {
    NavbarThree
  },
  created() {
    this.fetchBookDetails();
  },
  methods: {
    fetchBookDetails() {
      axios.get(`http://127.0.0.1:5000/api/ebook`, {
        params: {
          name: this.bookName
        }
      }).then(response => {
          if (response.data.length > 0) {
            this.book = response.data[0];
          }
          else
          {
            this.book = response.data;
          }
          console.log(this.book);
        })
        .catch(error => {
          console.error("There was an error fetching the book details!", error);
        });
    },
    updateBook() {
      const token = localStorage.getItem('token'); 

      axios.put(`http://127.0.0.1:5000/api/ebook/${this.bookId}`, {
        name: this.book.name,
        content: this.book.content,
        author: this.book.author,
        prologue: this.book.prologue,
        price: this.book.price
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Book updated successfully', response);
        alert('Book updated successfully');
        this.$router.push({ name: 'LibDashbrd' });
      })
      .catch(error => {
        console.error('There was an error updating the book!', error);
        alert('Failed to update the book');
      });
    },
    deleteBook() {
      const token = localStorage.getItem('token'); 

      axios.delete(`http://127.0.0.1:5000/api/ebook/${this.bookId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Book deleted successfully', response);
        alert('Book deleted successfully');
        this.$router.push({ name: 'LibDashbrd' });
      })
      .catch(error => {
        console.error('There was an error deleting the book!', error);
        alert('Failed to delete the book');
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
