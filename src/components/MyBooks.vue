<template>
  <NavbarTwo />
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>My Books</h2>
      <input type="text" v-model="searchQuery" placeholder="Search for books..." class="form-control form-control-sm w-25"/>
    </div>
    
    <div class="my-books-section">
      <h4>Current Books</h4>
      <div v-if="filteredCurrentBooks.length === 0">No current books found.</div>
      <div v-for="book in filteredCurrentBooks" :key="book.id" class="card mb-3">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 class="card-title">{{ book.bookName }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Return Date : {{ formatDate(book.returnDate) }}</h6>
          </div>
          <button class="btn btn-primary" @click="returnBook(book.id)">Return</button>
        </div>
      </div>
    </div>

    <div class="completed-books-section mt-5">
      <h4>Completed Books</h4>
      <div v-if="filteredCompletedBooks.length === 0">No completed books found.</div>
      <div v-for="book in filteredCompletedBooks" :key="book.id" class="card mb-3">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 class="card-title">{{ book.bookName }}</h5>
          </div>
          <button class="btn btn-secondary" @click="openFeedbackModal(book)">Provide Feedback</button>
        </div>
      </div>
    </div>

    <!-- Feedback Modal -->
    <div v-if="showFeedbackModal" class="modal-overlay" @click="closeFeedbackModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">Provide Feedback</h5>
          <button type="button" class="close" @click="closeFeedbackModal">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitFeedback">
            <div class="form-group">
              <label for="feedbackMessage">Feedback</label>
              <textarea v-model="feedbackMessage" class="form-control" id="feedbackMessage" :placeholder="existingFeedback" required></textarea>
            </div>
            <div class="form-group mt-3">
              <label for="feedbackRating">Rating</label>
              <div class="stars">
                <span v-for="n in 5" :key="n" @click="feedbackRating = n" :class="['star', { 'filled': n <= feedbackRating }]">
                  ★
                </span>
              </div>
            </div>
            <button type="submit" class="btn btn-primary mt-3">Submit</button>
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
  data() {
    return {
      searchQuery: '',
      currentBooks: [],
      completedBooks: [],
      showFeedbackModal: false,
      feedbackMessage: '',
      feedbackRating: 0,
      selectedBook: null,
      existingFeedback: ''
    };
  },
  components: {
    NavbarTwo
  },
  computed: {
    filteredCurrentBooks() {
      return this.currentBooks.filter(book => 
        book.bookName.toLowerCase().includes(this.searchQuery.toLowerCase())
        
      );
    },
    filteredCompletedBooks() {
      return this.completedBooks.filter(book => 
        book.bookName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    async fetchData() {
      try {
        console.log("hi");
        const user_id = localStorage.getItem('user_id');
        const response = await axios.get(`http://127.0.0.1:5000/api/request`,{
          params : {
            userId : user_id
          }
        });
        const books = response.data;
        this.currentBooks = books.filter(book => book.isApproved === 1 && book.isReturned === 0);
        this.completedBooks = books.filter(book => book.isApproved === 1 && book.isReturned === 1);
        console.log(this.currentBooks);
        console.log(this.completedBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    },
    async returnBook(requestId) {
      console.log(`Returning book with request ID: ${requestId}`);
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://127.0.0.1:5000/api/request/return/${requestId}`, { isReturned: true },
        {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        }
        );
        this.fetchData(); // Refresh the book lists
      } catch (error) {
        console.error('Error returning book:', error);
      }
    },
    async openFeedbackModal(book) {
      this.selectedBook = book;
      this.showFeedbackModal = true;
      try {
        const userId = localStorage.getItem('user_id');
        const response = await axios.get(`http://127.0.0.1:5000/api/feedback`, {
          params: {
            bookId: book.bookId,
            userId: userId
          }
        });
        const feedback = response.data[0];
        console.log(feedback);
        if (feedback) {
          this.existingFeedback = feedback.feedback;
          this.feedbackRating = feedback.rating;
        } else {
          this.existingFeedback = '';
          this.feedbackRating = 0;
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    },
    closeFeedbackModal() {
      this.showFeedbackModal = false;
      this.feedbackMessage = '';
      this.feedbackRating = 0;
      this.selectedBook = null;
      this.existingFeedback = '';
    },
    async submitFeedback() {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`http://127.0.0.1:5000/api/feedback/`, 
        {
          id :this.selectedBook.id, //request id
          feedback: this.feedbackMessage,
          rating: this.feedbackRating
        },
        {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        }
        );
        alert("Feedback Submitted!");
        this.closeFeedbackModal(); 
        this.fetchData(); 
      } catch (error) {
        console.error('Error submitting feedback:', error);
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const day = date.getDate();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      // Add ordinal suffix
      const ordinalSuffix = (day) => {
        if (day > 3 && day < 21) return 'th'; // 4th to 20th
        switch (day % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
      return `${day}${ordinalSuffix(day)} ${month} ${year}`;
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
.card {
  padding: 5px;
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

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.stars {
  display: flex;
  gap: 5px;
}

.star {
  font-size: 2rem;
  color: #ddd;
  cursor: pointer;
}

.star.filled {
  color: #f39c12;
}
</style>