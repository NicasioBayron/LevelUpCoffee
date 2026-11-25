
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useShop } from "../Store.jsx";

export function Torneo() {
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState("informacion");
const [showRegistration, setShowRegistration] = useState(false);
const [registered, setRegistered] = useState(false);
const { user, setNotice } = useShop();

  // Datos temporales para probar la página
  const tournament = {
    id: id,
    title: "Level Up Valorant Cup",
    game: "Valorant",
    description:
      "Participa en nuestro campeonato, demuestra tus habilidades y compite con otros jugadores de la comunidad Level Up Coffee.",
    date: "15 de diciembre de 2026",
    maxParticipants: 16,
    registered: 8,
    status: "Inscripciones abiertas",
    prize: "Premio sorpresa",
    modality: "Eliminación directa",
  };

  return (
    <main className="container section tournament-detail">

      {/* Botón para volver a eventos */}
      <Link to="/eventos" className="tournament-back">
        ← Volver a eventos
      </Link>

      {/* Encabezado */}
      <section className="tournament-hero">

        <div className="tournament-hero-content">
          <span className="tournament-status">
            {tournament.status}
          </span>

          <h1>{tournament.title}</h1>

          <p>{tournament.description}</p>

          <button
  className="btn btn-lime"
  onClick={() => {
    if (!user) {
      setNotice("Debes iniciar sesión para inscribirte.");
      return;
    }

    if (registered) {
      setNotice("Ya estás inscrito en este campeonato.");
      return;
    }

    setShowRegistration(true);
  }}
>
  Inscribirme al campeonato
</button>
        </div>

      </section>

      {showRegistration && (
  <div className="registration-overlay">
    <div className="registration-modal">
      <button
        className="registration-close"
        onClick={() => setShowRegistration(false)}
      >
        ×
      </button>

      <h2>Inscripción al campeonato</h2>

      <p>
        Estás a punto de inscribirte en:
      </p>

      <h3>{tournament.title}</h3>

      <div className="registration-user">
        <p>
          <strong>Jugador:</strong>{" "}
          {user?.nombre || user?.name || "Usuario"}
        </p>

        <p>
          <strong>Correo:</strong>{" "}
          {user?.email || "Correo de tu cuenta"}
        </p>
      </div>

      <p className="registration-warning">
        Recuerda que al confirmar tu inscripción estarás
        participando oficialmente en este campeonato.
      </p>

      <div className="registration-actions">
        <button
          className="registration-cancel"
          onClick={() => setShowRegistration(false)}
        >
          Cancelar
        </button>

        <button
          className="btn btn-lime"
          onClick={() => {
            setRegistered(true);
            setShowRegistration(false);
            setNotice("¡Tu inscripción fue registrada!");
          }}
        >
          Confirmar inscripción
        </button>
      </div>
    </div>
  </div>
)}

      {/* Información rápida */}
      <section className="tournament-info-grid">

        <article className="tournament-info-card">
          <span>🎮 Juego</span>
          <h3>{tournament.game}</h3>
        </article>

        <article className="tournament-info-card">
          <span>📅 Fecha</span>
          <h3>{tournament.date}</h3>
        </article>

        <article className="tournament-info-card">
          <span>👥 Participantes</span>
          <h3>
            {tournament.registered} / {tournament.maxParticipants}
          </h3>
        </article>

        <article className="tournament-info-card">
          <span>🏆 Premio</span>
          <h3>{tournament.prize}</h3>
        </article>

      </section>

      {/* Navegación interna */}
      <section className="tournament-sections">

        <div className="tournament-tabs">

          <button
            className={activeSection === "informacion" ? "active" : ""}
            onClick={() => setActiveSection("informacion")}
          >
            Información
          </button>

          <button
            className={activeSection === "participantes" ? "active" : ""}
            onClick={() => setActiveSection("participantes")}
          >
            Participantes
          </button>

          <button
            className={activeSection === "fixture" ? "active" : ""}
            onClick={() => setActiveSection("fixture")}
          >
            Fixture
          </button>

        </div>

        <div className="tournament-tab-content">

          {activeSection === "informacion" && (
            <div>
              <h2>Información del campeonato</h2>

              <p>
                <strong>Modalidad:</strong> {tournament.modality}
              </p>

              <p>
                <strong>Fecha:</strong> {tournament.date}
              </p>

              <p>
                <strong>Cupos:</strong> {tournament.maxParticipants} jugadores
              </p>

              <p>
                <strong>Inscritos:</strong> {tournament.registered} jugadores
              </p>

              <p>
                <strong>Premio:</strong> {tournament.prize}
              </p>
            </div>
          )}

          {activeSection === "participantes" && (
            <div>
              <h2>Participantes</h2>

              <p>
                Aquí aparecerá la lista de jugadores inscritos
                en este campeonato.
              </p>
            </div>
          )}

          {activeSection === "fixture" && (
            <div>
              <h2>Fixture del campeonato</h2>

              <p>
                Aquí aparecerán las rondas y enfrentamientos
                del torneo.
              </p>
            </div>
          )}

        </div>

      </section>

    </main>
  );
}
