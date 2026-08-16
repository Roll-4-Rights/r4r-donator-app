<template>
  <div class="subforum-page">
    <div class="welcome-blurb">
      <h2>Welcome to the Roll4Rights chat!</h2>
      <p>
        This is our community hub! Browse the channels on the left to chat with
        other members, talk about donations, discuss your craft or just anything in general, or head over to
        <strong>Introduce Yourself</strong> to say hello. We're glad you're here :) (obvs this can say anything)
      </p>
    </div>

    <div class="subforum-header">
      <h1>General Chat Rules</h1>
      <button class="btn-create" @click="openCreateModal">+ New Thread (note: this one will be only available for admins to add/delete rules and such)</button>
    </div>

    <div class="thread-list" v-if="threads.length">
      <div class="thread-item" v-for="thread in threads" :key="thread.id">
        <div class="thread-info">
          <h3>{{ thread.title }}</h3>
          <p class="thread-body">{{ thread.body }}</p>
          <p class="thread-meta">
            Posted by {{ thread.author }} · {{ formatTime(thread.createdAt) }}
          </p>
        </div>
        <div class="thread-actions" v-if="isOwner(thread)">
          <button class="btn-edit" @click="openEditModal(thread)">Edit</button>
          <button class="btn-delete" @click="deleteThread(thread.id)">Delete</button>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <p>No threads yet.</p>
    </div>

    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editingId ? 'Edit Thread' : 'Create a Thread' }}</h2>
        <input v-model="newTitle" placeholder="Title" class="modal-input" />
        <textarea v-model="newBody" placeholder="Tell us about yourself..." class="modal-textarea"></textarea>
        <div class="modal-actions">
          <button @click="closeModal" class="btn-cancel">Cancel</button>
          <button @click="submitThread" class="btn-create">{{ editingId ? 'Save' : 'Post' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { identity } from '../../identity'

const threads = ref([])
const showModal = ref(false)
const newTitle = ref('')
const newBody = ref('')
const editingId = ref(null)

const API_BASE = 'http://localhost:3001'

async function loadThreads() {
  const res = await fetch(`${API_BASE}/api/welcome-threads`)
  threads.value = (await res.json()).reverse()
}

function isOwner(thread) {
  return thread.author === (identity.username || 'Anonymous')
}

function openCreateModal() {
  editingId.value = null
  newTitle.value = ''
  newBody.value = ''
  showModal.value = true
}

function openEditModal(thread) {
  editingId.value = thread.id
  newTitle.value = thread.title
  newBody.value = thread.body
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingId.value = null
  newTitle.value = ''
  newBody.value = ''
}

async function submitThread() {
  if (!newTitle.value.trim() || !newBody.value.trim()) return

  if (editingId.value) {
    await fetch(`${API_BASE}/api/welcome-threads/${editingId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle.value.trim(),
        body: newBody.value.trim()
      })
    })
  } else {
    await fetch(`${API_BASE}/api/welcome-threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle.value.trim(),
        author: identity.username || 'Anonymous',
        body: newBody.value.trim()
      })
    })
  }

  closeModal()
  await loadThreads()
}

async function deleteThread(id) {
  if (!confirm('Delete this thread? This cannot be undone.')) return
  await fetch(`${API_BASE}/api/welcome-threads/${id}`, { method: 'DELETE' })
  await loadThreads()
}

function formatTime(ts) {
  return new Date(ts).toLocaleString()
}

onMounted(loadThreads)
</script>

<style scoped>
.subforum-page {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-blurb {
  background: #103948;
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 24px;
  color: #dce6e8;
}

.welcome-blurb h2 {
  color: #fff;
  margin-bottom: 8px;
  font-size: 20px;
}

.welcome-blurb p {
  font-size: 14px;
  line-height: 1.6;
  color: #b8c9cc;
}

.subforum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.subforum-header h1 {
  color: #fff;
  font-size: 24px;
  font-weight: 600;
}

.btn-create {
  background: #4fd1c5;
  color: #103948;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-create:hover {
  background: #6ee0d5;
}

.thread-list {
  background: #1e2b30;
  border-radius: 8px;
  overflow: hidden;
}

.thread-item {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.thread-info {
  flex: 1;
}

.thread-info h3 {
  color: #fff;
  font-size: 18px;
  margin-bottom: 8px;
  font-weight: 600;
}

.thread-body {
  color: #dce6e8;
  font-size: 14px;
  margin-bottom: 8px;
  white-space: pre-wrap;
}

.thread-meta {
  color: #6b7c80;
  font-size: 13px;
}

.thread-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.btn-edit,
.btn-delete {
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-edit {
  background: rgba(79, 209, 197, 0.15);
  color: #4fd1c5;
}

.btn-edit:hover {
  background: rgba(79, 209, 197, 0.3);
}

.btn-delete {
  background: rgba(255, 99, 99, 0.15);
  color: #ff6363;
}

.btn-delete:hover {
  background: rgba(255, 99, 99, 0.3);
}

.empty-state {
  padding: 40px;
  text-align: center;
}

.empty-state p {
  color: #6b7c80;
  font-size: 16px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #1e2b30;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 480px;
}

.modal h2 {
  color: #fff;
  margin-bottom: 16px;
}

.modal-input,
.modal-textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: none;
  background: #2a3a3f;
  color: #fff;
  margin-bottom: 12px;
  font-family: inherit;
}

.modal-textarea {
  min-height: 100px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel {
  background: transparent;
  color: #dce6e8;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}
</style>