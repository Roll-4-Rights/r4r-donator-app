<!-- filepath: c:\Users\gamer\Documents\Roll4Rights\r4r-donator-app\src\pages\messages.vue -->
<template>
  <v-container class="py-10 px-6" max-width="900">
    <h1 class="text-h4 font-weight-black text-black mb-2">Messages</h1>
    <p class="text-body-2 text-medium-emphasis mb-8">
      Have a question for the team? Send it here and check back for an answer.
    </p>

    <!-- Submit box -->
    <v-card class="rounded-2xl mb-10 pa-2" variant="flat" border>
      <v-card-text class="pa-6">
        <v-textarea
          v-model="newQuestion"
          label="Type your question..."
          variant="outlined"
          rows="3"
          auto-grow
          hide-details
          class="mb-4"
          maxlength="1000"
          :counter="true"
        />
        <v-btn
          color="#0B4F6C"
          class="text-white px-6"
          rounded="lg"
          :disabled="!newQuestion.trim() || sending"
          :loading="sending"
          @click="submitMessage"
        >
          Send
        </v-btn>
        <p v-if="submitError" class="text-caption text-error mt-2">
          Something went wrong sending your message. Please try again.
        </p>
      </v-card-text>
    </v-card>

    <!-- History Status Check -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="#0B4F6C" />
    </div>

    <div v-else-if="messages.length === 0" class="text-center py-8">
      <p class="text-body-2 text-medium-emphasis">No messages yet. Ask your first question above.</p>
    </div>

    <!-- Message History Cards List -->
    <template v-else>
      <v-row>
        <v-col cols="12" v-for="msg in pagedMessages" :key="msg.Id" class="pb-4">
          <v-card class="rounded-xl" variant="flat" border>
            <v-card-text class="pa-6 text-left">
              <div class="d-flex justify-space-between align-center mb-4">
                <span class="text-caption text-medium-emphasis">
                  {{ formatDate(msg['Created At']) }}
                </span>
                <v-chip
                  size="small"
                  :color="msg.Status === 'Answered' ? 'success' : 'warning'"
                  variant="flat"
                  class="font-weight-bold"
                >
                  {{ msg.Status }}
                </v-chip>
              </div>
              <p class="text-body-1 font-weight-bold text-black mb-2">{{ msg.Question }}</p>
              <div class="bg-grey-lighten-4 rounded-lg pa-4 mt-3" v-if="msg.Answer">
                <p class="text-body-2 text-high-emphasis style-answer">
                  {{ msg.Answer }}
                </p>
              </div>
              <p v-else class="text-body-2 text-medium-emphasis font-italic mt-2">
                Awaiting a response from the team.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div v-if="totalPages > 1" class="d-flex justify-center mt-2">
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="5"
          color="#0B4F6C"
          density="comfortable"
        ></v-pagination>
      </div>
    </template>




<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { apiService } from '@/services/api'

const messages = ref([])
const loading = ref(true)
const newQuestion = ref('')
const sending = ref(false)
const submitError = ref(false)

const page = ref(1)
const perPage = 5

const totalPages = computed(() => Math.max(1, Math.ceil(messages.value.length / perPage)))

const pagedMessages = computed(() => {
  const start = (page.value - 1) * perPage
  return messages.value.slice(start, start + perPage)
})

watch(messages, () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
}

async function loadMessages({ silent = false } = {}) {
  if (!silent) loading.value = true
  try {
    messages.value = await apiService.fetchMessages()
  } catch (e) {
    console.error('Failed to load messages:', e)
  } finally {
    if (!silent) loading.value = false
  }
}

async function submitMessage() {
  const sanitizedQuestion = newQuestion.value.trim()
  if (!sanitizedQuestion) return

  sending.value = true
  submitError.value = false
  try {
    await apiService.sendMessage(sanitizedQuestion)
    newQuestion.value = ''
    await loadMessages()
    page.value = 1
  } catch (e) {
    submitError.value = true
  } finally {
    sending.value = false
  }
}

let pollTimer = null

onMounted(() => {
  loadMessages()
  pollTimer = setInterval(() => loadMessages({ silent: true }), 20000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>