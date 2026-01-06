const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("API RENIEC Decolecta funcionando");
});

app.get("/api/dni/:dni", async (req, res) => {
  const dni = req.params.dni;

  if (!/^\d{8}$/.test(dni)) {
    return res.status(400).json({ error: "DNI inválido" });
  }

  try {
    const response = await fetch(
      `https://api.decolecta.com/v1/reniec/dni?numero=${dni}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer sk_12677.4Jffo3SEWkkabgK5Io1B1v8Ou3pj22vY",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: "RENIEC rechazó la consulta",
      });
    }

    const data = await response.json();

    // Normalizamos la respuesta para tu frontend
    res.json({
      nombres: data.first_name,
      apellidoPaterno: data.first_last_name,
      apellidoMaterno: data.second_last_name,
      nombreCompleto: data.full_name,
      dni: data.document_number,
    });
  } catch (error) {
    res.status(500).json({ error: "Error consultando RENIEC" });
  }
});

app.listen(3000, () => {
  console.log("Backend activo en http://localhost:3000");
});
