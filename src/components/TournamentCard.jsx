
import React from "react";
import { Link } from "react-router-dom";
import { imageUrl } from "../imageUrl";
import { formatTournamentDate } from "../data/tournaments";
import { useGsapReveal } from "../hooks/useGsapReveal";

export function TournamentCard({ tournament }) {
  const cardRef = useGsapReveal({ y: 22, duration: 0.65 });
  const title = tournament.title ?? tournament.titulo;
  const game = tournament.game ?? tournament.juego;
  const image = tournament.image ?? tournament.imagen ?? "valorant.png";
  const registered = tournament.registered ?? tournament.inscripciones?.length ?? 0;
  const maxParticipants = tournament.maxParticipants ?? tournament.maxParticipantes ?? 1;
  const progress = Math.min(
    (registered / maxParticipants) * 100,
    100
  );

  return (
    <article ref={cardRef} className="tournament-card">
      <div className="tournament-card-image">
        <img
          src={imageUrl(image?.startsWith("/") ? image : `/img/${image}`)}
          alt={game}
        />

        <span className="tournament-status">
          {tournament.status ?? tournament.estado}
        </span>
      </div>

      <div className="tournament-card-content">
        <span className="tournament-game">
          {game}
        </span>

        <h2>{title}</h2>

        <p className="tournament-description">
          {tournament.description ?? tournament.descripcion}
        </p>

        <div className="tournament-card-info">
          <span>📅 {formatTournamentDate(tournament.date ?? tournament.fecha)}</span>
          <span>
            👥 {registered} / {maxParticipants} jugadores
          </span>
        </div>

        <div className="tournament-progress">
          <div
            className="tournament-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Link
          to={`/torneo/${tournament.id}`}
          className="tournament-link"
        >
          <span>Ver campeonato</span>
          <span className="tournament-arrow">→</span>
        </Link>
      </div>
    </article>
  );
}
