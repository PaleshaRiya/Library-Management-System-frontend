<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <img src="../../public/logo.png" alt="E-Book Library Logo" class="logo-img" />
          <span class="logo-text">BookVista</span>
        </router-link>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/login" class="nav-link">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/register" class="nav-link">Register</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/liblogin" class="nav-link">Librarian Login</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
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
