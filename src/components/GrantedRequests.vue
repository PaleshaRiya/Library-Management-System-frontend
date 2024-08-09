<template>
  <NavbarThree />
  <div class="container mt-5">
    <div class="header-bar">
    <h2>Granted Requests</h2>
    <button class="btn btn-secondary mb-3" @click="goToRequests">View Requests</button>
    </div>
    <div class="request-bar" v-for="(request, index) in grantedRequests" :key="index" @click="openModal(request)">
      <div class="request-details">
        <div class="request-title">{{ request.bookName }}</div>
        <div class="request-userId">User Id {{ request.userId }}</div>
      </div>
      <div class="request-actions">
        <button class="btn btn-warning btn-sm" @click="revokeRequest(request.id)">Revoke</button>
      </div>
    </div>

    <div v-if="selectedRequest" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <p><strong>Username:</strong> {{ selectedRequest.username }}</p>
        <p><strong>Email:</strong> {{ selectedRequest.email }}</p>
        <p><strong>Book Title:</strong> {{ selectedRequest.bookName }}</p>
        <p><strong>Days Requested:</strong> {{ selectedRequest.daysRequested }}</p>
        <p><strong>Return Date:</strong> {{ selectedRequest.returnDate }}</p>
      </div>
    </div>
    
  </div>
</template>

<script>
import NavbarThree from './NavbarThree.vue';
import axios from 'axios';

export default {
  data() {
    return {
      grantedRequests: [],
      selectedRequest: null,
    };
  },
  components: {
    NavbarThree
  },
  created() {
    this.fetchGrantedRequests();
  },
  methods: {
    async fetchGrantedRequests() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/request');
        console.log(response);
        this.grantedRequests = response.data.filter(request => request.isApproved)
        .map(request => ({
            id: request.id,
            bookName: request.bookName,
            userId: request.userId,
            username: request.username,
            email: request.email,
            daysRequested: this.calculateDaysRequested(request.issueDate, request.returnDate),
            returnDate : request.returnDate,
          }));
        console.log(this.grantedRequests);
      } catch (error) {
        console.error('There was an error fetching the granted requests!', error);
      }
    },
    calculateDaysRequested(issueDate, returnDate) {
      const start = new Date(issueDate);
      const end = new Date(returnDate);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Calculate days between dates
    },
    openModal(request) {
      this.selectedRequest = { ...request }; // Clone request 
    },
    closeModal() {
      this.selectedRequest = null;
    },
    async revokeRequest(requestId) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://127.0.0.1:5000/api/request/${requestId}`, 
          { isRevoked: true , isApproved: false}, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        alert(`Request ${requestId} revoked.`);
        this.grantedRequests = this.grantedRequests.filter(request => request.id !== requestId);
      } catch (error) {
        console.error('There was an error revoking the request!', error);
        alert('Failed to revoke the request');
      }
    },
    goToRequests() {
      this.$router.push({ name: 'ReqList' });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.request-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  background-color: #f8f9fa;
  cursor: pointer;
}

.request-details {
  flex: 1;
  display: flex;
  justify-content: space-between;
}

.request-title, .request-userId {
  flex: 1;
  text-align: left;
}

.request-actions {
  display: flex;
  align-items: center;
}

.btn-warning {
  background-color: #f0ad4e;
  border-color: #eea236;
}

.btn-warning:hover {
  background-color: #ec971f;
  border-color: #d58512;
}

.btn-sm {
  padding: 0.25rem 1rem;
}

/* Modal Styles */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
