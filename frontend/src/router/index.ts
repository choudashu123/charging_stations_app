import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
    {path: '/', redirect: '/dashboard'},
    {path: '/login',name: 'Login', component: Login},
    {path: '/register', name: 'Register', component: Register},
    {path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true }},
    {path: '/map', component: Map}
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})

import { useAuthStore } from '../store/auth';
import Map from '../views/Map.vue';

router.beforeEach((to, _, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.token) {
    next('/login');
  } else {
    next();
  }
});

export default router; 