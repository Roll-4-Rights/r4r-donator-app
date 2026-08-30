import { reactive } from "vue";
import { io } from "socket.io-client";

const URL = import.meta.env.PROD
  ? "https://api.roll4rights.duckdns.org"
  : "http://localhost:5000";

export const state = reactive({
  connected: false,
  activeChannel: null,
  messagesByChannel: {}
});

export const socket = io(URL, {
  autoConnect: true,
  withCredentials: true,
  transports: ['websocket', 'polling']
});

socket.on("connect", () => {
  state.connected = true;
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
    message: text
  });
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