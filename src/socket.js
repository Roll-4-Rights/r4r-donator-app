// chat feature, opens a socket.io connection to the chat, holds the state, declares functions to join channels, send a message, edit, etc. then listens for server pushes and updates (live connection to the backend)
import { reactive } from "vue";
import { io } from "socket.io-client";

// picks the socket server url based on environment: production build vs local dev
const URL = import.meta.env.PROD
  ? "https://chat.roll4rights.duckdns.org"
  : "http://localhost:5001";

// shared reactive state: connection status, the currently open channel, and messages grouped by channel
export const state = reactive({
  connected: false,
  activeChannel: null,
  messagesByChannel: {}
});

// socket.io client instance, connection deferred until something calls socket.connect()
export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true, // sends cookies/auth headers with the handshake
  transports: ['websocket', 'polling'] // tries websocket first, falls back to polling
});

// connection lifecycle: keeps state.connected in sync and logs handshake failures
socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("connect_error", (err) => {
  console.error("Socket connect_error:", err.message);
});

// switches the active channel, leaving the previous one first so the server stops routing messages there
export function joinChannel(channel) {
  if (state.activeChannel === channel) return;
  if (state.activeChannel) socket.emit('leave_channel', { channel: state.activeChannel });
  state.activeChannel = channel;
  socket.emit('join_channel', { channel });
}

// sends a message to the currently active channel, optionally as a reply to another message
export function sendChannelMessage(text, replyTo = null) {
  if (!state.activeChannel || !text.trim()) return;
  socket.emit('send_channel_message', {
    channel: state.activeChannel,
    message: text,
    replyTo
  });
};


// emits a reaction toggle; the actual state update happens in the reactions_updated listener below once the server confirms it
export function toggleReaction(messageId, channel, emoji) {
  socket.emit('toggle_reaction', { messageId, channel, emoji });
}

// applies a reaction update to the matching message once the server broadcasts it
socket.on('reactions_updated', ({ id, channel, reactions }) => {
  const messages = state.messagesByChannel[channel];
  if (!messages) return;
  const target = messages.find((m) => m.id === id);
  if (target) target.reactions = reactions;
});

// emits an edit request; the confirmed update is applied in the message_edited listener below
export function editMessage(messageId, channel, newText) {
  if (!newText.trim()) return;
  socket.emit('edit_message', { messageId, channel, message: newText });
}

// emits a delete request; the confirmed removal is applied in the message_deleted listener below
export function deleteMessage(messageId, channel) {
  socket.emit('delete_message', { messageId, channel });
}

// loads a channel's message history the first time it's opened, skipped if messages are already cached for that channel
socket.on('channel_history', ({ channel, messages }) => {
  const existing = state.messagesByChannel[channel];
  if (!existing || existing.length === 0) {
    state.messagesByChannel[channel] = messages;
  }
});

// appends an incoming message to its channel's list, creating the list on the first message
socket.on('channel_message', (msg) => {
  (state.messagesByChannel[msg.channel] ??= []).push(msg);
});

// updates a message in place once the server confirms an edit
socket.on('message_edited', ({ id, channel, message, editedAt }) => {
  const messages = state.messagesByChannel[channel];
  if (!messages) return;
  const target = messages.find((m) => m.id === id);
  if (target) {
    target.message = message;
    target.editedAt = editedAt;
  }
});

// removes a message from its channel's list once the server confirms a deletion
socket.on('message_deleted', ({ id, channel }) => {
  const messages = state.messagesByChannel[channel];
  if (messages) {
    state.messagesByChannel[channel] = messages.filter((m) => m.id !== id);
  }
});