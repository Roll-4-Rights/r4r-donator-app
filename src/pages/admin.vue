<template>
  <v-container class="py-8" max-width="900">
    <div v-if="!unlocked" class="key-gate">
      <h2 class="text-h5 font-weight-black mb-4">Admin Access</h2>
      <v-text-field
        v-model="keyInput"
        label="Admin Key"
        type="password"
        variant="outlined"
        density="comfortable"
        @keyup.enter="unlock"
        hide-details="auto"
      ></v-text-field>
      <v-btn color="#0A3C46" class="text-white mt-4" @click="unlock">Unlock</v-btn>
      <p v-if="unlockError" class="text-error mt-2">{{ unlockError }}</p>
    </div>

    <div v-else>
      <h2 class="text-h5 font-weight-black mb-6">Registered Donators</h2>
      <v-table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Status</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in donators" :key="d.id">
            <td>{{ d.name }}</td>
            <td>{{ d.email }}</td>
            <td>{{ formatDate(d.createdAt) }}</td>
            <td>
              <v-chip :color="d.isAdmin ? 'success' : 'grey'" size="small">{{ d.isAdmin ? 'Admin' : 'Donator' }}</v-chip>
            </td>
            <td class="text-right">
              <v-btn size="small" variant="text" @click="toggleAdmin(d)">
                {{ d.isAdmin ? 'Revoke Admin' : 'Make Admin' }}
              </v-btn>
              <v-btn size="small" variant="text" color="error" @click="removeDonator(d)">Delete</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { API_BASE_URL } from '@/services/api'

const keyInput = ref('')
const unlocked = ref(false)
const unlockError = ref('')
const donators = ref([])
const adminKey = ref('')

async function unlock() {
  unlockError.value = ''
  try {
    const res = await fetch(`${API_BASE_URL}/admin/donators`, {
      headers: { 'X-API-Key': keyInput.value }
    })
    if (!res.ok) throw new Error('Invalid key')
    donators.value = await res.json()
    adminKey.value = keyInput.value
    unlocked.value = true
  } catch (e) {
    unlockError.value = 'Invalid key'
  }
}

async function toggleAdmin(d) {
  const res = await fetch(`${API_BASE_URL}/admin/set-admin-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': adminKey.value },
    body: JSON.stringify({ email: d.email, is_admin: !d.isAdmin })
  })
  if (res.ok) d.isAdmin = !d.isAdmin
}

async function removeDonator(d) {
  if (!confirm(`Permanently delete ${d.email}? This also removes their chat messages and can't be undone.`)) return
  const res = await fetch(`${API_BASE_URL}/admin/donators/${d.id}`, {
    method: 'DELETE',
    headers: { 'X-API-Key': adminKey.value }
  })
  if (res.ok) donators.value = donators.value.filter((x) => x.id !== d.id)
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString()
}
</script>

<style scoped>
.key-gate {
  max-width: 400px;
  margin: 80px auto;
  text-align: center;
}
</style>