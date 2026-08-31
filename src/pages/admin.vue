<template>
  <div v-if="authState.is_admin" class="admin-page">
    <div class="admin-header">
      <h1>Admin</h1>
      <p class="admin-subtitle">Manage registered donators</p>
    </div>

    <div class="controls-row">
      <input v-model="search" class="search-input" placeholder="Search by name or email…" />
      <div class="filter-pills">
        <button class="filter-pill" :class="{ active: statusFilter === 'all' }" @click="statusFilter = 'all'">All</button>
        <button class="filter-pill" :class="{ active: statusFilter === 'admin' }" @click="statusFilter = 'admin'">Admins</button>
        <button class="filter-pill" :class="{ active: statusFilter === 'donator' }" @click="statusFilter = 'donator'">Donators</button>
      </div>
    </div>
    <p class="result-count">Showing {{ filteredDonators.length }} of {{ donators.length }}</p>

    <div v-if="loading" class="empty-state"><p>Loading donators…</p></div>
    <div v-else-if="loadError" class="empty-state"><p>Couldn't load donators. Try refreshing.</p></div>
    <div v-else-if="filteredDonators.length === 0" class="empty-state"><p>No donators match.</p></div>

    <div v-else class="donator-table">
      <div class="table-header">
        <span>Name</span>
        <span>Email</span>
        <span class="sortable" @click="toggleSort">Joined <span class="sort-arrow">{{ sortDir === 'desc' ? '↓' : '↑' }}</span></span>
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
const statusFilter = ref('all') // 'all' | 'admin' | 'donator'
const sortDir = ref('desc') // 'desc' = newest first, 'asc' = oldest first
const loading = ref(true)
const loadError = ref(false)

const filteredDonators = computed(() => {
  let list = donators.value

  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter((d) => d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q))
  }

  if (statusFilter.value === 'admin') list = list.filter((d) => d.isAdmin)
  else if (statusFilter.value === 'donator') list = list.filter((d) => !d.isAdmin)

  return [...list].sort((a, b) => {
    const diff = new Date(a.createdAt) - new Date(b.createdAt)
    return sortDir.value === 'asc' ? diff : -diff
  })
})

function toggleSort() {
  sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
}

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

.controls-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; }
.search-input { flex: 1; min-width: 220px; max-width: 360px; padding: 10px 14px; border-radius: 8px; border: none; background: #2a3a3f; color: #fff; font-size: 14px; }
.search-input::placeholder { color: #6b7c80; }

.filter-pills { display: flex; gap: 6px; }
.filter-pill {
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: #2a3a3f;
  color: #8a9a9e;
}
.filter-pill:hover { color: #dce6e8; }
.filter-pill.active { background: rgba(79, 209, 197, 0.15); color: #4fd1c5; }

.result-count { color: #6b7c80; font-size: 13px; margin-bottom: 20px; }

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

.sortable { cursor: pointer; user-select: none; }
.sortable:hover { color: #dce6e8; }
.sort-arrow { color: #4fd1c5; }

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