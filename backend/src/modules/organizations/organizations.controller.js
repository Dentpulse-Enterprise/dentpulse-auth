import { organizationsService } from "./organizations.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";

export const organizationsController = {
  getUsersWithOrg: asyncHandler(async (req, res) => {
    const token = req.token;
    const data = await organizationsService.getUsersWithOrg(token);
    sendSuccess(res, data);
  }),
};
