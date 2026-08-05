<template>
  <div class="messages-page">
    <v-card class="fill-height d-flex flex-column" elevation="2">
      <!-- Header -->
      <v-card-title class="bg-primary text-white py-4 d-flex align-center">
        <v-icon class="mr-2">mdi-message</v-icon>
        Support Chat
        <v-spacer></v-spacer>
        <v-chip 
          v-if="!connected" 
          color="error" 
          size="small"
          prepend-icon="mdi-alert-circle"
        >
          Disconnected
        </v-chip>
        <v-chip 
          v-else 
          color="success" 
          size="small"
          prepend-icon="mdi-check-circle"
        >
          Connected
        </v-chip>
      </v-card-title>

      <!-- Messages Container - Slack-like -->
      <v-card-text 
        ref="messageContainer" 
        class="flex-grow-1 overflow-y-auto pa-4 messages-container"
      >
        <v-container v-if="messages.length === 0" class="text-center py-12">
          <v-icon size="64" color="grey-lighten-1">mdi-message-outline</v-icon>
          <p class="text-grey mt-4">No messages yet. Start a conversation with our Admin team!</p>
        </v-container>

        <!-- Slack-like message bubbles -->
        <div v-for="(msg, index) in messages" :key="msg.id || msg.timestamp" class="mb-3">
          <!-- Show sender name + time only if different from previous message -->
          <div 
            v-if="index === 0 || messages[index - 1].senderType !== msg.senderType"
            class="text-caption text-grey-darken-1 mb-1 px-2"
          >
            <strong>{{ msg.senderType === 'admin' ? 'Admin Team' : '👤 You' }}</strong>
            <span class="ml-2">{{ formatTime(msg.timestamp) }}</span>
          </div>

          <!-- Message bubble -->
          <div 
            :class="msg.senderType === 'user' ? 'd-flex justify-end' : 'd-flex justify-start'"
          >
            <div
              class="message-bubble pa-3 rounded-lg elevation-1"
              :class="msg.senderType === 'user' ? 'user-message' : 'admin-message'"
            >
              {{ msg.message }}
            </div>
          </div>
        </div>
      </v-card-text>

      <!-- Input Area - Slack-like -->
      <v-divider></v-divider>
      <v-card-actions class="pa-4 bg-grey-lighten-4">
        <v-textarea
          v-model="newMessage"
          placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
          variant="outlined"
          density="comfortable"
          rows="2"
          auto-grow
          max-rows="5"
          hide-details
          @keydown.enter.exact.prevent="sendMessage"
          @keydown.enter.shift.exact="() => {}"
          :disabled="!connected"
          class="flex-grow-1"
          bg-color="white"
        ></v-textarea>
        <v-btn
          icon
          color="primary"
          size="large"
          class="ml-2"
          :disabled="!newMessage.trim() || !connected"
          @click="sendMessage"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { socket, state } from '@/socket'

const messages = ref([])
const newMessage = ref('')
const messageContainer = ref(null)

// Get or create user ID
const userId = ref(localStorage.getItem('chatUserId'))
if (!userId.value) {
  userId.value = 'user_' + Math.random().toString(36).substr(2, 9)
  localStorage.setItem('chatUserId', userId.value)
}

// Get username from localStorage
const username = ref(localStorage.getItem('chatUsername') || 'Jane Smith')

const connected = computed(() => state.connected)

onMounted(() => {
  console.log('📱 MessagesView mounted - Connecting to chat with userId:', userId.value)
  
  // Join chat room
  socket.emit('join-chat', {
    userId: userId.value,
    username: username.value,
    userType: 'user'
  })

  // Listen for chat history (loads persisted messages from NocoDB)
  socket.on('chat-history', (history) => {
    console.log('✅ Loaded chat history:', history.length, 'messages')
    messages.value = history
    nextTick(() => scrollToBottom())
  })

  // Listen for new messages
  socket.on('receive-message', (data) => {
    console.log('✅ Received new message:', data)
    
    // Check if message already exists (prevent duplicates)
    const exists = messages.value.some(msg => 
      msg.id === data.id || 
      (msg.timestamp === data.timestamp && msg.message === data.message)
    )
    
    if (!exists) {
      messages.value.push(data)
      nextTick(() => scrollToBottom())
    } else {
      console.log('⚠️ Duplicate message prevented')
    }
  })
})

onUnmounted(() => {
  console.log('📱 MessagesView unmounted - Cleaning up listeners')
  socket.off('chat-history')
  socket.off('receive-message')
})

function sendMessage() {
  if (!newMessage.value.trim() || !connected.value) return

  console.log('📤 Sending message:', newMessage.value)

  const messageData = {
    userId: userId.value,
    message: newMessage.value.trim(),
    senderType: 'user'
  }

  socket.emit('send-message', messageData)
  newMessage.value = ''
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  
  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else {
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}
</script>

<style scoped>
.messages-page {
  height: calc(100vh - 100px);
}

.messages-container {
  background-color: #f5f5f5;
  min-height: 400px;
}

.message-bubble {
  max-width: 70%;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.user-message {
  background-color: #1976D2;
  color: white;
}

.admin-message {
  background-color: white;
  color: #212121;
  border: 1px solid #e0e0e0;
}

/* Smooth scrolling */
.overflow-y-auto {
  scroll-behavior: smooth;
}
</style>
