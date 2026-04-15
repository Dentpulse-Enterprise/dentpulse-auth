import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import usersRoutes from "../modules/users/users.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin-panel", usersRoutes);

// Health check
router.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

export default router;
