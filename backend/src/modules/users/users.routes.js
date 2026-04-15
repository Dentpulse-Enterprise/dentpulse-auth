import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { usersController } from "./users.controller.js";

const router = Router();

router.get("/all-users", requireAuth, usersController.getAllUsers);
router.get("/users", requireAuth, usersController.getDentpulseUsers);
router.patch(
  "/users/:userId/permissions",
  requireAuth,
  usersController.updatePermission
);

export default router;
