import express from "express";
import cors from "cors";
import config from "./config/index.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// ── Global middleware ─────────────────────────────────────
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());

// ── API routes ────────────────────────────────────────────
app.use("/api", routes);

// ── Global error handler (must be last) ───────────────────
app.use(errorHandler);

export default app;
