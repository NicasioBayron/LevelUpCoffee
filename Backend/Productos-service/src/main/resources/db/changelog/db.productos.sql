--liquibase formatted sql
--changeset Bayron:1
CREATE TABLE categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    activo INT NOT NULL DEFAULT 1
);

CREATE TABLE productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria_id BIGINT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    imagen VARCHAR(250) NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    descuento DECIMAL(5, 2) NOT NULL DEFAULT 0,
    tipo VARCHAR(50) NOT NULL,
    activo INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

--changeset Bayron:2
INSERT INTO categorias (id, nombre, activo) VALUES
    (1, 'Estrategia', 1),
    (2, 'TCG', 1),
    (3, 'Rol', 1),
    (4, 'Cartas', 1),
    (5, 'Café', 1),
    (6, 'Pociones', 1),
    (7, 'Snacks', 1);

INSERT INTO productos (nombre, categoria_id, precio, imagen, descripcion, stock, descuento, tipo, activo) VALUES
    ('Catan (Juego Base)', 1, 39990, '/img/catan.png', 'El clásico juego de mesa de comercio y construcción. Construye carreteras, pueblos y ciudades mientras negocias con otros jugadores para obtener recursos.', 20, 0, 'juego', 1),
    ('Booster Pack Pokemon TCG', 2, 4990, '/img/cartaspokemon.png', 'Un paquete de refuerzo del juego de cartas coleccionables Pokémon. Contiene cartas aleatorias que pueden incluir Pokémon, entrenadores y energías.', 20, 15, 'juego', 1),
    ('Set de Dados D&D "Nebulosa"', 3, 12990, '/img/dados.png', 'Un conjunto de dados poliédricos para juegos de rol, con un diseño de nebulosa en colores vibrantes. Incluye dados de 4, 6, 8, 10, 12 y 20 caras.', 20, 0, 'juego', 1),
    ('Exploding Kittens', 4, 19990, '/img/kittens.png', 'Un juego de cartas donde los gatos explotan. Los jugadores deben evitar los gatos explosivos mientras intentan sobrevivir.', 20, 0, 'juego', 1),
    ('Radiant Espresso', 5, 3990, '/img/espresso.png', 'Boost de energía instantáneo. Ideal antes de una partida clasificatoria.', 20, 0, 'cafe', 1),
    ('Capuchino Trifuerza', 5, 5990, '/img/capuchino.png', 'Equilibrio perfecto entre espresso, leche vaporizada y espuma de leyenda.', 20, 15, 'cafe', 1),
    ('Latte AFK', 5, 4990, '/img/latte.png', 'Suave y reconfortante. Perfecto para un descanso fuera del teclado.', 20, 0, 'cafe', 1),
    ('Poción de Vida', 6, 6990, '/img/pociondevida.png', 'Bebida frutal energizante de color rojo intenso. Restaura +100 de HP.', 20, 0, 'cafe', 1),
    ('Cold Brew Jungla', 6, 8990, '/img/coldbrewjungla.png', 'Extracción en frío con toque herbal para no perder la concentración.', 20, 0, 'cafe', 1),
    ('Muffin de Maná', 7, 3490, '/img/muffindemana.png', 'Bizcocho con arándanos y chispas de chocolate. Restaura +50 de MP.', 20, 15, 'cafe', 1),
    ('Sandwich GG WP', 7, 5990, '/img/sandwich.png', 'Pan ciabatta con jamón, queso fundido y aderezo especial del chef.', 20, 0, 'cafe', 1);
