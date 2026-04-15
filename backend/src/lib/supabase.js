import { createClient } from "@supabase/supabase-js";
import config from "../config/index.js";

const { url, serviceRoleKey } = config.supabase;

if (!url || !serviceRoleKey) {
  console.warn(
    "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Set them in .env"
  );
}

export const supabase =
  url && serviceRoleKey ? createClient(url, serviceRoleKey) : null;
