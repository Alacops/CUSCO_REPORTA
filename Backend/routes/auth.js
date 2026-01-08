import express from "express";
import { db } from "../mock/database.js";

const router = express.Router();

// POST /api/login
router.post("/login", (req, res) => {
  res.json({
    ok: true,
    usuario: db.usuarios[0]
  });
});

export default router;
