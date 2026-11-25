import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useShop } from "../Store.jsx";

export function Torneo() {
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState("informacion");
const [showRegistration, setShowRegistration] = useState(false);
const [registered, setRegistered] = useState(false);
const [participantCount, setParticipantCount] = useState(0);
const { user, setNotice } = useShop();

  // Datos de los campeonatos
const tournaments = {
  1: {
    id: 1,
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
  },

  2: {
    id: 2,
    title: "Mario Kart Championship",
    game: "Mario Kart",
    description:
      "Compite en emocionantes carreras, demuestra tu habilidad al volante y conviértete en el campeón de Level Up Coffee.",
    date: "20 de diciembre de 2026",
    maxParticipants: 12,
    registered: 5,
    status: "Inscripciones abiertas",
    prize: "Premio sorpresa",
    modality: "Carreras por rondas",
  },
};

const tournament = tournaments[id];
const sampleParticipants = {
  1: [
    "Shadow",
    "DarkWolf",
    "Phoenix",
    "Nexus",
    "Zero",
    "Viper",
    "Ghost",
    "Reaper",
  ],
  2: [
    "MarioFan",
    "LuigiPro",
    "SpeedKing",
    "YoshiPlayer",
    "ToadRacer",
  ],
};

const participants = [
  ...sampleParticipants[id],
  ...(registered
    ? [user?.nombre || user?.name || "Jugador"]
    : []),
];
React.useEffect(() => {
  if (tournament) {
    setParticipantCount(tournament.registered);
  }
}, [id]);
if (!tournament) {
  return (
    <main className="container section">
      <h2>Campeonato no encontrado</h2>
      <Link to="/eventos" className="tournament-back">
        ← Volver a eventos
      </Link>
    </main>
  );
}

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

    if (participantCount >= tournament.maxParticipants) {
  setNotice("Este campeonato ya está completo.");
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
  setParticipantCount((count) => count + 1);
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
            {participantCount} / {tournament.maxParticipants}
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
                <strong>Inscritos:</strong> {participantCount} jugadores
              </p>

              <p>
                <strong>Premio:</strong> {tournament.prize}
              </p>
            </div>
          )}

          {activeSection === "participantes" && (
  <div className="participants-section">
    <h2>Participantes</h2>

    <p>
      Jugadores inscritos en este campeonato.
    </p>

    <div className="participants-list">
      {participants.map((participant, index) => (
        <div className="participant-card" key={index}>
          <div className="participant-avatar">
            {participant.charAt(0).toUpperCase()}
          </div>

          <div className="participant-details">
            <strong>{participant}</strong>
            <span>Jugador inscrito</span>
          </div>

          <span className="participant-number">
            #{index + 1}
          </span>
        </div>
      ))}
    </div>

    <p className="participants-total">
      {participantCount} / {tournament.maxParticipants} jugadores inscritos
    </p>
  </div>
)}

          {activeSection === "fixture" && (
  <div className="fixture-section">
    <h2>Fixture del campeonato</h2>

    <p className="fixture-subtitle">
      Calendario de enfrentamientos y rondas del campeonato.
    </p>

    {id === "1" ? (
      <>
        <div className="fixture-round">
          <div className="fixture-round-heading">
            <h3>Primera ronda</h3>
            <span>ENFRENTAMIENTOS</span>
          </div>

          <div className="fixture-match">
            <div className="fixture-player">
              <span className="fixture-avatar">S</span>
              <strong>Shadow</strong>
              <span className="fixture-score">13</span>
            </div>
            <div className="fixture-vs">VS</div>
            <div className="fixture-player">
              <span className="fixture-avatar">D</span>
              <strong>DarkWolf</strong>
              <span className="fixture-score">8</span>
            </div>
            <span className="fixture-result">Finalizado</span>
          </div>

          <div className="fixture-match">
            <div className="fixture-player">
              <span className="fixture-avatar">P</span>
              <strong>Phoenix</strong>
              <span className="fixture-score">10</span>
            </div>
            <div className="fixture-vs">VS</div>
            <div className="fixture-player">
              <span className="fixture-avatar">N</span>
              <strong>Nexus</strong>
              <span className="fixture-score">13</span>
            </div>
            <span className="fixture-result">Finalizado</span>
          </div>
        </div>

        <div className="fixture-round">
          <div className="fixture-round-heading">
            <h3>Semifinal</h3>
            <span>PRÓXIMA RONDA</span>
          </div>

          <div className="fixture-match fixture-pending">
            <div className="fixture-player">
              <span className="fixture-avatar">S</span>
              <strong>Shadow</strong>
            </div>
            <div className="fixture-vs">VS</div>
            <div className="fixture-player">
              <span className="fixture-avatar">N</span>
              <strong>Nexus</strong>
            </div>
            <span className="fixture-result">Pendiente</span>
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="fixture-round">
          <div className="fixture-round-heading">
            <h3>Clasificación</h3>
            <span>RESULTADOS DE CARRERA</span>
          </div>

          <div className="fixture-match">
            <div className="fixture-player">
              <span className="fixture-avatar">M</span>
              <strong>MarioFan</strong>
              <span className="fixture-score">1.º</span>
            </div>
            <span className="fixture-result">Clasificado</span>
          </div>

          <div className="fixture-match">
            <div className="fixture-player">
              <span className="fixture-avatar">L</span>
              <strong>LuigiPro</strong>
              <span className="fixture-score">2.º</span>
            </div>
            <span className="fixture-result">Clasificado</span>
          </div>

          <div className="fixture-match">
            <div className="fixture-player">
              <span className="fixture-avatar">Y</span>
              <strong>YoshiPlayer</strong>
              <span className="fixture-score">3.º</span>
            </div>
            <span className="fixture-result">Clasificado</span>
          </div>
        </div>

        <div className="fixture-round">
          <div className="fixture-round-heading">
            <h3>Gran final</h3>
            <span>PRÓXIMA CARRERA</span>
          </div>

          <div className="fixture-match fixture-pending">
            <div className="fixture-player">
              <span className="fixture-avatar">M</span>
              <strong>MarioFan</strong>
            </div>

            <div className="fixture-vs">VS</div>

            <div className="fixture-player">
              <span className="fixture-avatar">L</span>
              <strong>LuigiPro</strong>
            </div>

            <span className="fixture-result">Pendiente</span>
          </div>
        </div>
      </>
    )}
  </div>
)}

        </div>

      </section>

    </main>
  );
}
