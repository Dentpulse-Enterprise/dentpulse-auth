const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function authHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('access_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const body = await res.json().catch(() => ({}));

  if (res.status === 401) {
    localStorage.removeItem('access_token');
    window.location.reload();
    throw new Error('Session expired');
  }

  if (!res.ok) {
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  return body.data !== undefined ? body.data : body;
}

export async function loginWithEmail(email, password) {
  return request(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchAdminPanelUsers(source = 'all') {
  const url = source === 'all'
    ? `${API_BASE_URL}/admin-panel/all-users`
    : `${API_BASE_URL}/admin-panel/all-users?source=${source}`;

  return request(url, { headers: authHeaders() });
}

export async function fetchUsersWithTenants() {
  return request(`${API_BASE_URL}/admin-panel/users-with-tenants`, {
    headers: authHeaders(),
  });
}

export async function fetchUsersWithOrg() {
  return request(`${API_BASE_URL}/organizations/users-with-org`, {
    headers: authHeaders(),
  });
}

export async function updateUserPermission(userId, payload) {
  return request(`${API_BASE_URL}/admin-panel/users/${userId}/permissions`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}
