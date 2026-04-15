const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function authHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('access_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function loginWithEmail(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error_description || data.msg || 'Invalid email or password');
  }

  return data;
}

const DENTLEDGER_API_URL = 'https://dentledger.denish-faldu.in/api';
const DENTSCALE_API_URL = 'https://skmarketing.denish-faldu.in/api';

async function fetchUsersFromSource(url, sourceKey) {
  const res = await fetch(`${url}/users`, { headers: authHeaders() });
  const body = await res.json().catch(() => ({}));

  if (!res.ok || body.status === false) {
    throw new Error(body.response || body.error || `Failed to fetch users (${res.status})`);
  }

  const users = Array.isArray(body.data) ? body.data : [];

  return users.map((user) => {
    const fullName = [user.name, user.last_name].filter(Boolean).join(' ').trim() || 'Unknown';
    return {
      id: user.id,
      name: fullName,
      email: user.email || '',
      clinic: user.company_name || 'No clinic',
      clinics: user.company_name ? [{ name: user.company_name }] : [],
      organization_name: user.company_name,
      phone: user.phone,
      country: user.country,
      postal_code: user.postal_code,
      role: user.role,
      source: sourceKey,
      permissions: {
        dentpulse: sourceKey === 'dentpulse' || (user.permissions?.dentpulse ?? false),
        dentledger: sourceKey === 'dentledger' || (user.permissions?.dentledger ?? false),
        dentscale: sourceKey === 'dentscale' || (user.permissions?.dentscale ?? false),
      },
    };
  });
}

const SOURCE_CONFIG = {
  dentledger: { url: DENTLEDGER_API_URL, key: 'dentledger' },
  dentscale: { url: DENTSCALE_API_URL, key: 'dentscale' },
  dentpulse: { url: API_BASE_URL + '/admin-panel', key: 'dentpulse' },
};

export async function fetchAdminPanelUsers(source = 'all') {
  const sources =
    source === 'all' ? ['dentpulse', 'dentledger', 'dentscale'] : [source];

  const results = await Promise.allSettled(
    sources.map((s) => fetchUsersFromSource(SOURCE_CONFIG[s].url, SOURCE_CONFIG[s].key))
  );

  const errors = results.filter((r) => r.status === 'rejected');
  if (errors.length === results.length) {
    throw new Error(errors[0].reason?.message || 'Failed to fetch users');
  }

  const all = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));

  const merged = new Map();
  for (const user of all) {
    const key = user.email?.toLowerCase() || `id:${user.source}:${user.id}`;
    const existing = merged.get(key);
    if (existing) {
      merged.set(key, {
        ...existing,
        permissions: {
          dentpulse: existing.permissions.dentpulse || user.permissions.dentpulse,
          dentledger: existing.permissions.dentledger || user.permissions.dentledger,
          dentscale: existing.permissions.dentscale || user.permissions.dentscale,
        },
      });
    } else {
      merged.set(key, user);
    }
  }

  return Array.from(merged.values());
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
