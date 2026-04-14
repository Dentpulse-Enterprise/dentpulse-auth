import "dotenv/config";
import express from "express";
import cors from "cors";
import adminPanelRoutes from "./routes/adminPanel.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin-panel", adminPanelRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
