import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useShop } from "../Store.jsx";
import { tournamentService } from "../api/services";
import { formatTournamentDate, getTournaments } from "../data/tournaments";
import { ErrorMessage } from "../components";

export function Torneo() {
  const { id } = useParams();
  const { user, setNotice } = useShop();
  const isAdmin = user?.rol === "ADMIN" || user?.role === "admin";
  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [section, setSection] = useState("info");
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    tournamentService
      .getById(id)
      .then((data) => {
        setTournament({
          ...data,
          titulo: data.titulo || data.title,
          juego: data.juego || data.game,
          descripcion: data.descripcion || data.description,
          fecha: data.fecha || data.date,
          maxParticipantes: data.maxParticipantes || data.maxParticipants,
          estado: data.estado || data.status,
          premio: data.premio || "Premio sorpresa",
          modalidad: data.modalidad || "LIGUILLA",
        });
      })
      .catch(() => {
        const fallback = getTournaments().find((t) => String(t.id) === String(id));
        if (fallback) {
          setTournament({
            ...fallback,
            titulo: fallback.title,
            juego: fallback.game,
            descripcion: fallback.description,
            fecha: fallback.date,
            maxParticipantes: fallback.maxParticipants,
            estado: fallback.status,
            premio: fallback.prize || "Premio sorpresa",
            modalidad: fallback.mode || "LIGUILLA",
          });
        } else {
          setError("No se pudo cargar la información del campeonato.");
        }
      });
  }, [id]);

  useEffect(() => {
    if (isAdmin && tournament) {
      tournamentService.participants(id).then(setParticipants).catch(() => {});
      tournamentService.matches(id).then(setMatches).catch(() => {});
    }
  }, [id, isAdmin, tournament]);

  if (error && !tournament) {
    return (
      <main className="container section">
        <ErrorMessage message={error} />
        <Link to="/eventos" className="tournament-back">← Volver a eventos</Link>
      </main>
    );
  }

  if (!tournament) {
    return (
      <main className="container section">
        <p role="status">Cargando torneo…</p>
      </main>
    );
  }

  const register = async () => {
    if (!user) return setNotice("Debes iniciar sesión para inscribirte.");
    try {
      await tournamentService.register(id, {
        usuarioId: user.id,
        nombreJugador: user.nombre || user.name || "Jugador",
        correoJugador: user.correo || user.email,
      });
      setRegistered(true);
      setNotice("¡Tu inscripción fue registrada!");
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  return (
    <main className="container section tournament-detail">
      <Link to="/eventos" className="tournament-back">← Volver a eventos</Link>
      
      <section className="tournament-hero">
        <div className="tournament-hero-content">
          <span className="tournament-status">{tournament.estado}</span>
          <h1>{tournament.titulo}</h1>
          <p>{tournament.descripcion}</p>
          <button className="btn btn-lime" onClick={register} disabled={registered}>
            {registered ? "Inscrito" : "Inscribirme al campeonato"}
          </button>
        </div>
      </section>

      <section className="tournament-info-grid">
        <article className="tournament-info-card">
          <span>🎮 Juego</span>
          <h3>{tournament.juego}</h3>
        </article>
        <article className="tournament-info-card">
          <span>📅 Fecha</span>
          <h3>{formatTournamentDate(tournament.fecha)}</h3>
        </article>
        <article className="tournament-info-card">
          <span>👥 Participantes</span>
          <h3>{tournament.inscripciones?.length || participants.length || tournament.registered || 0} / {tournament.maxParticipantes}</h3>
        </article>
        <article className="tournament-info-card">
          <span>🏆 Premio</span>
          <h3>{tournament.premio}</h3>
        </article>
      </section>

      <section className="tournament-sections">
        <div className="tournament-tabs">
          <button className={section === "info" ? "active" : ""} onClick={() => setSection("info")}>
            Información
          </button>
          {isAdmin && (
            <>
              <button className={section === "participants" ? "active" : ""} onClick={() => setSection("participants")}>
                Participantes
              </button>
              <button className={section === "fixture" ? "active" : ""} onClick={() => setSection("fixture")}>
                Fixture
              </button>
            </>
          )}
        </div>

        <div className="tournament-tab-content">
          {section === "info" && (
            <div>
              <h2>Información del campeonato</h2>
              <p><strong>Modalidad:</strong> {tournament.modalidad}</p>
              <p><strong>Fecha:</strong> {formatTournamentDate(tournament.fecha)}</p>
              <p><strong>Cupos:</strong> {tournament.maxParticipantes} jugadores</p>
              <p><strong>Premio:</strong> {tournament.premio}</p>
            </div>
          )}

          {isAdmin && section === "participants" && (
            <div className="participants-section">
              <h2>Participantes</h2>
              {participants.map((p) => (
                <div className="participant-card" key={p.id}>
                  <strong>{p.nombreJugador}</strong>
                  <span>{p.correoJugador}</span>
                </div>
              ))}
              {!participants.length && <p className="muted">No hay jugadores inscritos aún.</p>}
            </div>
          )}

          {isAdmin && section === "fixture" && (
            <div className="fixture-section">
              <h2>Fixture del campeonato</h2>
              {matches.map((m) => (
                <div className="fixture-match" key={m.id}>
                  <div className="fixture-player">
                    <strong>{m.jugadorUno}</strong>
                    <span>{m.puntajeUno ?? "-"}</span>
                  </div>
                  <div className="fixture-vs">VS</div>
                  <div className="fixture-player">
                    <strong>{m.jugadorDos}</strong>
                    <span>{m.puntajeDos ?? "-"}</span>
                  </div>
                  <span className="fixture-result">{m.estado}</span>
                </div>
              ))}
              {!matches.length && <p className="muted">No hay partidas generadas aún.</p>}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
