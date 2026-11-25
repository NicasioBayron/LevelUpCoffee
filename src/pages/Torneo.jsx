
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useParams, Link } from "react-router-dom";

export function Torneo() {
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState("informacion");
const [showRegistration, setShowRegistration] = useState(false);
const [registered, setRegistered] = useState(false);

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

          <button className="btn btn-lime">
            Inscribirme al campeonato
          </button>
        </div>

      </section>

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
