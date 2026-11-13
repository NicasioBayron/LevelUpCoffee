import React from "react";
import { Link } from "react-router-dom";
import { imageUrl } from "../imageUrl";
import { money, price } from "../database";
import { useShop } from "../store";

export function ProductCard({ product: p }) {
  const { add } = useShop();
  return (
    <article className="product-card">
      <Link to={"/producto/" + p.id} className="product-image">
        <img src={imageUrl(p.imagen)} alt={p.nombre} loading="lazy" />
        {p.descuento > 0 && <span className="discount">−{p.descuento}%</span>}
        <span className="image-arrow">&rarr;</span>
      </Link>
      <div className="product-info">
        <span className="eyebrow">{p.categoria}</span>
        <Link className="product-name" to={"/producto/" + p.id}>
          {p.nombre}
        </Link>
        <div className="product-bottom">
          <div>
            <strong>{money(price(p))}</strong>
            {p.descuento > 0 && <del>{money(p.precio)}</del>}
          </div>
          <button
            className="add-button"
            aria-label={"Añadir " + p.nombre}
            onClick={() => add(p)}
            disabled={!p.stock}
          >
            {p.stock ? "+" : "Agotado"}
          </button>
        </div>
      </div>
    </article>
  );
}