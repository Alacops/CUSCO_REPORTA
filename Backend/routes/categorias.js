import express from "express";
import { db } from "../fakeDB.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(db.categorias);
});

export default router;
