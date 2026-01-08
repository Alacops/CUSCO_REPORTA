import express from "express";
import { db } from "../fakeDB.js";

const router = express.Router();

// Registrar usuario
router.post("/register", (req, res) => {
  const nuevo = {
    id: db.usuarios.length + 1,
    ...req.body,
    rol: req.body.rol || "CIUDADANO"
  };

  db.usuarios.push(nuevo);
  res.json({ ok: true, usuario: nuevo });
});

// Listar usuarios
router.get("/", (req, res) => {
  res.json(db.usuarios);
});

export default router;
