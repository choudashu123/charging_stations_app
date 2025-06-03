import axios from 'axios';
import { useAuthStore} from '../store/auth'

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
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