import { reactive } from "vue";
import { io } from "socket.io-client";

const URL = import.meta.env.PROD
  ? "https://chat.roll4rights.duckdns.org"
  : "http://localhost:5001";

export const state = reactive({
  connected: false,
  activeChannel: null,
  messagesByChannel: {}
});

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket', 'polling']
});

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("connect_error", (err) => {
  console.error("Socket connect_error:", err.message);
});

export function joinChannel(channel) {
  if (state.activeChannel === channel) return;
  if (state.activeChannel) socket.emit('leave_channel', { channel: state.activeChannel });
  state.activeChannel = channel;
  socket.emit('join_channel', { channel });
}

export function sendChannelMessage(text, replyTo = null) {
  if (!state.activeChannel || !text.trim()) return;
  socket.emit('send_channel_message', {
    channel: state.activeChannel,
    message: text,
    replyTo
  });
}

export function editMessage(messageId, channel, newText) {
  if (!newText.trim()) return;
  socket.emit('edit_message', { messageId, channel, message: newText });
}

export function deleteMessage(messageId, channel) {
  socket.emit('delete_message', { messageId, channel });
}

socket.on('channel_history', ({ channel, messages }) => {
  const existing = state.messagesByChannel[channel];
  if (!existing || existing.length === 0) {
    state.messagesByChannel[channel] = messages;
  }
});

socket.on('channel_message', (msg) => {
  (state.messagesByChannel[msg.channel] ??= []).push(msg);
});

socket.on('message_edited', ({ id, channel, message, editedAt }) => {
  const messages = state.messagesByChannel[channel];
  if (!messages) return;
  const target = messages.find((m) => m.id === id);
  if (target) {
    target.message = message;
    target.editedAt = editedAt;
  }
});

socket.on('message_deleted', ({ id, channel }) => {
  const messages = state.messagesByChannel[channel];
  if (messages) {
    state.messagesByChannel[channel] = messages.filter((m) => m.id !== id);
  }
});