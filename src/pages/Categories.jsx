import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { db } from "../database";
import { PageTitle } from "../components";
import { imageUrl } from "../imageUrl";

export function Categories() {
  const products = db.list("products");
  return (
    <main className="container section">
      <PageTitle title="Un universo por descubrir.">
        Encuentra tu estilo de juego o tu próxima pausa favorita.
      </PageTitle>
      <div className="category-grid">
        {db.list("categories").map((c) => {
          const items = products.filter((p) => p.categoria === c.nombre);
          return (
            <Link
              className="category-box"
              to={`/${items[0]?.tipo === "cafe" ? "menu" : "tienda"}?categoria=${encodeURIComponent(c.nombre)}`}
              key={c.id}
            >
              {items[0] && (
                <img src={imageUrl(items[0].imagen)} alt="" />
              )}
              <div>
                <h2>{c.nombre}</h2>
                <span>
                  {items.length} productos <ArrowUpRight size={18} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}