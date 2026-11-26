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
    if (!tournament) return;
    const refreshTournamentState = () => tournamentService.participants(id).then((items) => {
      setParticipants(items);
      const current = user?.id == null ? null : items.find((item) => String(item.usuarioId) === String(user.id));
      setRegistered(Boolean(current));
      if (isAdmin) return tournamentService.matches(id).then(setMatches);
      return null;
    }).catch(() => {});
    refreshTournamentState();
    const refreshTimer = window.setInterval(refreshTournamentState, 5000);
    return () => window.clearInterval(refreshTimer);
  }, [id, isAdmin, tournament, user]);

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
      const updated = await tournamentService.participants(id);
      setParticipants(updated);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  const withdraw = async () => {
    if (!user) return;
    try {
      await tournamentService.withdraw(id, user.id);
      setRegistered(false);
      setNotice("Te retiraste del campeonato.");
      setParticipants(await tournamentService.participants(id));
      if (isAdmin && tournament.modalidad === "ELIMINACION") {
        setMatches(await tournamentService.matches(id));
      }
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
          {registered ? (
            <button className="btn btn-outline-light" onClick={withdraw}>
              Retirarme del campeonato
            </button>
          ) : (
            <button className="btn btn-lime" onClick={register}>
              Inscribirme al campeonato
            </button>
          )}
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
                {tournament.modalidad === "LIGUILLA" ? "Liguilla" : "Fixture"}
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

          {isAdmin && section === "fixture" && tournament.modalidad === "LIGUILLA" && (
            <div className="fixture-section">
              <h2>Tabla de clasificación</h2>
              <p className="fixture-subtitle">La clasificación se actualiza con los resultados de cada enfrentamiento.</p>
              <div className="standings-table-wrap">
                <table className="standings-table">
                  <thead><tr><th>#</th><th>Jugador</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>PTS</th></tr></thead>
                  <tbody>{participants.map((participant, index) => {
                    const name = participant.nombreJugador;
                    const games = matches.filter((match) => match.jugadorUno === name || match.jugadorDos === name);
                    const wins = matches.filter((match) => match.ganador === name).length;
                    const draws = games.filter((match) => match.estado === "EMPATE").length;
                    return <tr key={participant.id}><td>{index + 1}</td><td><strong>{name}</strong></td><td>{games.length}</td><td>{wins}</td><td>{draws}</td><td>{Math.max(games.length - wins - draws, 0)}</td><td><strong>{wins * 3 + draws}</strong></td></tr>;
                  })}</tbody>
                </table>
              </div>
              <h2 className="mt-4">Enfrentamientos</h2>
              {matches.map((m) => <div className="fixture-match" key={m.id}><div className="fixture-player"><strong>{m.jugadorUno}</strong><span className="fixture-score">{m.puntajeUno ?? "-"}</span></div><div className="fixture-vs">VS</div><div className="fixture-player"><strong>{m.jugadorDos}</strong><span className="fixture-score">{m.puntajeDos ?? "-"}</span></div><span className="fixture-result">{m.estado}</span></div>)}
              {!matches.length && <p className="muted">No hay enfrentamientos generados aún.</p>}
            </div>
          )}

          {isAdmin && section === "fixture" && tournament.modalidad === "ELIMINACION" && (
            <div className="fixture-section">
              <h2>Fixture del campeonato</h2>
              <p className="fixture-subtitle">Cuadro de eliminación directa actualizado con los participantes inscritos.</p>
              {Object.entries(matches.reduce((groups, match) => {
                const round = match.ronda || "Primera ronda";
                (groups[round] ||= []).push(match);
                return groups;
              }, {})).map(([round, roundMatches]) => (
                <div className="fixture-round" key={round}>
                  <div className="fixture-round-heading">
                    <h3>{round}</h3>
                    <span>{roundMatches.length} enfrentamientos</span>
                  </div>
                  {roundMatches.map((m) => (
                    <div className={`fixture-match ${m.jugadorUno === "Por definir" || m.jugadorDos === "Por definir" ? "fixture-pending" : ""}`} key={m.id}>
                      <div className="fixture-player"><span className="fixture-avatar">{m.jugadorUno?.slice(0, 1) || "?"}</span><strong>{m.jugadorUno || "Por definir"}</strong><span className="fixture-score">{m.puntajeUno ?? "-"}</span></div>
                      <div className="fixture-vs">VS</div>
                      <div className="fixture-player"><span className="fixture-avatar">{m.jugadorDos?.slice(0, 1) || "?"}</span><strong>{m.jugadorDos || "Por definir"}</strong><span className="fixture-score">{m.puntajeDos ?? "-"}</span></div>
                      <span className="fixture-result">{m.estado}</span>
                    </div>
                  ))}
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
