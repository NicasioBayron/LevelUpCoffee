import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { db, price } from "../database";
import { PageTitle, ProductCard, Empty } from "../components";

export function Catalog({ mode = "tienda" }) {
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState("nombre");
  const query = params.get("q") || "",
    category = params.get("categoria") || "";
    
  let products = db
    .list("products")
    .filter((p) =>
      mode === "ofertas"
        ? p.descuento > 0
        : mode === "menu"
          ? p.tipo === "cafe"
          : p.tipo === "juego",
    );
    
  const categories = [...new Set(products.map((p) => p.categoria))];
  
  products = products.filter(
    (p) =>
      (!category || p.categoria === category) &&
      `${p.nombre} ${p.descripcion}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  
  products.sort((a, b) =>
    sort === "menor"
      ? price(a) - price(b)
      : sort === "mayor"
        ? price(b) - price(a)
        : a.nombre.localeCompare(b.nombre),
  );
  
  function filter(k, v) {
    const next = new URLSearchParams(params);
    v ? next.set(k, v) : next.delete(k);
    setParams(next, { replace: true });
  }

  return (
    <main className="container section">
      <PageTitle
        title={
          mode === "menu"
            ? "Recarga tu energía."
            : mode === "ofertas"
              ? "Más juego. Menos precio."
              : "Tu próxima gran partida."
        }
      >
        {mode === "menu"
          ? "Café de especialidad, pociones y algo rico para compartir."
          : "Encuentra algo nuevo para llevar a tu mesa."}
      </PageTitle>
      
      <div className="catalog-toolbar">
        <label className="search">
          <Search size={18} />
          <input
            aria-label="Buscar productos"
            placeholder="Busca tu próximo favorito…"
            value={query}
            onChange={(e) => filter("q", e.target.value)}
          />
        </label>
        <label>
          Ordenar{" "}
          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="nombre">Nombre A–Z</option>
            <option value="menor">Menor precio</option>
            <option value="mayor">Mayor precio</option>
          </select>
        </label>
      </div>
      
      <div className="filter-chips">
        <button
          className={!category ? "selected" : ""}
          onClick={() => filter("categoria", "")}
        >
          Todos
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={category === c ? "selected" : ""}
            onClick={() => filter("categoria", c)}
          >
            {c}
          </button>
        ))}
      </div>
      
      <p className="muted">{products.length} productos encontrados</p>
      
      {products.length ? (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <Empty
          title="No encontramos coincidencias"
          text="Intenta con otro nombre o categoría."
          to={"/" + mode}
          action="Limpiar búsqueda"
        />
      )}
    </main>
  );
}