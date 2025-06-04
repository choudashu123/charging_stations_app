<template>
  <div class="max-w-5xl mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold text-purple-800">Welcome, {{ auth.user?.username }}</h1>
    <h2 class="text-xl font-semibold text-gray-700">Charging Stations</h2>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 items-end">
      <div>
        <label class="block text-sm text-gray-600">Status</label>
        <select v-model="filters.status" class="border rounded px-3 py-2">
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label class="block text-sm text-gray-600">Min Power Output (kW)</label>
        <input
          v-model.number="filters.minPowerOutput"
          type="number"
          class="border rounded px-3 py-2"
          placeholder="e.g. 20"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600">Connector Type</label>
        <select v-model="filters.connectorType" class="border rounded px-3 py-2">
          <option value="">All</option>
          <option value="Type1">Type1</option>
          <option value="Type2">Type2</option>
          <option value="CCS">CCS</option>
          <option value="CHAdeMO">CHAdeMO</option>
        </select>
      </div>

      <button @click="fetchChargers" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Apply
      </button>
      <button @click="resetFilters" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition">
        Reset
      </button>
    </div>

    <!-- Charger Cards -->
    <div class="grid md:grid-cols-2 gap-6">
      <div
        v-for="charger in chargers"
        :key="charger._id"
        class="border p-4 rounded-lg shadow hover:shadow-lg transition"
        :class="{
          'border-green-500': charger.status === 'Active',
          'border-red-400': charger.status === 'Inactive'
        }"
      >
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-bold">{{ charger.name }}</h3>
          <span
            class="text-xs font-semibold px-2 py-1 rounded"
            :class="{
              'bg-green-100 text-green-700': charger.status === 'Active',
              'bg-red-100 text-red-700': charger.status === 'Inactive'
            }"
          >
            {{ charger.status }}
          </span>
        </div>
        <p class="text-sm">Power: <strong>{{ charger.powerOutput }} kW</strong></p>
        <p class="text-sm">Connector: {{ charger.connectorType }}</p>
        <p class="text-sm">Location: {{ charger.location.latitude }}, {{ charger.location.longitude }}</p>

        <div class="mt-4 flex gap-2">
          <button @click="editCharger(charger)" class="text-blue-600 hover:underline">Edit</button>
          <button
            v-if="charger._id"
            @click="deleteCharger(charger._id)"
            class="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Charger Form -->
    <div v-if="showForm" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-lg">
        <h3 class="text-xl font-semibold">
          {{ editing ? 'Edit Charger' : 'Add Charger' }}
        </h3>
        <form @submit.prevent="saveCharger" class="space-y-4">
          <input v-model="form.name" placeholder="Name" required class="w-full border px-3 py-2 rounded" />
          <input
            v-model.number="form.location.latitude"
            placeholder="Latitude"
            required
            class="w-full border px-3 py-2 rounded"
          />
          <input
            v-model.number="form.location.longitude"
            placeholder="Longitude"
            required
            class="w-full border px-3 py-2 rounded"
          />
          <select v-model="form.status" required class="w-full border px-3 py-2 rounded">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <input
            v-model.number="form.powerOutput"
            placeholder="Power Output (kW)"
            required
            class="w-full border px-3 py-2 rounded"
          />
          <input
            v-model="form.connectorType"
            placeholder="Connector Type"
            required
            class="w-full border px-3 py-2 rounded"
          />

          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              class="text-gray-600 hover:underline"
              @click="cancelEdit"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              {{ editing ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Floating Add Button -->
    <button
      class="fixed bottom-6 right-6 bg-green-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-purple-700 text-2xl"
      @click="showForm = true"
      title="Add Charger"
    >
      +
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/auth';
import { ref, onMounted } from 'vue';
import api from '../services/api';

const auth = useAuthStore();

interface Charger {
  _id?: string;
  name: string;
  location: { latitude: number; longitude: number };
  status: 'Active' | 'Inactive';
  powerOutput: number;
  connectorType: string;
}

const chargers = ref<Charger[]>([]);
const filters = ref({
  status: '',
  minPowerOutput: 0,
  connectorType: '',
});

const form = ref<Charger>({
  name: '',
  location: { latitude: 0, longitude: 0 },
  status: 'Active',
  powerOutput: 0,
  connectorType: '',
});

const editing = ref(false);
const editingId = ref<string | null>(null);
const showForm = ref(false);

const fetchChargers = async () => {
  const params: any = {};
  if (filters.value.status) params.status = filters.value.status;
  if (filters.value.minPowerOutput) params.minPowerOutput = filters.value.minPowerOutput;
  if (filters.value.connectorType) params.connectorType = filters.value.connectorType;

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
  showForm.value = true;
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
  showForm.value = false;
};

const resetFilters = () => {
  filters.value = {
    status: '',
    minPowerOutput: 0,
    connectorType: '',
  };
  fetchChargers();
};

onMounted(fetchChargers);
</script>
