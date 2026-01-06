/* =========================================================
   CUSCO_REPORTA - 01 CREAR BASE DE DATOS Y TABLAS (MySQL)
   Recomendado: MySQL 8.0+
   Incluye: roles, usuarios, categorias, estados, incidencias,
            evidencias, historial_estados, notificaciones,
            recuperacion_contrasena
   ========================================================= */

-- 1) Crear BD
DROP DATABASE IF EXISTS cusco_reporta;
CREATE DATABASE cusco_reporta
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE cusco_reporta;

-- 2) Seguridad / modo (opcional)
SET sql_safe_updates = 0;

-- 3) Tablas catálogo
CREATE TABLE roles (
  id       TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre   VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE categorias_incidencia (
  id          SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(60) NOT NULL UNIQUE,
  descripcion TEXT NULL
) ENGINE=InnoDB;

CREATE TABLE estados_incidencia (
  id      TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo  VARCHAR(30) NOT NULL UNIQUE,   -- RECIBIDO, EN_PROCESO, SOLUCIONADO
  nombre  VARCHAR(60) NOT NULL
) ENGINE=InnoDB;

-- 4) Usuarios
CREATE TABLE usuarios (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  rol_id           TINYINT UNSIGNED NOT NULL,
  nombre_completo  VARCHAR(120) NOT NULL,
  dni              VARCHAR(12) NULL,
  email            VARCHAR(120) NULL UNIQUE,
  telefono         VARCHAR(20) NULL,
  direccion        VARCHAR(160) NULL,
  username         VARCHAR(60) NOT NULL UNIQUE,
  password_hash    VARCHAR(255) NOT NULL,  -- hash (bcrypt/argon2)
  estado           ENUM('ACTIVO','BLOQUEADO') NOT NULL DEFAULT 'ACTIVO',
  creado_en        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles(id)
) ENGINE=InnoDB;

CREATE INDEX idx_usuarios_rol ON usuarios(rol_id);

-- 5) Incidencias (REPORTE/DENUNCIA)
-- NOTA: ubicacion = POINT SRID 4326 (longitud, latitud)
CREATE TABLE incidencias (
  id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id         INT UNSIGNED NULL,  -- si es anónimo queda NULL
  tipo_registro      ENUM('REPORTE','DENUNCIA') NOT NULL,
  categoria_id       SMALLINT UNSIGNED NOT NULL,
  estado_id          TINYINT UNSIGNED NOT NULL,

  titulo             VARCHAR(120) NULL,
  descripcion        TEXT NOT NULL,

  -- Campos más usados en denuncias
  fecha_incidente    DATE NULL,
  departamento       VARCHAR(60) NULL,
  provincia          VARCHAR(60) NULL,
  distrito           VARCHAR(60) NULL,
  referencia_lugar   VARCHAR(160) NULL,

  -- ubicación geográfica
  ubicacion          POINT NOT NULL SRID 4326,

  -- contacto opcional si anónimo
  contacto_email     VARCHAR(120) NULL,
  contacto_telefono  VARCHAR(20) NULL,

  creado_en          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_incidencias_usuario  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  CONSTRAINT fk_incidencias_categoria FOREIGN KEY (categoria_id) REFERENCES categorias_incidencia(id),
  CONSTRAINT fk_incidencias_estado   FOREIGN KEY (estado_id) REFERENCES estados_incidencia(id)
) ENGINE=InnoDB;

CREATE INDEX idx_incidencias_estado ON incidencias(estado_id);
CREATE INDEX idx_incidencias_categoria ON incidencias(categoria_id);
CREATE INDEX idx_incidencias_usuario ON incidencias(usuario_id);
CREATE SPATIAL INDEX idx_incidencias_ubicacion ON incidencias(ubicacion);

-- 6) Evidencias (fotos/archivos)
CREATE TABLE evidencias (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  incidencia_id BIGINT UNSIGNED NOT NULL,
  url_archivo   TEXT NOT NULL,
  tipo_mime     VARCHAR(80) NULL,
  tamano_bytes  BIGINT NULL,
  subido_en     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_evidencias_incidencia FOREIGN KEY (incidencia_id) REFERENCES incidencias(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_evidencias_incidencia ON evidencias(incidencia_id);

-- 7) Historial de estados (auditoría)
CREATE TABLE historial_estados (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  incidencia_id BIGINT UNSIGNED NOT NULL,
  estado_id     TINYINT UNSIGNED NOT NULL,
  cambiado_por  INT UNSIGNED NULL,  -- admin que cambió
  comentario    TEXT NULL,
  cambiado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_hist_incidencia FOREIGN KEY (incidencia_id) REFERENCES incidencias(id) ON DELETE CASCADE,
  CONSTRAINT fk_hist_estado     FOREIGN KEY (estado_id) REFERENCES estados_incidencia(id),
  CONSTRAINT fk_hist_admin      FOREIGN KEY (cambiado_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_historial_incidencia ON historial_estados(incidencia_id);

-- 8) Notificaciones
CREATE TABLE notificaciones (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id    INT UNSIGNED NOT NULL,
  incidencia_id BIGINT UNSIGNED NULL,
  tipo          VARCHAR(40) NOT NULL, -- REPORTE_RECIBIDO, ESTADO_ACTUALIZADO, etc.
  titulo        VARCHAR(120) NOT NULL,
  mensaje       TEXT NOT NULL,
  leido         BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_notif_usuario   FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_notif_incidencia FOREIGN KEY (incidencia_id) REFERENCES incidencias(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_notif_usuario ON notificaciones(usuario_id, leido, creado_en);

-- 9) Recuperación de contraseña (código 6 dígitos)
CREATE TABLE recuperacion_contrasena (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT UNSIGNED NOT NULL,
  codigo      VARCHAR(6) NOT NULL,
  expira_en   DATETIME NOT NULL,
  usado       BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_rec_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_recuperacion_usuario ON recuperacion_contrasena(usuario_id, usado, expira_en);

-- FIN
