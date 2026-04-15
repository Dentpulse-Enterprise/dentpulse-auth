import { supabase } from "../../lib/supabase.js";
import { ApiError } from "../../utils/ApiError.js";

export const authService = {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw ApiError.unauthorized(error.message);
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user,
    };
  },
};
