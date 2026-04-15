import { supabase } from "../lib/supabase.js";
import { ApiError } from "../utils/ApiError.js";

export const requireAuth = async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Missing or invalid token"));
  }

  const token = authHeader.split(" ")[1];

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return next(ApiError.unauthorized("Invalid or expired token"));
  }

  req.user = user;
  req.token = token;
  next();
};
