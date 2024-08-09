<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <router-link to="/userdashbrd" class="navbar-brand d-flex align-items-center">
          <img src="../../public/logo.png" alt="E-Book Library Logo" class="logo-img" />
          <span class="logo-text">BookVista</span>
        </router-link>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/user/mybooks" class="nav-link">MyBooks</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/user/books" class="nav-link">Books</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/profile" class="nav-link">MyProfile</router-link>
            </li>
            <li class="nav-item">
              <router-link to="#" class="nav-link" @click="logout">Logout</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'NavbarTwo',
  methods: {
    logout() {
      // Clear localStorage
      localStorage.clear();
      // Redirect to homepage
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap');

.navbar-brand {
  display: flex;
  align-items: center;
}

.nav-link {
  color: #00008B;
}

.logo-img {
  height: 40px; 
  margin-right: 10px; 
}

.logo-text {
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem; 
  font-weight: 700;
  color: #00008B; 
}
</style>
