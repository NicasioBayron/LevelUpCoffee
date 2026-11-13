import React from "react";
import { Link } from "react-router-dom";
import { branches, openingHours } from "../locations";

export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="brand" to="/">
              ☕
              <span>
                LEVEL UP<small>COFFEE & PLAY</small>
              </span>
            </Link>
            <p>
              Tu próxima partida empieza aquí.
              <br />
              Café, juegos y una buena compañía.
            </p>
          </div>
          <div>
            <b>Explora</b>
            <Link to="/tienda">Tienda de juegos</Link>
            <Link to="/menu">Nuestra cafetería</Link>
            <Link to="/eventos">Comunidad & eventos</Link>
            <Link to="/nosotros">Nosotros</Link>
            <Link to="/blog">Blog</Link>
          </div>
          <div>
            <b>Estamos para ayudarte</b>
            <Link to="/contacto">Sucursales y contacto</Link>
            {branches.map((branch) => (
              <a
                key={branch.id}
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {branch.address}
              </a>
            ))}
            <p>Atención de {openingHours}</p>
            <Link to="/perfil">Mis compras</Link>
            <Link to="/terminos">Términos y privacidad</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Level Up Coffee Bar</span>
          <span>Proyecto académico · Compras simuladas</span>
        </div>
      </div>
    </footer>
  );
}