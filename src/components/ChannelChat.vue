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
            <span v-if="msg.editedAt" class="edited-tag">(edited)</span>
          </div>

          <div v-if="msg.replyTo" class="reply-preview">
            <span class="mdi mdi-reply"></span>
            <span class="reply-preview-author">{{ msg.replyTo.senderName || 'Unknown' }}</span>
            <span class="reply-preview-text">{{ truncate(msg.replyTo.message) }}</span>
          </div>

          <div v-if="editingId === msg.id" class="edit-row">
            <input
              v-model="editingDraft"
              class="edit-input"
              @keyup.enter="saveEdit(msg)"
              @keyup.escape="cancelEdit"
            />
            <button class="edit-save" @click="saveEdit(msg)">Save</button>
            <button class="edit-cancel" @click="cancelEdit">Cancel</button>
          </div>
          <div v-else class="text">{{ msg.message }}</div>

          <div v-if="msg.reactions && msg.reactions.length > 0" class="reaction-row">
            <button
              v-for="r in msg.reactions"
              :key="r.emoji"
              class="reaction-pill"
              :class="{ mine: r.donatorIds.includes(myId) }"
              @click="pickReaction(msg, r.emoji)"
            >{{ r.emoji }} {{ r.donatorIds.length }}</button>
          </div>
        </div>

        <div class="msg-actions">
          <div class="reaction-picker-wrapper">
            <button class="msg-action-btn" @click="toggleReactionPicker(msg.id)" title="Add reaction">
              <span class="mdi mdi-emoticon-plus-outline"></span>
            </button>
            <div v-if="reactionPickerFor === msg.id" class="reaction-picker-backdrop" @click="reactionPickerFor = null"></div>
            <div v-if="reactionPickerFor === msg.id" class="reaction-picker" @click.stop>
              <button v-for="emoji in REACTION_EMOJIS" :key="emoji" class="reaction-option" @click="pickReaction(msg, emoji)">{{ emoji }}</button>
            </div>
          </div>
          <button class="msg-action-btn" @click="startReply(msg)" title="Reply">
            <span class="mdi mdi-reply"></span>
          </button>
          <button v-if="msg.senderID === myId" class="msg-action-btn" @click="startEdit(msg)" title="Edit">
            <span class="mdi mdi-pencil-outline"></span>
          </button>
          <button v-if="msg.senderID === myId || authState.is_admin" class="msg-action-btn danger" @click="removeMessage(msg)" title="Delete">
            <span class="mdi mdi-delete-outline"></span>
          </button>
        </div>
      </div>
    </div>

    <div class="composer-wrapper">
      <div v-if="replyingTo" class="reply-bar">
        <span class="mdi mdi-reply"></span>
        <span class="reply-bar-text">Replying to <strong>{{ replyingTo.senderName }}</strong>: {{ truncate(replyingTo.message) }}</span>
        <button class="reply-bar-close" @click="replyingTo = null">×</button>
      </div>

      <div class="composer">
        <div class="emoji-wrapper">
          <div v-if="showEmojiPicker" class="emoji-backdrop" @click="showEmojiPicker = false"></div>
          <button class="emoji-toggle" @click="showEmojiPicker = !showEmojiPicker" title="Emoji">
            <span class="mdi mdi-emoticon-outline"></span>
          </button>
          <div v-if="showEmojiPicker" class="emoji-picker" @click.stop>
            <button v-for="emoji in EMOJI_LIST" :key="emoji" class="emoji-option" @click="insertEmoji(emoji)">{{ emoji }}</button>
          </div>
        </div>

        <input v-model="draft" @keyup.enter="send" :placeholder="`Message #${channel}`" />
        <button @click="send">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { state, joinChannel, sendChannelMessage, deleteMessage, editMessage, toggleReaction } from '../socket'
import { colorForUser, initialsForName } from '../utils/userColor'
import { API_BASE_URL } from '@/services/api'
import { authState } from '@/services/authStore'

const props = defineProps({
  channel: { type: String, required: true },
  title: { type: String, default: '' },
  icon: { type: String, default: '' }
})

const EMOJI_LIST = ['😀','😂','😅','😊','😍','🤔','😢','😭','😡','👍','👎','🙏','👏','🎉','🔥','💯','❤️','💙','💚','💛','🧡','💜','🖤','✨','⭐','🎲','🎮','🍕','🍺','🎂','🐉','⚔️','🛡️','🏆','👀','😴','🤯','🥳','😎','🙌','💪','🤝','🎁','📢','❗','❓','✅','❌','🚀','🌈']
const REACTION_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🎉']

const draft = ref('')
const scrollEl = ref(null)
const showEmojiPicker = ref(false)
const replyingTo = ref(null)
const editingId = ref(null)
const editingDraft = ref('')
const reactionPickerFor = ref(null)

const messages = computed(() => state.messagesByChannel[props.channel] || [])
const myId = computed(() => String(authState.donator_id))

function truncate(text, max = 60) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}

function insertEmoji(emoji) {
  draft.value += emoji
}

function toggleReactionPicker(msgId) {
  reactionPickerFor.value = reactionPickerFor.value === msgId ? null : msgId
}

function pickReaction(msg, emoji) {
  toggleReaction(msg.id, props.channel, emoji)
  reactionPickerFor.value = null
}

function startReply(msg) {
  replyingTo.value = { id: msg.id, senderName: msg.senderName, message: msg.message }
}

function startEdit(msg) {
  editingId.value = msg.id
  editingDraft.value = msg.message
}

function cancelEdit() {
  editingId.value = null
  editingDraft.value = ''
}

