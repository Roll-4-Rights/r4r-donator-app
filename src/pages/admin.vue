<template>
  <div v-if="authState.is_admin" class="admin-page">
    <div class="admin-header">
      <h1>Admin</h1>
      <p class="admin-subtitle">Manage registered donators</p>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-value">{{ donators.length }}</span>
        <span class="stat-label">Total Donators</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ adminCount }}</span>
        <span class="stat-label">Admins</span>
      </div>
    </div>

    <div class="search-row">
      <input v-model="search" class="search-input" placeholder="Search by name or email…" />
    </div>

    <div v-if="loading" class="empty-state"><p>Loading donators…</p></div>
    <div v-else-if="loadError" class="empty-state"><p>Couldn't load donators. Try refreshing.</p></div>
    <div v-else-if="filteredDonators.length === 0" class="empty-state"><p>No donators match your search.</p></div>

    <div v-else class="donator-table">
      <div class="table-header">
        <span>Name</span>
        <span>Email</span>
        <span>Joined</span>
        <span>Status</span>
        <span class="text-right">Actions</span>
      </div>
      <div v-for="d in filteredDonators" :key="d.id" class="table-row">
        <span>{{ d.name }}</span>
        <span class="row-email">{{ d.email }}</span>
        <span>{{ formatDate(d.createdAt) }}</span>
        <span>
          <span class="status-chip" :class="{ admin: d.isAdmin }">{{ d.isAdmin ? 'Admin' : 'Donator' }}</span>
        </span>
        <span class="row-actions">
          <button class="btn-toggle" @click="toggleAdmin(d)">{{ d.isAdmin ? 'Revoke Admin' : 'Make Admin' }}</button>
          <button class="btn-delete" @click="removeDonator(d)">Delete</button>
        </span>
      </div>
    </div>
  </div>
  <div v-else class="not-authorized">
    <p>You don't have access to this page.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { API_BASE_URL } from '@/services/api'
import { authState } from '@/services/authStore'

const donators = ref([])
const search = ref('')
const loading = ref(true)
const loadError = ref(false)

const adminCount = computed(() => donators.value.filter((d) => d.isAdmin).length)

const filteredDonators = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return donators.value
  return donators.value.filter((d) => d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q))
})

async function loadDonators() {
  loading.value = true
  loadError.value = false
  try {
    const res = await fetch(`${API_BASE_URL}/admin/donators`, { credentials: 'include' })
    if (!res.ok) throw new Error('Failed to load')
    donators.value = await res.json()
  } catch (e) {
    loadError.value = true
  } finally {
    loading.value = false
  }
}

async function toggleAdmin(d) {
  const key = prompt(`Enter the admin key to ${d.isAdmin ? 'revoke' : 'grant'} admin status for ${d.email}:`)
  if (!key) return
  try {
    const res = await fetch(`${API_BASE_URL}/admin/set-admin-status`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': key },
      body: JSON.stringify({ email: d.email, is_admin: !d.isAdmin })
    })
    if (!res.ok) throw new Error()
    d.isAdmin = !d.isAdmin
  } catch (e) {
    alert('Failed — check the admin key and try again.')
  }
}

async function removeDonator(d) {
  if (!confirm(`Permanently delete ${d.email}? This also removes their chat messages and can't be undone.`)) return
  const key = prompt(`Enter the admin key to permanently delete ${d.email}:`)
  if (!key) return
  try {
    const res = await fetch(`${API_BASE_URL}/admin/donators/${d.id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'X-API-Key': key }
    })
    if (!res.ok) throw new Error()
    donators.value = donators.value.filter((x) => x.id !== d.id)
  } catch (e) {
    alert('Failed — check the admin key and try again.')
  }
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString()
}

onMounted(loadDonators)
</script>

<style scoped>
.admin-page { padding: 30px; max-width: 1100px; margin: 0 auto; }

.admin-header { margin-bottom: 24px; }
.admin-header h1 { color: #fff; font-size: 28px; font-weight: 800; }
.admin-subtitle { color: #8a9a9e; font-size: 14px; margin-top: 4px; }

.stats-row { display: flex; gap: 16px; margin-bottom: 24px; }
.stat-card { background: #1e2b30; border-radius: 10px; padding: 16px 24px; flex: 1; }
.stat-value { display: block; color: #4fd1c5; font-size: 28px; font-weight: 800; }
.stat-label { color: #8a9a9e; font-size: 13px; }

.search-row { margin-bottom: 20px; }
.search-input { width: 100%; max-width: 360px; padding: 10px 14px; border-radius: 8px; border: none; background: #2a3a3f; color: #fff; font-size: 14px; }
.search-input::placeholder { color: #6b7c80; }

.empty-state { padding: 40px; text-align: center; color: #6b7c80; }

.donator-table { background: #1e2b30; border-radius: 10px; overflow: hidden; }

.table-header, .table-row {
  display: grid;
  grid-template-columns: 1fr 1.6fr 0.9fr 0.8fr 1.4fr;
  gap: 12px;
  align-items: center;
  padding: 12px 20px;
}

.table-header {
  color: #6b7c80;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.table-row {
  color: #dce6e8;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.table-row:last-child { border-bottom: none; }
.table-row:hover { background: rgba(255, 255, 255, 0.02); }

.row-email { color: #b8c3c6; }

.status-chip {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(107, 124, 128, 0.2);
  color: #8a9a9e;
}
.status-chip.admin {
  background: rgba(79, 209, 197, 0.15);
  color: #4fd1c5;
}

.row-actions { display: flex; gap: 8px; justify-content: flex-end; }

.btn-toggle, .btn-delete {
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.btn-toggle { background: rgba(79, 209, 197, 0.15); color: #4fd1c5; }
.btn-toggle:hover { background: rgba(79, 209, 197, 0.3); }
.btn-delete { background: rgba(255, 99, 99, 0.15); color: #ff6363; }
.btn-delete:hover { background: rgba(255, 99, 99, 0.3); }

.not-authorized {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: #6b7c80;
}
</style>