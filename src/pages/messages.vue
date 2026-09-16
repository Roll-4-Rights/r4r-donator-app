<!-- filepath: c:\Users\gamer\Documents\Roll4Rights\r4r-donator-app\src\pages\messages.vue -->
<template>
  <v-container class="py-10 px-6" max-width="900">
    <!-- Section 1: Dynamic Welcome Step Grid Overview -->
    <div class="page-header mb-8">
      <h1 class="page-title">Messages</h1>
      <p class="page-sub">
        Have a question for the admin team, but couldn't find it in the FAQ on the Guides & FAQ page? Send it here and we'll get back to you with the answer as quickly as we can!
        <br>
        <br>
        (Please keep in mind that communication may be a bit slower during the donation verification process immediately following the end of an auction. We're working hard, and we appreciate your patience!)
      </p>
    </div>    

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
      <v-row>
        <v-col cols="12" v-for="msg in pagedMessages" :key="msg.Id" class="pb-4">
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

            <div class="text-overline text-medium-emphasis mb-1">Question</div>
            <p class="text-body-1 font-weight-bold text-black mb-4">{{ msg.Question }}</p>

            <v-divider class="mb-4"></v-divider>

            <div class="text-overline text-medium-emphasis mb-1">Answer</div>
            <div class="bg-grey-lighten-4 rounded-lg pa-4" v-if="msg.Answer">
              <p class="text-body-2 text-high-emphasis style-answer mb-0">
                {{ msg.Answer }}
              </p>
            </div>
            <p v-else class="text-body-2 text-medium-emphasis font-italic mb-0">
              Awaiting a response from the team.
            </p>
          </v-card-text>
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
  </v-container>
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

<style scoped>
.page-header {
  padding-left: 4px;
}
.page-eyebrow {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.72);
  margin-bottom: 0.5rem;
}
.page-title {
  font-size: 2.25rem;
  font-weight: 900;
  color: #000000;
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem;
}
.page-sub {
  font-size: 0.95rem;
  color: rgba(0, 0, 0, 0.72);
  max-width: 70ch;
  margin: 0;
}
</style>