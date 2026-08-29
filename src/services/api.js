// src/services/api.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'; //  Flask middleware
export const apiService = {
  // ============= AUTH =============

  async register({ name, email, password }) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Register failed: ${res.status}`);
    return data; // { name, email }
  },

  async login({ email, password }) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Login failed: ${res.status}`);
    return data; // { name, email }
  },

  async logout() {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    if (!res.ok) throw new Error(`Logout failed: ${res.status}`);
  },

  async fetchCurrentDonator() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include'
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Failed to fetch profile: ${res.status}`);
    return data; // { donator_id, email }
  },

  // ============= ACCOUNT  =============

  async uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append('picture', file);

    const res = await fetch(`${API_BASE_URL}/auth/profile-picture`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Upload failed: ${res.status}`);
    return data; // { profile_picture }
  },

    async updateName(name) {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Update failed: ${res.status}`);
    return data; // { name }
  },

  async changePassword({ current_password, new_password }) {
    const res = await fetch(`${API_BASE_URL}/auth/password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ current_password, new_password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Password update failed: ${res.status}`);
    return data;
  },

  // ============= DONATIONS =============

  async fetchDonations() {
    const res = await fetch(`${API_BASE_URL}/donations`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to fetch donations: ${res.status}`);
    return res.json();
  },

  async createDonation(formPayload) {
    const res = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formPayload)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ Create failed:', errorData);
      throw new Error(errorData.error || `Create failed: ${res.status}`);
    }
    return await res.json();
  },

  async updateDonation(recordId, payload) {
    const res = await fetch(`${API_BASE_URL}/donations/${recordId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ Update failed:', errorData);
      throw new Error(errorData.error || `Update failed: ${res.status}`);
    }
    return await res.json();
  },

  // ============= CALENDAR =============
  
  async fetchCalendar() {
    const res = await fetch(`${API_BASE_URL}/calendar`);
    if (!res.ok) throw new Error(`Failed to fetch calendar: ${res.status}`);
    return res.json();
  },

  async fetchTeamCalendar() {
    const res = await fetch(`${API_BASE_URL}/calendar/team`);
    if (!res.ok) throw new Error(`Failed to fetch team calendar: ${res.status}`);
    return res.json();
  },

  // ============= FILE UPLOAD =============
  
  async uploadPhotos(files) {
    if (!files || !files.length) return [];
    
    const mediaFormData = new FormData();
    files.forEach(file => mediaFormData.append('file', file));

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      credentials: 'include',
      body: mediaFormData
      // NO Content-Type header - browser sets it with the multipart boundary
    });
    
    if (!res.ok) throw new Error(`Media Upload Failed: ${res.status}`);
    return await res.json();
  },

  // ============= CHAT =============
  
  async fetchUserMessages() {
    const res = await fetch(`${API_BASE_URL}/chat/user-messages`);
    if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
    return res.json();
  },

  async sendUserMessage(message) {
    const res = await fetch(`${API_BASE_URL}/chat/user-messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);
    return res.json();
  },

  async fetchMessages() {
    const res = await fetch(`${API_BASE_URL}/messages`, { credentials: 'include' });
    if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
    return res.json();
  },

  async sendMessage(question) {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Question: question })
    });
    if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);
    return res.json();
  },

  // ============= DONATOR PROFILE =============

  async fetchDonatorProfile() {
    const res = await fetch(`${API_BASE_URL}/donator-profile`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to fetch donator profile: ${res.status}`);
    return res.json();
  },

  async saveDonatorProfile(payload) {
    const res = await fetch(`${API_BASE_URL}/donator-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Save failed: ${res.status}`);
    return data;
  },

  async fetchCampaignProgress() {
    const res = await fetch(`${API_BASE_URL}/campaign-progress`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to fetch campaign progress: ${res.status}`);
    return res.json();
  },

  async fetchCampaignInfo() {
    const res = await fetch(`${API_BASE_URL}/campaign-info`, { credentials: 'include' });
    if (!res.ok) throw new Error(`Failed to fetch campaign info: ${res.status}`);
    return res.json();
  },

  async fetchAnnouncements() {
    const res = await fetch(`${API_BASE_URL}/announcements`, { credentials: 'include' });
    if (!res.ok) throw new Error(`Failed to fetch announcements: ${res.status}`);
    return res.json();
  },

  // ============= DONATOR FAQS =============

  async fetchDonatorFaqs() {
    const res = await fetch(`${API_BASE_URL}/donator-faqs`, { credentials: 'include' });
    if (!res.ok) throw new Error(`Failed to fetch donator FAQs: ${res.status}`);
    return res.json();
  }
};
