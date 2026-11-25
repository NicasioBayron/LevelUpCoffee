# Microservicios Fullstack - LevelUp Coffee

Arquitectura de microservicios con Spring Boot, Spring Data JPA, MySQL y Liquibase para el proyecto **LevelUp Coffee**.

---

## 1. Puertos y Servicios

| Microservicio | Puerto | Base de Datos (MySQL) | Endpoint Base |
| :--- | :--- | :--- | :--- |
| **`Usuario-service`** | `8081` | `usuarios_db` | `http://localhost:8081/api/usuarios` |
| **`Productos-service`** | `8082` | `productos_db` | `http://localhost:8082/api/productos` |
| **`Ordenes-service`** | `8083` | `ordenes_db` | `http://localhost:8083/api/ordenes` |
| **`Comunidad-service`** | `8084` | `comunidad_db` | `http://localhost:8084/api/comunidad` |

---

## 2. Cómo Ejecutar Cada Servicio

Desde la carpeta raíz del proyecto, inicia todos los servicios y MySQL con:

```bash
docker compose up --build
```

La primera ejecución compila las imágenes y puede tardar varios minutos. Compose espera a que MySQL esté listo antes de iniciar los servicios. Las migraciones de Liquibase crean las tablas y datos iniciales. La base persiste en el volumen `mysql_data`.

Para desarrollo local, Compose usa `root` como contraseña predeterminada de MySQL. Puedes cambiarla definiendo `MYSQL_ROOT_PASSWORD` antes de iniciar Compose. No uses esa contraseña predeterminada en producción.

Para detener los contenedores sin borrar la base de datos:

```bash
docker compose down
```

---

## 3. Guía de Endpoints API

### A. Usuario-service (`http://localhost:8081/api/usuarios`)
- `GET /` -> Lista todos los usuarios.
- `GET /{id}` -> Obtiene usuario por ID.
- `POST /registro` -> Registra nuevo usuario (`nombre`, `correo`, `password`, `rol`, etc.).
- `POST /login` -> Inicia sesión con `correo` y `password`.
- `PUT /{id}` -> Actualiza datos del perfil / usuario.
- `DELETE /{id}` -> Elimina un usuario por ID.
- *Datos iniciales cargados*:
  - Administrador: `eileensalas890@gmail.com` / `Nose123`
  - Demo Admin: `admin@levelup.test` / `admin123`

### B. Productos-service (`http://localhost:8082/api/productos`)
- `GET /` -> Lista todos los productos activos.
  - Parámetros opcionales: `?categoriaId=1` o `?tipo=juego` / `?tipo=cafe`.
- `GET /{id}` -> Detalle de un producto.
- `POST /` -> Crea nuevo producto (`nombre`, `categoriaId`, `precio`, `imagen`, `descripcion`, `stock`, `descuento`, `tipo`).
- `PUT /{id}` -> Actualiza producto existente.
- `PATCH /{id}/descontar-stock` -> Descuenta unidades del stock (`{"cantidad": 2}`).
- `DELETE /{id}` -> Baja lógica del producto (`activo = 0`).
- `GET /categorias` -> Lista categorías disponibles (Estrategia, TCG, Rol, Cartas, Café, Pociones, Snacks).
- `POST /categorias` -> Crea una categoría.

### C. Ordenes-service (`http://localhost:8083/api/ordenes`)
- `GET /` -> Lista todas las órdenes ordenadas por fecha reciente.
  - Parámetro opcional: `?usuarioId=1` para ver el historial de un usuario específico.
- `GET /{id}` -> Obtiene orden por ID interno.
- `GET /numero/{numero}` -> Obtiene orden por código (ej. `LU-XXXXXX`).
- `POST /` -> Crea un pedido completo con sus detalles de productos, calcula subtotal y total, e interactúa con `Productos-service` para rebajar el stock automáticamente.
- `PATCH /{id}/estado` -> Cambia estado del pedido (`CONFIRMADO`, `PREPARANDO`, `ENVIADO`, `ENTREGADO`, `CANCELADO`).

### D. Comunidad-service (`http://localhost:8084/api/comunidad`)
- **Eventos:**
  - `GET /eventos` -> Lista de eventos activos (Torneo Catan, Noche de Rol, etc.).
  - `POST /eventos` -> Crea un nuevo evento.
- **Reservas:**
  - `GET /reservas` -> Lista reservas (soporta filtro `?usuarioId=1`).
  - `POST /reservas` -> Genera reserva para un evento (`eventoId`, `nombreContacto`, `correoContacto`, `personas`).
  - `PATCH /reservas/{id}/estado` -> Actualiza estado (`CONFIRMADA`, `CANCELADA`, etc.).
- **Mensajes de contacto:**
  - `GET /mensajes` -> Lista mensajes recibidos.
  - `POST /mensajes` -> Envía mensaje desde el formulario de contacto (`nombre`, `correo`, `asunto`, `mensaje`).
  - `PATCH /mensajes/{id}/estado` -> Actualiza estado (`NUEVO`, `LEIDO`, `RESPONDIDO`).
- **Blog / Publicaciones:**
  - `GET /publicaciones` -> Lista publicaciones (`?soloPublicadas=true`).
  - `GET /publicaciones/{id}` -> Ver contenido de una publicación.
  - `POST /publicaciones` -> Crea una publicación para el blog de la comunidad.
