/* =========================================================
   CUSCO_REPORTA - 03 VISTAS Y CONSULTAS ÚTILES (MySQL)
   Incluye vistas para: panel admin, estado reportes,
   mapa (lat/lon), conteos por estado/categoría.
   ========================================================= */

USE cusco_reporta;

-- Vista: incidencias para panel (admin)
CREATE OR REPLACE VIEW vw_incidencias_panel AS
SELECT
  i.id,
  i.tipo_registro,
  c.nombre AS categoria,
  e.codigo AS estado_codigo,
  e.nombre AS estado_nombre,
  i.titulo,
  i.descripcion,
  i.fecha_incidente,
  i.departamento, i.provincia, i.distrito,
  i.referencia_lugar,
  ST_X(i.ubicacion) AS longitud,
  ST_Y(i.ubicacion) AS latitud,
  u.nombre_completo AS reportado_por,
  u.email AS email_usuario,
  i.contacto_email,
  i.contacto_telefono,
  i.creado_en,
  i.actualizado_en
FROM incidencias i
JOIN categorias_incidencia c ON c.id = i.categoria_id
JOIN estados_incidencia e ON e.id = i.estado_id
LEFT JOIN usuarios u ON u.id = i.usuario_id;

-- Vista: conteo por estado (dashboard)
CREATE OR REPLACE VIEW vw_conteo_por_estado AS
SELECT
  e.codigo,
  e.nombre,
  COUNT(*) AS total
FROM estados_incidencia e
LEFT JOIN incidencias i ON i.estado_id = e.id
GROUP BY e.codigo, e.nombre;

-- Vista: conteo por categoria
CREATE OR REPLACE VIEW vw_conteo_por_categoria AS
SELECT
  c.nombre AS categoria,
  COUNT(*) AS total
FROM categorias_incidencia c
LEFT JOIN incidencias i ON i.categoria_id = c.id
GROUP BY c.nombre;

-- Consulta útil: incidencias recientes (últimos 7 días)
-- (Ejecuta cuando quieras)
-- SELECT * FROM vw_incidencias_panel
-- WHERE creado_en >= NOW() - INTERVAL 7 DAY
-- ORDER BY creado_en DESC;

-- Consulta útil: incidencias por estado
-- SELECT * FROM vw_incidencias_panel WHERE estado_codigo='RECIBIDO';

-- Consulta útil: notificaciones de un usuario
-- SELECT * FROM notificaciones WHERE usuario_id = 2 ORDER BY creado_en DESC;

-- FIN
