import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import usersRoutes from "../modules/users/users.routes.js";
import organizationsRoutes from "../modules/organizations/organizations.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin-panel", usersRoutes);
router.use("/organizations", organizationsRoutes);

// Health check
router.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

export default router;
