import React, { useState } from "react";
import { db } from "../database";
import { imageUrl } from "../imageUrl";
import { useShop } from "../Store";
import { PageTitle, Field, ErrorMessage } from "../components";

const events = [
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
  const [selected, setSelected] = useState(""),
    [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    try {
      const f = Object.fromEntries(new FormData(e.currentTarget));
      if (!f.nombre.trim()) throw Error("Ingresa tu nombre.");
      db.create("reservations", {
        ...f,
        event: selected,
        userId: user?.id || null,
        date: new Date().toISOString(),
        status: "Por confirmar",
      });
      setSelected("");
      setNotice(
        "Solicitud guardada. La reserva queda pendiente de confirmación.",
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container section">
      <PageTitle title="Encuentra a tu equipo.">
        Propuestas de encuentros de nuestra comunidad. Solicita una reserva y
        coordinaremos fecha y disponibilidad.
      </PageTitle>
      <div className="events-grid">
        {events.map((e) => (
          <article className="event-card" key={e.id}>
            <img src={imageUrl("/img/" + e.image)} alt={e.title} />
            <div>
              <div className="eyebrow">{e.tag}</div>
              <h2>{e.title}</h2>
              <p>{e.text}</p>
              <small>Fecha y cupos por confirmar</small>
              <button
                className="btn btn-outline-light mt-3"
                onClick={() => {
                  setSelected(e.id);
                  setError("");
                }}
              >
                Solicitar reserva &rarr;
              </button>
            </div>
          </article>
        ))}
      </div>
      {selected && (
        <form className="panel mt-4" onSubmit={submit}>
          <h2>Reserva · {events.find((e) => e.id === selected)?.title}</h2>
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
          <button className="btn btn-lime">Enviar solicitud</button>{" "}
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