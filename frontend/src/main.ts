import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { store } from './store';
import 'leaflet/dist/leaflet.css'
import { createPinia } from 'pinia';



const app = createApp(App);
const pinia = createPinia();
app.use(pinia)
app.use(router)
app.use(store)
app.mount('#app')
