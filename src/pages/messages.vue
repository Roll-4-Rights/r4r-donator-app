<!-- filepath: c:\Users\gamer\Documents\Roll4Rights\r4r-donator-app\src\pages\messages.vue -->
<template>
  <v-container class="py-10 px-6" max-width="900">
    <h1 class="text-h4 font-weight-black text-black mb-2">Messages</h1>
    <p class="text-body-2 text-medium-emphasis mb-8">
      Have a question for the team? Send it here and check back for an answer.
    </p>

    <!-- Submit box -->
    <v-card class="rounded-2xl border-0 mb-10" style="background-color: #FFFFFF !important; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03) !important;" elevation="0">
      <v-card-text class="pa-6">
        <v-textarea
          v-model="newQuestion"
          label="Type your question..."
          variant="outlined"
          rows="3"
          auto-grow
          hide-details
          class="mb-4"
        />
        <v-btn
          color="#0B4F6C"
          class="text-white"
          :disabled="!newQuestion.trim() || sending"
          :loading="sending"
          @click="submitMessage"
        >
          Send
        </v-btn>
        <p v-if="submitError" class="text-caption text-red mt-2">
          Something went wrong sending your message. Please try again.
        </p>
      </v-card-text>
    </v-card>

    <!-- History -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="#0B4F6C" />
    </div>

    <div v-else-if="messages.length === 0" class="text-center py-8">
      <p class="text-body-2 text-medium-emphasis">No messages yet. Ask your first question above.</p>
    </div>

    <v-row v-else>
      <v-col cols="12" v-for="msg in messages" :key="msg.Id" class="pb-4">
        <v-card class="rounded-xl border-0" style="background-color: #FFFFFF !important; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03) !important;" elevation="0">
          <v-card-text class="pa-6 text-left">
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-caption text-medium-emphasis">{{ formatDate(msg['Created At']) }}</span>
              <v-chip
                size="small"
                :color="msg.Status === 'Answered' ? 'green' : 'orange'"
                class="text-white font-weight-bold"
              >
                {{ msg.Status }}
              </v-chip>
            </div>
            <p class="text-body-1 font-weight-bold text-black mb-2">{{ msg.Question }}</p>
            <p v-if="msg.Answer" class="text-body-2 text-medium-emphasis leading-relaxed">
              {{ msg.Answer }}
            </p>
            <p v-else class="text-body-2 text-medium-emphasis font-italic">
              Awaiting a response from the team.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiService } from '@/services/api'

interface MessageItem {
  Id: number
  Question: string
  Answer: string
  Status: string
  'Created At': string
}

const messages = ref<MessageItem[]>([])
const loading = ref(true)
const newQuestion = ref('')
const sending = ref(false)
const submitError = ref(false)

function formatDate(value: string) {
  if (!value) return ''
  return new Date(value).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
}

async function loadMessages() {
  loading.value = true
  try {
    messages.value = await apiService.fetchMessages()
  } catch (e) {
    console.error('Failed to load messages:', e)
  } finally {
    loading.value = false
  }
}

async function submitMessage() {
  if (!newQuestion.value.trim()) return
  sending.value = true
  submitError.value = false
  try {
    await apiService.sendMessage(newQuestion.value.trim())
    newQuestion.value = ''
    await loadMessages()
  } catch (e) {
    submitError.value = true
  } finally {
    sending.value = false
  }
}

onMounted(loadMessages)
</script>