import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../Store.jsx";
import {
  productService,
  authService,
  orderService,
  communityService,
  tournamentService,
} from "../api/services";
import { PageTitle, ErrorMessage } from "../components";
import { money, price } from "../database";

const TABS = [
  ["products", "Productos"],
  ["users", "Usuarios"],
  ["orders", "Órdenes"],
  ["messages", "Mensajes"],
  ["reservations", "Reservas"],
  ["tournaments", "Torneos"],
];

const INITIAL_FORM = {
  title: "",
  game: "",
  mode: "LIGUILLA",
  maxParticipants: 8,
  date: "",
  image: "valorant.png",
};

const INITIAL_DATA = {
  products: [],
  users: [],
  orders: [],
  messages: [],
  reservations: [],
  tournaments: [],
};

export function Admin() {
  const { user, setNotice } = useShop();
  const [tab, setTab] = useState("products");
  const [data, setData] = useState(INITIAL_DATA);
  const [error, setError] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);

  const isAdmin = user?.rol === "ADMIN" || user?.role === "admin";

  const load = useCallback(async () => {
    try {
      setData(
        Object.fromEntries(
          ["products", "users", "orders", "messages", "reservations", "tournaments"].map(
            (key) => [key, []]
          )
        )
      );

      const results = await Promise.allSettled([
        productService.getAll(),
        authService.getAll(),
        orderService.getAll(),
        communityService.getMensajes(),
        communityService.getReservas(),
        tournamentService.getAll(),
      ]);
      const value = (index) => results[index].status === "fulfilled" ? results[index].value : [];
      setData({
        products: value(0),
        users: value(1),
        orders: value(2),
        messages: value(3),
        reservations: value(4),
        tournaments: value(5),
      });
      const failed = results.filter((result) => result.status === "rejected");
      if (failed.length === results.length) {
        setError(failed[0].reason?.response?.data?.error || failed[0].reason?.message || "No se pudo cargar ningún servicio.");
      } else {
        // Una sección puede fallar sin ocultar los datos que sí respondieron.
        setError("");
        if (failed.length) console.warn("Algunos servicios no respondieron:", failed);
      }
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  if (!user || !isAdmin) {
    return (
      <main className="container section">
        <PageTitle title="Administración" />
        <p>Necesitas una cuenta administradora para entrar.</p>
        <Link className="btn btn-lime" to="/login?next=/admin">
          Ingresar como administrador
        </Link>
      </main>
    );
  }

  const updateStatus = async (action) => {
    try {
      await action;
      await load();
      setNotice("Estado actualizado.");
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  const handleCreateTournament = async () => {
    if (!form.title || !form.game || !form.date || !form.image) {
      return setError("Completa todos los campos del torneo.");
    }

    try {
      await tournamentService.create({ ...form, maxParticipants: Number(form.maxParticipants) });
      setForm(INITIAL_FORM);
      setNotice("Torneo creado y publicado en Comunidad.");
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  const handleDeleteTournament = async (tournament) => {
    if (!window.confirm(`¿Eliminar el torneo "${tournament.title}"?`)) return;
    try {
      await tournamentService.delete(tournament.id);
      await load();
      setNotice("Torneo eliminado.");
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  const currentTabLabel = TABS.find((x) => x[0] === tab)?.[1];
  const currentItems = data[tab] || [];

  return (
    <main className="container section">
      <PageTitle
        eyebrow="LEVEL UP / CENTRO DE CONTROL"
        title="Administración conectada."
      >
        Los datos se cargan desde tus microservicios.
      </PageTitle>

      <div className="admin-grid">
        <aside className="admin-nav">
          {TABS.map(([id, label]) => (
            <button
              type="button"
              className={tab === id ? "selected" : ""}
              key={id}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
          <Link to="/perfil">Mi perfil &rarr;</Link>
        </aside>

        <section className="admin-content">
          <ErrorMessage message={error} />

          {tab === "tournaments" ? (
            <TournamentForm
              value={form}
              onChange={setForm}
              onCreate={handleCreateTournament}
            />
          ) : (
            <>
              <h2>{currentTabLabel}</h2>

              {currentItems.map((item) => (
                <article className="panel mb-3" key={item.id}>
                  {tab === "products" && (
                    <>
                      <strong>{item.nombre}</strong>
                      <p>
                        {money(price(item))} &middot; stock {item.stock}
                      </p>
                    </>
                  )}

                  {tab === "users" && (
                    <>
                      <strong>{item.nombre}</strong>
                      <p>
                        {item.correo} &middot; {item.rol}
                      </p>
                    </>
                  )}

                  {tab === "orders" && (
                    <>
                      <strong>{item.numero || `#${item.id}`}</strong>
                      <p>
                        {item.nombreCliente} &middot; {money(item.total || 0)}
                      </p>
                      <select
                        className="form-select"
                        value={item.estado}
                        onChange={(e) =>
                          updateStatus(
                            orderService.actualizarEstado(item.id, e.target.value)
                          )
                        }
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="CONFIRMADA">CONFIRMADA</option>
                        <option value="EN_PREPARACION">EN_PREPARACION</option>
                        <option value="ENTREGADA">ENTREGADA</option>
                        <option value="CANCELADA">CANCELADA</option>
                      </select>
                    </>
                  )}

                  {tab === "messages" && (
                    <>
                      <strong>{item.asunto}</strong>
                      <p>
                        {item.nombre} &middot; {item.mensaje}
                      </p>
                      <select
                        className="form-select"
                        value={item.estado}
                        onChange={(e) =>
                          updateStatus(
                            communityService.actualizarEstadoMensaje(
                              item.id,
                              e.target.value
                            )
                          )
                        }
                      >
                        <option value="NUEVO">NUEVO</option>
                        <option value="REVISADO">REVISADO</option>
                      </select>
                    </>
                  )}

                  {tab === "reservations" && (
                    <>
                      <strong>{item.evento?.titulo || "Reserva"}</strong>
                      <p>
                        {item.nombreContacto} &middot; {item.personas} personas
                      </p>
                      <select
                        className="form-select"
                        value={item.estado}
                        onChange={(e) =>
                          updateStatus(
                            communityService.actualizarEstadoReserva(
                              item.id,
                              e.target.value
                            )
                          )
                        }
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="CONFIRMADA">CONFIRMADA</option>
                        <option value="CANCELADA">CANCELADA</option>
                      </select>
                    </>
                  )}
                </article>
              ))}

              {!currentItems.length && <p className="muted">Sin registros.</p>}
            </>
          )}
          {tab === "tournaments" && <section className="mt-4"><h2>Torneos existentes</h2>{data.tournaments.map((tournament) => <article className="panel mb-3" key={tournament.id}><strong>{tournament.title}</strong><p>{tournament.game} · {tournament.date}</p><button className="btn btn-outline-light" type="button" onClick={() => handleDeleteTournament(tournament)}>Eliminar torneo</button></article>)}{!data.tournaments.length && <p className="muted">No hay torneos creados.</p>}</section>}
        </section>
      </div>
    </main>
  );
}

function TournamentForm({ value, onChange, onCreate }) {
  const set = (key, next) => onChange({ ...value, [key]: next });

  return (
    <form
      className="panel"
      onSubmit={(e) => {
        e.preventDefault();
        onCreate();
      }}
    >
      <h2>Crear torneo</h2>
      <p className="muted">El torneo aparecerá inmediatamente en Comunidad.</p>

      <div className="form-grid">
        <label className="field">
          Nombre del torneo:  
          <small> Ejemplo: Level Up Valorant Cup</small>
          <input
            className="form-control"
            value={value.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
        </label>

        <label className="field">
          Juego:  
          <small> Ejemplo: Valorant, Mario Kart o Catan</small>
          <input
            className="form-control"
            value={value.game}
            onChange={(e) => set("game", e.target.value)}
            required
          />
        </label>

        <label className="field">
          Modalidad:  
          <small> Liguilla = todos contra todos; eliminación = cruces por rondas.</small>
          <select
            className="form-select"
            value={value.mode}
            onChange={(e) => set("mode", e.target.value)}
          >
            <option value="LIGUILLA">Liguilla</option>
            <option value="ELIMINACION">Fixture de eliminación</option>
          </select>
        </label>

        <label className="field">
          Máximo de jugadores:  
          <small> Usa un número entre 2 y 32.</small>
          <input
            className="form-control"
            type="number"
            min="2"
            max="32"
            value={value.maxParticipants}
            onChange={(e) => set("maxParticipants", e.target.value)}
            required
          />
        </label>

        <label className="field">
          Fecha:  
          <small> Día en que se realizará el torneo.</small>
          <input
            className="form-control"
            type="date"
            value={value.date}
            onChange={(e) => set("date", e.target.value)}
            required
          />
        </label>

        <label className="field">
          Portada / imagen:  
          <small>
             Nombre de un archivo dentro de public/img, por ejemplo valorant.png.
          </small>
          <input
            className="form-control"
            value={value.image}
            onChange={(e) => set("image", e.target.value)}
            placeholder="valorant.png"
            required
          />
        </label>
      </div>

      <button className="btn btn-lime mt-3">Crear torneo</button>
    </form>
  );
}
