// src/services/api.js
const TOKEN = 'p07VXeoklQ3hvXd0xDRPFQYRZVIoGRZFkWVYYdFZ';
const TABLE_ID = 'mz13h8aderpp87u'; // Donate Item form
const EVENTS_TABLE_ID = 'mq9hvkpcru9awnq'; // calendar

const API_BASE_URL = 'http://localhost:5000/api'; // ✅ Flask
// NOT: 'http://localhost:8080/api' // ❌ Direct NocoDB

export const apiService = {
  // Pull entries cleanly from NocoDB v2 Base/Table endpoint
  async fetchDonations() {
    const res = await fetch(`${API_BASE_URL}/donations`);
    return res.json();
  },

  // CHOSEN CALENDAR FUNCTION - ADDED INSIDE THE EXPORT BLOCK 
  async fetchCalendar() {
    const res = await fetch(`${API_BASE_URL}/calendar`);
    return res.json();
  },

  // Hand binary multi-part uploads cleanly to storage controllers
  async uploadPhotos(files) {
    if (!files || !files.length) return [];
    const mediaFormData = new FormData();
    files.forEach(file => mediaFormData.append('file', file));

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: { 'xc-token': TOKEN, 'Accept': 'application/json' },
      body: mediaFormData
    });
    if (!res.ok) throw new Error(`Media Upload Failed: ${res.status}`);
    return await res.json();
  },

  // Update an EXISTING record by Id (edit form, tracking numbers, etc.)
  async updateDonation(payload) {
    const res = await fetch(`${API_BASE_URL}/donations`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'xc-token': TOKEN,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error(' NocoDB Rejected Update:', JSON.stringify(errorData, null, 2));
      throw new Error(`Update operation failed: ${res.status}`);
    }
    return await res.json();
  },

  // Submit standard text inputs payload straight to rows
  async createDonation(formPayload) {
    const res = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xc-token': TOKEN,
        'Accept': 'application/json'
      },
      body: JSON.stringify(formPayload)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('⚠️ NocoDB Rejected Object:', JSON.stringify(errorData, null, 2));
      throw new Error(`Write operation failed: ${res.status}`);
    }
    return await res.json();
  }
};