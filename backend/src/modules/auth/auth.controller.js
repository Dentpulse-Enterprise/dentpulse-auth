import { authService } from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

export const authController = {
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest("Email and password are required");
    }

    const data = await authService.login(email, password);
    sendSuccess(res, data);
  }),
};
