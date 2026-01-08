import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import pool from "./db.js";
import incidenciasRouter from "./routes/incidencias.js";
import incidenciasCreateRouter from "./routes/incidencias_create.js";
import incidenciasPlacaRouter from "./routes/incidencias_placa.js";
import categoriasRouter from "./routes/categorias_incidencia.js";

dotenv.config();

const app = express();

// 🔐 MIDDLEWARES
app.use(cors());
app.use(express.json());

// 📁 Archivos subidos
app.use("/uploads", express.static("uploads"));

// ===============================
// 🔗 RUTAS API (TODAS BAJO /api)
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/incidencias", incidenciasRouter);
app.use("/api/incidencias", incidenciasCreateRouter);
app.use("/api/incidencias", incidenciasPlacaRouter);
app.use("/api/categorias", categoriasRouter);

// ===============================
// 🩺 HEALTH CHECK (Render)
// ===============================
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "CUSCO_REPORTA API",
    environment: process.env.NODE_ENV || "production"
  });
});

// ===============================
// 🔌 PRUEBA MYSQL
// ===============================
app.get("/api/ping", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "DB connection failed" });
  }
});

// ===============================
// 🚀 SERVER
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API corriendo en puerto ${PORT}`);
});
