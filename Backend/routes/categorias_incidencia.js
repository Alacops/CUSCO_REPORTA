import express from "express";

const router = express.Router();

// GET /api/categorias
router.get("/", async (req, res) => {
  try {
    // 🔥 MODO DEMO (sin MySQL)
    const categoriasDemo = [
      { id: 1, nombre: "Accidente de tránsito" },
      { id: 2, nombre: "Robo" },
      { id: 3, nombre: "Violencia" },
      { id: 4, nombre: "Obras públicas" },
      { id: 5, nombre: "Emergencia médica" },
    ];

    return res.json({
      ok: true,
      categorias: categoriasDemo,
      demo: true
    });
  } catch (err) {
    console.error("CATEGORIAS ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Error al listar categorías"
    });
  }
});

export default router;
