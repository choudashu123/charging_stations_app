import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        user: JSON.parse(localStorage.getItem('user') || 'null'),
    }),
    actions: {
        setAuth(token: string, user: any) {
            this.token = token;
            this.user = user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        },
        logout() {
            this.token = '';
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');

        },
    }
})