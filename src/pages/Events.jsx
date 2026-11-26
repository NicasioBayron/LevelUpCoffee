
import React, { useState, useEffect } from "react";
import { communityService } from "../api/services";
import { imageUrl } from "../imageUrl";
import { useShop } from "../Store.jsx";
import { PageTitle, Field, ErrorMessage } from "../components";
import { TournamentCard } from "../components/TournamentCard";
import { getTournaments } from "../data/tournaments";

const fallbackEvents = [
  {
    id: "mesa",
    title: "Noche de juegos de mesa",
    image: "catan.png",
    tag: "ESTRATEGIA & AMIGOS",
    text: "Aprende un juego nuevo o trae tu favorito. Hay lugar para todos.",
  },
  {
    id: "tcg",
    title: "Encuentro Pokémon TCG",
    image: "cartaspokemon.png",
    tag: "CARTAS & COMUNIDAD",
    text: "Comparte tu colección y encuentra a tu próximo rival.",
  },
  {
    id: "coop",
    title: "Tarde de cooperativos",
    image: "overcooked.png",
    tag: "UN EQUIPO, UNA MISIÓN",
    text: "Reúne a tu grupo y enfrenten juntos un nuevo desafío.",
  },
];

export function Events() {
  const { user, setNotice } = useShop();

  const [selected, setSelected] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tournaments, setTournaments] = useState(getTournaments());

  useEffect(() => {
    const refresh = () => setTournaments(getTournaments());

    window.addEventListener("levelup:tournaments-updated", refresh);

    return () =>
      window.removeEventListener("levelup:tournaments-updated", refresh);
  }, []);

  useEffect(() => {
    communityService.getEventos()
      .then((data) => {
        console.log("EVENTOS RECIBIDOS:", data);

        setEvents(
          data.map((event) => ({
            ...event,
            title: event.titulo,
            text: event.descripcion,
            image: event.imagen || "catan.png",
            tag: "COMUNIDAD LEVEL UP",
          }))
        );
      })
      .catch(() => setEvents(fallbackEvents))
      .finally(() => setLoading(false));
  }, []);

  async function submit(e) {
    e.preventDefault();

    try {
      const f = Object.fromEntries(new FormData(e.currentTarget));

      if (!f.nombre.trim()) throw Error("Ingresa tu nombre.");

      await communityService.crearReserva({
        eventoId: selected.id,
        usuarioId: user?.id || null,
        nombreContacto: f.nombre,
        correoContacto: f.correo,
        personas: Number(f.personas),
      });

      setSelected(null);

      setNotice(
        "Solicitud guardada. La reserva queda pendiente de confirmación."
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container section">

      {/* CAMPEONATOS */}
      <section className="tournaments-section">
        <div className="tournaments-heading">
          <span className="eyebrow">COMPETENCIA LEVEL UP</span>

          <h2>Campeonatos</h2>

          <p>
            Participa en nuestros torneos, enfrenta nuevos desafíos
            y demuestra tus habilidades.
          </p>
        </div>

        <div className="tournaments-grid">
          {tournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
            />
          ))}
        </div>
      </section>

      {/* EVENTOS DE LA COMUNIDAD */}
      <PageTitle title="Encuentra a tu equipo.">
        Propuestas de encuentros de nuestra comunidad. Solicita una reserva y
        coordinaremos fecha y disponibilidad.
      </PageTitle>

      {loading ? (
        <p role="status">Cargando eventos…</p>
      ) : (
        <div className="events-grid">
          {events.map((e) => (
            <article className="event-card" key={e.id}>
              <img
                src={imageUrl(
                  e.image.startsWith("/")
                    ? e.image
                    : "/img/" + e.image
                )}
                alt={e.title}
              />

              <div>
                <div className="eyebrow">{e.tag}</div>

                <h2>{e.title}</h2>

                <p>{e.text}</p>

                <small>Fecha y cupos por confirmar</small>

                <button
                  className="btn btn-outline-light mt-3"
                  onClick={() => {
                    setSelected(e);
                    setError("");
                  }}
                >
                  Solicitar reserva &rarr;
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* FORMULARIO DE RESERVA AL FINAL */}
      {selected && (
        <form className="panel mt-4" onSubmit={submit}>
          <h2>Reserva · {selected.titulo || selected.title}</h2>

          <div className="form-grid">
            <Field
              label="Tu nombre"
              name="nombre"
              defaultValue={user?.nombre}
            />

            <Field
              label="Correo"
              name="correo"
              type="email"
              defaultValue={user?.correo}
            />

            <Field
              label="Personas"
              name="personas"
              type="number"
              min="1"
              max="12"
              defaultValue="2"
            />
          </div>

          <ErrorMessage message={error} />

          <button className="btn btn-lime">
            Enviar solicitud
          </button>

          <button
            type="button"
            className="btn btn-outline-light"
            onClick={() => setSelected("")}
          >
            Cancelar
          </button>
        </form>
      )}

    </main>
  );
}


