import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db, money, price } from "../database";
import { imageUrl } from "../imageUrl";
import { useShop } from "../Store";
import { Empty, Quantity, ProductCard } from "../components";

export function Detail() {
  const { id } = useParams(),
    p = db.get("products", id);
  const [quantity, setQuantity] = useState(1);
  const { add } = useShop();

  if (!p)
    return (
      <main className="container section">
        <Empty title="Producto no encontrado" />
      </main>
    );

  return (
    <main className="container section">
      <Link to={p.tipo === "cafe" ? "/menu" : "/tienda"} className="muted">
        ← Volver al catálogo
      </Link>
      <div className="detail-grid">
        <div className="detail-image">
          <img src={imageUrl(p.imagen)} alt={p.nombre} />
        </div>
        <div>
          <div className="eyebrow">{p.categoria} / LEVEL UP</div>
          <h1>{p.nombre}</h1>
          <p className="detail-price">
            {money(price(p))} {p.descuento > 0 && <del>{money(p.precio)}</del>}
          </p>
          <p>{p.descripcion}</p>
          <p className={p.stock ? "stock" : "text-danger"}>
            {p.stock
              ? `${p.stock} disponibles · Listos para tu próxima partida`
              : "Agotado por ahora"}
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Quantity value={quantity} onChange={setQuantity} max={p.stock} />
            <button
              className="btn btn-lime"
              disabled={!p.stock}
              onClick={() => add(p, quantity)}
            >
              Añadir al carrito &rarr;
            </button>
          </div>
          <div className="detail-notes">
            <p>🚚 Envío $3.990 · Gratis desde $50.000</p>
            <p>☕ Retiro gratis en cafetería</p>
            <small>Imágenes referenciales.</small>
          </div>
        </div>
      </div>
      <h2>También te puede gustar</h2>
      <div className="product-grid mt-4">
        {db
          .list("products")
          .filter((x) => x.tipo === p.tipo && x.id !== p.id)
          .slice(0, 4)
          .map((x) => (
            <ProductCard key={x.id} product={x} />
          ))}
      </div>
    </main>
  );
}