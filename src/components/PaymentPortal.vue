<template>
  <div class="container mt-5">
    <div class="temp">
    <h2>Payment Portal</h2>
    <button class="btn btn-secondary" @click="goBack">Back</button>
    </div>
    <div v-if="book">
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">{{ book.name }}</h5>
          <h6 class="card-subtitle mb-2 text-muted">by {{ book.author }}</h6>
          <p class="card-text">{{ book.prologue }}</p>
          <p><strong>Price:</strong> ${{ book.price }}</p>
        </div>
      </div>
      
      <button class="btn btn-success mb-3" @click="makePayment">Make Payment</button>
    </div>
    
    <div v-else>
      <p>Loading book details...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    bookId: String,
    bookName: String,
  },
  data() {
    return {
      book: null
    };
  },
  async created() {
    await this.fetchBookDetails();
  },
  methods: {
    async fetchBookDetails() {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/ebook`, {
          params: {
            id: this.bookId
          }
        });
        this.book = response.data[0];
        console.log('Book details fetched:', this.book);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    },
    async makePayment() {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('user_id');

            // Current date in yyyy-mm-dd format
            const issueDate = new Date().toISOString().split('T')[0];

            // Creating the request body
            const requestBody = {
                userId: userId,
                bookId: this.bookId,
                issueDate: issueDate,
                returnDate: "2999-12-31",
                isBought: 1
            };

            // Making the POST request
            const response = await axios.post(`http://127.0.0.1:5000/api/request/`, requestBody, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201) {
                alert(`Payment of $${this.book.price} for "${this.book.name}" was successful!`);
            } else {
                alert(`Payment failed. Please try again.`);
            }
            this.$router.go(-1);
        } catch (error) {
            console.error('Error during payment:', error);
            alert(`Payment failed due to an error. Please try again.`);
        }
    },
    goBack() {
      this.$router.go(-1); // navigate back to the previous page in the browser history
    }
  }
};
</script>

<style scoped>
.temp {
    display:flex;
    margin :20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
}

.card {
  padding: 10px;
}

.btn-success {
  display: block;
  width: 100%;
  font-size: 1.2rem;
}

.btn-secondary {
  display: block;
  width: 20%;
  font-size: 1.2rem;
  margin-left:200px;
}
</style>
