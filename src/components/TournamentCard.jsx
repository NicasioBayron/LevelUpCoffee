
import React from "react";
import { Link } from "react-router-dom";
import { imageUrl } from "../imageUrl";
import { formatTournamentDate } from "../data/tournaments";

export function TournamentCard({ tournament }) {
  const progress = Math.min(
    (tournament.registered / tournament.maxParticipants) * 100,
    100
  );

  return (
    <article className="tournament-card">
      <div className="tournament-card-image">
        <img
          src={imageUrl(tournament.image?.startsWith("/") ? tournament.image : `/img/${tournament.image}`)}
          alt={tournament.game}
        />

        <span className="tournament-status">
          {tournament.status}
        </span>
      </div>

      <div className="tournament-card-content">
        <span className="tournament-game">
          {tournament.game}
        </span>

        <h2>{tournament.title}</h2>

        <p className="tournament-description">
          {tournament.description}
        </p>

        <div className="tournament-card-info">
          <span>📅 {formatTournamentDate(tournament.date)}</span>
          <span>
            👥 {tournament.registered} / {tournament.maxParticipants} jugadores
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
