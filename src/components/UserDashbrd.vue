<template>
  <div>
    <NavbarTwo />
    <div class="container mt-5 text-center">
      <h3 class="hello">Hello {{ username }}!</h3>
      <div class="image-container mt-4">
        <img src="../../public/userdashboard.png" alt="User Dashboard Image" class="dashboard-image" />
      </div>
    </div>
  </div>
</template>

<script>
import NavbarTwo from './NavbarTwo.vue';
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
    };
  },
  components: {
    NavbarTwo,
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      const userId = localStorage.getItem('user_id');
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/users?id=${userId}`);
        if (response.data && response.data.length > 0) {
          this.username = response.data[0].username;
        } else {
          this.username = 'User'; //in case the username is not found
        }
      } catch (error) {
        console.error('There was an error fetching the user data!', error);
        this.username = 'User'; 
      }
    },
  },
};
</script>

<style scoped>
.hello {
  color: #00008B;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.dashboard-image {
  max-width: 90%;
  height: auto;
  border-radius: 8px;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  animation: fadeIn 2s forwards;
}

.dashboard-image:hover {
  transform: scale(1.1);
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
