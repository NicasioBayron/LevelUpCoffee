--liquibase formatted sql
-- El usuario_id referencia a usuario-service; no hay FK entre bases.
--changeset Bayron:comunidad-1
CREATE TABLE eventos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion VARCHAR(500),
    fecha DATETIME NOT NULL,
    capacidad INT NOT NULL CHECK (capacidad > 0),
    activo INT NOT NULL DEFAULT 1 CHECK (activo IN (0, 1))
);

--changeset Bayron:comunidad-2
CREATE TABLE reservas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evento_id BIGINT NOT NULL,
    usuario_id BIGINT,
    nombre_contacto VARCHAR(150) NOT NULL,
    correo_contacto VARCHAR(150) NOT NULL,
    personas INT NOT NULL CHECK (personas > 0),
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    fecha_solicitud DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservas_evento FOREIGN KEY (evento_id) REFERENCES eventos(id)
);

--changeset Bayron:comunidad-3
CREATE TABLE mensajes_contacto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    asunto VARCHAR(150) NOT NULL,
    mensaje VARCHAR(1000) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'NUEVO',
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--changeset Bayron:comunidad-4
CREATE TABLE publicaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    resumen VARCHAR(500),
    contenido TEXT NOT NULL,
    imagen VARCHAR(250),
    publicado INT NOT NULL DEFAULT 0 CHECK (publicado IN (0, 1)),
    fecha_publicacion DATETIME
);
