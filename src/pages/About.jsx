import React from "react";
import { Link } from "react-router-dom";
import { imageUrl } from "../imageUrl";
import { PageTitle } from "../components";

export function About() {
  return (
    <main className="container section">
      <PageTitle eyebrow="NUESTRA HISTORIA" title="Un lugar para jugar juntos.">
        Todo gran juego comienza con el botón de Start.
      </PageTitle>
      <div className="community-banner" style={{ width: "100%", margin: 0 }}>
        <img
          src={imageUrl("/img/nosotros1.png")}
          alt="Espacio de encuentro Level Up"
        />
        <div>
          <h2>El siguiente nivel es compartir.</h2>
          <p>
            Esta idea nace para reunir a quienes disfrutan los videojuegos, la
            buena comida y las partidas con amigos. Queremos que cada visita se
            sienta como una nueva partida: cómoda, entretenida y lista para
            compartir.
          </p>
          <Link className="btn btn-lime" to="/contacto">
            Conversemos &rarr;
          </Link>
        </div>
      </div>
      <section className="section prose">
        <h2>Cooperativo por naturaleza</h2>
        <p>
          Creemos en las mesas donde todos tienen un lugar. Puedes venir por tu
          café favorito, descubrir un juego de mesa o proponer una actividad
          para tu comunidad.
        </p>
        <Link to="/eventos">Descubre nuestros encuentros &rarr;</Link>
      </section>
    </main>
  );
}