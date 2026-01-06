import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import pool from "../db.js";

const router = express.Router();

// Carpeta donde se guardarán evidencias
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const name = `ev_${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({
  dest: "uploads/",
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB
});

// POST /incidencias
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    const {
      fecha_incidente,
      categoria_id,
      placa,
      titulo,
      referencia_lugar,
      distrito,
      departamento,
      provincia,
      descripcion,
      lat,
      lng,
      usuario_id, // null si es anónimo
    } = req.body;

    // 1️⃣ Insertar incidencia
    const [result] = await pool.query(
      `INSERT INTO incidencias
      (fecha_incidente, categoria_id, placa, titulo, referencia_lugar,
       distrito, departamento, provincia, descripcion, lat, lng, usuario_id, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'REPORTE')`,
      [
        fecha_incidente,
        categoria_id || null,
        placa || null,
        titulo,
        referencia_lugar,
        distrito,
        departamento,
        provincia,
        descripcion,
        lat || null,
        lng || null,
        usuario_id || null,
      ]
    );

    const incidenciaId = result.insertId;

    // 2️⃣ Guardar evidencia si hay imagen
    if (req.file) {
      await pool.query(
        `INSERT INTO evidencias (incidencia_id, archivo, tipo)
         VALUES (?, ?, ?)`,
        [incidenciaId, req.file.filename, req.file.mimetype]
      );
    }

    return res.json({
      ok: true,
      message: "Incidencia registrada correctamente",
      id: incidenciaId,
    });
  } catch (err) {
    console.error("ERROR REGISTRANDO INCIDENCIA:", err);
    return res.status(500).json({
      ok: false,
      message: "Error interno al registrar incidencia",
    });
  }
});

export default router;
