<template>
  <NavbarOne />
  <div class="container mt-5">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="name" v-model="name" required>
      </div>
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" id="username" v-model="username" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" v-model="email" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" v-model="password" required>
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import NavbarOne from './NavbarOne.vue';

export default {
  data() {
    return {
      name: '',
      username: '',
      email: '',
      password: ''
    };
  },
  components: {
    NavbarOne
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/auth/register/', {
          name: this.name,
          username: this.username,
          email: this.email,
          password: this.password,
          role: "USER"
        });
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user_id', response.data.user_id);
        console.log('Registered successfully');
        this.$router.push('/userdashbrd');  
      } catch (error) {
        console.error('Error registering:', error);
        alert('Registration failed');
      }
    }
  }
};
</script>
