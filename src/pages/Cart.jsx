import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db, money, price } from "../database";
import { productService } from "../api/services";
import { migrateCartProductIds } from "../api/cart";
import { imageUrl } from "../imageUrl";
import { useShop } from "../Store.jsx";
import { PageTitle, Empty, ErrorMessage, Quantity } from "../components";

export function Cart() {
  const { setNotice } = useShop();
  const lines = db.list("cart");
  const hasLines = lines.length > 0;
  const cartKey = lines.map((line) => line.id).join(",");
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState({
    key: "",
    products: [],
    error: "",
  });
  const requestKey = `${cartKey}:${retry}`;
  const loading = result.key !== requestKey;
  const error = loading ? "" : result.error;
  const products = loading || error ? [] : result.products;
  const items = lines.map((line) => ({
    ...line,
    product: products.find((product) => String(product.id) === String(line.id)),
  }));
  const total = items.reduce(
    (sum, line) =>
      sum +
      (line.product ? price(line.product) * line.quantity : 0),
    0,
  );
  const canCheckout =
    !loading &&
    !error &&
    items.length > 0 &&
    items.every(
      (line) =>
        line.product &&
        Number.isInteger(line.quantity) &&
        line.quantity > 0 &&
        line.quantity <= line.product.stock,
    );

  useEffect(() => {
    if (!hasLines) return undefined;
    let active = true;
    productService
      .getAll()
      .then((products) => {
        if (active) {
          migrateCartProductIds(products);
          setResult({ key: requestKey, products, error: "" });
        }
      })
      .catch((requestError) => {
        if (active) {
          setResult({
            key: requestKey,
            products: [],
            error:
              requestError.response?.data?.message ||
              requestError.message ||
              "Error desconocido.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [cartKey, hasLines, requestKey]);

  function change(id, quantity) {
    try {
      db.setCart(lines.map((line) => (line.id === id ? { ...line, quantity } : line)));
    } catch (error) {
      setNotice(error.message);
    }
  }

  function remove(id) {
    try {
      db.setCart(lines.filter((line) => line.id !== id));
    } catch (error) {
      setNotice(error.message);
    }
  }

  return (
    <main className="container section">
      <PageTitle title="Tu próximo buen momento.">
        Revisa tu selección antes de continuar.
      </PageTitle>

      {loading && lines.length > 0 ? (
        <p role="status">Actualizando productos y stock…</p>
      ) : error ? (
        <>
          <ErrorMessage
            message={`No se pudo actualizar el carrito: ${error}`}
          />
          <button
            className="btn btn-lime"
            onClick={() => setRetry((attempt) => attempt + 1)}
          >
            Reintentar
          </button>
        </>
      ) : !lines.length ? (
        <Empty title="Tu carrito está esperando una aventura" />
      ) : (
        <div className="checkout-grid">
          <div>
            {items.map((line) => (
              <article className="cart-row" key={line.id}>
                {line.product ? (
                  <>
                    <Link to={"/producto/" + line.product.id}>
                      <img
                        src={imageUrl(line.product.imagen)}
                        alt={line.product.nombre}
                      />
                    </Link>
                    <div className="flex-grow-1">
                      <small className="eyebrow">
                        {line.product.categoria}
                      </small>
                      <h3>
                        <Link to={"/producto/" + line.product.id}>
                          {line.product.nombre}
                        </Link>
                      </h3>
                      <p>{money(price(line.product))}</p>
                      {line.quantity > line.product.stock && (
                        <p className="text-danger">
                          Stock actual: {line.product.stock}. Ajusta la cantidad.
                        </p>
                      )}
                      <Quantity
                        value={line.quantity}
                        onChange={(quantity) => change(line.id, quantity)}
                        max={line.product.stock}
                      />
                    </div>
                    <strong>
                      {money(price(line.product) * line.quantity)}
                    </strong>
                  </>
                ) : (
                  <p>Este producto ya no está disponible en el backend.</p>
                )}
                <button
                  className="icon-button"
                  aria-label="Eliminar del carrito"
                  onClick={() => remove(line.id)}
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
            <Link
              className={`btn btn-lime w-100${canCheckout ? "" : " disabled"}`}
              to={canCheckout ? "/checkout" : "#"}
              aria-disabled={!canCheckout}
              onClick={(event) => {
                if (!canCheckout) event.preventDefault();
              }}
            >
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
