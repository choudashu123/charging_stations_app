<template>
    <div class="register-container">
        <h2>Register</h2>
        <form @submit.prevent="handleRegister">
            <input v-model="username" type="text" placeholder="Username" required />
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Password" required />
            <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />
            <button type="submit">Register</button>
            <p v-if="error" class="error">{{ error }}</p>
            <p v-if="success" class="success">{{ success }}</p>
        </form>
        <p><router-link to="/login">Already have an account? Login here</router-link></p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const username = ref('')
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const success = ref('');
const router = useRouter();

const handleRegister = async () => {
    if (password.value !== confirmPassword.value) {
        error.value = "Passwords do not match";
        return;
    }

    try {
        await api.post('/auth/register', { email: email.value, password: password.value, username: username.value });
        success.value = 'Registration successful. Redirecting to login...';
        error.value = '';
        setTimeout(() => {
            router.push('/login');
        }, 1500);
    } catch (err: any) {
        error.value = err.response?.data?.msg || 'Registration failed';
        success.value = '';
    }
};
</script>

<style scoped>
.register-container {
    max-width: 400px;
    margin: 5rem auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 10px;
}

input {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.5rem;
}

button {
    width: 100%;
    padding: 0.5rem;
}

.error {
    color: red;
}

.success {
    color: green;
}
</style>
