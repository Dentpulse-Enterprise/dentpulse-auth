import { usersService } from "./users.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { VALID_PERMISSIONS } from "../../constants/sources.js";

export const usersController = {
  getAllUsers: asyncHandler(async (req, res) => {
    const sourceFilter = req.query.source;
    const token = req.token;
    const users = await usersService.getAllUsers(sourceFilter, token);
    sendSuccess(res, users);
  }),

  getDentpulseUsers: asyncHandler(async (req, res) => {
    const users = await usersService.getDentpulseUsers();
    sendSuccess(res, users);
  }),

  getUsersWithTenantsAndOrgs: asyncHandler(async (req, res) => {
    const token = req.token;
    const data = await usersService.getUsersWithTenantsAndOrgs(token);
    sendSuccess(res, data);
  }),

  updatePermission: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { permission, enabled } = req.body;

    if (!permission || typeof enabled !== "boolean") {
      throw ApiError.badRequest(
        "permission (string) and enabled (boolean) are required"
      );
    }

    if (!VALID_PERMISSIONS.includes(permission)) {
      throw ApiError.badRequest(
        `Invalid permission. Must be one of: ${VALID_PERMISSIONS.join(", ")}`
      );
    }

    const data = await usersService.updatePermission(
      userId,
      permission,
      enabled
    );
    sendSuccess(res, data);
  }),
};
