const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function authHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('access_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function fetchAdminPanelUsers() {
  const headers = authHeaders();

  const res = await fetch(`${API_BASE_URL}/admin-panel/users`, { headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Failed to fetch users (${res.status})`);
  }

  const data = await res.json();

  // Map API response to the shape the UI expects
  return data.map((user) => ({
    id: user.user_id,
    name: user.full_name || 'Unknown',
    email: user.email || '',
    clinic: user.clinics.length > 0
      ? user.clinics.map((c) => c.name).join(', ')
      : user.organization_name || 'No clinic',
    clinics: user.clinics,
    organization_name: user.organization_name,
    avatar_url: user.avatar_url,
    role: user.role,
    created_at: user.created_at,
    permissions: {
      dentpulse: user.permissions?.dentpulse ?? false,
      dentledger: user.permissions?.dentledger ?? false,
      dentscale: user.permissions?.dentscale ?? false,
    },
  }));
}

export async function updateUserPermission(userId, payload) {
  const res = await fetch(`${API_BASE_URL}/admin-panel/users/${userId}/permissions`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Failed to update permission (${res.status})`);
  }

  return res.json();
}
