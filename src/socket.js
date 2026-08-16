import { reactive } from "vue";
import { io } from "socket.io-client";
import { identity } from "./identity";

const URL = import.meta.env.PROD
  ? "https://your-production-server.com"
  : "http://localhost:3001";

export const state = reactive({
  connected: false,
  activeChannel: null,
  messagesByChannel: {}
});

export const socket = io(URL, {
  autoConnect: true,
  transports: ['websocket', 'polling']
});

socket.on("connect", () => {
  state.connected = true;
  if (identity.userId) {
    socket.emit('identify', { userId: identity.userId, username: identity.username });
  }
});

socket.on("disconnect", () => {
  state.connected = false;
});

export function joinChannel(channel) {
  if (state.activeChannel === channel) return;
  if (state.activeChannel) socket.emit('leave_channel', { channel: state.activeChannel });
  state.activeChannel = channel;
  socket.emit('join_channel', { channel });
}

export function sendChannelMessage(text) {
  if (!state.activeChannel || !text.trim()) return;
  socket.emit('send_channel_message', {
    channel: state.activeChannel,
    senderID: identity.userId,
    senderName: identity.username,
    message: text
  });
}

socket.on('channel_history', ({ channel, messages }) => {
  // Don't overwrite local cache with an empty result (e.g. failed NocoDB fetch)
  const existing = state.messagesByChannel[channel];
  if (!existing || existing.length === 0) {
    state.messagesByChannel[channel] = messages;
  }
});

socket.on('channel_message', (msg) => {
  (state.messagesByChannel[msg.channel] ??= []).push(msg);
});