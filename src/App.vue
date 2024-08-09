<template>
  <div id="app" class="d-flex flex-column">
    <main class="flex-grow-1">
      <router-view />
    </main>

    <footer class="footer py-3 bg-light">
      <div class="container text-center">
        <span class="text-muted">© 2024 BookVista All rights reserved.</span>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
html, body, #app {
  height: 100%;
}

.footer {
  flex-shrink: 0; 
}
</style>
