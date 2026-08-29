import { reactive } from 'vue';
import { apiService } from './api';

const STORAGE_KEY = 'r4r_donator_token';

export const authState = reactive({
  token: localStorage.getItem(STORAGE_KEY) || null,
  name: null,
  email: null,
  profile_picture: null,
  donator_id: null,
  isLoggedIn: false,
  loading: true // true until we've checked if the stored token is still valid
});

async function applyProfile() {
  const profile = await apiService.fetchCurrentDonator();
  authState.name = profile.name;
  authState.email = profile.email;
  authState.profile_picture = profile.profile_picture;
  authState.donator_id = profile.donator_id;
}

export async function initAuth() {
  if (!authState.token) {
    authState.loading = false;
    return;
  }
  try {
    await applyProfile();
    authState.isLoggedIn = true;
  } catch (err) {
    // session expired or invalid - clear it
    logout();
  } finally {
    authState.loading = false;
  }
}

export function waitForAuthReady() {
  if (!authState.loading) return Promise.resolve();
  return new Promise(resolve => {
    const check = () => {
      if (!authState.loading) resolve();
      else setTimeout(check, 20);
    };
    check();
  });
}

export async function register({ name, email, password }) {
  const data = await apiService.register({ name, email, password });
  setSession(data);
  await applyProfile();
}

export async function login({ email, password }) {
  const data = await apiService.login({ email, password });
  setSession(data);
  await applyProfile();
}

function setSession(data) {
  authState.token = data.token;
  authState.name = data.name;
  authState.email = data.email;
  authState.isLoggedIn = true;
  localStorage.setItem(STORAGE_KEY, data.token);
}

export function logout() {
  authState.token = null;
  authState.name = null;
  authState.email = null;
  authState.profile_picture = null;
  authState.donator_id = null;
  authState.isLoggedIn = false;
  localStorage.removeItem(STORAGE_KEY);
}