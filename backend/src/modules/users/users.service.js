import { supabase } from "../../lib/supabase.js";
import { EXTERNAL_SOURCES } from "../../constants/sources.js";
import { ApiError } from "../../utils/ApiError.js";

// ── External API fetcher ──────────────────────────────────

async function fetchExternalUsers(url, sourceKey, token) {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${url}/users`, { headers });
  const body = await res.json().catch(() => ({}));

  if (!res.ok || body.status === false) {
    throw new Error(
      body.response || body.error || `Failed to fetch from ${sourceKey}`
    );
  }

  const users = Array.isArray(body.data) ? body.data : [];

  return users.map((user) => {
    const fullName =
      [user.name, user.last_name].filter(Boolean).join(" ").trim() || "Unknown";

    return {
      id: user.id,
      name: fullName,
      email: user.email || "",
      clinic: user.company_name || "No clinic",
      clinics: user.company_name ? [{ name: user.company_name }] : [],
      organization_name: user.company_name,
      phone: user.phone,
      country: user.country,
      postal_code: user.postal_code,
      role: user.role,
      source: sourceKey,
      permissions: {
        dentpulse: user.permissions?.dentpulse ?? false,
        dentledger:
          sourceKey === "dentledger" || (user.permissions?.dentledger ?? false),
        dentscale:
          sourceKey === "dentscale" || (user.permissions?.dentscale ?? false),
      },
    };
  });
}

// ── Supabase (DentPulse) fetcher ──────────────────────────

async function fetchDentpulseUsers() {
  const { data: authUsers, error: authError } =
    await supabase.auth.admin.listUsers();

  if (authError) throw new Error(authError.message);

  const [{ data: profiles }, { data: userClinics }, { data: permissions }] =
    await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("user_clinics").select("user_id, clinics(id, name)"),
      supabase.from("user_permissions").select("*"),
    ]);

  return authUsers.users.map((authUser) => {
    const profile = profiles?.find((p) => p.user_id === authUser.id) || {};
    const clinics =
      userClinics
        ?.filter((uc) => uc.user_id === authUser.id)
        .map((uc) => uc.clinics)
        .filter(Boolean) || [];
    const userPerms =
      permissions?.find((p) => p.user_id === authUser.id) || {};

    return {
      id: authUser.id,
      name:
        profile.full_name || authUser.user_metadata?.full_name || "Unknown",
      email: authUser.email || "",
      clinic: clinics[0]?.name || profile.organization_name || "No clinic",
      clinics,
      organization_name: profile.organization_name || null,
      role: profile.role || "user",
      source: "dentpulse",
      permissions: {
        dentpulse: userPerms.dentpulse ?? true,
        dentledger: userPerms.dentledger ?? false,
        dentscale: userPerms.dentscale ?? false,
      },
    };
  });
}

// ── Merge users by email ──────────────────────────────────

function mergeUsers(allUsers) {
  const merged = new Map();

  for (const user of allUsers) {
    const key = user.email?.toLowerCase() || `id:${user.source}:${user.id}`;
    const existing = merged.get(key);

    if (existing) {
      merged.set(key, {
        ...existing,
        permissions: {
          dentpulse:
            existing.permissions.dentpulse || user.permissions.dentpulse,
          dentledger:
            existing.permissions.dentledger || user.permissions.dentledger,
          dentscale:
            existing.permissions.dentscale || user.permissions.dentscale,
        },
      });
    } else {
      merged.set(key, user);
    }
  }

  return Array.from(merged.values());
}

// ── Exported service ──────────────────────────────────────

export const usersService = {
  async getAllUsers(sourceFilter, token) {
    const sourcesToFetch =
      sourceFilter && sourceFilter !== "all"
        ? [sourceFilter]
        : ["dentpulse", "dentledger", "dentscale"];

    const promises = sourcesToFetch.map((source) => {
      const url = EXTERNAL_SOURCES[source];
      if (!url) return Promise.resolve([]);
      return fetchExternalUsers(url, source, token);
    });

    const results = await Promise.allSettled(promises);

    const errors = results.filter((r) => r.status === "rejected");
    if (errors.length === results.length) {
      throw ApiError.badGateway(
        errors[0].reason?.message || "Failed to fetch users from all sources"
      );
    }

    errors.forEach((e) => {
      console.warn("Failed to fetch from a source:", e.reason?.message);
    });

    const allUsers = results.flatMap((r) =>
      r.status === "fulfilled" ? r.value : []
    );

    return mergeUsers(allUsers);
  },

  async getDentpulseUsers() {
    return fetchDentpulseUsers();
  },

  async updatePermission(userId, permission, enabled) {
    const { data, error } = await supabase
      .from("user_permissions")
      .upsert(
        { user_id: userId, [permission]: enabled },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) throw ApiError.internal(error.message);

    return data;
  },
};
