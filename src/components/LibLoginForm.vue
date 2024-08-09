<template>
  <NavbarOne />
  <div class="container mt-5">
    <h2>Librarian Login</h2>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" id="username" v-model="username" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" v-model="password" required>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import NavbarOne from './NavbarOne.vue';

export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  components: {
    NavbarOne
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/auth/login', {
          username: this.username,
          password: this.password
        });
        localStorage.setItem('token', response.data.access_token);
        console.log('Logged in successfully');
        this.$router.push('/libdashbrd');  // Redirect to librarian dashboard
      } catch (error) {
        console.error('Error logging in:', error);
        alert('Invalid username or password');
      }
    }
  }
};
</script>
