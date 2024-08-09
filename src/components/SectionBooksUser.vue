<template>
  <div>
    <NavbarTwo />
    <div class="container mt-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>{{ sectionName }} Books</h2>
        <input type="text" v-model="searchQuery" placeholder="Search for books..." class="form-control form-control-sm w-25" />
      </div>
      <div class="book-list">
        <div v-if="filteredBooks.length === 0">No books found.</div>
        <div class="book-item" v-for="(book, index) in filteredBooks" :key="index">
          <div class="book-details">
            <span class="book-title">{{ book.name }}</span>
            <span class="book-author">{{ book.author }}</span>
            <button class="btn btn-primary" @click="openRequestModal(book)">Request</button>
            <button class="btn btn-primary" @click="openPaymentPortal(book.name, book.id)">Buy</button>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-between mt-3">
        <button class="btn btn-secondary" @click="goBack"> Back </button>
      </div>
    </div>

    <!-- Request Modal -->
    <div v-if="showRequestModal" class="modal-overlay" @click="closeRequestModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header justify-center">
          <h5 class="modal-title text-center">Request Book</h5>
          <button type="button" class="close" @click="closeRequestModal">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitRequest">
            <div class="form-group">
              <label for="bookName">Book Name</label>
              <input type="text" v-model="selectedBook.name" class="form-control" id="bookName" readonly />
            </div>
            <div class="form-group mt-3">
              <label for="requestDays">Number of Days</label>
              <input type="number" v-model.number="requestDays" class="form-control" id="requestDays" min="1" required />
            </div>
            
            <button type="submit" class="btn btn-primary mt-3 btn-center">Submit Request</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import NavbarTwo from './NavbarTwo.vue';

export default {
  name: 'SectionBooksUser',
  props: {
    sectionName: String,
    sectionId: String
  },
  components: {
    NavbarTwo
  },
  data() {
    return {
      searchQuery: '',
      books: [],
      showRequestModal: false,
      selectedBook: null,
      requestDays: 1,
      issueDate: '',
      returnDate: '',
      currentBooks: 0,
    };
  },
  created() {
    this.fetchBooks();
    this.fetchUserInfo();
  },
  computed: {
    filteredBooks() {
      return this.books.filter(book => {
        const title = book.name ? book.name.toLowerCase() : '';
        const author = book.author ? book.author.toLowerCase() : '';
        const query = this.searchQuery.toLowerCase();
        return title.includes(query) || author.includes(query);
      });
    }
  },
  methods: {
    fetchBooks() {
    console.log(this.sectionId)
      axios.get(`http://127.0.0.1:5000/api/ebook`, {
        params: {
          sectionId: this.sectionId
        }
      })
      .then(response => {
        this.books = response.data.filter(book => book.id !== null);
      })
      .catch(error => {
        console.error("There was an error fetching the books!", error);
      });
    },
    fetchUserInfo(){
      const userId = localStorage.getItem('user_id');
      axios.get(`http://127.0.0.1:5000/api/users`, {
        params: { id: userId }
      })
      .then(response => {
        const userInfo = response.data[0];
        this.currentBooks = userInfo.currentBooks;
      })
      .catch(error => {
        console.error("There was an error fetching the user info!", error);
      });
    },
    openRequestModal(book) {
      if(this.currentBooks <5)
      {
      this.selectedBook = book;
      this.showRequestModal = true;
      this.issueDate = new Date().toISOString().split('T')[0]; 
      this.calculateReturnDate();
      }
      else
      {
        alert("You cannot request more than 5 books at a time.");
      }
    },
    closeRequestModal() {
      this.showRequestModal = false;
      this.requestDays = 1;
      this.issueDate = '';
      this.returnDate = '';
      this.selectedBook = null;
    },
    calculateReturnDate() {
      if (this.requestDays > 0) {
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + this.requestDays);
        this.returnDate = returnDate.toISOString().split('T')[0];
      }
    },
    submitRequest() {
    const token = localStorage.getItem('token'); 
    const user_id = localStorage.getItem('user_id');
    const requestBody = {
      userId: user_id,
      bookId: this.selectedBook.id,
      issueDate: this.issueDate, 
      returnDate: this.returnDate 
    };
    
    axios.post('http://127.0.0.1:5000/api/request/', requestBody, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Request submitted successfully', response.data);
      alert("Book requested submitted !");
      this.closeRequestModal();
    })
    .catch(error => {
      console.error("There was an error submitting the request!", error);
    });
  },
  openPaymentPortal(bookName,bookId) {
      this.$router.push({ name: 'PaymentPortal' ,params: { bookName, bookId}});
  },
  goBack() {
      this.$router.push({ name: 'UdbBooks' });
  },
  },
  watch: {
    requestDays() {
      this.calculateReturnDate();
    }
  }
};
</script>

<style scoped>
.book-list {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.book-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: #f8f9fa;
}

.book-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.book-title {
  flex: 3;
  font-size: 1.2rem;
  font-weight: bold;
  padding-right: 20px;
}

.book-author {
  flex: 2;
  font-size: 1rem;
  padding-right: 20px;
}

.btn-primary {
  flex: 0.5;
  border: none;
  margin :10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header .modal-title {
  margin: 0 auto; 
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.text-center {
  text-align: center;
}

.btn-center {
  display: block;
  margin: 0 auto; 
}
</style>
