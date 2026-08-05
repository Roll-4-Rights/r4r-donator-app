<template>
  <div class="chat-widget">
    <div v-if="!isOpen" class="chat-button" @click="toggleChat">
      <v-icon>mdi-message</v-icon>
      <span class="chat-button-text">Chat with Admin</span>
      <v-badge v-if="unreadCount > 0" :content="unreadCount" color="error" class="unread-badge" />
    </div>

    <div v-else class="chat-messenger">
      <div class="chat-header">
        <div class="chat-title">
          <v-icon size="small" class="mr-2">mdi-account-circle</v-icon>
          <span>Admin Support</span>
        </div>
        <v-btn icon size="small" @click="toggleChat">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="messages" ref="messageContainer">
        <div v-for="msg in messages" :key="msg.id" 
             :class="['message', msg.senderType === 'user' ? 'sent' : 'received']">
          <div class="message-content">
            <span class="message-text">{{ msg.message }}</span>
            <span class="timestamp">{{ formatTime(msg.timestamp) }}</span>
          </div>
        </div>
      </div>

      <div class="input-area">
        <input 
          v-model="newMessage" 
          @keyup.enter="sendMessage" 
          placeholder="Type a message..." 
          :disabled="!connected"
        />
        <v-btn 
          icon 
          color="primary" 
          @click="sendMessage"
          :disabled="!connected || !newMessage.trim()"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>

      <div v-if="!connected" class="connection-status">
        Connecting...
      </div>
    </div>
  </div>
</template>

<script>
import { socket, state } from "@/socket";

export default {
  name: "Chat",
  
  props: {
    userId: {
      type: String,
      required: true
    },
    username: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      messages: [],
      newMessage: '',
      isOpen: false,
      unreadCount: 0
    };
  },

  computed: {
    connected() {
      return state.connected;
    }
  },

  mounted() {
    // Wait for socket to connect before joining
    if (socket.connected) {
      this.joinChat();
    }
    
    socket.on('connect', () => {
      this.joinChat();
    });
    
    // Receive chat history
    socket.on('chat-history', (history) => {
      this.messages = history;
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    });

    // Receive new messages
    socket.on('receive-message', (data) => {
      this.messages.push(data);
      
      // Increment unread count if chat is closed and message is from admin
      if (!this.isOpen && data.senderType === 'admin') {
        this.unreadCount++;
      }
      
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    });
  },

  methods: {
    joinChat() {
      // Join the user's unique chat room
      socket.emit('join-chat', {
        userId: this.userId,
        username: this.username || `User ${this.userId}`,
        userType: 'user'
      });
      console.log('Joined chat as:', this.userId);
    },

    toggleChat() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.unreadCount = 0;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    sendMessage() {
      if (!this.newMessage.trim() || !this.connected) return;
      
      const messageData = {
        userId: this.userId,
        message: this.newMessage,
        senderType: 'user'
      };
      
      socket.emit('send-message', messageData);
      this.newMessage = '';
      console.log('Message sent:', messageData);
    },

    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    },

    scrollToBottom() {
      const container = this.$refs.messageContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  },

  beforeUnmount() {
    socket.off('connect');
    socket.off('chat-history');
    socket.off('receive-message');
  }
};
</script>

<style scoped>
.chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #007bff;
  color: white;
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  transition: transform 0.2s;
  position: relative;
}

.chat-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
}

.chat-button-text {
  font-weight: 600;
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
}

.chat-messenger {
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #007bff;
  color: white;
}

.chat-title {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f5f5f5;
}

.message {
  margin-bottom: 12px;
  display: flex;
}

.message.sent {
  justify-content: flex-end;
}

.message.received {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 12px;
  word-wrap: break-word;
}

.message.sent .message-content {
  background: #007bff;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.received .message-content {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
}

.message-text {
  display: block;
  margin-bottom: 4px;
}

.timestamp {
  font-size: 0.7rem;
  opacity: 0.7;
}

.input-area {
  display: flex;
  padding: 12px;
  gap: 8px;
  border-top: 1px solid #e0e0e0;
  background: white;
}

.input-area input {
  flex: 1;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  outline: none;
}

.input-area input:focus {
  border-color: #007bff;
}

.connection-status {
  padding: 8px;
  text-align: center;
  background: #fff3cd;
  color: #856404;
  font-size: 0.85rem;
}
</style>