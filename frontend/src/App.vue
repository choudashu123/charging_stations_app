<template>
  <div id="app">
    <header class="navbar">
      <router-link to="/">Home</router-link>
      <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
      <router-link v-if="!isAuthenticated" to="/register">Register</router-link>
      <router-link v-if="isAuthenticated" to="/dashboard">Dashboard</router-link>
      <router-link v-if="isAuthenticated" to="/map">Map</router-link>
      <button v-if="isAuthenticated" @click="logout">Logout</button>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../src/store/auth';

const auth = useAuthStore();

const logout = () => {
  auth.logout();
};

const isAuthenticated = computed(() => !!auth.token);
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}

.navbar {
  display: flex;
  gap: 1rem;
  background: #333;
  padding: 1rem;
  color: white;
  justify-content: center;
}

.navbar a {
  color: white;
  text-decoration: none;
}

.navbar a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}

button {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.main-content {
  padding: 2rem;
}
</style>
