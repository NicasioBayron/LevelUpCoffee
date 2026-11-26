import { api } from "./client";

function normalizeProduct(product) {
  const category = product.categoria;
  return {
    ...product,
    categoria:
      category && typeof category === "object" ? category.nombre : category,
    categoriaId:
      category && typeof category === "object"
        ? category.id
        : product.categoriaId,
  };
}

// 1. Microservicio de Productos
export const productService = {
  // GET /api/productos (acepta filtros opcionales: { categoriaId: 1, tipo: "juego" })
  getAll: async (params = {}) => {
    const { data } = await api.get("/productos", { params });
    if (!Array.isArray(data)) {
      throw new Error("El backend no devolvió una lista de productos.");
    }
    return data.map(normalizeProduct);
  },

  // GET /api/productos/{id}
  getById: async (id) => {
    const { data } = await api.get(`/productos/${id}`);
    return normalizeProduct(data);
  },

  // POST /api/productos
  create: async (productoData) => {
    const { data } = await api.post("/productos", productoData);
    return data;
  },

  // PUT /api/productos/{id}
  update: async (id, productoData) => {
    const { data } = await api.put(`/productos/${id}`, productoData);
    return data;
  },

  // PATCH /api/productos/{id}/descontar-stock
  descontarStock: async (id, cantidad) => {
    const { data } = await api.patch(`/productos/${id}/descontar-stock`, { cantidad });
    return data;
  },

  // DELETE /api/productos/{id}
  delete: async (id) => {
    await api.delete(`/productos/${id}`);
  },

  // GET /api/productos/categorias
  getCategorias: async () => {
    const { data } = await api.get("/productos/categorias");
    return data;
  },

  // POST /api/productos/categorias
  createCategoria: async (categoriaData) => {
    const { data } = await api.post("/productos/categorias", categoriaData);
    return data;
  },
};

// 2. Microservicio de Usuarios / Auth
export const authService = {
  // GET /api/usuarios
  getAll: async () => {
    const { data } = await api.get("/usuarios");
    return data;
  },

  // GET /api/usuarios/{id}
  getById: async (id) => {
    const { data } = await api.get(`/usuarios/${id}`);
    return data;
  },

  // POST /api/usuarios/registro
  registrar: async (usuarioData) => {
    const { data } = await api.post("/usuarios/registro", usuarioData);
    return data;
  },

  // POST /api/usuarios/login
  login: async (credenciales) => {
    const { data } = await api.post("/usuarios/login", credenciales);
    return data;
  },

  // PUT /api/usuarios/{id}
  update: async (id, usuarioData) => {
    const { data } = await api.put(`/usuarios/${id}`, usuarioData);
    return data;
  },

  // DELETE /api/usuarios/{id}
  delete: async (id) => {
    await api.delete(`/usuarios/${id}`);
  },
};

// 3. Microservicio de Órdenes
export const orderService = {
  // GET /api/ordenes (opcional: pasar { usuarioId: 1 } para filtrar por usuario)
  getAll: async (usuarioId = null) => {
    const params = usuarioId ? { usuarioId } : {};
    const { data } = await api.get("/ordenes", { params });
    return data;
  },

  // GET /api/ordenes/{id}
  getById: async (id) => {
    const { data } = await api.get(`/ordenes/${id}`);
    return data;
  },

  // GET /api/ordenes/numero/{numero}
  getByNumero: async (numero) => {
    const { data } = await api.get(`/ordenes/numero/${numero}`);
    return data;
  },

  // POST /api/ordenes
  crear: async (ordenData) => {
    const { data } = await api.post("/ordenes", ordenData);
    return data;
  },

  // PATCH /api/ordenes/{id}/estado
  actualizarEstado: async (id, estado) => {
    const { data } = await api.patch(`/ordenes/${id}/estado`, { estado });
    return data;
  },
};

