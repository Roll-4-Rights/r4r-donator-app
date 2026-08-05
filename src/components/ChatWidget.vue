<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { socket, state } from '@/socket'

const messages = ref([])
const newMessage = ref('')
const isOpen = ref(false)
const messageContainer = ref(null)
const unreadCount = ref(0)

// Get or create user ID
const userId = ref(localStorage.getItem('chatUserId'))
if (!userId.value) {
  userId.value = 'user_' + Math.random().toString(36).substr(2, 9)
  localStorage.setItem('chatUserId', userId.value)
}

// Get username from localStorage or use default
const username = ref(localStorage.getItem('chatUsername') || 'Jane Smith')

const connected = computed(() => state.connected)

onMounted(() => {
  // Join chat room
  socket.emit('join-chat', {
    userId: userId.value,
    username: username.value,
    userType: 'user'
  })

  // Listen for chat history (loads persisted messages from NocoDB)
  socket.on('chat-history', (history) => {
    console.log('Loaded chat history:', history.length, 'messages')
    messages.value = history
    nextTick(() => scrollToBottom())
  })

  // Listen for new messages
  socket.on('receive-message', (data) => {
    console.log('Received message:', data)
    
    // Check if message already exists (prevent duplicates)
    const exists = messages.value.some(msg => 
      msg.id === data.id || 
      (msg.timestamp === data.timestamp && msg.message === data.message)
    )
    
    if (!exists) {
      messages.value.push(data)
      
      if (!isOpen.value && data.senderType === 'admin') {
        unreadCount.value++
      }
      
      nextTick(() => scrollToBottom())
    }
  })
})

onUnmounted(() => {
  socket.off('chat-history')
  socket.off('receive-message')
})

function toggleChat() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
    nextTick(() => scrollToBottom())
  }
}

function sendMessage() {
  if (!newMessage.value.trim() || !connected.value) return

  const messageData = {
    userId: userId.value,
    message: newMessage.value,
    senderType: 'user'
  }

  socket.emit('send-message', messageData)
  newMessage.value = ''
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}
</script>