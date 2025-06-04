<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <!-- Header -->
    <header class="bg-green-600 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2 text-xl font-semibold">
          ⚡ EV Charge
        </div>

        <nav class="flex flex-wrap gap-4 text-sm font-medium">
          <router-link
            class="hover:underline"
            :class="{ 'underline font-bold': isActive('/') }"
            to="/"
          >
            Home
          </router-link>
          <router-link
            v-if="isAuthenticated"
            class="hover:underline"
            :class="{ 'underline font-bold': isActive('/dashboard') }"
            to="/dashboard"
          >
            Dashboard
          </router-link>
          <router-link
            v-if="isAuthenticated"
            class="hover:underline"
            :class="{ 'underline font-bold': isActive('/map') }"
            to="/map"
          >
            Map
          </router-link>
          <button
            v-if="isAuthenticated"
            @click="logout"
            class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-grow p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import { useAuthStore } from '../src/store/auth';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const logout = () => {
  auth.logout();
  router.push('/login');
};

const isAuthenticated = computed(() => !!auth.token);

const isActive = (path: string) => {
  return route.path === path;
};
</script>
