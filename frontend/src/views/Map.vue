<template>
    <div class="map-view">
        <h2>Charging Stations Map</h2>
        <div id="map" ref="mapElement" class="map-container"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import L from 'leaflet';
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
    const map = L.map(mapElement.value!).setView([20.5937, 78.9629], 5); // Default view: India
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
.map-view {
    width: 100%;
    margin: auto;
    padding: 1rem;
    background-color: red;
}

.map-container {
    height: 600px !important;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 10px;
}
</style>
