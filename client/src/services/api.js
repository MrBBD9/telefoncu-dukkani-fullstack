const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Helper to get headers
  getHeaders() {
    const token = localStorage.getItem('phone_shop_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData)
    });
    return res.json();
  },

  // Phones
  async getPhones(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.brand) query.append('brand', params.brand);
    if (params.status) query.append('status', params.status);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.sort) query.append('sort', params.sort);

    const res = await fetch(`${API_BASE}/phones?${query.toString()}`);
    return res.json();
  },

  async getPhoneById(id) {
    const res = await fetch(`${API_BASE}/phones/${id}`);
    return res.json();
  },

  async createPhone(phoneData) {
    const res = await fetch(`${API_BASE}/phones`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(phoneData)
    });
    return res.json();
  },

  async updatePhone(id, phoneData) {
    const res = await fetch(`${API_BASE}/phones/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(phoneData)
    });
    return res.json();
  },

  async toggleSold(id) {
    const res = await fetch(`${API_BASE}/phones/${id}/toggle-sold`, {
      method: 'PATCH',
      headers: this.getHeaders()
    });
    return res.json();
  },

  async deletePhone(id) {
    const res = await fetch(`${API_BASE}/phones/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return res.json();
  }
};
