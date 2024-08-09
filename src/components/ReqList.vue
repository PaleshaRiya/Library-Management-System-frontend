<template>
  <NavbarThree />
  <div class="container mt-5">
    <div class="header-bar">
    <h2>Book Requests</h2>
    <button class="btn btn-secondary mb-3" @click="goToGrantedRequests">View Granted Requests</button>
    </div>
    <div class="request-bar" v-for="(request, index) in requests" :key="index" @click="openModal(request)">
      <div class="request-details">
        <div class="request-title">{{ request.bookName }}</div>
        <div class="request-userId">User Id {{ request.userId }}</div>
      </div>
      <div class="request-actions">
        <button class="btn btn-success btn-sm" @click.stop="grantRequest(request.id)">Grant</button>
        <button class="btn btn-danger btn-sm ms-2" @click.stop="openRejectModal(request.id)">Reject</button>
      </div>
    </div>

    
    <div v-if="selectedRequest" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <p><strong>Username:</strong> {{ selectedRequest.username }}</p>
        <p><strong>Email:</strong> {{ selectedRequest.email }}</p>
        <p><strong>Book Title:</strong> {{ selectedRequest.bookName }}</p>
        <p><strong>Days Requested:</strong> {{ selectedRequest.daysRequested }}</p>
      </div>
    </div>

    <div v-if="showRejectModal" class="modal" @click.self="closeRejectModal">
      <div class="modal-content">
        <span class="close" @click="closeRejectModal">&times;</span>
        <h5>Reject Request</h5>
        <div class="form-group">
          <label for="rejectionReason">Reason for rejection (optional):</label>
          <textarea id="rejectionReason" class="form-control" v-model="rejectionReason"></textarea>
        </div>
        <button class="btn btn-danger mt-3" @click="confirmReject">Reject</button>
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
      requests: [],
      selectedRequest: null,
      showRejectModal: false,
      rejectionReason: '',
      rejectRequestId: null,

      requestDays: null,
      issueDate: '',
      returnDate: '',
    };
  },
  components: {
    NavbarThree
  },
  created() {
    this.fetchRequests();
  },
  methods: {
    async fetchRequests() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/request');
        this.requests = response.data
          .filter(request => !request.isApproved && !request.isRejected  && !request.isRevoked) 
          .map(request => ({
            id: request.id,
            bookName: request.bookName,
            userId: request.userId,
            username: request.username,
            email: request.email,
            daysRequested: this.calculateDaysRequested(request.issueDate, request.returnDate),
          }));
          console.log(this.requests);
      } catch (error) {
        console.error('There was an error fetching the book requests!', error);
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
    async grantRequest(requestId) {
      try {
        const token = localStorage.getItem('token'); 
        const request = this.requests.find(req => req.id === requestId);
        const issueDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
        const returnDate = new Date(new Date().getTime() + request.daysRequested * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; 
        
        await axios.put(`http://127.0.0.1:5000/api/request/${requestId}`, 
          { isApproved: true,
            issueDate : issueDate,
            returnDate : returnDate
          }, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        alert(`Request ${requestId} granted.`);
        this.requests = this.requests.filter(request => request.id !== requestId);
      } catch (error) {
        console.error('There was an error approving the request!', error);
        alert('Failed to approve the request');
      }
    },
    openRejectModal(requestId) {
      this.showRejectModal = true;
      this.rejectRequestId = requestId;
    },
    closeRejectModal() {
      this.showRejectModal = false;
      this.rejectionReason = '';
      this.rejectRequestId = null;
    },
    async confirmReject() {
      try {
        const token = localStorage.getItem('token'); 
        await axios.put(`http://127.0.0.1:5000/api/request/${this.rejectRequestId}`, 
          { isRejected: true, rejectionReason: this.rejectionReason }, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        alert(`Request ${this.rejectRequestId} rejected.`);
        this.requests = this.requests.filter(request => request.id !== this.rejectRequestId);
        this.closeRejectModal();
      } catch (error) {
        console.error('There was an error rejecting the request!', error);
        alert('Failed to reject the request');
      }
    },
    goToGrantedRequests() {
      this.$router.push({ name: 'GrantedRequests' });
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

.btn-success {
  background-color: #5cb85c; 
  border-color: #4cae4c; 
}

.btn-success:hover {
  background-color: #4cae4c;
  border-color: #398439;
}

.btn-danger {
  background-color: #d9534f; 
  border-color: #d43f3a;
}

.btn-danger:hover {
  background-color: #d43f3a;
  border-color: #c9302c;
}

.btn-sm {
  padding: 0.25rem 1rem;
}

.ms-2 {
  margin-left: 0.5rem;
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
