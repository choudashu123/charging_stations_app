import axios from 'axios';
import { useAuthStore} from '../store/auth'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const api = axios.create({
    baseURL,
});

// Add JWT token if available
api.interceptors.request.use((config) => {
    const auth = useAuthStore();
    if (auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
});

export default api;