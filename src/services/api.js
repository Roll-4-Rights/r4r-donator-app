// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'; //  Flask middleware

export const apiService = {
  // ============= DONATIONS =============
  
  async fetchDonations() {
    const res = await fetch(`${API_BASE_URL}/donations`);
    if (!res.ok) throw new Error(`Failed to fetch donations: ${res.status}`);
    return res.json();
  },

  async createDonation(formPayload) {
    const res = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formPayload)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ Create failed:', errorData);
      throw new Error(`Create failed: ${res.status}`);
    }
    return await res.json();
  },

  async updateDonation(recordId, payload) {
    const res = await fetch(`${API_BASE_URL}/donations/${recordId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ Update failed:', errorData);
      throw new Error(`Update failed: ${res.status}`);
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
      body: mediaFormData
      // NO HEADERS - let browser set Content-Type with boundary
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
  }
};