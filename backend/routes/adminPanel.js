import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/admin-panel/users
router.get("/users", requireAuth, async (req, res) => {
  try {
    // Fetch all users from auth.users via admin API
    const { data: authUsers, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError) {
      return res.status(500).json({ error: authError.message });
    }

    // Fetch profiles with clinic & permission data
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("*");

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    // Fetch user-clinic relationships
    const { data: userClinics, error: clinicError } = await supabase
      .from("user_clinics")
      .select("user_id, clinics(id, name)");

    if (clinicError) {
      return res.status(500).json({ error: clinicError.message });
    }

    // Fetch permissions
    const { data: permissions, error: permError } = await supabase
      .from("user_permissions")
      .select("*");

    if (permError) {
      return res.status(500).json({ error: permError.message });
    }

    // Build the response
    const users = authUsers.users.map((authUser) => {
      const profile = profiles?.find((p) => p.user_id === authUser.id) || {};
      const clinics = userClinics
        ?.filter((uc) => uc.user_id === authUser.id)
        .map((uc) => uc.clinics)
        .filter(Boolean) || [];
      const userPerms = permissions?.find((p) => p.user_id === authUser.id) || {};

      return {
        user_id: authUser.id,
        email: authUser.email,
        full_name: profile.full_name || authUser.user_metadata?.full_name || null,
        avatar_url: profile.avatar_url || authUser.user_metadata?.avatar_url || null,
        role: profile.role || "user",
        organization_name: profile.organization_name || null,
        clinics,
        permissions: {
          dentpulse: userPerms.dentpulse ?? false,
          dentledger: userPerms.dentledger ?? false,
          dentscale: userPerms.dentscale ?? false,
        },
        created_at: authUser.created_at,
      };
    });

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin-panel/users/:userId/permissions
router.patch("/users/:userId/permissions", requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { permission, enabled } = req.body;

    if (!permission || typeof enabled !== "boolean") {
      return res.status(400).json({ error: "permission (string) and enabled (boolean) are required" });
    }

    const validPermissions = ["dentpulse", "dentledger", "dentscale"];
    if (!validPermissions.includes(permission)) {
      return res.status(400).json({ error: `Invalid permission. Must be one of: ${validPermissions.join(", ")}` });
    }

    // Upsert the permission
    const { data, error } = await supabase
      .from("user_permissions")
      .upsert(
        { user_id: userId, [permission]: enabled },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Error updating permission:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