function saveEdit(msg) {
  const text = editingDraft.value.trim()
  if (!text) return
  editMessage(msg.id, props.channel, text)
  cancelEdit()
}

function send() {
  sendChannelMessage(draft.value, replyingTo.value?.id || null)
  draft.value = ''
  replyingTo.value = null
  showEmojiPicker.value = false
}

function removeMessage(msg) {
  const label = msg.senderID === myId.value
    ? 'Delete this message?'
    : `Delete this message from ${msg.senderName}?`
  if (!confirm(label)) return
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

.message-row { position: relative; display: flex; align-items: flex-start; gap: 12px; margin-bottom: 2px; padding: 2px 0; }
.message-row.grouped { margin-bottom: 0; }

.avatar, .avatar-spacer { width: 38px; flex-shrink: 0; }
.avatar { height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #1e2b30; font-weight: 700; font-size: 13px; overflow: hidden; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; }

.message-body { flex: 1; min-width: 0; }
.message-meta { display: flex; align-items: baseline; gap: 8px; margin-bottom: 2px; }
.sender { font-weight: 600; font-size: 14px; }
.time { font-size: 11px; color: #6b7c80; }
.edited-tag { font-size: 10px; color: #6b7c80; font-style: italic; }
.text { color: #dce6e8; font-size: 14px; line-height: 1.4; word-wrap: break-word; }

.reply-preview { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #8a9a9e; margin-bottom: 3px; padding-left: 8px; border-left: 2px solid #4fd1c5; }
.reply-preview .mdi { font-size: 13px; }
.reply-preview-author { color: #4fd1c5; font-weight: 600; }

.edit-row { display: flex; align-items: center; gap: 8px; }
.edit-input { flex: 1; padding: 6px 10px; border-radius: 6px; border: 1px solid #4fd1c5; background: #2a3a3f; color: #fff; font-size: 14px; }
.edit-save, .edit-cancel { border: none; border-radius: 6px; padding: 5px 10px; font-size: 12px; font-weight: 600; cursor: pointer; }
.edit-save { background: #4fd1c5; color: #103948; }
.edit-cancel { background: transparent; color: #8a9a9e; }

.reaction-row { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
.reaction-pill { display: flex; align-items: center; gap: 4px; background: #2a3a3f; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1px 8px; font-size: 12px; color: #dce6e8; cursor: pointer; }
.reaction-pill:hover { border-color: #4fd1c5; }
.reaction-pill.mine { background: rgba(79, 209, 197, 0.15); border-color: #4fd1c5; color: #4fd1c5; }

.msg-actions { position: absolute; top: -14px; right: 8px; display: flex; gap: 2px; background: #2a3a3f; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 2px; opacity: 0; pointer-events: none; transition: opacity 0.12s ease-out; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); }
.message-row:hover .msg-actions { opacity: 1; pointer-events: auto; }
.msg-action-btn { background: none; border: none; color: #b8c3c6; cursor: pointer; width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.msg-action-btn:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
.msg-action-btn.danger:hover { color: #ff6363; }

@media (hover: none) {
  .msg-actions { position: static; opacity: 1; pointer-events: auto; box-shadow: none; border: none; background: none; padding: 0; margin-left: 4px; }
}

.reaction-picker-wrapper { position: relative; }
.reaction-picker-backdrop { position: fixed; inset: 0; z-index: 4; }
.reaction-picker { position: absolute; bottom: 32px; right: 0; display: flex; gap: 2px; background: #2a3a3f; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 4px 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.35); z-index: 5; }
.reaction-option { background: none; border: none; font-size: 17px; cursor: pointer; padding: 2px 4px; border-radius: 50%; line-height: 1; }
.reaction-option:hover { background: rgba(255,255,255,0.1); }

.composer-wrapper { border-top: 1px solid rgba(255, 255, 255, 0.08); background: #1e2b30; }
.reply-bar { display: flex; align-items: center; gap: 8px; padding: 8px 20px; background: #2a3a3f; color: #b8c3c6; font-size: 13px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.reply-bar .mdi { color: #4fd1c5; }
.reply-bar-text { flex: 1; }
.reply-bar-text strong { color: #4fd1c5; }
.reply-bar-close { background: none; border: none; color: #8a9a9e; font-size: 18px; cursor: pointer; line-height: 1; }
.reply-bar-close:hover { color: #ff6363; }

.composer { display: flex; align-items: center; padding: 15px 20px; gap: 10px; }
.composer input { flex: 1; padding: 10px 14px; border-radius: 8px; border: none; background: #2a3a3f; color: #fff; }
.composer input::placeholder { color: #6b7c80; }
.composer button { background: #4fd1c5; color: #103948; border: none; padding: 0 20px; height: 40px; border-radius: 8px; cursor: pointer; font-weight: 700; }
.composer button:hover { background: #6ee0d5; }

.emoji-wrapper { position: relative; flex-shrink: 0; }
.emoji-toggle { background: #2a3a3f; border: none; color: #b8c3c6; width: 40px; height: 40px; border-radius: 8px; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; }
.emoji-toggle:hover { color: #4fd1c5; }
.emoji-backdrop { position: fixed; inset: 0; z-index: 30; }
.emoji-picker { position: absolute; bottom: 48px; left: 0; z-index: 31; background: #2a3a3f; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 8px; display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px; width: 260px; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4); }
.emoji-option { background: none; border: none; font-size: 18px; padding: 4px; cursor: pointer; border-radius: 4px; line-height: 1; }
.emoji-option:hover { background: rgba(255, 255, 255, 0.08); }
</style>