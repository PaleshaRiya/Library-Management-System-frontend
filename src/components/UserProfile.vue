<template>
  <NavbarTwo />
  <div class="profile-container">
    <h2>My Profile</h2>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="profile.name" required />
      </div>

      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="profile.username" required />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="profile.email" required />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="profile.password" placeholder="Enter new password" />
      </div>

      <div class="form-group button-group">
        <button type="submit" class="btn btn-primary">Update Profile</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import NavbarTwo from './NavbarTwo.vue';

export default {
  data() {
    return {
      profile: {
        name: '',
        username: '',
        email: '',
        password: ''
      }
    }
  },
  components: {
    NavbarTwo
  },
  created() {
    this.fetchProfile()
  },
  methods: {
    async fetchProfile() {
      try {
        const userId = localStorage.getItem('user_id')
        const response = await axios.get(`http://127.0.0.1:5000/api/users`, { params: { id: userId } })
        const userData = response.data[0]
        this.profile.name = userData.name
        this.profile.username = userData.username
        this.profile.email = userData.email
      } catch (error) {
        console.error('Error fetching profile data', error)
      }
    },
    async updateProfile() {
      try {
        const userId = localStorage.getItem('user_id')
        const token = localStorage.getItem('token')
        
        const updatedProfile = {
          name: this.profile.name,
          username: this.profile.username,
          email: this.profile.email,
          password : this.profile.password,
        }

        await axios.put(
          `http://127.0.0.1:5000/api/users/${userId}`,
          updatedProfile,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        alert('Profile updated successfully')
      } catch (error) {
        console.error('Error updating profile', error)
        alert('There was an error updating the profile')
      }
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  text-align: center;
}

h2 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.button-group {
  text-align: center;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}
</style>
