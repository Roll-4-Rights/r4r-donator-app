import { reactive } from "vue";

function generateId() {
  return "user_" + Math.random().toString(36).slice(2, 10);
}

const stored = localStorage.getItem("r4r_identity");

export const identity = reactive(
  stored ? JSON.parse(stored) : { userId: null, username: null }
);

export function setUsername(name) {
  if (!identity.userId) identity.userId = generateId();
  identity.username = name;
  localStorage.setItem("r4r_identity", JSON.stringify(identity));
}