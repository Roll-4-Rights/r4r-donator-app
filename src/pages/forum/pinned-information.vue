<template>
  <div class="subforum-page">
    <div class="welcome-blurb">
      <h2>Introduce Yourself 👋</h2>
      <p>
        Post a little bit about yourself so the community can get to know you.
        Everyone gets one intro — you can edit it any time. Others can reply below to say hi.
      </p>
    </div>

    <div class="subforum-header">
      <h1>Member Introductions</h1>
      <button class="btn-create" @click="openMyThreadModal">
        {{ myThread ? 'Edit My Intro' : '+ Post Your Intro' }}
      </button>
    </div>

    <div v-if="loadingThreads" class="empty-state"><p>Loading…</p></div>
    <div v-else-if="threads.length === 0" class="empty-state"><p>No introductions yet. Be the first to say hello!</p></div>

    <v-expansion-panels v-else v-model="openPanel" variant="accordion" class="thread-panels">
      <v-expansion-panel v-for="thread in threads" :key="thread.id" :value="thread.id" class="thread-panel">
        <v-expansion-panel-title>
          <div>
            <h3>{{ thread.title }}</h3>
            <p class="thread-meta">
              {{ thread.author }} · {{ formatTime(thread.createdAt) }} · {{ thread.replyCount }} {{ thread.replyCount === 1 ? 'reply' : 'replies' }}
            </p>
          </div>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <p class="thread-body">{{ thread.body }}</p>

          <div v-if="thread.donatorId === myDonatorId" class="thread-owner-actions">
            <button class="btn-delete" @click="deleteMyThread">Delete My Intro</button>
          </div>

          <v-divider class="my-4"></v-divider>

          <div class="replies-section">
            <div v-if="!repliesState[thread.id] || repliesState[thread.id].loading" class="empty-state small"><p>Loading replies…</p></div>
            <template v-else>
              <div v-if="repliesState[thread.id].items.length === 0" class="empty-state small"><p>No replies yet.</p></div>
              <div v-else class="reply-list">
                <div v-for="reply in repliesState[thread.id].items" :key="reply.id" class="reply-item">
                  <div class="reply-body">
                    <span class="reply-author">{{ reply.author }}</span>
                    <span class="reply-time">{{ formatTime(reply.createdAt) }}</span>
                    <p>{{ reply.message }}</p>
                  </div>
                  <button v-if="reply.donatorId === myDonatorId" class="btn-delete-small" @click="deleteReply(thread.id, reply.id)">Delete</button>
                </div>
              </div>

              <div v-if="repliesState[thread.id].totalPages > 1" class="d-flex justify-center mt-3">
                <v-pagination
                  :model-value="repliesState[thread.id].page"
                  @update:model-value="(p) => loadReplies(thread.id, p)"
                  :length="repliesState[thread.id].totalPages"
                  density="comfortable"
                  color="#4fd1c5"
                ></v-pagination>
              </div>
            </template>

            <div class="reply-composer">
              <input v-model="replyDrafts[thread.id]" @keyup.enter="sendReply(thread.id)" placeholder="Say hi…" />
              <button @click="sendReply(thread.id)">Send</button>
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
      <v-pagination v-model="threadPage" :length="totalPages" color="#4fd1c5" density="comfortable"></v-pagination>
    </div>

    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <h2>{{ myThread ? 'Edit Your Intro' : 'Post Your Intro' }}</h2>
        <input v-model="draftTitle" placeholder="Title" class="modal-input" />
        <textarea v-model="draftBody" placeholder="Tell us about yourself..." class="modal-textarea"></textarea>
        <div class="modal-actions">
          <button @click="closeModal" class="btn-cancel">Cancel</button>
          <button @click="submitMyThread" class="btn-create">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { apiService } from '@/services/api'
import { authState } from '@/services/authStore'

const threads = ref([])
const threadPage = ref(1)
const totalPages = ref(1)
const loadingThreads = ref(true)

const myThread = ref(null)
const myDonatorId = computed(() => authState.donator_id)

const openPanel = ref(null)
const repliesState = ref({})
const replyDrafts = ref({})

const showModal = ref(false)
const draftTitle = ref('')
const draftBody = ref('')

function formatTime(ts) {
  return new Date(ts).toLocaleString()
}

async function loadThreads(page = 1) {
  loadingThreads.value = true
  try {
    const data = await apiService.fetchIntroThreads(page)
    threads.value = data.threads
    threadPage.value = data.page
    totalPages.value = data.totalPages
  } catch (e) {
    console.error('Failed to load intro threads:', e)
  } finally {
    loadingThreads.value = false
  }
}

async function loadMyThread() {
  try {
    myThread.value = await apiService.fetchMyIntroThread()
  } catch (e) {
    console.error('Failed to load your intro:', e)
  }
}

async function loadReplies(threadId, page = 1) {
  repliesState.value[threadId] = { ...(repliesState.value[threadId] || {}), loading: true }
  try {
    const data = await apiService.fetchIntroReplies(threadId, page)
    repliesState.value[threadId] = { items: data.replies, page: data.page, totalPages: data.totalPages, loading: false }
  } catch (e) {
    console.error('Failed to load replies:', e)
    repliesState.value[threadId] = { items: [], page: 1, totalPages: 1, loading: false }
  }
}

watch(openPanel, (threadId) => {
  if (threadId != null && !repliesState.value[threadId]) loadReplies(threadId, 1)
})

watch(threadPage, (page) => loadThreads(page))

