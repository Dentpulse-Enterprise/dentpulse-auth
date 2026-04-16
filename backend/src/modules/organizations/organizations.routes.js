import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { organizationsController } from "./organizations.controller.js";

const router = Router();

router.get("/users-with-org", requireAuth, organizationsController.getUsersWithOrg);

export default router;
