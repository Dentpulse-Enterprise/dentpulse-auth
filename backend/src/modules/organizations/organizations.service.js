import { ApiError } from "../../utils/ApiError.js";

const DENTPULSE_BASE_URL =
  process.env.DENTPULSE_BASE_URL || "https://dent-api.denish-faldu.in/api";
const DENTSCALE_BASE_URL =
  process.env.DENTSCALE_BASE_URL || "https://skmarketing.denish-faldu.in/api";
const DENTLEDGER_BASE_URL =
  process.env.DENTLEDGER_BASE_URL || "https://dentledger.denish-faldu.in/api";

// ── DentPulse: /admin-panel/users-with-org ───────────────
async function fetchDentPulse(token) {
  const url = `${DENTPULSE_BASE_URL}/admin-panel/users-with-org`;
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || body.response || "DentPulse fetch failed");

  const items = Array.isArray(body.data) ? body.data : [];
  return items.map((item) => ({
    organization: {
      id: item.organization?.id,
      name: item.organization?.name || "Unknown",
      source: "dentpulse",
    },
    owners: (item.owners || []).map((o) => ({
      id: o.user_id || o.id,
      user_id: o.user_id || o.id,
      full_name: o.full_name || "Unknown",
      email: o.email || "",
      avatar_url: o.avatar_url || null,
      role: "owner",
      source: "dentpulse",
      permissions: o.permissions || { dentpulse: true, dentledger: false, dentscale: false },
    })),
    members: (item.members || []).map((m) => ({
      id: m.user_id || m.id,
      user_id: m.user_id || m.id,
      full_name: m.full_name || "Unknown",
      email: m.email || "",
      avatar_url: m.avatar_url || null,
      role: "member",
      source: "dentpulse",
      permissions: m.permissions || { dentpulse: true, dentledger: false, dentscale: false },
    })),
  }));
}

// ── SK Marketing (DentScale): /users-with-tenants ────────
async function fetchSkMarketing(token) {
  const url = `${DENTSCALE_BASE_URL}/users-with-tenants`;
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.status === false)
    throw new Error(body.response || body.error || "SK Marketing fetch failed");

  const items = Array.isArray(body.data) ? body.data : [];
  return items.map((item) => ({
    organization: {
      id: `sk-${item.tenant?.id}`,
      name: item.tenant?.name || "Unknown",
      source: "dentscale",
    },
    owners: (item.owners || []).map((o) => ({
      id: `sk-${o.id}`,
      user_id: `sk-${o.id}`,
      full_name: [o.first_name, o.last_name].filter(Boolean).join(" ") || "Unknown",
      email: o.email || "",
      avatar_url: o.profile_image || null,
      role: "owner",
      source: "dentscale",
      permissions: { dentpulse: false, dentledger: false, dentscale: true },
    })),
    members: (item.members || []).map((m) => ({
      id: `sk-${m.id}`,
      user_id: `sk-${m.id}`,
      full_name: [m.first_name, m.last_name].filter(Boolean).join(" ") || "Unknown",
      email: m.email || "",
      avatar_url: m.profile_image || null,
      role: "member",
      source: "dentscale",
      permissions: { dentpulse: false, dentledger: false, dentscale: true },
    })),
  }));
}

// ── DentLedger: /users-with-organizations ────────────────
async function fetchDentLedger(token) {
  const url = `${DENTLEDGER_BASE_URL}/users-with-organizations`;
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.status === false)
    throw new Error(body.response || body.error || "DentLedger fetch failed");

  const items = Array.isArray(body.data) ? body.data : [];

  // DentLedger returns same org multiple times with different owners – group by org id
  const orgMap = new Map();
  for (const item of items) {
    const orgId = item.organization?.id;
    if (!orgId) continue;

    if (!orgMap.has(orgId)) {
      orgMap.set(orgId, {
        organization: {
          id: `dl-${orgId}`,
          name: item.organization?.name || "Unknown",
          source: "dentledger",
        },
        ownersMap: new Map(),
        membersMap: new Map(),
      });
    }

    const entry = orgMap.get(orgId);

    // Add owner (single per entry)
    if (item.owner) {
      const ownerId = item.owner.id;
      if (!entry.ownersMap.has(ownerId)) {
        entry.ownersMap.set(ownerId, {
          id: `dl-${ownerId}`,
          user_id: `dl-${ownerId}`,
          full_name: [item.owner.name, item.owner.last_name].filter(Boolean).join(" ") || "Unknown",
          email: item.owner.email || "",
          avatar_url: null,
          role: "owner",
          source: "dentledger",
          permissions: { dentpulse: false, dentledger: true, dentscale: false },
        });
      }
    }

    // Add members
    for (const m of item.members || []) {
      if (!entry.membersMap.has(m.id)) {
        entry.membersMap.set(m.id, {
          id: `dl-${m.id}`,
          user_id: `dl-${m.id}`,
          full_name: [m.name, m.last_name].filter(Boolean).join(" ") || "Unknown",
          email: m.email || "",
          avatar_url: null,
          role: "member",
          source: "dentledger",
          permissions: { dentpulse: false, dentledger: true, dentscale: false },
        });
      }
    }
  }

  return Array.from(orgMap.values()).map((entry) => ({
    organization: entry.organization,
    owners: Array.from(entry.ownersMap.values()),
    members: Array.from(entry.membersMap.values()),
  }));
}

// ── Exported service ─────────────────────────────────────
export const organizationsService = {
  async getUsersWithOrg(token) {
    const results = await Promise.allSettled([
      fetchDentPulse(token),
      fetchSkMarketing(token),
      fetchDentLedger(token),
    ]);

    const errors = results.filter((r) => r.status === "rejected");
    if (errors.length === results.length) {
      throw ApiError.badGateway(
        errors[0].reason?.message || "Failed to fetch from all sources"
      );
    }

    errors.forEach((e) => {
      console.warn("[organizations] Source failed:", e.reason?.message);
    });

    const allOrgs = results.flatMap((r) =>
      r.status === "fulfilled" ? r.value : []
    );

    return allOrgs;
  },
};
