import { reactive } from "vue";
import { io } from "socket.io-client";

const URL = process.env.NODE_ENV === "production" 
  ? "https://your-production-server.com" 
  : "http://localhost:3001"; // NEW CHAT PORT

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

export const socket = io(URL, {
  autoConnect: true,
  transports: ['websocket', 'polling']
});

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("foo", (...args) => {
  state.fooEvents.push(args);
});

socket.on("bar", (...args) => {
  state.barEvents.push(args);
});