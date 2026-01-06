/* =========================================================
   CUSCO_REPORTA - 02 INSERTAR DATOS INICIALES (MySQL)
   Inserta: roles, categorías, estados, usuarios demo,
            incidencias demo, historial, notificaciones
   ========================================================= */

USE cusco_reporta;

-- 1) Roles
INSERT INTO roles(nombre) VALUES
('CIUDADANO'),
('ADMINISTRADOR');

-- 2) Categorías (ajusta según tu UI)
INSERT INTO categorias_incidencia(nombre, descripcion) VALUES
('ACCIDENTE', 'Choques, atropellos, volcaduras'),
('BACHE', 'Huecos en la vía'),
('INFRACCION', 'Conducción temeraria, invasión de carril, etc.'),
('MAL_ESTACIONAMIENTO', 'Vehículos en zonas prohibidas'),
('SEMAFORO_AVERIADO', 'Semáforo sin funcionar o intermitente'),
('SENALIZACION_DEFICIENTE', 'Falta o mal estado de señales');

-- 3) Estados
INSERT INTO estados_incidencia(codigo, nombre) VALUES
('RECIBIDO', 'Recibido'),
('EN_PROCESO', 'En proceso'),
('SOLUCIONADO', 'Solucionado');

-- 4) Usuarios demo
-- Nota: password_hash aquí es texto demo. En tu backend pondrás bcrypt/argon2.
INSERT INTO usuarios(rol_id, nombre_completo, dni, email, telefono, direccion, username, password_hash)
VALUES
((SELECT id FROM roles WHERE nombre='ADMINISTRADOR'), 'Administrador CUSCO_REPORTA', NULL, 'admin@cuscoreporta.pe', '999999999', 'Cusco', 'admin', 'HASH_DEMO_ADMIN'),
((SELECT id FROM roles WHERE nombre='CIUDADANO'), 'Juan Pérez', '12345678', 'juan@gmail.com', '987654321', 'Wanchaq', 'juanp', 'HASH_DEMO_JUAN'),
((SELECT id FROM roles WHERE nombre='CIUDADANO'), 'María Quispe', '87654321', 'maria@gmail.com', '912345678', 'Santiago', 'mariaq', 'HASH_DEMO_MARIA');

-- 5) Incidencias demo
-- IMPORTANTE: POINT(longitud, latitud) con SRID 4326
-- Cusco aprox: lon -71.9675, lat -13.5167
INSERT INTO incidencias(
  usuario_id, tipo_registro, categoria_id, estado_id,
  titulo, descripcion, fecha_incidente, departamento, provincia, distrito,
  referencia_lugar, ubicacion, contacto_email, contacto_telefono
) VALUES
(
  (SELECT id FROM usuarios WHERE username='juanp'),
  'REPORTE',
  (SELECT id FROM categorias_incidencia WHERE nombre='BACHE'),
  (SELECT id FROM estados_incidencia WHERE codigo='RECIBIDO'),
  'Bache grande en avenida',
  'Hay un bache profundo que provoca accidentes de motos.',
  CURDATE(),
  'Cusco', 'Cusco', 'Wanchaq',
  'Cerca al paradero principal',
  ST_SRID(POINT(-71.9675, -13.5167), 4326),
  NULL, NULL
),
(
  (SELECT id FROM usuarios WHERE username='mariaq'),
  'DENUNCIA',
  (SELECT id FROM categorias_incidencia WHERE nombre='MAL_ESTACIONAMIENTO'),
  (SELECT id FROM estados_incidencia WHERE codigo='EN_PROCESO'),
  'Vehículo estacionado en zona rígida',
  'Auto bloquea el paso peatonal y genera congestión.',
  CURDATE(),
  'Cusco', 'Cusco', 'Santiago',
  'Frente a mercado',
  ST_SRID(POINT(-71.9780, -13.5220), 4326),
  NULL, NULL
),
(
  NULL,
  'REPORTE',
  (SELECT id FROM categorias_incidencia WHERE nombre='SEMAFORO_AVERIADO'),
  (SELECT id FROM estados_incidencia WHERE codigo='RECIBIDO'),
  'Semáforo apagado',
  'Semáforo no enciende desde la mañana.',
  CURDATE(),
  'Cusco', 'Cusco', 'Cusco',
  'Cruce principal',
  ST_SRID(POINT(-71.9788, -13.5179), 4326),
  'anonimo@correo.com', '900000000'
);

-- 6) Historial de estados (crear entradas iniciales)
INSERT INTO historial_estados(incidencia_id, estado_id, cambiado_por, comentario)
SELECT i.id,
       i.estado_id,
       NULL,
       'Registro creado'
FROM incidencias i;

-- 7) Notificaciones demo
INSERT INTO notificaciones(usuario_id, incidencia_id, tipo, titulo, mensaje)
VALUES
(
  (SELECT id FROM usuarios WHERE username='juanp'),
  (SELECT id FROM incidencias WHERE titulo='Bache grande en avenida' LIMIT 1),
  'REPORTE_RECIBIDO',
  'Tu reporte fue recibido',
  'Gracias por reportar. Revisaremos tu incidencia.'
),
(
  (SELECT id FROM usuarios WHERE username='mariaq'),
  (SELECT id FROM incidencias WHERE titulo='Vehículo estacionado en zona rígida' LIMIT 1),
  'ESTADO_ACTUALIZADO',
  'Tu denuncia está en proceso',
  'Un administrador ya está revisando tu denuncia.'
);

-- 8) Evidencias demo (URLs ficticias)
INSERT INTO evidencias(incidencia_id, url_archivo, tipo_mime, tamano_bytes)
VALUES
(
  (SELECT id FROM incidencias WHERE titulo='Bache grande en avenida' LIMIT 1),
  'uploads/evidencias/bache_01.jpg',
  'image/jpeg',
  245678
);

-- FIN
