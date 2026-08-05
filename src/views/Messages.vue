<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { socket } from '@/socket'

const getUserId = () => {
  return localStorage.getItem('donator_user_id') || 'user_03l1q6br2'
}

const currentUser = ref({
  id: getUserId(),
  name: 'Jane Smith'
})

const messages = ref([])
const newMessage = ref('')
const messageContainer = ref(null)

const sortedMessages = computed(() => {
  return [...messages.value].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  )
})

function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

function sendMessage() {
  if (!newMessage.value.trim()) return
  
  const messageData = {
    userId: currentUser.value.id,
    message: newMessage.value,
    senderType: 'user'
  }
  
  console.log('📤 Sending message:', messageData)
  
  socket.emit('send-message', messageData)
  newMessage.value = ''
}

function handleIncomingMessage(data) {
  console.log('📨 MessagesView received message:', data)
  console.log('🔍 Message is for user:', data.userID || data.userId)
  console.log('🔍 I am user:', currentUser.value.id)
  
  // Check if message is for THIS user
  const messageUserId = data.userID || data.userId
  const isForMe = messageUserId === currentUser.value.id
  
  if (isForMe) {
    // Check for duplicates
    const exists = messages.value.some(msg => 
      msg.id === data.id || 
      (msg.timestamp === data.timestamp && msg.message === data.message)
    )
    
    if (!exists) {
      messages.value.push(data)
      nextTick(() => scrollToBottom())
      console.log('✅ Added message to chat')
    } else {
      console.log('⚠️ Duplicate message prevented')
    }
  } else {
    console.log('⚠️ Message is for different user, ignoring')
  }
}

onMounted(async () => {
  console.log('📱 MessagesView mounted - Connecting to chat with userId:', currentUser.value.id)
  
  // Join the chat room
  socket.emit('join-chat', {
    userId: currentUser.value.id,
    username: currentUser.value.name,
    userType: 'user'
  })
  
  // Listen for new messages
  socket.on('receive-message', handleIncomingMessage)
  
  // Listen for chat history
  socket.on('chat-history', (history) => {
    console.log('✅ Loaded chat history:', history.length, 'messages')
    console.log('🔍 History data:', history)
    
    // Filter to only show messages for THIS user
    const myMessages = history.filter(msg => {
      const msgUserId = msg.userID || msg.userId
      return msgUserId === currentUser.value.id
    })
    
    console.log('✅ Filtered to my messages:', myMessages.length, 'messages')
    messages.value = myMessages
    nextTick(() => scrollToBottom())
  })
  
  // Request history (backend should send via 'chat-history' event after join)
  console.log('⏳ Waiting for chat history from server...')
})

onUnmounted(() => {
  socket.off('receive-message', handleIncomingMessage)
  socket.off('chat-history')
  
  socket.emit('leave-room', `chat_${currentUser.value.id}`)
})
</script>