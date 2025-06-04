<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
    <div class="flex justify-around mb-6 border-b pb-2">
      <button
        @click="activeTab = 'login'"
        :class="['px-4 py-2 font-semibold', activeTab === 'login' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-500']"
      >
        Login
      </button>
      <button
        @click="activeTab = 'register'"
        :class="['px-4 py-2 font-semibold', activeTab === 'register' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-500']"
      >
        Register
      </button>
    </div>

    <!-- Login Form -->
    <form v-if="activeTab === 'login'" @submit.prevent="handleLogin">
  <input
    v-model="loginEmail"
    type="email"
    placeholder="Email"
    required
    class="w-full p-2 mb-4 border border-gray-300 rounded"
  />
  <input
    v-model="loginPassword"
    type="password"
    placeholder="Password"
    required
    class="w-full p-2 mb-4 border border-gray-300 rounded"
  />
  <button type="submit" class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-800 transition w-full">
    {{ isDummyMode ? 'Test Application' : 'Login' }}
  </button>
  <div class="flex justify-center"><button
    type="button"
    @click="useDummyCredentials"
    class="w-auto mt-3 bg-gray-200 text-md text-blue-600 hover:underline"
  >
    Test via Dummy Endpoint
  </button></div>
  
  <p v-if="loginError" class="text-red-600 mt-2">{{ loginError }}</p>
</form>

    <!-- Register Form -->
    <form v-else @submit.prevent="handleRegister">
      <input
        v-model="registerUsername"
        type="text"
        placeholder="Username"
        required
        class="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        v-model="registerEmail"
        type="email"
        placeholder="Email"
        required
        class="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        v-model="registerPassword"
        type="password"
        placeholder="Password"
        required
        class="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        v-model="registerConfirmPassword"
        type="password"
        placeholder="Confirm Password"
        required
        class="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <button type="submit" class="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 transition w-full">
        Register
      </button>
      <p v-if="registerError" class="text-red-600 mt-2">{{ registerError }}</p>
      <p v-if="registerSuccess" class="text-green-600 mt-2">{{ registerSuccess }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import api from '../services/api';

const router = useRouter();
const auth = useAuthStore();

const activeTab = ref<'login' | 'register'>('login');
const isDummyMode = ref(false);

const useDummyCredentials = () => {
  loginEmail.value = 'dummy@test.com';
  loginPassword.value = 'dummy123';
  isDummyMode.value = true;
};


// Login refs
const loginEmail = ref('');
const loginPassword = ref('');
const loginError = ref('');

// Register refs
const registerUsername = ref('');
const registerEmail = ref('');
const registerPassword = ref('');
const registerConfirmPassword = ref('');
const registerError = ref('');
const registerSuccess = ref('');

const handleLogin = async () => {
  loginError.value = '';
  try {
    const res = await api.post('/auth/login', {
      email: loginEmail.value,
      password: loginPassword.value,
    });
    auth.setAuth(res.data.token, res.data.user);
    router.push('/dashboard');
  } catch (err: any) {
    loginError.value = err.response?.data?.msg || 'Login failed';
  }
};

const handleRegister = async () => {
  registerError.value = '';
  registerSuccess.value = '';
  if (registerPassword.value !== registerConfirmPassword.value) {
    registerError.value = 'Passwords do not match';
    return;
  }

  try {
    await api.post('/auth/register', {
      username: registerUsername.value,
      email: registerEmail.value,
      password: registerPassword.value,
    });
    registerSuccess.value = 'Registration successful. Redirecting to login...';
    setTimeout(() => {
      activeTab.value = 'login';
    }, 1500);
  } catch (err: any) {
    registerError.value = err.response?.data?.msg || 'Registration failed';
  }
};
</script>
