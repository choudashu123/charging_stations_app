<template>
  <div class="map-view max-w-6xl mx-auto p-4">
    <h2 class="text-2xl font-semibold text-purple-800 mb-4 border-b pb-2">⚡ Charging Stations Map</h2>
    
    <div ref="mapElement" class="map-container shadow-lg rounded-xl border border-gray-300"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import L from 'leaflet';

delete (L.Icon.Default as any).prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

import api from '../services/api';

interface Charger {
  _id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  status: 'Active' | 'Inactive';
  powerOutput: number;
  connectorType: string;
}

const mapElement = ref<HTMLElement | null>(null);

onMounted(async () => {
  const map = L.map(mapElement.value!).setView([20.5937, 78.9629], 5); // India

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const response = await api.get('/chargers');
  const chargers: Charger[] = response.data;

  chargers.forEach(charger => {
    const { latitude, longitude } = charger.location;
    const marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup(`
      <strong>${charger.name}</strong><br/>
      Status: ${charger.status}<br/>
      Power: ${charger.powerOutput} kW<br/>
      Connector: ${charger.connectorType}
    `);
  });

  setTimeout(() => {
    map.invalidateSize();
  }, 100);
});
</script>

<style scoped>
.map-container {
  height: 600px;
  width: 100%;
}
</style>
