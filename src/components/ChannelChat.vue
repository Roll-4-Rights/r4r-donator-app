<!-- filepath: c:\Users\gamer\Documents\Roll4Rights\r4r-donator-app\src\components\ChannelChat.vue -->
<template>
  <div class="channel-chat">
    <header class="channel-header">
      <span class="channel-icon mdi" :class="icon || 'mdi-pound'"></span>
      <span class="channel-title">{{ title || channel }}</span>
    </header>

    <div class="messages" ref="scrollEl">
      <div v-if="messages.length === 0" class="empty-state">
        <p>No one is here yet 😔</p>
      </div>

      <div
        v-for="(msg, i) in messages"
        :key="msg.id"
        class="message-row"
        :class="{ grouped: isGrouped(msg, messages[i - 1]) }"
      >
        <div
          class="avatar"
          v-if="!isGrouped(msg, messages[i - 1])"
          :style="msg.senderPicture ? {} : { background: colorForUser(msg.senderID) }"
        >
          <img v-if="msg.senderPicture" :src="`${API_BASE_URL}${msg.senderPicture}`" class="avatar-img" alt="" />
          <template v-else>{{ initialsForName(msg.senderName) }}</template>
        </div>
        <div class="avatar-spacer" v-else></div>

        <div class="message-body">
          <div class="message-meta" v-if="!isGrouped(msg, messages[i - 1])">
            <span class="sender" :style="{ color: colorForUser(msg.senderID) }">{{ msg.senderName }}</span>
            <span class="time">{{ formatTime(msg.timestamp) }}</span>
          </div>
          <div class="text">{{ msg.message }}</div>
        </div>

        <div v-if="msg.senderID === myId" class="msg-actions">
          <button class="msg-action-btn danger" @click="removeMessage(msg)" title="Delete">
            <span class="mdi mdi-delete-outline"></span>
          </button>
        </div>
      </div>
    </div>

    <div class="composer">
      <input
        v-model="draft"
        @keyup.enter="send"
        :placeholder="`Message #${channel}`"
      />
      <button @click="send">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { state, joinChannel, sendChannelMessage, deleteMessage } from '../socket'
import { colorForUser, initialsForName } from '../utils/userColor'
import { API_BASE_URL } from '@/services/api'
import { authState } from '@/services/authStore'

const props = defineProps({
  channel: { type: String, required: true },
  title: { type: String, default: '' },
  icon: { type: String, default: '' }
})

const draft = ref('')
const scrollEl = ref(null)

const messages = computed(() => state.messagesByChannel[props.channel] || [])
const myId = computed(() => String(authState.donator_id))

function send() {
  sendChannelMessage(draft.value)
  draft.value = ''
}

function removeMessage(msg) {
  if (!confirm('Delete this message?')) return
  deleteMessage(msg.id, props.channel)
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function isGrouped(current, prev) {
  if (!prev) return false
  if (prev.senderID !== current.senderID) return false
  const gap = new Date(current.timestamp) - new Date(prev.timestamp)
  return gap < 5 * 60 * 1000
}

onMounted(() => {
  joinChannel(props.channel)
})

watch(() => props.channel, (newChannel) => {
  joinChannel(newChannel)
})

watch(messages, () => {
  nextTick(() => {
    if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  })
})
</script>

<style scoped>
.channel-chat { display: flex; flex-direction: column; height: 100%; background: #1e2b30; }
.channel-header { display: flex; align-items: center; gap: 10px; padding: 16px 20px; background: #103948; border-bottom: 1px solid rgba(255, 255, 255, 0.08); color: #fff; font-weight: 600; font-size: 16px; }
.channel-icon { font-size: 18px; color: #4fd1c5; }
.messages { flex: 1; overflow-y: auto; padding: 20px; }
.empty-state { text-align: center; color: #6b7c80; margin-top: 40px; }

.message-row {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 2px;
  padding: 2px 0;
}
.message-row.grouped { margin-bottom: 0; }

.avatar,
.avatar-spacer {
  width: 38px;
  flex-shrink: 0;
}
.avatar {
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e2b30;
  font-weight: 700;
  font-size: 13px;
  overflow: hidden;
}
.avatar-img { width: 100%; height: 100%; object-fit: cover; }

.message-body { flex: 1; min-width: 0; }
.message-meta { display: flex; align-items: baseline; gap: 8px; margin-bottom: 2px; }
.sender { font-weight: 600; font-size: 14px; }
.time { font-size: 11px; color: #6b7c80; }
.text { color: #dce6e8; font-size: 14px; line-height: 1.4; word-wrap: break-word; }

.msg-actions {
  position: absolute;
  top: -14px;
  right: 8px;
  display: flex;
  gap: 2px;
  background: #2a3a3f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 2px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s ease-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.message-row:hover .msg-actions {
  opacity: 1;
  pointer-events: auto;
}
.msg-action-btn {
  background: none;
  border: none;
  color: #b8c3c6;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.msg-action-btn:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
.msg-action-btn.danger:hover { color: #ff6363; }

@media (hover: none) {
  .msg-actions {
    position: static;
    opacity: 1;
    pointer-events: auto;
    box-shadow: none;
    border: none;
    background: none;
    padding: 0;
    margin-left: 4px;
  }
}

.composer { display: flex; padding: 15px 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); background: #1e2b30; }
.composer input { flex: 1; padding: 10px 14px; border-radius: 8px; border: none; background: #2a3a3f; color: #fff; margin-right: 10px; }
.composer input::placeholder { color: #6b7c80; }
.composer button { background: #4fd1c5; color: #103948; border: none; padding: 0 20px; border-radius: 8px; cursor: pointer; font-weight: 700; }
.composer button:hover { background: #6ee0d5; }
</style>