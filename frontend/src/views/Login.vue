<template>
    <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Password" required />
            <button type="submit">Login</button>
            <p v-if="error" class="error">{{  error }}</p>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth';
import api from '../services/api'


const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const auth = useAuthStore();

const handleLogin = async () => {
    try {
        const res = await api.post('/auth/login', { 
            email: email.value,
            password: password.value,
        })
        console.log(res)
        console.log("hello")
        auth.setAuth(res.data.token, res.data.user);
        router.push('/dashboard');
    } catch (err: any) {
        error.value = err.response?.data?.msg || 'Login failed';
    }
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 5rem auto;
    padding : 2rem;
    border: 1px solid #ccc;
    border-radius: 10px;
}
input {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.5 rem;
}

button{
    width : 100%;
    padding: 0.5rem;
}
.error{
    color: red;
    margin-top: 0.5rem;
}
</style>