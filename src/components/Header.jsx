import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { db } from "../database";
import { useShop } from "../Store.jsx";

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useShop();
  const location = useLocation();

  React.useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const count = db.list("cart").reduce((s, p) => s + p.quantity, 0);

  return (
    <>
      <div className="topline">
        BUEN CAFÉ. BUENAS PARTIDAS. <span>Envío gratis desde $50.000</span>
      </div>
      <header>
        <div className="container nav-shell">
          <Link to="/" className="brand">
            ☕
            <span>
              LEVEL UP<small>COFFEE & PLAY</small>
            </span>
          </Link>
          <button
            className="icon-button mobile-toggle"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? "✕" : "☰"}
          </button>
          <nav
            className={open ? "navigation open" : "navigation"}
            aria-label="Navegación principal"
          >
            {[
              ["/tienda", "Tienda"],
              ["/menu", "Café & snacks"],
              ["/categorias", "Categorías"],
              ["/ofertas", "Ofertas"],
              ["/eventos", "Comunidad"],
              ["/contacto", "Visítanos"],
            ].map(([to, text]) => (
              <NavLink key={to} to={to}>
                {text}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink to="/perfil">Mi Perfil</NavLink>
                {user.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
                <button className="text-button" onClick={logout}>
                  Salir
                </button>
              </>
            ) : (
              <NavLink to="/login">Ingresar</NavLink>
            )}
          </nav>
          <Link
            to="/carrito"
            className="cart-link"
            aria-label={`Carrito, ${count} productos`}
          >
            🛒
            <span>{count}</span>
          </Link>
        </div>
      </header>
    </>
  );
}