function openMyThreadModal() {
  draftTitle.value = myThread.value?.title || ''
  draftBody.value = myThread.value?.body || ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  draftTitle.value = ''
  draftBody.value = ''
}

async function submitMyThread() {
  const title = draftTitle.value.trim()
  const body = draftBody.value.trim()
  if (!title || !body) return
  try {
    await apiService.saveIntroThread({ title, body })
    closeModal()
    await loadMyThread()
    await loadThreads(threadPage.value)
  } catch (e) {
    console.error('Failed to save your intro:', e)
  }
}

async function deleteMyThread() {
  if (!myThread.value) return
  if (!confirm('Delete your intro? This cannot be undone.')) return
  try {
    await apiService.deleteIntroThread(myThread.value.id)
    myThread.value = null
    openPanel.value = null
    await loadThreads(threadPage.value)
  } catch (e) {
    console.error('Failed to delete your intro:', e)
  }
}

async function sendReply(threadId) {
  const text = (replyDrafts.value[threadId] || '').trim()
  if (!text) return
  try {
    await apiService.sendIntroReply(threadId, text)
    replyDrafts.value[threadId] = ''

    const fresh = await apiService.fetchIntroReplies(threadId, 1)
    if (fresh.totalPages > 1) {
      await loadReplies(threadId, fresh.totalPages)
    } else {
      repliesState.value[threadId] = { items: fresh.replies, page: 1, totalPages: 1, loading: false }
    }

    const t = threads.value.find((t) => t.id === threadId)
    if (t) t.replyCount++
  } catch (e) {
    console.error('Failed to send reply:', e)
  }
}

async function deleteReply(threadId, replyId) {
  if (!confirm('Delete this reply?')) return
  try {
    await apiService.deleteIntroReply(replyId)
    await loadReplies(threadId, repliesState.value[threadId]?.page || 1)
    const t = threads.value.find((t) => t.id === threadId)
    if (t) t.replyCount = Math.max(0, t.replyCount - 1)
  } catch (e) {
    console.error('Failed to delete reply:', e)
  }
}

onMounted(() => {
  loadThreads(1)
  loadMyThread()
})
</script>

<style scoped>
.subforum-page { padding: 30px; max-width: 1200px; margin: 0 auto; }
.welcome-blurb { background: #103948; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px; color: #dce6e8; }
.welcome-blurb h2 { color: #fff; margin-bottom: 8px; font-size: 20px; }
.welcome-blurb p { font-size: 14px; line-height: 1.6; color: #b8c9cc; }

.subforum-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.subforum-header h1 { color: #fff; font-size: 24px; font-weight: 600; }

.btn-create { background: #4fd1c5; color: #103948; border: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
.btn-create:hover { background: #6ee0d5; }

.empty-state { padding: 40px; text-align: center; }
.empty-state p { color: #6b7c80; font-size: 16px; }
.empty-state.small { padding: 16px; }

.thread-panels :deep(.v-expansion-panel) { background: #1e2b30 !important; color: #dce6e8; margin-bottom: 8px; border-radius: 8px !important; }
.thread-panels :deep(.v-expansion-panel-title) { color: #fff; }
.thread-panels :deep(.v-expansion-panel-title__icon) { color: #4fd1c5; }

.thread-panel h3 { color: #fff; font-size: 18px; font-weight: 600; margin-bottom: 4px; }
.thread-meta { color: #6b7c80; font-size: 13px; }
.thread-body { color: #dce6e8; font-size: 14px; white-space: pre-wrap; margin-bottom: 12px; }

.thread-owner-actions { margin-bottom: 8px; }

.replies-section { margin-top: 8px; }
.reply-list { display: flex; flex-direction: column; gap: 10px; }
.reply-item { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; background: #2a3a3f; border-radius: 8px; padding: 10px 14px; }
.reply-body { flex: 1; }
.reply-author { color: #4fd1c5; font-weight: 600; font-size: 13px; margin-right: 8px; }
.reply-time { color: #6b7c80; font-size: 12px; }
.reply-body p { color: #dce6e8; font-size: 14px; margin-top: 4px; white-space: pre-wrap; }

.reply-composer { display: flex; gap: 10px; margin-top: 14px; }
.reply-composer input { flex: 1; padding: 10px 14px; border-radius: 8px; border: none; background: #2a3a3f; color: #fff; }
.reply-composer input::placeholder { color: #6b7c80; }
.reply-composer button { background: #4fd1c5; color: #103948; border: none; padding: 0 18px; border-radius: 8px; cursor: pointer; font-weight: 700; }

.btn-delete { border: none; padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; background: rgba(255, 99, 99, 0.15); color: #ff6363; }
.btn-delete:hover { background: rgba(255, 99, 99, 0.3); }
.btn-delete-small { border: none; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; background: rgba(255, 99, 99, 0.15); color: #ff6363; flex-shrink: 0; }
.btn-delete-small:hover { background: rgba(255, 99, 99, 0.3); }

.modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #1e2b30; padding: 24px; border-radius: 8px; width: 90%; max-width: 480px; }
.modal h2 { color: #fff; margin-bottom: 16px; }
.modal-input, .modal-textarea { width: 100%; padding: 10px 12px; border-radius: 6px; border: none; background: #2a3a3f; color: #fff; margin-bottom: 12px; font-family: inherit; }
.modal-textarea { min-height: 100px; resize: vertical; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
.btn-cancel { background: transparent; color: #dce6e8; border: 1px solid rgba(255, 255, 255, 0.15); padding: 10px 20px; border-radius: 6px; cursor: pointer; }
</style>