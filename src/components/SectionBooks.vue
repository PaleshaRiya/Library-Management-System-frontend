<template>
  <div>
    <NavbarThree />
    <div class="container mt-5">
      <h2>{{ sectionName }} Books</h2>
      <div class="row">
        <div class="col-md-4 mb-4" v-for="(book, index) in books" :key="index">
          <div class="card" @click="viewBook(book.id, book.name)">
            <div class="card-body">
              <h5 class="card-title">{{ book.name }}</h5>
              <p class="card-text">    - {{ book.author }}</p>
              <p class="card-text">{{ book.prologue }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-between mt-3">
        <button class="btn btn-secondary" @click="goBack">Back to Dashboard</button>
        <button class="btn btn-primary" @click="editSection">Edit Section</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import NavbarThree from './NavbarThree.vue';

export default {
  name: 'SectionBooks',
  props: {
    sectionName: String,
    sectionId: String
  },
  data() {
    return {
      books: []  
    };
  },
  components: {
    NavbarThree
  },
  created() {
    this.fetchBooks();
  },
  methods: {
    fetchBooks() {
      console.log(this.sectionId);
      axios.get(`http://127.0.0.1:5000/api/ebook`, {
        params: {
          sectionId: this.sectionId
        }
      })
      .then(response => {
        this.books = response.data.filter(book => book.id !== null);
        console.log(this.books);
      })
      .catch(error => {
        console.error("There was an error fetching the books!", error);
      });
    },
    viewBook(bookId, bookName) {
      this.$router.push({ name: 'UpdateBook', params: { bookId, bookName } });
    },
    goBack() {
      this.$router.push({ name: 'LibDashbrd' });
    },
    editSection() {
      this.$router.push({ name: 'UpdateSection', params: { sectionName: this.sectionName, sectionId: this.sectionId } });
    }
  }
};
</script>

<style scoped>
.card {
  cursor: pointer; 
}
.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}
</style>
