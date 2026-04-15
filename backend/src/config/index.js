const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  host: process.env.HOST || "localhost",
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
};

export default config;
