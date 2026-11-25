--liquibase formatted sql
-- Los IDs de usuario y producto pertenecen a otros microservicios.
--changeset Bayron:ordenes-1
CREATE TABLE ordenes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(30) NOT NULL UNIQUE,
    usuario_id BIGINT,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    tipo_entrega VARCHAR(30) NOT NULL,
    sucursal_retiro VARCHAR(150),
    nombre_cliente VARCHAR(150) NOT NULL,
    correo_cliente VARCHAR(150) NOT NULL,
    direccion_entrega VARCHAR(250),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    costo_envio DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (costo_envio >= 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0)
);

--changeset Bayron:ordenes-2
CREATE TABLE detalle_orden (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    orden_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    nombre_producto VARCHAR(150) NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    CONSTRAINT fk_detalle_orden_orden FOREIGN KEY (orden_id) REFERENCES ordenes(id)
);
