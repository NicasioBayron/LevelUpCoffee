import React from "react";
import { branches, openingHours } from "../locations";

export function Locations() {
  return (
    <section className="locations-section" aria-labelledby="locations-title">
      <div className="section-heading">
        <div>
          <div className="eyebrow">NOS VEMOS EN LA MESA</div>
          <h2 id="locations-title">Ven a visitarnos.</h2>
          <p className="muted mt-3 mb-0">
            También somos una tienda física: descubre nuestros juegos, toma un
            café y comparte una partida en cualquiera de nuestras sucursales.
          </p>
        </div>
      </div>
      <p className="location-hours">
        🕒 Horario de atención: {openingHours}
      </p>
      <div className="locations-grid">
        {branches.map((branch) => (
          <article className="location-card" key={branch.id}>
            <div className="location-info">
              <div className="eyebrow">LEVEL UP / TIENDA & CAFETERÍA</div>
              <h3>{branch.name}</h3>
              <address>
                <p>
                  📍 <span>{branch.address}</span>
                </p>
                <a href={`tel:${branch.tel}`}>
                  📞 {branch.phone}
                </a>
              </address>
              <a
                className="btn btn-lime"
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Cómo llegar &rarr;
              </a>
            </div>
            <iframe
              title={`Mapa de ${branch.name}: ${branch.address}`}
              src={branch.mapEmbed}
              width="600"
              height="340"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </article>
        ))}
      </div>
      <p className="muted mt-3">
        Si el mapa no carga, usa “Cómo llegar” para abrir la ubicación en Google
        Maps.
      </p>
    </section>
  );
}