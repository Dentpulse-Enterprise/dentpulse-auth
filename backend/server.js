import "dotenv/config";
import express from "express";
import cors from "cors";
import adminPanelRoutes from "./routes/adminPanel.js";

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 6000;
const HOST = process.env.HOST || "central.auth.backend";

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin-panel", adminPanelRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
