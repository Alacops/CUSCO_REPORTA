import express from "express";
import cors from "cors";

import categoriasRouter from "./routes/categorias.js";
import usuariosRouter from "./routes/usuarios.js";
import incidentesRouter from "./routes/incidentes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta prueba
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "CUSCO_REPORTA API",
    environment: "production"
  });
});

// Rutas API
app.use("/api/categorias", categoriasRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/incidentes", incidentesRouter);

app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});