// 4. Microservicio de Comunidad
export const communityService = {
  // --- EVENTOS ---
  // GET /api/comunidad/eventos
  getEventos: async () => {
    const { data } = await api.get("/comunidad/eventos");
    return data;
  },

  // POST /api/comunidad/eventos
  crearEvento: async (eventoData) => {
    const { data } = await api.post("/comunidad/eventos", eventoData);
    return data;
  },

  // --- RESERVAS ---
  // GET /api/comunidad/reservas (opcional: pasar usuarioId para filtrar)
  getReservas: async (usuarioId = null) => {
    const params = usuarioId ? { usuarioId } : {};
    const { data } = await api.get("/comunidad/reservas", { params });
    return data;
  },

  // POST /api/comunidad/reservas
  crearReserva: async (reservaData) => {
    const { data } = await api.post("/comunidad/reservas", reservaData);
    return data;
  },

  // PATCH /api/comunidad/reservas/{id}/estado
  actualizarEstadoReserva: async (id, estado) => {
    const { data } = await api.patch(`/comunidad/reservas/${id}/estado`, { estado });
    return data;
  },

  // --- MENSAJES DE CONTACTO ---
  // GET /api/comunidad/mensajes
  getMensajes: async () => {
    const { data } = await api.get("/comunidad/mensajes");
    return data;
  },

  // POST /api/comunidad/mensajes
  crearMensaje: async (mensajeData) => {
    const { data } = await api.post("/comunidad/mensajes", mensajeData);
    return data;
  },

  // PATCH /api/comunidad/mensajes/{id}/estado
  actualizarEstadoMensaje: async (id, estado) => {
    const { data } = await api.patch(`/comunidad/mensajes/${id}/estado`, { estado });
    return data;
  },

  // --- BLOG / PUBLICACIONES ---
  // GET /api/comunidad/publicaciones (por defecto soloPublicadas = true)
  getPublicaciones: async (soloPublicadas = true) => {
    const { data } = await api.get("/comunidad/publicaciones", {
      params: { soloPublicadas },
    });
    return data;
  },

  // GET /api/comunidad/publicaciones/{id}
  getPublicacionById: async (id) => {
    const { data } = await api.get(`/comunidad/publicaciones/${id}`);
    return data;
  },

  // POST /api/comunidad/publicaciones
  crearPublicacion: async (publicacionData) => {
    const { data } = await api.post("/comunidad/publicaciones", publicacionData);
    return data;
  },
};

export const cartService = {
  get: async ({ usuarioId = null, sessionToken = null } = {}) => {
    const { data } = await api.get("/carrito", { params: { usuarioId, sessionToken } });
    return data;
  },
  add: async (id, productoId, cantidad) => {
    const { data } = await api.post(`/carrito/${id}/items`, { productoId, cantidad });
    return data;
  },
  update: async (id, productoId, cantidad) => {
    const { data } = await api.put(`/carrito/${id}/items/${productoId}`, { cantidad });
    return data;
  },
  remove: async (id, productoId) => {
    const { data } = await api.delete(`/carrito/${id}/items/${productoId}`);
    return data;
  },
  clear: async (id) => api.delete(`/carrito/${id}`),
};

export const paymentService = {
  process: async (paymentData) => {
    const { data } = await api.post("/pagos/procesar", paymentData);
    return data;
  },
  getByOrder: async (number) => {
    const { data } = await api.get(`/pagos/orden/${number}`);
    return data;
  },
};

export const tournamentService = {
  getAll: async () => {
    const { data } = await api.get("/torneos");
    return data.map((item) => ({
      ...item,
      title: item.title ?? item.titulo,
      game: item.game ?? item.juego,
      description: item.description ?? item.descripcion,
      image: item.image ?? item.imagen,
      date: item.date ?? item.fecha,
      maxParticipants: item.maxParticipants ?? item.maxParticipantes,
      registered: item.registered ?? item.inscripciones?.length ?? 0,
      status: item.status ?? item.estado,
    }));
  },
  getById: async (id) => {
    const { data } = await api.get(`/torneos/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post("/torneos", payload);
    return data;
  },
  delete: async (id) => {
    await api.delete(`/torneos/${id}`);
  },
  register: async (id, payload) => {
    const { data } = await api.post(`/torneos/${id}/inscripciones`, payload);
    return data;
  },
  withdraw: async (id, usuarioId) => {
    await api.delete(`/torneos/${id}/inscripciones/usuario/${usuarioId}`);
  },
  participants: async (id) => {
    const { data } = await api.get(`/torneos/${id}/inscripciones`);
    return data;
  },
  matches: async (id) => {
    const { data } = await api.get(`/torneos/${id}/partidas`);
    return data;
  },
};
