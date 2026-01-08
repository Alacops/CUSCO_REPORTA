import express from "express";
import { db } from "../fakeDB.js";

const router = express.Router();

// Registrar incidente
router.post("/", (req, res) => {
  const nuevo = {
    id: db.incidentes.length + 1,
    fecha: new Date().toISOString().split("T")[0],
    ...req.body
  };

  db.incidentes.push(nuevo);
  res.json({ ok: true, incidente: nuevo });
});

// Listar todos
router.get("/", (req, res) => {
  res.json(db.incidentes);
});

// Consultar por placa
router.get("/placa/:placa", (req, res) => {
  const placa = req.params.placa.toUpperCase();
  const resultados = db.incidentes.filter(i => i.placa === placa);
  res.json(resultados);
});

export default router;

