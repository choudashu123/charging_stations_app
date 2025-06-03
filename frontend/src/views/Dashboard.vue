<template>
  <div class="dashboard">
    <h1>Welcome, {{ auth.user?.username }}</h1>
    <h2>Charging Stations</h2>

    <div class="filters">
      <select v-model="filters.status">
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <input v-model.number="filters.minPowerOutput" type="number" placeholder="Min Power Output (kW)" />
      <button @click="fetchChargers">Apply Filters</button>
      <button @click="resetFilters">Reset</button>
    </div>

    <div class="charger-list">
      <div v-for="charger in chargers" :key="charger._id" class="charger-card">
        <h3>{{ charger.name }}</h3>
        <p>Status: {{ charger.status }}</p>
        <p>Power Output: {{ charger.powerOutput }} kW</p>
        <p>Connector: {{ charger.connectorType }}</p>
        <p>Location: {{ charger.location.latitude }}, {{ charger.location.longitude }}</p>
        <button @click="editCharger(charger)">Edit</button>
        <button v-if="charger._id" @click="deleteCharger(charger._id)">Delete</button>
      </div>
    </div>

    <hr />
    <h3>{{ editing ? 'Edit' : 'Add' }} Charger</h3>
    <form @submit.prevent="saveCharger">
      <input v-model="form.name" placeholder="Name" required />
      <input v-model.number="form.location.latitude" placeholder="Latitude" required />
      <input v-model.number="form.location.longitude" placeholder="Longitude" required />
      <select v-model="form.status" required>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <input v-model.number="form.powerOutput" placeholder="Power Output (kW)" required />
      <input v-model="form.connectorType" placeholder="Connector Type" required />
      <button type="submit">{{ editing ? 'Update' : 'Add' }}</button>
      <button type="button" @click="cancelEdit" v-if="editing">Cancel</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/auth';
import { ref, onMounted } from 'vue';
import api from '../services/api';

const auth = useAuthStore();
console.log(auth.user.username)

interface Charger {
  _id?: string;
  name: string;
  location: { latitude: number; longitude: number };
  status: 'Active' | 'Inactive';
  powerOutput: number;
  connectorType: string;
}

const chargers = ref<Charger[]>([]);
const filters = ref({ status: '', minPowerOutput: 0 });

const form = ref<Charger>({
  name: '',
  location: { latitude: 0, longitude: 0 },
  status: 'Active',
  powerOutput: 0,
  connectorType: '',
});

const editing = ref(false);
const editingId = ref<string | null>(null);

const fetchChargers = async () => {
  const params: any = {};
  if (filters.value.status) params.status = filters.value.status;
  if (filters.value.minPowerOutput) params.minPowerOutput = filters.value.minPowerOutput;
  const res = await api.get('/chargers', { params });
  chargers.value = res.data;
};

const saveCharger = async () => {
  try {
    if (editing.value && editingId.value) {
      await api.put(`/chargers/${editingId.value}`, form.value);
    } else {
      await api.post('/chargers', form.value);
    }
    fetchChargers();
    resetForm();
  } catch (err) {
    alert('Error saving charger');
  }
};

const deleteCharger = async (id: string) => {
  if (confirm('Delete this charger?')) {
    await api.delete(`/chargers/${id}`);
    fetchChargers();
  }
};

const editCharger = (charger: Charger) => {
  form.value = { ...charger };
  editing.value = true;
  editingId.value = charger._id || null;
};

const cancelEdit = () => {
  resetForm();
};

const resetForm = () => {
  form.value = {
    name: '',
    location: { latitude: 0, longitude: 0 },
    status: 'Active',
    powerOutput: 0,
    connectorType: '',
  };
  editing.value = false;
  editingId.value = null;
};

const resetFilters = () => {
  filters.value = { status: '', minPowerOutput: 0 };
  fetchChargers();
};

onMounted(fetchChargers);
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
}
.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.charger-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
.charger-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
}
form input,
form select {
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.5rem;
}
button {
  margin-right: 0.5rem;
}
</style>
