import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { store } from './store';
// import 'leaflet/dist/leaflet'
import 'leaflet/dist/leaflet.css'


const app = createApp(App);
app.use(router)
app.use(store)
app.mount('#app')
