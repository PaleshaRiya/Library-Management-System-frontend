<template>
  <NavbarThree />
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>User Details</h2>
      <!-- Search Bar -->
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by username or email..."
        class="form-control search-bar"
      />
    </div>

    <div v-if="filteredAndSearchedUsers.length > 0" class="row">
      <div
        v-for="user in filteredAndSearchedUsers"
        :key="user.id"
        class="col-md-6 mb-4"
      >
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ user.name }} ({{ user.username }})</h5>
            <p class="card-text">
              <strong>Email:</strong> {{ user.email }} <br />
              <strong>Current Books:</strong> {{ user.currentBooks }} <br />
              <strong>Status:</strong> {{ user.active ? 'Active' : 'Inactive' }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else>
      <p>No user details available.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import NavbarThree from "./NavbarThree.vue";

export default {
  components: {
    NavbarThree
  },
  data() {
    return {
      users: [],
      searchQuery: ""
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => user.role === "USER");
    },
    filteredAndSearchedUsers() {
      return this.filteredUsers.filter(user => {
        const searchLower = this.searchQuery.toLowerCase();
        return (
          user.username.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
      });
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/users`);
        this.users = response.data;
        console.log('User details fetched:', this.users);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
}

.d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  max-width: 300px;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.col-md-6 {
  display: flex;
  justify-content: center;
}

.card {
  padding: 15px;
  width: 100%;
}

.card-title {
  font-size: 1.5rem;
}

.card-text {
  font-size: 1rem;
}
</style>
