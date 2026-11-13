import React from "react";
import { Link } from "react-router-dom";

export function Empty({
  title = "Todavía no hay nada por aquí",
  text = "Explora y encuentra tu juego favorito.",
  to = "/tienda",
  action = "Explorar tienda",
}) {
  return (
    <div className="empty">
      🎮
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="btn btn-lime" to={to}>
        {action} &rarr;
      </Link>
    </div>
  );
}