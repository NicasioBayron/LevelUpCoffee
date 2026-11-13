import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useShop } from "./Store.jsx";
import { Header, Footer, Empty } from "./components";
import {
  Home,
  Catalog,
  Categories,
  Detail,
  Cart,
  Checkout,
  PaymentResult,
  Auth,
  Profile,
  Events,
  Contact,
  Terms,
} from "./pages";
import { Admin } from "./pages/admin";
import { About, Blog } from "./pages";

export function App() {
  const { notice } = useShop();
  
  return (
    <>
      <a
        className="skip-link"
        href="#content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("content").focus();
          document.getElementById("content").scrollIntoView();
        }}
      >
        Saltar al contenido
      </a>
      <Header />
      <div id="content" tabIndex="-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<Catalog />} />
          <Route path="/menu" element={<Catalog mode="menu" />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/ofertas" element={<Catalog mode="ofertas" />} />
          <Route path="/producto/:id" element={<Detail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/compra-exitosa/:id" element={<PaymentResult />} />
          <Route path="/pago-error" element={<PaymentResult failed />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/registro" element={<Auth register />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/admin" element={<Admin />} />
          
          <Route
            path="*"
            element={
              <main className="container section">
                <Empty
                  title="Esta ruta aún no tiene partida"
                  to="/"
                  action="Volver al inicio"
                />
              </main>
            }
          />
        </Routes>
      </div>
      <Footer />
      {notice && (
        <div className="toast-message" role="status">
          {notice}
        </div>
      )}
    </>
  );
}