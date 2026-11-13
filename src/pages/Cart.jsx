import React from "react";
import { Link } from "react-router-dom";
import { db, money, price } from "../database";
import { imageUrl } from "../imageUrl";
import { useShop } from "../Store.jsx";
import { PageTitle, Empty, Quantity } from "../components";

export function Cart() {
  const { setNotice } = useShop();
  const lines = db.list("cart"),
    products = db.list("products");

  const items = lines.map((l) => ({
    ...l,
    product: products.find((p) => p.id === l.id),
  }));

  const total = items.reduce(
    (s, l) => s + (l.product ? price(l.product) * l.quantity : 0),
    0,
  );

  function change(id, quantity) {
    try {
      db.setCart(lines.map((l) => (l.id === id ? { ...l, quantity } : l)));
    } catch (e) {
      setNotice(e.message);
    }
  }

  return (
    <main className="container section">
      <PageTitle title="Tu próximo buen momento.">
        Revisa tu selección antes de continuar.
      </PageTitle>

      {!lines.length ? (
        <Empty title="Tu carrito está esperando una aventura" />
      ) : (
        <div className="checkout-grid">
          <div>
            {items.map((l) => (
              <article className="cart-row" key={l.id}>
                {l.product ? (
                  <>
                    <Link to={"/producto/" + l.id}>
                      <img
                        src={imageUrl(l.product.imagen)}
                        alt={l.product.nombre}
                      />
                    </Link>
                    <div className="flex-grow-1">
                      <small className="eyebrow">{l.product.categoria}</small>
                      <h3>
                        <Link to={"/producto/" + l.id}>{l.product.nombre}</Link>
                      </h3>
                      <p>{money(price(l.product))}</p>
                      {l.quantity > l.product.stock && (
                        <p className="text-danger">
                          Stock actual: {l.product.stock}. Ajusta la cantidad.
                        </p>
                      )}
                      <Quantity
                        value={l.quantity}
                        onChange={(q) => change(l.id, q)}
                        max={l.product.stock}
                      />
                    </div>
                    <strong>{money(price(l.product) * l.quantity)}</strong>
                  </>
                ) : (
                  <p>Este producto ya no está disponible.</p>
                )}
                <button
                  className="icon-button"
                  aria-label="Eliminar del carrito"
                  onClick={() => {
                    try {
                      db.setCart(lines.filter((x) => x.id !== l.id));
                    } catch (e) {
                      setNotice(e.message);
                    }
                  }}
                >
                  🗑️
                </button>
              </article>
            ))}
            <Link to="/tienda" className="d-inline-block mt-4">
              ← Seguir explorando
            </Link>
          </div>
          <aside className="summary">
            <h2>Resumen de tu pedido</h2>
            <p>
              <span>Subtotal</span>
              <strong>{money(total)}</strong>
            </p>
            <p>
              <span>Entrega</span>
              <span>En el siguiente paso</span>
            </p>
            <hr />
            <p>
              <b>Total de productos</b>
              <strong>{money(total)}</strong>
            </p>
            <Link className="btn btn-lime w-100" to="/checkout">
              Continuar al checkout &rarr;
            </Link>
            <small>
              Retiro gratis o despacho por $3.990.
              <br />
              Envío gratis desde $50.000.
            </small>
          </aside>
        </div>
      )}
    </main>
  );
}