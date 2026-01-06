import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * GET /incidencias
 * Query params opcionales:
 *  - desde=YYYY-MM-DD
 *  - hasta=YYYY-MM-DD
 *  - estado=todos|reporte|proceso|solucionado
 */
router.get("/", async (req, res) => {
  try {
    const { desde, hasta, estado } = req.query;

    const where = [];
    const params = [];

    // Ojo: fecha_incidente viene con hora, pero comparar con YYYY-MM-DD funciona bien
    if (desde) {
      where.push("DATE(fecha_incidente) >= ?");
      params.push(desde);
    }
    if (hasta) {
      where.push("DATE(fecha_incidente) <= ?");
      params.push(hasta);
    }

    // ✅ Ajustado a tus campos reales de la vista
    if (estado && estado !== "todos") {
      const map = {
        reporte: "RECIBIDO",       // "Reporte" en tu UI equivale a estado RECIBIDO
        proceso: "EN_PROCESO",
        solucionado: "SOLUCIONADO",
      };

      const estadoDb = map[String(estado).toLowerCase()];
      if (estadoDb) {
        where.push("estado_codigo = ?");
        params.push(estadoDb);
      }
    }

    const sql = `
      SELECT
        id,
        tipo_registro,
        categoria,
        estado_codigo,
        estado_nombre,
        titulo,
        descripcion,
        fecha_incidente,
        departamento,
        provincia,
        distrito,
        referencia_lugar,
        longitud,
        latitud
      FROM vw_incidencias_panel
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY id DESC
    `;

    const [rows] = await pool.query(sql, params);

    return res.json({ ok: true, incidencias: rows, total: rows.length });
  } catch (err) {
    console.error("INCIDENCIAS ERROR:", err);
    return res.status(500).json({ ok: false, message: "Error interno al listar incidencias" });
  }
});

export default router;
