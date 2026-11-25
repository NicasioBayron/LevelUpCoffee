--liquibase formatted sql
--changeset Bayron:1
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(300),
    comuna VARCHAR(100)
);

--changeset Bayron:2 validCheckSum: ANY
INSERT INTO usuarios (nombre, correo, password, rol, telefono, direccion, comuna)
VALUES ('Eileen Salsas', 'eileensalas890@gmail.com', 'Nose1234', 'ADMIN', NULL, NULL, NULL),
('Admin Demo', 'admin@levelup.test', 'admin123', 'ADMIN', NULL, NULL, NULL);
